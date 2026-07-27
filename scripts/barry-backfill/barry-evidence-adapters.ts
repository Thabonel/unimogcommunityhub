import { createHash } from 'node:crypto';
import {
  normalizeSemanticText,
  type SemanticConceptDefinition,
} from '../../supabase/functions/_shared/barry-semantic';
import type {
  AdapterContext,
  AdaptedEvidence,
  AnnotationRecord,
  AnnotationRole,
  DocumentRegistration,
  EvidenceSourceRow,
  ReviewQueueRecord,
} from './barry-evidence-types';
import { classifyEvidencePage } from './barry-evidence-classify';
import { reviewStatusForConfidence } from './barry-evidence-types';

const ANNOTATABLE_TYPES = new Set([
  'vehicle_model',
  'vehicle_system',
  'component',
  'symptom',
  'operation',
  'property',
  'fluid',
  'part',
  'tool',
  'hazard',
]);

const DIAGRAM_ALLOWED_ROLES = new Set<AnnotationRole>([
  'primary_subject',
  'mentioned_component',
  'applicability',
]);

const ROLE_BY_CONCEPT_TYPE: Record<string, AnnotationRole> = {
  vehicle_model: 'applicability',
  vehicle_system: 'mentioned_component',
  component: 'mentioned_component',
  symptom: 'mentioned_component',
  operation: 'operation',
  property: 'property',
  fluid: 'value_context',
  part: 'mentioned_component',
  tool: 'mentioned_component',
  hazard: 'hazard',
};

function containsPhrase(normalizedText: string, phrase: string): boolean {
  return ` ${normalizedText} `.includes(` ${normalizeSemanticText(phrase)} `);
}

function contentHash(text: string | undefined): string | undefined {
  if (!text) return undefined;
  return createHash('sha256').update(normalizeSemanticText(text)).digest('hex').slice(0, 32);
}

export function resolveModelScope(tags: string[], context: AdapterContext): string[] {
  const keys: string[] = [];
  for (const tag of tags) {
    for (const concept of context.registry.concepts) {
      if (concept.conceptType !== 'vehicle_model' && concept.conceptType !== 'vehicle_variant') continue;
      if (normalizeSemanticText(concept.canonicalName) === normalizeSemanticText(tag)) {
        keys.push(concept.conceptKey);
        break;
      }
      const aliasHit = context.registry.aliases.some((alias) =>
        alias.conceptKey === concept.conceptKey
        && normalizeSemanticText(alias.aliasText) === normalizeSemanticText(tag));
      if (aliasHit) {
        keys.push(concept.conceptKey);
        break;
      }
    }
  }
  return [...new Set(keys)];
}

interface ConceptMatch {
  concept: SemanticConceptDefinition;
  primary: boolean;
}

function matchConcepts(
  context: AdapterContext,
  headingText: string,
  bodyText: string,
): ConceptMatch[] {
  const normalizedHeading = normalizeSemanticText(headingText);
  const normalizedBody = normalizeSemanticText(bodyText);
  const matches = new Map<string, ConceptMatch>();
  const resolved = new Set<string>();

  const annotatable = context.registry.concepts.filter((concept) =>
    ANNOTATABLE_TYPES.has(concept.conceptType));

  for (const concept of annotatable) {
    const inHeading = containsPhrase(normalizedHeading, concept.canonicalName);
    const inBody = containsPhrase(normalizedBody, concept.canonicalName);
    if (inHeading || inBody) {
      matches.set(concept.conceptKey, { concept, primary: inHeading });
      resolved.add(concept.conceptKey);
    }
  }

  for (const requireContext of [false, true]) {
    for (const alias of context.registry.aliases) {
      const isContextual = Boolean(alias.contextConceptKeys?.length);
      if (isContextual !== requireContext) continue;
      if (isContextual && !alias.contextConceptKeys!.some((key) => resolved.has(key))) continue;
      if (matches.has(alias.conceptKey)) continue;
      const concept = annotatable.find((entry) => entry.conceptKey === alias.conceptKey);
      if (!concept) continue;
      const inHeading = containsPhrase(normalizedHeading, alias.aliasText);
      const inBody = containsPhrase(normalizedBody, alias.aliasText);
      if (inHeading || inBody) {
        matches.set(concept.conceptKey, { concept, primary: inHeading });
        resolved.add(concept.conceptKey);
      }
    }
  }

  return [...matches.values()];
}

function confidenceFor(match: ConceptMatch, pageConfidence: number): number {
  const base = match.primary ? 0.9 : 0.7;
  return Math.min(base, pageConfidence);
}

function reviewItem(
  row: EvidenceSourceRow,
  reason: string,
  candidates: string[],
  riskLevel: ReviewQueueRecord['riskLevel'] = 'controlled',
): ReviewQueueRecord {
  return {
    dedupeKey: `evidence_mapping:${row.sourceType}:${row.sourceRecordId}:${reason.replace(/\s+/g, '_').slice(0, 60)}`,
    reviewType: candidates.length > 1 ? 'ambiguity' : 'evidence_mapping',
    proposedPayload: {
      source_type: row.sourceType,
      source_record_id: row.sourceRecordId,
      document_key: row.documentKey,
      physical_pdf_page: row.physicalPdfPage ?? null,
      reason,
      candidate_concept_keys: candidates,
    },
    riskLevel,
  };
}

function toAnnotation(
  row: EvidenceSourceRow,
  match: ConceptMatch,
  role: AnnotationRole,
  confidence: number,
  modelScope: string[],
  document: DocumentRegistration,
): AnnotationRecord | null {
  const reviewStatus = reviewStatusForConfidence(confidence);
  if (!reviewStatus) return null;
  return {
    sourceType: row.sourceType,
    sourceRecordId: row.sourceRecordId,
    conceptKey: match.concept.conceptKey,
    annotationRole: role,
    confidence,
    method: 'deterministic',
    reviewStatus,
    modelScope,
    provenance: {
      source: 'phase2_backfill',
      document_key: row.documentKey,
      document_role: document.documentRole,
      matched_name: match.concept.canonicalName,
      primary: match.primary,
    },
  };
}

function adaptTextualRow(
  row: EvidenceSourceRow,
  context: AdapterContext,
): AdaptedEvidence {
  const document = context.documentRoles.get(row.documentKey);
  if (!document) {
    throw new Error(`No registered document for key ${row.documentKey}`);
  }
  const page = classifyEvidencePage(row, document.documentRole);
  const reviewItems: ReviewQueueRecord[] = [];

  if (page.confidence < 0.6) {
    reviewItems.push(reviewItem(row, `uncertain page type: ${page.reason}`, []));
  }

  const headingText = `${row.title ?? ''}\n${(row.contentText ?? '').slice(0, 160)}`;
  const matches = matchConcepts(context, headingText, row.contentText ?? '');
  const annotations: AnnotationRecord[] = [];
  const diagramOnly = page.pageType === 'diagram' || page.pageType === 'parts_list';

  for (const match of matches) {
    let role: AnnotationRole = match.primary && (match.concept.conceptType === 'component' || match.concept.conceptType === 'part')
      ? 'primary_subject'
      : ROLE_BY_CONCEPT_TYPE[match.concept.conceptType] ?? 'mentioned_component';

    if (diagramOnly && !DIAGRAM_ALLOWED_ROLES.has(role)) {
      reviewItems.push(reviewItem(
        row,
        `${page.pageType} page cannot carry ${role} annotation for ${match.concept.conceptKey}`,
        [match.concept.conceptKey],
      ));
      continue;
    }

    const confidence = confidenceFor(match, page.confidence);
    const annotation = toAnnotation(row, match, role, confidence, resolveModelScope(document.modelTags, context), document);
    if (annotation) {
      annotations.push(annotation);
    } else {
      reviewItems.push(reviewItem(
        row,
        `low-confidence match for ${match.concept.conceptKey}`,
        [match.concept.conceptKey],
      ));
    }
  }

  return {
    unit: {
      sourceType: row.sourceType,
      sourceRecordId: row.sourceRecordId,
      documentKey: row.documentKey,
      physicalPdfPage: row.physicalPdfPage,
      pageType: page.pageType,
      contentHash: contentHash(row.contentText),
      systemTags: row.systemTags,
      modelTags: row.modelTags.length ? row.modelTags : document.modelTags,
      componentTags: matches
        .filter((m) => m.concept.conceptType === 'component')
        .map((m) => m.concept.conceptKey),
      extractionQuality: row.extractionQuality,
      provenance: {
        source: 'phase2_backfill',
        page_type_reason: page.reason,
        page_type_confidence: page.confidence,
      },
    },
    annotations,
    reviewItems,
  };
}

function adaptRpsPart(row: EvidenceSourceRow, context: AdapterContext): AdaptedEvidence {
  const document = context.documentRoles.get(row.documentKey);
  if (!document) {
    throw new Error(`No registered document for key ${row.documentKey}`);
  }
  const page = classifyEvidencePage(row, document.documentRole);
  const reviewItems: ReviewQueueRecord[] = [];
  const annotations: AnnotationRecord[] = [];

  const groupMatches = matchConcepts(context, row.groupName ?? '', '');
  const componentMatches = groupMatches.filter((m) => m.concept.conceptType === 'component');
  const systemMatches = groupMatches.filter((m) => m.concept.conceptType === 'vehicle_system');

  if (componentMatches.length > 1) {
    const candidateKeys = componentMatches.map((m) => m.concept.conceptKey);
    reviewItems.push(reviewItem(
      row,
      `ambiguous RPS group name ${row.groupName ?? ''}`,
      candidateKeys,
    ));
  }

  const descriptionMatches = matchConcepts(context, row.title ?? '', '');
  const partMatches = descriptionMatches.filter((m) => m.concept.conceptType === 'part');

  const modelTags = row.vehicleModel ? [row.vehicleModel] : (row.modelTags.length ? row.modelTags : document.modelTags);
  const modelScope = resolveModelScope(modelTags, context);

  for (const match of partMatches) {
    const confidence = modelScope.length ? 0.9 : 0.7;
    const annotation = toAnnotation(row, match, 'primary_subject', confidence, modelScope, document);
    if (annotation) {
      annotations.push(annotation);
    } else {
      reviewItems.push(reviewItem(row, `low-confidence part match for ${match.concept.conceptKey}`, [match.concept.conceptKey]));
    }
  }

  if (componentMatches.length === 1) {
    const confidence = modelScope.length ? 0.9 : 0.75;
    const annotation = toAnnotation(row, componentMatches[0], 'mentioned_component', confidence, modelScope, document);
    if (annotation) annotations.push(annotation);
  } else if (componentMatches.length === 0 && systemMatches.length === 1) {
    const annotation = toAnnotation(row, systemMatches[0], 'mentioned_component', 0.7, modelScope, document);
    if (annotation) annotations.push(annotation);
  }

  if (!row.vehicleModel && modelScope.length === 0) {
    reviewItems.push(reviewItem(row, 'RPS part has no verified model applicability', []));
  }

  return {
    unit: {
      sourceType: row.sourceType,
      sourceRecordId: row.sourceRecordId,
      documentKey: row.documentKey,
      physicalPdfPage: row.physicalPdfPage,
      pageType: page.pageType,
      systemTags: row.systemTags,
      modelTags,
      componentTags: componentMatches.map((m) => m.concept.conceptKey),
      provenance: {
        source: 'phase2_backfill',
        group_code: row.groupCode ?? null,
        group_name: row.groupName ?? null,
        page_type_reason: page.reason,
      },
    },
    annotations,
    reviewItems,
  };
}

function adaptRpsIllustration(row: EvidenceSourceRow, context: AdapterContext): AdaptedEvidence {
  const document = context.documentRoles.get(row.documentKey);
  if (!document) {
    throw new Error(`No registered document for key ${row.documentKey}`);
  }
  const page = classifyEvidencePage(row, document.documentRole);
  const reviewItems: ReviewQueueRecord[] = [];
  const annotations: AnnotationRecord[] = [];

  const groupMatches = matchConcepts(context, row.groupName ?? '', '');
  const componentMatches = groupMatches.filter((m) => m.concept.conceptType === 'component');
  const systemMatches = groupMatches.filter((m) => m.concept.conceptType === 'vehicle_system');

  if (componentMatches.length === 1) {
    const annotation = toAnnotation(
      row,
      componentMatches[0],
      'primary_subject',
      0.9,
      resolveModelScope(document.modelTags, context),
      document,
    );
    if (annotation) annotations.push(annotation);
  } else if (componentMatches.length === 0 && systemMatches.length === 1) {
    const annotation = toAnnotation(
      row,
      systemMatches[0],
      'mentioned_component',
      0.75,
      resolveModelScope(document.modelTags, context),
      document,
    );
    if (annotation) annotations.push(annotation);
  } else if (componentMatches.length > 1) {
    reviewItems.push(reviewItem(
      row,
      `ambiguous RPS illustration group ${row.groupName ?? ''}`,
      componentMatches.map((m) => m.concept.conceptKey),
    ));
  } else {
    reviewItems.push(reviewItem(row, `unresolved RPS illustration group ${row.groupName ?? ''}`, []));
  }

  return {
    unit: {
      sourceType: row.sourceType,
      sourceRecordId: row.sourceRecordId,
      documentKey: row.documentKey,
      physicalPdfPage: row.physicalPdfPage,
      pageType: page.pageType,
      systemTags: row.systemTags,
      modelTags: document.modelTags,
      componentTags: componentMatches.map((m) => m.concept.conceptKey),
      provenance: {
        source: 'phase2_backfill',
        group_code: row.groupCode ?? null,
        page_type_reason: page.reason,
      },
    },
    annotations,
    reviewItems,
  };
}

function adaptSpecification(row: EvidenceSourceRow, context: AdapterContext): AdaptedEvidence {
  const document = context.documentRoles.get(row.documentKey);
  if (!document) {
    throw new Error(`No registered document for key ${row.documentKey}`);
  }
  const page = classifyEvidencePage(row, document.documentRole);
  const reviewItems: ReviewQueueRecord[] = [];
  const annotations: AnnotationRecord[] = [];

  const nameMatches = matchConcepts(context, `${row.specCategory ?? ''} ${row.specName ?? ''}`, '');
  const propertyMatches = nameMatches.filter((m) => m.concept.conceptType === 'property');

  for (const match of propertyMatches) {
    const hasApplicability = row.modelTags.length > 0;
    const confidence = hasApplicability ? 0.9 : 0.65;
    const annotation = toAnnotation(row, match, 'property', confidence, row.modelTags, document);
    if (annotation) {
      annotations.push(annotation);
    } else {
      reviewItems.push(reviewItem(row, `low-confidence specification property ${match.concept.conceptKey}`, [match.concept.conceptKey]));
    }
  }

  if (row.modelTags.length === 0) {
    reviewItems.push(reviewItem(
      row,
      'specification has unknown model applicability',
      propertyMatches.map((m) => m.concept.conceptKey),
      'safety_critical',
    ));
  }

  return {
    unit: {
      sourceType: row.sourceType,
      sourceRecordId: row.sourceRecordId,
      documentKey: row.documentKey,
      physicalPdfPage: row.physicalPdfPage,
      pageType: page.pageType,
      systemTags: row.systemTags,
      modelTags: row.modelTags,
      componentTags: nameMatches
        .filter((m) => m.concept.conceptType === 'component')
        .map((m) => m.concept.conceptKey),
      provenance: {
        source: 'phase2_backfill',
        spec_category: row.specCategory ?? null,
        page_type_reason: page.reason,
      },
    },
    annotations,
    reviewItems,
  };
}

export function adaptEvidenceRow(row: EvidenceSourceRow, context: AdapterContext): AdaptedEvidence {
  switch (row.sourceType) {
    case 'manual_chunk':
    case 'barry_v2_content_block':
      return adaptTextualRow(row, context);
    case 'rps_part':
      return adaptRpsPart(row, context);
    case 'rps_illustration':
      return adaptRpsIllustration(row, context);
    case 'barry_v2_specification':
      return adaptSpecification(row, context);
    default:
      throw new Error(`Unsupported source type ${(row as EvidenceSourceRow).sourceType}`);
  }
}
