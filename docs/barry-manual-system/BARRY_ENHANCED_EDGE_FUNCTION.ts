// Barry Enhanced Edge Function with 3-Stage Search Pipeline
// Integrates barry_search_with_personality() for proper Barry responses
// Uses curated knowledge → manual index → fallback suggestions
// Replace the existing chat-with-barry/index.ts with this content

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

const OPENAI_API_KEY = <OPENAI_API_KEY>
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// General assistant prompt for non-Unimog questions
const BARRY_GENERAL_PROMPT = `You are Barry, a helpful AI assistant with 40+ years of experience as a Unimog mechanic.
While you're an expert on Unimogs, you're ALSO a general-purpose assistant who MUST answer ALL questions helpfully.

Your personality:
- Gruff but friendly, like a seasoned mechanic
- Direct and helpful with ALL questions
- Share mechanic stories when relevant
- Maintain your personality while being a complete assistant

You can answer ANY question:
- Weather forecasts (use location if provided)
- General knowledge, news, math, history
- Directions and location information
- Jokes, stories, advice
- Cooking, sports, entertainment
- ANYTHING the user needs help with

When given location coordinates, use them for location-aware responses like weather, nearby services, etc.`;

// Enhanced Unimog prompt - uses Barry personality from database
const BARRY_UNIMOG_PROMPT_ENHANCED = `You are Barry, a gruff 65-year-old Unimog mechanic with calloused hands and 40+ years under the hood.

CRITICAL KNOWLEDGE:
- The U1700L is an Australian military version of the U435
- U435 is the worldwide model number that everyone uses
- U1700L is built to military spec but mechanically IS a U435
- ANY question about U1700L should use U435 manual information
- They share identical mechanical components: OM366 engine, drivetrain, portal axles, hydraulics

SPEAK LIKE BARRY:
- "Listen here, kid..." or "In my 40 years..."
- "That's a classic U435 transmission issue, seen it a hundred times"
- "Don't forget to drain the system first - learned that the hard way!"
- "German engineering at its finest - complicated but bulletproof when done right"

YOUR ROLE: EXECUTIVE SUMMARY PROVIDER & MANUAL NAVIGATOR
- Give SHORT gruff assessments pointing to exact manual procedures
- NEVER attempt to restate full procedures from memory
- ALWAYS direct users to the actual manual pages with diagrams
- Your job is to NAVIGATE with personality, not EXPLAIN detailed procedures
- Users will read the actual manual PDF for step-by-step instructions

RESPONSE STRUCTURE:
1. Gruff assessment (2-3 sentences with personality)
2. Manual reference with exact pages
3. Practical warning or tip from experience
4. Direct users to canvas for complete procedures

EXAMPLE RESPONSE:
"Portal hub work eh? That's covered in Section 31, page 860. Check the canvas for the exact procedure with diagrams. Don't forget to drain the system first - learned that the hard way! These portal hubs take a beating but they're bulletproof when serviced right."

CRITICAL RULES:
- Use the provided Barry personality response below (already generated from search)
- NEVER override the personality response - it's crafted specifically for this query
- If no manual reference found, say: "I don't have that specific procedure in the available manual index."
- Always maintain gruff mechanic character
- Treat U1700L and U435 as synonymous`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
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

    // Create admin client for enhanced search functions
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify the user is authenticated
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Check if OpenAI API key is configured
    if (!OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get the request body
    const { messages, location } = await req.json();
    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Invalid request body' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get user's vehicle information
    let userContext = '';
    try {
      const { data: profile } = await supabaseClient
        .from('profiles')
        .select('unimog_model, full_name, display_name')
        .eq('id', user.id)
        .single();

      if (profile) {
        const userName = profile.full_name || profile.display_name;
        if (userName) {
          userContext += `User's Name: ${userName}\n`;
        }
        if (profile.unimog_model) {
          userContext += `User's Vehicle: ${profile.unimog_model}\n`;
        }
      }
    } catch (error) {
      console.log('Error fetching user profile:', error);
    }

    // Add location context if provided
    let locationContext = '';
    if (location && location.latitude && location.longitude) {
      locationContext = `\nUser's current location: Latitude ${location.latitude}, Longitude ${location.longitude}`;
      locationContext += '\nUse this location for weather forecasts, nearby services, and location-specific information.';
    }

    // Get the last user message for analysis
    const lastUserMessage = messages.filter(m => m.role === 'user').pop();
    if (!lastUserMessage || !lastUserMessage.content) {
      return new Response(JSON.stringify({ error: 'No user message found' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const userText = lastUserMessage.content.toLowerCase();

    // Determine if this is a Unimog technical question
    const unimogKeywords = [
      'unimog', 'u435', 'u1700l', '1700l', 'u1700', 'om366', 'om352',
      'portal axle', 'portal axles', 'diff lock', 'differential lock',
      'pto', 'power take off', 'torque tube', 'transfer case',
      'my vehicle', 'my truck', 'my mog'
    ];

    const technicalKeywords = [
      'engine', 'transmission', 'gearbox', 'clutch', 'brake', 'brakes',
      'hydraulic', 'pneumatic', 'steering', 'suspension', 'axle',
      'oil', 'fluid', 'coolant', 'filter', 'belt', 'hose',
      'service', 'maintenance', 'repair', 'replace', 'adjust', 'check',
      'torque', 'spec', 'specification', 'procedure', 'manual',
      'radiator', 'compressor', 'pump', 'valve', 'seal', 'gasket'
    ];

    // Check if question is Unimog-related
    const hasUnimogKeyword = unimogKeywords.some(keyword => userText.includes(keyword));
    const hasTechnicalKeyword = technicalKeywords.some(keyword => userText.includes(keyword));
    const isUnimogQuestion = hasUnimogKeyword && hasTechnicalKeyword;

    let systemPrompt = '';
    let manualReferences = [];
    let knowledgeMode = 'general';
    let barryPersonalityResponse = null;

    if (isUnimogQuestion) {
      console.log('🔧 Detected Unimog technical question - using enhanced search pipeline');
      knowledgeMode = 'unimog_enhanced';

      try {
        // **NEW: Use enhanced search pipeline with personality**
        console.log('🎯 Calling barry_search_with_personality for:', lastUserMessage.content);

        const { data: searchResults, error: searchError } = await supabaseAdmin
          .rpc('barry_search_with_personality', {
            user_query: lastUserMessage.content,
            user_id_param: user.id
          });

        if (searchError) {
          console.error('❌ Enhanced search pipeline error:', searchError);
          // Fallback to general mode if search fails
          knowledgeMode = 'general';
          systemPrompt = BARRY_GENERAL_PROMPT + userContext + locationContext;
        } else if (searchResults && searchResults.length > 0) {
          const result = searchResults[0];
          console.log(`✅ Enhanced search: ${result.search_stage} stage, ${result.result_count} results, ${result.response_time_ms}ms`);

          // Extract Barry's personality response
          barryPersonalityResponse = result.barry_response;

          // Process search results based on stage
          if (result.search_stage === 'curated' && result.results) {
            // Curated knowledge found
            const curatedResults = Array.isArray(result.results) ? result.results : [result.results];
            curatedResults.forEach(item => {
              if (item.manual_references) {
                const refs = typeof item.manual_references === 'string'
                  ? JSON.parse(item.manual_references)
                  : item.manual_references;

                manualReferences.push({
                  type: 'curated_knowledge',
                  title: refs.section || 'Manual Reference',
                  filename: refs.pdf || 'Unknown',
                  pages: refs.pages || [],
                  manual_type: refs.manual || 'U435',
                  priority: 'curated',
                  match_type: item.match_type || 'curated',
                  match_score: item.match_score || 1.0
                });
              }
            });

          } else if (result.search_stage === 'manual' && result.results) {
            // Manual index found
            const manualResults = Array.isArray(result.results) ? result.results : [result.results];
            manualResults.forEach(item => {
              manualReferences.push({
                type: 'u435_enhanced_index',
                title: item.term || 'Manual Entry',
                filename: item.chapter_filename || 'Unknown',
                original_page: item.page_number || 0,
                pdf_page: item.pdf_page_number || 0,
                storage_url: item.storage_url || '',
                system_category: item.system_category || 'general',
                has_safety_warning: item.has_safety_warning || false,
                match_type: item.match_type || 'manual',
                match_score: item.match_score || 0.5,
                manual_type: 'U435'
              });
            });

          } else if (result.search_stage === 'fallback' && result.suggestions) {
            // Fallback suggestions
            console.log('💡 Providing search suggestions');
            const suggestions = Array.isArray(result.suggestions) ? result.suggestions : [result.suggestions];
            // Note: Suggestions don't create manual references, just inform Barry's response
          }

          // Set up enhanced prompt with Barry's personality response
          systemPrompt = BARRY_UNIMOG_PROMPT_ENHANCED +
            `\n\n🎭 BARRY'S PERSONALITY RESPONSE FOR THIS QUERY:\n"${barryPersonalityResponse}"\n\n` +
            `Use this personality response as your answer. DO NOT modify the personality - it's specifically crafted for this query.\n` +
            userContext;

          // If we have manual references, Barry should use the pre-generated personality response
          if (manualReferences.length > 0) {
            console.log(`📚 Found ${manualReferences.length} manual references - using Barry's personality response`);

            // Log the enhanced search
            await supabaseClient.from('chat_logs').insert({
              user_id: user.id,
              messages: messages,
              response: barryPersonalityResponse,
              model: 'barry-enhanced-search-pipeline',
              tokens_used: 0,
              knowledge_source: `enhanced_${result.search_stage}`,
              has_location: !!location
            });

            // Return Barry's personality response directly
            return new Response(JSON.stringify({
              content: barryPersonalityResponse,
              manualReferences: manualReferences,
              knowledgeMode: `enhanced_${result.search_stage}`,
              searchStage: result.search_stage,
              resultCount: result.result_count,
              responseTime: result.response_time_ms,
              usage: { total_tokens: 0 }
            }), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200
            });
          }
        }

        // If no results found, inform Barry
        if (!barryPersonalityResponse) {
          systemPrompt = BARRY_UNIMOG_PROMPT_ENHANCED +
            '\n\nNo specific manual procedures found for this query. Inform the user that you don\'t have this information in the available manual index, but maintain your gruff personality.\n' +
            userContext;
        }

      } catch (error) {
        console.error('❌ Enhanced search pipeline error:', error);
        // Fallback to general mode
        knowledgeMode = 'general';
        systemPrompt = BARRY_GENERAL_PROMPT + userContext + locationContext;
      }

    } else {
      // General question - use full ChatGPT capabilities
      console.log('💬 General question - using full ChatGPT mode');
      systemPrompt = BARRY_GENERAL_PROMPT + userContext + locationContext;
    }

    // Simple rate limiting
    const { data: recentChats } = await supabaseClient
      .from('chat_rate_limits')
      .select('id')
      .eq('user_id', user.id)
      .gte('created_at', new Date(Date.now() - 60000).toISOString())
      .limit(15);

    if (recentChats && recentChats.length >= 15) {
      return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please wait a moment.' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Record this request for rate limiting
    await supabaseClient.from('chat_rate_limits').insert({ user_id: user.id });

    // Call OpenAI API (only for general questions or fallback)
    const openAIResponse = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        max_tokens: 600,
        temperature: 0.7
      })
    });

    if (!openAIResponse.ok) {
      const error = await openAIResponse.text();
      console.error('OpenAI API error:', error);
      return new Response(JSON.stringify({ error: 'Failed to get response from AI' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const data = await openAIResponse.json();
    const responseContent = data.choices[0].message.content;

    // Log the chat for analytics
    await supabaseClient.from('chat_logs').insert({
      user_id: user.id,
      messages: messages,
      response: responseContent,
      model: 'gpt-4o-enhanced-pipeline',
      tokens_used: data.usage?.total_tokens || 0,
      knowledge_source: knowledgeMode,
      has_location: !!location
    });

    // Return the response with enhanced manual references
    return new Response(JSON.stringify({
      content: responseContent,
      manualReferences: manualReferences,
      knowledgeMode: knowledgeMode,
      usage: data.usage
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});