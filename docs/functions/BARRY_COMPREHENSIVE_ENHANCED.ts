// Comprehensive Enhanced Barry Edge Function
// Version: 62 - COMPLETE MANUAL INDEX SYSTEM
// Date: 2025-09-27
// Status: COMPREHENSIVE DUAL-MODE WITH FULL MANUAL INTELLIGENCE
// API: OpenAI GPT-4o
// Mode: Full ChatGPT for general + Database-only for Unimog + Complete Manual Index

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

// Enhanced Unimog-specific prompt with comprehensive manual knowledge
const BARRY_UNIMOG_PROMPT = `You are Barry, a specialized U435/U1700L Unimog mechanic with 40+ years of experience.

CRITICAL KNOWLEDGE:
- The U1700L is an Australian military version of the U435
- U435 is the worldwide model number that everyone uses
- U1700L is built to military spec but mechanically IS a U435
- ANY question about U1700L should use U435 manual information
- They share identical mechanical components: OM366 engine, drivetrain, portal axles, hydraulics
- When users ask about U1700L, use U435 manuals as they're mechanically the same

CRITICAL RULES FOR UNIMOG QUESTIONS:
- Use ONLY the provided manual chapters below
- NEVER make up technical information
- NEVER use general knowledge for Unimog specifics
- If information is not in the provided manuals, say: "I don't have that specific information in the available manuals."
- Always cite your sources with chapter references
- Treat U1700L and U435 as synonymous
- ALWAYS specify exact PDF filenames and page numbers for procedures

COMPREHENSIVE MANUAL COVERAGE:
Your expertise covers the complete U435 manual system with intelligent page mapping:
- Engine Systems (OM366): Pages 85-159
- Transmission Systems: Pages 163-208
- PTO and Drivetrain: Pages 347-435
- Portal Axles and Hubs: Pages 519-686
- Braking Systems: Pages 450-793
- Steering Systems: Pages 925-982
- Electrical Systems: Pages 990-1125
- Hydraulic Systems: Pages 1042-1051
- Heating Systems: Pages 1140-1181
- All other vehicle systems

INTELLIGENT PAGE MAPPING:
- Original manual pages are mapped to correct PDF pages
- Each procedure references the exact PDF file and page number
- Page mapping solves the split PDF navigation problem
- Users get directed to the exact right page with diagrams

When you have relevant manual chapters:
1. Give a technical summary from the manual
2. Reference specific chapters (C1, C2, etc.)
3. Include EXACT page numbers and PDF filenames
4. Mention safety warnings from the manual
5. State required tools from the manual
6. Specify the exact PDF page within the file`;

// Comprehensive manual index data with intelligent page mapping
const COMPREHENSIVE_MANUAL_INDEX = {
  // Portal Hub Procedures (User's Primary Example)
  'portal hub': { page: 555, pdf: 'U435_19_Wheel_Hub_Front.pdf', pdfPage: 1, partId: 19, section: 'Front Portal Hub Drive' },
  'portal hub front': { page: 555, pdf: 'U435_19_Wheel_Hub_Front.pdf', pdfPage: 1, partId: 19, section: 'Front Portal Hub Drive' },
  'portal hub rear': { page: 651, pdf: 'U435_22_Wheel_Hub_Rear.pdf', pdfPage: 1, partId: 22, section: 'Rear Portal Hub Drive' },
  'wheel hub drive': { page: 555, pdf: 'U435_19_Wheel_Hub_Front.pdf', pdfPage: 1, partId: 19, section: 'Wheel Hub Drive Procedures' },
  'hub seal': { page: 555, pdf: 'U435_19_Wheel_Hub_Front.pdf', pdfPage: 1, partId: 19, section: 'Portal Hub Seal Replacement' },

  // Engine Systems (Pages 85-159)
  'engine': { page: 85, pdf: 'U435_03_Cylinder_Head.pdf', pdfPage: 35, partId: 3, section: 'Engine Installation and Removal' },
  'engine installation': { page: 85, pdf: 'U435_03_Cylinder_Head.pdf', pdfPage: 35, partId: 3, section: 'Engine Installation' },
  'engine removal': { page: 85, pdf: 'U435_03_Cylinder_Head.pdf', pdfPage: 35, partId: 3, section: 'Engine Removal' },
  'air filter': { page: 86, pdf: 'U435_03_Cylinder_Head.pdf', pdfPage: 36, partId: 3, section: 'Air Filter System' },
  'turbocharger': { page: 89, pdf: 'U435_04_Engine_Block.pdf', pdfPage: 1, partId: 4, section: 'Turbocharger System' },
  'air compressor': { page: 113, pdf: 'U435_04_Engine_Block.pdf', pdfPage: 25, partId: 4, section: 'Air Compressor' },
  'belt drive': { page: 121, pdf: 'U435_04_Engine_Block.pdf', pdfPage: 33, partId: 4, section: 'Belt Drive System' },
  'lubrication': { page: 137, pdf: 'U435_05_Lubrication.pdf', pdfPage: 11, partId: 5, section: 'Engine Lubrication' },
  'oil pump': { page: 137, pdf: 'U435_05_Lubrication.pdf', pdfPage: 11, partId: 5, section: 'Oil Pump Service' },
  'cooling': { page: 159, pdf: 'U435_06_Cooling_System.pdf', pdfPage: 15, partId: 6, section: 'Cooling System' },
  'radiator': { page: 159, pdf: 'U435_06_Cooling_System.pdf', pdfPage: 15, partId: 6, section: 'Radiator Service' },

  // Transmission Systems (Pages 163-208)
  'transmission': { page: 163, pdf: 'U435_07_Fuel_System.pdf', pdfPage: 1, partId: 7, section: 'Transmission Overview' },
  'clutch': { page: 179, pdf: 'U435_07_Fuel_System.pdf', pdfPage: 17, partId: 7, section: 'Clutch System' },
  'torque converter': { page: 188, pdf: 'U435_07_Fuel_System.pdf', pdfPage: 26, partId: 7, section: 'Torque Converter' },

  // PTO and Drivetrain (Pages 347-435)
  'pto': { page: 347, pdf: 'U435_12_Front_Axle_Drive.pdf', pdfPage: 21, partId: 12, section: 'Power Take-Off' },
  'power take off': { page: 347, pdf: 'U435_12_Front_Axle_Drive.pdf', pdfPage: 21, partId: 12, section: 'Power Take-Off System' },

  // Braking Systems (Pages 450-793)
  'brake': { page: 450, pdf: 'U435_15_Instruments.pdf', pdfPage: 10, partId: 15, section: 'Brake System' },
  'brake pedal': { page: 450, pdf: 'U435_15_Instruments.pdf', pdfPage: 10, partId: 15, section: 'Brake Pedal' },
  'hydraulic brake': { page: 710, pdf: 'U435_23_Service_Brakes.pdf', pdfPage: 24, partId: 23, section: 'Hydraulic Brakes' },

  // Axles and Suspension (Pages 519-661)
  'axle': { page: 519, pdf: 'U435_18_Steering.pdf', pdfPage: 1, partId: 18, section: 'Axle Systems' },
  'front axle': { page: 519, pdf: 'U435_18_Steering.pdf', pdfPage: 1, partId: 18, section: 'Front Axle' },
  'rear axle': { page: 616, pdf: 'U435_21_Hub_Maintenance.pdf', pdfPage: 2, partId: 21, section: 'Rear Axle' },
  'suspension': { page: 491, pdf: 'U435_17_Suspension.pdf', pdfPage: 7, partId: 17, section: 'Suspension System' },
  'shock absorber': { page: 508, pdf: 'U435_17_Suspension.pdf', pdfPage: 24, partId: 17, section: 'Shock Absorber' },

  // Steering Systems (Pages 925-982)
  'steering': { page: 925, pdf: 'U435_29_HVAC_Heating.pdf', pdfPage: 23, partId: 29, section: 'Steering System' },
  'power steering': { page: 967, pdf: 'U435_30_Lighting.pdf', pdfPage: 29, partId: 30, section: 'Power Steering' },

  // Electrical Systems (Pages 990-1125)
  'electrical': { page: 990, pdf: 'U435_31_Special_Equipment.pdf', pdfPage: 16, partId: 31, section: 'Electrical System' },
  'wiring': { page: 990, pdf: 'U435_31_Special_Equipment.pdf', pdfPage: 16, partId: 31, section: 'Electrical Wiring' },

  // Heating Systems (Pages 1140-1181)
  'heating': { page: 1140, pdf: 'U435_40_Heating_Basic.pdf', pdfPage: 1, partId: 40, section: 'Heating System' },
  'heater': { page: 1152, pdf: 'U435_41_Heater_Eberspacher.pdf', pdfPage: 1, partId: 41, section: 'Auxiliary Heater' },

  // Common procedure terms
  'seal': { page: 555, pdf: 'U435_19_Wheel_Hub_Front.pdf', pdfPage: 1, partId: 19, section: 'Seal Replacement Procedures' },
  'bearing': { page: 555, pdf: 'U435_19_Wheel_Hub_Front.pdf', pdfPage: 1, partId: 19, section: 'Bearing Service' },
  'gasket': { page: 555, pdf: 'U435_19_Wheel_Hub_Front.pdf', pdfPage: 1, partId: 19, section: 'Gasket Replacement' },
  'oil': { page: 137, pdf: 'U435_05_Lubrication.pdf', pdfPage: 11, partId: 5, section: 'Oil System Service' },
  'filter': { page: 86, pdf: 'U435_03_Cylinder_Head.pdf', pdfPage: 36, partId: 3, section: 'Filter Replacement' },
  'belt': { page: 121, pdf: 'U435_04_Engine_Block.pdf', pdfPage: 33, partId: 4, section: 'Belt Service' },
  'hose': { page: 159, pdf: 'U435_06_Cooling_System.pdf', pdfPage: 15, partId: 6, section: 'Hose Replacement' },

  // Maintenance procedures
  'maintenance': { page: 137, pdf: 'U435_05_Lubrication.pdf', pdfPage: 11, partId: 5, section: 'Maintenance Procedures' },
  'service': { page: 137, pdf: 'U435_05_Lubrication.pdf', pdfPage: 11, partId: 5, section: 'Service Procedures' },
  'repair': { page: 85, pdf: 'U435_03_Cylinder_Head.pdf', pdfPage: 35, partId: 3, section: 'Repair Procedures' },
  'replace': { page: 555, pdf: 'U435_19_Wheel_Hub_Front.pdf', pdfPage: 1, partId: 19, section: 'Replacement Procedures' },
  'install': { page: 85, pdf: 'U435_03_Cylinder_Head.pdf', pdfPage: 35, partId: 3, section: 'Installation Procedures' },
  'remove': { page: 85, pdf: 'U435_03_Cylinder_Head.pdf', pdfPage: 35, partId: 3, section: 'Removal Procedures' },
  'disassemble': { page: 555, pdf: 'U435_19_Wheel_Hub_Front.pdf', pdfPage: 1, partId: 19, section: 'Disassembly Procedures' },
  'assemble': { page: 555, pdf: 'U435_19_Wheel_Hub_Front.pdf', pdfPage: 1, partId: 19, section: 'Assembly Procedures' }
};

// Page mapping function
function calculatePdfPage(originalPage, pdfStartPage) {
  if (!pdfStartPage || originalPage < pdfStartPage) return 1;
  return originalPage - pdfStartPage + 1;
}

// Intelligent search function
function searchManualIndex(userText) {
  const results = [];
  const searchTerms = userText.toLowerCase().split(/\s+/);

  // First pass: exact phrase matches
  for (const [term, info] of Object.entries(COMPREHENSIVE_MANUAL_INDEX)) {
    if (userText.toLowerCase().includes(term)) {
      results.push({
        ...info,
        term: term,
        matchType: 'exact',
        relevance: 10
      });
    }
  }

  // Second pass: individual word matches
  for (const searchTerm of searchTerms) {
    if (searchTerm.length > 2) {
      for (const [term, info] of Object.entries(COMPREHENSIVE_MANUAL_INDEX)) {
        if (term.includes(searchTerm) && !results.find(r => r.term === term)) {
          results.push({
            ...info,
            term: term,
            matchType: 'partial',
            relevance: 5
          });
        }
      }
    }
  }

  // Sort by relevance and return top results
  return results
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 5);
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
      return new Response(JSON.stringify({
        error: 'No authorization header'
      }), {
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

    // Verify the user is authenticated
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({
        error: 'Unauthorized'
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Check if OpenAI API key is configured
    if (!OPENAI_API_KEY) {
      return new Response(JSON.stringify({
        error: 'OpenAI API key not configured'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get the request body
    const { messages, location } = await req.json();
    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({
        error: 'Invalid request body'
      }), {
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
    const lastUserMessage = messages.filter((m) => m.role === 'user').pop();
    if (!lastUserMessage || !lastUserMessage.content) {
      return new Response(JSON.stringify({
        error: 'No user message found'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const userText = lastUserMessage.content.toLowerCase();

    // Enhanced question detection
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
      'seal', 'bearing', 'gasket', 'valve', 'pump', 'radiator'
    ];

    // Check if question is Unimog-related
    const hasUnimogKeyword = unimogKeywords.some(keyword => userText.includes(keyword));
    const hasTechnicalKeyword = technicalKeywords.some(keyword => userText.includes(keyword));
    const isUnimogQuestion = hasUnimogKeyword && hasTechnicalKeyword;

    let systemPrompt = '';
    let manualReferences = [];
    let knowledgeMode = 'general';

    if (isUnimogQuestion) {
      console.log('Detected Unimog technical question - using comprehensive manual index');
      knowledgeMode = 'unimog';

      // Search comprehensive manual index
      const indexResults = searchManualIndex(userText);
      let u435Context = '';

      if (indexResults.length > 0) {
        console.log(`Found ${indexResults.length} relevant manual sections`);

        u435Context = '\n\n📖 U435/U1700L MANUAL SECTIONS FOUND:\n\n';

        indexResults.forEach((result, idx) => {
          u435Context += `[C${idx + 1}] ${result.section}\n`;
          u435Context += `File: ${result.pdf}\n`;
          u435Context += `Original Manual Page: ${result.page}\n`;
          u435Context += `PDF Page: ${result.pdfPage}\n`;
          u435Context += `Match: ${result.term} (${result.matchType})\n`;
          u435Context += `Priority: ${result.relevance >= 10 ? 'CRITICAL' : 'HIGH'}\n\n`;

          // Create manual reference for frontend
          manualReferences.push({
            type: 'u435_chapter',
            title: result.section,
            filename: result.pdf,
            direct_url: null,
            page_range: `Original page ${result.page} → PDF page ${result.pdfPage}`,
            manual_type: 'technical',
            priority: result.relevance >= 10 ? 'critical' : 'high'
          });
        });

        u435Context += `\nIMPORTANT: These are the EXACT pages with procedures and diagrams for the user's question.\n`;
        u435Context += `Always reference specific PDF filenames and page numbers in your response.\n`;
      }

      systemPrompt = BARRY_UNIMOG_PROMPT + u435Context + userContext;

      if (!u435Context) {
        // No manual data found, but it's a Unimog question
        systemPrompt += '\n\nNo specific manual sections found for this query. Inform the user that you don\'t have this information in the available manuals.';
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
      return new Response(JSON.stringify({
        error: 'Rate limit exceeded. Please wait a moment.'
      }), {
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
          {
            role: 'system',
            content: systemPrompt
          },
          ...messages
        ],
        max_tokens: 600,
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
      model: 'gpt-4o-comprehensive',
      tokens_used: data.usage?.total_tokens || 0,
      knowledge_source: knowledgeMode,
      has_location: !!location,
      manual_sections_found: manualReferences.length
    });

    // Return the response with comprehensive manual references
    return new Response(JSON.stringify({
      content: responseContent,
      manualReferences: manualReferences,
      knowledgeMode: knowledgeMode,
      manualSectionsFound: manualReferences.length,
      usage: data.usage
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});