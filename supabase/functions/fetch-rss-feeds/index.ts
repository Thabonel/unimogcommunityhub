import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { parseFeed } from 'https://deno.land/x/rss@0.5.8/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
}

interface FeedItem {
  title: string
  description?: string
  link: string
  pubDate?: Date
  author?: string
  guid?: string
  content?: string
  categories?: string[]
  enclosures?: Array<{
    url: string
    type?: string
  }>
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // Get active RSS feeds that need updating
    const { data: feeds, error: feedsError } = await supabaseAdmin
      .from('rss_feeds')
      .select('*')
      .eq('is_active', true)
      .or(`last_fetched_at.is.null,last_fetched_at.lt.${new Date(Date.now() - 60 * 60 * 1000).toISOString()}`)

    if (feedsError) {
      throw new Error(`Failed to fetch feeds: ${feedsError.message}`)
    }

    console.log(`Processing ${feeds?.length || 0} feeds`)

    const results = []

    // Process each feed
    for (const feed of feeds || []) {
      try {
        console.log(`Fetching feed: ${feed.name} from ${feed.feed_url}`)
        
        // Fetch RSS feed
        const response = await fetch(feed.feed_url, {
          headers: {
            'User-Agent': 'UnimogCommunityHub/1.0',
            'Accept': 'application/rss+xml, application/xml, text/xml, */*',
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const feedText = await response.text()
        const parsedFeed = await parseFeed(feedText)

        if (!parsedFeed.entries) {
          console.log('No entries found in feed')
          continue
        }

        console.log(`Found ${parsedFeed.entries.length} entries`)

        // Process each entry
        let newItemsCount = 0
        for (const entry of parsedFeed.entries) {
          // Check if item already exists
          const { data: existing } = await supabaseAdmin
            .from('aggregated_content')
            .select('id')
            .eq('url', entry.links?.[0]?.href || entry.id || '')
            .single()

          if (existing) {
            continue // Skip if already exists
          }

          // Extract image from content or enclosures
          let featuredImage = null
          if (entry.attachments?.length > 0) {
            featuredImage = entry.attachments[0].url
          } else if (entry['media:content']?.url) {
            featuredImage = entry['media:content'].url
          } else if (entry.content?.value) {
            // Try to extract image from HTML content
            const imgMatch = entry.content.value.match(/<img[^>]+src="([^"]+)"/)
            if (imgMatch) {
              featuredImage = imgMatch[1]
            }
          }

          // Extract location data from content if possible
          const locationData = extractLocationFromContent(
            entry.title?.value || '',
            entry.summary?.value || entry.content?.value || ''
          )

          // Insert new content
          const { error: insertError } = await supabaseAdmin
            .from('aggregated_content')
            .insert({
              feed_id: feed.id,
              title: entry.title?.value || 'Untitled',
              description: entry.summary?.value || entry.content?.value?.substring(0, 500),
              content: entry.content?.value,
              author: entry.authors?.[0]?.name || entry['dc:creator'] || feed.name,
              published_at: entry.published || entry.updated || new Date().toISOString(),
              url: entry.links?.[0]?.href || entry.id || '',
              guid: entry.id,
              category: feed.category,
              tags: extractTags(entry.categories || [], entry.title?.value || '', entry.content?.value || ''),
              featured_image_url: featuredImage,
              ...locationData,
            })

          if (insertError) {
            console.error(`Failed to insert entry: ${insertError.message}`)
          } else {
            newItemsCount++
          }
        }

        // Update feed last fetched time
        await supabaseAdmin
          .from('rss_feeds')
          .update({
            last_fetched_at: new Date().toISOString(),
            last_error: null,
            error_count: 0,
          })
          .eq('id', feed.id)

        results.push({
          feed: feed.name,
          status: 'success',
          newItems: newItemsCount,
        })

      } catch (feedError) {
        console.error(`Error processing feed ${feed.name}:`, feedError)
        
        // Update feed error status
        await supabaseAdmin
          .from('rss_feeds')
          .update({
            last_error: feedError.message,
            error_count: (feed.error_count || 0) + 1,
            is_active: (feed.error_count || 0) >= 5 ? false : true, // Disable after 5 consecutive errors
          })
          .eq('id', feed.id)

        results.push({
          feed: feed.name,
          status: 'error',
          error: feedError.message,
        })
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        results,
        summary: {
          total: results.length,
          successful: results.filter(r => r.status === 'success').length,
          failed: results.filter(r => r.status === 'error').length,
        },
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Edge function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

// Helper function to extract tags from content
function extractTags(categories: string[], title: string, content: string): string[] {
  const tags = new Set<string>()
  
  // Add categories as tags
  categories.forEach(cat => tags.add(cat.toLowerCase()))
  
  // Extract common trail/route related keywords
  const keywords = [
    'unimog', 'trail', 'route', 'track', '4x4', 'offroad', 'off-road',
    'expedition', 'overland', 'adventure', 'mountain', 'desert', 'forest',
    'technical', 'difficult', 'easy', 'moderate', 'extreme', 'scenic',
  ]
  
  const combinedText = `${title} ${content}`.toLowerCase()
  keywords.forEach(keyword => {
    if (combinedText.includes(keyword)) {
      tags.add(keyword)
    }
  })
  
  return Array.from(tags).slice(0, 10) // Limit to 10 tags
}

// Helper function to extract location data from content
function extractLocationFromContent(title: string, content: string) {
  const combinedText = `${title} ${content}`
  
  // Look for GPS coordinates
  const coordPattern = /(-?\d+\.?\d*)[,\s]+(-?\d+\.?\d*)/
  const coordMatch = combinedText.match(coordPattern)
  
  // Look for distance mentions
  const kmPattern = /(\d+\.?\d*)\s*(km|kilometer|kilometres)/i
  const milesPattern = /(\d+\.?\d*)\s*(mi|mile|miles)/i
  const kmMatch = combinedText.match(kmPattern)
  const milesMatch = combinedText.match(milesPattern)
  
  // Look for elevation mentions
  const elevPattern = /(\d+\.?\d*)\s*(m|meter|metres|ft|feet)\s*(elevation|altitude|climb|gain)/i
  const elevMatch = combinedText.match(elevPattern)
  
  // Extract difficulty mentions
  let difficulty = null
  if (/\b(easy|beginner|simple)\b/i.test(combinedText)) difficulty = 'easy'
  else if (/\b(moderate|intermediate)\b/i.test(combinedText)) difficulty = 'moderate'
  else if (/\b(difficult|hard|challenging)\b/i.test(combinedText)) difficulty = 'difficult'
  else if (/\b(extreme|expert|dangerous)\b/i.test(combinedText)) difficulty = 'extreme'
  
  return {
    latitude: coordMatch ? parseFloat(coordMatch[1]) : null,
    longitude: coordMatch ? parseFloat(coordMatch[2]) : null,
    distance_km: kmMatch ? parseFloat(kmMatch[1]) : 
                 milesMatch ? parseFloat(milesMatch[1]) * 1.60934 : null,
    elevation_gain_m: elevMatch ? 
      (elevMatch[2].toLowerCase().includes('ft') ? 
        parseFloat(elevMatch[1]) * 0.3048 : 
        parseFloat(elevMatch[1])) : null,
    difficulty_level: difficulty,
  }
}