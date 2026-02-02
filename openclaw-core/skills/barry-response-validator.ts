/**
 * Barry Response Validator Skill
 * Validates responses have proper citations and content quality
 */

import {
  ResponseValidatorInput,
  ResponseValidatorOutput,
  Citation,
  SkillResult,
  SkillExecutionContext
} from '../types/barry';

// Minimum required citations for different tasks
const MIN_CITATIONS_BY_TASK: Record<string, number> = {
  procedure: 1,
  troubleshoot: 1,
  exploded_view: 1,
  parts_lookup: 1,
  specifications: 1,
  weather: 0,
  other: 0
};

// Page number validation ranges
const VALID_PAGE_RANGES = {
  manual: { min: 1, max: 1200 },
  rps: { min: 1, max: 800 },
  knowledge_base: { min: 1, max: 2000 }
};

/**
 * Validate citation page numbers are within expected ranges
 */
function validatePageNumbers(citations: Citation[]): { valid: Citation[]; issues: string[] } {
  const valid: Citation[] = [];
  const issues: string[] = [];

  for (const citation of citations) {
    const range = VALID_PAGE_RANGES[citation.source];
    if (!range) {
      valid.push(citation);
      continue;
    }

    if (citation.page_number < range.min || citation.page_number > range.max) {
      issues.push(`Invalid page number ${citation.page_number} for ${citation.source} (expected ${range.min}-${range.max})`);
    } else {
      valid.push(citation);
    }
  }

  return { valid, issues };
}

/**
 * Check for hallucinated content patterns
 */
function checkForHallucinations(content: string): string[] {
  const issues: string[] = [];

  // Check for suspiciously specific but likely made-up part numbers
  // Real NIIN format: XXXXX-XX-XXX-XXXX
  const partNumberPattern = /NIIN[:\s]+([A-Z0-9-]+)/gi;
  const matches = content.matchAll(partNumberPattern);
  for (const match of matches) {
    const partNum = match[1];
    // Very simple validation - if it doesn't match the general format, flag it
    if (!/^\d{5}-\d{2}-\d{3}-\d{4}$/.test(partNum) && partNum.length > 5) {
      issues.push(`Potentially hallucinated part number: ${partNum}`);
    }
  }

  // Check for extremely specific torque values that weren't cited
  const torquePattern = /(\d{3,})\s*(?:Nm|ft-lb|N·m)/gi;
  const torqueMatches = content.matchAll(torquePattern);
  for (const match of torqueMatches) {
    const torqueValue = parseInt(match[1]);
    // Flag unusually high torque values that might be hallucinated
    if (torqueValue > 500) {
      issues.push(`Verify high torque value: ${torqueValue} - ensure this is cited from manual`);
    }
  }

  return issues;
}

/**
 * Check response has appropriate length and content
 */
function validateResponseContent(content: string, task: string): string[] {
  const issues: string[] = [];

  // Check minimum length for technical responses
  const minLength = task === 'specifications' ? 50 : 100;
  if (content.length < minLength) {
    issues.push(`Response too short for ${task} task (${content.length} chars, expected ${minLength}+)`);
  }

  // Check for empty or placeholder content
  if (/^\s*$/.test(content) || content.includes('{{') || content.includes('}}')) {
    issues.push('Response contains placeholder or empty content');
  }

  // Check for appropriate technical content in technical tasks
  const technicalTasks = ['procedure', 'troubleshoot', 'specifications'];
  if (technicalTasks.includes(task)) {
    const hasPageReference = /page\s+\d+/i.test(content);
    if (!hasPageReference) {
      issues.push('Technical response should reference specific manual pages');
    }
  }

  return issues;
}

/**
 * Response Validator Skill - Main execution function
 */
export async function executeResponseValidator(
  input: ResponseValidatorInput,
  _context: SkillExecutionContext
): Promise<SkillResult<ResponseValidatorOutput>> {
  const startTime = performance.now();
  const skillName = 'barry-response-validator';

  try {
    const { content, citations, task } = input;
    const allIssues: string[] = [];

    // Check minimum citation count
    const minCitations = MIN_CITATIONS_BY_TASK[task] ?? 0;
    if (citations.length < minCitations) {
      allIssues.push(`Insufficient citations: ${citations.length} provided, ${minCitations} required for ${task}`);
    }

    // Validate page numbers
    const { valid: validCitations, issues: pageIssues } = validatePageNumbers(citations);
    allIssues.push(...pageIssues);

    // Check for hallucinations
    const hallucinationIssues = checkForHallucinations(content);
    allIssues.push(...hallucinationIssues);

    // Validate content quality
    const contentIssues = validateResponseContent(content, task);
    allIssues.push(...contentIssues);

    // Determine if valid (allow if issues are only warnings)
    const criticalIssues = allIssues.filter(issue =>
      !issue.startsWith('Verify') && !issue.startsWith('Potentially')
    );
    const isValid = criticalIssues.length === 0;

    return {
      success: true,
      data: {
        is_valid: isValid,
        issues: allIssues,
        modified_citations: validCitations.length < citations.length ? validCitations : undefined
      },
      executionTimeMs: performance.now() - startTime,
      skillName
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Response validation failed',
      executionTimeMs: performance.now() - startTime,
      skillName
    };
  }
}

export default executeResponseValidator;
