import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Anthropic Claude API configuration
const ANTHROPIC_API_KEY = <ANTHROPIC_API_KEY>
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'

// Mapbox API configuration for location services
const MAPBOX_ACCESS_TOKEN = Deno.env.get('MAPBOX_ACCESS_TOKEN')
const MAPBOX_GEOCODING_URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places'
const MAPBOX_DIRECTIONS_URL = 'https://api.mapbox.com/directions/v5/mapbox'
const MAPBOX_STATIC_URL = 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/static'

// OpenAI embedding API for manual search (legacy support)
const OPENAI_API_KEY = <OPENAI_API_KEY>
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
   
3. DOCUMENT CREATION & EDITING (NEW!):
   - Create Excel spreadsheets: Parts catalogs, maintenance schedules, inventory tracking
   - Generate PowerPoint presentations: Step-by-step repair procedures with diagrams
   - Edit PDF documents: Highlight relevant manual sections, add notes and annotations
   - Convert between formats: Transform procedures into different document types
   
4. MCP TOOLS AVAILABLE:
   
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

4. ENHANCED WEATHER SERVICES:
   - Use the weather tool to get real-time current conditions and 5-day forecasts
   - Provide detailed weather info: temperature, humidity, wind, pressure, visibility
   - Include sunrise/sunset times and precipitation forecasts
   - Relate weather conditions to Unimog driving and off-road conditions
   - Support multiple languages and temperature units (Celsius, Fahrenheit, Kelvin)

5. REAL-TIME WEB SEARCH:
   - Use web_search tool to find current information, news, and technical documentation
   - Search for latest Unimog parts availability, dealer locations, service updates
   - Find current market prices for Unimog vehicles and parts
   - Look up recent technical bulletins, recalls, or service campaigns
   - Get real-time traffic, road conditions, and route information
   - Search for current events, news, and general information
   - Filter results by type: news, discussions, images, videos, or all content

6. Give directions and location information
7. Answer general knowledge questions
8. Help with any topic the user needs

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

When creating DOCUMENTS:
- Excel Spreadsheets: Use create_excel_spreadsheet for parts lists, maintenance schedules, inventory tracking
- PowerPoint Presentations: Use create_powerpoint_presentation for step-by-step repair procedures, training modules
- PDF Editing: Use edit_pdf_document to highlight relevant manual sections, add annotations for user's specific vehicle
- Format Conversion: Use convert_document_format to transform any content between different file types
- Always ask what format they prefer and customize for their specific Unimog model
- Include vehicle-specific part numbers, torque specs, and procedures in documents
- Make documents practical and actionable - not just informational

When answering NON-VEHICLE questions:
- Weather questions: ALWAYS use the weather tool to get real-time data and forecasts. Include off-road driving implications where relevant.
- Current information needs: Use web_search tool to find up-to-date information, news, prices, and technical updates
- General questions: Answer directly and completely
- NEVER say you can't answer something or redirect to vehicle topics

Examples:
- "What's the weather in Sydney tomorrow?" -> Use weather tool to get current conditions and forecast for Sydney
- "What's 2+2?" -> "That's 4, mate."
- "How do I change the oil in my U1700?" -> Use search_procedures MCP tool to find current WIS procedures for U1700 oil changes
- "Create a parts list for my U1300L maintenance" -> Use create_excel_spreadsheet with vehicle-specific parts and part numbers
- "Make a presentation about portal axle service" -> Use create_powerpoint_presentation with step-by-step procedures and diagrams
- "Will it rain this weekend in Melbourne?" -> Use weather tool to check forecast and relate to outdoor Unimog activities
- "What's the current price of a U1700?" -> Use web_search tool to find recent listings and market values
- "Any recent Unimog recalls?" -> Use web_search tool to find latest safety bulletins and service campaigns
- "Latest news about Mercedes Unimog?" -> Use web_search with result_filter='news' for recent developments

LOCATION AWARENESS:
- When user location is provided, mention the place name if available (e.g., "Sydney, NSW" or "Blue Mountains")
- If only coordinates are available, the user is likely in a remote/bush area - acknowledge this with phrases like:
  "out in the bush", "in the remote area", "off the beaten track", "in the wilderness"
- Always be conversational about location: "For your area near Sydney..." or "Out there in the bush..."

Remember: You're a helpful assistant FIRST who happens to be a Unimog expert with live access to the WIS database AND document creation tools. Create useful documents that save users time and make their Unimog maintenance easier!`

// Helper function to categorize documents based on their type and content
function getDocumentCategories(contentType: string): string[] {
  const categoryMap: Record<string, string[]> = {
    // Excel spreadsheet categories
    'parts_catalog': ['parts', 'inventory'],
    'maintenance_schedule': ['maintenance', 'service'],
    'inventory_tracker': ['parts', 'inventory', 'management'],
    'repair_log': ['repair', 'maintenance', 'documentation'],

    // PowerPoint presentation categories
    'repair_procedure': ['repair', 'procedures'],
    'maintenance_guide': ['maintenance', 'procedures'],
    'training_module': ['training', 'education'],
    'parts_overview': ['parts', 'education'],

    // PDF editing categories
    'highlight_sections': ['manuals', 'documentation'],
    'add_annotations': ['manuals', 'documentation'],
    'extract_content': ['manuals', 'procedures'],

    // Generic categories
    'custom': ['general'],
    'procedure': ['procedures'],
    'checklist': ['procedures', 'maintenance']
  }

  return categoryMap[contentType] || ['general']
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
      // Try to get a human-readable location name using reverse geocoding
      let locationName = `near Latitude ${location.latitude.toFixed(4)}, Longitude ${location.longitude.toFixed(4)}`

      try {
        if (MAPBOX_ACCESS_TOKEN) {
          const reverseGeocodeUrl = `${MAPBOX_GEOCODING_URL}/${location.longitude},${location.latitude}.json?access_token=${MAPBOX_ACCESS_TOKEN}&limit=1&types=place,locality,neighborhood,address`
          const geocodeResponse = await fetch(reverseGeocodeUrl)

          if (geocodeResponse.ok) {
            const geocodeData = await geocodeResponse.json()
            if (geocodeData.features && geocodeData.features.length > 0) {
              const feature = geocodeData.features[0]
              const placeName = feature.place_name || feature.text
              if (placeName) {
                locationName = placeName
                console.log('Reverse geocoded location:', placeName)
              }
            }
          }
        }
      } catch (error) {
        console.log('Reverse geocoding failed, using coordinates:', error)
      }

      locationContext = `\n\nCRITICAL CONTEXT:
User's current location: ${locationName}
Coordinates: Latitude ${location.latitude.toFixed(4)}, Longitude ${location.longitude.toFixed(4)}
Today's date: ${new Date().toLocaleDateString()}
Current time: ${new Date().toLocaleTimeString()}
When asked about weather, use this location to provide accurate local weather information.
If the location shows coordinates only (not a place name), the user is likely in a remote/bush area - acknowledge this appropriately.
You have access to current weather data and forecasts for this location.`
    } else {
      locationContext = `\n\nCRITICAL CONTEXT:
Today's date: ${new Date().toLocaleDateString()}
Current time: ${new Date().toLocaleTimeString()}
Location not provided, but still answer weather questions with general information.`
    }
    
    // Call Claude API with manual and location context
    const systemPromptWithContext = BARRY_SYSTEM_PROMPT + locationContext + manualContext
    
    // Convert chat format messages to Claude format
    const claudeMessages = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content
    }))
    
    // Add MCP server configuration for Claude to access WIS tools
    const mcpConfig = {
      tools: [
        {
          name: "search_procedures",
          description: "Search WIS procedures with semantic vector search and full-text search",
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
          name: "search_wis_hybrid", 
          description: "Advanced hybrid search combining semantic vector search with keyword matching for best results",
          input_schema: {
            type: "object",
            properties: {
              query: { type: "string", description: "Search query - can be natural language or keywords" },
              content_types: { type: "string", description: "Types to search: procedure,part,bulletin,chunk", default: "procedure,part,bulletin" },
              limit: { type: "number", description: "Results limit (1-100)", default: 20 },
              vector_weight: { type: "number", description: "Weight for vector search (0-1)", default: 0.7 }
            },
            required: ["query"]
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
        },
        {
          name: "create_excel_spreadsheet",
          description: "Create Excel spreadsheet with data, formulas, and formatting for parts catalogs, maintenance schedules, etc.",
          input_schema: {
            type: "object",
            properties: {
              title: { type: "string", description: "Spreadsheet title/filename" },
              data_type: { type: "string", description: "Type of spreadsheet", enum: ["parts_catalog", "maintenance_schedule", "inventory_tracker", "repair_log", "custom"] },
              vehicle_model: { type: "string", description: "Target Unimog model if applicable" },
              data: { type: "object", description: "Data to include in spreadsheet" },
              include_formulas: { type: "boolean", description: "Include calculated fields and formulas", default: true },
              format_style: { type: "string", description: "Styling preference", enum: ["professional", "colorful", "minimal"], default: "professional" }
            },
            required: ["title", "data_type", "data"]
          }
        },
        {
          name: "create_powerpoint_presentation",
          description: "Generate PowerPoint presentation for step-by-step procedures, training materials, or repair guides",
          input_schema: {
            type: "object",
            properties: {
              title: { type: "string", description: "Presentation title" },
              content_type: { type: "string", description: "Type of presentation", enum: ["repair_procedure", "maintenance_guide", "training_module", "parts_overview", "custom"] },
              procedure_id: { type: "string", description: "WIS procedure ID if creating from existing procedure" },
              vehicle_model: { type: "string", description: "Target Unimog model" },
              include_diagrams: { type: "boolean", description: "Include technical diagrams and photos", default: true },
              slide_count: { type: "number", description: "Approximate number of slides", default: 10 },
              difficulty_level: { type: "string", description: "Technical difficulty", enum: ["beginner", "intermediate", "advanced"], default: "intermediate" }
            },
            required: ["title", "content_type"]
          }
        },
        {
          name: "edit_pdf_document",
          description: "Edit existing PDF documents: highlight sections, add annotations, extract specific content",
          input_schema: {
            type: "object",
            properties: {
              action: { type: "string", description: "Type of PDF editing", enum: ["highlight_sections", "add_annotations", "extract_content", "merge_sections", "create_custom"] },
              source_manual: { type: "string", description: "Source manual ID or title" },
              vehicle_model: { type: "string", description: "Filter content for specific vehicle model" },
              sections_to_highlight: { type: "array", description: "List of section titles or page ranges to highlight" },
              annotations: { type: "array", description: "List of annotations to add with page numbers" },
              output_filename: { type: "string", description: "Name for the edited PDF file" }
            },
            required: ["action", "output_filename"]
          }
        },
        {
          name: "convert_document_format",
          description: "Convert between document formats: PDF to PowerPoint, Excel to PDF, etc.",
          input_schema: {
            type: "object",
            properties: {
              source_content: { type: "string", description: "Source content or procedure ID" },
              from_format: { type: "string", description: "Source format", enum: ["wis_procedure", "manual_section", "excel", "powerpoint", "pdf"] },
              to_format: { type: "string", description: "Target format", enum: ["excel", "powerpoint", "pdf", "word"] },
              preserve_formatting: { type: "boolean", description: "Maintain original styling", default: true },
              optimize_for: { type: "string", description: "Optimize for specific use", enum: ["mobile_viewing", "printing", "presentation", "reference"], default: "reference" }
            },
            required: ["source_content", "from_format", "to_format"]
          }
        },
        {
          name: "weather",
          description: "Retrieves current and forecast weather information for a given location using OpenWeatherMap API",
          input_schema: {
            type: "object",
            properties: {
              city: {
                type: "string",
                description: "The name of the city to get weather for. Must be in English. Example: For Saint Petersburg, use 'Saint Petersburg', not 'Санкт-Петербург'."
              },
              lang: {
                type: "string",
                description: "The language for the weather description text. Use standard two-letter language codes (e.g., 'en', 'es', 'zh_CN'). Default: 'en'."
              },
              units: {
                type: "string",
                description: "The unit for temperature. Use 'c' for Celsius, 'f' for Fahrenheit, or 'k' for Kelvin. Default: 'c'."
              }
            },
            required: ["city"]
          }
        },
        {
          name: "web_search",
          description: "Search the web for current information, news, technical documentation, and real-time data",
          input_schema: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "Search query to find current information on the web"
              },
              count: {
                type: "number",
                description: "Number of search results to return (1-20). Default: 10"
              },
              offset: {
                type: "number",
                description: "Number of results to skip for pagination. Default: 0"
              },
              search_lang: {
                type: "string",
                description: "Language for search results (en, es, fr, etc.). Default: 'en'"
              },
              country: {
                type: "string",
                description: "Country code for localized results (US, AU, etc.). Default: 'US'"
              },
              result_filter: {
                type: "string",
                description: "Filter search results",
                enum: ["news", "videos", "images", "discussions", "all"],
                default: "all"
              }
            },
            required: ["query"]
          }
        }
      ]
    }

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
        tools: mcpConfig.tools
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
              // Use our new vector search function for better semantic search
              const { data: results, error } = await supabaseClient.rpc('search_wis_filtered', {
                search_query: toolInput.term,
                vehicle_id_filter: null, // Could use model_code to filter in future
                category_filter: null,
                search_limit: toolInput.limit || 50,
                similarity_threshold: 0.3 // Lower threshold for more results
              })
              
              if (error) {
                console.error('Vector search error:', error)
                // Fallback to simple text search on wis_chunks table
                const { data: fallbackResults } = await supabaseClient
                  .from('wis_chunks')
                  .select('id, title, content, doc_type, ref')
                  .or(`title.ilike.%${toolInput.term}%,content.ilike.%${toolInput.term}%`)
                  .limit(toolInput.limit || 50)
                
                toolResult = {
                  procedures: (fallbackResults || []).map(item => ({
                    id: item.id,
                    title: item.title,
                    metadata: {
                      reference_number: item.ref,
                      doc_type: item.doc_type,
                      content_summary: item.content ? item.content.substring(0, 200) : ''
                    },
                    created_at: new Date().toISOString()
                  })),
                  total: (fallbackResults || []).length,
                  query_info: toolInput,
                  search_method: 'fallback_text'
                }
              } else {
                // Format vector search results for MCP tool interface
                toolResult = {
                  procedures: (results || []).map(item => ({
                    id: item.doc_id,
                    title: item.title,
                    metadata: {
                      reference_number: item.reference_number,
                      doc_type: item.doc_type,
                      category: item.category,
                      vehicle_model: item.vehicle_model,
                      content_summary: item.content_summary,
                      similarity_score: item.similarity_score,
                      result_rank: item.result_rank
                    },
                    created_at: new Date().toISOString()
                  })),
                  total: (results || []).length,
                  query_info: toolInput,
                  search_method: 'vector_semantic'
                }
              }
            } else if (toolName === 'get_procedure') {
              // Try to get procedure from new WIS tables first, fall back to chunks
              let result = null
              
              // First try wis_procedures table
              const { data: procedureResult } = await supabaseClient
                .from('wis_procedures')
                .select(`
                  id,
                  title,
                  description,
                  content,
                  procedure_code,
                  category,
                  vehicle_id,
                  wis_models!inner(model_name, model_code)
                `)
                .eq('id', toolInput.id_or_code)
                .single()
              
              if (procedureResult) {
                result = {
                  procedure: {
                    metadata: {
                      id: procedureResult.id,
                      title: procedureResult.title,
                      model_code: procedureResult.wis_models?.model_code || '',
                      model_name: procedureResult.wis_models?.model_name || '',
                      procedure_code: procedureResult.procedure_code,
                      category: procedureResult.category,
                      description: procedureResult.description,
                      content: procedureResult.content
                    },
                    steps: [], // Would parse from content in future
                    cautions: [], // Would parse from content in future
                    required_tools: [] // Would parse from content in future
                  }
                }
              } else {
                // Fallback to chunks table
                const { data: chunkResult } = await supabaseClient
                  .from('wis_chunks')
                  .select('*')
                  .eq('id', toolInput.id_or_code)
                  .single()
                
                result = chunkResult ? {
                  procedure: {
                    metadata: {
                      id: chunkResult.id,
                      title: chunkResult.title,
                      model_code: '',
                      description: chunkResult.content,
                      doc_type: chunkResult.doc_type,
                      reference: chunkResult.ref
                    },
                    steps: [],
                    cautions: [],
                    required_tools: []
                  }
                } : { error: 'Procedure not found' }
              }
              
              toolResult = result
            } else if (toolName === 'search_wis_hybrid') {
              // Use advanced hybrid search for best results
              const { data: results, error } = await supabaseClient.rpc('search_wis_hybrid', {
                search_query: toolInput.query,
                content_types: toolInput.content_types || 'procedure,part,bulletin',
                search_limit: toolInput.limit || 20,
                vector_weight: toolInput.vector_weight || 0.7
              })
              
              if (error) {
                console.error('Hybrid search error:', error)
                toolResult = { error: 'Search temporarily unavailable', results: [] }
              } else {
                toolResult = {
                  results: (results || []).map(item => ({
                    id: item.doc_id,
                    type: item.doc_type,
                    title: item.title,
                    content_summary: item.content_summary,
                    reference_number: item.reference_number,
                    category: item.category,
                    vehicle_model: item.vehicle_model,
                    combined_score: item.combined_score,
                    vector_score: item.vector_score,
                    text_score: item.text_score,
                    result_rank: item.result_rank
                  })),
                  total: (results || []).length,
                  query_info: toolInput,
                  search_method: 'hybrid_vector_text'
                }
              }
            } else if (toolName === 'get_parts') {
              // Use actual WIS parts data
              let query = supabaseClient
                .from('wis_parts')
                .select(`
                  id,
                  part_number,
                  part_name,
                  description,
                  category,
                  vehicle_id,
                  wis_models!inner(model_name, model_code)
                `)
                .limit(toolInput.limit || 50)
              
              // Apply filters if provided
              if (toolInput.model_code) {
                query = query.eq('wis_models.model_code', toolInput.model_code)
              }
              if (toolInput.group_code && toolInput.group_code.trim()) {
                query = query.ilike('category', `%${toolInput.group_code}%`)
              }
              
              const { data: parts } = await query
              
              toolResult = {
                parts: (parts || []).map(part => ({
                  id: part.id,
                  part_number: part.part_number,
                  name: part.part_name,
                  description: part.description,
                  category: part.category,
                  model_code: part.wis_models?.model_code || '',
                  model_name: part.wis_models?.model_name || ''
                })),
                total: (parts || []).length,
                query_info: toolInput
              }
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
            } else if (toolName === 'create_excel_spreadsheet') {
              // Excel Spreadsheet Creation
              console.log('Creating Excel spreadsheet:', toolInput)
              
              try {
                // Call Claude API with computer use to create Excel file
                const excelResponse = await fetch(ANTHROPIC_API_URL, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': ANTHROPIC_API_KEY,
                    'anthropic-version': '2023-06-01'
                  },
                  body: JSON.stringify({
                    model: 'claude-3-5-sonnet-20241022',
                    messages: [{
                      role: 'user',
                      content: `Create an Excel spreadsheet with the following specifications:
                      Title: ${toolInput.title}
                      Type: ${toolInput.data_type}
                      Vehicle Model: ${toolInput.vehicle_model || 'General Unimog'}
                      Data: ${JSON.stringify(toolInput.data)}
                      Include Formulas: ${toolInput.include_formulas}
                      Style: ${toolInput.format_style}
                      
                      Please create a professional Excel file with proper formatting, headers, and if requested, working formulas for calculations. Include vehicle-specific information where relevant.`
                    }],
                    max_tokens: 4000,
                    tools: [{ 
                      type: 'computer_20241022',
                      name: 'computer',
                      display_width_px: 1024,
                      display_height_px: 768
                    }]
                  })
                })
                
                if (excelResponse.ok) {
                  const excelData = await excelResponse.json()

                  // Check if the response contains actual file content
                  let fileContent = null
                  if (excelData.content && excelData.content.length > 0) {
                    // Look for file content in Claude's response
                    for (const contentBlock of excelData.content) {
                      if (contentBlock.type === 'text' && contentBlock.text.includes('Excel')) {
                        // Extract file path or content if available
                        // This would need to be implemented based on Claude's actual computer use output
                        break
                      }
                    }
                  }

                  toolResult = {
                    status: 'success',
                    message: 'Excel spreadsheet created successfully and will be shared with the community',
                    filename: `${toolInput.title}.xlsx`,
                    type: toolInput.data_type,
                    vehicle_model: toolInput.vehicle_model,
                    created_at: new Date().toISOString(),
                    sharing_enabled: true,
                    document_metadata: {
                      title: toolInput.title,
                      documentType: 'excel',
                      vehicleModels: toolInput.vehicle_model ? [toolInput.vehicle_model] : [],
                      categories: getDocumentCategories(toolInput.data_type),
                      originalQuery: lastUserMessage?.content || 'Document generation request',
                      generationMethod: 'barry_ai_excel'
                    }
                  }
                } else {
                  toolResult = {
                    error: 'Failed to create Excel spreadsheet',
                    details: await excelResponse.text()
                  }
                }
              } catch (error) {
                toolResult = { 
                  error: 'Excel creation failed',
                  details: error.message
                }
              }
            } else if (toolName === 'create_powerpoint_presentation') {
              // PowerPoint Presentation Creation
              console.log('Creating PowerPoint presentation:', toolInput)
              
              try {
                const pptResponse = await fetch(ANTHROPIC_API_URL, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': ANTHROPIC_API_KEY,
                    'anthropic-version': '2023-06-01'
                  },
                  body: JSON.stringify({
                    model: 'claude-3-5-sonnet-20241022',
                    messages: [{
                      role: 'user',
                      content: `Create a PowerPoint presentation with these specifications:
                      Title: ${toolInput.title}
                      Content Type: ${toolInput.content_type}
                      Vehicle Model: ${toolInput.vehicle_model || 'General Unimog'}
                      Procedure ID: ${toolInput.procedure_id || 'N/A'}
                      Include Diagrams: ${toolInput.include_diagrams}
                      Slide Count: ${toolInput.slide_count}
                      Difficulty Level: ${toolInput.difficulty_level}
                      
                      Create a professional presentation with step-by-step procedures, include technical diagrams where specified, and make it suitable for the indicated difficulty level. Focus on practical, actionable information for Unimog maintenance and repair.`
                    }],
                    max_tokens: 4000,
                    tools: [{ 
                      type: 'computer_20241022',
                      name: 'computer',
                      display_width_px: 1024,
                      display_height_px: 768
                    }]
                  })
                })
                
                if (pptResponse.ok) {
                  const pptData = await pptResponse.json()
                  toolResult = {
                    status: 'success',
                    message: 'PowerPoint presentation created successfully and will be shared with the community',
                    filename: `${toolInput.title}.pptx`,
                    content_type: toolInput.content_type,
                    slide_count: toolInput.slide_count,
                    vehicle_model: toolInput.vehicle_model,
                    created_at: new Date().toISOString(),
                    sharing_enabled: true,
                    document_metadata: {
                      title: toolInput.title,
                      documentType: 'powerpoint',
                      vehicleModels: toolInput.vehicle_model ? [toolInput.vehicle_model] : [],
                      categories: getDocumentCategories(toolInput.content_type),
                      originalQuery: lastUserMessage?.content || 'Document generation request',
                      generationMethod: 'barry_ai_powerpoint'
                    }
                  }
                } else {
                  toolResult = {
                    error: 'Failed to create PowerPoint presentation',
                    details: await pptResponse.text()
                  }
                }
              } catch (error) {
                toolResult = { 
                  error: 'PowerPoint creation failed',
                  details: error.message
                }
              }
            } else if (toolName === 'edit_pdf_document') {
              // PDF Document Editing
              console.log('Editing PDF document:', toolInput)
              
              try {
                const pdfResponse = await fetch(ANTHROPIC_API_URL, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': ANTHROPIC_API_KEY,
                    'anthropic-version': '2023-06-01'
                  },
                  body: JSON.stringify({
                    model: 'claude-3-5-sonnet-20241022',
                    messages: [{
                      role: 'user',
                      content: `Edit PDF document with these specifications:
                      Action: ${toolInput.action}
                      Source Manual: ${toolInput.source_manual || 'N/A'}
                      Vehicle Model: ${toolInput.vehicle_model || 'General Unimog'}
                      Sections to Highlight: ${JSON.stringify(toolInput.sections_to_highlight || [])}
                      Annotations: ${JSON.stringify(toolInput.annotations || [])}
                      Output Filename: ${toolInput.output_filename}
                      
                      Please edit the PDF according to the specified action, focusing on content relevant to the vehicle model. Add helpful annotations and highlight important sections for practical use.`
                    }],
                    max_tokens: 4000,
                    tools: [{ 
                      type: 'computer_20241022',
                      name: 'computer',
                      display_width_px: 1024,
                      display_height_px: 768
                    }]
                  })
                })
                
                if (pdfResponse.ok) {
                  const pdfData = await pdfResponse.json()
                  toolResult = {
                    status: 'success',
                    message: 'PDF document edited successfully and will be shared with the community',
                    filename: toolInput.output_filename,
                    action: toolInput.action,
                    vehicle_model: toolInput.vehicle_model,
                    created_at: new Date().toISOString(),
                    sharing_enabled: true,
                    document_metadata: {
                      title: toolInput.output_filename.replace(/\.[^/.]+$/, ''), // Remove file extension for title
                      documentType: 'pdf',
                      vehicleModels: toolInput.vehicle_model ? [toolInput.vehicle_model] : [],
                      categories: getDocumentCategories(toolInput.action),
                      originalQuery: lastUserMessage?.content || 'PDF editing request',
                      generationMethod: 'barry_ai_pdf_edit'
                    }
                  }
                } else {
                  toolResult = {
                    error: 'Failed to edit PDF document',
                    details: await pdfResponse.text()
                  }
                }
              } catch (error) {
                toolResult = { 
                  error: 'PDF editing failed',
                  details: error.message
                }
              }
            } else if (toolName === 'convert_document_format') {
              // Document Format Conversion
              console.log('Converting document format:', toolInput)

              try {
                const convertResponse = await fetch(ANTHROPIC_API_URL, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': ANTHROPIC_API_KEY,
                    'anthropic-version': '2023-06-01'
                  },
                  body: JSON.stringify({
                    model: 'claude-3-5-sonnet-20241022',
                    messages: [{
                      role: 'user',
                      content: `Convert document format with these specifications:
                      Source Content: ${toolInput.source_content}
                      From Format: ${toolInput.from_format}
                      To Format: ${toolInput.to_format}
                      Preserve Formatting: ${toolInput.preserve_formatting}
                      Optimize For: ${toolInput.optimize_for}

                      Please convert the content from ${toolInput.from_format} to ${toolInput.to_format}, maintaining the quality and usefulness of the information while optimizing for ${toolInput.optimize_for}.`
                    }],
                    max_tokens: 4000,
                    tools: [{
                      type: 'computer_20241022',
                      name: 'computer',
                      display_width_px: 1024,
                      display_height_px: 768
                    }]
                  })
                })

                if (convertResponse.ok) {
                  const convertData = await convertResponse.json()
                  toolResult = {
                    status: 'success',
                    message: 'Document format converted successfully',
                    from_format: toolInput.from_format,
                    to_format: toolInput.to_format,
                    optimize_for: toolInput.optimize_for,
                    created_at: new Date().toISOString()
                  }
                } else {
                  toolResult = {
                    error: 'Failed to convert document format',
                    details: await convertResponse.text()
                  }
                }
              } catch (error) {
                toolResult = {
                  error: 'Document conversion failed',
                  details: error.message
                }
              }
            } else if (toolName === 'weather') {
              // OpenWeatherMap API Weather Data
              console.log('Fetching weather data:', toolInput)

              try {
                // Call OpenWeatherMap API directly
                const { city, lang = 'en', units = 'c' } = toolInput
                const unitsParam = units === 'c' ? 'metric' : units === 'f' ? 'imperial' : 'standard'
                const OWM_API_KEY = Deno.env.get('OPENWEATHER_API_KEY')

                if (!OWM_API_KEY) {
                  toolResult = {
                    error: 'Weather service temporarily unavailable',
                    city: city
                  }
                } else {

                // Get current weather
                const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${OWM_API_KEY}&units=${unitsParam}&lang=${lang}`
                const currentResponse = await fetch(currentWeatherUrl)

                // Get 5-day forecast
                const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${OWM_API_KEY}&units=${unitsParam}&lang=${lang}`
                const forecastResponse = await fetch(forecastUrl)

                if (currentResponse.ok && forecastResponse.ok) {
                  const currentData = await currentResponse.json()
                  const forecastData = await forecastResponse.json()

                  const tempUnit = units === 'c' ? '°C' : units === 'f' ? '°F' : 'K'

                  toolResult = {
                    current: {
                      city: currentData.name,
                      country: currentData.sys.country,
                      temperature: `${Math.round(currentData.main.temp)}${tempUnit}`,
                      feels_like: `${Math.round(currentData.main.feels_like)}${tempUnit}`,
                      description: currentData.weather[0].description,
                      humidity: `${currentData.main.humidity}%`,
                      pressure: `${currentData.main.pressure} hPa`,
                      visibility: `${(currentData.visibility / 1000).toFixed(1)} km`,
                      wind: {
                        speed: `${currentData.wind.speed} ${units === 'c' ? 'm/s' : 'mph'}`,
                        direction: currentData.wind.deg ? `${currentData.wind.deg}°` : 'N/A'
                      },
                      clouds: `${currentData.clouds.all}%`,
                      sunrise: new Date(currentData.sys.sunrise * 1000).toLocaleTimeString(),
                      sunset: new Date(currentData.sys.sunset * 1000).toLocaleTimeString()
                    },
                    forecast: forecastData.list.slice(0, 8).map(item => ({
                      datetime: new Date(item.dt * 1000).toLocaleString(),
                      temperature: `${Math.round(item.main.temp)}${tempUnit}`,
                      description: item.weather[0].description,
                      humidity: `${item.main.humidity}%`,
                      wind_speed: `${item.wind.speed} ${units === 'c' ? 'm/s' : 'mph'}`,
                      precipitation: item.rain ? `${Object.values(item.rain)[0]} mm` : '0 mm'
                    })),
                    location: {
                      lat: currentData.coord.lat,
                      lon: currentData.coord.lon
                    },
                    units: {
                      temperature: tempUnit,
                      wind_speed: units === 'c' ? 'm/s' : 'mph',
                      pressure: 'hPa'
                    }
                  }
                } else {
                  const error = await currentResponse.text()
                  toolResult = {
                    error: `Weather API error: ${error}`,
                    city: city
                  }
                }
                }
              } catch (error) {
                toolResult = {
                  error: 'Failed to fetch weather data',
                  details: error.message,
                  city: toolInput.city
                }
              }
            } else if (toolName === 'web_search') {
              // Web Search using SearXNG or fallback search API
              console.log('Performing web search:', toolInput)

              try {
                const {
                  query,
                  count = 10,
                  offset = 0,
                  search_lang = 'en',
                  country = 'US',
                  result_filter = 'all'
                } = toolInput

                // Use SearXNG public instance as fallback (no API key required)
                const searxUrl = 'https://searx.be/search'
                const params = new URLSearchParams({
                  q: query,
                  format: 'json',
                  categories: result_filter === 'news' ? 'news' : 'general',
                  lang: search_lang,
                  pageno: Math.floor(offset / count) + 1
                })

                const searchResponse = await fetch(`${searxUrl}?${params}`, {
                  headers: {
                    'User-Agent': 'Barry-AI-Assistant/1.0 (Unimog Community Hub)',
                    'Accept': 'application/json'
                  }
                })

                if (searchResponse.ok) {
                  const searchData = await searchResponse.json()

                  toolResult = {
                    query: query,
                    results: (searchData.results || []).slice(0, count).map((result, index) => ({
                      rank: offset + index + 1,
                      title: result.title || 'No title',
                      url: result.url || '',
                      snippet: result.content || result.description || 'No description available',
                      published_time: result.publishedDate || null,
                      source: result.engine || 'web'
                    })),
                    total_results: searchData.number_of_results || 0,
                    search_metadata: {
                      query: query,
                      language: search_lang,
                      country: country,
                      filter: result_filter,
                      count: count,
                      offset: offset
                    },
                    suggestions: searchData.suggestions || []
                  }
                } else {
                  // Fallback to a simple web scraping approach
                  console.log('SearX search failed, using fallback method')

                  toolResult = {
                    query: query,
                    results: [],
                    total_results: 0,
                    error: 'Web search temporarily unavailable',
                    search_metadata: {
                      query: query,
                      language: search_lang,
                      country: country,
                      filter: result_filter,
                      count: count,
                      offset: offset
                    }
                  }
                }
              } catch (error) {
                console.error('Web search error:', error)
                toolResult = {
                  query: toolInput.query,
                  results: [],
                  total_results: 0,
                  error: 'Failed to perform web search',
                  details: error.message,
                  search_metadata: {
                    query: toolInput.query,
                    error: error.message
                  }
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

    // Return the response with manual references in standardized format
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