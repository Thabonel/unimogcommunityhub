import type { SemanticRegistry } from '../../supabase/functions/_shared/barry-semantic';

export const BARRY_PHASE2_SOURCE_TYPES = [
  'manual_chunk',
  'barry_v2_content_block',
  'barry_v2_specification',
  'rps_part',
  'rps_illustration',
] as const;

export type BackfillSourceType = (typeof BARRY_PHASE2_SOURCE_TYPES)[number];

export type DocumentRole =
  | 'workshop_manual'
  | 'maintenance_manual'
  | 'owners_manual'
  | 'parts_catalog'
  | 'service_bulletin'
  | 'validated_knowledge'
  | 'community_content'
  | 'unknown';

export type EvidencePageType =
  | 'procedure'
  | 'diagnostic'
  | 'specification'
  | 'warning'
  | 'diagram'
  | 'parts_list'
  | 'explanation'
  | 'index'
  | 'unknown';

export type AnnotationRole =
  | 'primary_subject'
  | 'mentioned_component'
  | 'operation'
  | 'property'
  | 'value_context'
  | 'applicability'
  | 'hazard';

export type AnnotationMethod =
  | 'deterministic'
  | 'structured_extraction'
  | 'model_assisted'
  | 'human_reviewed';

export type ReviewStatus = 'proposed' | 'approved' | 'rejected';

export interface SourceDocumentRecord {
  documentKey: string;
  title: string;
  sourceType: 'barry_v2_manual' | 'manual_chunks_document' | 'rps_catalog';
  sourceRecordId?: string;
  storagePath?: string;
  physicalPageCount?: number;
  checksum?: string;
  modelTags: string[];
  filename?: string;
  manualType?: string;
}

export interface EvidenceSourceRow {
  sourceType: BackfillSourceType;
  sourceRecordId: string;
  documentKey: string;
  physicalPdfPage?: number;
  title?: string;
  contentText?: string;
  hasVisualElements?: boolean;
  systemTags: string[];
  modelTags: string[];
  extractionQuality?: number;
  groupCode?: string;
  groupName?: string;
  vehicleModel?: string;
  specCategory?: string;
  specName?: string;
}

export interface DocumentRegistration {
  documentKey: string;
  title: string;
  documentRole: DocumentRole;
  storagePath?: string;
  physicalPageCount?: number;
  checksum?: string;
  modelTags: string[];
  sourceType: 'barry_v2_manual' | 'manual_chunks_document' | 'rps_catalog';
  sourceRecordId?: string;
  provenance: Record<string, unknown>;
}

export interface EvidenceUnitRecord {
  sourceType: BackfillSourceType;
  sourceRecordId: string;
  documentKey: string;
  physicalPdfPage?: number;
  pageType: EvidencePageType;
  contentHash?: string;
  systemTags: string[];
  modelTags: string[];
  componentTags: string[];
  extractionQuality?: number;
  provenance: Record<string, unknown>;
}

export interface AnnotationRecord {
  sourceType: BackfillSourceType;
  sourceRecordId: string;
  conceptKey: string;
  annotationRole: AnnotationRole;
  confidence: number;
  method: AnnotationMethod;
  reviewStatus: ReviewStatus;
  modelScope: string[];
  provenance: Record<string, unknown>;
}

export interface ReviewQueueRecord {
  dedupeKey: string;
  reviewType: 'concept' | 'alias' | 'relationship' | 'evidence_mapping' | 'ambiguity';
  proposedPayload: Record<string, unknown>;
  riskLevel: 'standard' | 'controlled' | 'safety_critical';
}

export interface ClassifiedPage {
  pageType: EvidencePageType;
  confidence: number;
  reason: string;
}

export interface ClassifiedDocument {
  documentRole: DocumentRole;
  confidence: number;
  reason: string;
}

export interface AdaptedEvidence {
  unit: EvidenceUnitRecord;
  annotations: AnnotationRecord[];
  reviewItems: ReviewQueueRecord[];
}

export interface AdapterContext {
  registry: SemanticRegistry;
  semanticVersion: string;
  documentRoles: Map<string, DocumentRegistration>;
}

export interface BackfillFilters {
  sources?: BackfillSourceType[];
  documentKey?: string;
  pageStart?: number;
  pageEnd?: number;
  batchSize: number;
  resumeCursor?: string;
}

export interface BackfillStats {
  documents: number;
  evidenceUnits: number;
  annotationsApproved: number;
  annotationsProposed: number;
  reviewItems: number;
  skipped: number;
  cursor?: string;
}

export const APPROVED_CONFIDENCE_THRESHOLD = 0.85;
export const PROPOSED_CONFIDENCE_THRESHOLD = 0.6;

export function reviewStatusForConfidence(confidence: number): ReviewStatus | null {
  if (confidence >= APPROVED_CONFIDENCE_THRESHOLD) return 'approved';
  if (confidence >= PROPOSED_CONFIDENCE_THRESHOLD) return 'proposed';
  return null;
}
