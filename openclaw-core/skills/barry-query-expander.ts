/**
 * Barry Query Expander Skill
 * Expands user queries into technical manual terminology using Claude Haiku
 * Phase 1 of Barry AI Transformation Plan - The Macro Fix for synonym problems
 */

import {
  SkillResult,
  SkillExecutionContext
} from '../types/barry';

// Query expander input/output schemas (following the pattern)
export interface QueryExpanderInput {
  query: string;
  original_query: string;
}

export interface QueryExpanderOutput {
  found: boolean;
  expanded_terms: string[];
  original_query: string;
  expansion_method: 'claude_haiku' | 'fallback';
}

/**
 * Fallback expansion using simple keyword extraction
 * Used when Claude API fails or returns invalid JSON
 */
function generateFallbackTerms(query: string): string[] {
  const queryLower = query.toLowerCase();
  const fallbackMappings: Record<string, string[]> = {
    // Common user terms -> Technical terms
    'indicator': ['combination switch', 'turn signal', 'blinker', 'Lenkstockschalter', 'indicator stalk'],
    'stalk': ['combination switch', 'column switch', 'Lenkstockschalter', 'switch assembly'],
    'turbo': ['turbocharger', 'Turbolader', 'boost', 'compressor', 'turbine'],
    'diff': ['differential', 'Differential', 'diff lock', 'Sperrventil', 'rear axle'],
    'gearbox': ['transmission', 'Getriebe', 'gear box', 'transfer case'],
    'portal': ['portal hub', 'wheel hub drives', 'Radnabe', 'hub assembly', 'portal axle'],
    'brake': ['brake system', 'Bremse', 'brake pad', 'caliper', 'brake disc'],
    'oil': ['engine oil', 'Motoröl', 'lubricant', 'hydraulic fluid', 'gear oil'],
    'filter': ['oil filter', 'air filter', 'fuel filter', 'Filter', 'filtration'],
    'pump': ['fuel pump', 'water pump', 'hydraulic pump', 'Pumpe', 'injection pump'],
    'belt': ['drive belt', 'fan belt', 'Keilriemen', 'serpentine belt', 'timing belt']
  };

  const expandedTerms: string[] = [query]; // Always include original

  // Check each mapping
  for (const [userTerm, technicalTerms] of Object.entries(fallbackMappings)) {
    if (queryLower.includes(userTerm)) {
      expandedTerms.push(...technicalTerms);
    }
  }

  // Remove duplicates and limit to 10 terms
  return [...new Set(expandedTerms)].slice(0, 10);
}

/**
 * Call Claude Haiku to expand query into technical terms
 */
async function expandQueryWithClaude(query: string): Promise<string[]> {
  const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');

  if (!ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY not configured');
  }

  const prompt = `You are a Unimog technical terminology expert. Given this user question about a Unimog, return a JSON array of alternative search terms that workshop manuals and parts catalogs would use. Include German technical terms (like Lenkstockschalter), Mercedes part terminology, component assembly names, and common mechanic slang. Return ONLY the JSON array, nothing else.

User question: "${query}"

Example format: ["combination switch", "Lenkstockschalter", "turn signal lever", "indicator stalk", "column switch", "wiper switch assembly"]`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20250414',
        max_tokens: 200,
        temperature: 0.3, // Lower temperature for more consistent JSON output
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Claude API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    const content = data.content[0]?.text?.trim();

    if (!content) {
      throw new Error('Empty response from Claude API');
    }

    // Parse JSON response
    try {
      // Clean up the response - remove any markdown formatting or extra text
      const cleanedContent = content.replace(/```json\s*|\s*```/g, '').trim();
      const expandedTerms = JSON.parse(cleanedContent);

      if (!Array.isArray(expandedTerms)) {
        throw new Error('Response is not an array');
      }

      // Validate and clean the terms
      const validTerms = expandedTerms
        .filter(term => typeof term === 'string' && term.trim().length > 0)
        .map(term => term.trim())
        .slice(0, 15); // Limit to 15 terms max

      // Always include original query
      return [query, ...validTerms.filter(term => term !== query)];

    } catch (parseError) {
      console.error('[QueryExpander] JSON parse error:', parseError, 'Content:', content);
      throw new Error('Invalid JSON response from Claude');
    }

  } catch (error) {
    console.error('[QueryExpander] Claude API error:', error);
    throw error;
  }
}

/**
 * Query Expander Skill - Main execution function
 * Expands user queries into technical manual terminology
 */
export async function executeQueryExpander(
  input: QueryExpanderInput,
  _context: SkillExecutionContext
): Promise<SkillResult<QueryExpanderOutput>> {
  const startTime = performance.now();
  const skillName = 'barry-query-expander';

  try {
    const { query, original_query } = input;

    console.log(`[QueryExpander] Expanding query: ${query.substring(0, 100)}...`);

    let expandedTerms: string[];
    let expansionMethod: 'claude_haiku' | 'fallback' = 'claude_haiku';

    try {
      // Attempt Claude expansion first
      expandedTerms = await expandQueryWithClaude(query);
      console.log(`[QueryExpander] Claude expansion: ${expandedTerms.length} terms`);

    } catch (claudeError) {
      // Fallback to hardcoded mappings if Claude fails
      console.warn(`[QueryExpander] Claude failed, using fallback:`, claudeError);
      expandedTerms = generateFallbackTerms(query);
      expansionMethod = 'fallback';
    }

    // Ensure we have meaningful results
    if (expandedTerms.length === 0) {
      expandedTerms = [query]; // At minimum, return the original query
    }

    console.log(`[QueryExpander] Final terms (${expansionMethod}): ${expandedTerms.slice(0, 3).join(', ')}${expandedTerms.length > 3 ? '...' : ''}`);

    return {
      success: true,
      data: {
        found: expandedTerms.length > 1, // Found expansion if more than just original query
        expanded_terms: expandedTerms,
        original_query: original_query || query,
        expansion_method: expansionMethod
      },
      executionTimeMs: performance.now() - startTime,
      skillName
    };

  } catch (error) {
    console.error('[QueryExpander] Critical error:', error);

    // Return original query as fallback to prevent pipeline failure
    return {
      success: true, // Return success to avoid breaking the pipeline
      data: {
        found: false,
        expanded_terms: [input.query], // Fallback to original query
        original_query: input.original_query || input.query,
        expansion_method: 'fallback'
      },
      executionTimeMs: performance.now() - startTime,
      skillName
    };
  }
}

export default executeQueryExpander;