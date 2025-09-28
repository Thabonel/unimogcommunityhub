// Enhanced Barry Edge Function with Portal Hub Intelligence
// Version: 61 - Portal Hub Focused Enhancement
// Date: 2025-09-27
// Status: ENHANCED DUAL-MODE WITH PORTAL HUB INTELLIGENCE
// API: OpenAI GPT-4o
// Mode: Full ChatGPT for general + Database-only for Unimog + Portal Hub Intelligence

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

// Enhanced Unimog-specific prompt with portal hub expertise
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

PORTAL HUB SPECIALIZATION:
- Front Portal Hub: Page 555 → U435_19_Wheel_Hub_Front.pdf page 1
- Rear Portal Hub: Page 651 → U435_22_Wheel_Hub_Rear.pdf page 1
- Portal hub seal replacement is a common procedure
- Always reference exact PDF pages for portal hub procedures
- Portal axles are unique to Unimogs and require specific procedures

Your expertise (from manuals only):
- OM366 engine maintenance and repair
- Manual transmission service procedures
- Portal axle maintenance and seal replacement
- Hydraulic system repairs and troubleshooting
- Electrical system diagnostics
- Suspension and steering adjustments
- Brake system maintenance
- Cooling system service
- PTO and special equipment

When you have relevant manual chapters:
1. Give a technical summary from the manual
2. Reference specific chapters (C1, C2, etc.)
3. Include page ranges when available
4. Mention safety warnings from the manual
5. State required tools from the manual
6. For portal hub questions, ALWAYS specify the exact PDF and page number`;

// Page mapping function for portal hub procedures
function calculatePdfPage(originalPage, pdfStartPage) {
  if (!pdfStartPage || originalPage < pdfStartPage) return 1;
  return originalPage - pdfStartPage + 1;
}

// Enhanced portal hub detection
function detectPortalHubQuestion(userText) {
  const portalHubKeywords = [
    'portal hub', 'portal axle', 'wheel hub', 'hub seal', 'hub drive',
    'portal seal', 'axle seal', 'wheel bearing', 'hub bearing',
    'front hub', 'rear hub', 'hub oil', 'hub maintenance'
  ];

  return portalHubKeywords.some(keyword => userText.includes(keyword));
}

// Get specific portal hub information
function getPortalHubInfo(userText) {
  const isFront = userText.includes('front') || userText.includes('f');
  const isRear = userText.includes('rear') || userText.includes('r');

  if (isFront && !isRear) {
    return {
      type: 'front',
      originalPage: 555,
      filename: 'U435_19_Wheel_Hub_Front.pdf',
      pdfPage: 1,
      section: 'Disassembly and Assembly of Wheel Hub Drive 33.3',
      manualPartId: 19
    };
  } else if (isRear && !isFront) {
    return {
      type: 'rear',
      originalPage: 651,
      filename: 'U435_22_Wheel_Hub_Rear.pdf',
      pdfPage: 1,
      section: 'Disassembly and Reassembly of Wheel Hub Drive 35.3',
      manualPartId: 22
    };
  } else {
    // If both or neither specified, return both
    return {
      type: 'both',
      procedures: [
        {
          type: 'front',
          originalPage: 555,
          filename: 'U435_19_Wheel_Hub_Front.pdf',
          pdfPage: 1,
          section: 'Disassembly and Assembly of Wheel Hub Drive 33.3',
          manualPartId: 19
        },
        {
          type: 'rear',
          originalPage: 651,
          filename: 'U435_22_Wheel_Hub_Rear.pdf',
          pdfPage: 1,
          section: 'Disassembly and Reassembly of Wheel Hub Drive 35.3',
          manualPartId: 22
        }
      ]
    };
  }
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
      'torque', 'spec', 'specification', 'procedure', 'manual'
    ];

    // Check if question is Unimog-related
    const hasUnimogKeyword = unimogKeywords.some(keyword => userText.includes(keyword));
    const hasTechnicalKeyword = technicalKeywords.some(keyword => userText.includes(keyword));
    const isUnimogQuestion = hasUnimogKeyword && hasTechnicalKeyword;

    // Special detection for portal hub questions
    const isPortalHubQuestion = detectPortalHubQuestion(userText);

    let systemPrompt = '';
    let manualReferences = [];
    let knowledgeMode = 'general';

    if (isUnimogQuestion || isPortalHubQuestion) {
      console.log('Detected Unimog technical question - using database-only mode');
      knowledgeMode = 'unimog';

      // Enhanced search with portal hub intelligence
      let u435Context = '';

      if (isPortalHubQuestion) {
        console.log('Detected portal hub question - using specialized portal hub knowledge');

        const portalHubInfo = getPortalHubInfo(userText);

        if (portalHubInfo.type === 'both') {
          u435Context = '\n\n🎯 PORTAL HUB PROCEDURES FOUND:\n\n';
          u435Context += '📖 FRONT PORTAL HUB:\n';
          u435Context += `[C1] Front Wheel Hub Drive (CRITICAL PROCEDURE)\n`;
          u435Context += `File: U435_19_Wheel_Hub_Front.pdf\n`;
          u435Context += `Section: ${portalHubInfo.procedures[0].section}\n`;
          u435Context += `Original Manual Page: ${portalHubInfo.procedures[0].originalPage}\n`;
          u435Context += `PDF Page: ${portalHubInfo.procedures[0].pdfPage}\n`;
          u435Context += `Priority: CRITICAL - Portal hub procedures with diagrams\n\n`;

          u435Context += '📖 REAR PORTAL HUB:\n';
          u435Context += `[C2] Rear Wheel Hub Drive (CRITICAL PROCEDURE)\n`;
          u435Context += `File: U435_22_Wheel_Hub_Rear.pdf\n`;
          u435Context += `Section: ${portalHubInfo.procedures[1].section}\n`;
          u435Context += `Original Manual Page: ${portalHubInfo.procedures[1].originalPage}\n`;
          u435Context += `PDF Page: ${portalHubInfo.procedures[1].pdfPage}\n`;
          u435Context += `Priority: CRITICAL - Portal hub procedures with diagrams\n\n`;

          // Create manual references for both
          manualReferences.push({
            type: 'u435_chapter',
            title: 'Front Wheel Hub Drive',
            filename: portalHubInfo.procedures[0].filename,
            direct_url: null,
            page_range: `Original page ${portalHubInfo.procedures[0].originalPage} → PDF page ${portalHubInfo.procedures[0].pdfPage}`,
            manual_type: 'portal_hub',
            priority: 'critical'
          });

          manualReferences.push({
            type: 'u435_chapter',
            title: 'Rear Wheel Hub Drive',
            filename: portalHubInfo.procedures[1].filename,
            direct_url: null,
            page_range: `Original page ${portalHubInfo.procedures[1].originalPage} → PDF page ${portalHubInfo.procedures[1].pdfPage}`,
            manual_type: 'portal_hub',
            priority: 'critical'
          });

        } else {
          // Single portal hub procedure
          u435Context = '\n\n🎯 PORTAL HUB PROCEDURE FOUND:\n\n';
          u435Context += `📖 ${portalHubInfo.type.toUpperCase()} PORTAL HUB:\n`;
          u435Context += `[C1] ${portalHubInfo.type.charAt(0).toUpperCase() + portalHubInfo.type.slice(1)} Wheel Hub Drive (CRITICAL PROCEDURE)\n`;
          u435Context += `File: ${portalHubInfo.filename}\n`;
          u435Context += `Section: ${portalHubInfo.section}\n`;
          u435Context += `Original Manual Page: ${portalHubInfo.originalPage}\n`;
          u435Context += `PDF Page: ${portalHubInfo.pdfPage}\n`;
          u435Context += `Priority: CRITICAL - Portal hub procedures with diagrams\n\n`;

          manualReferences.push({
            type: 'u435_chapter',
            title: `${portalHubInfo.type.charAt(0).toUpperCase() + portalHubInfo.type.slice(1)} Wheel Hub Drive`,
            filename: portalHubInfo.filename,
            direct_url: null,
            page_range: `Original page ${portalHubInfo.originalPage} → PDF page ${portalHubInfo.pdfPage}`,
            manual_type: 'portal_hub',
            priority: 'critical'
          });
        }

      } else {
        // Standard manual search for other Unimog questions
        const searchTerms = [];

        // Extract relevant search terms
        for (const keyword of technicalKeywords) {
          if (userText.includes(keyword)) {
            searchTerms.push(keyword);
          }
        }

        if (searchTerms.length > 0) {
          console.log('Searching U435 manuals with terms:', searchTerms);

          try {
            // Search U435 manual parts using keywords
            const allParts = [];
            for (const term of searchTerms.slice(0, 3)) {
              const { data: termParts, error } = await supabaseClient
                .from('u435_manual_parts')
                .select(`
                  id, title, filename, storage_bucket, storage_path,
                  priority, keywords, page_count, start_page, end_page,
                  part_number, manual_type
                `)
                .contains('keywords', [term])
                .limit(3);

              if (!error && termParts) {
                allParts.push(...termParts);
              }
            }

            // Remove duplicates and sort by priority
            const uniqueParts = allParts.filter((part, index, self) =>
              index === self.findIndex(p => p.id === part.id)
            );

            const manualParts = uniqueParts
              .sort((a, b) => {
                const priorityOrder = { 'high': 3, 'critical': 2, 'standard': 1 };
                return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
              })
              .slice(0, 5);

            if (manualParts && manualParts.length > 0) {
              console.log(`Found ${manualParts.length} relevant U435 manual chapters`);

              // Build context
              u435Context = '\n\n📖 U435/U1700L MANUAL CHAPTERS FOUND:\n';

              manualParts.forEach((chapter, idx) => {
                const pageRange = chapter.start_page && chapter.end_page
                  ? `Pages ${chapter.start_page}-${chapter.end_page}`
                  : `${chapter.page_count || 'Unknown'} pages`;

                u435Context += `\n[C${idx + 1}] ${chapter.title} (${chapter.manual_type.toUpperCase()})\n`;
                u435Context += `File: ${chapter.filename}\n`;
                u435Context += `${pageRange}\n`;
                u435Context += `Priority: ${chapter.priority}\n`;
                if (chapter.keywords && chapter.keywords.length > 0) {
                  u435Context += `Keywords: ${chapter.keywords.join(', ')}\n`;
                }
                u435Context += `\n`;

                // Create manual reference
                manualReferences.push({
                  type: 'u435_chapter',
                  title: chapter.title,
                  filename: chapter.filename,
                  direct_url: null,
                  page_range: pageRange,
                  manual_type: chapter.manual_type,
                  priority: chapter.priority
                });
              });
            }
          } catch (error) {
            console.error('U435 search error:', error);
          }
        }
      }

      systemPrompt = BARRY_UNIMOG_PROMPT + u435Context + userContext;

      if (!u435Context) {
        // No manual data found, but it's a Unimog question
        systemPrompt += '\n\nNo specific manual chapters found for this query. Inform the user that you don\'t have this information in the available manuals.';
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
      model: 'gpt-4o-enhanced-portal',
      tokens_used: data.usage?.total_tokens || 0,
      knowledge_source: knowledgeMode,
      has_location: !!location,
      portal_hub_detected: isPortalHubQuestion
    });

    // Return the response with correct field name
    return new Response(JSON.stringify({
      content: responseContent,
      manualReferences: manualReferences,
      knowledgeMode: knowledgeMode,
      portalHubDetected: isPortalHubQuestion,
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