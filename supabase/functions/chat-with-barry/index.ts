// Barry Edge Function - Gemini Flash 1.5 Conversion
// Date: 2025-09-20
// API: Google Gemini Flash 1.5
// Converted from Anthropic Claude for cost savings and performance improvements

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

const GEMINI_API_KEY = Deno.env.get('VITE_GEMINI_API_KEY');
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

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

Remember: You're a helpful assistant FIRST who happens to be a Unimog expert with comprehensive technical resources. Answer EVERYTHING with the appropriate level of expertise.`;

// Convert messages to Gemini format
function convertMessagesToGemini(messages: any[], systemPrompt: string) {
  const geminiContents = [];
  let firstUserMessage = true;

  for (const message of messages) {
    if (message.role === 'user') {
      let content = message.content;

      // Prepend system prompt to first user message
      if (firstUserMessage) {
        content = `${systemPrompt}\n\nUser: ${content}`;
        firstUserMessage = false;
      }

      geminiContents.push({
        parts: [{ text: content }]
      });
    } else if (message.role === 'assistant') {
      geminiContents.push({
        parts: [{ text: message.content }]
      });
    }
    // Skip system messages as they're handled differently in Gemini
  }

  return geminiContents;
}

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
          headers: {
            Authorization: authHeader
          }
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

    // Check if Gemini API key is configured
    if (!GEMINI_API_KEY) {
      return new Response(JSON.stringify({
        error: 'Gemini API key not configured'
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
    let userVehicles = [];
    let vehicleContext = '';
    try {
      // First, get the user's profile to fetch their primary Unimog model
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
        userVehicles = vehicles;
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

    // Search for relevant manual and WIS content
    let manualContext = '';
    let manualReferences = [];

    // Get the last user message for context search
    const lastUserMessage = messages.filter(m => m.role === 'user').pop();
    if (lastUserMessage && lastUserMessage.content) {
      try {
        // Extract meaningful keywords from user question for search
        const userText = lastUserMessage.content.toLowerCase();
        const searchTerms = [];

        // Look for vehicle-related keywords
        const vehicleKeywords = [
          'unimog', 'engine', 'oil', 'brake', 'transmission', 'hydraulic',
          'clutch', 'differential', 'axle', 'tire', 'wheel', 'maintenance',
          'service', 'repair', 'replace', 'change', 'check', 'adjust',
          'lubricate', 'filter', 'fluid', 'coolant', 'belt', 'hose',
          'gasket', 'seal'
        ];

        for (const keyword of vehicleKeywords) {
          if (userText.includes(keyword)) {
            searchTerms.push(keyword);
          }
        }

        // If no vehicle keywords, use general terms
        if (searchTerms.length === 0) {
          searchTerms.push(...userText.replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 3)
            .slice(0, 2));
        }

        console.log('Searching manual chunks with terms:', searchTerms);
        let chunks = [];

        if (searchTerms.length > 0) {
          // Search for each term and combine results
          for (const term of searchTerms.slice(0, 3)) {
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
                  manual_metadata!inner(
                    title
                  )
                `)
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

        // Search WIS database using wis_search RPC with media support
        let wisChunks = [];
        if (searchTerms.length > 0) {
          console.log('Searching WIS database with RPC function...');
          // Use the wis_search RPC function for better results with media
          for (const term of searchTerms.slice(0, 2)) {
            try {
              const { data: wisResults, error: wisError } = await supabaseClient.rpc('wis_search', {
                q: term
              });

              if (wisError) {
                console.error('WIS search error:', wisError);
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
                        const { data: signedUrl, error: urlError } = await supabaseClient.rpc('wis_media_url', {
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

        // Combine manual chunks and WIS data for comprehensive context
        const allSources = [];
        let contextBuilder = '';

        if (chunks && chunks.length > 0) {
          contextBuilder += '\n\n📚 MANUAL EXCERPTS:\n';
          chunks.forEach((chunk, idx) => {
            const manualTitle = chunk.manual_metadata?.title || 'Unknown Manual';
            contextBuilder += `\n[M${idx + 1}] From "${manualTitle}", Page ${chunk.page_number}:\n${chunk.content}\n`;

            // Manual reference
            const reference = {
              type: 'manual',
              manual: manualTitle,
              page: chunk.page_number,
              section: chunk.section_title,
              pageImageUrl: null,
              hasVisualContent: false,
              visualContentType: 'text'
            };

            manualReferences.push(reference);
            allSources.push(`Manual: ${manualTitle} (Page ${chunk.page_number})`);
          });
        }

        if (wisChunks && wisChunks.length > 0) {
          contextBuilder += '\n\n🔧 WIS TECHNICAL DATA:\n';
          wisChunks.forEach((wis, idx) => {
            contextBuilder += `\n[W${idx + 1}] ${wis.source}: "${wis.title}"\n`;
            if (wis.category) contextBuilder += `Category: ${wis.category}\n`;
            if (wis.difficulty) contextBuilder += `Difficulty: ${wis.difficulty}/5\n`;
            if (wis.time) contextBuilder += `Est. Time: ${wis.time} minutes\n`;
            if (wis.severity) contextBuilder += `Severity: ${wis.severity}\n`;
            if (wis.bulletin_number) contextBuilder += `Bulletin: ${wis.bulletin_number}\n`;
            contextBuilder += `${wis.content}\n`;

            // Include media information in Barry's context
            if (wis.mediaUrls && wis.mediaUrls.length > 0) {
              contextBuilder += `📷 Media Available: ${wis.mediaUrls.map(m => m.type).join(', ')}\n`;
              contextBuilder += `(User interface will display these images inline)\n`;
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
              mediaUrls: wis.mediaUrls || []
            };
            manualReferences.push(wisReference);
          });
        }

        if (contextBuilder) {
          manualContext = contextBuilder + vehicleContext + '\n\nIMPORTANT INSTRUCTIONS:\n' +
            '- Use manual excerpts (M1, M2...) for general procedures and PDF references\n' +
            '- Use WIS data (W1, W2...) for specific technical procedures, bulletins, and updates\n' +
            '- When providing vehicle-specific advice, prioritize information matching the user\'s registered vehicles\n' +
            '- Always cite your sources (e.g., "According to Manual G604..." or "WIS Procedure 123 states...")\n' +
            '- For visual content, mention that diagrams can be viewed in the manual panel\n' +
            '- When WIS entries have "📷 Media Available", mention that diagrams/photos are available inline\n' +
            '- The user interface will automatically display any available media (photos, diagrams, tables) with your response\n' +
            `- Total sources available: ${allSources.length} (${chunks.length || 0} manuals + ${wisChunks.length || 0} WIS entries)`;
        }
      } catch (searchError) {
        console.error('Manual search error:', searchError);
        // Continue without manual context
      }
    }

    // Check rate limiting
    const { data: recentChats } = await supabaseClient
      .from('chat_rate_limits')
      .select('id')
      .eq('user_id', user.id)
      .gte('created_at', new Date(Date.now() - 60000).toISOString()); // Last minute

    if (recentChats && recentChats.length >= 10) {
      return new Response(JSON.stringify({
        error: 'Rate limit exceeded. Please wait a moment.'
      }), {
        status: 429,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    // Record this request for rate limiting
    await supabaseClient.from('chat_rate_limits').insert({
      user_id: user.id
    });

    // Add location context if provided
    let locationContext = '';
    if (location && location.latitude && location.longitude) {
      locationContext = `\n\nCRITICAL CONTEXT:\nUser's current location: Latitude ${location.latitude.toFixed(4)}, Longitude ${location.longitude.toFixed(4)}\nToday's date: ${new Date().toLocaleDateString()}\nCurrent time: ${new Date().toLocaleTimeString()}\nWhen asked about weather, use this location to provide accurate local weather information.\nYou have access to current weather data and forecasts for this location.`;
    } else {
      locationContext = `\n\nCRITICAL CONTEXT:\nToday's date: ${new Date().toLocaleDateString()}\nCurrent time: ${new Date().toLocaleTimeString()}\nLocation not provided, but still answer weather questions with general information.`;
    }

    // Prepare system prompt with context
    const systemPromptWithContext = BARRY_SYSTEM_PROMPT + locationContext + manualContext;

    // Convert messages to Gemini format
    const geminiContents = convertMessagesToGemini(messages, systemPromptWithContext);

    // Call Gemini API
    const geminiResponse = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: geminiContents,
        generationConfig: {
          maxOutputTokens: 800,
          temperature: 0.8,
          topP: 0.8,
          topK: 40
        }
      })
    });

    if (!geminiResponse.ok) {
      const error = await geminiResponse.text();
      console.error('Gemini API error:', error);
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

    const data = await geminiResponse.json();

    // Extract response from Gemini format
    let responseContent = '';
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
      responseContent = data.candidates[0].content.parts[0].text;
    } else {
      responseContent = 'I encountered an issue generating a response. Please try again.';
    }

    // Log the chat for analytics
    await supabaseClient.from('chat_logs').insert({
      user_id: user.id,
      messages: messages,
      response: responseContent,
      model: 'gemini-1.5-flash',
      tokens_used: data.usageMetadata?.totalTokenCount || 0
    });

    // Return the response with manual references in the same format as before
    return new Response(JSON.stringify({
      response: responseContent,
      usage: data.usageMetadata,
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