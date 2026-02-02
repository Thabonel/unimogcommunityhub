/**
 * Barry Safety Filter Skill
 * Validates responses and adds safety disclaimers where appropriate
 */

import {
  SafetyFilterInput,
  SafetyFilterOutput,
  SkillResult,
  SkillExecutionContext
} from '../types/barry';
import {
  BLOCKED_TOPICS,
  SAFETY_DISCLAIMERS,
  SAFETY_DISCLAIMER_TRIGGERS
} from '../config/barry-config';

/**
 * Check if response content contains blocked dangerous topics
 */
function containsBlockedTopics(content: string): string[] {
  const contentLower = content.toLowerCase();
  const blocked: string[] = [];

  for (const topic of BLOCKED_TOPICS) {
    if (contentLower.includes(topic)) {
      blocked.push(topic);
    }
  }

  return blocked;
}

/**
 * Determine which safety disclaimers should be added based on content
 */
function getRequiredDisclaimers(query: string, content: string): string[] {
  const combinedText = `${query} ${content}`.toLowerCase();
  const disclaimers: string[] = [];

  for (const [category, triggers] of Object.entries(SAFETY_DISCLAIMER_TRIGGERS)) {
    for (const trigger of triggers) {
      if (combinedText.includes(trigger)) {
        disclaimers.push(category);
        break; // Only add each category once
      }
    }
  }

  return [...new Set(disclaimers)]; // Remove duplicates
}

/**
 * Build the disclaimer text from categories
 */
function buildDisclaimerText(categories: string[]): string {
  if (categories.length === 0) return '';

  const disclaimerTexts = categories
    .map(cat => SAFETY_DISCLAIMERS[cat])
    .filter(Boolean);

  if (disclaimerTexts.length === 0) return '';

  return `\n\n**Safety Notice:**\n${disclaimerTexts.join('\n')}`;
}

/**
 * Safety Filter Skill - Main execution function
 */
export async function executeSafetyFilter(
  input: SafetyFilterInput,
  context: SkillExecutionContext
): Promise<SkillResult<SafetyFilterOutput>> {
  const startTime = performance.now();
  const skillName = 'barry-safety-filter';

  try {
    const { query, response_content, task } = input;

    // Check for blocked topics in the response
    const blockedTopics = containsBlockedTopics(response_content);

    if (blockedTopics.length > 0) {
      // Response contains dangerous content - block it
      return {
        success: true,
        data: {
          is_safe: false,
          blocked_topics: blockedTopics,
          modified_content: `I can't provide information about ${blockedTopics.join(', ')} as it could compromise vehicle safety. Please consult a qualified mechanic for safety system issues.`
        },
        executionTimeMs: performance.now() - startTime,
        skillName
      };
    }

    // Determine required safety disclaimers
    const disclaimerCategories = getRequiredDisclaimers(query, response_content);
    const disclaimer = buildDisclaimerText(disclaimerCategories);

    // For certain high-risk tasks, always add general safety disclaimer
    const highRiskTasks = ['procedure', 'troubleshoot'];
    const isHighRiskTask = highRiskTasks.includes(task);

    let finalDisclaimer = disclaimer;
    if (isHighRiskTask && !disclaimer) {
      finalDisclaimer = '\n\n**Safety Notice:**\nAlways follow proper safety procedures when working on your vehicle. Consult the workshop manual for complete instructions.';
    }

    return {
      success: true,
      data: {
        is_safe: true,
        modified_content: response_content,
        disclaimer: finalDisclaimer || undefined
      },
      executionTimeMs: performance.now() - startTime,
      skillName
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Safety filter failed',
      executionTimeMs: performance.now() - startTime,
      skillName
    };
  }
}

export default executeSafetyFilter;
