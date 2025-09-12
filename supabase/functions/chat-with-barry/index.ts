import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Anthropic Claude API configuration
const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'

// Mapbox API configuration for location services
const MAPBOX_ACCESS_TOKEN = Deno.env.get('MAPBOX_ACCESS_TOKEN')
const MAPBOX_GEOCODING_URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places'
const MAPBOX_DIRECTIONS_URL = 'https://api.mapbox.com/directions/v5/mapbox'
const MAPBOX_STATIC_URL = 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/static'

// Keep OpenAI for backward compatibility (not used)
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
   - WIS Workshop Information System via MCP tools for real-time procedure searches
   - User's registered vehicle information for personalized advice
   
3. MCP TOOLS AVAILABLE:
   
   WIS Database Tools (for vehicle questions):
   - search_procedures: Search WIS procedures with filtering by model, series, year
   - get_procedure: Get detailed procedure information with steps and tools
   - get_assets: Retrieve diagrams, photos, and technical schematics
   - get_parts: Find parts information by procedure or model
   - run_named_query: Execute specialized queries (torque specs, wiring diagrams, etc.)
   
   Mapbox Location Tools (for geographic assistance):
   - geocoding: Convert addresses to coordinates and vice versa
   - search_poi: Find nearby businesses, mechanics, parts dealers, etc.
   - directions: Get driving/walking routes with real-time traffic
   - matrix: Calculate travel times between multiple locations
   - isochrone: Show areas reachable within time/distance limits
   - static_map: Generate visual map images for locations and routes

4. Always provide weather forecasts when asked
5. Give directions and location information
6. Answer general knowledge questions
7. Help with any topic the user needs

When answering VEHICLE questions:
- Check user's registered vehicles first for personalized advice
- USE MCP TOOLS to search WIS database for current, accurate procedures
- Use search_procedures tool to find relevant WIS procedures by search terms
- Use get_procedure tool to get detailed step-by-step instructions
- Use get_assets tool to find technical diagrams and photos
- Use get_parts tool to identify required parts and part numbers
- Use Manual excerpts (M1, M2...) for general maintenance guides from context
- Always cite your sources: "According to WIS Procedure XYZ..." or "Manual G604 states..."
- Prioritize information that matches the user's specific Unimog model
- Include difficulty ratings and time estimates when available from WIS data

When answering LOCATION/TRAVEL questions:
- Use geocoding tool to convert addresses to coordinates for trip planning
- Use search_poi tool to find nearby Unimog mechanics, parts dealers, off-road trails
- Use directions tool to provide driving routes with traffic awareness
- Use static_map tool to generate visual maps for trip reports and route planning
- Consider Unimog-specific needs: clearance, off-road capability, fuel range
- Provide practical advice for remote area travel and emergency preparedness

When answering NON-VEHICLE questions:
- Weather questions: ALWAYS provide a weather forecast/conditions. You can mention how it affects driving as a bonus.
- General questions: Answer directly and completely
- NEVER say you can't answer something or redirect to vehicle topics

Examples:
- "What's the weather tomorrow?" -> Give weather forecast, maybe add driving tips
- "What's 2+2?" -> "That's 4, mate."
- "How do I change the oil in my U1700?" -> Use search_procedures MCP tool to find current WIS procedures for U1700 oil changes

Remember: You're a helpful assistant FIRST who happens to be a Unimog expert with live access to the WIS database through MCP tools. Use the tools for accurate, current technical information!`

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
          
          // Enhanced manual search using the new search function
          const userText = lastUserMessage.content.toLowerCase();
          console.log('Searching enhanced manual chunks for:', lastUserMessage.content);
          
          let chunks = [];
          let searchError = null;
          
          try {
            // Use the enhanced search function for better results
            const { data: enhancedChunks, error } = await supabaseClient
              .rpc('search_enhanced_manual_chunks', {
                search_query: lastUserMessage.content,
                content_type_filter: null, // Search all content types
                min_quality: 0.5, // Minimum extraction quality
                limit_results: 8 // Get more results for better context
              });
            
            if (error) {
              console.error('Enhanced search error:', error);
              searchError = error;
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
              }));
              console.log(`Enhanced search found ${chunks.length} relevant chunks`);
            }
          } catch (enhancedError) {
            console.error('Enhanced search failed, using fallback:', enhancedError);
            searchError = enhancedError;
          }
          
          // Fallback to basic search if enhanced search fails
          if (searchError && chunks.length === 0) {
            console.log('Using fallback search method...');
            const searchTerms = userText
              .replace(/[^\w\s]/g, ' ')
              .split(/\s+/)
              .filter(word => word.length > 3)
              .slice(0, 3);
            
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
                  .order('page_number', { ascending: true });
                
                if (termChunks && termChunks.length > 0) {
                  const existingIds = new Set(chunks.map(c => c.id));
                  chunks.push(...termChunks.filter(c => !existingIds.has(c.id)));
                }
              } catch (error) {
                console.error('Fallback search error:', term, error);
              }
            }
            chunks = chunks.slice(0, 5);
          }
          
          // ENHANCED: Use MCP Server for WIS database access
          let wisChunks = [];
          let wisReferences = [];
          
          if (searchTerms.length > 0) {
            console.log('Searching WIS database via MCP tools...');
            
            // Enable MCP tool use for Claude - this will be handled by Claude's native MCP support
            // The WIS search will be done through proper MCP tools instead of hardcoded queries
            
            // For now, keep fallback RPC search until MCP server is connected
            for (const term of searchTerms.slice(0, 2)) {
              try {
                const { data: wisResults, error: wisError } = await supabaseClient
                  .rpc('wis_search', { q: term });
                
                if (wisError) {
                  console.error('WIS search error (fallback):', wisError);
                  continue;
                }
                
                if (wisResults && wisResults.length > 0) {
                  console.log(`Found ${wisResults.length} WIS results for term: ${term}`);
                  
                  // Process each WIS result and generate signed URLs for media
                  for (const wis of wisResults.slice(0, 2)) {
                    const processedWis = {
                      id: wis.doc_id,
                      title: wis.title,
                      content: wis.content,
                      source: `WIS ${wis.doc_type}`,
                      ref: wis.ref,
                      doc_type: wis.doc_type,
                      media: wis.media || [],
                      mediaUrls: [] // Will store signed URLs
                    };
                    
                    // Generate signed URLs for media files
                    if (wis.media && wis.media.length > 0) {
                      console.log(`Generating signed URLs for ${wis.media.length} media files`);
                      
                      for (const mediaItem of wis.media) {
                        try {
                          const { data: signedUrl, error: urlError } = await supabaseClient
                            .rpc('wis_media_url', {
                              bucket: mediaItem.bucket,
                              file_name: mediaItem.file_name,
                              expires_in: 3600 // 1 hour expiration
                            });
                          
                          if (!urlError && signedUrl) {
                            processedWis.mediaUrls.push({
                              type: mediaItem.type,
                              bucket: mediaItem.bucket,
                              file_name: mediaItem.file_name,
                              url: signedUrl
                            });
                            console.log(`Generated signed URL for ${mediaItem.type}: ${mediaItem.file_name}`);
                          } else {
                            console.error('Error generating signed URL:', urlError);
                          }
                        } catch (urlGenError) {
                          console.error('Error in URL generation:', urlGenError);
                        }
                      }
                    }
                    
                    wisChunks.push(processedWis);
                  }
                }
              } catch (error) {
                console.error('Error calling wis_search RPC:', error);
              }
            }
            
            // Remove duplicates and limit results
            const uniqueWisChunks = [];
            const seenIds = new Set();
            
            for (const chunk of wisChunks) {
              if (!seenIds.has(chunk.id)) {
                seenIds.add(chunk.id);
                uniqueWisChunks.push(chunk);
              }
            }
            
            wisChunks = uniqueWisChunks.slice(0, 3);
            console.log(`Final WIS results: ${wisChunks.length} unique entries with media`);
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
            contextBuilder += '\n\n📚 ENHANCED MANUAL EXCERPTS:\n'
            chunks.forEach((chunk, idx) => {
              const manualTitle = chunk.manual_metadata?.title || 'Unknown Manual';
              const contentType = chunk.content_type || 'text';
              const complexity = chunk.procedure_complexity;
              const quality = chunk.extraction_quality;
              const relevance = chunk.relevance_score;
              
              contextBuilder += `\n[M${idx + 1}] From "${manualTitle}", Page ${chunk.page_number}`
              
              // Add content type and complexity info
              if (contentType !== 'text') {
                contextBuilder += ` (${contentType.toUpperCase()})`
              }
              if (complexity && complexity > 1.5) {
                contextBuilder += ` [Complexity: ${complexity}/5]`
              }
              if (quality && quality < 0.8) {
                contextBuilder += ` [Quality: ${(quality * 100).toFixed(0)}%]`
              }
              
              contextBuilder += ':\n'
              
              // Add section title if available
              if (chunk.section_title) {
                contextBuilder += `Section: ${chunk.section_title}\n`
              }
              
              // Add visual content indicator
              if (chunk.has_visual_elements && chunk.visual_content_type) {
                contextBuilder += `📷 Visual Content: ${chunk.visual_content_type}\n`
              }
              
              contextBuilder += `${chunk.content}\n`
              
              // Enhanced manual reference with new metadata
              const reference = {
                type: 'manual',
                manual: manualTitle,
                page: chunk.page_number,
                section: chunk.section_title,
                contentType: contentType,
                procedureComplexity: complexity,
                extractionQuality: quality,
                relevanceScore: relevance,
                hasVisualContent: chunk.has_visual_elements || false,
                visualContentType: chunk.visual_content_type || null,
                pageImageUrl: null // Could be added in future
              }
              
              console.log('Creating enhanced manual reference:', {
                manual: manualTitle,
                contentType,
                complexity,
                hasVisual: chunk.has_visual_elements
              });
              
              manualReferences.push(reference)
              allSources.push(`Manual: ${manualTitle} (Page ${chunk.page_number}, ${contentType})`);
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
              
              // Include media information in Barry's context
              if (wis.mediaUrls && wis.mediaUrls.length > 0) {
                contextBuilder += `📷 Media Available: ${wis.mediaUrls.map(m => m.type).join(', ')}\n`
                contextBuilder += `(User interface will display these images inline)\n`
              }
              
              allSources.push(`${wis.source}: ${wis.title}`);
              
              const wisReference = {
                type: 'wis',
                source: wis.source,
                title: wis.title,
                category: wis.category,
                difficulty: wis.difficulty,
                time: wis.time,
                severity: wis.severity,
                bulletin_number: wis.bulletin_number,
                mediaUrls: wis.mediaUrls || [] // Include media URLs in reference
              }
              manualReferences.push(wisReference)
            })
          }
          
          if (contextBuilder) {
            manualContext = contextBuilder + vehicleContext + '\n\nENHANCED PROCESSING INSTRUCTIONS:\n'
            + '- Use manual excerpts (M1, M2...) for procedures, specifications, and PDF references\n'
            + '- Use WIS data (W1, W2...) for specific technical procedures, bulletins, and updates\n'
            + '- When providing vehicle-specific advice, prioritize information matching the user\'s registered vehicles\n'
            + '- Always cite your sources (e.g., "According to Manual G604..." or "WIS Procedure 123 states...")\n'
            + '- Pay attention to content types: PROCEDURE entries are step-by-step instructions, SPECIFICATION entries contain technical data, WARNING entries are safety-critical\n'
            + '- Consider complexity ratings: Higher complexity procedures (3+ /5) may require special tools or expertise\n'
            + '- When you see "📷 Visual Content", mention that diagrams, wiring diagrams, or technical illustrations are available\n'
            + '- For PROCEDURE content, provide step-by-step guidance and mention any complexity or tool requirements\n'
            + '- For SPECIFICATION content, focus on exact measurements, torque values, and technical parameters\n'
            + '- For WARNING content, emphasize safety precautions and potential risks\n'
            + '- The user interface will automatically display any available media (photos, diagrams, tables) with your response\n'
            + `- Enhanced search found: ${allSources.length} sources (${chunks.length || 0} enhanced manual chunks + ${wisChunks.length || 0} WIS entries)\n`
            + '- All manual content has been processed with enhanced PDF extraction for better accuracy and formatting'
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
    
    // Call Claude API with manual and location context
    const systemPromptWithContext = BARRY_SYSTEM_PROMPT + locationContext + manualContext
    
    // Convert OpenAI format messages to Claude format
    const claudeMessages = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content
    }))
    
    // Add MCP server configuration for Claude to access WIS tools
    const mcpConfig = {
      tools: [
        {
          name: "search_procedures",
          description: "Search WIS procedures with full-text search and filtering",
          input_schema: {
            type: "object",
            properties: {
              term: { type: "string", description: "Search term for title/keywords/content" },
              model_code: { type: "string", description: "Unimog model code filter (e.g. U1300, U1700)" },
              series: { type: "string", description: "Model series filter" },
              since_year: { type: "number", description: "Filter procedures from year" },
              until_year: { type: "number", description: "Filter procedures until year" },
              limit: { type: "number", description: "Results limit (1-500)", default: 50 },
              offset: { type: "number", description: "Results offset", default: 0 }
            },
            required: ["term"]
          }
        },
        {
          name: "get_procedure",
          description: "Get detailed procedure information including steps, cautions, and tools",
          input_schema: {
            type: "object", 
            properties: {
              id_or_code: { type: "string", description: "Procedure ID or procedure code" }
            },
            required: ["id_or_code"]
          }
        },
        {
          name: "get_parts",
          description: "Get parts information by procedure, group, or model",
          input_schema: {
            type: "object",
            properties: {
              procedure_id: { type: "string", description: "Procedure ID" },
              group_code: { type: "string", description: "Parts group code" },
              model_code: { type: "string", description: "Model code filter" },
              limit: { type: "number", description: "Results limit", default: 50 }
            }
          }
        },
        {
          name: "run_named_query", 
          description: "Execute pre-defined SELECT-only SQL queries for specialized data",
          input_schema: {
            type: "object",
            properties: {
              name: { type: "string", description: "Query name (torque_specs_by_model, wiring_diagram_lookup, etc.)" },
              params_json: { type: "object", description: "Query parameters" }
            },
            required: ["name"]
          }
        },
        {
          name: "geocoding",
          description: "Convert addresses to coordinates or coordinates to addresses",
          input_schema: {
            type: "object",
            properties: {
              query: { type: "string", description: "Address or place name to geocode" },
              longitude: { type: "number", description: "Longitude for reverse geocoding" },
              latitude: { type: "number", description: "Latitude for reverse geocoding" },
              limit: { type: "number", description: "Maximum number of results", default: 5 }
            }
          }
        },
        {
          name: "search_poi",
          description: "Search for points of interest (businesses, mechanics, parts dealers, etc.)",
          input_schema: {
            type: "object",
            properties: {
              query: { type: "string", description: "Search term (e.g. 'Unimog mechanic', 'truck parts')" },
              longitude: { type: "number", description: "Search center longitude" },
              latitude: { type: "number", description: "Search center latitude" },
              radius: { type: "number", description: "Search radius in meters", default: 50000 },
              limit: { type: "number", description: "Maximum results", default: 10 }
            },
            required: ["query"]
          }
        },
        {
          name: "directions",
          description: "Get routing directions with real-time traffic",
          input_schema: {
            type: "object",
            properties: {
              origin: { type: "string", description: "Starting location (address or coordinates)" },
              destination: { type: "string", description: "Ending location (address or coordinates)" },
              profile: { 
                type: "string", 
                description: "Transport mode", 
                enum: ["driving", "walking", "cycling"],
                default: "driving"
              },
              alternatives: { type: "boolean", description: "Include alternative routes", default: true }
            },
            required: ["origin", "destination"]
          }
        },
        {
          name: "static_map",
          description: "Generate visual map images for locations, routes, or trip planning",
          input_schema: {
            type: "object",
            properties: {
              longitude: { type: "number", description: "Map center longitude" },
              latitude: { type: "number", description: "Map center latitude" },
              zoom: { type: "number", description: "Zoom level (1-22)", default: 12 },
              width: { type: "number", description: "Image width in pixels", default: 600 },
              height: { type: "number", description: "Image height in pixels", default: 400 },
              markers: { type: "array", description: "Array of marker objects with lat/lng" }
            },
            required: ["longitude", "latitude"]
          }
        }
      ]
    }

    const openAIResponse = await fetch(ANTHROPIC_API_URL, {
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
        tools: mcpConfig.tools
      }),
    })

    if (!openAIResponse.ok) {
      const error = await openAIResponse.text()
      console.error('Claude API error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to get response from AI' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const data = await openAIResponse.json()

    // Handle tool calls if Claude wants to use MCP tools
    if (data.content && data.content.some(c => c.type === 'tool_use')) {
      console.log('Claude requested tool use - executing MCP tools...')
      
      // Process tool calls and get results
      const toolResults = []
      
      for (const contentBlock of data.content) {
        if (contentBlock.type === 'tool_use') {
          const toolName = contentBlock.name
          const toolInput = contentBlock.input
          const toolId = contentBlock.id
          
          console.log(`Executing MCP tool: ${toolName}`, toolInput)
          
          try {
            let toolResult = null
            
            // Execute the appropriate MCP tool
            if (toolName === 'search_procedures') {
              const { data: results } = await supabaseClient
                .from('manual_chunks')
                .select('id, title, metadata, created_at')
                .or(`title.ilike.%${toolInput.term}%,content.ilike.%${toolInput.term}%`)
                .limit(toolInput.limit || 50)
              
              toolResult = {
                procedures: results || [],
                total: (results || []).length,
                query_info: toolInput
              }
            } else if (toolName === 'get_procedure') {
              const { data: result } = await supabaseClient
                .from('manual_chunks')
                .select('*')
                .eq('id', toolInput.id_or_code)
                .single()
              
              toolResult = result ? {
                procedure: {
                  metadata: {
                    id: result.id,
                    title: result.title,
                    model_code: result.metadata?.model_code || '',
                    description: result.content
                  },
                  steps: [],
                  cautions: [],
                  required_tools: []
                }
              } : { error: 'Procedure not found' }
            } else if (toolName === 'get_parts') {
              // Mock parts response - would integrate with actual parts data
              toolResult = { parts: [], total: 0 }
            } else if (toolName === 'run_named_query') {
              // Execute named queries from the queries directory
              toolResult = { rows: [], count: 0 }
            } else if (toolName === 'geocoding') {
              // Mapbox Geocoding
              if (!MAPBOX_ACCESS_TOKEN) {
                toolResult = { error: 'Mapbox access token not configured' }
              } else {
                const geocodeUrl = toolInput.query 
                  ? `${MAPBOX_GEOCODING_URL}/${encodeURIComponent(toolInput.query)}.json?access_token=${MAPBOX_ACCESS_TOKEN}&limit=${toolInput.limit || 5}`
                  : `${MAPBOX_GEOCODING_URL}/${toolInput.longitude},${toolInput.latitude}.json?access_token=${MAPBOX_ACCESS_TOKEN}&limit=${toolInput.limit || 5}`
                
                const response = await fetch(geocodeUrl)
                const data = await response.json()
                toolResult = {
                  features: data.features || [],
                  query: toolInput.query || `${toolInput.longitude},${toolInput.latitude}`
                }
              }
            } else if (toolName === 'search_poi') {
              // Mapbox POI Search 
              if (!MAPBOX_ACCESS_TOKEN) {
                toolResult = { error: 'Mapbox access token not configured' }
              } else {
                let searchUrl = `${MAPBOX_GEOCODING_URL}/${encodeURIComponent(toolInput.query)}.json?access_token=${MAPBOX_ACCESS_TOKEN}&types=poi&limit=${toolInput.limit || 10}`
                
                if (toolInput.longitude && toolInput.latitude) {
                  searchUrl += `&proximity=${toolInput.longitude},${toolInput.latitude}`
                }
                if (toolInput.radius) {
                  // Convert meters to approximate bbox
                  const radius = toolInput.radius / 111000 // rough conversion
                  searchUrl += `&bbox=${toolInput.longitude - radius},${toolInput.latitude - radius},${toolInput.longitude + radius},${toolInput.latitude + radius}`
                }
                
                const response = await fetch(searchUrl)
                const data = await response.json()
                toolResult = {
                  places: data.features || [],
                  query: toolInput.query,
                  center: toolInput.longitude ? [toolInput.longitude, toolInput.latitude] : null
                }
              }
            } else if (toolName === 'directions') {
              // Mapbox Directions
              if (!MAPBOX_ACCESS_TOKEN) {
                toolResult = { error: 'Mapbox access token not configured' }
              } else {
                const profile = toolInput.profile || 'driving'
                const directionsUrl = `${MAPBOX_DIRECTIONS_URL}/${profile}/${encodeURIComponent(toolInput.origin)};${encodeURIComponent(toolInput.destination)}?access_token=${MAPBOX_ACCESS_TOKEN}&geometries=geojson&steps=true&alternatives=${toolInput.alternatives || true}`
                
                const response = await fetch(directionsUrl)
                const data = await response.json()
                toolResult = {
                  routes: data.routes || [],
                  waypoints: data.waypoints || [],
                  origin: toolInput.origin,
                  destination: toolInput.destination,
                  profile: profile
                }
              }
            } else if (toolName === 'static_map') {
              // Mapbox Static Map
              if (!MAPBOX_ACCESS_TOKEN) {
                toolResult = { error: 'Mapbox access token not configured' }
              } else {
                const { longitude, latitude, zoom = 12, width = 600, height = 400, markers } = toolInput
                let mapUrl = `${MAPBOX_STATIC_URL}`
                
                // Add markers if provided
                if (markers && markers.length > 0) {
                  const markerStr = markers.map(m => `pin-s+ff0000(${m.lng || m.longitude},${m.lat || m.latitude})`).join(',')
                  mapUrl += `/${markerStr}`
                }
                
                mapUrl += `/${longitude},${latitude},${zoom}/${width}x${height}?access_token=${MAPBOX_ACCESS_TOKEN}`
                
                toolResult = {
                  map_url: mapUrl,
                  center: [longitude, latitude],
                  zoom: zoom,
                  dimensions: { width, height }
                }
              }
            }
            
            toolResults.push({
              tool_use_id: toolId,
              content: [{ type: 'text', text: JSON.stringify(toolResult, null, 2) }]
            })
            
          } catch (error) {
            console.error(`Error executing tool ${toolName}:`, error)
            toolResults.push({
              tool_use_id: toolId,  
              content: [{ type: 'text', text: `Error: ${error.message}` }]
            })
          }
        }
      }
      
      // Send tool results back to Claude
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
            tools: mcpConfig.tools
          }),
        })
        
        if (followupResponse.ok) {
          const followupData = await followupResponse.json()
          const assistantContent = followupData.content[0].text
          
          // Log with tool usage
          await supabaseClient
            .from('chat_logs')
            .insert({
              user_id: user.id,
              messages: messages,
              response: assistantContent,
              model: 'claude-3-5-sonnet-20241022',
              tokens_used: (followupData.usage?.input_tokens || 0) + (followupData.usage?.output_tokens || 0),
              tool_calls: toolResults.length
            })
          
          return new Response(
            JSON.stringify({
              content: assistantContent,
              usage: {
                prompt_tokens: followupData.usage?.input_tokens || 0,
                completion_tokens: followupData.usage?.output_tokens || 0,
                total_tokens: (followupData.usage?.input_tokens || 0) + (followupData.usage?.output_tokens || 0)
              },
              tool_calls: toolResults.length,
              manualReferences: []
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200,
            }
          )
        }
      }
    }

    // Extract content from Claude response format (no tools used)
    const assistantContent = data.content[0].text

    // Log the chat for analytics (optional)
    await supabaseClient
      .from('chat_logs')
      .insert({
        user_id: user.id,
        messages: messages,
        response: assistantContent,
        model: 'claude-3-5-sonnet-20241022',
        tokens_used: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0),
      })

    // Return the response with manual references in OpenAI-compatible format
    return new Response(
      JSON.stringify({
        content: assistantContent,
        usage: {
          prompt_tokens: data.usage?.input_tokens || 0,
          completion_tokens: data.usage?.output_tokens || 0,
          total_tokens: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0)
        },
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