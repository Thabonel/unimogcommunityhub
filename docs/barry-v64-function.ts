import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are Barry, a seasoned Unimog mechanic with over 40 years of hands-on experience. Born and raised in the Black Forest region of Germany where Unimogs are manufactured, you've worked on every model from the classic 406 to the modern U5023.

Your personality:
- Gruff but knowledgeable, with a dry sense of humor
- You speak with authority from real experience
- You occasionally throw in German technical terms
- You're practical and no-nonsense, but warm up when talking about Unimogs
- You have strong opinions about proper maintenance

IMPORTANT: You have TWO modes of operation:

1. MANUAL MODE (when user asks about Unimog technical topics):
   - Search through provided manual content
   - Cite specific sections when found
   - If no relevant manual content, share from your "experience" but mention you don't have that specific procedure in the manuals

2. GENERAL ASSISTANT MODE (when user asks for non-technical help):
   - Act as a helpful AI assistant
   - Write letters, emails, documents as requested
   - Provide general assistance beyond Unimog technical topics
   - Still maintain Barry's personality but help with any request

Your knowledge includes:
- All Unimog models and their quirks
- Common problems and field fixes
- Military and civilian applications
- Portal axles, torque tubes, and unique Unimog engineering
- The evolution of Unimog design over decades`;

function classifyQuery(query: string): { mode: 'manual' | 'chatgpt', rule: string, matched: string } {
  const text = query.toLowerCase();

  const nonTechnicalIntents = [
    'write', 'letter', 'email', 'document', 'compose', 'draft',
    'boss', 'wife', 'husband', 'friend', 'family',
    'late', 'absent', 'excuse', 'apology', 'sorry',
    'tell', 'explain', 'say', 'message',
    'poem', 'story', 'joke', 'song',
    'translate', 'summarize', 'rewrite',
    'list', 'ideas', 'suggestions', 'brainstorm',
    'recipe', 'instructions for cooking',
    'weather', 'news', 'history of',
    'calculate', 'math', 'convert',
    'game', 'riddle', 'puzzle'
  ];

  const vehicleParts = [
    'engine', 'transmission', 'differential', 'axle', 'portal', 'brake',
    'clutch', 'gearbox', 'hydraulic', 'pto', 'winch', 'tire', 'wheel',
    'suspension', 'steering', 'fuel', 'oil', 'filter', 'battery',
    'electrical', 'wiring', 'fuse', 'relay', 'sensor', 'valve',
    'pump', 'cylinder', 'radiator', 'coolant', 'exhaust', 'turbo',
    'compressor', 'belt', 'hose', 'gasket', 'seal', 'bearing'
  ];

  const repairTerms = [
    'fix', 'repair', 'replace', 'install', 'remove', 'adjust',
    'maintain', 'service', 'check', 'inspect', 'diagnose', 'troubleshoot',
    'rebuild', 'overhaul', 'restore', 'refurbish', 'upgrade',
    'bleed', 'flush', 'clean', 'lubricate', 'tighten', 'loosen',
    'align', 'balance', 'calibrate', 'test', 'measure'
  ];

  const hasNonTechnicalIntent = nonTechnicalIntents.some(intent => text.includes(intent));
  if (hasNonTechnicalIntent) {
    const matched = nonTechnicalIntents.find(intent => text.includes(intent)) || 'general';
    return { mode: 'chatgpt', rule: 'non_technical', matched };
  }

  const hasUnimogMention = text.includes('unimog') || text.includes('mog') || text.includes('u1700') ||
                           text.includes('u1300') || text.includes('u500') || text.includes('416');

  const hasVehiclePart = vehicleParts.some(part => text.includes(part));
  const hasRepairIntent = repairTerms.some(term => text.includes(term));

  if (hasUnimogMention && (hasRepairIntent || hasVehiclePart)) {
    const matchedPart = vehicleParts.find(part => text.includes(part));
    const matchedRepair = repairTerms.find(term => text.includes(term));
    return { mode: 'manual', rule: 'unimog_technical', matched: matchedPart || matchedRepair || 'unimog' };
  }

  if (hasVehiclePart || hasRepairIntent) {
    const matched = vehicleParts.find(part => text.includes(part)) ||
                   repairTerms.find(term => text.includes(term)) || 'technical';
    return { mode: 'manual', rule: 'generic_technical', matched };
  }

  return { mode: 'chatgpt', rule: 'default', matched: 'general' };
}

async function searchManuals(supabase: any, query: string) {
  try {
    console.log('Searching manuals for query:', query);

    const { data: semanticResults, error: semanticError } = await supabase.rpc(
      'search_manual_chunks',
      { query_text: query, match_count: 5 }
    );

    if (!semanticError && semanticResults && semanticResults.length > 0) {
      console.log(`Found ${semanticResults.length} semantic matches`);
      return semanticResults.map((result: any) => ({
        content: result.content,
        metadata: result.metadata,
        similarity: result.similarity
      }));
    }

    console.log('Falling back to keyword search');
    const searchTerms = query.toLowerCase().split(' ')
      .filter(term => term.length > 3)
      .slice(0, 3);

    const { data: keywordResults, error: keywordError } = await supabase
      .from('manual_chunks')
      .select('content, metadata')
      .or(searchTerms.map(term => `content.ilike.%${term}%`).join(','))
      .limit(5);

    if (!keywordError && keywordResults && keywordResults.length > 0) {
      console.log(`Found ${keywordResults.length} keyword matches`);
      return keywordResults;
    }

    console.log('No manual content found');
    return [];
  } catch (error) {
    console.error('Error searching manuals:', error);
    return [];
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, sessionId } = await req.json();

    if (!message) {
      throw new Error('Message is required');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const classification = classifyQuery(message);
    console.log('Query classification:', classification);

    let context = '';
    let response = '';

    if (classification.mode === 'manual') {
      const manualResults = await searchManuals(supabase, message);

      if (manualResults.length > 0) {
        context = manualResults.map((result: any, index: number) => {
          const source = result.metadata?.source || 'Manual';
          const section = result.metadata?.section || 'Section';
          return `\n[${index + 1}] From ${source} - ${section}:\n${result.content}\n`;
        }).join('\n---\n');

        response = await generateAIResponse(
          message,
          SYSTEM_PROMPT + `\n\nRelevant manual content found:\n${context}\n\nProvide a response based on this manual content. Cite the specific sections when referencing information.`,
          'manual'
        );
      } else {
        response = await generateAIResponse(
          message,
          SYSTEM_PROMPT + `\n\nNo specific manual content found for this query. Provide advice based on your general Unimog expertise and experience, but mention that you don't have the specific procedure in the available manuals.`,
          'experience'
        );
      }
    } else {
      response = await generateAIResponse(
        message,
        SYSTEM_PROMPT + `\n\nThe user needs general assistance (not Unimog technical help). Help them with their request while maintaining Barry's personality. Be helpful and complete the task they're asking for.`,
        'general'
      );
    }

    if (sessionId) {
      await supabase.from('ai_conversations').insert({
        session_id: sessionId,
        user_message: message,
        ai_response: response,
        mode: classification.mode,
        classification_rule: classification.rule,
        matched_term: classification.matched,
        context_used: context || null
      });
    }

    return new Response(
      JSON.stringify({
        response,
        mode: classification.mode,
        classification: classification
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in chat-with-barry:', error);
    return new Response(
      JSON.stringify({
        error: error.message,
        response: "Ach, something's gone wrong with my tools here. Try asking again, ja?"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function generateAIResponse(message: string, systemPrompt: string, mode: string) {
  const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

  if (!geminiApiKey) {
    console.error('Gemini API key not configured');
    return "Well, my newfangled computer assistant seems to be having issues. But let me tell you from experience - " +
           "always start with the basics. Check your fluids, filters, and connections. If you can give me more details, " +
           "I can try to help based on my years working on these beasts.";
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${systemPrompt}\n\nUser question: ${message}\n\nProvide a helpful response in character as Barry.`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', errorData);
      throw new Error('Failed to generate response');
    }

    const data = await response.json();

    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Invalid response format from Gemini');
    }

  } catch (error) {
    console.error('Error calling Gemini API:', error);

    if (mode === 'general') {
      return "Ah, sorry about that. My assistant seems to be taking a break. " +
             "I'm better with Unimog technical questions anyway - that's where my 40 years of experience really shines!";
    } else {
      return "Scheisse! My computer assistant is acting up. But from my experience, " +
             "I'd check the basics first. What specific symptoms are you seeing with your Unimog?";
    }
  }
}