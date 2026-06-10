// DEPRECATED: superseded by barry-tools (Phase 3, 2026-04-26). Retain for emergency rollback only.
/**
 * Barry OpenClaw Edge Function
 * Skill-based architecture for Barry AI with guardrails
 *
 * Architecture: Context Gatherers -> Single LLM Call -> Response Validation
 *
 * Skill Chain:
 * 1. Domain Guard - Block off-topic/dangerous queries
 * 2. Knowledge Lookup - Check validated KB for instant answers
 * 2.5. Query Expander - Expand user terms to technical terminology (Phase 1)
 * 3. Manual Search + RPS Search + EPC Parts Search - Gather context (parallel)
 * 4. Response Generator - Generate cited response with OEM part numbers
 * 5. Safety Filter - Add disclaimers if needed
 * 6. Response Validator - Validate citations exist
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform',
};

// Configuration — DEPRECATED: use DEEPSEEK_API_KEY if needed for rollback
const DEEPSEEK_API_KEY = Deno.env.get('DEEPSEEK_API_KEY');
const DEEPSEEK_MODEL = Deno.env.get('DEEPSEEK_MODEL') || 'deepseek-chat';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// Barry persona prompt
const BARRY_PERSONA = `You are Barry, a gruff but friendly Unimog mechanic with 40+ years of experience. You've worked on everything from U404s to modern U5000s, but your specialty is the U435 series (U1300L, U1700L, and related models).

Your personality:
- Practical and direct - you don't waste words
- Helpful but realistic about what DIY mechanics can tackle
- You use proper technical terms but explain them when needed
- You always emphasize safety
- You have stories from decades of Unimog work but keep them brief

CRITICAL RULES:
1. ALWAYS cite specific page numbers when giving technical advice
2. ALWAYS recommend proper safety precautions
3. If you're not sure about something, say so - don't guess on safety-critical specs
4. Keep responses focused on the specific question asked
5. When showing exploded views or diagrams, use markdown image syntax`;

// Blocked topics for safety
// Each entry must describe a genuinely dangerous action, not routine maintenance.
// Routine procedures (remove fuel filter, change brakes) pass through with safety disclaimers.
const BLOCKED_TOPICS = [
  'disable safety systems',
  'bypass brake system',
  'permanently disable brake',
  'remove airbag',
  'modify emissions control',
  'defeat emissions',
  'skip torque specifications',
  'disable abs permanently',
  'bypass seatbelt interlock',
  'remove roll cage',
  'disable pto safety switch',
  'bypass hydraulic safety',
  'disable exhaust brake permanently',
  'remove safety guard',
  'bypass safety interlock',
  'defeat safety system'
];

// Technical keywords for domain detection
const TECHNICAL_KEYWORDS = new Set([
  'unimog', 'u435', 'u1300', 'u1300l', 'u1700', 'u1700l',
  'u404', 'u416', 'u900', 'u1000', 'u1400', 'u1550', 'u1600', 'u1800', 'u1850', 'u2150', 'u2450', 'u3000', 'u4000', 'u4023', 'u5000', 'u5023',
  'portal', 'hub', 'axle', 'differential', 'transfer', 'gearbox',
  'torque', 'spec', 'specification', 'capacity', 'fluid',
  'oil', 'change', 'drain', 'fill', 'level',
  'brake', 'clutch', 'steering', 'suspension',
  'engine', 'turbo', 'turbocharger', 'injector', 'fuel',
  'pto', 'driveline', 'driveshaft',
  'seal', 'bearing', 'gasket', 'filter',
  'remove', 'install', 'replace', 'adjust', 'repair',
  'diagram', 'exploded', 'view', 'illustration', 'schematic',
  'part', 'number', 'niin', 'nsn', 'rps', 'epc', 'oem',
  'manual', 'workshop', 'procedure', 'steps',
  'ecu', 'can-bus', 'canbus', 'obd', 'diagnostic', 'fault', 'sensor',
  'edc', 'abs', 'module', 'relay', 'fuse', 'wiring', 'harness',
  'alternator', 'starter', 'voltage', 'ampere', 'connector'
]);

// Safety disclaimers
const SAFETY_DISCLAIMERS: Record<string, string> = {
  brake_work: 'Always use jack stands and chock wheels before working under vehicle.',
  electrical: 'Disconnect battery before electrical work. Wait 5 minutes for capacitors to discharge.',
  lifting: 'Never exceed rated capacity of lifting equipment. Use proper jack points.',
  hydraulic: 'Release hydraulic pressure before disconnecting lines. Use proper safety glasses.',
  pto: 'Ensure PTO is disengaged and vehicle is in neutral before maintenance.',
  fuel_system: 'Work in well-ventilated area. No smoking or open flames.'
};

/**
 * Strip context prefix brackets from user message to get clean search query.
 * Frontend prepends [Vehicle: ...] [Context: ...] which pollutes search.
 * Returns { cleanQuery, contextPrefix } so context can be passed to LLM separately.
 */
function stripContextPrefix(query: string): { cleanQuery: string; contextPrefix: string } {
  let remaining = query.trim();
  let contextPrefix = '';

  // Extract all [...] prefixes from the start of the message
  while (remaining.startsWith('[')) {
    const closeBracket = remaining.indexOf(']');
    if (closeBracket === -1) break;
    contextPrefix += remaining.substring(0, closeBracket + 1) + ' ';
    remaining = remaining.substring(closeBracket + 1).trim();
  }

  return {
    cleanQuery: remaining || query, // Fallback to original if nothing left
    contextPrefix: contextPrefix.trim()
  };
}

/**
 * Convert manual_title to storage filename.
 * manual_title: "G603 Unimog all types Light Repair"
 * storage name: "G603-Unimog-all-types-Light-Repair.pdf"
 */
function manualTitleToFilename(manualTitle: string): string {
  if (!manualTitle) return '';
  return manualTitle.replace(/\s+/g, '-') + '.pdf';
}

/**
 * Build storage URL for a manual chunk.
 * Only returns a URL if the PDF file actually exists in storage.
 * Pass availablePdfs set from getAvailablePdfFiles() to verify.
 */
function buildManualStorageUrl(manualTitle: string, pageNumber: number, availablePdfs?: Set<string>): string {
  const filename = manualTitleToFilename(manualTitle);
  if (!filename) return '';
  // If we have the availability set, only build URL for files that exist
  if (availablePdfs && !availablePdfs.has(filename)) {
    console.log(`[PDF] Skipping URL for missing file: ${filename}`);
    return '';
  }
  return `${SUPABASE_URL}/storage/v1/object/public/manuals/${filename}#page=${pageNumber}`;
}

/**
 * Query storage.objects to get set of available PDF filenames in manuals bucket.
 * Returns Set of filenames like "G603-Unimog-all-types-Light-Repair.pdf"
 */
async function getAvailablePdfFiles(supabaseAdmin: any): Promise<Set<string>> {
  try {
    const { data, error } = await supabaseAdmin
      .from('storage.objects')
      .select('name')
      .eq('bucket_id', 'manuals')
      .like('name', '%.pdf');

    if (error) {
      // Fallback: try listing via storage API
      const { data: listData, error: listError } = await supabaseAdmin.storage
        .from('manuals')
        .list('', { limit: 200 });

      if (listError || !listData) {
        console.warn('[PDF] Could not list storage files:', listError?.message || 'no data');
        return new Set();
      }
      return new Set(listData.map((f: any) => f.name).filter((n: string) => n.endsWith('.pdf')));
    }

    return new Set((data || []).map((row: any) => row.name));
  } catch (err) {
    console.warn('[PDF] Error querying available files:', err);
    return new Set();
  }
}

// Safety disclaimer triggers
const SAFETY_TRIGGERS: Record<string, string[]> = {
  brake_work: ['brake', 'brakes', 'caliper', 'brake pad', 'brake fluid'],
  electrical: ['electrical', 'wiring', 'battery', 'alternator', 'fuse'],
  lifting: ['lift', 'jack', 'hoist', 'raise', 'jack stand'],
  hydraulic: ['hydraulic', 'power steering', 'clutch line'],
  pto: ['pto', 'power take-off', 'driveline'],
  fuel_system: ['fuel', 'diesel', 'injector', 'fuel pump']
};

// ============ SECURITY GUARDRAILS ============
const MAX_QUERY_LENGTH = 2000;  // Max characters per query
const MAX_MESSAGES = 20;        // Max conversation history
const MAX_TOTAL_INPUT = 10000;  // Max total input size

// Prompt injection patterns to block
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|above|prior)\s+(instructions?|prompts?|rules?)/i,
  /disregard\s+(all\s+)?(previous|above|prior)/i,
  /you\s+are\s+now\s+/i,
  /new\s+instructions?:/i,
  /system\s*:\s*/i,
  /\[SYSTEM\]/i,
  /admin\s+override/i,
  /bypass\s+(security|filter|guard)/i,
  /pretend\s+you('re|\s+are)\s+/i,
  /act\s+as\s+(if|a)\s+/i,
  /roleplay\s+as/i,
  /jailbreak/i,
  /DAN\s+mode/i
];

// SQL injection patterns to sanitize
const SQL_INJECTION_PATTERNS = [
  /(['";])\s*(OR|AND)\s+\1/gi,
  /UNION\s+SELECT/gi,
  /DROP\s+TABLE/gi,
  /DELETE\s+FROM/gi,
  /INSERT\s+INTO/gi,
  /UPDATE\s+.*\s+SET/gi,
  /--\s*$/gm,
  /;\s*--/g
];

function sanitizeInput(input: string): string {
  let sanitized = input;
  // Remove potential SQL injection attempts
  for (const pattern of SQL_INJECTION_PATTERNS) {
    sanitized = sanitized.replace(pattern, '');
  }
  // Remove control characters
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  return sanitized.trim();
}

function detectPromptInjection(query: string): boolean {
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(query)) {
      console.warn('[Security] Prompt injection attempt detected');
      return true;
    }
  }
  return false;
}

function validateInputSize(messages: ChatMessage[], query: string): { valid: boolean; error?: string } {
  // Check query length
  if (query.length > MAX_QUERY_LENGTH) {
    return { valid: false, error: `Query too long. Maximum ${MAX_QUERY_LENGTH} characters.` };
  }

  // Check message count
  if (messages.length > MAX_MESSAGES) {
    return { valid: false, error: `Too many messages. Maximum ${MAX_MESSAGES} in conversation.` };
  }

  // Check total input size
  const totalSize = messages.reduce((sum, m) => sum + m.content.length, 0) + query.length;
  if (totalSize > MAX_TOTAL_INPUT) {
    return { valid: false, error: 'Total input too large. Please start a new conversation.' };
  }

  return { valid: true };
}

// Simple in-memory rate limiter (resets on function cold start)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 20; // 20 requests per minute per user

function checkRateLimit(userId: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const userLimit = rateLimitMap.get(userId);

  if (!userLimit || now > userLimit.resetTime) {
    // Reset or create new window
    rateLimitMap.set(userId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true };
  }

  if (userLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
    const retryAfter = Math.ceil((userLimit.resetTime - now) / 1000);
    return { allowed: false, retryAfter };
  }

  userLimit.count++;
  return { allowed: true };
}

// Types
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ManualReference {
  type: string;
  title: string;
  page_number: number;
  original_page: number;
  pdf_page: number;
  storage_url: string;
  chapter_filename?: string;
  manual_type: string;
  cdn_url?: string;
  content_preview?: string;
}

interface SkillExecutionContext {
  supabaseAdmin: any;
  userId: string;
  sessionId: string;
  startTime: number;
  executedSkills: string[];
}

// ============ SKILL 1: DOMAIN GUARD ============
function executeDomainGuard(query: string): {
  is_allowed: boolean;
  domain: 'technical' | 'general' | 'off_topic' | 'dangerous';
  task: string;
  redirect_message?: string;
} {
  const queryLower = query.toLowerCase();

  // Check for dangerous topics
  for (const topic of BLOCKED_TOPICS) {
    if (queryLower.includes(topic)) {
      return {
        is_allowed: false,
        domain: 'dangerous',
        task: 'other',
        redirect_message: `I can't help with requests that could compromise vehicle safety. Please consult a qualified mechanic.`
      };
    }
  }

  // Check for technical keywords
  const words = queryLower.split(/\s+/);
  const isTechnical = words.some(w => TECHNICAL_KEYWORDS.has(w));

  // Detect task type
  let task = 'other';
  if (/how\s+(?:do\s+i|to)\s+|procedure|steps?\s+for/i.test(query)) task = 'procedure';
  else if (/won't|wont|doesn't|noise|leak|vibration|problem/i.test(query)) task = 'troubleshoot';
  else if (/exploded\s+view|diagram|illustration|schematic/i.test(query)) task = 'exploded_view';
  else if (/part\s+number|niin|nsn|where\s+(?:can\s+i\s+)?(?:get|buy)/i.test(query)) task = 'parts_lookup';
  else if (/torque|capacity|spec(?:s|ification)/i.test(query)) task = 'specifications';

  if (isTechnical) {
    return { is_allowed: true, domain: 'technical', task };
  }

  return { is_allowed: true, domain: 'general', task };
}

// ============ SKILL 2: KNOWLEDGE BASE LOOKUP ============
async function executeKnowledgeLookup(
  supabaseAdmin: any,
  query: string
): Promise<{ found: boolean; content?: string; confidence?: number; manualReferences?: ManualReference[] }> {
  try {
    const stopWords = new Set([
      'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
      'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
      'should', 'may', 'might', 'must', 'shall', 'can',
      'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'as',
      'how', 'what', 'where', 'when', 'why', 'which', 'who', 'whom',
      'my', 'your', 'his', 'her', 'its', 'our', 'their',
      'i', 'me', 'you', 'he', 'she', 'it', 'we', 'they',
      'this', 'that', 'these', 'those', 'not', 'but', 'and', 'or'
    ]);
    const keywords = query.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2 && !stopWords.has(w));

    if (keywords.length === 0) return { found: false };

    // Threshold lowered to 0.5 to increase cache utilization (WHE-117)
    const { data: kbEntries, error } = await supabaseAdmin
      .from('barry_knowledge_base')
      .select('*')
      .gte('confidence_score', 0.5)
      .gte('validation_count', 1)
      .order('confidence_score', { ascending: false })
      .limit(20);

    if (error || !kbEntries?.length) return { found: false };

    // Find best match
    let bestMatch: any = null;
    let bestScore = 0;

    for (const entry of kbEntries) {
      const entryKeywords = (entry.question_keywords || []).map((k: string) => k.toLowerCase());
      let matches = 0;
      for (const qk of keywords) {
        if (entryKeywords.includes(qk)) matches++;
      }
      const score = matches / keywords.length;
      if (score > bestScore && score >= 0.5) {
        bestScore = score;
        bestMatch = entry;
      }
    }

    if (!bestMatch) return { found: false };

    console.log(`[KB] Found match: ${bestMatch.question_keywords.join(', ')}`);

    const refs = (bestMatch.manual_references || []).map((ref: any) => {
      let storageUrl = ref.storage_url || '';
      if (!storageUrl && ref.chapter_filename) {
        storageUrl = `${SUPABASE_URL}/storage/v1/object/public/manuals/${ref.chapter_filename}`;
      }
      return {
        type: 'knowledge_base',
        title: ref.manual_title || 'U435 Workshop Manual',
        page_number: ref.page_number || 0,
        original_page: ref.page_number || 0,
        pdf_page: ref.pdf_page || ref.page_number || 0,
        storage_url: storageUrl,
        chapter_filename: ref.chapter_filename,
        filename: ref.chapter_filename,
        manual_type: 'U435'
      };
    });

    return {
      found: true,
      content: bestMatch.barry_response_template,
      confidence: bestMatch.confidence_score,
      manualReferences: refs
    };
  } catch (error) {
    console.error('[KB] Error:', error);
    return { found: false };
  }
}

// ============ SKILL 3: MANUAL SEARCH ============
async function executeManualSearch(
  supabaseAdmin: any,
  query: string,
  maxResults: number = 10,
  expandedTerms?: string[]
): Promise<{ found: boolean; chunks: any[]; context: string }> {
  try {
    const stopWords = new Set([
      'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
      'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
      'should', 'may', 'might', 'must', 'shall', 'can',
      'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'as',
      'how', 'what', 'where', 'when', 'why', 'which', 'who', 'whom',
      'my', 'your', 'his', 'her', 'its', 'our', 'their',
      'i', 'me', 'you', 'he', 'she', 'it', 'we', 'they',
      'this', 'that', 'these', 'those', 'not', 'but', 'and', 'or',
      'about', 'tell', 'know', 'need', 'want', 'get', 'much', 'many'
    ]);
    const keywords = query.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2 && !stopWords.has(w));

    if (keywords.length === 0) return { found: false, chunks: [], context: '' };

    // Detect if query is asking for specifications/values
    const specTerms = ['torque', 'spec', 'specification', 'capacity', 'pressure', 'clearance', 'tolerance', 'weight', 'dimension', 'size', 'rating', 'limit', 'tension', 'tightening'];
    const isSpecQuery = keywords.some(k => specTerms.some(s => k.includes(s) || s.includes(k)));
    const componentTerms = keywords.filter(k => !specTerms.includes(k) && !['spec', 'specification', 'value', 'what'].includes(k));

    // Run FTS and targeted spec search in parallel
    const ftsPromise = supabaseAdmin
      .from('manual_chunks')
      .select('*')
      .textSearch('content', keywords.join(' & '), { type: 'websearch', config: 'english' })
      .limit(maxResults * 2);

    // Targeted ILIKE search for spec tables: find chunks containing the component name + numeric patterns
    // This catches dense spec tables that FTS ranks poorly
    let specPromise: Promise<any> = Promise.resolve({ data: null });
    if (isSpecQuery && componentTerms.length > 0) {
      // Stem simple plurals for ILIKE matching (e.g. "nuts" -> "nut" matches "Wheel nut")
      const stemmedTerms = componentTerms.map(t => t.replace(/s$/, ''));
      console.log(`[ManualSearch] Spec query detected, targeted ILIKE for: ${stemmedTerms.join(', ')}`);
      // Build chained ILIKE query - each component term must appear in content
      let specQuery = supabaseAdmin.from('manual_chunks').select('*');
      for (const term of stemmedTerms) {
        specQuery = specQuery.ilike('content', `%${term}%`);
      }
      specPromise = specQuery.limit(maxResults * 2);
    }

    const [ftsResponse, specResponse] = await Promise.all([ftsPromise, specPromise]);
    const ftsResults = ftsResponse.data || [];
    const specResults = specResponse.data || [];

    // Merge results: spec ILIKE hits get highest priority if they contain numeric values
    const seenIds = new Set<string>();
    let chunks: any[] = [];

    // Score and add spec results first (these are the ones FTS misses)
    if (specResults.length > 0) {
      const scoredSpec = specResults.map((chunk: any) => {
        const contentLower = (chunk.content || '').toLowerCase();
        let score = 0;
        // Must contain at least one component term
        for (const term of componentTerms) {
          if (contentLower.includes(term)) score += 1;
        }
        // Strongly boost chunks with actual numeric values (spec table pattern)
        if (/\d{2,4}\s*n[\.\s]*m/i.test(contentLower)) score += 5;
        if (/\bN\s*m\b/.test(chunk.content || '')) score += 5;
        if (/tightening\s+torque/i.test(contentLower)) score += 4;
        if (/\b\d{3,4}\b/.test(contentLower)) score += 2;
        // Boost if it looks like a spec table (multiple numbers on the page)
        const numCount = (contentLower.match(/\b\d{2,4}\b/g) || []).length;
        if (numCount >= 5) score += 3;
        return { ...chunk, _specScore: score };
      }).filter((c: any) => c._specScore >= 3);

      scoredSpec.sort((a: any, b: any) => b._specScore - a._specScore);
      for (const chunk of scoredSpec.slice(0, 5)) {
        if (!seenIds.has(chunk.id)) {
          seenIds.add(chunk.id);
          chunks.push(chunk);
        }
      }
      console.log(`[ManualSearch] Spec search: ${specResults.length} raw, ${chunks.length} scored above threshold`);
    }

    // Add FTS results (skip duplicates from spec search)
    for (const chunk of ftsResults) {
      if (!seenIds.has(chunk.id)) {
        seenIds.add(chunk.id);
        chunks.push(chunk);
      }
    }

    // Trim to maxResults
    chunks = chunks.slice(0, maxResults);

    // Fallback to ILIKE if FTS returns nothing - use OR logic with expanded terms
    if (chunks.length === 0) {
      const searchTerms = expandedTerms && expandedTerms.length > 1 ? expandedTerms : keywords;
      const useOrLogic = expandedTerms && expandedTerms.length > 1;

      if (useOrLogic) {
        // OR logic: find chunks matching ANY expanded term
        const allResults: any[] = [];
        const seenIds = new Set<string>();

        for (const term of searchTerms) {
          const cleanTerm = term.toLowerCase().trim();
          if (cleanTerm.length > 2) {
            const { data: termResults } = await supabaseAdmin
              .from('manual_chunks')
              .select('*')
              .ilike('content', `%${cleanTerm}%`)
              .limit(maxResults);

            if (termResults) {
              // Deduplicate by ID and add relevance score
              for (const chunk of termResults) {
                if (!seenIds.has(chunk.id)) {
                  seenIds.add(chunk.id);
                  const contentLower = chunk.content?.toLowerCase() || '';
                  let score = 0;
                  for (const searchTerm of searchTerms) {
                    if (contentLower.includes(searchTerm.toLowerCase())) score++;
                  }
                  allResults.push({ ...chunk, relevance_score: score / searchTerms.length });
                }
              }
            }
          }
        }

        chunks = allResults
          .sort((a: any, b: any) => b.relevance_score - a.relevance_score)
          .slice(0, maxResults);

      } else {
        // Original AND logic for backward compatibility
        const { data: ilikeResults } = await supabaseAdmin
          .from('manual_chunks')
          .select('*')
          .ilike('content', `%${keywords[0]}%`)
          .limit(maxResults);

        chunks = ilikeResults || [];
      }
    }

    if (chunks.length === 0) return { found: false, chunks: [], context: '' };

    // Build context string for Claude - include substantial content so Claude can reference it
    let context = '=== MANUAL CONTENT (Real data from U435 Workshop Manual) ===\n\n';
    chunks.forEach((chunk: any, i: number) => {
      context += `--- Page ${chunk.page_number}: ${chunk.section_title || 'Manual Entry'} ---\n`;
      context += `${chunk.content?.substring(0, 1500) || ''}\n\n`;
    });

    return { found: true, chunks, context };
  } catch (error) {
    console.error('[ManualSearch] Error:', error);
    return { found: false, chunks: [], context: '' };
  }
}

// ============ SKILL 4: RPS SEARCH ============
async function executeRPSSearch(
  supabaseAdmin: any,
  query: string,
  expandedTerms?: string[]
): Promise<{ found: boolean; illustrations: ManualReference[]; context: string }> {
  try {
    const queryLower = query.toLowerCase();

    // Detect component name
    let componentName: string | null = null;
    const componentMatch = queryLower.match(/(?:for|of)\s+(?:my\s+|the\s+)?([a-z\s]+?)(?:[,;.]|$)/);
    if (componentMatch?.[1]) {
      componentName = componentMatch[1].trim();
    }

    if (!componentName) {
      const match2 = queryLower.match(/(?:exploded view|illustration|diagram)\s+(?:of|for)\s+(?:the\s+)?([a-z\s]+)/);
      if (match2?.[1]) componentName = match2[1].trim();
    }

    if (!componentName) return { found: false, illustrations: [], context: '' };

    console.log(`[RPS] Searching for: ${componentName}`);

    // Component mappings
    const mappings: Record<string, string[]> = {
      'portal': ['WHEEL HUB DRIVES', 'PORTAL'],
      'portal hub': ['WHEEL HUB DRIVES', 'PORTAL'],
      'hub': ['WHEEL HUB', 'HUB DRIVES'],
      'front hub': ['WHEEL HUB DRIVES, FRONT'],
      'rear hub': ['WHEEL HUB DRIVES, REAR'],
      'turbo': ['TURBOCHARGER'],
      'turbocharger': ['TURBOCHARGER'],
      'differential': ['DIFFERENTIAL'],
      'pto': ['POWER TAKE-OFF', 'PTO'],
      'driveline': ['DRIVE LINE', 'DRIVELINE']
    };

    // Use expanded terms if available, otherwise use hardcoded mappings
    let searchTerms: string[];

    if (expandedTerms && expandedTerms.length > 1) {
      // Try each expanded term in addition to mapped terms
      const mappedTerms = mappings[componentName] || [componentName.toUpperCase()];
      searchTerms = [...expandedTerms, ...mappedTerms];
      console.log(`[RPS] Searching ${searchTerms.length} expanded terms: ${searchTerms.slice(0, 3).join(', ')}...`);
    } else {
      searchTerms = mappings[componentName] || [componentName.toUpperCase()];
    }

    for (const term of searchTerms) {
      const { data: groups } = await supabaseAdmin
        .from('rps_groups')
        .select('*')
        .ilike('group_name', `%${term}%`)
        .not('illustration_pages', 'is', null)
        .limit(1);

      if (groups?.length > 0) {
        const group = groups[0];
        const pages = group.illustration_pages || [];

        if (pages.length > 0) {
          const illustrations: ManualReference[] = pages.map((page: number) => ({
            type: 'rps_illustration',
            title: `RPS Page ${page} - ${group.group_name}`,
            page_number: page,
            original_page: page,
            pdf_page: page,
            storage_url: `https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/rps_illustrations/rps_page_${page.toString().padStart(4, '0')}.png`,
            cdn_url: `https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/rps_illustrations/rps_page_${page.toString().padStart(4, '0')}.png`,
            manual_type: 'RPS'
          }));

          let context = `\n=== RPS PARTS GROUP ===\n`;
          context += `Group: ${group.group_code} - ${group.group_name}\n`;
          context += `Exploded View Pages: ${pages.join(', ')}\n`;
          context += `\nDisplay these illustrations:\n`;
          pages.forEach((page: number) => {
            const url = `https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/rps_illustrations/rps_page_${page.toString().padStart(4, '0')}.png`;
            context += `![RPS Page ${page} - ${group.group_name}](${url})\n`;
          });

          return { found: true, illustrations, context };
        }
      }
    }

    return { found: false, illustrations: [], context: '' };
  } catch (error) {
    console.error('[RPS] Error:', error);
    return { found: false, illustrations: [], context: '' };
  }
}

// ============ SKILL 4b: SCRAPED CONTENT SEARCH ============
async function executeScrapedContentSearch(
  supabaseAdmin: any,
  query: string,
  maxResults: number = 5
): Promise<{ found: boolean; trips: any[]; guides: any[]; context: string }> {
  try {
    const queryLower = query.toLowerCase();
    const keywords = queryLower
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2);

    if (keywords.length === 0) return { found: false, trips: [], guides: [], context: '' };

    // Determine if user is asking about trips or repair guides
    const isTripQuery = /trip|route|trail|adventure|expedition|travel|overlander|wikiloc|camping/i.test(query);
    const isGuideQuery = /how\s+to|repair|fix|replace|maintain|procedure|steps|guide/i.test(query);

    let trips: any[] = [];
    let guides: any[] = [];

    // Search for relevant scraped content
    if (isTripQuery || !isGuideQuery) {
      const { data: tripResults } = await supabaseAdmin
        .from('scraped_content')
        .select('*')
        .eq('content_type', 'trip')
        .textSearch('content', keywords.join(' & '), { type: 'websearch', config: 'english' })
        .limit(maxResults);

      trips = tripResults || [];
    }

    if (isGuideQuery || !isTripQuery) {
      const { data: guideResults } = await supabaseAdmin
        .from('scraped_content')
        .select('*')
        .eq('content_type', 'guide')
        .textSearch('content', keywords.join(' & '), { type: 'websearch', config: 'english' })
        .limit(maxResults);

      guides = guideResults || [];
    }

    if (trips.length === 0 && guides.length === 0) {
      return { found: false, trips: [], guides: [], context: '' };
    }

    // Build context string
    let context = '';

    if (trips.length > 0) {
      context += '\n=== COMMUNITY TRIP REPORTS ===\n';
      for (const trip of trips) {
        context += `\n--- Trip: ${trip.title} ---\n`;
        context += `Source: ${trip.url}\n`;
        if (trip.metadata?.difficulty) context += `Difficulty: ${trip.metadata.difficulty}\n`;
        if (trip.metadata?.gpx_data?.distance_km) context += `Distance: ${trip.metadata.gpx_data.distance_km} km\n`;
        context += `${trip.content?.substring(0, 800) || ''}\n`;
      }
    }

    if (guides.length > 0) {
      context += '\n=== COMMUNITY REPAIR GUIDES ===\n';
      for (const guide of guides) {
        context += `\n--- Guide: ${guide.title} ---\n`;
        context += `Source: ${guide.url}\n`;
        if (guide.metadata?.applicable_models?.length > 0) {
          context += `Applicable Models: ${guide.metadata.applicable_models.join(', ')}\n`;
        }
        if (guide.metadata?.tools_required?.length > 0) {
          context += `Tools Required: ${guide.metadata.tools_required.join(', ')}\n`;
        }
        if (guide.metadata?.procedure_steps?.length > 0) {
          context += `Steps:\n`;
          for (const step of guide.metadata.procedure_steps.slice(0, 5)) {
            context += `${step.step_number}. ${step.instruction}\n`;
            if (step.warning) context += `   WARNING: ${step.warning}\n`;
          }
        } else {
          context += `${guide.content?.substring(0, 600) || ''}\n`;
        }
      }
    }

    console.log(`[ScrapedContent] Found ${trips.length} trips, ${guides.length} guides`);

    return { found: true, trips, guides, context };
  } catch (error) {
    console.error('[ScrapedContent] Error:', error);
    return { found: false, trips: [], guides: [], context: '' };
  }
}

// ============ SKILL 4c: EPC PARTS SEARCH ============
async function executeEPCSearch(
  supabaseAdmin: any,
  query: string,
  maxResults: number = 10
): Promise<{ found: boolean; parts: any[]; context: string }> {
  try {
    const queryLower = query.toLowerCase();

    // Detect parts-related queries
    const isPartsQuery = /part\s*number|part\s*no|epc|catalog|replace|order|buy|source|supplier|oem/i.test(query)
      || /\bA[-\s]?\d{3}[-\s]?\d{3}[-\s]?\d{2}[-\s]?\d{2}\b/i.test(query);

    // Also trigger for specific component queries that could benefit from part numbers
    const componentTerms = ['brake', 'caliper', 'seal', 'gasket', 'filter', 'bearing', 'lamp',
      'light', 'mirror', 'glass', 'wheel', 'tire', 'hub', 'axle', 'spring', 'shock',
      'clutch', 'exhaust', 'starter', 'alternator', 'relay', 'fuse', 'sensor',
      'pump', 'hose', 'belt', 'wiper', 'headlight', 'taillight', 'indicator'];
    const hasComponent = componentTerms.some(t => queryLower.includes(t));

    if (!isPartsQuery && !hasComponent) {
      return { found: false, parts: [], context: '' };
    }

    // Extract Unimog model from query for filtering
    let modelFilter: string | null = null;
    const modelMatch = queryLower.match(/u\s*(\d{3,4}l?)/i);
    if (modelMatch) {
      modelFilter = modelMatch[1].toUpperCase();
    }

    // Extract keywords
    const stopWords = new Set([
      'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'for', 'on', 'with',
      'at', 'by', 'from', 'as', 'how', 'what', 'where', 'when', 'why', 'which',
      'my', 'your', 'i', 'me', 'you', 'part', 'number', 'parts', 'unimog'
    ]);
    const keywords = queryLower
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2 && !stopWords.has(w));

    if (keywords.length === 0) return { found: false, parts: [], context: '' };

    let parts: any[] = [];

    // Strategy 1: Direct part number lookup
    const partNumberMatch = query.match(/A[-\s]?\d{3}[-\s]?\d{3}[-\s]?\d{2}[-\s]?\d{2}/i);
    if (partNumberMatch) {
      const normalized = partNumberMatch[0].replace(/\s+/g, '-').toUpperCase();
      const { data } = await supabaseAdmin
        .from('rps_parts')
        .select('*')
        .ilike('part_number', `%${normalized}%`)
        .limit(maxResults);
      parts = data || [];
    }

    // Strategy 2: Full-text search on descriptions
    if (parts.length === 0) {
      const searchTerms = keywords.filter(k => !['part', 'number', 'epc'].includes(k));
      if (searchTerms.length > 0) {
        const { data: ftsData } = await supabaseAdmin
          .from('rps_parts')
          .select('*')
          .textSearch('description_en', searchTerms.join(' & '), { type: 'websearch', config: 'english' })
          .limit(maxResults * 2);

        parts = ftsData || [];
      }
    }

    // Strategy 3: ILIKE fallback
    if (parts.length === 0) {
      const primaryTerm = keywords.find(k => componentTerms.includes(k)) || keywords[0];
      if (primaryTerm) {
        const { data: ilikeData } = await supabaseAdmin
          .from('rps_parts')
          .select('*')
          .ilike('description_en', `%${primaryTerm}%`)
          .limit(maxResults * 2);

        parts = ilikeData || [];
      }
    }

    // Filter by model if specified
    if (modelFilter && parts.length > 0) {
      const modelParts = parts.filter((p: any) =>
        p.model_name?.toLowerCase().includes(modelFilter!.toLowerCase()) ||
        p.model_code?.toLowerCase().includes(modelFilter!.toLowerCase())
      );
      if (modelParts.length > 0) parts = modelParts;
    }

    // Deduplicate by part number and limit results
    const seen = new Set<string>();
    parts = parts.filter((p: any) => {
      if (seen.has(p.part_number)) return false;
      seen.add(p.part_number);
      return true;
    }).slice(0, maxResults);

    if (parts.length === 0) return { found: false, parts: [], context: '' };

    // Build context string for Claude
    let context = '\n=== EPC PARTS CATALOG (Mercedes Electronic Parts Catalog) ===\n';
    context += 'The following are genuine Mercedes-Benz OEM part numbers from the EPC database:\n\n';

    for (const part of parts) {
      context += `Part: ${part.part_number}`;
      if (part.description_en) context += ` - ${part.description_en}`;
      if (part.description_de) context += ` (DE: ${part.description_de})`;
      context += `\n  Category: ${part.category}`;
      context += ` | Model: ${part.model_name || part.model_code}`;
      if (part.group_code) context += ` | Group: ${part.group_code}`;
      context += '\n';
    }

    context += '\nNote: These are OEM Mercedes-Benz part numbers. Always verify with your dealer before ordering.\n';

    console.log(`[EPC] Found ${parts.length} parts`);

    return { found: true, parts, context };
  } catch (error) {
    console.error('[EPC] Error:', error);
    return { found: false, parts: [], context: '' };
  }
}

// ============ SKILL 2.5: QUERY EXPANDER ============
async function executeQueryExpander(query: string): Promise<{ found: boolean; expandedTerms: string[] }> {
  if (!DEEPSEEK_API_KEY) {
    console.warn('[QueryExpander] No API key, using fallback');
    return { found: false, expandedTerms: [query] };
  }

  const prompt = `You are a Unimog technical terminology expert. Given this user question about a Unimog, return a JSON array of alternative search terms that workshop manuals and parts catalogs would use. Include German technical terms (like Lenkstockschalter), Mercedes part terminology, component assembly names, and common mechanic slang. Return ONLY the JSON array, nothing else.

User question: "${query}"

Example format: ["combination switch", "Lenkstockschalter", "turn signal lever", "indicator stalk", "column switch", "wiper switch assembly"]`;

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        max_tokens: 200,
        temperature: 0.3,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim();

    if (!content) {
      throw new Error('Empty response');
    }

    // Clean and parse JSON response
    const cleanedContent = content.replace(/```json\s*|\s*```/g, '').trim();
    const expandedTerms = JSON.parse(cleanedContent);

    if (!Array.isArray(expandedTerms)) {
      throw new Error('Response is not an array');
    }

    const validTerms = expandedTerms
      .filter(term => typeof term === 'string' && term.trim().length > 0)
      .map(term => term.trim())
      .slice(0, 15);

    // Always include original query
    const finalTerms = [query, ...validTerms.filter(term => term !== query)];

    console.log(`[QueryExpander] Expanded ${finalTerms.length} terms: ${finalTerms.slice(0, 3).join(', ')}${finalTerms.length > 3 ? '...' : ''}`);
    return { found: finalTerms.length > 1, expandedTerms: finalTerms };

  } catch (error) {
    console.warn(`[QueryExpander] Failed, using fallback:`, error);

    // Fallback to hardcoded mappings
    const fallbackMappings: Record<string, string[]> = {
      'indicator': ['combination switch', 'turn signal', 'blinker', 'Lenkstockschalter', 'indicator stalk'],
      'stalk': ['combination switch', 'column switch', 'Lenkstockschalter', 'switch assembly'],
      'turbo': ['turbocharger', 'Turbolader', 'boost', 'compressor'],
      'diff': ['differential', 'Differential', 'diff lock', 'Sperrventil'],
      'portal': ['portal hub', 'wheel hub drives', 'Radnabe', 'hub assembly'],
      'brake': ['brake system', 'Bremse', 'brake pad', 'caliper'],
      'oil': ['engine oil', 'Motoröl', 'lubricant', 'hydraulic fluid'],
      'pump': ['fuel pump', 'water pump', 'hydraulic pump', 'Pumpe']
    };

    const queryLower = query.toLowerCase();
    const expandedTerms: string[] = [query];

    for (const [userTerm, technicalTerms] of Object.entries(fallbackMappings)) {
      if (queryLower.includes(userTerm)) {
        expandedTerms.push(...technicalTerms);
      }
    }

    const finalTerms = [...new Set(expandedTerms)].slice(0, 10);
    return { found: finalTerms.length > 1, expandedTerms: finalTerms };
  }
}

// ============ SKILL 5: RESPONSE GENERATOR ============
async function executeResponseGenerator(
  query: string,
  task: string,
  manualContext: string,
  rpsContext: string,
  conversationHistory: ChatMessage[],
  userContext?: string
): Promise<{ content: string; citations: number[] }> {
  if (!DEEPSEEK_API_KEY) {
    throw new Error('DEEPSEEK_API_KEY not configured');
  }

  // Build system prompt with clear instructions about real manual access
  let systemPrompt = BARRY_PERSONA;

  // Only include user context for technical queries
  if (userContext && ['procedure', 'troubleshoot', 'specifications', 'parts_lookup', 'exploded_view'].includes(task)) {
    systemPrompt += `\n\n=== USER VEHICLE CONTEXT ===\n`;
    systemPrompt += `${userContext}\n`;
  }

  systemPrompt += `\n\n=== IMPORTANT: YOU HAVE REAL DATA ACCESS ===
You have DIRECT ACCESS to:
1. The actual U435 Workshop Manual database (official Unimog documentation)
2. RPS Parts System with exploded view illustrations
3. Mercedes EPC (Electronic Parts Catalog) with 12,500+ genuine OEM part numbers for Unimog models
4. Community-scraped trip reports and repair guides from Unimog forums and sites

The content below is REAL data - not hypothetical or placeholder data.

When you cite a page number, the user's interface will AUTOMATICALLY display that PDF page. So when you say "see page 632", the user will actually see page 632 from the workshop manual.

For community content (trips, repair guides), cite the source but note it's community-contributed (not official Mercedes documentation).

DO NOT say things like:
- "I don't have access to manuals"
- "I can't fetch those pages"
- "You'll need to find the manual yourself"

You DO have the data. USE IT. Reference the specific content provided below.
`;

  systemPrompt += `\n\n${manualContext}`;
  if (rpsContext) systemPrompt += `\n${rpsContext}`;

  systemPrompt += `\n\n=== RESPONSE INSTRUCTIONS ===
Task type: ${task}

MANDATORY BEHAVIOR:
1. The manual content above is REAL - you MUST reference and cite it
2. For every technical answer, cite: "According to page X..." or "See page X for..."
3. The user's interface DISPLAYS the cited pages automatically - they will SEE the PDF
4. For RPS diagrams, include the markdown image - it renders in the chat
5. When EPC part numbers are available, ALWAYS include them (e.g., "OEM part number: A-000-420-46-83")
6. NEVER say "I don't have access" or "I can't fetch" - you HAVE the data above
7. Only say "not covered in my database" if no content above relates to the query

CRITICAL - ANSWER DIRECTLY WITH SPECIFIC VALUES:
- When the manual content contains specific numbers (torque values, capacities, measurements), STATE THEM IMMEDIATELY in your first sentence
- Do NOT hedge, equivocate, or give ranges when the manual gives an exact number
- Do NOT say "varies by model" or "check your manual" when the spec is RIGHT THERE in the content above
- Example: If content says "Wheel nut M 22 X 1,5 400" then your answer MUST start with "Wheel nut torque is 400 Nm"
- Extract exact values, part numbers, and measurements from the content and present them clearly
- Lead with the answer, then add context and safety notes after`;

  // Build messages
  const messages = [
    ...conversationHistory.slice(-5),
    { role: 'user', content: query }
  ];

  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      max_tokens: 1000,
      temperature: 0.7,
      stream: false,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map((m: ChatMessage) => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content
        }))
      ]
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Claude API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;

  // Extract page citations
  const citations: number[] = [];
  const pageMatches = content.matchAll(/page\s+(\d+)/gi);
  for (const match of pageMatches) {
    const pageNum = parseInt(match[1]);
    if (!isNaN(pageNum) && !citations.includes(pageNum)) {
      citations.push(pageNum);
    }
  }

  return { content, citations };
}

// ============ SKILL 6: SAFETY FILTER ============
function executeSafetyFilter(
  query: string,
  content: string,
  task: string
): { content: string; disclaimer?: string } {
  const combinedText = `${query} ${content}`.toLowerCase();
  const disclaimers: string[] = [];

  for (const [category, triggers] of Object.entries(SAFETY_TRIGGERS)) {
    for (const trigger of triggers) {
      if (combinedText.includes(trigger)) {
        disclaimers.push(category);
        break;
      }
    }
  }

  const uniqueDisclaimers = [...new Set(disclaimers)];
  if (uniqueDisclaimers.length === 0 && ['procedure', 'troubleshoot'].includes(task)) {
    return {
      content,
      disclaimer: '\n\n**Safety Notice:**\nAlways follow proper safety procedures when working on your vehicle.'
    };
  }

  if (uniqueDisclaimers.length > 0) {
    const disclaimerText = uniqueDisclaimers
      .map(cat => SAFETY_DISCLAIMERS[cat])
      .filter(Boolean)
      .join('\n');

    return {
      content,
      disclaimer: `\n\n**Safety Notice:**\n${disclaimerText}`
    };
  }

  return { content };
}

// ============ MAIN HANDLER ============
serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const startTime = performance.now();
  const executedSkills: string[] = [];

  try {
    const { messages, location, userId } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Messages array required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ============ SECURITY GUARDRAILS ============
    const lastMsg = messages[messages.length - 1];
    const rawQuery = lastMsg?.content || '';

    // 1. Validate input sizes
    const sizeCheck = validateInputSize(messages, rawQuery);
    if (!sizeCheck.valid) {
      console.warn('[Security] Input size validation failed:', sizeCheck.error);
      return new Response(JSON.stringify({
        content: sizeCheck.error,
        manualReferences: [],
        knowledgeMode: 'blocked',
        searchResultCount: 0,
        skill_chain: ['security-guard'],
        execution_time_ms: performance.now() - startTime
      }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // 2. Check for prompt injection attempts
    if (detectPromptInjection(rawQuery)) {
      console.warn('[Security] Prompt injection blocked');
      return new Response(JSON.stringify({
        content: "I can only help with Unimog technical questions. Please ask about maintenance, repairs, or specifications.",
        manualReferences: [],
        knowledgeMode: 'blocked',
        searchResultCount: 0,
        skill_chain: ['security-guard'],
        execution_time_ms: performance.now() - startTime
      }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // 3. Sanitize input for database queries
    const sanitizedMessages = messages.map(m => ({
      ...m,
      content: sanitizeInput(m.content || '')
    }));

    // 4. Check rate limit (using userId from request or IP-based fallback)
    const rateLimitKey = userId || req.headers.get('x-forwarded-for') || 'anonymous';
    const rateCheck = checkRateLimit(rateLimitKey);
    if (!rateCheck.allowed) {
      console.warn('[Security] Rate limit exceeded for:', rateLimitKey);
      return new Response(JSON.stringify({
        content: `Too many requests. Please wait ${rateCheck.retryAfter} seconds before trying again.`,
        manualReferences: [],
        knowledgeMode: 'rate_limited',
        searchResultCount: 0,
        skill_chain: ['security-guard'],
        execution_time_ms: performance.now() - startTime
      }), {
        status: 429,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Retry-After': String(rateCheck.retryAfter || 60)
        }
      });
    }

    // Initialize Supabase clients
    const authHeader = req.headers.get('Authorization');
    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
      global: { headers: { Authorization: authHeader || '' } }
    });
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false }
    });

    // Get user from auth
    let user = { id: userId || 'anonymous' };
    if (authHeader) {
      const { data: { user: authUser } } = await supabaseClient.auth.getUser();
      if (authUser) user = authUser;
    }

    // Use sanitized inputs from security guardrails
    const lastUserMessage = sanitizedMessages[sanitizedMessages.length - 1];
    const userQuery = sanitizeInput(lastUserMessage.content || '');

    // Strip context prefix from search queries - frontend prepends [Vehicle: ...] [Context: ...]
    const { cleanQuery, contextPrefix } = stripContextPrefix(userQuery);
    console.log(`[Barry-OpenClaw] Clean query: ${cleanQuery.substring(0, 100)}`);
    if (contextPrefix) {
      console.log(`[Barry-OpenClaw] Context prefix: ${contextPrefix.substring(0, 100)}`);
    }

    // ============ SKILL CHAIN EXECUTION ============

    // SKILL 1: Domain Guard
    executedSkills.push('domain-guard');
    const domainResult = executeDomainGuard(cleanQuery);
    console.log(`[Domain] ${domainResult.domain} - ${domainResult.task}`);

    if (!domainResult.is_allowed) {
      return new Response(JSON.stringify({
        content: domainResult.redirect_message,
        manualReferences: [],
        knowledgeMode: 'blocked',
        searchResultCount: 0,
        skill_chain: executedSkills,
        execution_time_ms: performance.now() - startTime
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // SKILL 2: Knowledge Base Lookup (instant answers)
    executedSkills.push('knowledge-lookup');
    const kbResult = await executeKnowledgeLookup(supabaseAdmin, cleanQuery);

    if (kbResult.found && kbResult.content) {
      console.log(`[KB] Cache hit with confidence ${kbResult.confidence}`);
      return new Response(JSON.stringify({
        content: kbResult.content,
        manualReferences: kbResult.manualReferences || [],
        knowledgeMode: 'knowledge_base',
        searchResultCount: kbResult.manualReferences?.length || 0,
        confidence: kbResult.confidence,
        source: 'validated_kb',
        skill_chain: executedSkills,
        execution_time_ms: performance.now() - startTime
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // SKILL 2.5: Query Expander (Context Gatherer - Phase 1 of Barry AI Transformation)
    // Only run for technical queries that had a knowledge base cache MISS
    let expandedTerms: string[] = [cleanQuery];
    if (domainResult.domain === 'technical') {
      executedSkills.push('query-expander');
      const expansionResult = await executeQueryExpander(cleanQuery);

      if (expansionResult.found) {
        expandedTerms = expansionResult.expandedTerms;
        console.log(`[QueryExpander] Will use ${expandedTerms.length} search terms`);
      } else {
        console.log(`[QueryExpander] Using original query only`);
      }
    }

    // SKILL 3, 4, 4b, 4c: Manual Search + RPS Search + Scraped Content + EPC Parts + PDF availability (parallel)
    executedSkills.push('manual-search');
    executedSkills.push('rps-search');
    executedSkills.push('scraped-content-search');
    executedSkills.push('epc-search');

    const [manualResult, rpsResult, scrapedResult, epcResult, availablePdfs] = await Promise.all([
      executeManualSearch(supabaseAdmin, cleanQuery, 10, expandedTerms.length > 1 ? expandedTerms : undefined),
      executeRPSSearch(supabaseAdmin, cleanQuery, expandedTerms.length > 1 ? expandedTerms : undefined),
      executeScrapedContentSearch(supabaseAdmin, cleanQuery, 5),
      executeEPCSearch(supabaseAdmin, cleanQuery, 10),
      getAvailablePdfFiles(supabaseAdmin)
    ]);
    console.log(`[PDF] ${availablePdfs.size} PDFs available in storage`);

    console.log(`[Manual] Found ${manualResult.chunks.length} chunks`);
    console.log(`[RPS] Found ${rpsResult.illustrations.length} illustrations`);
    console.log(`[Scraped] Found ${scrapedResult.trips.length} trips, ${scrapedResult.guides.length} guides`);
    console.log(`[EPC] Found ${epcResult.parts.length} parts`);

    // Combine context - prioritize official manuals, supplement with EPC parts and community content
    let combinedContext = '';
    if (manualResult.found) {
      combinedContext += manualResult.context;
    }
    if (rpsResult.found) {
      combinedContext += rpsResult.context;
    }
    if (epcResult.found) {
      combinedContext += epcResult.context;
    }
    if (scrapedResult.found) {
      combinedContext += scrapedResult.context;
    }

    if (!combinedContext) {
      // No context found - provide general response
      return new Response(JSON.stringify({
        content: "I couldn't find specific information about that in my manual database. Could you try rephrasing your question, or ask about a different topic?",
        manualReferences: [],
        knowledgeMode: 'no_context',
        searchResultCount: 0,
        skill_chain: executedSkills,
        execution_time_ms: performance.now() - startTime
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // SKILL 5: Response Generator
    executedSkills.push('response-generator');
    const { content: responseContent, citations } = await executeResponseGenerator(
      cleanQuery,
      domainResult.task,
      manualResult.context,
      rpsResult.context,
      sanitizedMessages.slice(0, -1), // Exclude current message from history (sanitized)
      contextPrefix // User context from frontend (vehicle info, etc.)
    );

    console.log(`[Generator] Response length: ${responseContent.length}, Citations: ${citations.join(', ')}`);

    // SKILL 6: Safety Filter
    executedSkills.push('safety-filter');
    const safetyResult = executeSafetyFilter(cleanQuery, responseContent, domainResult.task);

    // Build final response content
    let finalContent = safetyResult.content;
    if (safetyResult.disclaimer) {
      finalContent += safetyResult.disclaimer;
    }

    // Build manual references from chunks and RPS
    // Always include found chunks - prioritize cited ones but include all for user reference
    const manualReferences: ManualReference[] = [];
    const addedPages = new Set<number>();

    // First add explicitly cited pages (only if PDF exists in storage)
    for (const chunk of manualResult.chunks) {
      if (citations.includes(chunk.page_number) && !addedPages.has(chunk.page_number)) {
        const storageUrl = buildManualStorageUrl(chunk.manual_title, chunk.page_number, availablePdfs);
        // Only add references that have a working PDF URL
        if (!storageUrl) continue;
        addedPages.add(chunk.page_number);
        manualReferences.push({
          type: 'u435_openclaw',
          title: chunk.section_title || chunk.manual_title || 'Manual Entry',
          page_number: chunk.page_number,
          original_page: chunk.page_number,
          pdf_page: chunk.page_number,
          storage_url: storageUrl,
          chapter_filename: manualTitleToFilename(chunk.manual_title),
          manual_type: chunk.manual_title?.startsWith('G6') ? 'G-series' : 'U435',
          content_preview: chunk.content?.substring(0, 200)
        });
      }
    }

    // Then add other found pages (up to 5 total manual refs, only with valid PDFs)
    for (const chunk of manualResult.chunks) {
      if (!addedPages.has(chunk.page_number) && manualReferences.length < 5) {
        const storageUrl = buildManualStorageUrl(chunk.manual_title, chunk.page_number, availablePdfs);
        if (!storageUrl) continue;
        addedPages.add(chunk.page_number);
        manualReferences.push({
          type: 'u435_openclaw',
          title: chunk.section_title || chunk.manual_title || 'Manual Entry',
          page_number: chunk.page_number,
          original_page: chunk.page_number,
          pdf_page: chunk.page_number,
          storage_url: storageUrl,
          chapter_filename: manualTitleToFilename(chunk.manual_title),
          manual_type: chunk.manual_title?.startsWith('G6') ? 'G-series' : 'U435',
          content_preview: chunk.content?.substring(0, 200)
        });
      }
    }

    // Add RPS illustrations
    manualReferences.push(...rpsResult.illustrations);

    // Log to chat_logs (use sanitized messages)
    try {
      await supabaseAdmin.from('chat_logs').insert({
        user_id: user.id,
        messages: sanitizedMessages,
        response: finalContent,
        model: 'deepseek-chat',
        knowledge_source: 'openclaw',
        routing_rule: domainResult.domain,
        routing_match: domainResult.task,
        pdf_references_found: manualReferences.length
      });
    } catch (logError) {
      console.warn('[Log] Failed to save chat log:', logError);
    }

    return new Response(JSON.stringify({
      content: finalContent,
      manualReferences,
      knowledgeMode: domainResult.domain === 'technical' ? 'unimog_agentic' : 'general',
      searchResultCount: manualReferences.length,
      skill_chain: executedSkills,
      execution_time_ms: performance.now() - startTime
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (error) {
    console.error('[Barry-OpenClaw] Error:', error);

    // Return graceful error response
    return new Response(JSON.stringify({
      content: "I'm having trouble processing your request right now. Please try again in a moment.",
      manualReferences: [],
      knowledgeMode: 'error',
      searchResultCount: 0,
      skill_chain: executedSkills,
      execution_time_ms: performance.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500, // Proper error status code
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
