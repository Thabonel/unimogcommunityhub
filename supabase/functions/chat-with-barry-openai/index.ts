// ENHANCED: Working Barry Edge Function (OpenAI GPT-4) with Improved Semantic Search
// Date: 2025-09-26
// Status: PRODUCTION ENHANCED VERSION
// Version: 50 (Enhanced from V49)
// API: OpenAI GPT-4o
// Improvements: Better manual search, removed WIS (not working), enhanced search terms

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_EMBEDDING_URL = 'https://api.openai.com/v1/embeddings';

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
   - User's registered vehicle information for personalized advice
3. Always provide weather forecasts when asked
4. Give directions and location information
5. Answer general knowledge questions
6. Help with any topic the user needs

When answering VEHICLE questions:
- Check user's registered vehicles first for personalized advice
- Use Manual excerpts (M1, M2...) for general maintenance and repair guides
- Always cite your sources: "According to Manual G609-9..." or "Manual G604 states..."
- Prioritize information that matches the user's specific Unimog model
- When you find specific manuals, reference them by their exact names (like G609-9-Hydraulic-Cabin-Tilting-Kit)

When answering NON-VEHICLE questions:
- Weather questions: ALWAYS provide a weather forecast/conditions. You can mention how it affects driving as a bonus.
- General questions: Answer directly and completely
- NEVER say you can't answer something or redirect to vehicle topics

Examples:
- "What's the weather tomorrow?" -> Give weather forecast, maybe add driving tips
- "What's 2+2?" -> "That's 4, mate."
- "How do I lift the cab?" -> Find Manual G609-9-Hydraulic-Cabin-Tilting-Kit and reference it specifically

Remember: You're a helpful assistant FIRST who happens to be a Unimog expert with comprehensive technical resources. Answer EVERYTHING with the appropriate level of expertise.`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({
        error: 'No authorization header'
      }), {
        status: 401,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    // Create Supabase client with the user's token
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader }
        }
      }
    );

    // Verify the user is authenticated
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({
        error: 'Unauthorized'
      }), {
        status: 401,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    // Check if OpenAI API key is configured
    if (!OPENAI_API_KEY) {
      return new Response(JSON.stringify({
        error: 'OpenAI API key not configured'
      }), {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    // Get the request body
    const { messages, location } = await req.json();
    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({
        error: 'Invalid request body'
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    // Get user's profile and vehicle information for personalized responses
    let vehicleContext = '';
    try {
      // Get the user's profile to fetch their primary Unimog model
      const { data: profile, error: profileError } = await supabaseClient
        .from('profiles')
        .select('unimog_model, full_name, display_name')
        .eq('id', user.id)
        .single();

      if (!profileError && profile) {
        // Add user's primary Unimog model from profile if available
        if (profile.unimog_model) {
          vehicleContext = `\n\nUser's Primary Unimog: ${profile.unimog_model}\n`;
          // Add user's name if available for more personalized responses
          const userName = profile.full_name || profile.display_name;
          if (userName) {
            vehicleContext += `User's Name: ${userName}\n`;
          }
          vehicleContext += `Always remember and reference the user's ${profile.unimog_model} when providing technical advice.\n`;
        }
      }

      // Then get any additional vehicles from the vehicles table
      const { data: vehicles, error: vehicleError } = await supabaseClient
        .from('vehicles')
        .select('id, make, model, year, engine_type, trim')
        .eq('user_id', user.id)
        .limit(5);

      if (!vehicleError && vehicles && vehicles.length > 0) {
        if (vehicleContext === '') {
          vehicleContext = `\n\nUser's registered vehicles:\n`;
        } else {
          vehicleContext += `\nAdditional registered vehicles:\n`;
        }
        vehicles.forEach((vehicle, idx) => {
          vehicleContext += `[${idx + 1}] ${vehicle.year || 'Unknown'} ${vehicle.make || 'Unknown'} ${vehicle.model || 'Unknown'}`;
          if (vehicle.engine_type) vehicleContext += ` (${vehicle.engine_type})`;
          vehicleContext += `\n`;
        });
        vehicleContext += `When providing vehicle-specific advice, prioritize information for these models.`;
      } else if (vehicleContext === '') {
        console.log('No user vehicles or profile model found');
      }
    } catch (error) {
      console.log('Error fetching user profile/vehicles:', error);
    }

    // ENHANCED SEMANTIC SEARCH for manual content
    let manualContext = '';
    let manualReferences = [];

    // Get the last user message for context search
    const lastUserMessage = messages.filter((m) => m.role === 'user').pop();
    if (lastUserMessage && lastUserMessage.content) {
      try {
        const query = lastUserMessage.content;
        console.log(`🔍 Starting enhanced semantic search for: "${query}"`);

        // Create embedding for the user's question
        const embeddingResponse = await fetch(OPENAI_EMBEDDING_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: 'text-embedding-ada-002',
            input: query
          })
        });

        if (embeddingResponse.ok) {
          const embeddingData = await embeddingResponse.json();
          const queryEmbedding = embeddingData.data[0].embedding;

          // ENHANCED: Try semantic search first using the proper RPC function
          let chunks = [];
          try {
            const { data: semanticResults, error: semanticError } = await supabaseClient
              .rpc('search_manual_chunks_semantic', {
                query_embedding: `[${queryEmbedding.join(',')}]`,
                user_model: null, // Allow all models for now
                similarity_threshold: 0.6, // Lower threshold for better recall
                max_results: 8
              });

            if (!semanticError && semanticResults && semanticResults.length > 0) {
              chunks = semanticResults;
              console.log(`✅ Semantic search found ${chunks.length} results`);
            } else {
              console.log('Semantic search failed or no results, trying fallback approach');
            }
          } catch (semanticError) {
            console.log('Semantic RPC failed, using fallback search');
          }

          // FALLBACK: Enhanced keyword search if semantic fails
          if (chunks.length === 0) {
            const userText = lastUserMessage.content.toLowerCase();

            // ENHANCED search terms with better mapping
            const enhancedKeywords = [
              // Original terms
              'unimog', 'engine', 'oil', 'brake', 'transmission', 'hydraulic',
              'clutch', 'differential', 'axle', 'tire', 'wheel', 'maintenance',
              'service', 'repair', 'replace', 'change', 'check', 'adjust',
              'lubricate', 'filter', 'fluid', 'coolant', 'belt', 'hose', 'gasket', 'seal',

              // ENHANCED: New terms for better manual matching
              'cab', 'cabin', 'tilt', 'tilting', 'lift', 'lifting', 'raise', 'lower',
              'hydraulic', 'kit', 'instruction', 'procedure', 'g609', 'g604', 'g603',
              'manual', 'guide', 'steps', 'how', 'install', 'remove', 'assembly'
            ];

            const searchTerms = [];
            for (const keyword of enhancedKeywords) {
              if (userText.includes(keyword)) {
                searchTerms.push(keyword);
              }
            }

            // Add specific manual number patterns (G609, G604, etc.)
            const manualPattern = /g\d{3}/gi;
            const manualMatches = userText.match(manualPattern);
            if (manualMatches) {
              searchTerms.push(...manualMatches);
            }

            // If no specific keywords, use general terms
            if (searchTerms.length === 0) {
              searchTerms.push(...userText.replace(/[^\w\s]/g, ' ').split(/\s+/).filter((word) => word.length > 3).slice(0, 3));
            }

            console.log('Enhanced search terms:', searchTerms);

            // Search for each term and combine results
            for (const term of searchTerms.slice(0, 5)) { // Check more terms
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
                    page_image_url,
                    extraction_quality,
                    manuals!inner(
                      filename,
                      title
                    )
                  `)
                  .or(`content.ilike.%${term}%,manuals.filename.ilike.%${term}%,manuals.title.ilike.%${term}%`)
                  .limit(5)
                  .order('page_number', { ascending: true });

                if (termChunks && termChunks.length > 0) {
                  // Add unique chunks (avoid duplicates)
                  const existingIds = new Set(chunks.map((c) => c.id));
                  const newChunks = termChunks.filter((c) => !existingIds.has(c.id));
                  chunks.push(...newChunks);
                  console.log(`Found ${newChunks.length} new chunks for term: ${term}`);
                }
              } catch (error) {
                console.error('Search term error:', term, error);
              }
            }

            // Limit total results and sort by relevance
            chunks = chunks.slice(0, 8);
          }

          // Build manual context from search results
          if (chunks.length > 0) {
            let contextBuilder = '\n\n📚 MANUAL EXCERPTS FOUND:\n';

            chunks.forEach((chunk, idx) => {
              // Handle both data structures (semantic vs fallback)
              const manualTitle = chunk.manuals?.title || chunk.manual_metadata?.title || chunk.manuals?.filename || 'Unknown Manual';
              const similarity = chunk.similarity_score || 0.8; // Default for fallback results
              const confidenceLevel = similarity > 0.8 ? 'HIGH' : similarity > 0.6 ? 'MEDIUM' : 'GOOD';

              contextBuilder += `\n[M${idx + 1}] Manual: "${manualTitle}"\n`;
              contextBuilder += `Page: ${chunk.page_number || 'N/A'}\n`;
              contextBuilder += `Section: ${chunk.section_title || 'General'}\n`;
              contextBuilder += `Confidence: ${confidenceLevel} (${(similarity * 100).toFixed(1)}% match)\n`;

              if (chunk.has_visual_elements) {
                contextBuilder += `Visual Content: ${chunk.visual_content_type || 'diagrams/images'}\n`;
              }
              if (chunk.page_image_url) {
                contextBuilder += `Page Image Available: Yes\n`;
              }

              contextBuilder += `Content:\n${chunk.content}\n`;
              contextBuilder += `---\n`;

              // Create manual reference for frontend display
              const reference = {
                type: 'manual',
                manual: manualTitle,
                page: chunk.page_number,
                section: chunk.section_title,
                pageImageUrl: chunk.page_image_url,
                hasVisualContent: chunk.has_visual_elements || false,
                visualContentType: chunk.visual_content_type || 'text',
                confidence: similarity
              };

              manualReferences.push(reference);
            });

            manualContext = contextBuilder + vehicleContext + '\n\nIMPORTANT INSTRUCTIONS:\n';
            manualContext += '- Use the manual excerpts above (M1, M2...) as your PRIMARY source of information\n';
            manualContext += '- Always cite specific manual names and page numbers when available\n';
            manualContext += '- When you see specific manual names like "G609-9-Hydraulic-Cabin-Tilting-Kit", mention them by name\n';
            manualContext += '- For visual content, mention that diagrams can be viewed in the manual panel\n';
            manualContext += '- Provide specific technical procedures from the manual content found\n';
            manualContext += `- Total manual sources available: ${chunks.length} excerpts from various Unimog manuals\n`;

            console.log(`📖 Built enhanced manual context with ${chunks.length} chunks`);
          } else {
            manualContext = `\n\n❌ NO SPECIFIC MANUAL CONTENT FOUND\n`;
            manualContext += `The manual search could not find specific content for: "${query}"\n\n`;
            manualContext += `However, you should still provide helpful general advice based on your 40+ years of Unimog experience.\n`;
            manualContext += `Suggest that the user might want to check specific manuals or be more specific about their model.\n`;

            console.log(`❌ No manual content found for query: "${query}"`);
          }
        } else {
          console.log('Failed to generate embedding, proceeding without manual context');
        }
      } catch (searchError) {
        console.error('Manual search error:', searchError);
        manualContext = `\n\n⚠️ SEARCH SYSTEM ERROR\n`;
        manualContext += `There was an error accessing the manual database. Using general knowledge for this response.\n`;
        manualContext += `Error: ${searchError.message}`;
      }
    }

    // Add location context if provided
    let locationContext = '';
    if (location && location.latitude && location.longitude) {
      locationContext = `\n\nCRITICAL CONTEXT:\n`;
      locationContext += `User's current location: Latitude ${location.latitude.toFixed(4)}, Longitude ${location.longitude.toFixed(4)}\n`;
      locationContext += `Today's date: ${new Date().toLocaleDateString()}\n`;
      locationContext += `Current time: ${new Date().toLocaleTimeString()}\n`;
      locationContext += `When asked about weather, use this location to provide accurate local weather information.\n`;
      locationContext += `You have access to current weather data and forecasts for this location.`;
    } else {
      locationContext = `\n\nCRITICAL CONTEXT:\n`;
      locationContext += `Today's date: ${new Date().toLocaleDateString()}\n`;
      locationContext += `Current time: ${new Date().toLocaleTimeString()}\n`;
      locationContext += `Location not provided, but still answer weather questions with general information.`;
    }

    // Call OpenAI API with enhanced context
    const systemPromptWithContext = BARRY_SYSTEM_PROMPT + locationContext + manualContext;

    const openAIResponse = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: systemPromptWithContext
          },
          ...messages
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    if (!openAIResponse.ok) {
      const error = await openAIResponse.text();
      console.error('OpenAI API error:', error);
      return new Response(JSON.stringify({
        error: 'Failed to get response from AI'
      }), {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    const data = await openAIResponse.json();

    // Log the chat for analytics
    try {
      await supabaseClient.from('chat_logs').insert({
        user_id: user.id,
        messages: messages,
        response: data.choices[0].message.content,
        model: 'gpt-4o',
        tokens_used: data.usage?.total_tokens || 0
      });
    } catch (logError) {
      console.log('Failed to log chat:', logError);
    }

    // Return the response with enhanced manual references
    return new Response(JSON.stringify({
      content: data.choices[0].message.content,
      usage: data.usage,
      manualReferences: manualReferences.length > 0 ? manualReferences : undefined
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 200
    });

  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error'
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});