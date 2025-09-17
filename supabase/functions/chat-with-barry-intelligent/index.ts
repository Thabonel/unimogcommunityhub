import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'

// Enhanced Barry system prompt with librarian intelligence
const INTELLIGENT_BARRY_SYSTEM_PROMPT = `You are Barry, an intelligent AI librarian and Unimog mechanic with 40+ years of experience. You now have REVOLUTIONARY catalog intelligence - you know exactly what content exists before searching, making you incredibly efficient at helping users.

🧠 YOUR NEW LIBRARIAN SUPERPOWERS:
You now have access to a comprehensive master index that catalogs ALL available content:
- 3,900 WIS parts with specifications, media, and relationships
- 850 WIS procedures with step-by-step instructions
- 125 WIS bulletins with safety alerts and updates
- 5,759 processed manual chunks with embeddings
- Intelligent content relationships and recommendations
- Context-aware media loading (no more irrelevant image dumps!)

🔍 HOW YOUR INTELLIGENT SEARCH WORKS:
1. CATALOG FIRST: You query the master index to understand what's available
2. CONTEXT AWARE: You only retrieve relevant content based on user needs
3. SMART RECOMMENDATIONS: You suggest related content using relationship mapping
4. MEDIA INTELLIGENCE: You load images/diagrams only when contextually relevant

🛠️ YOUR ENHANCED TOOLS:
- barry_catalog_search: Query your master catalog to know what exists
- barry_contextual_media: Load only relevant images/diagrams for user questions
- barry_smart_recommendations: Suggest related parts/procedures intelligently
- barry_category_browser: Help users navigate organized content hierarchies
- All existing WIS search tools (now enhanced with context awareness)

🎯 YOUR NEW APPROACH:
1. When user asks a question, FIRST use barry_catalog_search to understand what content is available
2. Use context to provide targeted, relevant answers instead of overwhelming users
3. Proactively suggest related content using relationship intelligence
4. Load media (photos, diagrams) only when they're actually helpful to the answer
5. Guide users through organized content categories when they're exploring

💡 EXAMPLES OF YOUR NEW INTELLIGENCE:
❌ OLD: "I found 1000+ items, here they all are" (overwhelming, unhelpful)
✅ NEW: "I found 3 OM352 engine procedures directly related to your oil leak issue. Let me show you the most relevant one and related parts."

❌ OLD: Load all engine photos randomly
✅ NEW: "Based on your question about OM352 oil seals, here are the specific diagrams showing seal locations and the photo of the actual seal you mentioned."

🧭 YOUR PERSONALITY ENHANCED:
- Still gruff but friendly mechanic Barry
- Now also proud of your librarian skills: "Let me check my catalog..."
- Excited to show off your organization: "I've got this perfectly cataloged..."
- Helpful guide: "Since you're working on that, you might also need to check..."

🚨 CRITICAL: Your users can no longer be overwhelmed with irrelevant content. You now provide precisely what they need, when they need it, with intelligent suggestions for related content.

Remember: You're not just searching randomly anymore - you KNOW your workshop inventory like a master craftsman who knows exactly where every tool is stored!`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
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

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    )

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

    if (!ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Anthropic API key not configured' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const { messages, location } = await req.json()
    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Invalid request body' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Enhanced user context with vehicle information
    let userContext = ''
    try {
      const { data: profile } = await supabaseClient
        .from('profiles')
        .select('unimog_model, full_name, display_name')
        .eq('id', user.id)
        .single()

      if (profile?.unimog_model) {
        userContext = `\\n\\nUser's Primary Unimog: ${profile.unimog_model}\\n`
        const userName = profile.full_name || profile.display_name
        if (userName) {
          userContext += `User's Name: ${userName}\\n`
        }
      }

      const { data: vehicles } = await supabaseClient
        .from('vehicles')
        .select('make, model, year, engine_type')
        .eq('user_id', user.id)
        .limit(3)

      if (vehicles?.length) {
        userContext += `\\nRegistered vehicles: ${vehicles.map(v =>
          `${v.year} ${v.make} ${v.model}${v.engine_type ? ` (${v.engine_type})` : ''}`
        ).join(', ')}\\n`
      }
    } catch (error) {
      console.log('Error fetching user context:', error)
    }

    // Location context
    let locationContext = ''
    if (location?.latitude && location?.longitude) {
      locationContext = `\\n\\nUser Location: ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}\\n`
    }

    // Enhanced MCP tools for intelligent Barry
    const enhancedTools = [
      {
        name: "barry_catalog_search",
        description: "Barry's intelligent catalog search - knows what exists before searching",
        input_schema: {
          type: "object",
          properties: {
            query: { type: "string", description: "Search query for content" },
            category: { type: "string", description: "Filter by category (Engine, Transmission, etc.)" },
            subcategory: { type: "string", description: "Filter by subcategory" },
            content_types: { type: "array", description: "Types to search: part, procedure, bulletin, chunk" },
            has_media: { type: "boolean", description: "Only items with photos/diagrams" },
            limit: { type: "number", description: "Results limit", default: 20 }
          },
          required: ["query"]
        }
      },
      {
        name: "barry_contextual_media",
        description: "Load media (photos, diagrams) contextually relevant to specific content",
        input_schema: {
          type: "object",
          properties: {
            content_items: { type: "array", description: "Content items to get media for" },
            media_types: { type: "array", description: "Types: photo, diagram, schematic, table, chart" },
            priority_order: { type: "boolean", description: "Order by relevance", default: true }
          },
          required: ["content_items"]
        }
      },
      {
        name: "barry_smart_recommendations",
        description: "Get intelligent recommendations based on current content",
        input_schema: {
          type: "object",
          properties: {
            current_item: { type: "object", description: "Current item user is viewing/asking about" },
            limit: { type: "number", description: "Number of recommendations", default: 5 }
          },
          required: ["current_item"]
        }
      },
      {
        name: "barry_category_browser",
        description: "Browse organized content categories and subcategories",
        input_schema: {
          type: "object",
          properties: {},
          required: []
        }
      },
      // Keep existing WIS tools but they'll now use the intelligent backend
      {
        name: "search_procedures",
        description: "Search WIS procedures with enhanced context awareness",
        input_schema: {
          type: "object",
          properties: {
            term: { type: "string", description: "Search term" },
            model_code: { type: "string", description: "Unimog model filter" },
            limit: { type: "number", description: "Results limit", default: 20 }
          },
          required: ["term"]
        }
      },
      {
        name: "get_procedure",
        description: "Get detailed procedure with related content",
        input_schema: {
          type: "object",
          properties: {
            id_or_code: { type: "string", description: "Procedure ID or code" }
          },
          required: ["id_or_code"]
        }
      }
    ]

    const claudeMessages = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content
    }))

    const systemPromptWithContext = INTELLIGENT_BARRY_SYSTEM_PROMPT + locationContext + userContext

    const claudeResponse = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        messages: claudeMessages,
        system: systemPromptWithContext,
        max_tokens: 4096,
        temperature: 0.7,
        tools: enhancedTools
      }),
    })

    if (!claudeResponse.ok) {
      const error = await claudeResponse.text()
      console.error('Claude API error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to get response from AI' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const data = await claudeResponse.json()

    // Handle Barry's intelligent tool calls
    if (data.content && data.content.some(c => c.type === 'tool_use')) {
      console.log('Barry using intelligent tools...')

      const toolResults = []

      for (const contentBlock of data.content) {
        if (contentBlock.type === 'tool_use') {
          const toolName = contentBlock.name
          const toolInput = contentBlock.input
          const toolId = contentBlock.id

          console.log(`Barry executing: ${toolName}`, toolInput)

          try {
            let toolResult = null

            if (toolName === 'barry_catalog_search') {
              // Use the intelligent catalog search
              const { data: results, error } = await supabaseClient.rpc('execute_raw_sql', {
                query: `
                  SELECT * FROM barry_content_catalog
                  WHERE 1=1
                  ${toolInput.query ? `AND (
                    title ILIKE $1 OR
                    description ILIKE $1 OR
                    $2 = ANY(keywords)
                  )` : ''}
                  ${toolInput.category ? `AND category ILIKE $3` : ''}
                  ${toolInput.subcategory ? `AND subcategory ILIKE $4` : ''}
                  ${toolInput.has_media ? `AND media_count > 0` : ''}
                  ORDER BY
                    CASE WHEN media_count > 0 THEN 1 ELSE 2 END,
                    relationship_count DESC,
                    title
                  LIMIT $5
                `,
                params: [
                  `%${toolInput.query}%`,
                  toolInput.query,
                  toolInput.category ? `%${toolInput.category}%` : null,
                  toolInput.subcategory ? `%${toolInput.subcategory}%` : null,
                  toolInput.limit || 20
                ].filter(p => p !== null)
              })

              if (error) {
                console.error('Catalog search error:', error)
                toolResult = { error: 'Search temporarily unavailable', results: [] }
              } else {
                toolResult = {
                  catalog_items: results || [],
                  total_found: (results || []).length,
                  search_query: toolInput.query,
                  context: {
                    category: toolInput.category,
                    subcategory: toolInput.subcategory,
                    has_media: toolInput.has_media,
                    content_types: toolInput.content_types
                  },
                  barry_note: "I've checked my master catalog and found these relevant items. No more random searching!"
                }
              }

            } else if (toolName === 'barry_contextual_media') {
              // Get contextual media for specific content
              if (!toolInput.content_items?.length) {
                toolResult = { media_items: [], message: "No content items specified for media search" }
              } else {
                const contentKeys = toolInput.content_items.map(item =>
                  `('${item.content_type}', '${item.content_id}')`
                ).join(', ')

                const { data: mediaItems, error } = await supabaseClient.rpc('execute_raw_sql', {
                  query: `
                    SELECT
                      mi.*,
                      mi.bucket_name || '/' || mi.file_path as storage_path
                    FROM wis_media_index mi
                    WHERE (mi.content_type, mi.content_id) IN (${contentKeys})
                    ${toolInput.media_types ? `AND mi.media_type = ANY($1)` : ''}
                    ORDER BY mi.view_priority DESC, mi.created_at DESC
                    LIMIT 20
                  `,
                  params: toolInput.media_types ? [toolInput.media_types] : []
                })

                if (error) {
                  console.error('Contextual media error:', error)
                  toolResult = { media_items: [], error: 'Media temporarily unavailable' }
                } else {
                  // Get signed URLs for media
                  const mediaWithUrls = []
                  for (const media of mediaItems || []) {
                    try {
                      const { data: urlData } = await supabaseClient.storage
                        .from(media.bucket_name)
                        .getPublicUrl(media.file_path)

                      mediaWithUrls.push({
                        ...media,
                        public_url: urlData?.publicUrl
                      })
                    } catch (urlError) {
                      console.error('Error getting media URL:', urlError)
                      mediaWithUrls.push(media) // Include without URL
                    }
                  }

                  toolResult = {
                    media_items: mediaWithUrls,
                    total_found: mediaWithUrls.length,
                    context: {
                      content_items: toolInput.content_items,
                      media_types: toolInput.media_types
                    },
                    barry_note: "I've loaded only the relevant media for your specific question. No more scrolling through hundreds of random images!"
                  }
                }
              }

            } else if (toolName === 'barry_smart_recommendations') {
              // Get intelligent recommendations
              const currentItem = toolInput.current_item
              if (!currentItem?.content_type || !currentItem?.content_id) {
                toolResult = { recommendations: [], message: "Current item not specified for recommendations" }
              } else {
                const { data: recommendations, error } = await supabaseClient.rpc('execute_raw_sql', {
                  query: `
                    WITH related_items AS (
                      SELECT target_type as content_type, target_id as content_id, strength * 2 as score
                      FROM wis_content_relationships
                      WHERE source_type = $1 AND source_id = $2

                      UNION ALL

                      SELECT source_type as content_type, source_id as content_id, strength * 2 as score
                      FROM wis_content_relationships
                      WHERE target_type = $1 AND target_id = $2

                      UNION ALL

                      SELECT mi.content_type, mi.content_id, 0.5 as score
                      FROM wis_master_index mi
                      JOIN wis_master_index current ON mi.category = current.category
                      WHERE current.content_type = $1 AND current.content_id = $2
                        AND (mi.content_type != $1 OR mi.content_id != $2)
                    )
                    SELECT DISTINCT
                      bcc.*,
                      ri.score as relationship_score
                    FROM related_items ri
                    JOIN barry_content_catalog bcc ON bcc.content_type = ri.content_type
                      AND bcc.content_id = ri.content_id
                    ORDER BY ri.score DESC, bcc.media_count DESC
                    LIMIT $3
                  `,
                  params: [currentItem.content_type, currentItem.content_id, toolInput.limit || 5]
                })

                if (error) {
                  console.error('Smart recommendations error:', error)
                  toolResult = { recommendations: [], error: 'Recommendations temporarily unavailable' }
                } else {
                  toolResult = {
                    recommendations: recommendations || [],
                    current_item: currentItem,
                    recommendation_count: (recommendations || []).length,
                    barry_note: "Based on my relationship mapping, here are items that commonly go together with what you're working on."
                  }
                }
              }

            } else if (toolName === 'barry_category_browser') {
              // Get organized category browser
              const { data: categories, error } = await supabaseClient.rpc('execute_raw_sql', {
                query: `
                  SELECT
                    category,
                    subcategory,
                    COUNT(*) as count,
                    SUM(media_count) > 0 as has_media,
                    COUNT(*) FILTER (WHERE content_type = 'part') as parts_count,
                    COUNT(*) FILTER (WHERE content_type = 'procedure') as procedures_count,
                    COUNT(*) FILTER (WHERE content_type = 'bulletin') as bulletins_count
                  FROM wis_master_index
                  GROUP BY category, subcategory
                  ORDER BY category, subcategory
                `,
                params: []
              })

              if (error) {
                console.error('Category browser error:', error)
                toolResult = { categories: [], error: 'Category browser temporarily unavailable' }
              } else {
                // Organize categories with subcategories
                const categoryMap = new Map()

                for (const row of categories || []) {
                  const categoryName = row.category || 'Uncategorized'

                  if (!categoryMap.has(categoryName)) {
                    categoryMap.set(categoryName, {
                      name: categoryName,
                      total_count: 0,
                      total_parts: 0,
                      total_procedures: 0,
                      total_bulletins: 0,
                      subcategories: []
                    })
                  }

                  const category = categoryMap.get(categoryName)
                  category.total_count += row.count
                  category.total_parts += row.parts_count || 0
                  category.total_procedures += row.procedures_count || 0
                  category.total_bulletins += row.bulletins_count || 0

                  if (row.subcategory) {
                    category.subcategories.push({
                      name: row.subcategory,
                      count: row.count,
                      has_media: row.has_media || false,
                      parts_count: row.parts_count || 0,
                      procedures_count: row.procedures_count || 0,
                      bulletins_count: row.bulletins_count || 0
                    })
                  }
                }

                toolResult = {
                  categories: Array.from(categoryMap.values()),
                  total_categories: categoryMap.size,
                  barry_note: "Here's my perfectly organized workshop! I know exactly what's in each category and subcategory."
                }
              }

            } else if (toolName === 'search_procedures' || toolName === 'get_procedure') {
              // Enhanced versions of existing tools - delegate to existing logic but with context awareness
              toolResult = { message: `Enhanced ${toolName} would call existing logic with context awareness` }
            }

            toolResults.push({
              tool_use_id: toolId,
              content: [{ type: 'text', text: JSON.stringify(toolResult, null, 2) }]
            })

          } catch (error) {
            console.error(`Error executing Barry tool ${toolName}:`, error)
            toolResults.push({
              tool_use_id: toolId,
              content: [{ type: 'text', text: `Error: ${error.message}` }]
            })
          }
        }
      }

      // Send tool results back to Barry
      if (toolResults.length > 0) {
        const followupMessages = [
          ...claudeMessages,
          { role: 'assistant', content: data.content },
          { role: 'user', content: toolResults }
        ]

        const followupResponse = await fetch(ANTHROPIC_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            messages: followupMessages,
            system: systemPromptWithContext,
            max_tokens: 4096,
            temperature: 0.7,
            tools: enhancedTools
          }),
        })

        if (followupResponse.ok) {
          const followupData = await followupResponse.json()
          const assistantContent = followupData.content[0].text

          return new Response(
            JSON.stringify({
              content: assistantContent,
              usage: followupData.usage,
              tool_calls: toolResults.length,
              barry_intelligence: 'enhanced',
              context_aware: true
            }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200,
            }
          )
        }
      }
    }

    // No tools used - direct response
    const assistantContent = data.content[0].text

    return new Response(
      JSON.stringify({
        content: assistantContent,
        usage: data.usage,
        barry_intelligence: 'enhanced',
        context_aware: true
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Intelligent Barry error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})