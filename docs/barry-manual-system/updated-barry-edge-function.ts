// Barry Simplified Edge Function - No Runtime Translation
// Uses pre-calculated PDF page numbers from optimized index
// Replace the existing chat-with-barry/index.ts with this content

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
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

// Unimog-specific prompt for technical questions - SIMPLIFIED
const BARRY_UNIMOG_PROMPT = `You are Barry, a specialized U435/U1700L Unimog mechanic with 40+ years of experience.

CRITICAL KNOWLEDGE:
- The U1700L is an Australian military version of the U435
- U435 is the worldwide model number that everyone uses
- U1700L is built to military spec but mechanically IS a U435
- ANY question about U1700L should use U435 manual information
- They share identical mechanical components: OM366 engine, drivetrain, portal axles, hydraulics
- When users ask about U1700L, use U435 manuals as they're mechanically the same

YOUR ROLE: EXECUTIVE SUMMARY PROVIDER & MANUAL NAVIGATOR
- Give SHORT executive summaries pointing to exact manual procedures
- NEVER attempt to restate full procedures from memory
- ALWAYS direct users to the actual manual pages with diagrams
- Your job is to NAVIGATE, not EXPLAIN detailed procedures
- Users will read the actual manual PDF for step-by-step instructions

RESPONSE FORMAT:
1. Brief executive summary (2-3 sentences max)
2. Direct reference to exact manual section and page number
3. Mention the user should refer to the manual PDF for complete procedures
4. Include any critical safety warnings

EXAMPLE RESPONSE:
"Portal hub seal replacement is covered in U435 Manual Section 19, page 555. The procedure includes hub disassembly, seal extraction, and reassembly with proper torque specifications. Refer to the complete manual procedure with diagrams for step-by-step instructions. Warning: Drain hub oil before starting work."

CRITICAL RULES:
- Use ONLY the provided manual references below
- NEVER make up technical information
- NEVER provide detailed step-by-step procedures
- If no manual reference found, say: "I don't have that specific procedure in the available manual index."
- Always cite exact page numbers and sections
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
          headers: {
            Authorization: authHeader
          }
        }
      }
    );

    // Create admin client for curated knowledge lookup
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
      'torque', 'spec', 'specification', 'procedure', 'manual'
    ];

    // Check if question is Unimog-related
    const hasUnimogKeyword = unimogKeywords.some(keyword => userText.includes(keyword));
    const hasTechnicalKeyword = technicalKeywords.some(keyword => userText.includes(keyword));
    const isUnimogQuestion = hasUnimogKeyword && hasTechnicalKeyword;

    let systemPrompt = '';
    let manualReferences = [];
    let knowledgeMode = 'general';
    let curatedResponse = null;

    if (isUnimogQuestion) {
      console.log('Detected Unimog technical question - checking curated knowledge first');
      knowledgeMode = 'unimog';

      // STEP 1: Check curated knowledge base first
      try {
        console.log('🔍 Checking barry_knowledge_base for curated responses...');
        const { data: knowledgeEntries, error: knowledgeError } = await supabaseAdmin
          .from('barry_knowledge_base')
          .select('*')
          .order('priority', { ascending: false });

        if (!knowledgeError && knowledgeEntries && knowledgeEntries.length > 0) {
          // Check for keyword matches in curated knowledge
          const curatedMatch = knowledgeEntries.find(entry =>
            entry.question_keywords.some(keyword =>
              userText.includes(keyword.toLowerCase())
            )
          );

          if (curatedMatch) {
            console.log('✅ Found curated knowledge match:', curatedMatch.question_keywords);

            // Use curated response directly
            curatedResponse = curatedMatch.barry_response_template;

            // Create manual reference from curated data
            if (curatedMatch.manual_references) {
              manualReferences.push({
                type: 'curated_knowledge',
                title: curatedMatch.manual_references.section || 'Manual Reference',
                filename: curatedMatch.manual_references.pdf || 'Unknown',
                pages: curatedMatch.manual_references.pages || [],
                manual_type: curatedMatch.manual_references.manual || 'U435',
                priority: 'curated'
              });
            }

            // Return curated response immediately
            await supabaseClient.from('chat_logs').insert({
              user_id: user.id,
              messages: messages,
              response: curatedResponse,
              model: 'barry-curated-knowledge',
              tokens_used: 0,
              knowledge_source: 'curated',
              has_location: !!location
            });

            return new Response(JSON.stringify({
              content: curatedResponse,
              manualReferences: manualReferences,
              knowledgeMode: 'curated',
              usage: { total_tokens: 0 }
            }), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200
            });
          }
        }
      } catch (error) {
        console.error('❌ Error checking curated knowledge:', error);
      }

      console.log('📖 No curated match found, proceeding with optimized U435 manual search...');

      // STEP 2: Search optimized U435 manual index (NO TRANSLATION NEEDED)
      let u435Context = '';
      const searchTerms = [];

      // Extract relevant search terms
      for (const keyword of technicalKeywords) {
        if (userText.includes(keyword)) {
          searchTerms.push(keyword);
        }
      }

      if (searchTerms.length > 0) {
        console.log('Searching optimized U435 index with terms:', searchTerms);
        try {
          // Search the optimized manual index with pre-calculated PDF info
          const allMatches = [];
          for (const term of searchTerms.slice(0, 5)) {
            const { data: indexMatches, error } = await supabaseClient
              .from('u435_manual_index')
              .select('term, page_number, chapter_filename, chapter_number, pdf_page_number, storage_url')
              .ilike('term', `%${term}%`)
              .limit(5);

            if (!error && indexMatches) {
              allMatches.push(...indexMatches);
            }
          }

          // Remove duplicates and sort by page number
          const uniqueMatches = allMatches.filter((match, index, self) =>
            index === self.findIndex(m => m.page_number === match.page_number)
          );

          const indexResults = uniqueMatches.sort((a, b) => a.page_number - b.page_number).slice(0, 3);

          if (indexResults && indexResults.length > 0) {
            console.log(`Found ${indexResults.length} relevant U435 index entries`);

            // Build executive summary context - NO CALCULATIONS NEEDED
            u435Context = '\n\n📖 U435/U1700L MANUAL PROCEDURES FOUND:\n';
            indexResults.forEach((match, idx) => {
              u435Context += `\n[${idx + 1}] Manual Page ${match.page_number} - ${match.term}\n`;
              u435Context += `Chapter: ${match.chapter_filename}\n`;
              u435Context += `PDF Page: ${match.pdf_page_number}\n\n`;

              // Create manual reference - all data already pre-calculated
              manualReferences.push({
                type: 'u435_optimized_index',
                title: match.term,
                filename: match.chapter_filename,
                original_page: match.page_number,
                pdf_page: match.pdf_page_number,
                storage_url: match.storage_url,
                chapter_number: match.chapter_number,
                manual_type: 'U435'
              });
            });
          }
        } catch (error) {
          console.error('U435 optimized index search error:', error);
        }
      }

      systemPrompt = BARRY_UNIMOG_PROMPT + u435Context + userContext;

      if (!u435Context) {
        // No manual data found, but it's a Unimog question
        systemPrompt += '\n\nNo specific manual procedures found for this query. Inform the user that you don\'t have this information in the available manual index.';
      }
    } else {
      // General question - use full ChatGPT capabilities
      console.log('General question - using full ChatGPT mode');
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

    // Call OpenAI API
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
      model: 'gpt-4o-optimized-index',
      tokens_used: data.usage?.total_tokens || 0,
      knowledge_source: knowledgeMode,
      has_location: !!location
    });

    // Return the response with pre-calculated manual references
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