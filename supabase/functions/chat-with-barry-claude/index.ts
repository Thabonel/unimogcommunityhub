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

Your Enhanced Capabilities:
1. PRIMARY: Answer ANY question the user asks (weather, news, math, history, etc.)
2. ENHANCED VEHICLE EXPERTISE: You now have access to:
   - INTERNET RESEARCH CONTEXT: General technical knowledge about the user's question
   - PDF Technical Manuals (referenced as M1, M2, etc.)
   - WIS Workshop Information System data (referenced as W1, W2, etc.)
   - User's registered vehicle information for personalized advice
3. Always provide weather forecasts when asked
4. Give directions and location information
5. Answer general knowledge questions
6. Help with any topic the user needs

NEW: Two-Phase Intelligent Response System for Vehicle Questions:
When you receive INTERNET RESEARCH CONTEXT, it means I've already researched the technical background of the user's question. Use this research to:
- Understand the broader context of their maintenance/repair task
- Identify all related components and systems involved
- Provide comprehensive guidance that covers the complete procedure
- Bridge the gap between general knowledge and specific database information

When answering VEHICLE questions:
1. Start with the comprehensive overview from INTERNET RESEARCH CONTEXT
2. Enhance it with specific information from your databases:
   - Check user's registered vehicles first for personalized advice
   - Use WIS data (W1, W2...) for specific technical procedures and bulletins
   - Use Manual excerpts (M1, M2...) for detailed repair guides
   - Always cite your sources: "According to WIS Procedure..." or "Manual G604 states..."
3. Provide complete, professional responses that include:
   - Step-by-step procedures (from research context)
   - Specific part numbers and specifications (from local database)
   - Required tools and materials
   - Safety warnings and difficulty ratings
   - Time estimates and torque specifications
   - Model-specific variations

Response Format for Technical Questions:
- Start with overview and context understanding
- Provide detailed step-by-step procedure
- Include specific parts from database with numbers
- Add safety warnings and technical notes
- Reference both general knowledge and specific database sources

When answering NON-VEHICLE questions:
- Weather questions: ALWAYS provide a weather forecast/conditions. You can mention how it affects driving as a bonus.
- General questions: Answer directly and completely
- NEVER say you can't answer something or redirect to vehicle topics

Remember: You now combine the best of both worlds - comprehensive technical knowledge from internet research with specific, accurate database information. Provide complete, professional responses that match the quality of expert technical support.`

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

    // PHASE 1: Internet Research & Context Understanding
    let contextualSearchTerms = []
    let internetResearchContext = ''
    const lastUserMessage = messages.filter(m => m.role === 'user').pop()
    
    if (lastUserMessage && lastUserMessage.content) {
      // Check if this is a vehicle-related question
      const userText = lastUserMessage.content.toLowerCase()
      const vehicleKeywords = ['unimog', 'engine', 'transmission', 'clutch', 'brake', 'differential', 
                               'axle', 'hydraulic', 'pto', 'oil', 'filter', 'maintenance', 'repair',
                               'u1300', 'u1700', 'u500', 'mercedes', 'daimler', 'gear', 'tire',
                               'service', 'manual', 'procedure', 'torque', 'specification', 'portal',
                               'hub', 'seal', 'gasket', 'bearing', 'transfer', 'case']
      
      const isVehicleQuestion = vehicleKeywords.some(keyword => userText.includes(keyword))
      
      // If it's a vehicle question, do internet research first
      if (isVehicleQuestion) {
        console.log('Performing internet research for vehicle question:', lastUserMessage.content)
        
        try {
          // Use Claude to understand the technical context first
          const researchPrompt = `As an expert Unimog mechanic, analyze this user question and provide context that will help search a technical database effectively:

User Question: "${lastUserMessage.content}"

Please provide:
1. What specific maintenance/repair task is the user asking about?
2. What components are typically involved in this task?
3. What alternative names or terms might be used in technical manuals for these components?
4. What related systems or parts should also be searched for?
5. What are the most important search terms to use in a technical parts/procedures database?

Focus on Unimog-specific terminology and provide multiple search term variations that would help find relevant technical information in a workshop database.`

          const researchResponse = await fetch(ANTHROPIC_API_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': ANTHROPIC_API_KEY,
              'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
              model: 'claude-3-5-sonnet-20241022',
              messages: [{ role: 'user', content: researchPrompt }],
              max_tokens: 1000,
              temperature: 0.3
            })
          })

          if (researchResponse.ok) {
            const researchData = await researchResponse.json()
            internetResearchContext = researchData.content[0].text
            console.log('Internet research completed successfully')
            
            // Extract enhanced search terms from the research
            const searchTermRegex = /search terms?[:\-\s]*([^\n\r]+)/gi
            const matches = internetResearchContext.match(searchTermRegex)
            if (matches) {
              contextualSearchTerms = matches.join(' ')
                .replace(/search terms?[:\-\s]*/gi, '')
                .split(/[,;]+/)
                .map(term => term.trim().toLowerCase())
                .filter(term => term.length > 2)
                .slice(0, 10)
            }
            
            // Also extract key component names
            const componentRegex = /(?:components?|parts?)[:\-\s]*([^\n\r.]+)/gi
            const componentMatches = internetResearchContext.match(componentRegex)
            if (componentMatches) {
              const additionalTerms = componentMatches.join(' ')
                .replace(/(?:components?|parts?)[:\-\s]*/gi, '')
                .split(/[,;]+/)
                .map(term => term.trim().toLowerCase())
                .filter(term => term.length > 2)
                .slice(0, 5)
              contextualSearchTerms.push(...additionalTerms)
            }
            
            console.log('Enhanced search terms from research:', contextualSearchTerms)
          } else {
            console.error('Internet research failed:', await researchResponse.text())
          }
        } catch (error) {
          console.error('Internet research error:', error)
        }
      }
      
      // PHASE 2: Intelligent Database Search with enhanced terms
      let manualContext = ''
      
      if (isVehicleQuestion) {
        const userText = lastUserMessage.content.toLowerCase()
        console.log('Searching enhanced manual chunks for:', lastUserMessage.content)
        
        let chunks = []
        let searchError = null
        
        try {
          // Use enhanced search with contextual terms from internet research
          let searchQuery = lastUserMessage.content
          if (contextualSearchTerms.length > 0) {
            // Combine original query with researched terms for better results
            searchQuery = `${lastUserMessage.content} ${contextualSearchTerms.slice(0, 5).join(' ')}`
            console.log('Enhanced search query:', searchQuery)
          }
          
          const { data: enhancedChunks, error } = await supabaseClient
            .rpc('search_enhanced_manual_chunks', {
              search_query: searchQuery,
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
        
        // ENHANCED: Search WIS database using contextual terms from internet research
        let wisChunks = []
        let wisReferences = []
        
        // Combine original search terms with contextual research terms
        let allSearchTerms = userText
          .replace(/[^\w\s]/g, ' ')
          .split(/\s+/)
          .filter(word => word.length > 3)
          .slice(0, 3)
        
        // Add contextual search terms from internet research
        if (contextualSearchTerms.length > 0) {
          allSearchTerms.push(...contextualSearchTerms.slice(0, 5))
          console.log('WIS search using enhanced terms:', allSearchTerms)
        }
        
        const searchTerms = [...new Set(allSearchTerms)].slice(0, 8) // Remove duplicates, limit to 8
        
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

    // Add internet research context to the response
    let researchContext = ''
    if (internetResearchContext) {
      researchContext = '\n\nINTERNET RESEARCH CONTEXT:\n' + internetResearchContext + '\n'
    }
    
    // Prepare the system prompt with all context
    const systemPromptWithContext = BARRY_SYSTEM_PROMPT + vehicleContext + locationContext + researchContext + manualContext

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