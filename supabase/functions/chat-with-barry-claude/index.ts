import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Anthropic Claude API configuration
const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'

const BARRY_SYSTEM_PROMPT = `You are Barry, a helpful AI assistant with 40+ years of experience as a Unimog mechanic. While you're an expert on Unimogs, you're ALSO a general-purpose assistant who MUST answer ALL questions helpfully, including weather, news, general knowledge, etc.

IMPORTANT: You MUST answer ALL questions directly, even if they're not about vehicles. Never refuse to answer or redirect users back to vehicle topics unless specifically asked about vehicles.

Your personality:
- Gruff but friendly, like a seasoned mechanic
- Direct and helpful with ALL questions
- Share mechanic stories when relevant
- Maintain your personality while being a complete assistant

Your capabilities:
1. PRIMARY: Answer ANY question the user asks (weather, news, math, history, etc.)
2. SPECIALTY: Deep Unimog and vehicle expertise with access to:
   - PDF Technical Manuals (referenced as M1, M2, etc.)
   - WIS Workshop Information System data (referenced as W1, W2, etc.)
   - User's registered vehicle information for personalized advice
3. Always provide weather forecasts when asked
4. Give directions and location information
5. Answer general knowledge questions
6. Help with any topic the user needs

When answering VEHICLE questions:
- Check user's registered vehicles first for personalized advice
- Use WIS data (W1, W2...) for specific technical procedures and bulletins
- Use Manual excerpts (M1, M2...) for general maintenance and repair guides
- Always cite your sources: "According to WIS Procedure..." or "Manual G604 states..."
- Prioritize information that matches the user's specific Unimog model
- Include difficulty ratings and time estimates when available from WIS data
- Mention technical bulletin numbers for safety-critical information

When answering NON-VEHICLE questions:
- Weather questions: ALWAYS provide a weather forecast/conditions. You can mention how it affects driving as a bonus.
- General questions: Answer directly and completely
- NEVER say you can't answer something or redirect to vehicle topics

Examples:
- "What's the weather tomorrow?" -> Give weather forecast, maybe add driving tips
- "What's 2+2?" -> "That's 4, mate."
- "How do I change the oil in my U1700?" -> Use WIS data + user's vehicle info for precise procedure

Remember: You're a helpful assistant FIRST who happens to be a Unimog expert with comprehensive technical resources. Answer EVERYTHING with the appropriate level of expertise.`

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

    // Check if Anthropic API key is configured
    if (!ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Anthropic API key not configured' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const { messages = [], includeLocation = false } = await req.json()

    // Ensure messages is an array and has at least one message
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get user's registered vehicles
    const { data: vehicles } = await supabaseClient
      .from('vehicles')
      .select('*')
      .eq('user_id', user.id)
      .order('is_primary', { ascending: false })

    let locationContext = ''
    
    // Add location context if requested
    if (includeLocation) {
      const lastUserMessage = messages.filter(m => m.role === 'user').pop()
      
      if (lastUserMessage && lastUserMessage.content) {
        const userText = lastUserMessage.content.toLowerCase()
        
        // Basic location detection
        if (userText.includes('weather') || userText.includes('forecast') || 
            userText.includes('rain') || userText.includes('temperature')) {
          locationContext = '\n\nIMPORTANT: When asked about weather, provide actual weather information (you can say "Based on typical weather patterns..." if you need to provide general info).'
        }
      }
    }

    // Add vehicle context to system prompt
    let vehicleContext = ''
    if (vehicles && vehicles.length > 0) {
      vehicleContext = '\n\nUser\'s registered vehicles:\n'
      vehicles.forEach(v => {
        vehicleContext += `- ${v.year} ${v.model} (${v.nickname || 'No nickname'}): VIN ${v.vin}\n`
      })
    }

    // Search for relevant manual content based on the latest user message
    let manualContext = ''
    const lastUserMessage = messages.filter(m => m.role === 'user').pop()
    
    if (lastUserMessage && lastUserMessage.content) {
      // Check if this is a vehicle-related question
      const userText = lastUserMessage.content.toLowerCase()
      const vehicleKeywords = ['unimog', 'engine', 'transmission', 'clutch', 'brake', 'differential', 
                               'axle', 'hydraulic', 'pto', 'oil', 'filter', 'maintenance', 'repair',
                               'u1300', 'u1700', 'u500', 'mercedes', 'daimler', 'gear', 'tire',
                               'service', 'manual', 'procedure', 'torque', 'specification']
      
      const isVehicleQuestion = vehicleKeywords.some(keyword => userText.includes(keyword))
      
      if (isVehicleQuestion) {
        const userText = lastUserMessage.content.toLowerCase()
        console.log('Searching enhanced manual chunks for:', lastUserMessage.content)
        
        let chunks = []
        let searchError = null
        
        try {
          // Use the enhanced search function for better results
          const { data: enhancedChunks, error } = await supabaseClient
            .rpc('search_enhanced_manual_chunks', {
              search_query: lastUserMessage.content,
              content_type_filter: null, // Search all content types
              min_quality: 0.5, // Minimum extraction quality
              limit_results: 8 // Get more results for better context
            })
          
          if (error) {
            console.error('Enhanced search error:', error)
            searchError = error
          } else if (enhancedChunks && enhancedChunks.length > 0) {
            chunks = enhancedChunks.map(chunk => ({
              id: chunk.id,
              manual_id: chunk.manual_id,
              chunk_index: 0, // Not used in new function
              page_number: chunk.page_number,
              section_title: chunk.section_title,
              content: chunk.content,
              content_type: chunk.content_type,
              has_visual_elements: chunk.has_visual_elements,
              visual_content_type: chunk.visual_content_type,
              procedure_complexity: chunk.procedure_complexity,
              extraction_quality: chunk.extraction_quality,
              relevance_score: chunk.relevance_score,
              manual_metadata: { title: chunk.manual_title }
            }))
            console.log(`Enhanced search found ${chunks.length} relevant chunks`)
          }
        } catch (enhancedError) {
          console.error('Enhanced search failed, using fallback:', enhancedError)
          searchError = enhancedError
        }
        
        // Fallback to basic search if enhanced search fails
        if (searchError && chunks.length === 0) {
          console.log('Using fallback search method...')
          const searchTerms = userText
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 3)
            .slice(0, 3)
          
          for (const term of searchTerms) {
            try {
              const { data: termChunks } = await supabaseClient
                .from('manual_chunks')
                .select(`
                  id, 
                  manual_id, 
                  chunk_index, 
                  page_number, 
                  section_title, 
                  content,
                  has_visual_elements,
                  visual_content_type,
                  manual_metadata!inner(title)
                `)
                .ilike('content', `%${term}%`)
                .limit(3)
                .order('page_number', { ascending: true })
              
              if (termChunks && termChunks.length > 0) {
                const existingIds = new Set(chunks.map(c => c.id))
                chunks.push(...termChunks.filter(c => !existingIds.has(c.id)))
              }
            } catch (error) {
              console.error('Fallback search error:', term, error)
            }
          }
          chunks = chunks.slice(0, 5)
        }
        
        // ENHANCED: Search WIS database using wis_search RPC with media support
        let wisChunks = []
        let wisReferences = []
        const searchTerms = userText
          .replace(/[^\w\s]/g, ' ')
          .split(/\s+/)
          .filter(word => word.length > 3)
          .slice(0, 3)
        
        if (searchTerms.length > 0) {
          console.log('Searching WIS database with RPC function...')
          
          // Use the new wis_search RPC function for better results with media
          for (const term of searchTerms.slice(0, 2)) {
            try {
              const { data: wisResults, error: wisError } = await supabaseClient
                .rpc('wis_search', { q: term })
              
              if (wisError) {
                console.error('WIS search error:', wisError)
                continue
              }
              
              if (wisResults && wisResults.length > 0) {
                wisChunks.push(...wisResults.slice(0, 2))
                console.log(`WIS search found ${wisResults.length} results for term: ${term}`)
              }
            } catch (error) {
              console.error('WIS search exception:', error)
            }
          }
          
          // Format WIS data for context (deduplication by ID)
          const uniqueWisChunks = wisChunks.reduce((acc, chunk) => {
            if (!acc.find(c => c.id === chunk.id)) {
              acc.push(chunk)
            }
            return acc
          }, [])
          
          if (uniqueWisChunks.length > 0) {
            wisReferences = uniqueWisChunks.slice(0, 3).map((chunk, idx) => {
              const ref = `W${idx + 1}`
              let content = `[${ref}] WIS ${chunk.item_type || 'Procedure'}: ${chunk.title || 'Unknown'}\n`
              
              if (chunk.procedure_number) {
                content += `Procedure Number: ${chunk.procedure_number}\n`
              }
              
              if (chunk.description) {
                content += `Description: ${chunk.description}\n`
              }
              
              if (chunk.content) {
                content += `Content: ${chunk.content.substring(0, 300)}...\n`
              }
              
              if (chunk.difficulty_rating) {
                content += `Difficulty: ${chunk.difficulty_rating}\n`
              }
              
              if (chunk.time_estimate) {
                content += `Time Estimate: ${chunk.time_estimate}\n`
              }
              
              if (chunk.technical_bulletin_number) {
                content += `Technical Bulletin: ${chunk.technical_bulletin_number}\n`
              }
              
              if (chunk.media_assets && chunk.media_assets.length > 0) {
                content += `Related Media: ${chunk.media_assets.length} image(s)/diagram(s) available\n`
              }
              
              return content
            })
          }
        }
        
        // Format manual chunks for context
        if (chunks.length > 0) {
          manualContext = '\n\nRelevant technical information from manuals:\n'
          chunks.forEach((chunk, idx) => {
            const manualTitle = chunk.manual_metadata?.title || 'Unknown Manual'
            const ref = `M${idx + 1}`
            manualContext += `\n[${ref}] From "${manualTitle}":\n`
            
            if (chunk.section_title) {
              manualContext += `Section: ${chunk.section_title}\n`
            }
            if (chunk.page_number) {
              manualContext += `Page: ${chunk.page_number}\n`
            }
            if (chunk.content_type) {
              manualContext += `Type: ${chunk.content_type}\n`
            }
            if (chunk.procedure_complexity) {
              manualContext += `Complexity: ${chunk.procedure_complexity}\n`
            }
            if (chunk.has_visual_elements) {
              manualContext += `Visual Elements: ${chunk.visual_content_type || 'Yes'}\n`
            }
            
            const contentPreview = chunk.content.substring(0, 400)
            manualContext += `Content: ${contentPreview}...\n`
            manualContext += '---\n'
          })
        }
        
        // Add WIS references to manual context
        if (wisReferences.length > 0) {
          manualContext += '\n\nRelevant WIS (Workshop Information System) data:\n'
          wisReferences.forEach(ref => {
            manualContext += `\n${ref}`
            manualContext += '---\n'
          })
        }
      }
    }

    // Prepare the system prompt with all context
    const systemPromptWithContext = BARRY_SYSTEM_PROMPT + vehicleContext + locationContext + manualContext

    // Convert OpenAI format messages to Claude format
    const claudeMessages = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content
    }))

    // Call Claude API
    const anthropicResponse = await fetch(ANTHROPIC_API_URL, {
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
        temperature: 0.7
      })
    })

    if (!anthropicResponse.ok) {
      const error = await anthropicResponse.text()
      console.error('Claude API error:', error)
      throw new Error(`Claude API error: ${anthropicResponse.status}`)
    }

    const data = await anthropicResponse.json()

    // Return the response in OpenAI format for compatibility
    return new Response(
      JSON.stringify({
        choices: [{
          message: {
            role: 'assistant',
            content: data.content[0].text
          },
          finish_reason: data.stop_reason || 'stop'
        }],
        usage: {
          prompt_tokens: data.usage?.input_tokens || 0,
          completion_tokens: data.usage?.output_tokens || 0,
          total_tokens: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0)
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error in chat-with-barry-claude:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An error occurred processing your request' 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})