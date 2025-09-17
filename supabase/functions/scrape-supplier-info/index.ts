import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ScrapedData {
  name: string;
  description: string;
  address: string;
  city: string;
  country_code: string;
  phone: string;
  email: string;
  type: 'dealership' | 'service' | 'parts' | 'regulations';
  confidence: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Create Supabase client with the user's token
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    )

    // Verify the user is authenticated and is admin
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Check if user is admin
    const { data: adminCheck } = await supabaseClient
      .rpc('check_admin_access', { check_user_id: user.id })

    if (!adminCheck) {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get the URL from request body
    const { url } = await req.json()
    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Scraping URL:', url)

    // Fetch the webpage
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; UnimogCommunityBot/1.0)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      }
    })

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: `Failed to fetch URL: ${response.status}` }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const html = await response.text()

    // Extract information using regex patterns and heuristics
    const scrapedData = extractInformation(html, url)

    return new Response(
      JSON.stringify({
        success: true,
        data: scrapedData,
        original_url: url
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Scraping error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

function extractInformation(html: string, url: string): ScrapedData {
  // Helper function to extract text content from HTML
  const extractText = (pattern: RegExp): string => {
    const match = html.match(pattern)
    return match ? match[1].replace(/<[^>]*>/g, '').trim() : ''
  }

  // Helper function to find multiple patterns
  const findBestMatch = (patterns: RegExp[]): string => {
    for (const pattern of patterns) {
      const result = extractText(pattern)
      if (result) return result
    }
    return ''
  }

  // Extract title/name
  const namePatterns = [
    /<title[^>]*>([^<]+)</i,
    /<h1[^>]*>([^<]+)</i,
    /<meta[^>]*property="og:title"[^>]*content="([^"]+)"/i,
    /<meta[^>]*name="title"[^>]*content="([^"]+)"/i
  ]

  let name = findBestMatch(namePatterns)

  // Clean up the name
  name = name.replace(/\s*[-|]\s*.*/g, '') // Remove taglines after dash or pipe
          .replace(/\s*(home|welcome|official|website)\s*/gi, '') // Remove common words
          .trim()

  // Extract description
  const descriptionPatterns = [
    /<meta[^>]*name="description"[^>]*content="([^"]+)"/i,
    /<meta[^>]*property="og:description"[^>]*content="([^"]+)"/i,
    /<p[^>]*class="[^"]*description[^"]*"[^>]*>([^<]+)</i,
    /<div[^>]*class="[^"]*about[^"]*"[^>]*>([^<]+)</i
  ]

  const description = findBestMatch(descriptionPatterns)

  // Extract contact information
  const phonePatterns = [
    /(?:phone|tel|call)[^>]*>([^<]*(?:\+?[\d\s\-\(\)\.]{10,})[^<]*)</i,
    /(?:\+?[\d\s\-\(\)\.]{10,})/g
  ]

  const emailPatterns = [
    /(?:email|contact)[^>]*>([^<]*[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}[^<]*)</i,
    /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g
  ]

  const addressPatterns = [
    /<div[^>]*class="[^"]*address[^"]*"[^>]*>([^<]+)</i,
    /<span[^>]*class="[^"]*address[^"]*"[^>]*>([^<]+)</i,
    /(?:address|location)[^>]*>([^<]+)</i
  ]

  let phone = findBestMatch(phonePatterns)
  let email = findBestMatch(emailPatterns)
  let address = findBestMatch(addressPatterns)

  // Determine country from URL domain or content
  let country_code = 'US' // default
  if (url.includes('.au') || html.includes('Australia') || html.includes('Australian')) {
    country_code = 'AU'
  } else if (url.includes('.de') || html.includes('Germany') || html.includes('Deutschland')) {
    country_code = 'DE'
  } else if (url.includes('.uk') || url.includes('.co.uk') || html.includes('United Kingdom') || html.includes('UK')) {
    country_code = 'GB'
  }

  // Extract city from address or content
  let city = ''
  if (address) {
    const cityMatch = address.match(/,\s*([^,]+),?\s*(?:\d{4,5}|[A-Z]{2,3})?\s*$/i)
    if (cityMatch) city = cityMatch[1].trim()
  }

  // Determine business type based on content analysis
  let type: 'dealership' | 'service' | 'parts' | 'regulations' = 'parts' // default
  let confidence = 0.5

  const htmlLower = html.toLowerCase()

  if (htmlLower.includes('dealer') || htmlLower.includes('authorized') || htmlLower.includes('official')) {
    type = 'dealership'
    confidence = 0.8
  } else if (htmlLower.includes('service') || htmlLower.includes('repair') || htmlLower.includes('maintenance')) {
    type = 'service'
    confidence = 0.7
  } else if (htmlLower.includes('parts') || htmlLower.includes('spare') || htmlLower.includes('component')) {
    type = 'parts'
    confidence = 0.7
  } else if (htmlLower.includes('regulation') || htmlLower.includes('documentation') || htmlLower.includes('manual')) {
    type = 'regulations'
    confidence = 0.6
  }

  // Check for Unimog-specific content to increase confidence
  if (htmlLower.includes('unimog') || htmlLower.includes('mercedes')) {
    confidence = Math.min(confidence + 0.2, 1.0)
  }

  // Clean up extracted data
  phone = phone.replace(/[^\d\+\-\s\(\)\.]/g, '').trim()
  email = email.replace(/[^a-zA-Z0-9._%+-@]/g, '').trim()

  return {
    name: name || 'Unknown Business',
    description: description || 'No description available',
    address: address || '',
    city: city || '',
    country_code,
    phone: phone || '',
    email: email || '',
    type,
    confidence
  }
}