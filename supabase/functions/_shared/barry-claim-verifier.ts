import {
  PHASE1_SEMANTIC_REGISTRY,
  type SemanticQueryFrame,
  type SemanticRegistry,
} from './barry-semantic.ts';
import {
  extractNumericValues,
  isClaimClassPermitted,
  numericValuesMatch,
  partNumbersMatch,
  type ApplicabilityDecision,
  type PolicyDocumentRole,
  type PolicyPageType,
} from './barry-evidence-policy.ts';
import {
  planSemanticRetrieval,
  type ShadowEvidenceCandidate,
} from './barry-retrieval-planner.ts';
import {
  BARRY_CLAIM_PIPELINE_VERSION,
  extractTechnicalClaims,
  type ClaimDecision,
  type GroundingLedger,
  type TechnicalClaim,
} from './barry-claims.ts';

export interface VerifierEvidenceUnit {
  evidenceKey: string;
  documentRole: PolicyDocumentRole;
  pageType: PolicyPageType;
  applicability: ApplicabilityDecision;
  matchedConceptKeys: string[];
  pageNumber?: number;
  storageUrl?: string;
  text: string;
  numericValues: ReturnType<typeof extractNumericValues>;
}

export interface ModelVerdict {
  claimId: string;
  status: 'supported' | 'narrowed' | 'unsupported' | 'conflicted';
  evidenceKeys?: string[];
  finalText?: string;
}

export type ClaimVerifierModel = (
  payload: {
    query: string;
    claims: Array<{
      claimId: string;
      text: string;
      claimClass: string;
      evidence: Array<{ evidenceKey: string; documentRole: string; pageType: string; text: string }>;
    }>;
  },
) => Promise<ModelVerdict[]>;

export interface GroundingSuccess {
  ok: true;
  answer: string;
  ledger: GroundingLedger;
  citedUnits: VerifierEvidenceUnit[];
}

export interface GroundingFailure {
  ok: false;
  reasonCode: string;
  ledger?: GroundingLedger;
}

const MAX_MODEL_CLAIMS = 12;
const MAX_EVIDENCE_PER_CLAIM = 4;
const EVIDENCE_TEXT_LIMIT = 500;

const GAP_LABELS: Record<string, string> = {
  procedure_step: 'no verified repair procedure',
  diagnostic_cause: 'no verified diagnostic cause',
  diagnostic_test: 'no verified diagnostic test',
  specification: 'no verified specification',
  fluid: 'no verified fluid specification',
  capacity: 'no verified capacity value',
  torque: 'no applicable torque value',
  part_number: 'no confirmed part number',
  compatibility: 'no verified applicability statement',
  safety_warning: 'no documented warning',
};

export function buildEvidenceUnits(
  frame: SemanticQueryFrame,
  candidates: ShadowEvidenceCandidate[],
  registry: SemanticRegistry = PHASE1_SEMANTIC_REGISTRY,
): VerifierEvidenceUnit[] {
  const plan = planSemanticRetrieval(frame, candidates, registry);
  const byId = new Map(candidates.map((candidate) => [candidate.candidateId, candidate]));
  const units: VerifierEvidenceUnit[] = [];

  for (const ranked of plan.ranked) {
    const candidate = byId.get(ranked.candidateId);
    if (!candidate) continue;
    const text = `${candidate.title ?? ''}\n${candidate.contentPreview ?? ''}`.trim();
    units.push({
      evidenceKey: ranked.candidateId,
      documentRole: ranked.documentRole,
      pageType: ranked.pageType,
      applicability: ranked.applicability,
      matchedConceptKeys: ranked.matchedConceptKeys,
      pageNumber: candidate.pageNumber,
      storageUrl: candidate.storageUrl,
      text: text.slice(0, EVIDENCE_TEXT_LIMIT),
      numericValues: extractNumericValues(text),
    });
  }

  return units;
}

function eligibleUnits(
  claim: TechnicalClaim,
  units: VerifierEvidenceUnit[],
): VerifierEvidenceUnit[] {
  return units.filter((unit) => {
    if (!isClaimClassPermitted(unit.documentRole, unit.pageType, claim.claimClass)) return false;
    if (unit.applicability === 'incompatible') return false;
    const exactValueClaim = claim.numericValues.length > 0 || claim.partNumbers.length > 0;
    if (claim.safetyCritical && exactValueClaim && unit.applicability === 'unknown') return false;
    return true;
  });
}

function strictNumericMatch(
  claim: ReturnType<typeof extractNumericValues>[number],
  evidence: ReturnType<typeof extractNumericValues>[number],
): boolean {
  if (Boolean(claim.range) !== Boolean(evidence.range)) return false;
  return numericValuesMatch(claim, evidence);
}

function deterministicDecision(
  claim: TechnicalClaim,
  eligible: VerifierEvidenceUnit[],
): ClaimDecision | null {
  if (claim.numericValues.length) {
    const supporting = eligible.filter((unit) =>
      claim.numericValues.every((value) =>
        unit.numericValues.some((candidate) => strictNumericMatch(value, candidate))));
    if (supporting.length) {
      return {
        claimId: claim.claimId,
        status: 'supported',
        evidenceKeys: [supporting[0].evidenceKey],
        confidence: 0.95,
        reasonCode: 'numeric_match',
      };
    }
    const claimUnits = new Set(claim.numericValues.map((value) => value.unit));
    const conflicting = eligible.filter((unit) =>
      unit.numericValues.some((candidate) => claimUnits.has(candidate.unit)));
    if (conflicting.length) {
      return {
        claimId: claim.claimId,
        status: 'conflicted',
        evidenceKeys: conflicting.slice(0, 3).map((unit) => unit.evidenceKey),
        confidence: 0.8,
        reasonCode: 'conflicting_values',
      };
    }
    return {
      claimId: claim.claimId,
      status: 'unsupported',
      evidenceKeys: [],
      confidence: 1,
      reasonCode: eligible.length ? 'value_not_in_evidence' : 'no_eligible_evidence',
    };
  }

  if (claim.partNumbers.length) {
    const supporting = eligible.filter((unit) =>
      claim.partNumbers.every((partNumber) =>
        extractPartNumbersFromText(unit.text).some((candidate) => partNumbersMatch(partNumber, candidate))));
    if (supporting.length) {
      return {
        claimId: claim.claimId,
        status: 'supported',
        evidenceKeys: [supporting[0].evidenceKey],
        confidence: 0.95,
        reasonCode: 'part_number_match',
      };
    }
    return {
      claimId: claim.claimId,
      status: 'unsupported',
      evidenceKeys: [],
      confidence: 1,
      reasonCode: eligible.length ? 'part_number_not_in_evidence' : 'no_eligible_evidence',
    };
  }

  return null;
}

const PART_NUMBER_IN_TEXT = /\b(?:a\s?)?\d{3}\s?\d{3}\s?\d{2}\s?\d{2}\b|\b(?:pa|pb|pba|pbb|niin|nsn)\s?[-:]?\s?[a-z0-9][a-z0-9\s-]{2,14}\b/gi;

function extractPartNumbersFromText(text: string): string[] {
  return [...text.matchAll(PART_NUMBER_IN_TEXT)].map((match) => match[0].trim());
}

function narrowedTextIsSafe(finalText: string, units: VerifierEvidenceUnit[]): boolean {
  const values = extractNumericValues(finalText);
  if (!values.length) return true;
  const evidenceValues = units.flatMap((unit) => unit.numericValues);
  return values.every((value) => evidenceValues.some((candidate) => strictNumericMatch(value, candidate)));
}

function buildReconstructedAnswer(
  draft: string,
  claims: TechnicalClaim[],
  decisions: ClaimDecision[],
): { answer: string; abstained: boolean } {
  const decisionByClaim = new Map(decisions.map((decision) => [decision.claimId, decision]));
  const claimByLine = new Map(claims.map((claim) => [claim.lineIndex, claim]));

  const keptLines: string[] = [];
  const unsupportedClasses = new Set<string>();
  let conflictCount = 0;
  let supportedCount = 0;

  const draftLines = draft.split('\n');
  let trimmedOrdinal = -1;
  for (const rawLine of draftLines) {
    const trimmed = rawLine.trim();
    const isSkippable = !trimmed || /^#{1,6}\s/.test(trimmed) || /^\*\*[^*]+\*\*:?$/.test(trimmed);
    if (isSkippable) {
      keptLines.push(rawLine);
      continue;
    }
    trimmedOrdinal += 1;
    const claim = claimByLine.get(trimmedOrdinal);
    if (!claim) {
      keptLines.push(rawLine);
      continue;
    }
    const decision = decisionByClaim.get(claim.claimId);
    if (!decision) {
      unsupportedClasses.add(claim.claimClass);
      continue;
    }
    if (decision.status === 'supported') {
      supportedCount += 1;
      keptLines.push(rawLine);
    } else if (decision.status === 'narrowed' && decision.finalText) {
      supportedCount += 1;
      keptLines.push(decision.finalText);
    } else if (decision.status === 'conflicted') {
      conflictCount += 1;
    } else {
      unsupportedClasses.add(claim.claimClass);
    }
  }

  const notes: string[] = [];
  if (unsupportedClasses.size) {
    const gaps = [...unsupportedClasses].map((claimClass) => GAP_LABELS[claimClass] ?? `no verified ${claimClass}`);
    notes.push(`The available documentation has ${gaps.join('; ')} for this question.`);
  }
  if (conflictCount) {
    notes.push('The available sources give conflicting values; confirm which configuration is fitted before use.');
  }

  const answer = [...keptLines, ...notes].join('\n').replace(/\n{3,}/g, '\n\n').trim();
  const abstained = claims.length > 0 && supportedCount === 0;
  return { answer, abstained };
}

const VALID_VERDICT_STATUSES: ReadonlySet<string> = new Set(['supported', 'narrowed', 'unsupported', 'conflicted']);

export async function groundTechnicalAnswer(options: {
  requestId: string;
  query: string;
  draft: string;
  frame: SemanticQueryFrame;
  candidates: ShadowEvidenceCandidate[];
  callModel?: ClaimVerifierModel;
  registry?: SemanticRegistry;
}): Promise<GroundingSuccess | GroundingFailure> {
  const registry = options.registry ?? PHASE1_SEMANTIC_REGISTRY;
  const startedAt = Date.now();
  const claims = extractTechnicalClaims(options.draft, registry);
  const units = buildEvidenceUnits(options.frame, options.candidates, registry);

  const baseLedger: GroundingLedger = {
    requestId: options.requestId,
    pipelineVersion: BARRY_CLAIM_PIPELINE_VERSION,
    semanticVersion: registry.version,
    claims,
    decisions: [],
    citedEvidenceKeys: [],
    abstained: false,
    verifierStatus: 'ok',
    verifierLatencyMs: 0,
  };

  if (!claims.length) {
    baseLedger.verifierLatencyMs = Date.now() - startedAt;
    return { ok: true, answer: options.draft, ledger: baseLedger, citedUnits: [] };
  }

  const decisions: ClaimDecision[] = [];
  const modelQueue: Array<{ claim: TechnicalClaim; eligible: VerifierEvidenceUnit[] }> = [];

  for (const claim of claims) {
    const eligible = eligibleUnits(claim, units);
    const deterministic = deterministicDecision(claim, eligible);
    if (deterministic) {
      decisions.push(deterministic);
    } else if (eligible.length) {
      modelQueue.push({ claim, eligible });
    } else {
      decisions.push({
        claimId: claim.claimId,
        status: 'unsupported',
        evidenceKeys: [],
        confidence: 1,
        reasonCode: 'no_eligible_evidence',
      });
    }
  }

  if (modelQueue.length) {
    if (!options.callModel) {
      baseLedger.decisions = decisions;
      baseLedger.verifierStatus = 'model_unavailable';
      baseLedger.verifierLatencyMs = Date.now() - startedAt;
      return { ok: false, reasonCode: 'verifier_unavailable', ledger: baseLedger };
    }

    const payloadClaims = modelQueue.slice(0, MAX_MODEL_CLAIMS).map(({ claim, eligible }) => ({
      claimId: claim.claimId,
      text: claim.text,
      claimClass: claim.claimClass,
      evidence: eligible.slice(0, MAX_EVIDENCE_PER_CLAIM).map((unit) => ({
        evidenceKey: unit.evidenceKey,
        documentRole: unit.documentRole,
        pageType: unit.pageType,
        text: unit.text,
      })),
    }));

    let verdicts: ModelVerdict[];
    try {
      verdicts = await options.callModel({ query: options.query, claims: payloadClaims });
    } catch {
      baseLedger.decisions = decisions;
      baseLedger.verifierStatus = 'model_error';
      baseLedger.verifierLatencyMs = Date.now() - startedAt;
      return { ok: false, reasonCode: 'verifier_model_error', ledger: baseLedger };
    }

    const eligibleByClaim = new Map(modelQueue.map((entry) => [entry.claim.claimId, entry.eligible]));
    const decided = new Set<string>();
    for (const verdict of Array.isArray(verdicts) ? verdicts : []) {
      if (!verdict || typeof verdict.claimId !== 'string' || !VALID_VERDICT_STATUSES.has(verdict.status)) {
        continue;
      }
      const eligible = eligibleByClaim.get(verdict.claimId);
      if (!eligible || decided.has(verdict.claimId)) continue;
      decided.add(verdict.claimId);

      const eligibleKeys = new Set(eligible.map((unit) => unit.evidenceKey));
      const evidenceKeys = (verdict.evidenceKeys ?? []).filter((key) => eligibleKeys.has(key));

      if (verdict.status === 'supported' && !evidenceKeys.length) {
        decisions.push({ claimId: verdict.claimId, status: 'unsupported', evidenceKeys: [], confidence: 0.5, reasonCode: 'verdict_without_evidence' });
        continue;
      }
      if (verdict.status === 'narrowed') {
        const citedUnits = eligible.filter((unit) => evidenceKeys.includes(unit.evidenceKey));
        if (!verdict.finalText || !evidenceKeys.length || !narrowedTextIsSafe(verdict.finalText, citedUnits)) {
          decisions.push({ claimId: verdict.claimId, status: 'unsupported', evidenceKeys: [], confidence: 0.5, reasonCode: 'unsafe_narrowing' });
          continue;
        }
      }
      decisions.push({
        claimId: verdict.claimId,
        status: verdict.status,
        evidenceKeys,
        confidence: 0.7,
        reasonCode: 'model_verdict',
        finalText: verdict.status === 'narrowed' ? verdict.finalText : undefined,
      });
    }

    for (const { claim } of modelQueue) {
      if (!decided.has(claim.claimId)) {
        decisions.push({ claimId: claim.claimId, status: 'unsupported', evidenceKeys: [], confidence: 0.5, reasonCode: 'no_verdict_returned' });
      }
    }
  }

  const { answer, abstained } = buildReconstructedAnswer(options.draft, claims, decisions);

  const citedKeys = new Set<string>();
  for (const decision of decisions) {
    if (decision.status === 'supported' || decision.status === 'narrowed') {
      for (const key of decision.evidenceKeys) citedKeys.add(key);
    }
  }

  const ledger: GroundingLedger = {
    ...baseLedger,
    decisions,
    citedEvidenceKeys: [...citedKeys],
    abstained,
    verifierLatencyMs: Date.now() - startedAt,
  };

  return {
    ok: true,
    answer,
    ledger,
    citedUnits: units.filter((unit) => citedKeys.has(unit.evidenceKey)),
  };
}
