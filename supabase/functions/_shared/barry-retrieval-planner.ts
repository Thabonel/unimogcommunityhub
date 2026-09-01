import {
  matchSemanticConcepts,
  normalizeSemanticText,
  PHASE1_SEMANTIC_REGISTRY,
  type SemanticQueryFrame,
  type SemanticRegistry,
} from './barry-semantic.ts';
import {
  decideApplicability,
  permittedClaimClasses,
  type ApplicabilityDecision,
  type PolicyDocumentRole,
  type PolicyPageType,
} from './barry-evidence-policy.ts';

export const SHADOW_RETRIEVAL_WEIGHTS_VERSION = '1.0.0-shadow-phase3';

export const SHADOW_RETRIEVAL_WEIGHTS = {
  conceptIdentity: 2.0,
  relationshipRelevance: 0.75,
  lexicalMax: 1.0,
  structuredMatch: 0.5,
  applicabilityExact: 1.0,
  applicabilityConditional: 0.5,
  applicabilityUnknown: 0,
  roleFitness: 0.5,
  roleViolation: -1.0,
  ambiguityPenalty: 0.5,
  distancePenaltyPerHop: 0.25,
} as const;

export interface ShadowEvidenceCandidate {
  candidateId: string;
  source: string;
  title?: string;
  manualTitle?: string;
  pageNumber?: number;
  storageUrl?: string;
  contentPreview?: string;
  blockType?: string;
  retrievalRank?: number;
}

export interface ShadowExpansion {
  sourceConceptKey: string;
  relationshipType: string;
  targetConceptKey: string;
  distance: number;
}

export interface ShadowScoreComponents {
  conceptIdentity: number;
  relationshipRelevance: number;
  lexical: number;
  structured: number;
  applicability: number;
  roleFitness: number;
  ambiguityPenalty: number;
  distancePenalty: number;
}

export interface ShadowRankedCandidate {
  candidateId: string;
  score: number;
  components: ShadowScoreComponents;
  matchedConceptKeys: string[];
  permittedClaimClasses: string[];
  documentRole: PolicyDocumentRole;
  pageType: PolicyPageType;
  applicability: ApplicabilityDecision;
}

export interface ShadowExclusion {
  candidateId: string;
  reasonCode: string;
}

export interface ShadowRetrievalPlan {
  weightsVersion: string;
  semanticVersion: string;
  considered: number;
  expansions: ShadowExpansion[];
  ranked: ShadowRankedCandidate[];
  excluded: ShadowExclusion[];
}

const PROCEDURE_HEADING = /^(checking|check|disassembly and assembly|removal and installation|removing|installing|adjusting|refilling|bleeding|replacing|draining|topping up)\b/im;
const SPECIFICATION_HEADING = /\btechnical data\b|\bspecifications?\b|\btightening torques?\b|\bfilling quantities\b|\blubricants?\b|\b(?:internal\s+)?(?:tray\s+)?dimensions?\b/i;
const DIAGRAM_HEADING = /\bexploded\s+v?[1i]?ew\b|\billustration\b|\bassembly drawing\b/i;
const WARNING_HEADING = /\b(warning|caution|danger)\b/i;

export function inferDocumentRole(candidate: ShadowEvidenceCandidate): PolicyDocumentRole {
  if (candidate.source === 'validated_knowledge_base') return 'validated_knowledge';
  const title = (candidate.manualTitle ?? candidate.title ?? '').toLowerCase();
  if (title.startsWith('rps')) return 'parts_catalog';
  if (/u435[_-]maint[_-]/.test(title)) return 'maintenance_manual';
  if (title.includes('workshop manual')) return 'workshop_manual';
  if (/^uhb(?:\s|_|-)/.test(title) || title.includes('user handbook')) return 'owners_manual';
  if (candidate.source === 'structured_manual_search') return 'workshop_manual';
  return 'unknown';
}

export function inferPageType(candidate: ShadowEvidenceCandidate, documentRole: PolicyDocumentRole): PolicyPageType {
  if (candidate.source === 'validated_knowledge') return 'unknown';
  if (documentRole === 'parts_catalog') return 'parts_list';
  const headingSource = `${candidate.title ?? ''}\n${(candidate.contentPreview ?? '').slice(0, 240)}`;
  const proceduralRole = documentRole === 'workshop_manual' || documentRole === 'maintenance_manual';

  if (DIAGRAM_HEADING.test(headingSource)) return 'diagram';
  if (WARNING_HEADING.test(candidate.title ?? '')) return 'warning';
  if (SPECIFICATION_HEADING.test(headingSource)) return 'specification';
  if (PROCEDURE_HEADING.test(headingSource.trim()) && proceduralRole) return 'procedure';
  return 'unknown';
}

function lexicalOverlapScore(
  frame: SemanticQueryFrame,
  candidateText: string,
  registry: SemanticRegistry,
): number {
  const normalizedCandidate = normalizeSemanticText(candidateText);
  const terms = new Set<string>();
  for (const key of [
    ...frame.systemConceptKeys,
    ...frame.componentConceptKeys,
    ...frame.symptomConceptKeys,
    ...frame.operationConceptKeys,
  ]) {
    const concept = registry.concepts.find((entry) => entry.conceptKey === key);
    if (concept) terms.add(normalizeSemanticText(concept.canonicalName));
  }
  if (!terms.size) return 0;
  let hits = 0;
  for (const term of terms) {
    if (` ${normalizedCandidate} `.includes(` ${term} `)) hits += 1;
  }
  return SHADOW_RETRIEVAL_WEIGHTS.lexicalMax * (hits / terms.size);
}

export function expandSemanticRelationships(
  frame: SemanticQueryFrame,
  registry: SemanticRegistry = PHASE1_SEMANTIC_REGISTRY,
): ShadowExpansion[] {
  const seedConcepts = new Set([
    ...frame.systemConceptKeys,
    ...frame.componentConceptKeys,
    ...frame.symptomConceptKeys,
  ]);
  const expansions: ShadowExpansion[] = [];
  for (const relationship of registry.relationships) {
    if (!seedConcepts.has(relationship.sourceConceptKey)) continue;
    expansions.push({
      sourceConceptKey: relationship.sourceConceptKey,
      relationshipType: relationship.relationshipType,
      targetConceptKey: relationship.targetConceptKey,
      distance: 1,
    });
  }
  return expansions;
}

function inferModelScope(candidate: ShadowEvidenceCandidate): string[] {
  const title = (candidate.manualTitle ?? candidate.title ?? '').toLowerCase();
  const scope: string[] = [];
  if (/\bu?\s?1700\s?l\b/.test(title)) scope.push('vehicle_model.u1700l');
  if (/\bu\s?435\b/.test(title)) scope.push('vehicle_model.u435');
  return scope;
}

export function planSemanticRetrieval(
  frame: SemanticQueryFrame,
  candidates: ShadowEvidenceCandidate[],
  registry: SemanticRegistry = PHASE1_SEMANTIC_REGISTRY,
): ShadowRetrievalPlan {
  const expansions = expandSemanticRelationships(frame, registry);
  const expansionTargets = new Map<string, ShadowExpansion>();
  for (const expansion of expansions) {
    if (!expansionTargets.has(expansion.targetConceptKey)) {
      expansionTargets.set(expansion.targetConceptKey, expansion);
    }
  }

  const frameConceptKeys = new Set([
    ...frame.systemConceptKeys,
    ...frame.componentConceptKeys,
    ...frame.symptomConceptKeys,
    ...frame.operationConceptKeys,
    ...frame.propertyConceptKeys,
    ...frame.fluidConceptKeys,
    ...frame.partConceptKeys,
    ...frame.toolConceptKeys,
    ...frame.hazardConceptKeys,
  ]);
  const ambiguousConceptKeys = new Set(frame.ambiguities.flatMap((ambiguity) => ambiguity.candidateConceptKeys));

  const ranked: ShadowRankedCandidate[] = [];
  const excluded: ShadowExclusion[] = [];

  for (const candidate of candidates) {
    const documentRole = inferDocumentRole(candidate);
    const pageType = inferPageType(candidate, documentRole);
    const permitted = permittedClaimClasses(documentRole, pageType, frame.requestedClaimClasses);

    const matches = matchSemanticConcepts(
      candidate.title ?? '',
      candidate.contentPreview ?? '',
      registry,
    );
    const matchedConceptKeys = matches.map((match) => match.conceptKey);

    const modelScope = inferModelScope(candidate);
    const applicability = decideApplicability(modelScope, frame.vehicleModelConceptKey);
    if (applicability === 'incompatible') {
      excluded.push({ candidateId: candidate.candidateId, reasonCode: 'incompatible_applicability' });
      continue;
    }

    const identityHits = matchedConceptKeys.filter((key) => frameConceptKeys.has(key)).length;
    const expansionHits = matchedConceptKeys.filter((key) => expansionTargets.has(key));
    const ambiguousHits = matchedConceptKeys.filter((key) => ambiguousConceptKeys.has(key)).length;

    const components: ShadowScoreComponents = {
      conceptIdentity: identityHits * SHADOW_RETRIEVAL_WEIGHTS.conceptIdentity,
      relationshipRelevance: expansionHits.length * SHADOW_RETRIEVAL_WEIGHTS.relationshipRelevance,
      lexical: lexicalOverlapScore(frame, `${candidate.title ?? ''} ${candidate.contentPreview ?? ''}`, registry),
      structured: candidate.source === 'structured_manual_search'
        ? SHADOW_RETRIEVAL_WEIGHTS.structuredMatch
        : 0,
      applicability: applicability === 'exact'
        ? SHADOW_RETRIEVAL_WEIGHTS.applicabilityExact
        : applicability === 'conditional' || applicability === 'compatible_series'
          ? SHADOW_RETRIEVAL_WEIGHTS.applicabilityConditional
          : SHADOW_RETRIEVAL_WEIGHTS.applicabilityUnknown,
      roleFitness: permitted.length ? SHADOW_RETRIEVAL_WEIGHTS.roleFitness : SHADOW_RETRIEVAL_WEIGHTS.roleViolation,
      ambiguityPenalty: ambiguousHits * SHADOW_RETRIEVAL_WEIGHTS.ambiguityPenalty,
      distancePenalty: expansionHits.length * SHADOW_RETRIEVAL_WEIGHTS.distancePenaltyPerHop,
    };

    const score = components.conceptIdentity
      + components.relationshipRelevance
      + components.lexical
      + components.structured
      + components.applicability
      + components.roleFitness
      - components.ambiguityPenalty
      - components.distancePenalty;

    ranked.push({
      candidateId: candidate.candidateId,
      score,
      components,
      matchedConceptKeys,
      permittedClaimClasses: permitted,
      documentRole,
      pageType,
      applicability,
    });
  }

  ranked.sort((a, b) => b.score - a.score || a.candidateId.localeCompare(b.candidateId));

  return {
    weightsVersion: SHADOW_RETRIEVAL_WEIGHTS_VERSION,
    semanticVersion: registry.version,
    considered: candidates.length,
    expansions,
    ranked,
    excluded,
  };
}
