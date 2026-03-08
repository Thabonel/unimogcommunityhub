/**
 * Barry Manual Search Skill
 * Searches workshop manual chunks using full-text and semantic search
 */

import {
  ManualSearchInput,
  ManualSearchOutput,
  SkillResult,
  SkillExecutionContext
} from '../types/barry';

// Chapter PDF URL mapping (extracted from existing code)
const CHAPTER_RANGES: Array<{
  start: number;
  end: number;
  filename: string;
  pdfStart: number;
}> = [
  { start: 1, end: 50, filename: 'U435_01_Introduction.pdf', pdfStart: 1 },
  { start: 51, end: 100, filename: 'U435_02_Engine.pdf', pdfStart: 1 },
  { start: 101, end: 150, filename: 'U435_03_Fuel_System.pdf', pdfStart: 1 },
  { start: 151, end: 200, filename: 'U435_04_Cooling.pdf', pdfStart: 1 },
  { start: 201, end: 250, filename: 'U435_05_Exhaust.pdf', pdfStart: 1 },
  { start: 251, end: 300, filename: 'U435_06_Clutch.pdf', pdfStart: 1 },
  { start: 301, end: 350, filename: 'U435_07_Transmission.pdf', pdfStart: 1 },
  { start: 351, end: 400, filename: 'U435_08_Transfer_Case.pdf', pdfStart: 1 },
  { start: 401, end: 450, filename: 'U435_09_Driveline.pdf', pdfStart: 1 },
  { start: 451, end: 500, filename: 'U435_10_Front_Axle.pdf', pdfStart: 1 },
  { start: 501, end: 550, filename: 'U435_11_Rear_Axle.pdf', pdfStart: 1 },
  { start: 551, end: 600, filename: 'U435_12_Steering.pdf', pdfStart: 1 },
  { start: 601, end: 650, filename: 'U435_13_Brakes.pdf', pdfStart: 1 },
  { start: 651, end: 700, filename: 'U435_14_Suspension.pdf', pdfStart: 1 },
  { start: 701, end: 750, filename: 'U435_15_Wheels.pdf', pdfStart: 1 },
  { start: 751, end: 800, filename: 'U435_16_Frame.pdf', pdfStart: 1 },
  { start: 801, end: 850, filename: 'U435_17_Cab.pdf', pdfStart: 1 },
  { start: 851, end: 900, filename: 'U435_18_Electrical.pdf', pdfStart: 1 },
  { start: 901, end: 950, filename: 'U435_19_Wheel_Hub_Front.pdf', pdfStart: 1 },
  { start: 951, end: 1000, filename: 'U435_20_Wheel_Hub_Rear.pdf', pdfStart: 1 }
];

/**
 * Get chapter PDF URL for a page number
 */
function getChapterInfo(pageNumber: number): { filename: string; pdfPage: number; url: string } | null {
  for (const chapter of CHAPTER_RANGES) {
    if (pageNumber >= chapter.start && pageNumber <= chapter.end) {
      const pdfPage = pageNumber - chapter.start + chapter.pdfStart;
      const url = `https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/manuals/${chapter.filename}#page=${pdfPage}`;
      return { filename: chapter.filename, pdfPage, url };
    }
  }
  return null;
}

/**
 * Extract search keywords from query
 */
function extractKeywords(query: string): string[] {
  // Remove common words
  const stopWords = new Set([
    'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'must', 'shall', 'can', 'to', 'of', 'in',
    'for', 'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through',
    'during', 'before', 'after', 'above', 'below', 'how', 'what', 'where',
    'when', 'why', 'which', 'who', 'my', 'your', 'their', 'i', 'me', 'you'
  ]);

  const words = query.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));

  return [...new Set(words)];
}

/**
 * Search manual chunks using full-text search
 */
async function searchManualChunks(
  supabaseAdmin: any,
  query: string,
  maxResults: number,
  expandedTerms?: string[]
): Promise<any[]> {
  const keywords = extractKeywords(query);

  if (keywords.length === 0) {
    return [];
  }

  // Build search pattern
  const searchPattern = keywords.join(' & ');

  try {
    // Try full-text search first
    const { data: ftsResults, error: ftsError } = await supabaseAdmin
      .from('manual_chunks')
      .select('*')
      .textSearch('content', searchPattern, { type: 'websearch', config: 'english' })
      .ilike('manual_title', '%U435%')
      .limit(maxResults);

    if (!ftsError && ftsResults && ftsResults.length > 0) {
      return ftsResults;
    }

    // Fallback to ILIKE search - use OR logic if expanded terms available
    const searchTerms = expandedTerms && expandedTerms.length > 1 ? expandedTerms : keywords;
    let ilikeResults: any[] = [];

    if (expandedTerms && expandedTerms.length > 1) {
      // OR logic search: find chunks matching ANY expanded term
      const allResults: any[] = [];
      const seenIds = new Set<string>();

      for (const term of searchTerms) {
        const cleanTerm = term.toLowerCase().trim();
        if (cleanTerm.length > 2) {
          const { data: termResults, error } = await supabaseAdmin
            .from('manual_chunks')
            .select('*')
            .ilike('content', `%${cleanTerm}%`)
            .ilike('manual_title', '%U435%')
            .limit(maxResults);

          if (!error && termResults) {
            // Deduplicate by ID
            for (const chunk of termResults) {
              if (!seenIds.has(chunk.id)) {
                seenIds.add(chunk.id);
                allResults.push(chunk);
              }
            }
          }
        }
      }

      ilikeResults = allResults;
    } else {
      // Original AND logic for backward compatibility
      const { data: andResults } = await supabaseAdmin
        .from('manual_chunks')
        .select('*')
        .ilike('content', `%${keywords[0]}%`)
        .ilike('manual_title', '%U435%')
        .limit(maxResults);

      ilikeResults = andResults || [];
    }

    if (ilikeResults.length > 0) {
      // Score and sort by relevance (count of matching terms)
      return ilikeResults
        .map((chunk: any) => {
          let score = 0;
          const contentLower = chunk.content?.toLowerCase() || '';
          for (const term of searchTerms) {
            if (contentLower.includes(term.toLowerCase())) score++;
          }
          return { ...chunk, relevance_score: score / searchTerms.length };
        })
        .sort((a: any, b: any) => b.relevance_score - a.relevance_score)
        .slice(0, maxResults); // Limit final results
    }

    return [];
  } catch (error) {
    console.error('[ManualSearch] Search error:', error);
    return [];
  }
}

/**
 * Search specification tables
 */
async function searchSpecifications(
  supabaseAdmin: any,
  keywords: string[]
): Promise<any[]> {
  try {
    // Search for torque specs, fluid capacities, etc.
    const specKeywords = ['torque', 'nm', 'ft-lb', 'capacity', 'liter', 'quart'];
    const hasSpecIntent = keywords.some(k => specKeywords.includes(k));

    if (!hasSpecIntent) {
      return [];
    }

    const { data, error } = await supabaseAdmin
      .from('manual_chunks')
      .select('*')
      .or(`section_title.ilike.%specification%,section_title.ilike.%torque%,section_title.ilike.%technical data%`)
      .ilike('manual_title', '%U435%')
      .limit(5);

    if (!error && data) {
      return data;
    }

    return [];
  } catch (error) {
    console.error('[ManualSearch] Spec search error:', error);
    return [];
  }
}

/**
 * Manual Search Skill - Main execution function
 */
export async function executeManualSearch(
  input: ManualSearchInput & { expanded_terms?: string[] },
  context: SkillExecutionContext
): Promise<SkillResult<ManualSearchOutput>> {
  const startTime = performance.now();
  const skillName = 'barry-manual-search';

  try {
    const { query, task, max_results, expanded_terms } = input;
    const { supabaseAdmin } = context;

    // Extract keywords for targeted search
    const keywords = extractKeywords(query);
    const useExpansion = expanded_terms && expanded_terms.length > 1;

    console.log(`[ManualSearch] Keywords: ${keywords.join(', ')}`);
    if (useExpansion) {
      console.log(`[ManualSearch] Expanded terms: ${expanded_terms.slice(0, 3).join(', ')}${expanded_terms.length > 3 ? '...' : ''}`);
    }

    // Perform main search with expanded terms
    const searchResults = await searchManualChunks(supabaseAdmin, query, max_results, expanded_terms);

    // For specification queries, also search spec tables
    let specResults: any[] = [];
    if (task === 'specifications') {
      specResults = await searchSpecifications(supabaseAdmin, keywords);
    }

    // Combine and deduplicate results
    const allResults = [...searchResults, ...specResults];
    const seenPages = new Set<number>();
    const uniqueResults = allResults.filter((chunk: any) => {
      if (seenPages.has(chunk.page_number)) return false;
      seenPages.add(chunk.page_number);
      return true;
    });

    // Format chunks with chapter info
    const formattedChunks = uniqueResults.map((chunk: any) => {
      const chapterInfo = getChapterInfo(chunk.page_number);
      return {
        content: chunk.content || '',
        section_title: chunk.section_title,
        page_number: chunk.page_number,
        manual_title: chunk.manual_title || 'U435 Workshop Manual',
        storage_url: chapterInfo?.url || '',
        relevance_score: chunk.relevance_score
      };
    });

    const searchMethod = searchResults.length > 0 ? 'full_text' : 'ilike_fallback';

    return {
      success: true,
      data: {
        found: formattedChunks.length > 0,
        chunks: formattedChunks,
        search_method: searchMethod
      },
      executionTimeMs: performance.now() - startTime,
      skillName
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Manual search failed',
      executionTimeMs: performance.now() - startTime,
      skillName
    };
  }
}

export default executeManualSearch;
