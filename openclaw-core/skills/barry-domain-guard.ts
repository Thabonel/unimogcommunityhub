/**
 * Barry Domain Guard Skill
 * Classifies queries and enforces domain containment for Unimog-related topics
 */

import {
  DomainGuardInput,
  DomainGuardOutput,
  BarryDomain,
  BarryTask,
  SkillResult,
  SkillExecutionContext
} from '../types/barry';
import {
  BLOCKED_TOPICS,
  TECHNICAL_KEYWORDS,
  OFF_TOPIC_REDIRECT,
  DANGEROUS_BLOCK_MESSAGE
} from '../config/barry-config';

// Technical task detection patterns
const TASK_PATTERNS: Record<BarryTask, RegExp[]> = {
  procedure: [
    /how\s+(?:do\s+i|to)\s+/i,
    /steps?\s+(?:to|for)/i,
    /procedure\s+for/i,
    /remove|install|replace|change|drain|fill|adjust/i
  ],
  troubleshoot: [
    /won't|wont|doesn't|doesnt|not\s+working/i,
    /noise|leak|vibration|problem|issue|trouble/i,
    /no\s+(?:power|start|pressure)/i,
    /diagnose|troubleshoot|fix/i
  ],
  exploded_view: [
    /exploded\s+view/i,
    /parts?\s+diagram/i,
    /illustration|schematic|drawing/i,
    /show\s+me\s+(?:the\s+)?parts/i
  ],
  parts_lookup: [
    /part\s+number/i,
    /niin|nsn|nato/i,
    /where\s+(?:can\s+i\s+)?(?:get|buy|order)/i,
    /what\s+part\s+(?:is|do\s+i\s+need)/i
  ],
  specifications: [
    /torque\s+(?:spec|value|setting)/i,
    /capacity|how\s+much|volume/i,
    /spec(?:s|ification)/i,
    /what\s+(?:size|type|grade)/i
  ],
  weather: [
    /weather|forecast|temperature/i,
    /will\s+it\s+rain/i,
    /conditions?\s+(?:for|today|tomorrow)/i
  ],
  other: []
};

// Off-topic detection patterns
// Note: "software" and "code" removed -- modern Unimogs have ECUs and diagnostic software.
// Vehicle electronics queries (fault codes, CAN bus, diagnostic software) are legitimate.
const OFF_TOPIC_PATTERNS = [
  /recipe|cook|food/i,
  /movie|music|entertainment/i,
  /politics|election|government/i,
  /sports?|(?:video\s+)?game|team\s+score/i,
  /homework|essay|assignment/i,
  /(?:write|build)\s+(?:a\s+)?(?:website|app|program)/i,
  /relationship|dating|love/i
];

/**
 * Check if query contains blocked dangerous topics
 */
function checkDangerousTopics(query: string): string | null {
  const queryLower = query.toLowerCase();
  for (const topic of BLOCKED_TOPICS) {
    if (queryLower.includes(topic)) {
      return topic;
    }
  }
  return null;
}

/**
 * Check if query is technical/Unimog-related
 */
function isTechnicalQuery(query: string): boolean {
  const queryLower = query.toLowerCase();
  const words = queryLower.split(/\s+/);

  for (const word of words) {
    if (TECHNICAL_KEYWORDS.has(word)) {
      return true;
    }
  }

  // Check for compound terms
  const compoundTerms = [
    'portal hub', 'wheel hub', 'transfer case', 'diff lock',
    'power take', 'torque tube', 'leaf spring', 'oil change'
  ];

  for (const term of compoundTerms) {
    if (queryLower.includes(term)) {
      return true;
    }
  }

  return false;
}

/**
 * Check if query is off-topic
 */
function isOffTopic(query: string): boolean {
  for (const pattern of OFF_TOPIC_PATTERNS) {
    if (pattern.test(query)) {
      return true;
    }
  }
  return false;
}

/**
 * Detect the task type from query
 */
function detectTask(query: string): BarryTask {
  for (const [task, patterns] of Object.entries(TASK_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(query)) {
        return task as BarryTask;
      }
    }
  }
  return 'other';
}

/**
 * Domain Guard Skill - Main execution function
 */
export async function executeDomainGuard(
  input: DomainGuardInput,
  context: SkillExecutionContext
): Promise<SkillResult<DomainGuardOutput>> {
  const startTime = performance.now();
  const skillName = 'barry-domain-guard';

  try {
    const { query } = input;

    // Check for dangerous topics first
    const dangerousTopic = checkDangerousTopics(query);
    if (dangerousTopic) {
      return {
        success: true,
        data: {
          is_allowed: false,
          domain: 'dangerous',
          task: 'other',
          reason: `Blocked dangerous topic: ${dangerousTopic}`,
          redirect_message: DANGEROUS_BLOCK_MESSAGE
        },
        executionTimeMs: performance.now() - startTime,
        skillName
      };
    }

    // Check if technical/Unimog-related
    const technical = isTechnicalQuery(query);

    if (technical) {
      const task = detectTask(query);
      return {
        success: true,
        data: {
          is_allowed: true,
          domain: 'technical',
          task,
          reason: 'Technical Unimog query detected'
        },
        executionTimeMs: performance.now() - startTime,
        skillName
      };
    }

    // Check if off-topic
    if (isOffTopic(query)) {
      return {
        success: true,
        data: {
          is_allowed: false,
          domain: 'off_topic',
          task: 'other',
          reason: 'Query not related to Unimog or vehicle maintenance',
          redirect_message: OFF_TOPIC_REDIRECT
        },
        executionTimeMs: performance.now() - startTime,
        skillName
      };
    }

    // Default to general domain (allowed but non-technical)
    const task = detectTask(query);
    return {
      success: true,
      data: {
        is_allowed: true,
        domain: 'general',
        task,
        reason: 'General query - will attempt to assist'
      },
      executionTimeMs: performance.now() - startTime,
      skillName
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Domain guard failed',
      executionTimeMs: performance.now() - startTime,
      skillName
    };
  }
}

export default executeDomainGuard;
