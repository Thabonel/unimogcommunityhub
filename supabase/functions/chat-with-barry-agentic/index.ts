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

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');

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

// Format the full manual index for Claude's context
function formatManualIndexForClaude(indexEntries: any[]): string {
  if (!indexEntries || indexEntries.length === 0) {
    return 'No manual index available.';
  }

  let formattedIndex = 'U435 UNIMOG WORKSHOP MANUAL INDEX\n';
  formattedIndex += '=================================\n\n';

  indexEntries.forEach((entry, idx) => {
    formattedIndex += `${idx + 1}. ${entry.term}\n`;
    formattedIndex += `   Page: ${entry.page_number} | PDF: ${entry.chapter_filename} (page ${entry.pdf_page_number})\n`;
    if (entry.system_category) {
      formattedIndex += `   System: ${entry.system_category}\n`;
    }
    formattedIndex += '\n';
  });

  return formattedIndex;
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

    // Check if Anthropic API key is configured
    if (!ANTHROPIC_API_KEY) {
      return new Response(JSON.stringify({ error: 'Anthropic API key not configured' }), {
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

    // DIAGNOSTIC: Log routing decision
    console.log('=== ROUTING DIAGNOSTIC ===');
    console.log('User query:', lastUserMessage.content);
    console.log('Normalized text:', normalizedText);
    console.log('Routing decision:', JSON.stringify(routingDecision));
    console.log('isUnimogQuestion:', isUnimogQuestion);
    console.log('========================');

    let systemPrompt = '';
    let manualReferences: any[] = [];
    let knowledgeMode = 'general';
    let barryResponse = null;

    if (isUnimogQuestion) {
      console.log(`Technical question detected - Rule: ${routingDecision.rule}, Match: ${routingDecision.matched}`);
      knowledgeMode = 'unimog_agentic';

      try {
        // STEP 1: Load the FULL manual index (all 696 entries)
        console.log('Loading full u435_manual_index for Claude...');
        const { data: fullIndex, error: indexError } = await supabaseAdmin
          .from('u435_manual_index')
          .select('*')
          .order('page_number', { ascending: true });

        if (indexError) {
          console.error('Failed to load manual index:', indexError);
          knowledgeMode = 'general';
          systemPrompt = BARRY_GENERAL_PROMPT + userContext + locationContext;
        } else if (!fullIndex || fullIndex.length === 0) {
          console.log('Manual index is empty');
          knowledgeMode = 'general';
          systemPrompt = BARRY_GENERAL_PROMPT + userContext + locationContext;
        } else {
          console.log(`Loaded ${fullIndex.length} index entries`);

          // Format the index for Claude
          const formattedIndex = formatManualIndexForClaude(fullIndex);
          console.log(`Formatted index size: ${formattedIndex.length} characters`);

          // STEP 2: Give Claude the full index and let HIM decide what's relevant
          const agenticSystemPrompt = `You are Barry, a gruff but friendly Unimog mechanic with 40+ years of experience.

${userContext}

You have access to the COMPLETE U435 Unimog Workshop Manual index below. Read through it and pick ONLY the MOST RELEVANT pages that DIRECTLY answer the user's question.

${formattedIndex}

CRITICAL INSTRUCTIONS:
1. Read the user's question carefully - what SPECIFIC task are they asking about?
2. Pick ONLY 2-4 pages that DIRECTLY cover that specific procedure
3. DO NOT cite general reference pages (like "technical data", "specifications", "exploded views") unless specifically asked
4. Focus on PROCEDURE pages (like "removal installation", "adjustment procedure", "disassembly assembly")
5. If they ask "how do I remove the engine" → cite ONLY "engine removal installation" pages, NOT all engine pages

EXAMPLES:
- "how do I change portal hub oil" → cite ONLY portal hub oil drain/change pages (page 737)
- "how do I remove the engine" → cite ONLY engine removal/installation pages, NOT pistons/bearings/specs
- "what are the torque specs for the head bolts" → cite ONLY tightening torques page

Be SELECTIVE. You're a mechanic helping with a SPECIFIC job, not teaching an entire chapter.

Always cite specific page numbers and PDF files in your response.`;

          // STEP 3: Call Claude with the full index
          const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': ANTHROPIC_API_KEY,
              'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
              model: 'claude-3-5-haiku-20241022',
              max_tokens: 800,
              temperature: 0.7,
              system: agenticSystemPrompt,
              messages: messages.map(m => ({
                role: m.role === 'assistant' ? 'assistant' : 'user',
                content: m.content
              }))
            })
          });

          if (!anthropicResponse.ok) {
            const error = await anthropicResponse.text();
            console.error('Claude API error:', error);
            throw new Error('Claude API failed');
          }

          const claudeData = await anthropicResponse.json();
          const claudeResponse = claudeData.content[0].text;

          console.log('Claude response:', claudeResponse);

          // STEP 4: Extract page references from Claude's response
          // Look for patterns like "page 737" or "U435_19_Wheel_Hub_Front.pdf"
          const pageMatches = claudeResponse.matchAll(/page\s+(\d+)/gi);
          const pdfMatches = claudeResponse.matchAll(/(U435_[^\s,\.]+\.pdf)/gi);

          const referencedPages = new Set<number>();
          const referencedPDFs = new Set<string>();

          for (const match of pageMatches) {
            referencedPages.add(parseInt(match[1]));
          }

          for (const match of pdfMatches) {
            referencedPDFs.add(match[1]);
          }

          console.log('Referenced pages:', Array.from(referencedPages));
          console.log('Referenced PDFs:', Array.from(referencedPDFs));

          // STEP 5: Build manual references for the frontend
          fullIndex.forEach((entry) => {
            const pageMatches = referencedPages.has(entry.page_number);
            const pdfMatches = referencedPDFs.has(entry.chapter_filename);

            if (pageMatches || pdfMatches) {
              manualReferences.push({
                type: 'u435_agentic',
                title: entry.term || 'Manual Entry',
                original_page: entry.page_number || 0,
                pdf_page: entry.pdf_page_number || 0,
                storage_url: entry.storage_url || '',
                system_category: entry.system_category || 'general',
                has_safety_warning: entry.has_safety_warning || false,
                match_type: 'claude_selected',
                match_score: 1.0,
                manual_type: 'U435',
                is_maintenance_manual: (entry.chapter_filename && entry.chapter_filename.includes('Maint_')) || false
              });
            }
          });

          // Log the agentic response
          await supabaseClient.from('chat_logs').insert({
            user_id: user.id,
            messages: messages,
            response: claudeResponse,
            model: 'claude-3-5-haiku-agentic',
            tokens_used: (claudeData.usage?.input_tokens || 0) + (claudeData.usage?.output_tokens || 0),
            knowledge_source: `agentic_full_index_${routingDecision.rule}`,
            has_location: !!location,
            routing_rule: routingDecision.rule,
            routing_match: routingDecision.matched,
            pdf_references_found: manualReferences.length
          });

          // Return Claude's intelligent response
          return new Response(JSON.stringify({
            content: claudeResponse,
            manualReferences: manualReferences,
            knowledgeMode: knowledgeMode,
            searchResultCount: manualReferences.length,
            usage: claudeData.usage
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
          });
        }
      } catch (error) {
        console.error('❌ Agentic flow error:', error);
        // Fall back to general mode
        knowledgeMode = 'general';
        systemPrompt = BARRY_GENERAL_PROMPT + userContext + locationContext;
      }
    } else {
      // General question - use full ChatGPT capabilities
      console.log(`General question detected - Rule: ${routingDecision.rule}, Match: ${routingDecision.matched}`);
      systemPrompt = BARRY_GENERAL_PROMPT + userContext + locationContext;
    }

    // Only call Claude for general questions (not Unimog technical)
    console.log('=== KNOWLEDGE MODE CHECK ===');
    console.log('knowledgeMode:', knowledgeMode);
    console.log('Will call Claude API:', knowledgeMode === 'general');
    console.log('===========================');

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

      // Call Anthropic API for general questions (Claude Haiku 4.5)
      const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-5-haiku-20241022',
          max_tokens: 600,
          temperature: 0.7,
          system: systemPrompt,
          messages: messages.map(m => ({
            role: m.role === 'assistant' ? 'assistant' : 'user',
            content: m.content
          }))
        })
      });

      if (!anthropicResponse.ok) {
        const error = await anthropicResponse.text();
        console.error('Anthropic API error:', error);
        return new Response(JSON.stringify({ error: 'Failed to get response from AI' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const data = await anthropicResponse.json();
      const responseContent = data.content[0].text;

      // Log the chat for analytics with routing telemetry
      await supabaseClient.from('chat_logs').insert({
        user_id: user.id,
        messages: messages,
        response: responseContent,
        model: 'claude-3-5-haiku-general',
        tokens_used: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0),
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
