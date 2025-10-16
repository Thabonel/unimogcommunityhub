import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

interface RPSPart {
  id: string;
  niin: string;
  nsn?: string;
  group_code: string;
  item_number: string;
  description: string;
  rps_number: string;
  quantity?: number;
  repair_grade?: 'L' | 'M' | 'H';
  page_number?: number;
  chunk_file?: string;
  figure_reference?: string;
  callout?: string;
}

interface RPSGroup {
  id: string;
  rps_number: string;
  group_code: string;
  group_name: string;
  total_parts: number;
  page_start?: number;
  page_end?: number;
}

interface RPSSearchResult {
  type: 'niin_lookup' | 'group_lookup' | 'keyword_search' | 'no_match';
  parts?: RPSPart[];
  group?: RPSGroup;
  context: string;
  citations: string[];
}

/**
 * Detect if query is RPS-related
 */
export function isRPSQuery(query: string): boolean {
  const lowerQuery = query.toLowerCase();

  // Pattern 1: NIIN number (XX-XXX-XXXX)
  if (/\d{2}-\d{3}-\d{4}/.test(query)) {
    return true;
  }

  // Pattern 2: Group code (AA, AB, AC, etc.)
  if (/\b[A-Z]{2,3}\b/.test(query.toUpperCase()) && lowerQuery.includes('group')) {
    return true;
  }

  // Pattern 3: RPS keywords
  const rpsKeywords = [
    'niin',
    'nsn',
    'parts catalog',
    'repair parts',
    'rps',
    'part number',
    'group aa',
    'group ab',
  ];

  return rpsKeywords.some(keyword => lowerQuery.includes(keyword));
}

/**
 * Search RPS parts catalog
 */
export async function searchRPSParts(
  query: string,
  supabaseUrl: string,
  supabaseKey: string
): Promise<RPSSearchResult> {
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Pattern 1: NIIN exact match
  const niinMatch = query.match(/\d{2}-\d{3}-\d{4}/);
  if (niinMatch) {
    const niin = niinMatch[0];
    return await lookupByNIIN(niin, supabase);
  }

  // Pattern 2: Group code lookup
  const groupMatch = query.match(/\bgroup\s+([A-Z]{2,3})\b/i);
  if (groupMatch) {
    const groupCode = groupMatch[1].toUpperCase();
    return await lookupByGroup(groupCode, supabase);
  }

  // Pattern 3: Keyword search
  return await searchByKeyword(query, supabase);
}

/**
 * Lookup part by NIIN
 */
async function lookupByNIIN(niin: string, supabase: any): Promise<RPSSearchResult> {
  const { data: part, error } = await supabase
    .from('rps_parts')
    .select(`
      *,
      group:rps_groups!inner(group_code, group_name)
    `)
    .eq('niin', niin)
    .single();

  if (error || !part) {
    return {
      type: 'no_match',
      context: `No part found with NIIN ${niin} in the RPS catalog.`,
      citations: [],
    };
  }

  const repairGrade = part.repair_grade === 'L' ? 'Light' : part.repair_grade === 'M' ? 'Medium' : 'Heavy';

  const context = `That's the ${part.description.toLowerCase()} (NIIN: ${part.niin}, Item ${part.item_number} in Group ${part.group_code} - ${part.group.group_name}).

Used in quantity: ${part.quantity || 'N/A'}
Repair grade: ${repairGrade}
${part.nsn ? `NSN: ${part.nsn}` : ''}
Page reference: Page ${part.page_number}, RPS ${part.rps_number}
${part.figure_reference ? `See Figure ${part.figure_reference}${part.callout ? `, callout ${part.callout}` : ''}.` : ''}`;

  const citations = [
    `RPS ${part.rps_number}, Page ${part.page_number}`,
    `Group ${part.group_code} (${part.group.group_name})`,
  ];

  if (part.figure_reference) {
    citations.push(`Figure ${part.figure_reference}`);
  }

  return {
    type: 'niin_lookup',
    parts: [part],
    context,
    citations,
  };
}

/**
 * Lookup parts by group code
 */
async function lookupByGroup(groupCode: string, supabase: any): Promise<RPSSearchResult> {
  // Get group metadata
  const { data: group } = await supabase
    .from('rps_groups')
    .select('*')
    .eq('group_code', groupCode)
    .single();

  if (!group) {
    return {
      type: 'no_match',
      context: `Group ${groupCode} not found in the RPS catalog.`,
      citations: [],
    };
  }

  // Get all parts in group
  const { data: parts } = await supabase
    .from('rps_parts')
    .select('*')
    .eq('group_code', groupCode)
    .order('item_number');

  if (!parts || parts.length === 0) {
    return {
      type: 'no_match',
      context: `Group ${groupCode} found but contains no parts.`,
      citations: [],
    };
  }

  // Format first 10 parts
  const partsList = parts.slice(0, 10).map((p: RPSPart) =>
    `- Item ${p.item_number}: ${p.description} (NIIN ${p.niin}) - qty ${p.quantity || 'N/A'}`
  ).join('\n');

  const hasMore = parts.length > 10;

  const context = `Group ${groupCode} (${group.group_name}) contains ${parts.length} parts.

Page range: ${group.page_start}-${group.page_end} in RPS ${group.rps_number}

${hasMore ? 'First 10 parts:' : 'Parts list:'}
${partsList}
${hasMore ? `\n... and ${parts.length - 10} more parts` : ''}`;

  const citations = [
    `RPS ${group.rps_number}, Pages ${group.page_start}-${group.page_end}`,
    `Group ${groupCode} (${group.group_name})`,
  ];

  return {
    type: 'group_lookup',
    parts,
    group,
    context,
    citations,
  };
}

/**
 * Search parts by keyword
 */
async function searchByKeyword(query: string, supabase: any): Promise<RPSSearchResult> {
  // Use full-text search on description
  const { data: parts } = await supabase
    .from('rps_parts')
    .select(`
      *,
      group:rps_groups!inner(group_code, group_name)
    `)
    .textSearch('description', query, {
      type: 'websearch',
      config: 'english',
    })
    .limit(20);

  if (!parts || parts.length === 0) {
    return {
      type: 'no_match',
      context: `No parts found matching "${query}" in the RPS catalog.`,
      citations: [],
    };
  }

  const partsList = parts.slice(0, 5).map((p: RPSPart) =>
    `- ${p.description} (NIIN ${p.niin}, Group ${p.group_code}) - Page ${p.page_number}`
  ).join('\n');

  const hasMore = parts.length > 5;

  const context = `Found ${parts.length} parts matching "${query}":

${partsList}
${hasMore ? `\n... and ${parts.length - 5} more results` : ''}`;

  const citations = parts.slice(0, 5).map((p: RPSPart) =>
    `RPS ${p.rps_number}, Page ${p.page_number} (Group ${p.group_code})`
  );

  return {
    type: 'keyword_search',
    parts,
    context,
    citations,
  };
}

/**
 * Format RPS context for injection into Barry's prompt
 */
export function formatRPSContext(result: RPSSearchResult): string {
  if (result.type === 'no_match') {
    return `RPS CATALOG: ${result.context}`;
  }

  return `RPS PARTS CATALOG CONTEXT:
${result.context}

CITATIONS:
${result.citations.map((c, i) => `[${i + 1}] ${c}`).join('\n')}

When answering, always cite the RPS document, page number, and NIIN. Use the exact information provided above.`;
}
