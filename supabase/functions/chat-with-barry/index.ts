// Barry Edge Function - RAG Context Injection with TWO-PASS VERIFICATION
// Version: 83 - Content-Based Fallback for Mismatched Identifiers
// Date: 2025-10-09
//
// Latest Changes (v83):
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

const OPENAI_API_KEY = <OPENAI_API_KEY>
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Barry's core personality and rules (RAG-powered)
const BARRY_SYSTEM_PROMPT = `You are Barry, a gruff but brilliant Unimog mechanic with 40+ years of hands-on experience.

CRITICAL SAFETY RULES (NEVER BREAK THESE - USER SAFETY DEPENDS ON IT):

1. For technical/mechanical Unimog questions:
   - If manual sections are provided below, you MUST use them
   - Cite the manual name, section, and page numbers
   - NEVER make up procedures or specifications
   - If manuals don't have the answer, REFUSE to give generic advice

2. NEVER guess procedures, torque specs, or make up technical information
3. Generic mechanical advice is DANGEROUS and could cause injury or death
4. Better to say "I don't know" than risk user getting hurt
5. When you cite manuals, ALWAYS include: Manual name, Section/Chapter, Page number

Your personality:
- Gruff but caring - you don't suffer fools but you want to help
- Direct and no-nonsense - get to the point
- SAFETY-FIRST - you've seen too many people get hurt from bad advice
- Experienced - but you know experience doesn't replace proper documentation
- Manual-focused - "The manual exists for a reason - it could save your life, kid"

Remember: USER SAFETY IS MORE IMPORTANT THAN BEING HELPFUL. If manuals don't have it, REFUSE to improvise.`;

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

// TWO-PASS RAG: Fetch snippets from manual_chunks for verification
async function fetchManualSnippets(pageReferences: any[], supabase: any): Promise<any[]> {
  console.log(`📖 Fetching snippets for ${pageReferences.length} candidate pages...`);

  const snippets = [];

  for (const ref of pageReferences) {
    try {
      // STRATEGY 1: Try matching by chapter filename
      let { data, error } = await supabase
        .from('manual_chunks')
        .select('id, content, manual_title, page_number, section_title')
        .ilike('manual_title', `%${ref.chapter_filename}%`)
        .eq('page_number', ref.pdf_page_number)
        .limit(1)
        .single();

      // STRATEGY 2: Content-based fallback when filename doesn't match
      // (Handles cases like chapter PDFs vs complete manual with different page numbering)
      if (error && ref.term) {
        console.log(`🔄 Filename match failed for ${ref.chapter_filename}, trying content-based search...`);

        const { data: contentData, error: contentError } = await supabase
          .from('manual_chunks')
          .select('id, content, manual_title, page_number, section_title')
          .ilike('content', `%${ref.term}%`)
          .limit(1)
          .single();

        if (!contentError && contentData) {
          data = contentData;
          error = null;
          console.log(`✅ Found content via term search: "${ref.term}" in ${contentData.manual_title} p.${contentData.page_number}`);
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
      console.error('❌ Snippet verification failed');
      return snippets.slice(0, 5); // Fallback
    }

    const data = await response.json();
    const scores = JSON.parse(data.choices[0].message.content);

    if (!Array.isArray(scores) || scores.length !== snippets.length) {
      console.error('❌ Invalid verification scores');
      return snippets.slice(0, 5); // Fallback
    }

    // Add relevance scores and filter
    const verified = snippets
      .map((s, i) => ({ ...s, relevance_score: scores[i] }))
      .filter(s => s.relevance_score > 0.6)  // Only keep verified relevant
      .sort((a, b) => b.relevance_score - a.relevance_score)
      .slice(0, 5);  // Top 5 verified pages

    console.log(`✅ Verified ${verified.length} relevant pages (from ${snippets.length} candidates)`);
    return verified;

  } catch (error) {
    console.error('❌ Snippet verification error:', error);
    return snippets.slice(0, 5); // Fallback
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

    // RAG APPROACH: Search manuals FIRST, then inject into context
    console.log('🤖 Using RAG context injection approach...');

    let allManualReferences: any[] = [];
    let manualContext = '';

    // Step 1: Detect if this is a technical question
    const isTechnical = isTechnicalQuestion(lastUserMessage.content);
    console.log(`📊 Technical question detected: ${isTechnical}`);

    // Step 2: If technical, use TWO-PASS RAG (search → verify → read → inject)
    if (isTechnical) {
      console.log('🔍 Starting TWO-PASS RAG: Search → Verify → Read → Inject...');

      // PASS 1: Search & Snippet Verification
      const searchResults = await searchManuals(lastUserMessage.content, 15, supabaseAdmin);

      if (searchResults && searchResults.length > 0) {
        console.log(`📋 Found ${searchResults.length} candidate pages from manual_index`);

        // Fetch snippets from manual_chunks for verification
        const snippets = await fetchManualSnippets(searchResults, supabaseAdmin);

        if (snippets.length > 0) {
          // AI verifies which snippets are actually relevant
          const verifiedPages = await verifySnippetRelevance(lastUserMessage.content, snippets);

          if (verifiedPages.length > 0) {
            console.log(`✅ ${verifiedPages.length} pages verified as relevant`);

            // PASS 2: Fetch full content for verified pages
            const fullContent = await fetchFullManualContent(verifiedPages, supabaseAdmin);

            if (fullContent.length > 0) {
              // Store for frontend PDF viewer (only verified pages)
              allManualReferences = fullContent;

              // Inject ACTUAL page content into RAG context
              manualContext = formatManualResultsForContext(fullContent);
              console.log(`✅ Injected ${fullContent.length} verified pages with FULL CONTENT into context`);
            } else {
              console.log('⚠️ Could not fetch full content for verified pages');
              manualContext = '\n\nNOTE: No readable manual content found. You must tell the user you couldn\'t find this procedure in the manuals and suggest consulting a certified technician.\n\n';
            }
          } else {
            console.log('📭 No snippets verified as relevant');
            manualContext = '\n\nNOTE: No relevant manual sections found. You must tell the user you couldn\'t find this procedure in the manuals and suggest consulting a certified technician.\n\n';
          }
        } else {
          console.log('⚠️ Could not fetch snippets from manual_chunks');
          manualContext = '\n\nNOTE: Manual content unavailable. You must tell the user you couldn\'t find this procedure in the manuals and suggest consulting a certified technician.\n\n';
        }
      } else {
        console.log('📭 No manual results found in initial search');
        manualContext = '\n\nNOTE: No relevant manual sections found. You must tell the user you couldn\'t find this procedure in the manuals and suggest consulting a certified technician.\n\n';
      }
    }

    // Step 3: Build system prompt with injected context
    const systemPrompt = BARRY_SYSTEM_PROMPT + manualContext + '\n\n' + userContext + locationContext;

    // Step 4: Call OpenAI with NO function calling (context already injected)
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
        temperature: 0.7,
        max_tokens: 800
      })
    });

    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text();
      console.error('❌ OpenAI API error:', errorText);
      return new Response(JSON.stringify({
        error: 'Failed to get response from AI',
        details: errorText
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const data = await openAIResponse.json();
    const finalContent = data.choices[0].message.content;

    // Log the chat
    await supabaseClient.from('chat_logs').insert({
      user_id: user.id,
      messages: messages,
      response: finalContent,
      model: 'gpt-4o-two-pass-rag-v83',  // v83: Content-based fallback for mismatched identifiers
      tokens_used: data.usage?.total_tokens || 0,
      knowledge_source: allManualReferences.length > 0 ? 'two_pass_rag_verified' : 'general_ai',
      has_location: !!location,
      routing_rule: 'two_pass_rag_verification',
      routing_match: isTechnical ? 'technical_verified_pages' : 'general',
      pdf_references_found: allManualReferences.length
    });

    return new Response(JSON.stringify({
      content: finalContent,
      manualReferences: convertToManualReferences(allManualReferences),
      knowledgeMode: allManualReferences.length > 0 ? 'two_pass_rag_verified' : 'general_ai',
      searchResultCount: allManualReferences.length,
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
