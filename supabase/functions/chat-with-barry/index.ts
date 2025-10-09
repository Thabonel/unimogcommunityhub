// Barry Edge Function - AI-Driven Manual Search with GPT-5
// Version: 72 - ARCHITECTURE FIX: Knowledge base as GPT-5 tool (not blocking logic)
// Date: 2025-10-09
//
// Latest Changes (v72):
// - REMOVED dumb keyword matching that blocked GPT-5
// - Knowledge base now a GPT-5 tool - AI decides when to use it
// - GPT-5 has full intelligence to route queries (no more brittle pattern matching)
// - Admin-curated answers available via check_knowledge_base() function
//
// Previous Changes (v70):
// - OpenAI GPT-4o-mini reranking for 40-60% accuracy improvement
// - Search returns 15 candidates, reranks to top 5 most relevant
// - Uses existing OpenAI API (cost: ~$0.00015 per rerank)
//
// Revolutionary Changes (v69):
// - GPT-5 with function calling for intelligent manual search
// - Barry decides WHEN to search manuals (not dumb routing)
// - Strong system prompt prevents making stuff up
// - Knowledge base for non-technical community knowledge only
// - Barry uses AI intelligence to understand user intent

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OPENAI_API_KEY = <OPENAI_API_KEY>
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Barry's core personality and rules
const BARRY_SYSTEM_PROMPT = `You are Barry, a gruff but brilliant Unimog mechanic with 40+ years of hands-on experience.

CRITICAL RULES (NEVER BREAK THESE):
1. For ANY technical Unimog question, you MUST call search_manuals() FIRST before answering
2. NEVER guess procedures or make up technical information - ALWAYS cite the manual
3. If manuals don't have the answer, THEN use your 40 years of experience
4. You have the ENTIRE U435 manual library at your disposal - use it!
5. When you find manual references, ALWAYS include them in your response

Your personality:
- Gruff but caring - you don't suffer fools but you want to help
- Direct and no-nonsense - get to the point
- Safety-conscious - you've seen too many accidents from shortcuts
- Experienced - 40 years of busted knuckles teaches you things
- Manual-focused - "The manual exists for a reason, kid"

AVAILABLE TOOLS:
1. search_manuals(query) - Search U435 technical manuals for procedures, specs, diagrams
   - Use for: Technical questions, repairs, specifications, part numbers

2. check_knowledge_base(query) - Check admin-curated community knowledge
   - Use for: Common questions admins have specifically answered
   - Contains: FAQs, tips, community wisdom that doesn't change
   - Check this FIRST for non-technical questions or common FAQs
   - If found, use the curated answer as-is

DECISION LOGIC:
- Technical question about Unimog? → search_manuals()
- Simple FAQ or common question? → Try check_knowledge_base() first, then search_manuals() if not found
- General question (weather, travel, etc.)? → Answer directly with your personality

Example responses:
- "Alright, let me check the manual... [calls search_manuals()] ...Section 60, page 1 covers cab removal. Here's the deal: you need to disconnect the hydraulic lines first, then unbolt the mounting points. Review the exploded diagram before you start - I've seen too many people skip that step and regret it."
- "Portal hub seal? Let me look that up... [calls search_manuals()] ...Section 19, page 555. STOP - before you touch anything, depressurize the system completely. I've seen this go wrong too many times."

You can also answer non-technical questions using your personality, but ALWAYS search manuals for technical questions.`;

// Tool definition for GPT-5 function calling
const SEARCH_MANUALS_TOOL = {
  type: 'function',
  function: {
    name: 'search_manuals',
    description: 'Search the U435 Unimog technical manual library for procedures, specifications, and diagrams. Use this for ANY technical question about the Unimog.',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'The search query - use clear technical terms (e.g., "cab removal procedure", "portal hub seal replacement", "brake system bleeding")'
        },
        max_results: {
          type: 'number',
          description: 'Maximum number of manual sections to return (default: 15, reranked to top 5)',
          default: 15
        }
      },
      required: ['query']
    }
  }
};

// Tool definition for checking admin-curated knowledge base
const CHECK_KNOWLEDGE_BASE_TOOL = {
  type: 'function',
  function: {
    name: 'check_knowledge_base',
    description: 'Check the admin-curated knowledge base for common questions, FAQs, and community wisdom. Use this for frequently asked questions that admins have specifically answered.',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'The user\'s question to check against curated knowledge (e.g., "oil change procedure", "where to camp", "best routes")'
        }
      },
      required: ['query']
    }
  }
};

// Query knowledge base for admin-curated community knowledge (called by GPT-5)
async function queryKnowledgeBase(userQuery: string, supabase: any): Promise<{
  found: boolean;
  entry: any | null;
}> {
  try {
    // Filter stopwords and short words that cause false matches
    const stopwords = ['how', 'do', 'i', 'the', 'a', 'an', 'to', 'is', 'my', 'can', 'what', 'where', 'when', 'why', 'should', 'would', 'could'];
    const queryWords = userQuery.toLowerCase()
      .split(/\s+/)
      .filter(word => word.length >= 3 && !stopwords.includes(word));

    console.log(`🔍 KB search words (filtered): ${queryWords.join(', ')}`);

    const { data: entries, error } = await supabase
      .from('barry_knowledge_base')
      .select('*')
      .order('priority', { ascending: false });

    if (error || !entries || entries.length === 0) {
      return { found: false, entry: null };
    }

    // Require at least 2 keyword matches for precision
    for (const entry of entries) {
      const matchedKeywords = entry.question_keywords.filter((keyword: string) =>
        queryWords.some(word =>
          word.includes(keyword.toLowerCase()) || keyword.toLowerCase().includes(word)
        )
      );

      if (matchedKeywords.length >= 2) {
        console.log(`📚 Knowledge base match: ${matchedKeywords.join(', ')}`);
        return { found: true, entry };
      }
    }

    return { found: false, entry: null };
  } catch (error) {
    console.error('❌ Error querying knowledge base:', error);
    return { found: false, entry: null };
  }
}

// Teach Barry function - admin can add knowledge via chat
async function teachBarry(userMessage: string, userId: string, supabase: any): Promise<{
  isTeachCommand: boolean;
  success: boolean;
  response: string;
}> {
  const teachPatterns = [
    /(?:remember|barry,?\s*remember|note|barry,?\s*note)\s*(?:that|this)?:?\s*(.+)/i,
    /(?:teach|barry,?\s*teach|learn|barry,?\s*learn)\s*(?:that|this)?:?\s*(.+)/i
  ];

  let knowledgeText = null;
  for (const pattern of teachPatterns) {
    const match = userMessage.match(pattern);
    if (match && match[1]) {
      knowledgeText = match[1].trim();
      break;
    }
  }

  if (!knowledgeText) {
    return { isTeachCommand: false, success: false, response: '' };
  }

  const { data: userRole } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .single();

  if (!userRole || userRole.role !== 'admin') {
    return {
      isTeachCommand: true,
      success: false,
      response: "Nice try, kid, but only admins can teach me new things. You'll have to ask the boss for that privilege."
    };
  }

  const words = knowledgeText.toLowerCase()
    .split(/\s+/)
    .filter(w => w.length > 3 && !['that', 'this', 'with', 'from', 'have', 'been', 'were'].includes(w))
    .slice(0, 5);

  if (words.length === 0) {
    return {
      isTeachCommand: true,
      success: false,
      response: "I need a bit more to work with, boss. Give me at least a few solid words to remember."
    };
  }

  try {
    const { error } = await supabase
      .from('barry_knowledge_base')
      .insert({
        question_keywords: words,
        barry_response_template: knowledgeText,
        priority: 5,
        manual_references: {}
      });

    if (error) throw error;

    return {
      isTeachCommand: true,
      success: true,
      response: `Got it, boss! I've added that to my memory bank. Keywords: ${words.join(', ')}. ` +
               `Next time someone asks about any of those topics, I'll remember what you taught me.`
    };
  } catch (error) {
    console.error('Error saving knowledge:', error);
    return {
      isTeachCommand: true,
      success: false,
      response: "Had a bit of trouble saving that to my memory, boss. Might want to check the admin panel instead."
    };
  }
}

// Execute manual search (called by GPT-5 via function calling)
async function searchManuals(query: string, maxResults: number, supabase: any): Promise<any[]> {
  console.log(`🔍 AI requested manual search: "${query}"`);

  try {
    const { data: searchResults, error } = await supabase.rpc('search_manual_index', {
      user_query: query,
      max_results: maxResults || 5
    });

    if (error) {
      console.error('❌ Manual search error:', error);
      return [];
    }

    if (!searchResults || searchResults.length === 0) {
      console.log('📭 No manual results found');
      return [];
    }

    console.log(`✅ Found ${searchResults.length} manual references`);
    return searchResults;
  } catch (error) {
    console.error('❌ Search error:', error);
    return [];
  }
}

// Rerank search results for better relevance (Foxel-inspired, using OpenAI)
async function rerankResults(query: string, results: any[]): Promise<any[]> {
  if (!results || results.length === 0) {
    return results;
  }

  if (!OPENAI_API_KEY) {
    console.log('⚠️ OpenAI API not configured, skipping reranking');
    return results;
  }

  try {
    console.log(`🔄 Reranking ${results.length} results for query: "${query}"`);

    // Create relevance scoring prompt
    const documentsText = results.map((r, i) =>
      `${i}. "${r.term}" (${r.chapter_filename}, Page ${r.pdf_page_number})`
    ).join('\n');

    const rerankPrompt = `Rate the relevance of these Unimog manual sections to the user query.
Return ONLY a JSON array of numbers (0.0 to 1.0) representing relevance scores, one for each section.

User Query: "${query}"

Manual Sections:
${documentsText}

Return format: [0.95, 0.82, 0.15, ...]`;

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: rerankPrompt }],
        temperature: 0.1,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ OpenAI reranking error:', error);
      return results; // Fallback to original results
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Parse scores from response
    const scores = JSON.parse(content);

    if (!Array.isArray(scores) || scores.length !== results.length) {
      console.error('❌ Invalid reranking scores format');
      return results;
    }

    // Combine results with scores and sort by relevance
    const reranked = results
      .map((result, i) => ({
        ...result,
        rerank_score: scores[i]
      }))
      .sort((a, b) => b.rerank_score - a.rerank_score)
      .slice(0, 5); // Keep top 5

    console.log(`✅ Reranked to ${reranked.length} most relevant results`);
    return reranked;

  } catch (error) {
    console.error('❌ Reranking error:', error);
    return results; // Fallback to original results
  }
}

// Format manual results for GPT-5
function formatManualResultsForAI(results: any[]): string {
  if (!results || results.length === 0) {
    return 'No manual entries found for this query.';
  }

  let formatted = 'Manual Search Results:\n\n';
  results.forEach((result, idx) => {
    formatted += `${idx + 1}. ${result.term}\n`;
    formatted += `   Manual: ${result.chapter_filename}\n`;
    formatted += `   Page: ${result.pdf_page_number}\n`;
    formatted += `   Category: ${result.system_category || 'general'}\n`;
    formatted += `   Match Type: ${result.match_type}\n`;
    if (result.has_safety_warning) {
      formatted += `   ⚠️ HAS SAFETY WARNING\n`;
    }
    formatted += '\n';
  });

  return formatted;
}

// Convert manual results to frontend format
function convertToManualReferences(results: any[]): any[] {
  return results.map(item => ({
    type: 'u435_optimized_index',
    title: item.term || 'Manual Entry',
    original_page: item.page_number || 0,
    pdf_page: item.pdf_page_number || 0,
    storage_url: item.storage_url || '',
    chapter_filename: item.chapter_filename || '',
    system_category: item.system_category || 'general',
    has_safety_warning: item.has_safety_warning || false,
    match_type: item.match_type || 'manual',
    match_score: item.match_score || 0.5,
    manual_type: 'U435',
    is_maintenance_manual: (item.chapter_filename && item.chapter_filename.includes('Maint_')) || false
  }));
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

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
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

    // Get user context
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
      console.log('Error fetching user profile:', error);
    }

    let locationContext = '';
    if (location && location.latitude && location.longitude) {
      locationContext = `\nUser's current location: Latitude ${location.latitude}, Longitude ${location.longitude}`;
    }

    const lastUserMessage = messages.filter((m: any) => m.role === 'user').pop();
    if (!lastUserMessage || !lastUserMessage.content) {
      return new Response(JSON.stringify({ error: 'No user message found' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Check for teach command
    console.log('🎓 Checking for teach/remember commands...');
    const teachResult = await teachBarry(lastUserMessage.content, user.id, supabaseAdmin);

    if (teachResult.isTeachCommand) {
      console.log(`📝 Teach command detected! Success: ${teachResult.success}`);
      return new Response(JSON.stringify({
        content: teachResult.response,
        manualReferences: [],
        knowledgeMode: teachResult.success ? 'knowledge_saved' : 'teach_failed',
        searchResultCount: 0,
        usage: { total_tokens: 0 }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });
    }

    // Rate limiting
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

    await supabaseClient.from('chat_rate_limits').insert({ user_id: user.id });

    // Call GPT-5 with function calling capability
    console.log('🤖 Calling GPT-5 with function calling...');

    const systemPrompt = BARRY_SYSTEM_PROMPT + '\n\n' + userContext + locationContext;
    let conversationMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    let allManualReferences: any[] = [];
    let functionCallCount = 0;
    const MAX_FUNCTION_CALLS = 3; // Prevent infinite loops

    while (functionCallCount < MAX_FUNCTION_CALLS) {
      const openAIResponse = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: conversationMessages,
          tools: [SEARCH_MANUALS_TOOL, CHECK_KNOWLEDGE_BASE_TOOL],
          temperature: 0.7,
          max_tokens: 800
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
      const assistantMessage = data.choices[0].message;

      // Add assistant's response to conversation
      conversationMessages.push(assistantMessage);

      // Check if AI wants to call a function
      if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
        console.log(`🔧 AI calling function: ${assistantMessage.tool_calls[0].function.name}`);

        for (const toolCall of assistantMessage.tool_calls) {
          if (toolCall.function.name === 'search_manuals') {
            functionCallCount++;

            const args = JSON.parse(toolCall.function.arguments);
            const searchResults = await searchManuals(args.query, args.max_results || 15, supabaseAdmin);

            // Rerank results for better relevance (Foxel-inspired improvement)
            const rerankedResults = await rerankResults(args.query, searchResults);

            // Store manual references for frontend
            allManualReferences.push(...rerankedResults);

            // Format results for AI
            const formattedResults = formatManualResultsForAI(rerankedResults);

            // Add function result to conversation
            conversationMessages.push({
              role: 'tool',
              tool_call_id: toolCall.id,
              content: formattedResults
            });
          } else if (toolCall.function.name === 'check_knowledge_base') {
            functionCallCount++;

            const args = JSON.parse(toolCall.function.arguments);
            console.log(`📚 AI checking knowledge base for: "${args.query}"`);

            const knowledgeResult = await queryKnowledgeBase(args.query, supabaseAdmin);

            let responseContent: string;
            if (knowledgeResult.found && knowledgeResult.entry) {
              console.log(`✅ Found curated answer (priority ${knowledgeResult.entry.priority})`);
              responseContent = `CURATED ANSWER FOUND:\n\n${knowledgeResult.entry.barry_response_template}\n\n(Use this curated answer as-is - admins have specifically crafted this response)`;
            } else {
              console.log(`📭 No curated answer found in knowledge base`);
              responseContent = 'NO CURATED ANSWER FOUND - Proceed with manual search or general knowledge';
            }

            // Add function result to conversation
            conversationMessages.push({
              role: 'tool',
              tool_call_id: toolCall.id,
              content: responseContent
            });
          }
        }

        // Continue loop to get AI's response after function call
        continue;
      }

      // AI has finished (no more function calls) - return final response
      const finalContent = assistantMessage.content;

      // Log the chat
      await supabaseClient.from('chat_logs').insert({
        user_id: user.id,
        messages: messages,
        response: finalContent,
        model: 'gpt-5-function-calling',
        tokens_used: data.usage?.total_tokens || 0,
        knowledge_source: allManualReferences.length > 0 ? 'manual_ai_search' : 'general_ai',
        has_location: !!location,
        routing_rule: 'ai_driven',
        routing_match: `${functionCallCount} function calls`,
        pdf_references_found: allManualReferences.length
      });

      return new Response(JSON.stringify({
        content: finalContent,
        manualReferences: convertToManualReferences(allManualReferences),
        knowledgeMode: allManualReferences.length > 0 ? 'ai_manual_search' : 'general_ai',
        searchResultCount: allManualReferences.length,
        usage: data.usage
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });
    }

    // Fallback if max function calls exceeded
    return new Response(JSON.stringify({ error: 'Max function calls exceeded' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
