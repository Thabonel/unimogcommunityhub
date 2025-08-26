import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'
const OPENAI_EMBEDDING_URL = 'https://api.openai.com/v1/embeddings'

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
    
    // Get user's profile and vehicle information for personalized responses
    let userVehicles = []
    let vehicleContext = ''
    
    try {
      // First, get the user's profile to fetch their primary Unimog model
      const { data: profile, error: profileError } = await supabaseClient
        .from('profiles')
        .select('unimog_model, full_name, display_name')
        .eq('id', user.id)
        .single()
      
      if (!profileError && profile) {
        // Add user's primary Unimog model from profile if available
        if (profile.unimog_model) {
          vehicleContext = `\n\nUser's Primary Unimog: ${profile.unimog_model}\n`
          
          // Add user's name if available for more personalized responses
          const userName = profile.full_name || profile.display_name
          if (userName) {
            vehicleContext += `User's Name: ${userName}\n`
          }
          
          vehicleContext += `Always remember and reference the user's ${profile.unimog_model} when providing technical advice.\n`
        }
      }
      
      // Then get any additional vehicles from the vehicles table
      const { data: vehicles, error: vehicleError } = await supabaseClient
        .from('vehicles')
        .select('id, make, model, year, engine_type, trim')
        .eq('user_id', user.id)
        .limit(5)
      
      if (!vehicleError && vehicles && vehicles.length > 0) {
        userVehicles = vehicles
        if (vehicleContext === '') {
          vehicleContext = `\n\nUser's registered vehicles:\n`
        } else {
          vehicleContext += `\nAdditional registered vehicles:\n`
        }
        vehicles.forEach((vehicle, idx) => {
          vehicleContext += `[${idx + 1}] ${vehicle.year || 'Unknown'} ${vehicle.make || 'Unknown'} ${vehicle.model || 'Unknown'}`
          if (vehicle.engine_type) vehicleContext += ` (${vehicle.engine_type})`
          vehicleContext += `\n`
        })
        vehicleContext += `When providing vehicle-specific advice, prioritize information for these models.`
      } else if (vehicleContext === '') {
        console.log('No user vehicles or profile model found')
      }
    } catch (error) {
      console.log('Error fetching user profile/vehicles:', error)
    }
    
    // Search for relevant manual and WIS content
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
          
          // WORKAROUND: Use direct table search instead of RPC function due to parameter conflicts
          // Extract meaningful keywords from user question for search
          const userText = lastUserMessage.content.toLowerCase();
          const searchTerms = [];
          
          // Look for vehicle-related keywords
          const vehicleKeywords = ['unimog', 'engine', 'oil', 'brake', 'transmission', 'hydraulic', 'clutch', 'differential', 'axle', 'tire', 'wheel', 'maintenance', 'service', 'repair', 'replace', 'change', 'check', 'adjust', 'lubricate', 'filter', 'fluid', 'coolant', 'belt', 'hose', 'gasket', 'seal'];
          
          for (const keyword of vehicleKeywords) {
            if (userText.includes(keyword)) {
              searchTerms.push(keyword);
            }
          }
          
          // If no vehicle keywords, use general terms
          if (searchTerms.length === 0) {
            searchTerms.push(...userText
              .replace(/[^\w\s]/g, ' ')
              .split(/\s+/)
              .filter(word => word.length > 3)
              .slice(0, 2)
            );
          }
          
          console.log('Searching manual chunks with terms:', searchTerms);
          
          let chunks = [];
          let searchError = null;
          
          if (searchTerms.length > 0) {
            // Search for each term and combine results
            for (const term of searchTerms.slice(0, 3)) {
              try {
                const { data: termChunks } = await supabaseClient
                  .from('manual_chunks')
                  .select('id, manual_id, manual_title, chunk_index, page_number, section_title, content')
                  .ilike('content', `%${term}%`)
                  .limit(3)
                  .order('page_number', { ascending: true });
                
                if (termChunks && termChunks.length > 0) {
                  // Add unique chunks
                  const existingIds = new Set(chunks.map(c => c.id));
                  chunks.push(...termChunks.filter(c => !existingIds.has(c.id)));
                }
              } catch (error) {
                console.error('Search term error:', term, error);
              }
            }
            
            // Limit total results
            chunks = chunks.slice(0, 5);
          }
          
          // ENHANCED: Search WIS database for additional technical information
          let wisChunks = [];
          let wisReferences = [];
          
          if (searchTerms.length > 0) {
            console.log('Searching WIS database...');
            
            // Determine vehicle filter for WIS search
            let vehicleFilter = '';
            if (userVehicles.length > 0) {
              // Create model filter from user vehicles
              const userModels = userVehicles.map(v => v.model).filter(Boolean);
              console.log('Filtering WIS for user models:', userModels);
            }
            
            // Search WIS procedures
            for (const term of searchTerms.slice(0, 2)) {
              try {
                const { data: procedures } = await supabaseClient
                  .from('wis_procedures')
                  .select('id, title, description, content, category, difficulty_level, estimated_time_minutes')
                  .or(`title.ilike.%${term}%,description.ilike.%${term}%,content.ilike.%${term}%`)
                  .limit(2)
                  .order('difficulty_level', { ascending: true });
                
                if (procedures && procedures.length > 0) {
                  procedures.forEach(proc => {
                    wisChunks.push({
                      id: proc.id,
                      title: proc.title,
                      content: proc.content || proc.description,
                      source: 'WIS Procedure',
                      category: proc.category,
                      difficulty: proc.difficulty_level,
                      time: proc.estimated_time_minutes
                    });
                  });
                }
              } catch (error) {
                console.error('WIS procedures search error:', error);
              }
            }
            
            // Search WIS bulletins
            for (const term of searchTerms.slice(0, 2)) {
              try {
                const { data: bulletins } = await supabaseClient
                  .from('wis_bulletins')
                  .select('id, title, description, content, category, severity, bulletin_number')
                  .or(`title.ilike.%${term}%,description.ilike.%${term}%,content.ilike.%${term}%`)
                  .limit(2)
                  .order('severity', { ascending: false }); // High severity first
                
                if (bulletins && bulletins.length > 0) {
                  bulletins.forEach(bulletin => {
                    wisChunks.push({
                      id: bulletin.id,
                      title: bulletin.title,
                      content: bulletin.content || bulletin.description,
                      source: 'WIS Technical Bulletin',
                      bulletin_number: bulletin.bulletin_number,
                      severity: bulletin.severity,
                      category: bulletin.category
                    });
                  });
                }
              } catch (error) {
                console.error('WIS bulletins search error:', error);
              }
            }
            
            // Limit WIS results
            wisChunks = wisChunks.slice(0, 3);
            console.log(`Found ${wisChunks.length} WIS results`);
          }
          
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
          
          // Combine manual chunks and WIS data for comprehensive context
          const allSources = [];
          let contextBuilder = '';
          
          if (!searchError && chunks && chunks.length > 0) {
            contextBuilder += '\n\n📚 MANUAL EXCERPTS:\n'
            chunks.forEach((chunk, idx) => {
              contextBuilder += `\n[M${idx + 1}] From "${chunk.manual_title}", Page ${chunk.page_number}:\n${chunk.content}\n`
              
              // Enhanced manual reference with image data
              const reference = {
                type: 'manual',
                manual: chunk.manual_title,
                page: chunk.page_number,
                section: chunk.section_title,
                pageImageUrl: chunk.page_image_url || null,
                hasVisualContent: chunk.has_visual_elements || false,
                visualContentType: chunk.visual_content_type || 'text'
              }
              
              manualReferences.push(reference)
              allSources.push(`Manual: ${chunk.manual_title} (Page ${chunk.page_number})`);
              
              // Add visual content note to context if available
              if (chunk.has_visual_elements) {
                contextBuilder += `[This page contains ${chunk.visual_content_type} content - refer user to the manual panel for visual details]\n`
              }
            })
          }
          
          if (wisChunks && wisChunks.length > 0) {
            contextBuilder += '\n\n🔧 WIS TECHNICAL DATA:\n'
            wisChunks.forEach((wis, idx) => {
              contextBuilder += `\n[W${idx + 1}] ${wis.source}: "${wis.title}"\n`
              if (wis.category) contextBuilder += `Category: ${wis.category}\n`
              if (wis.difficulty) contextBuilder += `Difficulty: ${wis.difficulty}/5\n`
              if (wis.time) contextBuilder += `Est. Time: ${wis.time} minutes\n`
              if (wis.severity) contextBuilder += `Severity: ${wis.severity}\n`
              if (wis.bulletin_number) contextBuilder += `Bulletin: ${wis.bulletin_number}\n`
              contextBuilder += `${wis.content}\n`
              
              allSources.push(`${wis.source}: ${wis.title}`);
              
              const wisReference = {
                type: 'wis',
                source: wis.source,
                title: wis.title,
                category: wis.category,
                difficulty: wis.difficulty,
                time: wis.time,
                severity: wis.severity,
                bulletin_number: wis.bulletin_number
              }
              manualReferences.push(wisReference)
            })
          }
          
          if (contextBuilder) {
            manualContext = contextBuilder + vehicleContext + '\n\nIMPORTANT INSTRUCTIONS:\n'
            + '- Use manual excerpts (M1, M2...) for general procedures and PDF references\n'
            + '- Use WIS data (W1, W2...) for specific technical procedures, bulletins, and updates\n'
            + '- When providing vehicle-specific advice, prioritize information matching the user\'s registered vehicles\n'
            + '- Always cite your sources (e.g., "According to Manual G604..." or "WIS Procedure 123 states...")\n'
            + '- For visual content, mention that diagrams can be viewed in the manual panel\n'
            + `- Total sources available: ${allSources.length} (${chunks.length || 0} manuals + ${wisChunks.length || 0} WIS entries)`
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
      locationContext = `\n\nCRITICAL CONTEXT:
User's current location: Latitude ${location.latitude.toFixed(4)}, Longitude ${location.longitude.toFixed(4)}
Today's date: ${new Date().toLocaleDateString()}
Current time: ${new Date().toLocaleTimeString()}
When asked about weather, use this location to provide accurate local weather information.
You have access to current weather data and forecasts for this location.`
    } else {
      locationContext = `\n\nCRITICAL CONTEXT:
Today's date: ${new Date().toLocaleDateString()}
Current time: ${new Date().toLocaleTimeString()}
Location not provided, but still answer weather questions with general information.`
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