/**
 * Barry RPS Search Skill
 * Searches RPS (Repair Parts and Special Tools) catalog for parts and illustrations
 */

import {
  RPSSearchInput,
  RPSSearchOutput,
  RPSIllustration,
  SkillResult,
  SkillExecutionContext
} from '../types/barry';

// Component name mappings for common search terms
const COMPONENT_MAPPINGS: Record<string, string[]> = {
  'portal': ['PORTAL', 'WHEEL HUB DRIVES', 'HUB'],
  'portal hub': ['WHEEL HUB DRIVES', 'PORTAL'],
  'hub': ['WHEEL HUB', 'HUB DRIVES', 'PORTAL'],
  'front hub': ['WHEEL HUB DRIVES, FRONT', 'FRONT AXLE', 'HOUSING, FRONT'],
  'rear hub': ['WHEEL HUB DRIVES, REAR', 'REAR AXLE'],
  'front axle': ['FRONT AXLE', 'HOUSING, FRONT'],
  'rear axle': ['REAR AXLE', 'HOUSING, REAR'],
  'turbocharger': ['TURBOCHARGER', 'AIRESEARCH'],
  'turbo': ['TURBOCHARGER', 'AIRESEARCH'],
  'differential': ['DIFFERENTIAL'],
  'diff': ['DIFFERENTIAL'],
  'brake': ['BRAKE'],
  'wheel': ['WHEEL HUB'],
  'pto': ['POWER TAKE-OFF', 'PTO', 'PTO DRIVE', 'POWER TAKE-OFF (PTO) DRIVE'],
  'pto driveline': ['POWER TAKE-OFF (PTO) DRIVE', 'PTO DRIVE', 'DRIVE LINE', 'DRIVELINE'],
  'driveline': ['DRIVE LINE', 'DRIVELINE', 'PTO DRIVE'],
  'transmission pto': ['TRANSMISSION PTO', 'PTO DRIVE', 'POWER TAKE-OFF'],
  'power take-off': ['POWER TAKE-OFF', 'PTO'],
  'steering': ['STEERING'],
  'transfer': ['TRANSFER CASE', 'TRANSFER'],
  'gearbox': ['TRANSMISSION', 'GEARBOX']
};

/**
 * Generate CDN URL for RPS illustration
 */
function getIllustrationCDNUrl(pageNumber: number): string {
  const paddedPage = pageNumber.toString().padStart(4, '0');
  return `https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/rps_illustrations/rps_page_${paddedPage}.png`;
}

/**
 * Detect component name from query
 */
function detectComponentFromQuery(query: string): string | null {
  const queryLower = query.toLowerCase();

  // Check for illustration keywords
  const illustrationKeywords = ['exploded view', 'illustration', 'figure', 'diagram', 'schematic', 'parts catalog'];
  const hasIllustrationKeyword = illustrationKeywords.some(kw => queryLower.includes(kw));

  if (!hasIllustrationKeyword) {
    // Still try to extract component even without illustration keyword
  }

  // Pattern 1: "for [my/the] X" - greedy capture
  let componentMatch = queryLower.match(/(?:for|of)\s+(?:my\s+|the\s+)?([a-z\s]+?)(?:[,;.]|$)/);
  if (componentMatch?.[1]) {
    const componentName = componentMatch[1].trim();
    if (componentName && !['part', 'parts', 'a part'].includes(componentName)) {
      return componentName;
    }
  }

  // Pattern 2: "X exploded view"
  componentMatch = queryLower.match(/\b(?:show|need|want|get|see)\s+(?:me\s+)?(?:the\s+)?([a-z\s]+?)\s+(?:exploded view|illustration|diagram)/);
  if (componentMatch?.[1]) {
    return componentMatch[1].trim();
  }

  // Pattern 3: "exploded view of [component]"
  componentMatch = queryLower.match(/(?:exploded view|illustration|diagram)\s+(?:of|for)\s+(?:the\s+)?([a-z\s]+)/);
  if (componentMatch?.[1]) {
    const componentName = componentMatch[1].trim();
    if (componentName && !['part', 'parts', 'a part'].includes(componentName)) {
      return componentName;
    }
  }

  return null;
}

/**
 * Filter illustration pages to only existing ones
 */
async function filterExistingIllustrationPages(
  supabaseAdmin: any,
  pages: number[]
): Promise<{ existing: number[]; missing: number[] }> {
  try {
    if (!pages || pages.length === 0) return { existing: [], missing: [] };

    // Check both root and nested folder locations
    const { data: rootFiles, error: rootError } = await supabaseAdmin.storage
      .from('rps_illustrations')
      .list('', { limit: 1000 });

    const { data: nestedFiles, error: nestedError } = await supabaseAdmin.storage
      .from('rps_illustrations')
      .list('rps_illustrations', { limit: 1000 });

    if (rootError && nestedError) {
      console.warn('[RPS] Error checking storage, assuming all exist:', { rootError, nestedError });
      return { existing: pages, missing: [] };
    }

    // Build set of existing file names
    const existingNames = new Set<string>();
    if (rootFiles) {
      rootFiles.forEach((f: { name: string }) => existingNames.add(f.name));
    }
    if (nestedFiles) {
      nestedFiles.forEach((f: { name: string }) => existingNames.add(f.name));
    }

    const existing: number[] = [];
    const missing: number[] = [];

    for (const page of pages) {
      const paddedPage = page.toString().padStart(4, '0');
      const fileName = `rps_page_${paddedPage}.png`;
      if (existingNames.has(fileName)) {
        existing.push(page);
      } else {
        missing.push(page);
      }
    }

    return { existing, missing };
  } catch (error) {
    console.warn('[RPS] Exception checking storage:', error);
    return { existing: pages, missing: [] };
  }
}

/**
 * Search RPS groups by component name
 */
async function searchRPSByComponent(
  supabaseAdmin: any,
  componentName: string
): Promise<{ group: any; parts: any[] } | null> {
  const normalizedTerm = componentName.toLowerCase().trim();

  // Check synonyms table first
  const { data: synonymMatch, error: synonymError } = await supabaseAdmin
    .from('rps_component_synonyms')
    .select('group_code, confidence')
    .ilike('user_term', `%${normalizedTerm}%`)
    .order('confidence', { ascending: false })
    .limit(1);

  if (!synonymError && synonymMatch?.length > 0) {
    const groupCode = synonymMatch[0].group_code;
    console.log(`[RPS] Synonym match: ${normalizedTerm} -> ${groupCode}`);

    const { data: groups } = await supabaseAdmin
      .from('rps_groups')
      .select('*')
      .eq('group_code', groupCode)
      .limit(1);

    if (groups?.length > 0) {
      const group = groups[0];
      const { data: parts } = await supabaseAdmin
        .from('rps_parts')
        .select('*')
        .eq('group_code', group.group_code)
        .order('item_number')
        .limit(10);

      return { group, parts: parts || [] };
    }
  }

  // Fallback to hardcoded mappings
  const searchTerms = COMPONENT_MAPPINGS[normalizedTerm] || [componentName.toUpperCase()];
  console.log(`[RPS] Searching terms: ${searchTerms.join(', ')}`);

  for (const term of searchTerms) {
    const { data: groups, error } = await supabaseAdmin
      .from('rps_groups')
      .select('*')
      .ilike('group_name', `%${term}%`)
      .not('illustration_pages', 'is', null)
      .limit(1);

    if (!error && groups?.length > 0) {
      const group = groups[0];
      if (group.illustration_pages?.length > 0) {
        const { data: parts } = await supabaseAdmin
          .from('rps_parts')
          .select('*')
          .eq('group_code', group.group_code)
          .order('item_number')
          .limit(10);

        return { group, parts: parts || [] };
      }
    }
  }

  return null;
}

/**
 * RPS Search Skill - Main execution function
 */
export async function executeRPSSearch(
  input: RPSSearchInput & { expanded_terms?: string[] },
  context: SkillExecutionContext
): Promise<SkillResult<RPSSearchOutput>> {
  const startTime = performance.now();
  const skillName = 'barry-rps-search';

  try {
    const { query, component_name, expanded_terms } = input;
    const { supabaseAdmin } = context;

    // Detect component from query if not provided
    const componentToSearch = component_name || detectComponentFromQuery(query);

    if (!componentToSearch) {
      return {
        success: true,
        data: {
          found: false,
          parts: [],
          illustrations: []
        },
        executionTimeMs: performance.now() - startTime,
        skillName
      };
    }

    console.log(`[RPS] Searching for component: ${componentToSearch}`);
    if (expanded_terms && expanded_terms.length > 1) {
      console.log(`[RPS] Using expanded terms: ${expanded_terms.slice(0, 3).join(', ')}${expanded_terms.length > 3 ? '...' : ''}`);
    }

    // Search RPS database using expanded terms if available
    let result: { group: any; parts: any[] } | null = null;

    // Try expanded terms first if available
    if (expanded_terms && expanded_terms.length > 1) {
      for (const term of expanded_terms) {
        result = await searchRPSByComponent(supabaseAdmin, term);
        if (result) {
          console.log(`[RPS] Found match with expanded term: ${term}`);
          break;
        }
      }
    }

    // Fallback to original component name if no expanded term matched
    if (!result) {
      result = await searchRPSByComponent(supabaseAdmin, componentToSearch);
    }

    if (!result) {
      return {
        success: true,
        data: {
          found: false,
          parts: [],
          illustrations: []
        },
        executionTimeMs: performance.now() - startTime,
        skillName
      };
    }

    const { group, parts } = result;

    // Filter to existing illustration pages
    const illustrationPages = group.illustration_pages || [];
    const { existing, missing } = await filterExistingIllustrationPages(supabaseAdmin, illustrationPages);

    if (missing.length > 0) {
      console.warn(`[RPS] Missing illustration pages: ${missing.join(', ')}`);
    }

    // Build illustration references
    const illustrations: RPSIllustration[] = existing.map((page: number) => ({
      type: 'rps_illustration' as const,
      title: `RPS Page ${page} - ${group.group_name}`,
      page_number: page,
      cdn_url: getIllustrationCDNUrl(page),
      storage_url: getIllustrationCDNUrl(page),
      manual_type: 'RPS' as const,
      group_code: group.group_code,
      group_name: group.group_name
    }));

    // Format parts
    const formattedParts = parts.map((p: any) => ({
      item_number: p.item_number || '',
      description: p.description || '',
      niin: p.niin,
      callout: p.callout
    }));

    return {
      success: true,
      data: {
        found: true,
        group: {
          group_code: group.group_code,
          group_name: group.group_name,
          rps_number: group.rps_number,
          illustration_pages: existing,
          parts_list_pages: group.parts_list_pages,
          total_parts: group.total_parts
        },
        parts: formattedParts,
        illustrations
      },
      executionTimeMs: performance.now() - startTime,
      skillName
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'RPS search failed',
      executionTimeMs: performance.now() - startTime,
      skillName
    };
  }
}

export default executeRPSSearch;
