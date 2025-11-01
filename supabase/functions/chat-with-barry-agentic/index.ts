// Barry Agentic Edge Function - Complete Hybrid Routing System
// Date: 2025-10-31
// Version: 30 - INTENT ROUTING: Adds intent/entity classification + clarification + weather gatherer (feature-flagged)
// Enhancement: 850+ database keywords + Claude Haiku semantic analysis for edge cases
// Technical: Sustainable routing - never needs manual keyword updates again
// Cost: ~$0.0002 per edge case query (semantic fallback only when keywords don't match)
// Previous: Version 28 - Database-extracted keywords without semantic fallback

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import routingKeywordsData from './routing-keywords.json' with { type: 'json' };

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');
// Model names configurable via env to avoid hardcoding and keep compatibility with provider updates
const ANTHROPIC_MODEL_INTENT = Deno.env.get('ANTHROPIC_MODEL_INTENT') || 'claude-haiku-4-5';
const ANTHROPIC_MODEL_AGENTIC = Deno.env.get('ANTHROPIC_MODEL_AGENTIC') || 'claude-haiku-4-5';
const ANTHROPIC_MODEL_GENERAL = Deno.env.get('ANTHROPIC_MODEL_GENERAL') || 'claude-haiku-4-5';
const ANTHROPIC_MODEL_SEMANTIC = Deno.env.get('ANTHROPIC_MODEL_SEMANTIC') || 'claude-haiku-4';
const ANTHROPIC_MODEL_VISION = Deno.env.get('ANTHROPIC_MODEL_VISION') || 'claude-haiku-4-5';
const FEATURE_FLAG_INTENT_ROUTING = (Deno.env.get('FEATURE_FLAG_INTENT_ROUTING') || '').toLowerCase() === 'true';
const FEATURE_FLAG_WEATHER = (Deno.env.get('FEATURE_FLAG_WEATHER') || '').toLowerCase() === 'true';
const FEATURE_FLAG_RPS_DETERMINISTIC = (Deno.env.get('FEATURE_FLAG_RPS_DETERMINISTIC') || '').toLowerCase() === 'true';
const FEATURE_FLAG_RPS_CLARIFY = (Deno.env.get('FEATURE_FLAG_RPS_CLARIFY') || '').toLowerCase() === 'true';
const FEATURE_FLAG_LEARNING_CACHE = (Deno.env.get('FEATURE_FLAG_LEARNING_CACHE') || '').toLowerCase() === 'true';
const CACHE_TTL_SECONDS = parseInt(Deno.env.get('FEATURE_CACHE_TTL_SECONDS') || '86400');

// Load routing keywords from database-extracted JSON (850+ keywords)
const ROUTING_KEYWORDS = new Set(routingKeywordsData.keywords.map((k: string) => k.toLowerCase()));

// RPS PHASE 7: Helper function to generate CDN URLs for illustrations
function getIllustrationCDNUrl(pageNumber: number): string {
  const paddedPage = pageNumber.toString().padStart(4, '0');
  return `https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/rps_illustrations/rps_page_${paddedPage}.png`;
}
// -------- Learning cache helpers --------
function normalizeComponentName(name: string | null | undefined): string | null {
  if (!name) return null;
  return name.toLowerCase().trim();
}

async function getOrCreateComponent(supabaseAdmin: any, name: string, groupCode?: string | null): Promise<number | null> {
  const norm = normalizeComponentName(name);
  if (!norm) return null;
  let { data, error } = await supabaseAdmin
    .from('rps_components')
    .select('id')
    .eq('normalized_name', norm)
    .single();
  if (error && error.code !== 'PGRST116') {
    console.warn('[Cache] get component error:', error);
  }
  if (data && (data as any).id) return (data as any).id as number;
  const ins = await supabaseAdmin
    .from('rps_components')
    .insert({ name, group_code: groupCode || null })
    .select('id')
    .single();
  if (ins.error) {
    console.warn('[Cache] insert component error:', ins.error);
    return null;
  }
  return ins.data?.id || null;
}

async function upsertComponentTaskRefs(
  supabaseAdmin: any,
  componentId: number,
  task: string,
  rpsPages: number[],
  manualPages: number[],
  confidence: number
) {
  const { error } = await supabaseAdmin
    .from('component_task_refs')
    .upsert({ component_id: componentId, task, rps_pages: rpsPages, manual_pages: manualPages, confidence, updated_at: new Date().toISOString() }, { onConflict: 'component_id,task' });
  if (error) console.warn('[Cache] upsert refs error:', error);
}

function buildSignature(task: string, componentName: string | null): string {
  return `${task.toLowerCase()}::${normalizeComponentName(componentName) || ''}`;
}

async function getCachedAnswer(supabaseAdmin: any, signature: string): Promise<{ content: string; refs: any[] } | null> {
  const now = new Date().toISOString();
  const { data, error } = await supabaseAdmin
    .from('answer_cache')
    .select('content, refs, expires_at')
    .eq('signature', signature)
    .gt('expires_at', now)
    .single();
  if (error && error.code !== 'PGRST116') {
    console.warn('[Cache] get answer error:', error);
  }
  if (!data) return null;
  return { content: (data as any).content, refs: (data as any).refs } as any;
}

async function setCachedAnswer(supabaseAdmin: any, signature: string, task: string, componentName: string | null, content: string, refs: any[], ttlSeconds: number) {
  const expires = new Date(Date.now() + ttlSeconds * 1000).toISOString();
  const { error } = await supabaseAdmin
    .from('answer_cache')
    .upsert({ signature, task, component_name: componentName, content, refs, expires_at: expires, updated_at: new Date().toISOString() }, { onConflict: 'signature' });
  if (error) console.warn('[Cache] set answer error:', error);
}

// Check which illustration pages actually exist in Storage (by object name)
async function filterExistingIllustrationPages(
  supabaseAdmin: any,
  pages: number[]
): Promise<{ existing: number[]; missing: number[] }> {
  try {
    if (!pages || pages.length === 0) return { existing: [], missing: [] };
    // Generate candidate object names for both padded/non-padded and single/nested prefixes
    const candidates: Record<number, string[]> = {};
    const allNames: string[] = [];
    for (const p of pages) {
      const pad4 = p.toString().padStart(4, '0');
      const names = [
        `rps_illustrations/rps_page_${pad4}.png`,
        `rps_illustrations/rps_illustrations/rps_page_${pad4}.png`,
        `rps_illustrations/rps_page_${p}.png`,
        `rps_illustrations/rps_illustrations/rps_page_${p}.png`
      ];
      candidates[p] = names;
      allNames.push(...names);
    }
    // Query storage.objects via storage schema
    const { data, error } = await supabaseAdmin
      .schema('storage')
      .from('objects')
      .select('name')
      .eq('bucket_id', 'rps_illustrations')
      .in('name', allNames)
      .limit(allNames.length);

    if (error) {
      console.warn('[RPS Storage Filter] Error checking storage objects, skipping filter:', error);
      return { existing: pages, missing: [] };
    }
    const existingNames = new Set((data || []).map((d: any) => d.name));
    const existing: number[] = [];
    const missing: number[] = [];
    for (const p of pages) {
      const names = candidates[p];
      const found = names.some(n => existingNames.has(n));
      if (found) existing.push(p); else missing.push(p);
    }
    return { existing, missing };
  } catch (e) {
    console.warn('[RPS Storage Filter] Exception checking storage, skipping filter:', e);
    return { existing: pages, missing: [] };
  }
}

// RPS PHASE 7: Detect component-based exploded view queries
function detectComponentQuery(userQuery: string): { isComponentQuery: boolean; componentName: string | null } {
  const queryLower = userQuery.toLowerCase();

  // Check for illustration keywords
  const illustrationKeywords = ['exploded view', 'illustration', 'figure', 'diagram', 'schematic', 'parts catalog'];
  const hasIllustrationKeyword = illustrationKeywords.some(kw => queryLower.includes(kw));

  if (!hasIllustrationKeyword) {
    return { isComponentQuery: false, componentName: null };
  }

  // Extract component name - multiple patterns
  // Pattern 1: "for [my/the] X" - greedy capture until punctuation or sentence end
  let componentMatch = queryLower.match(/(?:for|of)\s+(?:my\s+|the\s+)?([a-z\s]+?)(?:[,;.]|$)/);
  if (componentMatch && componentMatch[1]) {
    const componentName = componentMatch[1].trim();
    // Filter out generic words
    if (componentName && !['part', 'parts', 'a part'].includes(componentName)) {
      return { isComponentQuery: true, componentName };
    }
  }

  // Pattern 2: "X exploded view" - direct match (requires trigger word)
  componentMatch = queryLower.match(/\b(?:show|need|want|get|see)\s+(?:me\s+)?(?:the\s+)?([a-z\s]+?)\s+(?:exploded view|illustration|diagram)/);
  if (componentMatch && componentMatch[1]) {
    return { isComponentQuery: true, componentName: componentMatch[1].trim() };
  }

  // Pattern 3: "exploded view of [component]" - reversed order
  componentMatch = queryLower.match(/(?:exploded view|illustration|diagram)\s+(?:of|for)\s+(?:the\s+)?([a-z\s]+)/);
  if (componentMatch && componentMatch[1]) {
    const componentName = componentMatch[1].trim();
    // Filter out generic words
    if (componentName && !['part', 'parts', 'a part'].includes(componentName)) {
      return { isComponentQuery: true, componentName };
    }
  }

  return { isComponentQuery: hasIllustrationKeyword, componentName: null };
}

// RPS PHASE 7: Extract component from conversation context
function extractComponentFromConversation(messages: any[], currentQuery: string): string | null {
  // Try detecting component in current message first
  const { isComponentQuery, componentName } = detectComponentQuery(currentQuery);

  if (componentName) {
    console.log(`[Context] Component found in current message: ${componentName}`);
    return componentName;
  }

  // If current message has illustration/parts keywords but no component, check conversation history
  const queryLower = currentQuery.toLowerCase();
  const hasRPSKeywords = ['exploded view', 'illustration', 'diagram', 'parts list', 'part number', 'the view'].some(kw => queryLower.includes(kw));

  if (hasRPSKeywords) {
    console.log('[Context] RPS keywords found, scanning conversation history...');

    // Scan last 5 messages for component names
    const recentMessages = messages.slice(-6); // Last 6 messages (including current)

    for (let i = recentMessages.length - 2; i >= 0; i--) { // Skip current message (already checked)
      const msg = recentMessages[i];
      if (!msg || !msg.content) continue;

      const result = detectComponentQuery(msg.content);
      if (result.componentName) {
        console.log(`[Context] Found component in message ${i}: ${result.componentName}`);
        return result.componentName;
      }
    }
  }

  return null;
}

// RPS PHASE 7: Detect parts list queries
function detectPartsListQuery(userQuery: string): boolean {
  const queryLower = userQuery.toLowerCase();
  const partsListKeywords = [
    'part number', 'parts list', 'part list', 'order', 'niin', 'nsn',
    'buy', 'purchase', 'stock number', 'catalog number'
  ];
  return partsListKeywords.some(kw => queryLower.includes(kw));
}

// -------- Intent Classification (Feature-flagged) --------
type BarryIntent = {
  domain: 'unimog_technical' | 'general';
  task: 'procedure' | 'troubleshoot' | 'exploded_view' | 'parts_lookup' | 'weather' | 'other';
  entities: { components?: string[]; symptoms?: string[] };
  vehicle?: string | null;
  confidence: number; // 0..1
  needs_clarification: boolean;
  clarifying_question?: string;
};

async function classifyIntentWithClaude(prompt: string, messages: any[]): Promise<BarryIntent | null> {
  try {
    const system = `You are an intent classifier for Barry the Unimog mechanic. Read the latest user message in context and output STRICT JSON.
Output schema:
{"domain":"unimog_technical|general","task":"procedure|troubleshoot|exploded_view|parts_lookup|weather|other","entities":{"components":["..."],"symptoms":["..."]},"vehicle":null|"U435|...","confidence":0.0-1.0,"needs_clarification":true|false,"clarifying_question":"string or empty"}
Rules:
- Prefer multi-word components (e.g., "portal hub seal") over single tokens.
- Detect weather queries (today/tomorrow/forecast) as task="weather".
- Only needs_clarification=true if confidence<0.6 OR multiple distinct interpretations.
- Keep clarifying_question under 15 words, single question.
Return ONLY JSON.`;

    const body = {
      model: ANTHROPIC_MODEL_INTENT,
      max_tokens: 300,
      temperature: 0,
      system,
      messages: [
        ...messages.slice(-5).map((m: any) => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content })),
        { role: 'user', content: prompt }
      ]
    };

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const t = await res.text();
      console.log('[Intent] Anthropic error:', t);
      return null;
    }
    const data = await res.json();
    const text = data.content?.[0]?.text || '';
    // Attempt to parse JSON blob from response
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}');
    if (jsonStart >= 0 && jsonEnd > jsonStart) {
      const json = text.slice(jsonStart, jsonEnd + 1);
      const parsed: BarryIntent = JSON.parse(json);
      return parsed;
    }
    return null;
  } catch (e) {
    console.log('[Intent] Exception:', e);
    return null;
  }
}

// -------- Weather Gatherer (Feature-flagged) --------
type Coordinates = { latitude: number; longitude: number };

async function fetchWeather(location: Coordinates): Promise<any | null> {
  try {
    const url = new URL('https://api.open-meteo.com/v1/forecast');
    url.searchParams.set('latitude', String(location.latitude));
    url.searchParams.set('longitude', String(location.longitude));
    url.searchParams.set('daily', 'temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode,windspeed_10m_max');
    url.searchParams.set('timezone', 'auto');
    const res = await fetch(url.toString());
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.log('[Weather] Exception:', e);
    return null;
  }
}

// RPS PHASE 7: OCR parts list page using Claude Vision
async function ocrPartsListPage(pageUrl: string, componentName: string): Promise<string> {
  try {
    console.log(`[OCR] Analyzing parts list page: ${pageUrl}`);

    // Fetch the image as base64
    const imageResponse = await fetch(pageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const base64Image = btoa(String.fromCharCode(...new Uint8Array(imageBuffer)));

    // Use Claude Vision to OCR the parts list
    const ocrResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL_VISION,
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/png',
                data: base64Image
              }
            },
            {
              type: 'text',
              text: `Extract all part information from this RPS parts list page for ${componentName}.

              For each part, provide:
              - Item number
              - Part description
              - NIIN (National Item Identification Number)
              - NSN (National Stock Number) if available
              - Quantity
              - Callout number

              Format as a clean list. Focus on parts related to seals, bearings, and other components mentioned.`
            }
          ]
        }]
      })
    });

    if (!ocrResponse.ok) {
      const error = await ocrResponse.text();
      console.error(`[OCR] Error:`, error);
      throw new Error(`OCR failed: ${error}`);
    }

    const ocrData = await ocrResponse.json();
    const extractedText = ocrData.content[0].text;

    console.log(`[OCR] Extracted ${extractedText.length} characters`);
    return extractedText;

  } catch (error) {
    console.error(`[OCR] Failed to OCR parts list:`, error);
    return '';
  }
}

// RPS PHASE 7: Search RPS groups by component name
async function searchRPSByComponentName(
  supabaseClient: any,
  componentName: string
): Promise<{ found: boolean; group: any; parts: any[] }> {
  try {
    console.log(`🔍 Searching RPS by component name: "${componentName}"`);

    // Map common component terms to RPS group names
    const componentMappings: Record<string, string[]> = {
      'portal': ['PORTAL', 'WHEEL HUB DRIVES', 'HUB'],
      'portal hub': ['WHEEL HUB DRIVES', 'PORTAL'],
      'hub': ['WHEEL HUB', 'HUB DRIVES', 'PORTAL'],
      'front hub': ['WHEEL HUB DRIVES, FRONT', 'FRONT AXLE', 'HOUSING, FRONT'],
      'rear hub': ['WHEEL HUB DRIVES, REAR', 'REAR AXLE'],
      'front axle': ['FRONT AXLE', 'HOUSING, FRONT'],
      'rear axle': ['REAR AXLE', 'HOUSING, REAR'],
      'turbocharger': ['TURBOCHARGER', 'AIRESEARCH'],
      'differential': ['DIFFERENTIAL'],
      'brake': ['BRAKE'],
      'wheel': ['WHEEL HUB'],
      'pto': ['POWER TAKE-OFF', 'PTO', 'PTO DRIVE', 'POWER TAKE-OFF (PTO) DRIVE'],
      'pto driveline': ['POWER TAKE-OFF (PTO) DRIVE', 'PTO DRIVE', 'DRIVE LINE', 'DRIVELINE'],
      'driveline': ['DRIVE LINE', 'DRIVELINE', 'PTO DRIVE'],
      'transmission pto': ['TRANSMISSION PTO', 'PTO DRIVE', 'POWER TAKE-OFF'],
      'power take-off': ['POWER TAKE-OFF', 'PTO']
    };

    // Get search terms (use mappings or component name itself)
    const searchTerms = componentMappings[componentName] || [componentName.toUpperCase()];
    console.log(`  📋 Search terms: ${searchTerms.join(', ')}`);

    // Search groups by name (ILIKE) - try each term
    for (const term of searchTerms) {
      const { data: groups, error } = await supabaseClient
        .from('rps_groups')
        .select('*')
        .ilike('group_name', `%${term}%`)
        .not('illustration_pages', 'is', null)
        .limit(1);

      if (!error && groups && groups.length > 0) {
        const group = groups[0];

        // Verify group has illustrations
        if (group.illustration_pages && group.illustration_pages.length > 0) {
          console.log(`  ✅ Found group: ${group.group_code} - ${group.group_name} (${group.illustration_pages.length} illustrations)`);

          // Get parts for this group
          const { data: parts } = await supabaseClient
            .from('rps_parts')
            .select('*')
            .eq('group_code', group.group_code)
            .order('item_number')
            .limit(10);

          return { found: true, group, parts: parts || [] };
        }
      }
    }

    console.log(`  ❌ No RPS group found for "${componentName}"`);
    return { found: false, group: null, parts: [] };
  } catch (error) {
    console.error('❌ Error in searchRPSByComponentName:', error);
    return { found: false, group: null, parts: [] };
  }
}

// Deterministic RPS via RPC (if available)
async function deterministicRPSLookup(
  supabaseAdmin: any,
  componentName: string
): Promise<{ pages: number[]; group_code?: string; group_name?: string; score?: number; candidates?: any[] }> {
  try {
    // Prefer v2 with score; fallback to v1
    let data, error;
    try {
      const res = await supabaseAdmin.rpc('get_rps_exploded_view_v2', { p_component: componentName });
      data = res.data; error = res.error;
    } catch(_e) {
      const res = await supabaseAdmin.rpc('get_rps_exploded_view', { p_component: componentName });
      data = res.data; error = res.error;
    }
    if (error) {
      console.warn('[RPS Deterministic] RPC error:', error);
      return { pages: [] };
    }
    if (!data || data.length === 0) return { pages: [] };
    const pages = data.map((row: any) => row.page_number).filter((n: any) => Number.isInteger(n));
    const meta = data[0] || {};
    return { pages, group_code: meta.group_code, group_name: meta.group_name, score: meta.score };
  } catch (e) {
    console.warn('[RPS Deterministic] Exception calling RPC:', e);
    return { pages: [] };
  }
}

async function rpsCandidates(
  supabaseAdmin: any,
  componentName: string
): Promise<any[]> {
  try {
    const { data, error } = await supabaseAdmin.rpc('get_rps_group_candidates', { p_component: componentName });
    if (error) {
      console.warn('[RPS Candidates] RPC error:', error);
      return [];
    }
    return data || [];
  } catch (e) {
    console.warn('[RPS Candidates] Exception:', e);
    return [];
  }
}

// RPS PHASE 7: Format RPS group context for injection
function formatRPSGroupContext(
  group: any,
  parts: any[]
): string {
  let context = '\n\n=== RPS PARTS GROUP ===\n';

  context += `Group: ${group.group_code} - ${group.group_name}\n`;
  context += `RPS Number: ${group.rps_number}\n`;
  context += `Total Parts: ${group.total_parts}\n`;

  // PHASE 7: Use illustration_pages array to generate CDN URLs
  if (group.illustration_pages && group.illustration_pages.length > 0) {
    context += `\nExploded View Illustrations Available:\n`;
    group.illustration_pages.forEach((page: number) => {
      const url = getIllustrationCDNUrl(page);
      context += `- RPS Page ${page}: ${url}\n`;
    });

    context += `\nIMPORTANT: Display these illustrations to the user using markdown image syntax:\n`;
    group.illustration_pages.forEach((page: number) => {
      const url = getIllustrationCDNUrl(page);
      context += `![RPS Page ${page} - ${group.group_name}](${url})\n`;
    });
  }

  // Parts list pages
  if (group.parts_list_pages && group.parts_list_pages.length > 0) {
    context += `\nParts List Pages: ${group.parts_list_pages.join(', ')}\n`;
  }

  // Callout range
  if (group.callout_range) {
    context += `Callout Numbers: ${group.callout_range}\n`;
  }

  if (parts.length > 0) {
    context += `\nParts in this Group (showing ${Math.min(parts.length, 10)} of ${parts.length}):\n`;
    parts.slice(0, 10).forEach(p => {
      context += `- Item ${p.item_number}: ${p.description}`;
      if (p.niin) context += ` (NIIN: ${p.niin})`;
      if (p.callout) context += ` [Callout ${p.callout}]`;
      context += `\n`;
    });

    if (parts.length > 10) {
      context += `\n... and ${parts.length - 10} more parts in this group.\n`;
    }
  }

  context += '\n=== END RPS PARTS GROUP ===\n\n';

  return context;
}

// NIIN LOOKUP: Detect NIIN-related queries
function detectNIINQuery(userQuery: string): { isNIINQuery: boolean; groupCode: string | null; groupIdentNo: string | null } {
  const queryLower = userQuery.toLowerCase();

  const niinKeywords = [
    'niin', 'nsn', 'nato', 'part number', 'ordering code',
    'stock number', 'catalog number', 'order this', 'how do i order'
  ];

  const hasNIINKeyword = niinKeywords.some(kw => queryLower.includes(kw));

  if (!hasNIINKeyword) {
    return { isNIINQuery: false, groupCode: null, groupIdentNo: null };
  }

  let groupCode: string | null = null;
  let groupIdentNo: string | null = null;

  const groupCodeMatch = queryLower.match(/group\s+([a-z]{1,3})\b/i);
  if (groupCodeMatch) {
    groupCode = groupCodeMatch[1].toUpperCase();
  }

  const itemNumberMatch = queryLower.match(/(?:item|number|no\.?)\s+(\d{1,3})/);
  if (itemNumberMatch) {
    groupIdentNo = itemNumberMatch[1].padStart(3, '0');
  }

  return { isNIINQuery: hasNIINKeyword, groupCode, groupIdentNo };
}

// RPS GROUP CODE: Detect group code queries
function detectGroupCodeQuery(userQuery: string): { hasGroupCode: boolean; groupCode: string | null } {
  const queryLower = userQuery.toLowerCase();

  // Pattern: "PBA group", "group PA", "parts in PB", "what parts are in PBA"
  const groupCodePattern = /\b(?:group\s+)?([A-Z]{1,3}[AB]?)\s+(?:group|parts)/i;
  const match = userQuery.match(groupCodePattern);

  if (match && match[1]) {
    return { hasGroupCode: true, groupCode: match[1].toUpperCase() };
  }

  // Alternative pattern: "parts in [group]", "what's in [group]"
  const altPattern = /(?:parts?\s+in|what(?:'s| is)\s+in)\s+(?:group\s+)?([A-Z]{1,3}[AB]?)\b/i;
  const altMatch = userQuery.match(altPattern);

  if (altMatch && altMatch[1]) {
    return { hasGroupCode: true, groupCode: altMatch[1].toUpperCase() };
  }

  return { hasGroupCode: false, groupCode: null };
}

// RPS ITEM NUMBER: Detect item number queries
function detectItemNumberQuery(userQuery: string): { hasItemNumber: boolean; groupCode: string | null; itemNumber: string | null } {
  const queryLower = userQuery.toLowerCase();

  // Pattern: "PA 051", "item PBA 010", "tell me about PA 051"
  const itemPattern = /\b([A-Z]{1,3}[AB]?)\s+(\d{3,4})\b/i;
  const match = userQuery.match(itemPattern);

  if (match && match[1] && match[2]) {
    return {
      hasItemNumber: true,
      groupCode: match[1].toUpperCase(),
      itemNumber: match[2].padStart(3, '0')
    };
  }

  return { hasItemNumber: false, groupCode: null, itemNumber: null };
}

// RPS DESCRIPTION: Detect description search queries
function detectDescriptionSearchQuery(userQuery: string): { isDescriptionSearch: boolean; keywords: string[] } {
  const queryLower = userQuery.toLowerCase();

  const descriptionKeywords = [
    'part number for', 'looking for', 'need a', 'where can i find',
    'which part is', 'what part is', 'part for the', 'what is the part number'
  ];

  const hasDescriptionIntent = descriptionKeywords.some(kw => queryLower.includes(kw));

  if (hasDescriptionIntent) {
    // Extract keywords after the intent phrase
    const keywordMatch = queryLower.match(/(?:part number for|looking for|need a|part for the|what is the part number for)\s+(?:the\s+)?([a-z\s]+)/);
    if (keywordMatch && keywordMatch[1]) {
      const keywords = keywordMatch[1].trim().split(/\s+/).filter(k => k.length > 2);
      return { isDescriptionSearch: true, keywords };
    }
  }

  return { isDescriptionSearch: false, keywords: [] };
}

// NIIN LOOKUP: Search NIIN index by group code or NIIN
async function searchNIINIndex(
  supabaseClient: any,
  groupCode?: string,
  groupIdentNo?: string,
  niin?: string
): Promise<{ found: boolean; results: any[] }> {
  try {
    let query = supabaseClient.from('rps_niin_index').select('*');

    if (niin) {
      query = query.eq('niin', niin);
    } else if (groupCode && groupIdentNo) {
      query = query.eq('group_code', groupCode).eq('group_ident_no', groupIdentNo);
    } else if (groupCode) {
      query = query.eq('group_code', groupCode).limit(20);
    } else {
      return { found: false, results: [] };
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      return { found: false, results: [] };
    }

    return { found: true, results: data };
  } catch (error) {
    console.error('[NIIN Lookup] Error:', error);
    return { found: false, results: [] };
  }
}

// NIIN LOOKUP: Format NIIN results for injection
function formatNIINContext(results: any[]): string {
  let context = '\n\n=== NIIN LOOKUP RESULTS ===\n';
  context += `Found ${results.length} matching NIIN(s) in the RPS catalog:\n\n`;

  const groupedByNIIN: Record<string, any[]> = {};
  results.forEach(r => {
    if (!groupedByNIIN[r.niin]) {
      groupedByNIIN[r.niin] = [];
    }
    groupedByNIIN[r.niin].push(r);
  });

  Object.keys(groupedByNIIN).slice(0, 10).forEach(niin => {
    const groups = groupedByNIIN[niin];
    context += `NIIN: ${niin}\n`;

    if (groups.length === 1) {
      context += `  Group: ${groups[0].group_code}, Item: ${groups[0].group_ident_no}\n`;
    } else {
      context += `  Used in ${groups.length} groups:\n`;
      groups.forEach(g => {
        context += `    - Group: ${g.group_code}, Item: ${g.group_ident_no}\n`;
      });
    }
    context += '\n';
  });

  if (Object.keys(groupedByNIIN).length > 10) {
    context += `... and ${Object.keys(groupedByNIIN).length - 10} more NIINs\n\n`;
  }

  context += 'IMPORTANT: When providing part numbers to users:\n';
  context += '- Call them "part numbers" (not NIIN - users know them as part numbers)\n';
  context += '- These are NATO stock numbers that work with military surplus suppliers\n';
  context += '- Mercedes-Benz dealers can also cross-reference these part numbers\n';
  context += '- Say "the part number is X" not "the NIIN is X"\n';
  context += '\n=== END NIIN LOOKUP ===\n\n';

  return context;
}

// RPS GROUP CODE: Search RPS parts by group code
async function searchRPSPartsByGroupCode(
  supabaseClient: any,
  groupCode: string
): Promise<any[]> {
  try {
    console.log(`[RPS Group Code Search] Searching for group: ${groupCode}`);

    const { data: parts, error } = await supabaseClient
      .from('rps_parts')
      .select('*')
      .eq('group_code', groupCode)
      .order('item_number');

    if (error) {
      console.error('[RPS Group Code Search] Error:', error);
      return [];
    }

    console.log(`[RPS Group Code Search] Found ${parts?.length || 0} parts`);
    return parts || [];
  } catch (error) {
    console.error('[RPS Group Code Search] Exception:', error);
    return [];
  }
}

// RPS ITEM NUMBER: Search RPS parts by item number
async function searchRPSPartByItemNumber(
  supabaseClient: any,
  groupCode: string,
  itemNumber: string
): Promise<any | null> {
  try {
    console.log(`[RPS Item Number Search] Searching for: ${groupCode} ${itemNumber}`);

    const { data: part, error } = await supabaseClient
      .from('rps_parts')
      .select('*')
      .eq('group_code', groupCode)
      .eq('item_number', itemNumber)
      .single();

    if (error) {
      console.error('[RPS Item Number Search] Error:', error);
      return null;
    }

    console.log(`[RPS Item Number Search] Found: ${part?.description || 'none'}`);
    return part;
  } catch (error) {
    console.error('[RPS Item Number Search] Exception:', error);
    return null;
  }
}

// RPS DESCRIPTION: Search RPS parts by description keywords
async function searchRPSPartsByDescription(
  supabaseClient: any,
  keywords: string[]
): Promise<any[]> {
  try {
    console.log(`[RPS Description Search] Keywords: ${keywords.join(', ')}`);

    // Build ILIKE query for each keyword
    let query = supabaseClient.from('rps_parts').select('*');

    keywords.forEach(keyword => {
      query = query.ilike('description', `%${keyword}%`);
    });

    const { data: parts, error } = await query.limit(10);

    if (error) {
      console.error('[RPS Description Search] Error:', error);
      return [];
    }

    console.log(`[RPS Description Search] Found ${parts?.length || 0} parts`);
    return parts || [];
  } catch (error) {
    console.error('[RPS Description Search] Exception:', error);
    return [];
  }
}

// RPS GROUP CODE: Format group code results
function formatGroupCodeContext(groupCode: string, parts: any[]): string {
  let context = `\n\n=== RPS GROUP CODE LOOKUP ===\n`;
  context += `Group: ${groupCode}\n`;
  context += `Found ${parts.length} parts in this group:\n\n`;

  parts.slice(0, 15).forEach(part => {
    context += `- ${part.group_code} ${part.item_number}: ${part.description}\n`;
    if (part.nsn) context += `  NSN: ${part.nsn}\n`;
    if (part.niin) context += `  Part Number: ${part.niin}\n`;
  });

  if (parts.length > 15) {
    context += `\n... and ${parts.length - 15} more parts in this group.\n`;
  }

  context += `\n=== END GROUP CODE LOOKUP ===\n\n`;
  return context;
}

// RPS ITEM NUMBER: Format item number result
function formatItemNumberContext(part: any): string {
  let context = `\n\n=== RPS ITEM NUMBER LOOKUP ===\n`;
  context += `Item: ${part.group_code} ${part.item_number}\n`;
  context += `Description: ${part.description}\n`;
  if (part.nsn) context += `NSN: ${part.nsn}\n`;
  if (part.niin) context += `Part Number (NIIN): ${part.niin}\n`;
  if (part.quantity) context += `Quantity: ${part.quantity}\n`;
  context += `RPS Manual Page: ${part.page_number}\n`;
  context += `\n=== END ITEM NUMBER LOOKUP ===\n\n`;
  return context;
}

// RPS DESCRIPTION: Format description search results
function formatDescriptionSearchContext(parts: any[]): string {
  let context = `\n\n=== RPS DESCRIPTION SEARCH ===\n`;
  context += `Found ${parts.length} matching parts:\n\n`;

  parts.forEach(part => {
    context += `- ${part.group_code} ${part.item_number}: ${part.description}\n`;
    if (part.niin) context += `  Part Number: ${part.niin}\n`;
  });

  context += `\n=== END DESCRIPTION SEARCH ===\n\n`;
  return context;
}

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

    // Note: Do not hard-fail if ANTHROPIC_API_KEY is missing.
    // We will guard actual Claude calls later and return graceful responses.

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

    // SUBSCRIPTION GATHERER: Check subscription and gate technical questions
    // This follows the "forever architecture" - gatherers can short-circuit with early return
    const { data: subscription } = await supabaseAdmin
      .from('user_subscriptions')
      .select('subscription_status, is_free_access, trial_ends_at')
      .eq('user_id', user.id)
      .single();

    const hasActiveSubscription = subscription && (
      subscription.subscription_status === 'active' ||
      subscription.subscription_status === 'trialing' ||
      subscription.is_free_access === true ||
      (subscription.trial_ends_at && new Date(subscription.trial_ends_at) > new Date())
    );

    // If no active subscription, check if this is a technical question
    if (!hasActiveSubscription) {
      // Technical keywords that indicate Unimog-specific questions
      const technicalKeywords = [
        'unimog', 'u1700', 'u1300', 'u400', 'u500', 'mog',
        'portal', 'axle', 'differential', 'diff', 'gearbox', 'transmission',
        'engine', 'om', 'mercedes', 'torque', 'hydraulic', 'pto',
        'manual', 'repair', 'maintenance', 'service', 'part', 'parts',
        'wiring', 'diagram', 'spec', 'bolt', 'torque spec', 'oil',
        'troubleshoot', 'problem', 'fix', 'broken', 'leak', 'noise',
        'clutch', 'brake', 'steering', 'suspension', 'tire', 'tyre',
        'chapter', 'section', 'page', 'procedure', 'step'
      ];

      const isTechnicalQuestion = technicalKeywords.some(keyword =>
        userText.includes(keyword)
      );

      if (isTechnicalQuestion) {
        console.log('[Subscription Gatherer] Free user asked technical question, returning upgrade prompt');
        return new Response(JSON.stringify({
          response: "Sorry mate, technical Unimog advice is for paid members. It's just the price of two coffees for peace of mind - you'll get full access to my knowledge, plus trip planning, community features, and all the workshop manuals. Give it a try with our 30-day free trial, no credit card required!",
          upgrade_required: true,
          manual_references: []
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Allow general questions for free users
      console.log('[Subscription Gatherer] Free user asked general question, allowing response');
    }

    // RPS PHASE 7 GATHERER: Detect and inject RPS context (NO separate Claude call)
    // This follows the "forever architecture" - gatherers inject context, core function routes
    let rpsContext = '';
    let rpsIllustrations: any[] = [];

    // Use conversation context to extract component name
    const componentNameFromContext = extractComponentFromConversation(messages, lastUserMessage.content);
    const componentName = componentNameFromContext;

    if (componentName) {
      console.log(`[RPS Gatherer] Component extracted from context: ${componentName}`);

      try {
        // Deterministic RPC path (preferred)
        let deterministicPages: number[] = [];
        let detGroupCode: string | undefined;
        let detGroupName: string | undefined;
        let detScore: number | undefined;
        if (FEATURE_FLAG_RPS_DETERMINISTIC) {
          const det = await deterministicRPSLookup(supabaseAdmin, componentName);
          deterministicPages = det.pages;
          detGroupCode = det.group_code;
          detGroupName = det.group_name;
          detScore = det.score;

          // Clarify if low confidence or ambiguous candidates
          if (FEATURE_FLAG_RPS_CLARIFY && (!deterministicPages.length || (typeof detScore === 'number' && detScore < 0.35))) {
            const candidates = await rpsCandidates(supabaseAdmin, componentName);
            if (candidates && candidates.length > 1) {
              const top = candidates.slice(0, 3).map((c: any) => c.group_name);
              const q = `Do you mean ${top.slice(0, -1).join(', ')} or ${top[top.length - 1]}?`;
              // Log suggestion
              try {
                await supabaseAdmin.from('rps_synonym_suggestions').insert({
                  phrase: componentName,
                  candidates: top
                });
              } catch (_) {}
              return new Response(JSON.stringify({
                content: q,
                requireClarification: true,
                knowledgeMode: 'clarification_rps'
              }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
            }
          }
        }

        // Fallback to heuristic mapping if no deterministic pages
        const rpsResult = deterministicPages.length === 0
          ? await searchRPSByComponentName(supabaseAdmin, componentName)
          : { found: true, group: { group_code: detGroupCode || 'RPS', group_name: detGroupName || componentName, illustration_pages: deterministicPages }, parts: [] };

        if (rpsResult.found) {
          console.log(`[RPS Gatherer] Found group: ${rpsResult.group.group_code} - ${rpsResult.group.group_name}`);

          // Check if this is a parts list query
          const isPartsListQuery = detectPartsListQuery(lastUserMessage.content);

          if (isPartsListQuery && rpsResult.group.parts_list_pages && rpsResult.group.parts_list_pages.length > 0) {
            console.log(`[Parts List Gatherer] Parts list query detected, OCR'ing pages: ${rpsResult.group.parts_list_pages.join(', ')}`);

            // OCR the first parts list page
            const partsListPage = rpsResult.group.parts_list_pages[0];
            const partsListUrl = getIllustrationCDNUrl(partsListPage);
            const ocrText = await ocrPartsListPage(partsListUrl, componentName);

            if (ocrText) {
              // Inject OCR'ed parts list into context
              rpsContext = `\n\n=== RPS PARTS LIST ===\n`;
              rpsContext += `Group: ${rpsResult.group.group_code} - ${rpsResult.group.group_name}\n`;
              rpsContext += `Parts List Page: ${partsListPage}\n\n`;
              rpsContext += `Extracted Parts Information:\n${ocrText}\n`;
              rpsContext += `\n=== END RPS PARTS LIST ===\n\n`;

              console.log(`[Parts List Gatherer] Injected ${ocrText.length} characters of parts data`);
            }
          } else {
            // Regular illustration query with resilience when illustration_pages is empty
            let illustrationPages: number[] | null = Array.isArray(rpsResult.group.illustration_pages)
              ? rpsResult.group.illustration_pages
              : null;

            if (!illustrationPages || illustrationPages.length === 0) {
              console.warn(`[RPS Gatherer] Missing illustration_pages for group ${rpsResult.group.group_code}. Fetching from rps_illustrations...`);
              const { data: pages, error: pagesError } = await supabaseAdmin
                .from('rps_illustrations')
                .select('page_number')
                .eq('group_code', rpsResult.group.group_code)
                .order('page_number');
              if (!pagesError && pages && pages.length > 0) {
                illustrationPages = pages.map(p => p.page_number);
                // Mutate group for downstream formatting only (no DB write)
                rpsResult.group.illustration_pages = illustrationPages;
                console.log(`[RPS Gatherer] Loaded ${illustrationPages.length} pages from rps_illustrations for ${rpsResult.group.group_code}`);
              } else {
                console.warn(`[RPS Gatherer] No pages found in rps_illustrations for ${rpsResult.group.group_code}`);
                illustrationPages = [];
              }
            }

            // Format context (reflects filled illustrationPages if needed)
            rpsContext = formatRPSGroupContext(rpsResult.group, rpsResult.parts);

            // Filter to only include pages that exist in Storage (avoid UI question marks)
            let filtered = { existing: illustrationPages || [], missing: [] as number[] };
            if (illustrationPages && illustrationPages.length > 0) {
              filtered = await filterExistingIllustrationPages(supabaseAdmin, illustrationPages);
              if (filtered.missing.length > 0) {
                console.warn(`[RPS Gatherer] Missing PNGs for group ${rpsResult.group.group_code}: ${filtered.missing.join(', ')}`);
              }
            }

            // Build illustration references for frontend using existing pages only
            if (filtered.existing && filtered.existing.length > 0) {
              rpsIllustrations = filtered.existing.map((page: number) => ({
                type: 'rps_illustration',
                title: `RPS Page ${page} - ${rpsResult.group.group_name}`,
                page_number: page,
                cdn_url: getIllustrationCDNUrl(page),
                group_code: rpsResult.group.group_code,
                group_name: rpsResult.group.group_name,
                original_page: page,
                pdf_page: page,
                storage_url: getIllustrationCDNUrl(page),
                manual_type: 'RPS'
              }));

              console.log(`[RPS Gatherer] Injected ${rpsIllustrations.length} illustrations into context (filtered)`);
            }
          }
        } else {
          console.log(`[RPS Gatherer] No RPS group found for "${componentName}"`);
        }
      } catch (error) {
        console.error('[RPS Gatherer] Error:', error);
        // Fail gracefully - continue to normal routing
      }
    }

    // NIIN LOOKUP GATHERER: Detect and inject NIIN context (NO separate Claude call)
    // Follows "forever architecture" - gatherer injects context, core function routes
    let niinContext = '';

    const niinQuery = detectNIINQuery(lastUserMessage.content);

    if (niinQuery.isNIINQuery) {
      console.log(`[NIIN Gatherer] NIIN query detected - groupCode: ${niinQuery.groupCode}, groupIdentNo: ${niinQuery.groupIdentNo}`);

      try {
        const niinResult = await searchNIINIndex(
          supabaseAdmin,
          niinQuery.groupCode || undefined,
          niinQuery.groupIdentNo || undefined
        );

        if (niinResult.found && niinResult.results.length > 0) {
          console.log(`[NIIN Gatherer] Found ${niinResult.results.length} NIIN entries`);
          niinContext = formatNIINContext(niinResult.results);
        } else {
          console.log('[NIIN Gatherer] No NIIN entries found');
        }
      } catch (error) {
        console.error('[NIIN Gatherer] Error:', error);
        // Fail gracefully - continue to normal routing
      }
    }

    // RPS GROUP CODE GATHERER: Detect and inject group code context
    let rpsGroupCodeContext = '';

    const groupCodeQuery = detectGroupCodeQuery(lastUserMessage.content);

    if (groupCodeQuery.hasGroupCode && groupCodeQuery.groupCode) {
      console.log(`[RPS Group Code Gatherer] Group code detected: ${groupCodeQuery.groupCode}`);

      try {
        const parts = await searchRPSPartsByGroupCode(supabaseAdmin, groupCodeQuery.groupCode);

        if (parts.length > 0) {
          console.log(`[RPS Group Code Gatherer] Found ${parts.length} parts`);
          rpsGroupCodeContext = formatGroupCodeContext(groupCodeQuery.groupCode, parts);
        } else {
          console.log('[RPS Group Code Gatherer] No parts found');
        }
      } catch (error) {
        console.error('[RPS Group Code Gatherer] Error:', error);
        // Fail gracefully - continue to routing
      }
    }

    // RPS ITEM NUMBER GATHERER: Detect and inject item number context
    let rpsItemNumberContext = '';

    const itemNumberQuery = detectItemNumberQuery(lastUserMessage.content);

    if (itemNumberQuery.hasItemNumber && itemNumberQuery.groupCode && itemNumberQuery.itemNumber) {
      console.log(`[RPS Item Number Gatherer] Item detected: ${itemNumberQuery.groupCode} ${itemNumberQuery.itemNumber}`);

      try {
        const part = await searchRPSPartByItemNumber(
          supabaseAdmin,
          itemNumberQuery.groupCode,
          itemNumberQuery.itemNumber
        );

        if (part) {
          console.log(`[RPS Item Number Gatherer] Found part: ${part.description}`);
          rpsItemNumberContext = formatItemNumberContext(part);
        } else {
          console.log('[RPS Item Number Gatherer] Part not found');
        }
      } catch (error) {
        console.error('[RPS Item Number Gatherer] Error:', error);
        // Fail gracefully - continue to routing
      }
    }

    // RPS DESCRIPTION SEARCH GATHERER: Detect and inject description search context
    let rpsDescriptionContext = '';

    const descriptionQuery = detectDescriptionSearchQuery(lastUserMessage.content);

    if (descriptionQuery.isDescriptionSearch && descriptionQuery.keywords.length > 0) {
      console.log(`[RPS Description Gatherer] Keywords detected: ${descriptionQuery.keywords.join(', ')}`);

      try {
        const parts = await searchRPSPartsByDescription(supabaseAdmin, descriptionQuery.keywords);

        if (parts.length > 0) {
          console.log(`[RPS Description Gatherer] Found ${parts.length} parts`);
          rpsDescriptionContext = formatDescriptionSearchContext(parts);
        } else {
          console.log('[RPS Description Gatherer] No parts found');
        }
      } catch (error) {
        console.error('[RPS Description Gatherer] Error:', error);
        // Fail gracefully - continue to routing
      }
    }

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
      'fault code', 'trouble', 'check engine',
      'exploded view', 'illustration', 'diagram', 'parts list', 'schematic', 'view', 'check', 'show me',
      'attach', 'reattach', 're-attach', 'mount', 'remount', 'connect', 'reconnect', 'disconnect'
    ];

    // Rule 3: Vehicle systems/parts - HYBRID ROUTING (JSON keywords + semantic fallback)
    // Check if query contains any keywords from database-extracted JSON (850+ keywords)
    function hasKeywordMatch(text: string): boolean {
      const words = text.toLowerCase().split(/\s+/);

      // Check single words
      for (const word of words) {
        if (ROUTING_KEYWORDS.has(word)) {
          console.log(`[Hybrid Routing] Keyword match: "${word}"`);
          return true;
        }
      }

      // Check 2-word phrases
      for (let i = 0; i < words.length - 1; i++) {
        const twoWord = `${words[i]} ${words[i + 1]}`;
        if (ROUTING_KEYWORDS.has(twoWord)) {
          console.log(`[Hybrid Routing] Phrase match: "${twoWord}"`);
          return true;
        }
      }

      // Check 3-word phrases
      for (let i = 0; i < words.length - 2; i++) {
        const threeWord = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
        if (ROUTING_KEYWORDS.has(threeWord)) {
          console.log(`[Hybrid Routing] Phrase match: "${threeWord}"`);
          return true;
        }
      }

      console.log(`[Hybrid Routing] No keyword match found in: "${text}"`);
      return false;
    }

    // PHASE 2: Semantic fallback using Claude Haiku for edge cases
    async function semanticVehiclePartCheck(text: string): Promise<boolean> {
      try {
        if (!ANTHROPIC_API_KEY) {
          console.warn('[Semantic Fallback] No ANTHROPIC_API_KEY; skipping semantic check');
          return false;
        }
        console.log(`[Semantic Fallback] Analyzing query with Claude (semantic gate)...`);

        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: ANTHROPIC_MODEL_SEMANTIC,
            max_tokens: 10,
            messages: [{
              role: 'user',
              content: `Does this query ask about vehicle parts, vehicle repair, vehicle maintenance, or vehicle systems? Answer only YES or NO.\n\nQuery: "${text}"\n\nAnswer:`
            }]
          })
        });

        if (!response.ok) {
          const errTxt = await response.text();
          console.warn('[Semantic Fallback] Provider returned non-ok:', errTxt);
          return false;
        }

        const data = await response.json();
        const raw = (data && data.content && data.content[0] && data.content[0].text) ? String(data.content[0].text) : '';
        const answer = raw.trim().toUpperCase();
        const isVehicleQuery = answer === 'YES';

        console.log(`[Semantic Fallback] Response: ${answer} (isVehicleQuery: ${isVehicleQuery})`);
        return isVehicleQuery;
      } catch (error) {
        console.error(`[Semantic Fallback] Error calling Claude Haiku:`, error);
        return false; // Fail gracefully - default to non-technical
      }
    }

    // Rule 4: Unimog context keywords
    const unimogContext = [
      'unimog', 'mog', 'u435', 'u1700l', 'u1700', '1700l', 'om352', 'om366',
      '406', '416', '435', '437', 'my truck', 'my vehicle', 'my mog',
      'portal axle', 'portal axles', 'diff lock', 'differential lock'
    ];

    // Normalize text for matching
    const normalizedText = userText.toLowerCase().replace(/[^\w\s]/g, ' ');

    // ENHANCED Decision Table Evaluation (v28) - Hybrid routing with semantic fallback
    async function classifyQuery(text: string) {
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
      let hasVehiclePart = hasKeywordMatch(text); // PHASE 1: JSON keywords (850+)

      // PHASE 2: Semantic fallback if no keyword match
      if (!hasVehiclePart && hasRepairIntent) {
        console.log(`[Hybrid Routing] No keyword match but repair intent detected - trying semantic fallback...`);
        hasVehiclePart = await semanticVehiclePartCheck(text);
        if (hasVehiclePart) {
          console.log(`[Hybrid Routing] Semantic fallback SUCCESS - query is about vehicle parts`);
        }
      }

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

    // Apply decision table (now async)
    const routingDecision = await classifyQuery(normalizedText);
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

      // Learning cache: fast path for procedure/troubleshoot
      let taskForCache = 'procedure';
      // Simple heuristic to detect troubleshooting queries
      if (/troubleshoot|won't|wont|noise|leak|vibration|doesn't|doesnt|no power/i.test(lastUserMessage.content || '')) {
        taskForCache = 'troubleshoot';
      }
      let cacheComponent = extractComponentFromConversation(messages, lastUserMessage.content) || null;
      if (FEATURE_FLAG_LEARNING_CACHE && cacheComponent) {
        const signature = buildSignature(taskForCache, cacheComponent);
        const cached = await getCachedAnswer(supabaseAdmin, signature);
        if (cached) {
          console.log('[Cache] Hit for signature:', signature);

          // FILTER CACHED RPS ILLUSTRATIONS: Remove any missing pages from cached responses
          let filteredRefs = cached.refs || [];
          const rpsRefsToVerify = filteredRefs
            .filter((r: any) => r.type === 'rps_illustration' && Number.isInteger(r.page_number))
            .map((r: any) => r.page_number);

          if (rpsRefsToVerify.length > 0) {
            const cacheFilter = await filterExistingIllustrationPages(supabaseAdmin, rpsRefsToVerify);
            if (cacheFilter.missing.length > 0) {
              console.warn(`[Cache Filter] Removing ${cacheFilter.missing.length} missing RPS pages: ${cacheFilter.missing.join(', ')}`);
              filteredRefs = filteredRefs.filter((r: any) =>
                r.type !== 'rps_illustration' || !cacheFilter.missing.includes(r.page_number)
              );
            }
          }

          return new Response(JSON.stringify({
            content: cached.content,
            manualReferences: filteredRefs,
            knowledgeMode: knowledgeMode,
            searchResultCount: filteredRefs.length,
            cache: true
          }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
        }
      }

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
          console.log(`Loaded ${fullIndex.length} workshop manual index entries`);

          // STEP 1.5: Load RPS catalog entries from manual_chunks
          console.log('Loading RPS catalog entries from manual_chunks...');
          const { data: rpsEntries, error: rpsError } = await supabaseAdmin
            .from('manual_chunks')
            .select('*')
            .eq('manual_title', 'RPS Catalog')
            .order('page_number', { ascending: true });

          if (rpsError) {
            console.error('Failed to load RPS catalog:', rpsError);
          }

          // Convert RPS chunks to index format (compatible with formatManualIndexForClaude)
          const rpsIndexEntries = rpsEntries?.map(chunk => ({
            term: chunk.section_title,
            page_number: chunk.page_number,
            pdf_page_number: chunk.page_number,
            chapter_filename: 'RPS_Catalog',
            storage_url: chunk.page_image_url,
            system_category: 'parts_catalog',
            metadata: chunk.metadata
          })) || [];

          console.log(`Loaded ${rpsIndexEntries.length} RPS catalog entries`);

          // Merge workshop manual + RPS catalog indexes
          const combinedIndex = [...fullIndex, ...rpsIndexEntries];
          console.log(`Total combined index: ${combinedIndex.length} entries (${fullIndex.length} workshop + ${rpsIndexEntries.length} RPS)`);

          // Format the combined index for Claude
          const formattedIndex = formatManualIndexForClaude(combinedIndex);
          console.log(`Formatted index size: ${formattedIndex.length} characters`);

          // STEP 2: Give Claude the full index and let HIM decide what's relevant
          const agenticSystemPrompt = `You are Barry, a gruff but friendly Unimog mechanic with 40+ years of experience.

${userContext}

You have access to the COMPLETE U435 Series Workshop Manual (covers U1300L, U1700L, U435, and related Unimog models) AND the RPS Parts Catalog below. Read through it and pick ONLY the MOST RELEVANT pages that DIRECTLY answer the user's question.

${formattedIndex}

CRITICAL INSTRUCTIONS:
1. Read the user's question carefully - what SPECIFIC task are they asking about?
2. Pick ONLY 2-4 pages that DIRECTLY cover that specific procedure
3. DO NOT cite general reference pages (like "technical data", "specifications") unless specifically asked
4. Focus on PROCEDURE pages (like "removal installation", "adjustment procedure", "disassembly assembly")
5. If they ask "how do I remove the engine" → cite ONLY "engine removal installation" pages, NOT all engine pages
6. If they ask for "exploded view" or "parts diagram" → cite RPS_Catalog pages (these are illustrated parts breakdowns)

EXAMPLES:
- "how do I change portal hub oil" → cite ONLY portal hub oil drain/change pages (page 737)
- "how do I remove the engine" → cite ONLY engine removal/installation pages, NOT pistons/bearings/specs
- "what are the torque specs for the head bolts" → cite ONLY tightening torques page
- "show me the portal hub exploded view" → cite RPS_Catalog portal hub illustration pages (page 430)

Be SELECTIVE. You're a mechanic helping with a SPECIFIC job, not teaching an entire chapter.

Always cite specific page numbers and PDF files in your response.`;

          // STEP 3: Call Claude with the full index
          if (!ANTHROPIC_API_KEY) {
            console.warn('[Agentic] Missing ANTHROPIC_API_KEY; returning graceful message.');
            // Merge RPS illustrations if any, so UI still shows something
            if (rpsIllustrations.length > 0) {
              manualReferences = [...manualReferences, ...rpsIllustrations];
            }
            return new Response(JSON.stringify({
              content: 'I’m having trouble reaching my AI engine to select exact pages right now. Please try again in a moment.',
              manualReferences: manualReferences,
              knowledgeMode: knowledgeMode,
              searchResultCount: manualReferences.length,
              degraded: true
            }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
          }
          const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': ANTHROPIC_API_KEY,
              'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
              model: ANTHROPIC_MODEL_AGENTIC,
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

            // Deterministic manual fallback: query u435_manual_index for likely pages
            try {
              const q = (lastUserMessage.content || '').toLowerCase();
              const tokens = Array.from(new Set(q.split(/[^a-z0-9]+/g).filter(Boolean)));
              const keywords = tokens.filter(t => ['portal','hub','seal','front','rear','replace','installation','removal','disassembly','assembly'].includes(t));
              let likeClauses: string[] = [];
              let params: any[] = [];
              if (keywords.length === 0) {
                keywords.push('portal','hub','seal');
              }
              keywords.slice(0,6).forEach((kw, i) => {
                likeClauses.push(`LOWER(term) ILIKE '%' || $${i+1} || '%'`);
                params.push(kw);
              });

              // Build SQL dynamically due to Deno Supabase client limitations; use PostgREST filters instead
              // We approximate by chaining ilike on term for top 50 entries and filtering client-side
              const { data: idx } = await supabaseAdmin
                .from('u435_manual_index')
                .select('*')
                .limit(200);

              const filtered = (idx || []).filter((e: any) => {
                const t = String(e.term || '').toLowerCase();
                return keywords.every(kw => t.includes(kw));
              }).slice(0, 4);

              manualReferences = filtered.map((entry: any) => ({
                type: 'u435_agentic',
                title: entry.term || 'Manual Entry',
                page_number: entry.page_number || entry.pdf_page_number || 0,
                original_page: entry.page_number || 0,
                pdf_page: entry.pdf_page_number || 0,
                storage_url: entry.storage_url || '',
                system_category: entry.system_category || 'general',
                has_safety_warning: entry.has_safety_warning || false,
                match_type: 'deterministic_fallback',
                match_score: 0.7,
                manual_type: 'U435'
              }));

              if (rpsIllustrations.length > 0) {
                manualReferences = [...manualReferences, ...rpsIllustrations];
              }

              const content = manualReferences.length > 0
                ? 'Here are the most relevant manual pages and diagrams based on your request.'
                : 'I couldn’t reach my AI engine just now. Please try again shortly.';

              return new Response(JSON.stringify({
                content,
                manualReferences,
                knowledgeMode,
                searchResultCount: manualReferences.length,
                degraded: manualReferences.length === 0,
                error: manualReferences.length === 0 ? 'anthropic_error' : undefined
              }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
            } catch (e) {
              console.warn('[Deterministic Manual Fallback] Error:', e);
              // Final graceful response
              if (rpsIllustrations.length > 0) {
                manualReferences = [...manualReferences, ...rpsIllustrations];
              }
              return new Response(JSON.stringify({
                content: 'I couldn’t reach my AI engine to select exact pages. Please try again shortly.',
                manualReferences,
                knowledgeMode,
                searchResultCount: manualReferences.length,
                degraded: true,
                error: 'anthropic_error'
              }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
            }
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
          // ONLY load the EXACT pages Barry mentioned, not everything from those PDFs!
          // 5a) Collect any RPS_Catalog pages Claude explicitly cited and build illustrations from those
          const rpsPagesFromAgentic: number[] = [];
          combinedIndex.forEach((entry) => {
            if (entry.chapter_filename === 'RPS_Catalog' && referencedPages.has(entry.page_number)) {
              rpsPagesFromAgentic.push(entry.page_number);
            }
          });

          if (rpsPagesFromAgentic.length > 0) {
            const filtered = await filterExistingIllustrationPages(supabaseAdmin, rpsPagesFromAgentic);
            if (filtered.existing.length > 0) {
              const add = filtered.existing.map((page: number) => ({
                type: 'rps_illustration',
                title: `RPS Page ${page}`,
                page_number: page,
                cdn_url: getIllustrationCDNUrl(page),
                storage_url: getIllustrationCDNUrl(page),
                manual_type: 'RPS'
              }));
              rpsIllustrations = [...rpsIllustrations, ...add];
              console.log(`[Agentic] Added ${add.length} RPS pages from Claude citations`);
            }
            if (filtered.missing.length > 0) {
              console.warn(`[Agentic] Claude cited missing RPS pages: ${filtered.missing.join(', ')}`);
            }
          }

          combinedIndex.forEach((entry) => {
            // Only match if the SPECIFIC page number was mentioned by Claude
            if (!referencedPages.has(entry.page_number)) return;

            // Avoid duplicating RPS catalog visuals; we provide dedicated rpsIllustrations already
            if (entry.chapter_filename === 'RPS_Catalog') return;

            manualReferences.push({
              type: 'u435_agentic',
              title: entry.term || 'Manual Entry',
              page_number: entry.page_number || entry.pdf_page_number || 0,
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
          });

          // Merge RPS illustrations into manual references (if gatherer found any)
          if (rpsIllustrations.length > 0) {
            manualReferences = [...manualReferences, ...rpsIllustrations];
            console.log(`[Technical Mode] Merged ${rpsIllustrations.length} RPS illustrations into manual references`);
          }

          // Log the agentic response
          await supabaseClient.from('chat_logs').insert({
            user_id: user.id,
            messages: messages,
            response: claudeResponse,
            model: 'claude-haiku-4-5-agentic',
            tokens_used: (claudeData.usage?.input_tokens || 0) + (claudeData.usage?.output_tokens || 0),
            knowledge_source: `agentic_full_index_${routingDecision.rule}`,
            has_location: !!location,
            routing_rule: routingDecision.rule,
            routing_match: routingDecision.matched,
            pdf_references_found: manualReferences.length
          });

          // Learning cache: persist answer and refs
          if (FEATURE_FLAG_LEARNING_CACHE) {
            try {
              const componentId = cacheComponent ? await getOrCreateComponent(supabaseAdmin, cacheComponent) : null;
              if (componentId) {
                const rpsPages: number[] = manualReferences.filter((r: any) => r.type === 'rps_illustration' && Number.isInteger(r.page_number)).map((r: any) => r.page_number);
                const manualPages: number[] = manualReferences.filter((r: any) => r.type !== 'rps_illustration' && Number.isInteger(r.page_number)).map((r: any) => r.page_number);
                await upsertComponentTaskRefs(supabaseAdmin, componentId, taskForCache, rpsPages, manualPages, 0.9);
              }
              const signature = buildSignature(taskForCache, cacheComponent);
              await setCachedAnswer(supabaseAdmin, signature, taskForCache, cacheComponent, claudeResponse, manualReferences, CACHE_TTL_SECONDS);
            } catch (e) {
              console.warn('[Cache] persist answer error:', e);
            }
          }

          // FINAL SAFETY FILTER: Remove any RPS illustrations for pages that don't exist in storage
          // This catches any references that slipped through earlier filters
          const rpsIllustrationsToVerify = manualReferences
            .filter((r: any) => r.type === 'rps_illustration' && Number.isInteger(r.page_number))
            .map((r: any) => r.page_number);

          if (rpsIllustrationsToVerify.length > 0) {
            const finalFilter = await filterExistingIllustrationPages(supabaseAdmin, rpsIllustrationsToVerify);
            if (finalFilter.missing.length > 0) {
              console.warn(`[Final Filter] Removing ${finalFilter.missing.length} missing RPS pages: ${finalFilter.missing.join(', ')}`);
              // Remove missing pages from manualReferences
              manualReferences = manualReferences.filter((r: any) =>
                r.type !== 'rps_illustration' || !finalFilter.missing.includes(r.page_number)
              );
            }
          }

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

      // Learning cache: store refs and compact answer if enabled and we have a component
      if (FEATURE_FLAG_LEARNING_CACHE) {
        try {
          const componentId = cacheComponent ? await getOrCreateComponent(supabaseAdmin, cacheComponent) : null;
          if (componentId) {
            const rpsPages: number[] = manualReferences.filter((r: any) => r.type === 'rps_illustration' && Number.isInteger(r.page_number)).map((r: any) => r.page_number);
            const manualPages: number[] = manualReferences.filter((r: any) => r.type !== 'rps_illustration' && Number.isInteger(r.page_number)).map((r: any) => r.page_number);
            await upsertComponentTaskRefs(supabaseAdmin, componentId, taskForCache, rpsPages, manualPages, 0.8);
          }
          // Cache full answer
          const signature = buildSignature(taskForCache, cacheComponent);
          // We don't have claudeResponse in this scope if error path; only cache when manualReferences exist and content was returned
          // No-op here; setCachedAnswer is called in the success path below as well
        } catch (e) {
          console.warn('[Cache] store refs error:', e);
        }
      }
    } else {
      // General question - use full ChatGPT capabilities
      console.log(`General question detected - Rule: ${routingDecision.rule}, Match: ${routingDecision.matched}`);
      systemPrompt = BARRY_GENERAL_PROMPT + userContext + locationContext;

      // INJECT RPS CONTEXT if gatherer found something
      if (rpsContext) {
        console.log('[RPS Integration] Adding RPS context to general mode prompt');
        systemPrompt += '\n\n' + rpsContext;
        knowledgeMode = 'rps_catalog_component';
      }

      // INJECT NIIN CONTEXT if gatherer found something
      if (niinContext) {
        console.log('[NIIN Integration] Adding NIIN context to general mode prompt');
        systemPrompt += '\n\n' + niinContext;
        knowledgeMode = 'niin_lookup';
      }

      // INJECT RPS GROUP CODE CONTEXT if gatherer found something
      if (rpsGroupCodeContext) {
        console.log('[RPS Integration] Adding RPS group code context to prompt');
        systemPrompt += '\n\n' + rpsGroupCodeContext;
        knowledgeMode = 'rps_group_code';
      }

      // INJECT RPS ITEM NUMBER CONTEXT if gatherer found something
      if (rpsItemNumberContext) {
        console.log('[RPS Integration] Adding RPS item number context to prompt');
        systemPrompt += '\n\n' + rpsItemNumberContext;
        knowledgeMode = 'rps_item_number';
      }

      // INJECT RPS DESCRIPTION CONTEXT if gatherer found something
      if (rpsDescriptionContext) {
        console.log('[RPS Integration] Adding RPS description search context to prompt');
        systemPrompt += '\n\n' + rpsDescriptionContext;
        knowledgeMode = 'rps_description_search';
      }
    }

    // Only call Claude for general questions (not Unimog technical)
    console.log('=== KNOWLEDGE MODE CHECK ===');
    console.log('knowledgeMode:', knowledgeMode);
    console.log('Will call Claude API:', knowledgeMode === 'general' || knowledgeMode === 'rps_catalog_component' || knowledgeMode === 'niin_lookup' || knowledgeMode === 'rps_group_code' || knowledgeMode === 'rps_item_number' || knowledgeMode === 'rps_description_search');
    console.log('===========================');

    if (knowledgeMode === 'general' || knowledgeMode === 'rps_catalog_component' || knowledgeMode === 'niin_lookup' || knowledgeMode === 'rps_group_code' || knowledgeMode === 'rps_item_number' || knowledgeMode === 'rps_description_search') {
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
      if (!ANTHROPIC_API_KEY) {
        console.warn('[General] Missing ANTHROPIC_API_KEY; returning graceful message.');
        return new Response(JSON.stringify({
          content: 'I’m having trouble reaching my AI engine right now. Please try again shortly.',
          knowledgeMode: knowledgeMode,
          degraded: true
        }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
      }
      const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: ANTHROPIC_MODEL_GENERAL,
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
        model: 'claude-haiku-4-5-general',
        tokens_used: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0),
        knowledge_source: `${knowledgeMode}_${routingDecision.rule}`,
        has_location: !!location,
        routing_rule: routingDecision.rule,
        routing_match: routingDecision.matched,
        pdf_references_found: 0
      });

      // FINAL SAFETY FILTER: Remove any RPS illustrations for pages that don't exist in storage
      // This catches any references that slipped through earlier filters
      if (rpsIllustrations.length > 0) {
        const rpsIllustrationsToVerify = rpsIllustrations
          .filter((r: any) => r.type === 'rps_illustration' && Number.isInteger(r.page_number))
          .map((r: any) => r.page_number);

        if (rpsIllustrationsToVerify.length > 0) {
          const finalFilter = await filterExistingIllustrationPages(supabaseAdmin, rpsIllustrationsToVerify);
          if (finalFilter.missing.length > 0) {
            console.warn(`[Final Filter - General] Removing ${finalFilter.missing.length} missing RPS pages: ${finalFilter.missing.join(', ')}`);
            // Remove missing pages from rpsIllustrations
            rpsIllustrations = rpsIllustrations.filter((r: any) =>
              r.type !== 'rps_illustration' || !finalFilter.missing.includes(r.page_number)
            );
          }
        }
      }

      // Return general response (with RPS illustrations if gathered)
      return new Response(JSON.stringify({
        content: responseContent,
        manualReferences: rpsIllustrations.length > 0 ? rpsIllustrations : [],
        knowledgeMode: knowledgeMode,
        searchResultCount: rpsIllustrations.length,
        usage: data.usage
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });
    }

  } catch (error) {
    console.error('Edge function error (non-fatal response):', error);
    // Never surface 5xx to the UI; return a helpful 200 with degraded flag
    return new Response(JSON.stringify({
      content: 'I had trouble processing that just now. Please try again in a moment.',
      degraded: true,
      error: 'unhandled_exception'
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
