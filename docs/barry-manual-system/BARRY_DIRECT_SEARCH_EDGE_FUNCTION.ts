// Barry Direct Search Edge Function - Bypasses Analytics Issues
// Calls search_manual_index() directly which we know works
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

// Barry personality templates for different system categories
const BARRY_PERSONALITY_TEMPLATES = {
  assessment: {
    engine: "Listen here - that's a classic OM366 issue I've seen a hundred times. In my 40 years under the hood, this always traces back to",
    transmission: "Right, transmission trouble. Been working on these gearboxes since before you were born. Nine times out of ten, it's",
    brakes: "Brake problems, eh? Don't mess around with stopping power - learned that the hard way back in '85. What you've got here is",
    steering: "Power steering acting up? Classic U435 hydraulic issue. I've rebuilt more steering boxes than I care to count",
    axles: "Portal axle problems - welcome to Unimog ownership, kid. These things are bulletproof but when they go wrong",
    electrical: "Electrical gremlins, the bane of every mechanic's existence. 40 years and I still hate chasing wires",
    cooling: "Cooling system work, eh? Not too common on these bulletproof machines, but when it happens",
    fuel: "Fuel system problems are usually simple - dirty filter, clogged line, or that injection pump acting up again",
    general: "Alright, let me see what we've got here. In four decades of Unimog work, I've seen this before"
  },
  safety: {
    brakes: "STOP. Before you touch anything brake-related, depressurize the system completely. I've seen too many accidents.",
    steering: "Warning: Never work on steering with the engine running. Hydraulic pressure will take your finger off.",
    axles: "Portal hub work requires proper support - these axles weigh more than a small car. Don't trust a floor jack.",
    electrical: "Disconnect the battery first, both terminals. 24-volt systems bite harder than 12-volt ones.",
    general: "Safety first, kid. These machines don't forgive mistakes and I've got the scars to prove it."
  },
  barryisms: [
    "That's what 40 years of busted knuckles teaches you.",
    "Mercedes built these things like tanks. When something breaks, it's usually because someone didn't follow the manual.",
    "I've seen this problem more times than I've had hot dinners.",
    "Trust me, I've made every mistake in the book so you don't have to.",
    "These Unimogs will outlast us all if you treat them right.",
    "Don't take shortcuts - I learned that lesson the expensive way."
  ]
};

// Function to build Barry's response based on search results
function buildBarryResponse(searchResults, userQuery) {
  if (!searchResults || searchResults.length === 0) {
    return "Listen here, I don't have that specific procedure in the available manual index. But from my 40 years of experience, " +
           "here's what I can tell you: always check the basics first - fluids, filters, and fittings. " +
           "If you can get me more specific info about what system you're working on, I might be able to help better.";
  }

  // Determine system category from results
  const firstResult = searchResults[0];
  const systemCategory = firstResult.system_category || 'general';

  // Build response with personality
  let response = "";

  // Add assessment based on category
  const assessment = BARRY_PERSONALITY_TEMPLATES.assessment[systemCategory] ||
                    BARRY_PERSONALITY_TEMPLATES.assessment.general;
  response += assessment + " ";

  // Add manual references
  if (searchResults.length === 1) {
    response += `what you need. Check ${firstResult.chapter_filename}, page ${firstResult.pdf_page_number}. `;
    response += `The canvas will show you the exact procedure with diagrams. `;
  } else {
    response += `multiple things to check:\n\n`;
    searchResults.slice(0, 3).forEach((result, idx) => {
      response += `${idx + 1}. ${result.term} - ${result.chapter_filename}, page ${result.pdf_page_number}\n`;
    });
    response += "\nAll the procedures are in the canvas with full diagrams. ";
  }

  // Add safety warning if needed
  if (firstResult.has_safety_warning || ['brakes', 'steering', 'axles', 'electrical'].includes(systemCategory)) {
    const safetyWarning = BARRY_PERSONALITY_TEMPLATES.safety[systemCategory] ||
                         BARRY_PERSONALITY_TEMPLATES.safety.general;
    response += "\n\n⚠️ " + safetyWarning + " ";
  }

  // Add a Barry-ism
  const randomBarryism = BARRY_PERSONALITY_TEMPLATES.barryisms[
    Math.floor(Math.random() * BARRY_PERSONALITY_TEMPLATES.barryisms.length)
  ];
  response += "\n\n" + randomBarryism;

  return response;
}

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

    // Create admin client for search functions
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
      'my vehicle', 'my truck', 'my mog', 'air tank', 'tank'
    ];

    const technicalKeywords = [
      'engine', 'transmission', 'gearbox', 'clutch', 'brake', 'brakes',
      'hydraulic', 'pneumatic', 'steering', 'suspension', 'axle',
      'oil', 'fluid', 'coolant', 'filter', 'belt', 'hose',
      'service', 'maintenance', 'repair', 'replace', 'adjust', 'check',
      'torque', 'spec', 'specification', 'procedure', 'manual',
      'radiator', 'compressor', 'pump', 'valve', 'seal', 'gasket',
      'air', 'tank', 'reservoir', 'pressure'
    ];

    // Check if question is Unimog-related
    const hasUnimogKeyword = unimogKeywords.some(keyword => userText.includes(keyword));
    const hasTechnicalKeyword = technicalKeywords.some(keyword => userText.includes(keyword));
    const isUnimogQuestion = (hasUnimogKeyword || userText.includes('my')) && hasTechnicalKeyword;

    let systemPrompt = '';
    let manualReferences = [];
    let knowledgeMode = 'general';
    let barryResponse = null;

    if (isUnimogQuestion) {
      console.log('🔧 Detected Unimog technical question - using direct search');
      knowledgeMode = 'unimog_direct';

      try {
        // **DIRECT SEARCH - This works!**
        console.log('🎯 Calling search_manual_index directly for:', lastUserMessage.content);

        const { data: searchResults, error: searchError } = await supabaseAdmin
          .rpc('search_manual_index', {
            user_query: lastUserMessage.content,
            max_results: 5
          });

        if (searchError) {
          console.error('❌ Direct search error:', searchError);
          // Fall back to general mode if search fails
          knowledgeMode = 'general';
          systemPrompt = BARRY_GENERAL_PROMPT + userContext + locationContext;
        } else if (searchResults && searchResults.length > 0) {
          console.log(`✅ Found ${searchResults.length} manual references`);

          // Build Barry's response with personality
          barryResponse = buildBarryResponse(searchResults, lastUserMessage.content);

          // Process manual references for canvas display
          searchResults.forEach(item => {
            manualReferences.push({
              type: 'u435_optimized_index',
              title: item.term || 'Manual Entry',
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

          // Log the successful search
          await supabaseClient.from('chat_logs').insert({
            user_id: user.id,
            messages: messages,
            response: barryResponse,
            model: 'barry-direct-search',
            tokens_used: 0,
            knowledge_source: 'manual_index_direct',
            has_location: !!location
          });

          // Return Barry's response with manual references
          return new Response(JSON.stringify({
            content: barryResponse,
            manualReferences: manualReferences,
            knowledgeMode: knowledgeMode,
            searchResultCount: searchResults.length,
            usage: { total_tokens: 0 }
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
          });
        } else {
          // No results found
          console.log('📭 No manual references found');
          barryResponse = buildBarryResponse(null, lastUserMessage.content);

          // Return Barry's "no results" response
          return new Response(JSON.stringify({
            content: barryResponse,
            manualReferences: [],
            knowledgeMode: 'no_results',
            usage: { total_tokens: 0 }
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
          });
        }
      } catch (error) {
        console.error('❌ Search error:', error);
        // Fall back to general mode
        knowledgeMode = 'general';
        systemPrompt = BARRY_GENERAL_PROMPT + userContext + locationContext;
      }
    } else {
      // General question - use full ChatGPT capabilities
      console.log('💬 General question - using full ChatGPT mode');
      systemPrompt = BARRY_GENERAL_PROMPT + userContext + locationContext;
    }

    // Only call OpenAI for general questions (not Unimog technical)
    if (knowledgeMode === 'general') {
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

      // Call OpenAI API for general questions
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
        model: 'gpt-4o-general',
        tokens_used: data.usage?.total_tokens || 0,
        knowledge_source: knowledgeMode,
        has_location: !!location
      });

      // Return general response
      return new Response(JSON.stringify({
        content: responseContent,
        manualReferences: [],
        knowledgeMode: knowledgeMode,
        usage: data.usage
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });
    }

  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});