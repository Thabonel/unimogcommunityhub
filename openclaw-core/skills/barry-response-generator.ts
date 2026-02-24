/**
 * Barry Response Generator Skill
 * Generates responses using Claude with proper citations
 */

import {
  ResponseGeneratorInput,
  ResponseGeneratorOutput,
  Citation,
  SkillResult,
  SkillExecutionContext
} from '../types/barry';
import { BARRY_PERSONA, MODEL_CONFIG } from '../config/barry-config';

/**
 * Build the system prompt for Claude
 */
function buildSystemPrompt(
  task: string,
  manualContext: string,
  rpsContext?: string
): string {
  let prompt = BARRY_PERSONA;

  prompt += `\n\n=== KNOWLEDGE CONTEXT ===\n`;
  prompt += `You have access to the following information from the U435 Workshop Manual:\n\n`;
  prompt += manualContext;

  if (rpsContext) {
    prompt += `\n\n=== RPS PARTS CATALOG ===\n`;
    prompt += rpsContext;
  }

  prompt += `\n\n=== RESPONSE INSTRUCTIONS ===\n`;
  prompt += `Task type: ${task}\n`;
  prompt += `
CRITICAL RULES:
1. ALWAYS cite specific page numbers when providing technical information
2. Format: "According to page X of the workshop manual..."
3. If showing exploded views, use markdown image syntax: ![Description](URL)
4. Be SELECTIVE - only cite pages that DIRECTLY answer the question
5. For procedures: cite 2-4 most relevant pages
6. For specifications: cite the specific spec page
7. If information isn't in the context, say "I don't have that specific information in my manual database"
8. Never make up page numbers or technical specifications
`;

  return prompt;
}

/**
 * Extract citations from Claude's response
 */
function extractCitations(
  response: string,
  manualContext: string
): Citation[] {
  const citations: Citation[] = [];
  const seenPages = new Set<number>();

  // Pattern: "page X" or "pages X-Y" or "page X, Y"
  const pagePatterns = [
    /page\s+(\d+)/gi,
    /pages?\s+(\d+)(?:\s*[-,]\s*(\d+))?/gi
  ];

  for (const pattern of pagePatterns) {
    const matches = response.matchAll(pattern);
    for (const match of matches) {
      const pageNum = parseInt(match[1]);
      if (!isNaN(pageNum) && !seenPages.has(pageNum)) {
        seenPages.add(pageNum);
        citations.push({
          source: 'manual',
          title: `U435 Workshop Manual`,
          page_number: pageNum,
          confidence: 0.9
        });
      }

      // Handle range or second page
      if (match[2]) {
        const secondPage = parseInt(match[2]);
        if (!isNaN(secondPage) && !seenPages.has(secondPage)) {
          seenPages.add(secondPage);
          citations.push({
            source: 'manual',
            title: `U435 Workshop Manual`,
            page_number: secondPage,
            confidence: 0.9
          });
        }
      }
    }
  }

  // Extract RPS page references
  const rpsPattern = /RPS\s+Page\s+(\d+)/gi;
  const rpsMatches = response.matchAll(rpsPattern);
  for (const match of rpsMatches) {
    const pageNum = parseInt(match[1]);
    if (!isNaN(pageNum) && !seenPages.has(pageNum)) {
      seenPages.add(pageNum);
      citations.push({
        source: 'rps',
        title: 'RPS Parts Catalog',
        page_number: pageNum,
        confidence: 0.9
      });
    }
  }

  // If no citations found in response, try to infer from context
  if (citations.length === 0 && manualContext) {
    const contextPageMatch = manualContext.match(/Page\s+(\d+)/i);
    if (contextPageMatch) {
      citations.push({
        source: 'manual',
        title: 'U435 Workshop Manual',
        page_number: parseInt(contextPageMatch[1]),
        confidence: 0.7
      });
    }
  }

  return citations;
}

/**
 * Call Claude API to generate response
 */
async function callClaude(
  systemPrompt: string,
  messages: Array<{ role: string; content: string }>,
  apiKey: string
): Promise<{ content: string; usage: { input_tokens: number; output_tokens: number } }> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: MODEL_CONFIG.agentic,
      max_tokens: 1000,
      temperature: 0.7,
      system: systemPrompt,
      messages: messages.map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content
      }))
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Claude API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return {
    content: data.content[0].text,
    usage: data.usage
  };
}

/**
 * Response Generator Skill - Main execution function
 */
export async function executeResponseGenerator(
  input: ResponseGeneratorInput,
  context: SkillExecutionContext
): Promise<SkillResult<ResponseGeneratorOutput>> {
  const startTime = performance.now();
  const skillName = 'barry-response-generator';

  try {
    const { query, task, manual_context, rps_context, conversation_history } = input;

    // Get API key from environment
    const apiKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!apiKey) {
      return {
        success: false,
        error: 'ANTHROPIC_API_KEY not configured',
        executionTimeMs: performance.now() - startTime,
        skillName
      };
    }

    // Build system prompt with context
    const systemPrompt = buildSystemPrompt(task, manual_context, rps_context);

    // Build messages array
    const messages = [
      ...(conversation_history || []).slice(-5), // Last 5 messages for context
      { role: 'user', content: query }
    ];

    // Call Claude
    console.log(`[ResponseGenerator] Calling Claude ${MODEL_CONFIG.agentic}...`);
    const { content } = await callClaude(systemPrompt, messages, apiKey);

    // Extract citations from response
    const citations = extractCitations(content, manual_context);

    // Log when no citations were found - do NOT fabricate citations
    if (citations.length === 0) {
      console.log('[ResponseGenerator] No citations extracted from response');
    }

    return {
      success: true,
      data: {
        content,
        citations,
        knowledge_mode: 'unimog_agentic'
      },
      executionTimeMs: performance.now() - startTime,
      skillName
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Response generation failed',
      executionTimeMs: performance.now() - startTime,
      skillName
    };
  }
}

export default executeResponseGenerator;
