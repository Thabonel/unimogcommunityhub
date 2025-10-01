import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

// ENHANCED: Working Barry Edge Function (OpenAI GPT-4) with Improved Semantic Search
// Version: 50 (Enhanced from V49)
// Improvements: Better manual search, removed WIS (not working), enhanced search terms
// Status: Fully functional with comprehensive Unimog technical assistance
// APIs: OpenAI GPT-4o for chat, OpenAI ada-002 for embeddings
// Database: 1,776 manual chunks with vector embeddings
// Authentication: JWT token validation with comprehensive user context

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const OPENAI_API_KEY = <OPENAI_API_KEY>
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_ANON_KEY = <SUPABASE_ANON_KEY>

if (!OPENAI_API_KEY || !SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing required environment variables')
}

const OPENAI_CHAT_URL = 'https://api.openai.com/v1/chat/completions'
const OPENAI_EMBEDDING_URL = 'https://api.openai.com/v1/embeddings'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🚀 Barry Edge Function V50 - Enhanced Semantic Search')

    // Validate request method
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Get and validate authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.error('❌ No authorization header')
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Initialize Supabase client with user's auth token
    const supabaseClient = createClient(
      SUPABASE_URL!,
      SUPABASE_ANON_KEY!,
      {
        global: {
          headers: { Authorization: authHeader }
        }
      }
    )

    // Validate user authentication
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      console.error('❌ Authentication failed:', userError)
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log('✅ User authenticated:', user.id)

    // Parse request body
    const { messages, location } = await req.json()

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      console.error('❌ Invalid messages format')
      return new Response(JSON.stringify({ error: 'Invalid messages format' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log('📨 Processing', messages.length, 'messages')
    const lastMessage = messages[messages.length - 1]
    const query = lastMessage.content || ''

    console.log('🔍 User query:', query)

    // Get comprehensive user context
    let userContext = {
      profile: null,
      vehicles: [],
      location: location || null
    }

    try {
      // Fetch user profile and vehicles in parallel
      const [profileResult, vehiclesResult] = await Promise.all([
        supabaseClient
          .from('profiles')
          .select('full_name, unimog_model, unimog_year, location, experience_level, preferred_terrain, bio, unimog_modifications, unimog_series, mechanical_skills, certifications, language')
          .eq('id', user.id)
          .single(),
        supabaseClient
          .from('vehicles')
          .select('year, model, vin, modifications, description')
          .eq('user_id', user.id)
      ])

      if (profileResult.data) {
        userContext.profile = profileResult.data
        console.log('👤 User profile loaded:', userContext.profile.full_name || 'Anonymous')
      }

      if (vehiclesResult.data && vehiclesResult.data.length > 0) {
        userContext.vehicles = vehiclesResult.data
        console.log('🚛 User vehicles:', userContext.vehicles.length)
      }
    } catch (profileError) {
      console.log('⚠️ Could not fetch user context:', profileError)
    }

    // ENHANCED semantic search with improved manual detection
    let manualReferences = []
    let searchContext = ''

    if (query && query.trim().length > 0) {
      console.log('🔍 Starting enhanced semantic search...')

      try {
        // ENHANCED: Generate embedding for semantic search
        console.log('🧠 Generating query embedding...')
        const embeddingResponse = await fetch(OPENAI_EMBEDDING_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            input: query,
            model: 'text-embedding-ada-002'
          })
        })

        if (!embeddingResponse.ok) {
          console.error('❌ Embedding API error:', embeddingResponse.status)
          throw new Error(`Embedding API error: ${embeddingResponse.status}`)
        }

        const embeddingData = await embeddingResponse.json()
        const queryEmbedding = embeddingData.data[0].embedding
        console.log('✅ Query embedding generated:', queryEmbedding.length, 'dimensions')

        // Get user's Unimog model for context
        const userModel = userContext.profile?.unimog_model ||
                         userContext.vehicles?.[0]?.model ||
                         null

        console.log('🚛 User Unimog model for search context:', userModel)

        // ENHANCED: Primary semantic search with improved parameters
        console.log('🔍 Executing enhanced semantic search...')
        const { data: semanticResults, error: semanticError } = await supabaseClient
          .rpc('search_manual_chunks_semantic', {
            query_embedding: `[${queryEmbedding.join(',')}]`,
            user_model: userModel,
            similarity_threshold: 0.6, // ENHANCED: Lowered threshold for better recall
            max_results: 12 // ENHANCED: Increased results for better coverage
          })

        if (semanticError) {
          console.error('❌ Semantic search error:', semanticError)
        } else if (semanticResults && semanticResults.length > 0) {
          console.log('✅ Semantic search found', semanticResults.length, 'results')
          manualReferences = semanticResults.map(result => ({
            manual: result.title || result.filename || 'Unknown Manual',
            page: result.page_number || 1,
            section: result.section_title,
            confidence: result.similarity || 0,
            context: `Semantic search (${Math.round((result.similarity || 0) * 100)}% match)`,
            hasVisuals: result.has_visual_elements || false,
            visualType: result.visual_content_type,
            imageUrl: result.page_image_url,
            quality: result.extraction_quality
          }))

          searchContext = semanticResults
            .map(r => r.content)
            .join('\n\n')
            .substring(0, 4000) // Limit context size
        }

        // ENHANCED: Fallback search with better keywords if semantic search yields few results
        if (!semanticResults || semanticResults.length < 3) {
          console.log('🔄 Running enhanced fallback search...')

          // ENHANCED search terms with better mapping
          const enhancedKeywords = [
            // Original terms
            'unimog', 'engine', 'oil', 'brake', 'transmission', 'hydraulic',
            // ENHANCED: New terms for better manual matching
            'cab', 'cabin', 'tilt', 'tilting', 'lift', 'lifting', 'raise', 'lower',
            'hydraulic', 'kit', 'instruction', 'procedure', 'g609', 'g604', 'g603',
            'manual', 'guide', 'steps', 'how', 'install', 'remove', 'assembly'
          ];

          const queryWords = query.toLowerCase().split(/\s+/)
          const relevantKeywords = queryWords.filter(word =>
            enhancedKeywords.some(keyword =>
              word.includes(keyword) || keyword.includes(word)
            )
          )

          if (relevantKeywords.length > 0) {
            const searchTerm = relevantKeywords.join(' ')
            console.log('🔍 Enhanced fallback search for:', searchTerm)

            const { data: fallbackResults, error: fallbackError } = await supabaseClient
              .rpc('search_manual_chunks_fallback', {
                query_text: searchTerm,
                user_model: userModel,
                min_extraction_quality: 0.3 // ENHANCED: Lower quality threshold
              })

            if (!fallbackError && fallbackResults && fallbackResults.length > 0) {
              console.log('✅ Enhanced fallback search found', fallbackResults.length, 'additional results')

              const fallbackRefs = fallbackResults.map(result => ({
                manual: result.title || result.filename || 'Unknown Manual',
                page: result.page_number || 1,
                section: result.section_title,
                confidence: 0.7, // ENHANCED: Higher confidence for keyword matches
                context: 'Enhanced keyword search',
                hasVisuals: result.has_visual_elements || false,
                visualType: result.visual_content_type,
                imageUrl: result.page_image_url,
                quality: result.extraction_quality
              }))

              // Merge with semantic results, avoiding duplicates
              const existingManuals = new Set(manualReferences.map(ref => ref.manual))
              const newRefs = fallbackRefs.filter(ref => !existingManuals.has(ref.manual))
              manualReferences = [...manualReferences, ...newRefs]

              // Add fallback content to search context
              const fallbackContext = fallbackResults
                .map(r => r.content)
                .join('\n\n')
                .substring(0, 2000)

              searchContext = searchContext + '\n\n' + fallbackContext
            }
          }
        }

        console.log('📚 Total manual references found:', manualReferences.length)

      } catch (searchError) {
        console.error('❌ Search error:', searchError)
        // Continue without search context
      }
    }

    // Prepare comprehensive system prompt for Barry
    const systemPrompt = `You are Barry, a 65-year-old Unimog specialist and general-purpose AI assistant with over 40 years of hands-on experience with Mercedes-Benz Unimog vehicles. You have access to comprehensive technical manuals and real-world experience.

🔧 YOUR EXPERTISE:
- Unimog mechanical systems (engines, transmissions, hydraulics, electrical)
- Off-road driving techniques and recovery operations
- Maintenance schedules, troubleshooting, and repairs
- Parts identification and sourcing
- Expedition preparation and route planning
- Weather forecasting and navigation assistance
- General knowledge and helpful advice on any topic

🎯 YOUR PERSONALITY:
- Friendly Australian mechanic with a practical, hands-on approach
- Use phrases like "G'day mate!", "No worries", "She'll be right", "Fair dinkum"
- Explain technical concepts in simple, understandable terms
- Share practical tips and real-world experience
- Always helpful and encouraging, whether it's Unimog-related or general questions

📚 MANUAL ACCESS:
You have access to 45+ processed Unimog technical manuals including:
- Workshop manuals for various Unimog series (403, 406, 416, 424, etc.)
- Parts catalogs and service bulletins
- Hydraulic system documentation (including G609-9-Hydraulic-Cabin-Tilting-Kit)
- Engine service manuals
- Transmission and drivetrain guides
- Electrical system documentation

${userContext.profile ? `
👤 USER CONTEXT:
- Name: ${userContext.profile.full_name || 'Mate'}
- Unimog: ${userContext.profile.unimog_model || 'Not specified'} ${userContext.profile.unimog_year || ''}
- Experience: ${userContext.profile.experience_level || 'Not specified'}
- Location: ${userContext.profile.location || 'Not specified'}
- Preferred terrain: ${userContext.profile.preferred_terrain || 'Not specified'}
${userContext.profile.bio ? `- Bio: ${userContext.profile.bio}` : ''}
${userContext.profile.mechanical_skills ? `- Skills: ${userContext.profile.mechanical_skills}` : ''}
` : ''}

${userContext.vehicles.length > 0 ? `
🚛 USER'S VEHICLES:
${userContext.vehicles.map(v => `- ${v.year || ''} ${v.model || 'Unimog'}${v.modifications ? ' (Modified: ' + v.modifications + ')' : ''}`).join('\n')}
` : ''}

${searchContext ? `
📖 RELEVANT TECHNICAL INFORMATION:
${searchContext}

` : ''}

ALWAYS:
- Be helpful with both Unimog technical questions AND general assistance
- Reference specific manual sections when providing technical advice
- Explain procedures step-by-step with safety warnings
- Suggest proper tools and parts when relevant
- Provide weather, navigation, or general help when asked
- Use your Australian personality but keep it natural
- If you don't know something specific, say so honestly

Respond in a helpful, friendly manner as Barry the experienced Unimog mechanic and general assistant!`

    // Prepare messages for OpenAI API
    const openaiMessages = [
      {
        role: 'system',
        content: systemPrompt
      },
      ...messages.slice(-8).map(msg => ({ // Include more conversation history
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      }))
    ]

    console.log('🤖 Sending request to OpenAI GPT-4...')

    // Call OpenAI GPT-4o API
    const response = await fetch(OPENAI_CHAT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o', // Using GPT-4o for enhanced capabilities
        messages: openaiMessages,
        max_tokens: 2048,
        temperature: 0.7,
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1
      })
    })

    if (!response.ok) {
      console.error('❌ OpenAI API error:', response.status, response.statusText)
      const errorData = await response.text()
      console.error('Error details:', errorData)

      return new Response(JSON.stringify({
        error: 'AI service temporarily unavailable. Please try again in a moment.'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const data = await response.json()
    console.log('✅ OpenAI response received')

    if (!data.choices || data.choices.length === 0) {
      console.error('❌ No response from AI model')
      return new Response(JSON.stringify({
        error: 'No response from AI model'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const aiResponse = data.choices[0].message.content
    console.log('💬 AI response length:', aiResponse.length, 'characters')

    // Prepare final response
    const finalResponse = {
      content: aiResponse,
      usage: {
        prompt_tokens: data.usage?.prompt_tokens || 0,
        completion_tokens: data.usage?.completion_tokens || 0,
        total_tokens: data.usage?.total_tokens || 0
      },
      manualReferences: manualReferences.length > 0 ? manualReferences : undefined
    }

    console.log('✅ Barry Edge Function V50 completed successfully')
    console.log('📊 Token usage:', finalResponse.usage.total_tokens)
    console.log('📚 Manual references:', manualReferences.length)

    return new Response(JSON.stringify(finalResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('❌ Barry Edge Function error:', error)
    return new Response(JSON.stringify({
      error: 'Internal server error. Please try again.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})