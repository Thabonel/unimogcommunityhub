/**
 * Barry Knowledge Lookup Skill
 * Checks the validated knowledge base for instant answers
 */

import {
  KnowledgeLookupInput,
  KnowledgeLookupOutput,
  ManualReference,
  SkillResult,
  SkillExecutionContext
} from '../types/barry';

/**
 * Extract keywords from query for matching
 */
function extractQueryKeywords(query: string): string[] {
  const stopWords = new Set([
    'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'must', 'to', 'of', 'in', 'for', 'on',
    'with', 'at', 'by', 'from', 'as', 'how', 'what', 'where', 'when',
    'why', 'which', 'who', 'my', 'your', 'i', 'me', 'you', 'can'
  ]);

  return query.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));
}

/**
 * Calculate match score between query keywords and KB entry keywords
 */
function calculateMatchScore(queryKeywords: string[], entryKeywords: string[]): number {
  if (queryKeywords.length === 0 || entryKeywords.length === 0) return 0;

  const entryKeywordsLower = entryKeywords.map(k => k.toLowerCase());
  let matches = 0;

  for (const qk of queryKeywords) {
    for (const ek of entryKeywordsLower) {
      if (ek.includes(qk) || qk.includes(ek)) {
        matches++;
        break;
      }
    }
  }

  return matches / queryKeywords.length;
}

/**
 * Knowledge Lookup Skill - Main execution function
 */
export async function executeKnowledgeLookup(
  input: KnowledgeLookupInput,
  context: SkillExecutionContext
): Promise<SkillResult<KnowledgeLookupOutput>> {
  const startTime = performance.now();
  const skillName = 'barry-knowledge-lookup';

  try {
    const { query } = input;
    const { supabaseAdmin } = context;

    const queryKeywords = extractQueryKeywords(query);
    console.log(`[KB Lookup] Query keywords: ${queryKeywords.join(', ')}`);

    if (queryKeywords.length === 0) {
      return {
        success: true,
        data: {
          found: false
        },
        executionTimeMs: performance.now() - startTime,
        skillName
      };
    }

    // Search knowledge base for validated answers
    // Threshold lowered to 0.5 to increase cache utilization (WHE-117)
    // Answers with 0.5-0.7 confidence are returned as "community-validated"
    const { data: kbEntries, error } = await supabaseAdmin
      .from('barry_knowledge_base')
      .select('*')
      .gte('confidence_score', 0.5)
      .gte('validation_count', 1)
      .order('confidence_score', { ascending: false })
      .limit(20);

    if (error) {
      console.error('[KB Lookup] Database error:', error);
      return {
        success: true,
        data: { found: false },
        executionTimeMs: performance.now() - startTime,
        skillName
      };
    }

    if (!kbEntries || kbEntries.length === 0) {
      return {
        success: true,
        data: { found: false },
        executionTimeMs: performance.now() - startTime,
        skillName
      };
    }

    // Find best matching entry
    let bestMatch: any = null;
    let bestScore = 0;

    for (const entry of kbEntries) {
      const entryKeywords = entry.question_keywords || [];
      const score = calculateMatchScore(queryKeywords, entryKeywords);

      if (score > bestScore && score >= 0.5) {
        bestScore = score;
        bestMatch = entry;
      }
    }

    if (!bestMatch) {
      return {
        success: true,
        data: { found: false },
        executionTimeMs: performance.now() - startTime,
        skillName
      };
    }

    console.log(`[KB Lookup] Found match with score ${bestScore}: ${bestMatch.question_keywords.join(', ')}`);

    // Parse manual references from KB entry
    let manualReferences: ManualReference[] = [];
    try {
      const refs = bestMatch.manual_references || [];
      manualReferences = refs.map((ref: any) => ({
        type: 'knowledge_base',
        title: ref.manual_title || 'U435 Workshop Manual',
        page_number: ref.page_number || 0,
        original_page: ref.page_number || 0,
        pdf_page: ref.pdf_page || ref.page_number || 0,
        storage_url: ref.storage_url || '',
        chapter_filename: ref.chapter_filename,
        manual_type: 'U435'
      }));
    } catch (parseError) {
      console.warn('[KB Lookup] Error parsing manual references:', parseError);
    }

    return {
      success: true,
      data: {
        found: true,
        content: bestMatch.barry_response_template,
        confidence: bestMatch.confidence_score,
        manual_references: manualReferences,
        validated_count: bestMatch.validation_count
      },
      executionTimeMs: performance.now() - startTime,
      skillName
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Knowledge lookup failed',
      executionTimeMs: performance.now() - startTime,
      skillName
    };
  }
}

export default executeKnowledgeLookup;
