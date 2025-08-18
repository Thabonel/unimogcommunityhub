import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'
const OPENAI_EMBEDDING_URL = 'https://api.openai.com/v1/embeddings'

const BARRY_SYSTEM_PROMPT = `You are Barry, an expert AI mechanic specializing in Unimog vehicles with 40+ years of hands-on experience. You're also a helpful assistant who can answer general questions about weather, locations, and provide practical advice.

Your personality:
- Gruff but friendly, like a seasoned mechanic who's seen it all
- Direct and no-nonsense in your advice
- Occasionally share war stories from your workshop
- Use technical terms but explain them when needed
- Have strong opinions about proper maintenance
- Get excited about well-maintained Unimogs
- Happy to help with non-Unimog questions too, but always bring it back to vehicles when relevant

Your expertise includes:
- All Unimog models and their quirks
- Portal axles, gear reduction, and drivetrain systems
- Mercedes-Benz OM-series engines
- Hydraulic systems and PTOs
- Electrical troubleshooting
- Off-road preparation and recovery
- Parts sourcing and alternatives
- Common problems and their solutions
- General automotive knowledge
- Weather conditions affecting vehicle operation
- Route planning and navigation advice
- Local services and facilities

When answering:
- For Unimog questions: Provide specific, actionable advice with part numbers, torque specs, and fluid capacities
- For weather questions: Provide current conditions and how they might affect driving/vehicle operation
- For location questions: Offer local knowledge and nearby services
- For general questions: Be helpful while maintaining your mechanic personality

Remember: You're primarily a Unimog expert, but you're also a helpful assistant who can handle various queries.`

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

    // Verify the user is authenticated
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

    // Check if OpenAI API key is configured
    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get the request body
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
    
    // Search for relevant manual content
    let manualContext = ''
    let manualReferences = []
    
    // Get the last user message for context search
    const lastUserMessage = messages.filter(m => m.role === 'user').pop()
    if (lastUserMessage && lastUserMessage.content) {
      try {
        // Create embedding for the user's question
        const embeddingResponse = await fetch(OPENAI_EMBEDDING_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'text-embedding-ada-002',
            input: lastUserMessage.content,
          }),
        })
        
        if (embeddingResponse.ok) {
          const embeddingData = await embeddingResponse.json()
          const queryEmbedding = embeddingData.data[0].embedding
          
          // Search manual chunks with enhanced selection for visual content
          const { data: chunks, error: searchError } = await supabaseClient
            .rpc('search_manual_chunks', {
              query_embedding: `[${queryEmbedding.join(',')}]`,
              match_count: 5,
              match_threshold: 0.7
            })
          
          // Then get additional fields for visual content
          if (!searchError && chunks && chunks.length > 0) {
            const chunkIds = chunks.map(c => c.id);
            const { data: enhancedChunks } = await supabaseClient
              .from('manual_chunks')
              .select('id, page_image_url, has_visual_elements, visual_content_type')
              .in('id', chunkIds);
              
            // Merge the enhanced data
            chunks.forEach(chunk => {
              const enhanced = enhancedChunks?.find(e => e.id === chunk.id);
              if (enhanced) {
                chunk.page_image_url = enhanced.page_image_url;
                chunk.has_visual_elements = enhanced.has_visual_elements;
                chunk.visual_content_type = enhanced.visual_content_type;
              }
            });
          }
          
          if (!searchError && chunks && chunks.length > 0) {
            manualContext = '\n\nRelevant manual excerpts:\n'
            chunks.forEach((chunk, idx) => {
              manualContext += `\n[${idx + 1}] From "${chunk.manual_title}", Page ${chunk.page_number}:\n${chunk.content}\n`
              
              // Enhanced manual reference with image data
              const reference = {
                manual: chunk.manual_title,
                page: chunk.page_number,
                section: chunk.section_title,
                pageImageUrl: chunk.page_image_url || null,
                hasVisualContent: chunk.has_visual_elements || false,
                visualContentType: chunk.visual_content_type || 'text'
              }
              
              manualReferences.push(reference)
              
              // Add visual content note to context if available
              if (chunk.has_visual_elements) {
                manualContext += `[This page contains ${chunk.visual_content_type} content - refer user to the manual panel for visual details]\n`
              }
            })
            manualContext += '\n\nUse these manual references to provide accurate, specific advice with page numbers when relevant. When visual content is available, mention that diagrams/illustrations can be viewed in the manual panel.'
          }
        }
      } catch (searchError) {
        console.error('Manual search error:', searchError)
        // Continue without manual context
      }
    }

    // Check rate limiting (simple implementation - could be enhanced with Redis)
    const rateLimitKey = `chat_limit_${user.id}`
    const { data: recentChats } = await supabaseClient
      .from('chat_rate_limits')
      .select('id')
      .eq('user_id', user.id)
      .gte('created_at', new Date(Date.now() - 60000).toISOString()) // Last minute

    if (recentChats && recentChats.length >= 10) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please wait a moment.' }),
        { 
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Record this request for rate limiting
    await supabaseClient
      .from('chat_rate_limits')
      .insert({ user_id: user.id })

    // Add location context if provided
    let locationContext = ''
    if (location && location.latitude && location.longitude) {
      locationContext = `\n\nUser's current location: Latitude ${location.latitude.toFixed(4)}, Longitude ${location.longitude.toFixed(4)}. Today's date is ${new Date().toLocaleDateString()}. Current time is ${new Date().toLocaleTimeString()}.`
    }
    
    // Call OpenAI API with manual and location context
    const systemPromptWithContext = BARRY_SYSTEM_PROMPT + locationContext + manualContext
    
    const openAIResponse = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: systemPromptWithContext },
          ...messages
        ],
        max_tokens: 800,
        temperature: 0.8,
      }),
    })

    if (!openAIResponse.ok) {
      const error = await openAIResponse.text()
      console.error('OpenAI API error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to get response from AI' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const data = await openAIResponse.json()

    // Log the chat for analytics (optional)
    await supabaseClient
      .from('chat_logs')
      .insert({
        user_id: user.id,
        messages: messages,
        response: data.choices[0].message.content,
        model: 'gpt-4-turbo-preview',
        tokens_used: data.usage?.total_tokens || 0,
      })

    // Return the response with manual references
    return new Response(
      JSON.stringify({
        content: data.choices[0].message.content,
        usage: data.usage,
        manualReferences: manualReferences.length > 0 ? manualReferences : undefined
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Edge function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})