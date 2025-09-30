// Intelligent Barry Edge Function
// Version: 65 - SMART INTENT DETECTION
// Date: 2025-09-30
// Status: Fixes v64 - Better intent detection + No crashing
// Goal: Answer ALL questions (general + technical) intelligently

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

const OPENAI_API_KEY = <OPENAI_API_KEY>
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// General assistant prompt for non-technical questions
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

// Technical Unimog prompt with manual knowledge
const BARRY_TECHNICAL_PROMPT = `You are Barry, a specialized U435/U1700L Unimog mechanic with 40+ years of experience.

CRITICAL KNOWLEDGE:
- The U1700L is an Australian military version of the U435
- U435 is the worldwide model number that everyone uses
- U1700L is built to military spec but mechanically IS a U435
- ANY question about U1700L should use U435 manual information
- They share identical mechanical components

CRITICAL RULES FOR TECHNICAL QUESTIONS:
- Use ONLY the provided manual chapters below
- NEVER make up technical information
- If information is not in the manuals, say so clearly
- Always cite sources with chapter references
- Treat U1700L and U435 as synonymous
- ALWAYS specify exact PDF filenames and page numbers`;

// Comprehensive manual index (from working v62)
const MANUAL_INDEX = {
  'portal hub': { page: 555, pdf: 'U435_19_Wheel_Hub_Front.pdf', pdfPage: 1, section: 'Front Portal Hub Drive' },
  'portal hub front': { page: 555, pdf: 'U435_19_Wheel_Hub_Front.pdf', pdfPage: 1, section: 'Front Portal Hub Drive' },
  'portal hub rear': { page: 651, pdf: 'U435_22_Wheel_Hub_Rear.pdf', pdfPage: 1, section: 'Rear Portal Hub Drive' },
  'wheel hub': { page: 555, pdf: 'U435_19_Wheel_Hub_Front.pdf', pdfPage: 1, section: 'Wheel Hub Drive' },
  'hub seal': { page: 555, pdf: 'U435_19_Wheel_Hub_Front.pdf', pdfPage: 1, section: 'Hub Seal Replacement' },
  'engine': { page: 85, pdf: 'U435_03_Cylinder_Head.pdf', pdfPage: 35, section: 'Engine Installation and Removal' },
  'air filter': { page: 86, pdf: 'U435_03_Cylinder_Head.pdf', pdfPage: 36, section: 'Air Filter System' },
  'turbocharger': { page: 89, pdf: 'U435_04_Engine_Block.pdf', pdfPage: 1, section: 'Turbocharger System' },
  'air compressor': { page: 113, pdf: 'U435_04_Engine_Block.pdf', pdfPage: 25, section: 'Air Compressor' },
  'belt drive': { page: 121, pdf: 'U435_04_Engine_Block.pdf', pdfPage: 33, section: 'Belt Drive System' },
  'lubrication': { page: 137, pdf: 'U435_05_Lubrication.pdf', pdfPage: 11, section: 'Engine Lubrication' },
  'oil pump': { page: 137, pdf: 'U435_05_Lubrication.pdf', pdfPage: 11, section: 'Oil Pump Service' },
  'cooling': { page: 159, pdf: 'U435_06_Cooling_System.pdf', pdfPage: 15, section: 'Cooling System' },
  'radiator': { page: 159, pdf: 'U435_06_Cooling_System.pdf', pdfPage: 15, section: 'Radiator Service' },
  'transmission': { page: 163, pdf: 'U435_07_Fuel_System.pdf', pdfPage: 1, section: 'Transmission Overview' },
  'clutch': { page: 179, pdf: 'U435_07_Fuel_System.pdf', pdfPage: 17, section: 'Clutch System' },
  'pto': { page: 347, pdf: 'U435_12_Front_Axle_Drive.pdf', pdfPage: 21, section: 'Power Take-Off' },
  'brake': { page: 450, pdf: 'U435_15_Instruments.pdf', pdfPage: 10, section: 'Brake System' },
  'hydraulic brake': { page: 710, pdf: 'U435_23_Service_Brakes.pdf', pdfPage: 24, section: 'Hydraulic Brakes' },
  'axle': { page: 519, pdf: 'U435_18_Steering.pdf', pdfPage: 1, section: 'Axle Systems' },
  'front axle': { page: 519, pdf: 'U435_18_Steering.pdf', pdfPage: 1, section: 'Front Axle' },
  'rear axle': { page: 616, pdf: 'U435_21_Hub_Maintenance.pdf', pdfPage: 2, section: 'Rear Axle' },
  'suspension': { page: 491, pdf: 'U435_17_Suspension.pdf', pdfPage: 7, section: 'Suspension System' },
  'steering': { page: 925, pdf: 'U435_29_HVAC_Heating.pdf', pdfPage: 23, section: 'Steering System' },
  'power steering': { page: 967, pdf: 'U435_30_Lighting.pdf', pdfPage: 29, section: 'Power Steering' },
  'electrical': { page: 990, pdf: 'U435_31_Special_Equipment.pdf', pdfPage: 16, section: 'Electrical System' },
  'wiring': { page: 990, pdf: 'U435_31_Special_Equipment.pdf', pdfPage: 16, section: 'Electrical Wiring' },
  'heating': { page: 1140, pdf: 'U435_40_Heating_Basic.pdf', pdfPage: 1, section: 'Heating System' },
  'heater': { page: 1152, pdf: 'U435_41_Heater_Eberspacher.pdf', pdfPage: 1, section: 'Auxiliary Heater' },
  'seal': { page: 555, pdf: 'U435_19_Wheel_Hub_Front.pdf', pdfPage: 1, section: 'Seal Replacement' },
  'bearing': { page: 555, pdf: 'U435_19_Wheel_Hub_Front.pdf', pdfPage: 1, section: 'Bearing Service' },
  'gasket': { page: 555, pdf: 'U435_19_Wheel_Hub_Front.pdf', pdfPage: 1, section: 'Gasket Replacement' },
  'oil': { page: 137, pdf: 'U435_05_Lubrication.pdf', pdfPage: 11, section: 'Oil System Service' },
  'filter': { page: 86, pdf: 'U435_03_Cylinder_Head.pdf', pdfPage: 36, section: 'Filter Replacement' },
  'belt': { page: 121, pdf: 'U435_04_Engine_Block.pdf', pdfPage: 33, section: 'Belt Service' },
  'hose': { page: 159, pdf: 'U435_06_Cooling_System.pdf', pdfPage: 15, section: 'Hose Replacement' }
};

// Smart intent detection - THE KEY FIX!
function detectIntent(text) {
  const lower = text.toLowerCase();

  // NON-TECHNICAL intents (general GPT-4o mode)
  const nonTechnicalIntents = [
    'write', 'letter', 'email', 'compose', 'draft',
    'tell my boss', 'tell him', 'tell her', 'explain to',
    'late', 'excuse', 'help me write', 'can you write',
    'weather', 'forecast', 'temperature',
    'directions', 'navigate', 'route to',
    'joke', 'story', 'advice',
    'what is', 'who is', 'when is', 'where is',
    'recipe', 'cook', 'news', 'sports'
  ];

  // Check for non-technical intent FIRST
  if (nonTechnicalIntents.some(intent => lower.includes(intent))) {
    return { mode: 'general', reason: 'non_technical_intent' };
  }

  // TECHNICAL action words
  const technicalActions = [
    'replace', 'remove', 'install', 'fix', 'repair',
    'service', 'maintain', 'adjust', 'check',
    'how do i', 'how to', 'procedure', 'steps',
    'torque spec', 'specification', 'manual says'
  ];

  // Vehicle parts/systems
  const vehicleParts = [
    'engine', 'transmission', 'clutch', 'brake', 'axle',
    'portal hub', 'suspension', 'steering', 'radiator',
    'oil pump', 'filter', 'belt', 'seal', 'bearing',
    'pto', 'hydraulic', 'electrical', 'wiring'
  ];

  // Check if it's a TECHNICAL question
  const hasTechnicalAction = technicalActions.some(action => lower.includes(action));
  const hasVehiclePart = vehicleParts.some(part => lower.includes(part));

  if (hasTechnicalAction || hasVehiclePart) {
    return { mode: 'technical', reason: 'technical_repair_question' };
  }

  // Default to general for ambiguous cases
  return { mode: 'general', reason: 'default_general' };
}

// Search manual index
function searchManualIndex(text) {
  const results = [];
  const searchTerms = text.toLowerCase().split(/\s+/);

  // Exact phrase matches
  for (const [term, info] of Object.entries(MANUAL_INDEX)) {
    if (text.toLowerCase().includes(term)) {
      results.push({ ...info, term, matchType: 'exact', relevance: 10 });
    }
  }

  // Word matches
  for (const searchTerm of searchTerms) {
    if (searchTerm.length > 2) {
      for (const [term, info] of Object.entries(MANUAL_INDEX)) {
        if (term.includes(searchTerm) && !results.find(r => r.term === term)) {
          results.push({ ...info, term, matchType: 'partial', relevance: 5 });
        }
      }
    }
  }

  return results.sort((a, b) => b.relevance - a.relevance).slice(0, 5);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (!OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { messages, location } = await req.json();
    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Invalid request body' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get user profile
    let userContext = '';
    try {
      const { data: profile } = await supabaseClient
        .from('profiles')
        .select('unimog_model, full_name, display_name')
        .eq('id', user.id)
        .single();

      if (profile) {
        const userName = profile.full_name || profile.display_name;
        if (userName) userContext += `User's Name: ${userName}\n`;
        if (profile.unimog_model) userContext += `User's Vehicle: ${profile.unimog_model}\n`;
      }
    } catch (error) {
      console.log('Error fetching profile:', error);
    }

    // Location context
    let locationContext = '';
    if (location?.latitude && location?.longitude) {
      locationContext = `\nUser's location: Lat ${location.latitude}, Lng ${location.longitude}`;
      locationContext += '\nUse for weather, nearby services, location-specific info.';
    }

    const lastUserMessage = messages.filter(m => m.role === 'user').pop();
    if (!lastUserMessage?.content) {
      return new Response(JSON.stringify({ error: 'No user message' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // SMART INTENT DETECTION - THE FIX!
    const intent = detectIntent(lastUserMessage.content);
    console.log(`Intent detected: ${intent.mode} (${intent.reason})`);

    let systemPrompt = '';
    let manualReferences = [];
    let knowledgeMode = intent.mode;

    if (intent.mode === 'technical') {
      // Technical question - search manual index
      const indexResults = searchManualIndex(lastUserMessage.content);
      let manualContext = '';

      if (indexResults.length > 0) {
        manualContext = '\n\n📖 U435/U1700L MANUAL SECTIONS:\n\n';
        indexResults.forEach((result, idx) => {
          manualContext += `[C${idx + 1}] ${result.section}\n`;
          manualContext += `File: ${result.pdf}, Page: ${result.pdfPage}\n\n`;

          manualReferences.push({
            type: 'u435_chapter',
            title: result.section,
            filename: result.pdf,
            page_range: `PDF page ${result.pdfPage}`,
            manual_type: 'technical',
            priority: result.relevance >= 10 ? 'critical' : 'high'
          });
        });
      }

      systemPrompt = BARRY_TECHNICAL_PROMPT + manualContext + userContext;
    } else {
      // General question - use full GPT-4o
      systemPrompt = BARRY_GENERAL_PROMPT + userContext + locationContext;
    }

    // Rate limiting
    try {
      const { data: recentChats } = await supabaseClient
        .from('chat_rate_limits')
        .select('id')
        .eq('user_id', user.id)
        .gte('created_at', new Date(Date.now() - 60000).toISOString())
        .limit(15);

      if (recentChats && recentChats.length >= 15) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      await supabaseClient.from('chat_rate_limits').insert({ user_id: user.id });
    } catch (error) {
      console.log('Rate limit check failed (non-fatal):', error);
    }

    // Call OpenAI
    const openAIResponse = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
        max_tokens: 600,
        temperature: 0.7
      })
    });

    if (!openAIResponse.ok) {
      const error = await openAIResponse.text();
      console.error('OpenAI error:', error);
      return new Response(JSON.stringify({ error: 'AI response failed' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const data = await openAIResponse.json();
    const responseContent = data.choices[0].message.content;

    // Log chat (non-fatal if fails)
    try {
      await supabaseClient.from('chat_logs').insert({
        user_id: user.id,
        messages,
        response: responseContent,
        model: 'gpt-4o-intelligent-v65',
        tokens_used: data.usage?.total_tokens || 0,
        knowledge_source: knowledgeMode,
        has_location: !!location,
        routing_rule: intent.reason,
        manual_sections_found: manualReferences.length
      });
    } catch (error) {
      console.log('Chat log failed (non-fatal):', error);
    }

    return new Response(JSON.stringify({
      content: responseContent,
      manualReferences,
      knowledgeMode,
      intent: intent.reason,
      usage: data.usage
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});