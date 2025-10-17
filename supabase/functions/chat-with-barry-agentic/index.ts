// CRITICAL BACKUP: Barry Edge Function - Deployed Version as of 2025-09-30
// This is the EXACT version currently running on Supabase production
// Status: WORKING for hardcoded questions (radiator, air tank), NOT working for new questions (electrical system)
// Backup created before implementing database-first routing
// To restore: Copy this entire file to Supabase Edge Functions dashboard
// Barry Direct Search Edge Function - Enhanced Intent Detection
// Date: 2025-09-29
// Version: 64 - IMPROVED: Better intent detection to handle general requests with Unimog context
// Previous fix preserved: Prioritizes maintenance manuals over general chapters

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
- Writing letters, emails, documents
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
    general: "Alright, let me see what we've got here. In four decades of Unimog work, I've seen this before",
  },
  safety: {
    brakes: "STOP. Before you touch anything brake-related, depressurize the system completely. I've seen too many accidents.",
    steering: "Warning: Never work on steering with the engine running. Hydraulic pressure will take your finger off.",
    axles: "Portal hub work requires proper support - these axles weigh more than a small car. Don't trust a floor jack.",
    electrical: "Disconnect the battery first, both terminals. 24-volt systems bite harder than 12-volt ones.",
    general: "Safety first, kid. These machines don't forgive mistakes and I've got the scars to prove it.",
  },
  barryisms: [
    "That's what 40 years of busted knuckles teaches you.",
    "Mercedes built these things like tanks. When something breaks, it's usually because someone didn't follow the manual.",
    "I've seen this problem more times than I've had hot dinners.",
    "Trust me, I've made every mistake in the book so you don't have to.",
    "These Unimogs will outlast us all if you treat them right.",
    "Don't take shortcuts - I learned that lesson the expensive way.",
  ],
};

// FIXED: Smart prioritization function to ensure maintenance manuals come first
function prioritizeSearchResults(searchResults: any[], userQuery: string): any[] {
  if (!searchResults || searchResults.length === 0) return [];

  // Smart sorting: Prioritize maintenance manuals over general chapters
  const sortedResults = searchResults.sort((a, b) => {
    // Check if filename contains "Maint_" (maintenance manual indicator)
    const aIsMaintenance = (a.chapter_filename && a.chapter_filename.includes('Maint_')) || false;
    const bIsMaintenance = (b.chapter_filename && b.chapter_filename.includes('Maint_')) || false;

    // Maintenance manuals always come first
    if (aIsMaintenance && !bIsMaintenance) return -1;
    if (!aIsMaintenance && bIsMaintenance) return 1;

    // If both same type, sort by relevance score then page number
    if (a.match_score !== b.match_score) {
      return (b.match_score || 0) - (a.match_score || 0);
    }
    return (a.page_number || 0) - (b.page_number || 0);
  });

  return sortedResults.slice(0, 3); // Return top 3 results
}

// Function to build Barry's response based on search results
function buildBarryResponse(searchResults: any[], userQuery: string): string {
  if (!searchResults || searchResults.length === 0) {
    return (
      "Listen here, I don't have that specific procedure in the available manual index. But from my 40 years of experience, " +
      "here's what I can tell you: always check the basics first - fluids, filters, and fittings. " +
      "If you can get me more specific info about what system you're working on, I might be able to help better."
    );
  }

  // Apply smart prioritization to ensure maintenance manuals come first
  const prioritizedResults = prioritizeSearchResults(searchResults, userQuery);

  // Determine system category from results
  const firstResult = prioritizedResults[0];
  const systemCategory = firstResult.system_category || 'general';

  // Build response with personality
  let response = "";

  // Add assessment based on category
  const assessment = BARRY_PERSONALITY_TEMPLATES.assessment[systemCategory] || BARRY_PERSONALITY_TEMPLATES.assessment.general;
  response += assessment + " ";

  // Add manual references
  if (prioritizedResults.length === 1) {
    response += `what you need. Check ${firstResult.chapter_filename}, page ${firstResult.pdf_page_number}. `;
    response += `The canvas will show you the exact procedure with diagrams. `;
  } else {
    response += `multiple things to check:\n\n`;
    prioritizedResults.forEach((result, idx) => {
      response += `${idx + 1}. ${result.term} - ${result.chapter_filename}, page ${result.pdf_page_number}\n`;
    });
    response += "\nAll the procedures are in the canvas with full diagrams. ";
  }

  // Add safety warning if needed
  if (firstResult.has_safety_warning || ['brakes', 'steering', 'axles', 'electrical'].includes(systemCategory)) {
    const safetyWarning = BARRY_PERSONALITY_TEMPLATES.safety[systemCategory] || BARRY_PERSONALITY_TEMPLATES.safety.general;
    response += "\n\n⚠️ " + safetyWarning + " ";
  }

  // Add a Barry-ism
  const randomBarryism = BARRY_PERSONALITY_TEMPLATES.barryisms[Math.floor(Math.random() * BARRY_PERSONALITY_TEMPLATES.barryisms.length)];
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
      { global: { headers: { Authorization: authHeader } } }
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
    const lastUserMessage = messages.filter((m: any) => m.role === 'user').pop();
    if (!lastUserMessage || !lastUserMessage.content) {
      return new Response(JSON.stringify({ error: 'No user message found' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const userText = lastUserMessage.content.toLowerCase();

    // ENHANCED Decision Table-Based Routing for Barry (v64)
    // Better intent detection that checks for general requests even with Unimog mentions

    // Rule 1: Non-technical intents → ChatGPT mode (ENHANCED with more keywords)
    const nonTechnicalIntents = [
      // Document writing
      'write', 'letter', 'email', 'document', 'compose', 'draft', 'tell', 'explain to',
      'boss', 'employer', 'colleague', 'wife', 'husband', 'friend', 'late', 'absence',
      // Account and billing
      'billing', 'pricing', 'account', 'signup', 'password', 'login', 'shipping', 'returns',
      // Website and community
      'website', 'app bug', 'community rules', 'forum', 'moderation',
      // General questions
      'joke', 'weather', 'news', 'how are you', 'what is barry',
      'price', 'cost', 'buy', 'sell', 'policy', 'refund', 'meme', 'horoscope', 'politics', 'recipe', 'cook',
      // General assistance phrases
      'help me write', 'can you write', 'create a', 'make a', 'generate'
    ];

    // Rule 2: Repair/diagnosis phrases → Manual mode
    const repairDiagnosisPhrases = [
      'replace', 'remove', 'install', 'fit', 'rebuild', 'overhaul', 'repair', 'fix', 'service',
      'adjust', 'align', 'bleed', 'calibrate', 'torque', 'spec', 'specs', 'specification', 'specifications',
      'procedure', 'manual', 'how do i change', 'how to replace', 'how to fix', 'how to repair', 'steps',
      'stuck', 'seized', 'leaking', 'overheats', 'won\'t start', 'grinding', 'squeal', 'pressure low',
      'fault code', 'trouble', 'check engine'
    ];

    // Rule 3: Vehicle systems/parts → Manual mode
    const vehicleSystemsParts = [
      'radiator', 'cooling', 'fan clutch', 'thermostat', 'hose', 'pump', 'compressor', 'dryer', 'valve',
      'injector', 'turbo', 'gearbox', 'transmission', 'clutch', 'differential', 'axle', 'portal hub',
      'wheel bearing', 'brake', 'caliper', 'master cylinder', 'air tank', 'line', 'pto', 'power take off',
      'torque tube', 'transfer case', 'steering', 'suspension', 'spring', 'shock', 'kingpin', 'hub seal',
      'gasket', 'alternator', 'starter', 'battery', 'relay', 'fuse', 'wiring', 'harness', 'engine',
      'hydraulic', 'pneumatic', 'filter', 'belt', 'oil change', 'fluid', 'coolant', 'seal', 'reservoir', 'pressure'
    ];

    // Rule 4: Unimog context keywords
    const unimogContext = [
      'unimog', 'mog', 'u435', 'u1700l', 'u1700', '1700l', 'om352', 'om366',
      '406', '416', '435', '437', 'my truck', 'my vehicle', 'my mog',
      'portal axle', 'portal axles', 'diff lock', 'differential lock'
    ];

    // Normalize text for matching
    const normalizedText = userText.toLowerCase().replace(/[^\w\s]/g, ' ');

    // ENHANCED Decision Table Evaluation (v64) - Better priority order
    function classifyQuery(text: string) {
      // CRITICAL CHANGE: Check for non-technical intents FIRST, even if Unimog is mentioned
      // This prevents "my unimog broke, write a letter" from triggering manual mode

      // Rule 1: Non-technical intent check (HIGHEST PRIORITY)
      const hasNonTechnicalIntent = nonTechnicalIntents.some(intent => text.includes(intent));
      if (hasNonTechnicalIntent) {
        // Even if they mention Unimog, if they're asking for general help, use ChatGPT
        return { mode: 'chatgpt', rule: 'non_technical', matched: 'general_intent' };
      }

      // Rule 2: Check for BOTH Unimog context AND technical intent
      // Only go to manual mode if BOTH conditions are met
      const hasUnimogMention = unimogContext.some(token => text.includes(token));
      const hasRepairIntent = repairDiagnosisPhrases.some(phrase => text.includes(phrase));
      const hasVehiclePart = vehicleSystemsParts.some(part => text.includes(part));

      // Only trigger manual mode if there's a technical question about Unimog
      if (hasUnimogMention && (hasRepairIntent || hasVehiclePart)) {
        return { mode: 'manual', rule: 'unimog_technical', matched: 'unimog_repair' };
      }

      // Rule 3: Technical questions without Unimog context might still be manual-worthy
      if (hasRepairIntent && hasVehiclePart) {
        return { mode: 'manual', rule: 'repair_diagnosis', matched: 'repair_intent' };
      }

      // Rule 4: Just mentioning Unimog without technical context = ChatGPT
      if (hasUnimogMention && !hasRepairIntent && !hasVehiclePart) {
        return { mode: 'chatgpt', rule: 'unimog_general', matched: 'unimog_mention_only' };
      }

      // Rule 5: Default to ChatGPT for general/ambiguous queries
      return { mode: 'chatgpt', rule: 'default', matched: 'general_fallback' };
    }

    // Apply decision table
    const routingDecision = classifyQuery(normalizedText);
    const isUnimogQuestion = routingDecision.mode === 'manual';

    let systemPrompt = '';
    let manualReferences: any[] = [];
    let knowledgeMode = 'general';
    let barryResponse = null;

    if (isUnimogQuestion) {
      console.log(`🔧 Technical question detected - Rule: ${routingDecision.rule}, Match: ${routingDecision.matched}`);
      knowledgeMode = 'unimog_direct';

      try {
        // **DIRECT SEARCH with SMART PRIORITIZATION - This is the fix!**
        console.log('🎯 Calling search_manual_index directly for:', lastUserMessage.content);
        const { data: searchResults, error: searchError } = await supabaseAdmin.rpc('search_manual_index', {
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

          // Build Barry's response with smart prioritization (THE FIX!)
          barryResponse = buildBarryResponse(searchResults, lastUserMessage.content);

          // Apply prioritization for manual references sent to frontend
          const prioritizedResults = prioritizeSearchResults(searchResults, lastUserMessage.content);

          // Process manual references for canvas display
          prioritizedResults.forEach((item) => {
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
              manual_type: 'U435',
              is_maintenance_manual: (item.chapter_filename && item.chapter_filename.includes('Maint_')) || false
            });
          });

          // Log the successful search with routing telemetry
          await supabaseClient.from('chat_logs').insert({
            user_id: user.id,
            messages: messages,
            response: barryResponse,
            model: 'barry-direct-search-v64-enhanced',
            tokens_used: 0,
            knowledge_source: `manual_index_direct_${routingDecision.rule}`,
            has_location: !!location,
            routing_rule: routingDecision.rule,
            routing_match: routingDecision.matched,
            pdf_references_found: prioritizedResults.length
          });

          // Return Barry's response with manual references
          return new Response(JSON.stringify({
            content: barryResponse,
            manualReferences: manualReferences,
            knowledgeMode: knowledgeMode,
            searchResultCount: prioritizedResults.length,
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
      console.log(`💬 General question detected - Rule: ${routingDecision.rule}, Match: ${routingDecision.matched}`);
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

      // Log the chat for analytics with routing telemetry
      await supabaseClient.from('chat_logs').insert({
        user_id: user.id,
        messages: messages,
        response: responseContent,
        model: 'gpt-4o-general',
        tokens_used: data.usage?.total_tokens || 0,
        knowledge_source: `${knowledgeMode}_${routingDecision.rule}`,
        has_location: !!location,
        routing_rule: routingDecision.rule,
        routing_match: routingDecision.matched,
        pdf_references_found: 0
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
