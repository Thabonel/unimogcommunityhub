import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Initialize Supabase client with service role key for full access
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Manual index mapping for intelligent page navigation
const manualIndex = {
  // Portal Hub Procedures (User's Primary Example)
  'portal hub front': { page: 555, partId: 19, section: 'Portal Hub - Front', keywords: ['wheel', 'hub', 'drive', 'front', 'differential', 'bearing', 'seal'] },
  'portal hub rear': { page: 651, partId: 22, section: 'Portal Hub - Rear', keywords: ['wheel', 'hub', 'drive', 'rear', 'differential', 'bearing', 'seal'] },
  'front portal hub': { page: 555, partId: 19, section: 'Portal Hub - Front', keywords: ['wheel', 'hub', 'drive', 'front'] },
  'rear portal hub': { page: 651, partId: 22, section: 'Portal Hub - Rear', keywords: ['wheel', 'hub', 'drive', 'rear'] },
  'wheel hub front': { page: 555, partId: 19, section: 'Wheel Hub Drive - Front', keywords: ['wheel', 'hub', 'drive', 'front'] },
  'wheel hub rear': { page: 651, partId: 22, section: 'Wheel Hub Drive - Rear', keywords: ['wheel', 'hub', 'drive', 'rear'] },

  // Engine Systems (Pages 85-159)
  'engine installation': { page: 85, partId: 3, section: 'Engine Installation & Removal', keywords: ['engine', 'installation', 'removal', 'mounting'] },
  'engine removal': { page: 85, partId: 3, section: 'Engine Installation & Removal', keywords: ['engine', 'removal', 'installation'] },
  'air filter': { page: 86, partId: 3, section: 'Air Filter System', keywords: ['air', 'filter', 'intake', 'cleaning'] },
  'turbocharger': { page: 89, partId: 4, section: 'Turbocharger Systems', keywords: ['turbo', 'boost', 'pressure', 'intercooler'] },
  'engine lubrication': { page: 137, partId: 5, section: 'Engine Lubrication', keywords: ['oil', 'lubrication', 'pump', 'filter'] },
  'oil pump': { page: 137, partId: 5, section: 'Oil Pump & System', keywords: ['oil', 'pump', 'pressure', 'lubrication'] },
  'cooling system': { page: 159, partId: 6, section: 'Cooling System', keywords: ['cooling', 'radiator', 'thermostat', 'pump'] },

  // Transmission Systems (Pages 163-208)
  'transmission': { page: 163, partId: 7, section: 'Main Transmission', keywords: ['transmission', 'gears', 'shifting', 'clutch'] },
  'clutch system': { page: 179, partId: 7, section: 'Clutch System', keywords: ['clutch', 'pressure', 'plate', 'disc'] },
  'torque converter': { page: 188, partId: 7, section: 'Torque Converter', keywords: ['torque', 'converter', 'automatic', 'transmission'] },

  // PTO and Drivetrain (Pages 347-435)
  'power take off': { page: 347, partId: 12, section: 'Power Take-Off Systems', keywords: ['pto', 'power', 'take', 'off', 'hydraulic'] },
  'pto': { page: 347, partId: 12, section: 'PTO Systems', keywords: ['pto', 'power', 'hydraulic', 'drive'] },

  // Brakes (Pages 450-793)
  'brake system': { page: 450, partId: 15, section: 'Brake Systems', keywords: ['brake', 'hydraulic', 'pneumatic', 'disc'] },
  'hydraulic brakes': { page: 710, partId: 23, section: 'Hydraulic Brake System', keywords: ['hydraulic', 'brake', 'pressure', 'fluid'] },

  // Axles and Differentials (Pages 519-661)
  'front axle': { page: 519, partId: 18, section: 'Front Axle Systems', keywords: ['front', 'axle', 'differential', 'drive'] },
  'rear axle': { page: 616, partId: 21, section: 'Rear Axle Systems', keywords: ['rear', 'axle', 'differential', 'drive'] },
  'differential': { page: 555, partId: 19, section: 'Differential Systems', keywords: ['differential', 'lock', 'gears', 'axle'] },

  // Steering (Pages 925-982)
  'steering': { page: 925, partId: 29, section: 'Steering Systems', keywords: ['steering', 'power', 'pump', 'wheel'] },
  'power steering': { page: 967, partId: 30, section: 'Power Steering System', keywords: ['power', 'steering', 'pump', 'hydraulic'] },

  // Electrical (Pages 990-1125)
  'electrical system': { page: 990, partId: 31, section: 'Electrical Systems', keywords: ['electrical', 'wiring', 'battery', 'alternator'] },
  'wiring': { page: 990, partId: 31, section: 'Wiring Systems', keywords: ['wiring', 'electrical', 'harness', 'connector'] },

  // Common components
  'bearing': { page: 555, partId: 19, section: 'Bearing Replacement', keywords: ['bearing', 'replacement', 'wheel', 'hub'] },
  'seal': { page: 555, partId: 19, section: 'Seal Replacement', keywords: ['seal', 'replacement', 'oil', 'gasket'] },
  'gasket': { page: 555, partId: 19, section: 'Gasket & Seal Systems', keywords: ['gasket', 'seal', 'replacement'] },
  'oil': { page: 137, partId: 5, section: 'Oil Systems', keywords: ['oil', 'lubrication', 'change', 'filter'] },
  'filter': { page: 86, partId: 3, section: 'Filter Systems', keywords: ['filter', 'air', 'oil', 'fuel'] }
};

// Complete manual parts data for page mapping
const manualParts = {
  3: { filename: 'U435_03_Cylinder_Head.pdf', startPage: 51, endPage: 88 },
  4: { filename: 'U435_04_Engine_Block.pdf', startPage: 89, endPage: 126 },
  5: { filename: 'U435_05_Lubrication.pdf', startPage: 127, endPage: 144 },
  6: { filename: 'U435_06_Cooling_System.pdf', startPage: 145, endPage: 162 },
  7: { filename: 'U435_07_Fuel_System.pdf', startPage: 163, endPage: 200 },
  12: { filename: 'U435_12_Front_Axle_Drive.pdf', startPage: 327, endPage: 364 },
  15: { filename: 'U435_15_Instruments.pdf', startPage: 441, endPage: 467 },
  18: { filename: 'U435_18_Steering.pdf', startPage: 519, endPage: 554 },
  19: { filename: 'U435_19_Wheel_Hub_Front.pdf', startPage: 555, endPage: 586 },
  21: { filename: 'U435_21_Hub_Maintenance.pdf', startPage: 615, endPage: 650 },
  22: { filename: 'U435_22_Wheel_Hub_Rear.pdf', startPage: 651, endPage: 686 },
  23: { filename: 'U435_23_Service_Brakes.pdf', startPage: 687, endPage: 722 },
  29: { filename: 'U435_29_HVAC_Heating.pdf', startPage: 903, endPage: 938 },
  30: { filename: 'U435_30_Lighting.pdf', startPage: 939, endPage: 974 },
  31: { filename: 'U435_31_Special_Equipment.pdf', startPage: 975, endPage: 1016 }
};

// Critical page mapping function
function calculatePdfPage(originalPage: number, pdfStartPage: number): number {
  if (!pdfStartPage || originalPage < pdfStartPage) return 1;
  return originalPage - pdfStartPage + 1;
}

// Intelligent search function for manual procedures
function findRelevantProcedures(question: string): Array<{term: string, data: any, relevance: number}> {
  const searchTerms = question.toLowerCase().split(/\s+/);
  const results: Array<{term: string, data: any, relevance: number}> = [];

  for (const [term, data] of Object.entries(manualIndex)) {
    let relevance = 0;

    // Exact phrase match (highest priority)
    if (question.toLowerCase().includes(term)) {
      relevance += 100;
    }

    // Individual keyword matches
    for (const keyword of data.keywords) {
      for (const searchTerm of searchTerms) {
        if (keyword.includes(searchTerm) || searchTerm.includes(keyword)) {
          relevance += 10;
        }
      }
    }

    // Partial word matches
    for (const searchTerm of searchTerms) {
      if (term.includes(searchTerm)) {
        relevance += 5;
      }
    }

    if (relevance > 0) {
      results.push({ term, data, relevance });
    }
  }

  return results.sort((a, b) => b.relevance - a.relevance).slice(0, 5);
}

// Detect if question is about U435/U1700L technical procedures
function isTechnicalQuestion(question: string): boolean {
  const technicalKeywords = [
    'u435', 'u1700l', 'unimog', 'portal', 'hub', 'axle', 'differential',
    'transmission', 'engine', 'brake', 'hydraulic', 'pto', 'steering',
    'wheel', 'bearing', 'seal', 'oil', 'maintenance', 'repair', 'procedure',
    'torque', 'pressure', 'assembly', 'disassembly', 'installation',
    'removal', 'filter', 'clutch', 'cooling', 'electrical', 'wiring'
  ];

  const lowerQuestion = question.toLowerCase();
  return technicalKeywords.some(keyword => lowerQuestion.includes(keyword));
}

Deno.serve(async (req: Request) => {
  // Enable CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question } = await req.json();

    if (!question?.trim()) {
      return new Response(
        JSON.stringify({ error: 'Question is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Determine response mode based on question type
    const isU435Technical = isTechnicalQuestion(question);

    if (isU435Technical) {
      // Database-only mode for technical questions
      console.log('🔧 Technical question detected - using database-only mode');

      const relevantProcedures = findRelevantProcedures(question);

      if (relevantProcedures.length === 0) {
        return new Response(
          JSON.stringify({
            response: "I don't have specific information about that procedure in the U435/U1700L manuals. Could you rephrase your question or be more specific about the component or system you're asking about?",
            source: 'database',
            procedures: []
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Build response with manual references
      let response = "Based on the U435/U1700L manual, here's what I found:\n\n";

      for (const procedure of relevantProcedures.slice(0, 3)) {
        const manualPart = manualParts[procedure.data.partId];
        if (manualPart) {
          const pdfPage = calculatePdfPage(procedure.data.page, manualPart.startPage);
          response += `**${procedure.data.section}** (Page ${procedure.data.page})\n`;
          response += `📄 Reference: ${manualPart.filename}, Page ${pdfPage}\n\n`;
        }
      }

      response += "For detailed procedures, please refer to the specific manual pages mentioned above.";

      return new Response(
        JSON.stringify({
          response,
          source: 'database',
          procedures: relevantProcedures.slice(0, 3).map(p => ({
            section: p.data.section,
            originalPage: p.data.page,
            pdfPage: manualParts[p.data.partId] ?
              calculatePdfPage(p.data.page, manualParts[p.data.partId].startPage) : 1,
            filename: manualParts[p.data.partId]?.filename || 'Unknown',
            relevance: p.relevance
          }))
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else {
      // Full ChatGPT mode for general questions
      console.log('💬 General question detected - using full ChatGPT mode');

      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: `You are Barry, a friendly and knowledgeable AI mechanic assistant for the Unimog Community Hub.

For general questions (non-technical), provide helpful, conversational responses about:
- General vehicle maintenance advice
- Community discussions
- Off-road driving tips
- General automotive knowledge
- Unimog history and variants

Keep responses concise but informative. If asked about specific U435/U1700L technical procedures, direct users to ask more specific technical questions for manual references.`
            },
            {
              role: 'user',
              content: question
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (!openaiResponse.ok) {
        throw new Error(`OpenAI API error: ${openaiResponse.status}`);
      }

      const openaiData = await openaiResponse.json();
      const response = openaiData.choices[0]?.message?.content || 'Sorry, I had trouble processing that question.';

      return new Response(
        JSON.stringify({
          response,
          source: 'chatgpt',
          procedures: []
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('Error in chat-with-barry function:', error);

    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});