import {
  matchSemanticConcepts,
  PHASE1_SEMANTIC_REGISTRY,
  type BarryClaimClass,
  type SemanticRegistry,
} from './barry-semantic.ts';
import {
  extractNumericValues,
  type NumericValue,
} from './barry-evidence-policy.ts';

export const BARRY_CLAIM_PIPELINE_VERSION = '1.0.0-phase4';

export interface TechnicalClaim {
  claimId: string;
  text: string;
  claimClass: BarryClaimClass;
  subjectConceptKeys: string[];
  safetyCritical: boolean;
  numericValues: NumericValue[];
  partNumbers: string[];
  modelMentions: string[];
  lineIndex: number;
}

export type ClaimDecisionStatus = 'supported' | 'narrowed' | 'unsupported' | 'conflicted';

export interface ClaimDecision {
  claimId: string;
  status: ClaimDecisionStatus;
  evidenceKeys: string[];
  confidence: number;
  reasonCode: string;
  finalText?: string;
}

export interface GroundingLedger {
  requestId: string;
  pipelineVersion: string;
  semanticVersion: string;
  claims: TechnicalClaim[];
  decisions: ClaimDecision[];
  citedEvidenceKeys: string[];
  abstained: boolean;
  verifierStatus: 'ok' | 'model_error' | 'model_unavailable';
  verifierLatencyMs: number;
}

const SAFETY_CRITICAL_CLASSES: ReadonlySet<BarryClaimClass> = new Set([
  'procedure_step',
  'fluid',
  'capacity',
  'torque',
  'part_number',
  'compatibility',
  'safety_warning',
]);

const NUMBERED_STEP = /^\s*(?:[-*]\s*)?\d+\s*[.)]\s+\S/;
const SAFETY_PATTERN = /\b(warning|caution|danger|risk of|do not|never)\b/i;
const DIAGNOSTIC_PATTERN = /\b(likely caused|possible cause|indicates|suggests|check for|inspect for|if .+ then)\b/i;
const MODEL_PATTERN = /\b(u\s?\d{3,4}\s?l?(?:\s?\/\s?\d+)?|unimog\s?\d{3,4})\b/gi;
const MERCEDES_PART_NUMBER = /\b(?:a\s?)?\d{3}\s?\d{3}\s?\d{2}\s?\d{2}\b/g;
const CODED_PART_NUMBER = /\b(?:pa|pb|pba|pbb|niin|nsn)\s?[-:]?\s?[a-z0-9][a-z0-9\s-]{2,14}\b/gi;

const FLUID_TERMS = /\b(atf|automatic transmission fluid|hydraulic (?:oil|fluid)|engine oil|motor oil|gear oil|sae\s?\d+w(?:[-/]\d+)?|antifreeze|coolant|brake fluid)\b/i;

function splitDraftLines(draft: string): string[] {
  return draft
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !/^#{1,6}\s/.test(line) && !/^\*\*[^*]+\*\*:?$/.test(line));
}

function extractPartNumbers(text: string): string[] {
  const found = new Set<string>();
  for (const match of text.matchAll(MERCEDES_PART_NUMBER)) found.add(match[0].trim());
  for (const match of text.matchAll(CODED_PART_NUMBER)) found.add(match[0].trim());
  return [...found];
}

function extractModelMentions(text: string): string[] {
  const found = new Set<string>();
  for (const match of text.matchAll(MODEL_PATTERN)) {
    found.add(match[0].replace(/\s+/g, '').toUpperCase());
  }
  return [...found];
}

function unitToClaimClass(values: NumericValue[]): BarryClaimClass | null {
  if (!values.length) return null;
  const units = new Set(values.map((value) => value.unit));
  if (units.has('newton_metre')) return 'torque';
  if (units.has('litre')) return 'capacity';
  return 'specification';
}

function classifyLine(
  line: string,
  numericValues: NumericValue[],
  partNumbers: string[],
  modelMentions: string[],
): BarryClaimClass {
  if (SAFETY_PATTERN.test(line)) return 'safety_warning';
  const numericClass = unitToClaimClass(numericValues);
  if (numericClass) return numericClass;
  if (partNumbers.length) return 'part_number';
  if (FLUID_TERMS.test(line)) return 'fluid';
  if (NUMBERED_STEP.test(line)) return 'procedure_step';
  if (modelMentions.length && /\b(fits?|applies|applicable|compatible|valid for)\b/i.test(line)) {
    return 'compatibility';
  }
  if (DIAGNOSTIC_PATTERN.test(line)) return 'diagnostic_cause';
  return 'general_description';
}

export function extractTechnicalClaims(
  draft: string,
  registry: SemanticRegistry = PHASE1_SEMANTIC_REGISTRY,
): TechnicalClaim[] {
  const lines = splitDraftLines(draft);
  const claims: TechnicalClaim[] = [];

  lines.forEach((line, lineIndex) => {
    const numericValues = extractNumericValues(line);
    const partNumbers = extractPartNumbers(line);
    const modelMentions = extractModelMentions(line);
    const claimClass = classifyLine(line, numericValues, partNumbers, modelMentions);
    if (claimClass === 'general_description') return;

    const subjectConceptKeys = matchSemanticConcepts('', line, registry)
      .map((match) => match.conceptKey);

    claims.push({
      claimId: `claim-${lineIndex}`,
      text: line,
      claimClass,
      subjectConceptKeys,
      safetyCritical: SAFETY_CRITICAL_CLASSES.has(claimClass),
      numericValues,
      partNumbers,
      modelMentions,
      lineIndex,
    });
  });

  return claims;
}

export function summarizeLedger(ledger: GroundingLedger): Record<string, unknown> {
  const byClass: Record<string, number> = {};
  for (const claim of ledger.claims) {
    byClass[claim.claimClass] = (byClass[claim.claimClass] ?? 0) + 1;
  }
  const byStatus: Record<string, number> = {};
  for (const decision of ledger.decisions) {
    byStatus[decision.status] = (byStatus[decision.status] ?? 0) + 1;
  }
  return {
    pipeline_version: ledger.pipelineVersion,
    claim_count: ledger.claims.length,
    claims_by_class: byClass,
    decisions_by_status: byStatus,
    cited_evidence_count: ledger.citedEvidenceKeys.length,
    abstained: ledger.abstained,
    verifier_status: ledger.verifierStatus,
    verifier_latency_ms: ledger.verifierLatencyMs,
  };
}
