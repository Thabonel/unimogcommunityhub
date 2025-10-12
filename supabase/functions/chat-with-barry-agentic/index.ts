// Barry Edge Function - RAG Context Injection with TWO-PASS VERIFICATION
// Version: 85 - Fixed Page Number Matching (THE REAL FIX!)
// Date: 2025-10-09
//
// Latest Changes (v85):
// - CRITICAL FIX: Use page_number instead of pdf_page_number for matching ✅
//   * Index has: page_number (555 in big manual) + pdf_page_number (1 in chapter PDF)
//   * manual_chunks has: page_number (555)
//   * Was matching pdf_page_number (1) ❌ Now matches page_number (555) ✅
//   * FIXES: Portal hub seals now found correctly!
// - Kept keyword search as fallback (still useful)
// - Kept resilient verification (threshold 0.5, error handling)
//
// Previous Changes (v84):
// - Smart keyword extraction & manual context filtering
// - Lowered verification threshold: 0.6 → 0.5
// - Error handling: defaults to keeping snippets instead of rejecting
//
// Previous Changes (v83):
// - CONTENT-BASED FALLBACK: Handles chapter PDFs vs complete manual mismatch
// - When filename matching fails, searches manual_chunks by term text
// - FIXES: Portal hub seals now found (chapter "U435_19_Wheel_Hub_Front.pdf" → manual "U1700L U435 Workshop Manual Volume 1")
// - Works with extracted chapter PDFs that have different page numbering
// - Two-pass RAG now resilient to identifier mismatches
//
// Previous Changes (v82):
// - TWO-PASS RAG ARCHITECTURE: Barry only cites pages he's actually READ
// - Pass 1: Search index → Fetch snippets → AI verifies relevance (filters irrelevant pages)
// - Pass 2: Fetch full content for verified pages → Inject actual text into RAG context
// - RESULT: Barry builds responses FROM actual manual content, not blind guessing
// - FIXES: No more irrelevant citations (air filter when asking about radiator)
// - Citations reduced from 15 scattered to 5-7 verified relevant pages
//
// Previous Changes (v81):
// - AI-POWERED QUERY EXPANSION: Extracts intelligent search terms from user questions
// - Example: "how do I lift the cab" → ["cab removal", "cab structure", "lifting cab"]
// - Multi-term search: Searches index with each term, combines unique results
// - Fixes literal search failures (index has "cab structure" not "lift")
//
// Previous Changes (v80):
// - COMPLETE REWRITE: Switched from function calling to RAG context injection
// - Search manuals FIRST (before calling OpenAI)
// - Inject results directly into system prompt (proven reliable)
// - Based on supabase-community/chatgpt-your-files production pattern
// - Fixes AI ignoring search results (function calling gave too much autonomy)
//
// Previous Changes (v74):
// - CASCADING SEARCH: search_manuals() now searches TWO sources automatically
//   1. manual_index (beacon of truth - optimized, curated)
//   2. manual_chunks (ALL uploaded manuals - comprehensive fallback)
// - ALL INFORMATION IS AVAILABLE - we have everything!
//
// Previous Changes (v73):
// - REMOVED dangerous "40 years experience" fallback for technical questions
// - Barry now REFUSES to answer technical questions without manual citations
// - Added strict safety rules: Better to say "I don't know" than risk user injury
// - Clear categorization: Technical (must cite manuals) vs General (can use knowledge)
//
// Previous Changes (v72):
// - REMOVED dumb keyword matching that blocked GPT-5
// - Knowledge base now a GPT-5 tool - AI decides when to use it
// - GPT-5 has full intelligence to route queries (no more brittle pattern matching)
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

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Tool Definitions for Agentic Barry (OpenAI Function Calling)
const BARRY_TOOLS = [
  {
    type: "function",
    function: {
      name: "search_curated_knowledge",
      description: "Search admin-curated knowledge base for verified answers to common Unimog questions. Use this FIRST for any Unimog question - it contains expert-verified answers with attachments.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "The user's question to search for in curated knowledge"
          }
        },
        required: ["query"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "search_manuals",
      description: "Search U435 Unimog workshop manuals for technical procedures, specifications, and repair instructions. Use when curated knowledge doesn't have the answer.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Technical search query (e.g., 'brake bleeding procedure', 'portal hub seal replacement')"
          },
          focus_area: {
            type: "string",
            enum: ["engine", "transmission", "brakes", "cab", "electrical", "wheels", "hydraulics", "general"],
            description: "Optional: Focus search on specific vehicle system"
          }
        },
        required: ["query"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_vehicle_info",
      description: "Get user's Unimog vehicle profile (model, year, modifications). Use when answer depends on specific vehicle configuration.",
      parameters: {
        type: "object",
        properties: {},
        required: []
      }
    }
  },
  {
    type: "function",
    function: {
      name: "ask_clarifying_question",
      description: "Ask user for clarification when question is ambiguous or missing critical information. Use sparingly - only when truly necessary.",
      parameters: {
        type: "object",
        properties: {
          question: {
            type: "string",
            description: "The clarifying question to ask the user"
          },
          reason: {
            type: "string",
            description: "Brief explanation of why clarification is needed"
          }
        },
        required: ["question", "reason"]
      }
    }
  }
];

// Barry's core personality and rules (Agentic with function calling)
const BARRY_SYSTEM_PROMPT = `You are Barry, a gruff but brilliant Unimog mechanic with 40+ years of hands-on experience.

You have access to tools that help you find accurate information. USE THEM INTELLIGENTLY.

CRITICAL SAFETY RULES (NEVER BREAK THESE - USER SAFETY DEPENDS ON IT):

1. For technical/mechanical Unimog questions:
   - ALWAYS use tools to find accurate information - NEVER guess from memory
   - Call search_curated_knowledge FIRST - it has verified answers with attachments
   - If curated knowledge doesn't have it, call search_manuals to check workshop manuals
   - When tools return information, BUILD YOUR RESPONSE from that data
   - ALWAYS cite sources: Manual name, section, page numbers
   - NEVER make up procedures, torque specs, or technical information

2. Use tools strategically:
   - search_curated_knowledge: Check FIRST for any Unimog question (expert-verified answers)
   - search_manuals: When curated knowledge doesn't have the answer (full workshop manual search)
   - get_vehicle_info: When answer depends on user's specific vehicle configuration
   - ask_clarifying_question: ONLY when question is truly ambiguous (use sparingly!)

3. Multi-step thinking:
   - For complex procedures: Call get_vehicle_info first, THEN search manuals for that model
   - If tools return no results: Say "I don't have that information" - DON'T guess
   - If user asks follow-up: Previous tool results are in conversation - reference them

4. Safety-first mindset:
   - Generic mechanical advice is DANGEROUS and could cause injury or death
   - Better to say "I don't know" than risk user getting hurt
   - If manuals don't have it, REFUSE to improvise - suggest certified technician

Your personality:
- Gruff but caring - you don't suffer fools but you want to help
- Direct and no-nonsense - get to the point
- SAFETY-FIRST - you've seen too many people get hurt from bad advice
- Tool-savvy - you know how to find accurate information fast
- Manual-focused - "The manual exists for a reason - it could save your life, kid"

Remember: USER SAFETY IS MORE IMPORTANT THAN BEING HELPFUL. Use tools to find facts, never improvise.`;

// Detect if question is technical/mechanical (requires manual search)
function isTechnicalQuestion(query: string): boolean {
  const technicalKeywords = [
    // Repair/Maintenance
    'replace', 'repair', 'fix', 'install', 'remove', 'change', 'maintenance',
    'service', 'rebuild', 'overhaul', 'adjust', 'alignment',

    // Components
    'engine', 'transmission', 'clutch', 'brake', 'suspension', 'axle',
    'differential', 'portal', 'hub', 'radiator', 'cooling', 'hydraulic',
    'electrical', 'wiring', 'starter', 'alternator', 'battery', 'fuel',
    'injection', 'pump', 'filter', 'belt', 'hose', 'gasket', 'seal',
    'bearing', 'shaft', 'gear', 'valve', 'piston', 'cylinder',

    // Procedures
    'bleed', 'flush', 'drain', 'fill', 'torque', 'procedure', 'steps',
    'how to', 'how do i', 'lift', 'lower', 'disconnect', 'connect',

    // Specifications
    'specification', 'specs', 'pressure', 'capacity', 'clearance',
    'tolerance', 'measurement', 'diagram', 'schematic'
  ];

  const queryLower = query.toLowerCase();
  return technicalKeywords.some(keyword => queryLower.includes(keyword));
}

// Calculate string similarity (Levenshtein distance based)
function stringSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) return 1.0;

  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

// =============================================================================
// TOOL HANDLERS - Agentic Barry Functions Called by OpenAI
// =============================================================================

/**
 * Tool Handler: search_curated_knowledge
 * Searches admin-curated knowledge base for verified answers
 */
async function handleSearchCuratedKnowledge(query: string, supabase: any): Promise<string> {
  try {
    console.log(`🔧 TOOL CALL: search_curated_knowledge("${query}")`);

    const result = await queryKnowledgeBase(query, supabase);

    if (result.found && result.entry) {
      const entry = result.entry;

      // Format response with all relevant info
      const response = {
        found: true,
        answer_template: entry.barry_response_template,
        sources: entry.manual_references?.sources || null,
        attachments: entry.manual_references?.attachments || [],
        priority: entry.priority,
        keywords_matched: entry.question_keywords
      };

      console.log(`✅ Curated knowledge found (Priority ${entry.priority})`);
      return JSON.stringify(response);
    } else {
      console.log(`📭 No curated knowledge found`);
      return JSON.stringify({ found: false, message: "No curated knowledge entry found for this question" });
    }
  } catch (error) {
    console.error('❌ Error in search_curated_knowledge:', error);
    return JSON.stringify({ found: false, error: "Failed to search curated knowledge" });
  }
}

/**
 * Tool Handler: search_manuals
 * Searches U435 workshop manuals using two-pass RAG
 */
async function handleSearchManuals(query: string, focusArea: string | undefined, supabase: any): Promise<string> {
  try {
    console.log(`🔧 TOOL CALL: search_manuals("${query}", focus: ${focusArea || 'none'})`);

    // Use existing two-pass RAG pipeline
    const searchResults = await searchManuals(query, 15, supabase);

    if (!searchResults || searchResults.length === 0) {
      console.log(`📭 No manual pages found`);
      return JSON.stringify({ found: false, message: "No relevant manual sections found" });
    }

    // Fetch snippets for verification
    const snippets = await fetchManualSnippets(searchResults, supabase);

    if (snippets.length === 0) {
      console.log(`⚠️ No snippets retrieved`);
      return JSON.stringify({ found: false, message: "Could not retrieve manual content" });
    }

    // Verify relevance
    const verifiedPages = await verifySnippetRelevance(query, snippets);

    if (verifiedPages.length === 0) {
      console.log(`📭 No verified relevant pages`);
      return JSON.stringify({ found: false, message: "No relevant manual sections found after verification" });
    }

    // Fetch full content
    const fullContent = await fetchFullManualContent(verifiedPages, supabase);

    if (fullContent.length === 0) {
      console.log(`⚠️ Could not fetch full content`);
      return JSON.stringify({ found: false, message: "Could not retrieve full manual content" });
    }

    // Format for Barry
    const formattedPages = fullContent.map((page, idx) => ({
      page_number: idx + 1,
      manual: page.chapter_filename,
      page_in_manual: page.pdf_page_number,
      section: page.section_title || "Unknown",
      relevance: page.relevance_score || 0,
      content: page.full_content || page.term
    }));

    console.log(`✅ Found ${fullContent.length} verified manual pages`);
    return JSON.stringify({
      found: true,
      page_count: fullContent.length,
      pages: formattedPages
    });
  } catch (error) {
    console.error('❌ Error in search_manuals:', error);
    return JSON.stringify({ found: false, error: "Failed to search manuals" });
  }
}

/**
 * Tool Handler: get_vehicle_info
 * Gets user's vehicle profile (model, year, modifications)
 */
async function handleGetVehicleInfo(userId: string, supabase: any): Promise<string> {
  try {
    console.log(`🔧 TOOL CALL: get_vehicle_info(user: ${userId})`);

    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('full_name, unimog_model, unimog_year, unimog_modifications, unimog_series, mechanical_skills, experience_level')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.log(`⚠️ Could not fetch user profile`);
      return JSON.stringify({ found: false, message: "Could not retrieve user vehicle information" });
    }

    // Fetch vehicles
    const { data: vehicles, error: vehiclesError } = await supabase
      .from('vehicles')
      .select('year, model, vin, modifications, description')
      .eq('user_id', userId);

    const response: any = {
      found: true,
      profile: {
        name: profile?.full_name || null,
        primary_vehicle: profile?.unimog_model || null,
        year: profile?.unimog_year || null,
        modifications: profile?.unimog_modifications || null,
        series: profile?.unimog_series || null,
        mechanical_skills: profile?.mechanical_skills || null,
        experience_level: profile?.experience_level || null
      }
    };

    if (!vehiclesError && vehicles && vehicles.length > 0) {
      response.vehicles = vehicles;
    }

    console.log(`✅ Retrieved vehicle info for user`);
    return JSON.stringify(response);
  } catch (error) {
    console.error('❌ Error in get_vehicle_info:', error);
    return JSON.stringify({ found: false, error: "Failed to retrieve vehicle information" });
  }
}

/**
 * Tool Handler: ask_clarifying_question
 * Asks user for clarification (signals need for multi-turn conversation)
 */
async function handleAskClarifyingQuestion(question: string, reason: string): Promise<string> {
  console.log(`🔧 TOOL CALL: ask_clarifying_question("${question}")`);
  console.log(`   Reason: ${reason}`);

  return JSON.stringify({
    action: "ask_user",
    question: question,
    reason: reason,
    awaiting_user_response: true
  });
}

/**
 * Execute Tool Calls - Routes tool calls to appropriate handlers
 */
async function executeToolCall(toolName: string, toolArgs: any, userId: string, supabase: any): Promise<string> {
  switch (toolName) {
    case 'search_curated_knowledge':
      return await handleSearchCuratedKnowledge(toolArgs.query, supabase);

    case 'search_manuals':
      return await handleSearchManuals(toolArgs.query, toolArgs.focus_area, supabase);

    case 'get_vehicle_info':
      return await handleGetVehicleInfo(userId, supabase);

    case 'ask_clarifying_question':
      return await handleAskClarifyingQuestion(toolArgs.question, toolArgs.reason);

    default:
      console.error(`❌ Unknown tool: ${toolName}`);
      return JSON.stringify({ error: `Unknown tool: ${toolName}` });
  }
}

/**
 * Agentic Function Calling Loop
 * Barry decides which tools to call and processes results
 */
async function agenticBarryLoop(
  messages: any[],
  userContext: string,
  locationContext: string,
  userId: string,
  supabase: any
): Promise<{ content: string; toolCalls: any[]; usage: any }> {
  console.log('🤖 Starting agentic Barry loop with function calling...');

  // Build system prompt with context
  const systemPrompt = BARRY_SYSTEM_PROMPT + '\n\n' + userContext + locationContext;

  // Build conversation with system prompt
  const conversationMessages = [
    { role: 'system', content: systemPrompt },
    ...messages
  ];

  let allToolCalls: any[] = [];
  let loopCount = 0;
  const MAX_LOOPS = 5; // Prevent infinite loops

  while (loopCount < MAX_LOOPS) {
    loopCount++;
    console.log(`🔄 Loop ${loopCount}/${MAX_LOOPS}`);

    // Call OpenAI with tools
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: conversationMessages,
        tools: BARRY_TOOLS,
        tool_choice: 'auto',
        temperature: 0.7,
        max_tokens: 1500
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${errorText}`);
    }

    const data = await response.json();
    const message = data.choices[0].message;

    // If no tool calls, Barry has final answer
    if (!message.tool_calls || message.tool_calls.length === 0) {
      console.log(`✅ Final response received (no more tool calls)`);
      return {
        content: message.content,
        toolCalls: allToolCalls,
        usage: data.usage
      };
    }

    // Execute tool calls
    console.log(`🔧 Barry requested ${message.tool_calls.length} tool calls`);

    // Add assistant message with tool calls to conversation
    conversationMessages.push({
      role: 'assistant',
      content: message.content || null,
      tool_calls: message.tool_calls
    });

    // Execute each tool call and add results
    for (const toolCall of message.tool_calls) {
      const toolName = toolCall.function.name;
      const toolArgs = JSON.parse(toolCall.function.arguments);

      console.log(`   Tool: ${toolName}, Args: ${JSON.stringify(toolArgs)}`);

      // Execute tool
      const toolResult = await executeToolCall(toolName, toolArgs, userId, supabase);

      // Track tool calls for response metadata
      allToolCalls.push({
        tool: toolName,
        args: toolArgs,
        result: JSON.parse(toolResult)
      });

      // Add tool result to conversation
      conversationMessages.push({
        role: 'tool',
        tool_call_id: toolCall.id,
        content: toolResult
      });

      console.log(`   Result: ${toolResult.substring(0, 100)}...`);
    }

    // Loop continues - Barry will process tool results and either call more tools or give final answer
  }

  // If we hit max loops, return what we have
  console.log(`⚠️ Max loops reached (${MAX_LOOPS})`);
  return {
    content: "I'm having trouble processing this request. Please try asking in a different way.",
    toolCalls: allToolCalls,
    usage: { total_tokens: 0 }
  };
}

// =============================================================================
// EXISTING HELPER FUNCTIONS (used by tool handlers above)
// =============================================================================

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

    // Priority-based threshold: high priority entries need fewer matches
    for (const entry of entries) {
      const matchedKeywords = entry.question_keywords.filter((keyword: string) => {
        const keywordLower = keyword.toLowerCase();
        const queryLower = userQuery.toLowerCase();

        // Check if entire keyword phrase appears in query (for multi-word keywords)
        if (keywordLower.includes(' ') && queryLower.includes(keywordLower)) {
          return true;
        }

        // Check if any query word matches this keyword (exact or fuzzy)
        return queryWords.some(word => {
          // Exact match (substring)
          if (word.includes(keywordLower) || keywordLower.includes(word)) {
            return true;
          }

          // Fuzzy match for typos (80% similarity threshold)
          // Only check similar length words to avoid false positives
          if (Math.abs(word.length - keywordLower.length) <= 2) {
            const similarity = stringSimilarity(word, keywordLower);
            if (similarity >= 0.8) {
              console.log(`🔍 Fuzzy match: "${word}" ≈ "${keywordLower}" (${(similarity * 100).toFixed(0)}%)`);
              return true;
            }
          }

          return false;
        });
      });

      // High priority entries (8+) need only 1 match, others need 2
      const threshold = entry.priority >= 8 ? 1 : 2;

      if (matchedKeywords.length >= threshold) {
        console.log(`📚 Knowledge base match (priority ${entry.priority}, ${matchedKeywords.length} keywords): ${matchedKeywords.join(', ')}`);
        return { found: true, entry };
      }
    }

    return { found: false, entry: null };
  } catch (error) {
    console.error('❌ Error querying knowledge base:', error);
    return { found: false, entry: null };
  }
}

// Format knowledge base entry for RAG context injection
function formatKnowledgeEntry(entry: any): string {
  let context = '\n\n=== CURATED KNOWLEDGE BASE ENTRY ===\n';
  context += `Priority: ${entry.priority || 5}\n`;
  context += `Keywords: ${entry.question_keywords.join(', ')}\n\n`;

  if (entry.manual_references?.sources) {
    context += 'Knowledge Sources:\n';
    context += entry.manual_references.sources + '\n\n';
  }

  if (entry.manual_references?.attachments && entry.manual_references.attachments.length > 0) {
    context += 'Available Technical Documents:\n';
    entry.manual_references.attachments.forEach((att: any) => {
      context += `- ${att.filename} (${att.file_type.toUpperCase()}) - ${(att.file_size / 1024).toFixed(1)}KB\n`;
    });
    context += '\nIMPORTANT: Inform the user that these technical documents are available for download. Mention them naturally in your response.\n\n';
  }

  context += 'RECOMMENDED RESPONSE TEMPLATE:\n';
  context += entry.barry_response_template + '\n\n';
  context += 'Use the above template as guidance, but adapt naturally to the user\'s specific question.\n';
  context += 'If sources are provided, mention them naturally in your response (e.g., "Based on discussions in...").\n';
  context += '=== END CURATED KNOWLEDGE ===\n\n';

  return context;
}

// Parse manual references from knowledge base entry
function parseManualReferencesFromKnowledge(manualRefs: any): any[] {
  if (!manualRefs || typeof manualRefs !== 'object') {
    return [];
  }

  const results: any[] = [];

  // Handle format: {"manual": "G604", "pages": [23, 24], "sections": ["Brake System"]}
  if (manualRefs.manual && manualRefs.pages && Array.isArray(manualRefs.pages)) {
    for (const page of manualRefs.pages) {
      results.push({
        name: manualRefs.manual,
        page_number: page,
        section: manualRefs.sections ? manualRefs.sections.join(' - ') : '',
        content: `See ${manualRefs.manual}, Page ${page}`,
        relevance_score: 1.0 // Max relevance for curated entries
      });
    }
  }

  return results;
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

// Extract search terms from user query using AI (intelligent search)
async function extractSearchTerms(userQuery: string): Promise<string[]> {
  if (!OPENAI_API_KEY) {
    // Fallback: basic keyword extraction
    return userQuery.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  }

  try {
    const extractionPrompt = `Extract 3-5 key technical search terms from this Unimog repair question.
Return ONLY a JSON array of search terms, no explanation.

Question: "${userQuery}"

Examples:
- "how do I lift the cab" → ["cab removal", "cab structure", "lifting cab", "cab disassembly"]
- "replace radiator" → ["radiator replacement", "cooling system", "radiator removal"]
- "bleed brakes" → ["brake bleeding", "brake system", "hydraulic brakes"]

Return format: ["term1", "term2", "term3"]`;

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: extractionPrompt }],
        temperature: 0.3,
        max_tokens: 100
      })
    });

    if (!response.ok) {
      console.error('❌ Term extraction failed, using fallback');
      return [userQuery]; // Fallback to original query
    }

    const data = await response.json();
    const content = data.choices[0].message.content.trim();
    const terms = JSON.parse(content);

    console.log(`🧠 AI extracted search terms: ${terms.join(', ')}`);
    return Array.isArray(terms) ? terms : [userQuery];

  } catch (error) {
    console.error('❌ Term extraction error:', error);
    return [userQuery]; // Fallback to original query
  }
}

// Execute manual search using manual_index (beacon of truth)
async function searchManuals(query: string, maxResults: number, supabase: any): Promise<any[]> {
  console.log(`🔍 Starting intelligent manual search for: "${query}"`);

  try {
    // Step 1: Extract intelligent search terms using AI
    const searchTerms = await extractSearchTerms(query);

    // Step 2: Search manual_index with each term and combine results
    const allResults: any[] = [];
    const seenIds = new Set();

    for (const term of searchTerms) {
      console.log(`📍 Searching manual_index for: "${term}"`);
      const { data: indexResults, error: indexError } = await supabase.rpc('search_manual_index', {
        user_query: term,
        max_results: 5
      });

      if (!indexError && indexResults && indexResults.length > 0) {
        // Deduplicate results
        for (const result of indexResults) {
          if (!seenIds.has(result.id)) {
            seenIds.add(result.id);
            allResults.push(result);
          }
        }
      }
    }

    if (allResults.length > 0) {
      console.log(`✅ Found ${allResults.length} unique results across ${searchTerms.length} terms`);
      return allResults.slice(0, maxResults); // Limit to maxResults
    }

    console.log('📭 No results found - Barry will refuse to guess');
    return [];

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

// Helper: Extract meaningful keywords from search term
function extractKeywords(term: string): string[] {
  // Remove common filler words that don't add search value
  const fillerWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'how', 'do', 'i', 'my'];

  // Split term into words, filter out fillers, convert to lowercase
  const keywords = term
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 2 && !fillerWords.includes(word));

  return [...new Set(keywords)]; // Remove duplicates
}

// Helper: Extract manual context from chapter filename or manual title
function extractManualContext(ref: any): string[] {
  const context: string[] = [];

  // Extract model numbers (U435, U1700L, etc.)
  if (ref.chapter_filename) {
    const modelMatch = ref.chapter_filename.match(/U\d+[A-Z]?/gi);
    if (modelMatch) context.push(...modelMatch);
  }

  if (ref.manual_title) {
    const modelMatch = ref.manual_title.match(/U\d+[A-Z]?/gi);
    if (modelMatch) context.push(...modelMatch);
  }

  return [...new Set(context)]; // Remove duplicates
}

// TWO-PASS RAG: Fetch snippets from manual_chunks for verification
async function fetchManualSnippets(pageReferences: any[], supabase: any): Promise<any[]> {
  console.log(`📖 Fetching snippets for ${pageReferences.length} candidate pages...`);

  const snippets = [];

  for (const ref of pageReferences) {
    try {
      // STRATEGY 1: Match by page number in big manual (not chapter PDF page!)
      // Index has: page_number (555 in big manual), pdf_page_number (1 in chapter PDF)
      // manual_chunks has page_number (555)
      let { data, error } = await supabase
        .from('manual_chunks')
        .select('id, content, manual_title, page_number, section_title')
        .ilike('manual_title', '%U1700L%U435%')  // Match the actual big manual
        .eq('page_number', ref.page_number)      // Use page_number (555), NOT pdf_page_number (1)!
        .limit(1)
        .single();

      // STRATEGY 2: Smart keyword search with manual context
      // (Handles terminology mismatch: "front portal hub seals" vs "wheel hub drive")
      if (error && ref.term) {
        console.log(`🔄 Filename match failed for ${ref.chapter_filename}, trying smart keyword search...`);

        // Extract meaningful keywords from term
        const keywords = extractKeywords(ref.term);
        console.log(`  📝 Extracted keywords: [${keywords.join(', ')}]`);

        // Extract manual context (model numbers)
        const manualContext = extractManualContext(ref);

        // Build query for keyword combination search
        let query = supabase
          .from('manual_chunks')
          .select('id, content, manual_title, page_number, section_title');

        // Add manual context filter if available (U435, U1700L, etc.)
        if (manualContext.length > 0) {
          const contextPattern = manualContext.join('|');
          query = query.or(`manual_title.ilike.%${manualContext[0]}%`);
          console.log(`  🎯 Using manual context: ${manualContext.join(', ')}`);
        }

        // Search for content containing ALL keywords (not exact phrase)
        for (const keyword of keywords) {
          query = query.ilike('content', `%${keyword}%`);
        }

        const { data: keywordData, error: keywordError } = await query
          .limit(5); // Get top 5 matches, not just 1

        if (!keywordError && keywordData && keywordData.length > 0) {
          // Pick the first result (closest match)
          data = keywordData[0];
          error = null;
          console.log(`✅ Found via keyword search: [${keywords.join(' + ')}] in ${data.manual_title} p.${data.page_number}`);
          console.log(`  📄 Content preview: ${data.content.substring(0, 100)}...`);
        } else {
          console.log(`  ❌ No results for keyword combination: [${keywords.join(' + ')}]`);
        }
      }

      if (!error && data) {
        snippets.push({
          ...ref,
          snippet: data.content.substring(0, 200) + '...',
          chunk_id: data.id,
          section_title: data.section_title,
          actual_page_number: data.page_number,  // Store the actual page found
          actual_manual_title: data.manual_title  // Store the actual manual found
        });
      }
    } catch (err) {
      console.log(`⚠️ Could not fetch snippet for ${ref.chapter_filename} / "${ref.term}"`);
    }
  }

  console.log(`✅ Retrieved ${snippets.length} snippets from manual_chunks (${pageReferences.length} candidates)`);
  return snippets;
}

// TWO-PASS RAG: AI verifies snippet relevance to user query
async function verifySnippetRelevance(query: string, snippets: any[]): Promise<any[]> {
  if (!snippets || snippets.length === 0) {
    return [];
  }

  if (!OPENAI_API_KEY) {
    console.log('⚠️ OpenAI API not configured, skipping snippet verification');
    return snippets.slice(0, 5); // Fallback: return first 5
  }

  try {
    console.log(`🔍 AI verifying relevance of ${snippets.length} snippets...`);

    const snippetText = snippets.map((s, i) =>
      `${i}. ${s.chapter_filename} p.${s.pdf_page_number}: "${s.snippet}"`
    ).join('\n\n');

    const verifyPrompt = `Rate how relevant each snippet is to answering this user question.
Return ONLY a JSON array of scores (0.0 to 1.0), one for each snippet.

User Question: "${query}"

Snippets:
${snippetText}

Return format: [0.95, 0.12, 0.78, ...]`;

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: verifyPrompt }],
        temperature: 0.1,
        max_tokens: 200
      })
    });

    if (!response.ok) {
      console.error('❌ Snippet verification failed, defaulting to keeping all snippets');
      // On API error, assume all snippets are relevant (better than rejecting valid content)
      return snippets.map(s => ({ ...s, relevance_score: 1.0 })).slice(0, 5);
    }

    const data = await response.json();
    const scores = JSON.parse(data.choices[0].message.content);

    if (!Array.isArray(scores) || scores.length !== snippets.length) {
      console.error('❌ Invalid verification scores, defaulting to keeping all snippets');
      // On parsing error, assume all snippets are relevant
      return snippets.map(s => ({ ...s, relevance_score: 1.0 })).slice(0, 5);
    }

    // Add relevance scores and filter
    const verified = snippets
      .map((s, i) => ({ ...s, relevance_score: scores[i] }))
      .filter(s => s.relevance_score > 0.5)  // Lowered from 0.6 to 0.5 (less aggressive filtering)
      .sort((a, b) => b.relevance_score - a.relevance_score)
      .slice(0, 5);  // Top 5 verified pages

    console.log(`✅ Verified ${verified.length} relevant pages (from ${snippets.length} candidates)`);
    console.log(`  📊 Relevance scores: ${verified.map(v => v.relevance_score.toFixed(2)).join(', ')}`);
    return verified;

  } catch (error) {
    console.error('❌ Snippet verification error:', error);
    // On error, assume all snippets are relevant (better than rejecting valid content)
    return snippets.map(s => ({ ...s, relevance_score: 1.0 })).slice(0, 5);
  }
}

// TWO-PASS RAG: Fetch full content for verified relevant pages
async function fetchFullManualContent(verifiedPages: any[], supabase: any): Promise<any[]> {
  console.log(`📚 Fetching full content for ${verifiedPages.length} verified pages...`);

  const fullContent = [];

  for (const page of verifiedPages) {
    try {
      const { data, error } = await supabase
        .from('manual_chunks')
        .select('content, manual_title, page_number, section_title')
        .eq('id', page.chunk_id)
        .single();

      if (!error && data) {
        fullContent.push({
          ...page,
          full_content: data.content,
          section_title: data.section_title || page.section_title
        });
      }
    } catch (err) {
      console.log(`⚠️ Could not fetch full content for chunk ${page.chunk_id}`);
    }
  }

  console.log(`✅ Retrieved full content for ${fullContent.length} pages`);
  return fullContent;
}

// Format manual results for context injection (RAG approach with ACTUAL CONTENT)
function formatManualResultsForContext(results: any[]): string {
  if (!results || results.length === 0) {
    return '';
  }

  let formatted = '\n\n=== MANUAL PAGES (READ THESE - BUILD YOUR RESPONSE FROM THIS CONTENT) ===\n\n';

  results.forEach((result, idx) => {
    formatted += `[PAGE ${idx + 1}] ${result.chapter_filename} - Page ${result.pdf_page_number}\n`;

    if (result.section_title) {
      formatted += `Section: ${result.section_title}\n`;
    }

    if (result.relevance_score) {
      formatted += `Relevance: ${(result.relevance_score * 100).toFixed(0)}% match to user question\n`;
    }

    if (result.has_safety_warning) {
      formatted += `⚠️ SAFETY WARNING: This procedure requires caution\n`;
    }

    formatted += '\n--- PAGE CONTENT ---\n';

    // Inject ACTUAL page content (this is the key RAG improvement!)
    if (result.full_content) {
      formatted += result.full_content + '\n';
    } else {
      // Fallback if full_content not available (shouldn't happen in two-pass RAG)
      formatted += `${result.term} (${result.system_category || 'general'})\n`;
    }

    formatted += '--- END PAGE CONTENT ---\n\n';
  });

  formatted += '=== END MANUAL PAGES ===\n\n';
  formatted += 'CRITICAL INSTRUCTIONS:\n';
  formatted += '1. Build your response FROM the actual page content above\n';
  formatted += '2. Focus on the TOP 2-3 most relevant pages (highest relevance scores)\n';
  formatted += '3. Cite page numbers when referencing procedures\n';
  formatted += '4. If content doesn\'t answer the question, say you don\'t have that information\n';

  return formatted;
}

// Convert manual results to frontend format
function convertToManualReferences(results: any[]): any[] {
  return results.map(item => ({
    type: 'u435_optimized_index',
    title: item.term || 'Manual Entry',
    page_number: item.pdf_page_number || item.page_number || 0,  // v79: Fixed - frontend expects page_number
    original_page: item.page_number || 0,
    pdf_page: item.pdf_page_number || 0,
    storage_url: item.storage_url || '',
    chapter_filename: item.chapter_filename || '',
    filename: item.chapter_filename || '',  // v79: Added for PDF viewer
    section_title: item.system_category || '',  // v79: Added for tooltip
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

    // ===================================================================
    // AGENTIC BARRY - Function Calling Architecture
    // Barry decides which tools to call based on the user's question
    // ===================================================================
    console.log('🤖 Initializing Agentic Barry with function calling...');

    try {
      // Call agentic loop - Barry will use tools as needed
      const result = await agenticBarryLoop(
        messages,
        userContext,
        locationContext,
        user.id,
        supabaseAdmin
      );

      // Extract data from tool calls for frontend display
      let allManualReferences: any[] = [];
      let knowledgeMode = 'agentic_function_calling';
      let knowledgeSources: string | null = null;
      let knowledgeAttachments: any[] = [];

      // Process tool calls to extract manual references and attachments
      for (const toolCall of result.toolCalls) {
        if (toolCall.tool === 'search_curated_knowledge' && toolCall.result.found) {
          knowledgeMode = 'curated_knowledge';
          knowledgeSources = toolCall.result.sources;
          knowledgeAttachments = toolCall.result.attachments || [];
        }

        if (toolCall.tool === 'search_manuals' && toolCall.result.found) {
          // Convert manual pages to reference format
          const pages = toolCall.result.pages || [];
          for (const page of pages) {
            allManualReferences.push({
              manual: page.manual,
              page: page.page_in_manual,
              section: page.section,
              similarity: page.relevance
            });
          }

          // Update mode if not already set to curated
          if (knowledgeMode === 'agentic_function_calling') {
            knowledgeMode = 'two_pass_rag_verified';
          }
        }
      }

      // Log what Barry used
      const toolsSummary = result.toolCalls.map(t => t.tool).join(', ');
      console.log(`✅ Barry used tools: ${toolsSummary || 'none'}`);
      console.log(`📊 Knowledge mode: ${knowledgeMode}`);
      console.log(`📚 Manual references: ${allManualReferences.length}`);

      // Return successful response
      return new Response(JSON.stringify({
        content: result.content,
        manualReferences: convertToManualReferences(allManualReferences),
        knowledgeMode: knowledgeMode,
        knowledgeSources: knowledgeSources,
        attachments: knowledgeAttachments,
        searchResultCount: allManualReferences.length,
        usage: result.usage,
        toolCalls: result.toolCalls.map(t => ({ tool: t.tool, args: t.args })) // Debug info
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });

    } catch (error) {
      console.error('❌ Agentic Barry error:', error);
      return new Response(JSON.stringify({
        error: 'Failed to process request with Barry',
        details: error instanceof Error ? error.message : 'Unknown error'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
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
