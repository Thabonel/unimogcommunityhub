import { createHash } from 'node:crypto';
import type { Client } from 'pg';
import type {
  AnnotationRecord,
  BackfillSourceType,
  BackfillStats,
  DocumentRegistration,
  EvidenceUnitRecord,
  ReviewQueueRecord,
} from './barry-evidence-types';

export interface BackfillStore {
  ensureRun(runKey: string, mode: 'dry_run' | 'apply', filters: Record<string, unknown>): Promise<string | null>;
  completeRun(runKey: string, stats: BackfillStats): Promise<void>;
  semanticVersionId(): Promise<string>;
  upsertDocument(document: DocumentRegistration): Promise<string>;
  upsertEvidenceUnit(unit: EvidenceUnitRecord, documentId: string, runId: string | null): Promise<string>;
  upsertAnnotation(annotation: AnnotationRecord, evidenceUnitId: string, runId: string | null): Promise<void>;
  insertReviewItem(item: ReviewQueueRecord): Promise<void>;
  rollbackRun(runKey: string): Promise<Record<string, unknown>>;
}

export function stableUuid(input: string): string {
  const hex = createHash('sha256').update(input).digest('hex');
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    `5${hex.slice(13, 16)}`,
    `8${hex.slice(17, 20)}`,
    hex.slice(20, 32),
  ].join('-');
}

export class PgBackfillStore implements BackfillStore {
  constructor(
    private readonly client: Client,
    private readonly versionId: string,
  ) {}

  async semanticVersionId(): Promise<string> {
    return this.versionId;
  }

  async ensureRun(runKey: string, mode: 'dry_run' | 'apply', filters: Record<string, unknown>): Promise<string | null> {
    const result = await this.client.query(
      `INSERT INTO public.barry_backfill_runs (run_key, semantic_version_id, mode, filters)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (run_key) DO UPDATE SET filters = EXCLUDED.filters
       RETURNING id`,
      [runKey, this.versionId, mode, JSON.stringify(filters)],
    );
    return result.rows[0]?.id ?? null;
  }

  async completeRun(runKey: string, stats: BackfillStats): Promise<void> {
    await this.client.query(
      `UPDATE public.barry_backfill_runs
       SET status = 'completed', stats = $2, completed_at = now()
       WHERE run_key = $1`,
      [runKey, JSON.stringify(stats)],
    );
  }

  async upsertDocument(document: DocumentRegistration): Promise<string> {
    const result = await this.client.query(
      `INSERT INTO public.barry_documents (
         document_key, title, document_role, storage_path, physical_page_count,
         checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       ON CONFLICT (semantic_version_id, document_key)
       DO UPDATE SET title = EXCLUDED.title, document_role = EXCLUDED.document_role,
         storage_path = EXCLUDED.storage_path, physical_page_count = EXCLUDED.physical_page_count,
         checksum = EXCLUDED.checksum, model_tags = EXCLUDED.model_tags,
         provenance = EXCLUDED.provenance, updated_at = now()
       RETURNING id`,
      [
        document.documentKey,
        document.title,
        document.documentRole,
        document.storagePath ?? null,
        document.physicalPageCount ?? null,
        document.checksum ?? null,
        document.modelTags,
        document.sourceType,
        document.sourceRecordId ?? null,
        this.versionId,
        JSON.stringify(document.provenance),
      ],
    );
    return result.rows[0].id;
  }

  async upsertEvidenceUnit(unit: EvidenceUnitRecord, documentId: string, runId: string | null): Promise<string> {
    const result = await this.client.query(
      `INSERT INTO public.barry_evidence_units (
         document_id, source_type, source_record_id, physical_pdf_page, page_type,
         content_hash, system_tags, model_tags, component_tags, extraction_quality,
         semantic_version_id, backfill_run_id, provenance
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       ON CONFLICT (semantic_version_id, source_type, source_record_id)
       DO UPDATE SET document_id = EXCLUDED.document_id, physical_pdf_page = EXCLUDED.physical_pdf_page,
         page_type = EXCLUDED.page_type, content_hash = EXCLUDED.content_hash,
         system_tags = EXCLUDED.system_tags, model_tags = EXCLUDED.model_tags,
         component_tags = EXCLUDED.component_tags, extraction_quality = EXCLUDED.extraction_quality,
         provenance = EXCLUDED.provenance, updated_at = now()
       RETURNING id`,
      [
        documentId,
        unit.sourceType,
        unit.sourceRecordId,
        unit.physicalPdfPage ?? null,
        unit.pageType,
        unit.contentHash ?? null,
        unit.systemTags,
        unit.modelTags,
        unit.componentTags,
        unit.extractionQuality ?? null,
        this.versionId,
        runId,
        JSON.stringify(unit.provenance),
      ],
    );
    return result.rows[0].id;
  }

  async upsertAnnotation(annotation: AnnotationRecord, evidenceUnitId: string, runId: string | null): Promise<void> {
    await this.client.query(
      `INSERT INTO public.barry_evidence_concepts (
         source_type, source_record_id, concept_id, annotation_role, confidence,
         method, review_status, semantic_version_id, evidence_unit_id, model_scope,
         backfill_run_id, provenance
       )
       SELECT $1, $2, concept.id, $3, $4, $5, $6, $7, $8, $9, $10, $11
       FROM public.barry_semantic_concepts concept
       WHERE concept.concept_key = $12
       ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
       DO UPDATE SET confidence = EXCLUDED.confidence, review_status = EXCLUDED.review_status,
         evidence_unit_id = EXCLUDED.evidence_unit_id, model_scope = EXCLUDED.model_scope,
         provenance = EXCLUDED.provenance`,
      [
        annotation.sourceType,
        annotation.sourceRecordId,
        annotation.annotationRole,
        annotation.confidence,
        annotation.method,
        annotation.reviewStatus,
        this.versionId,
        evidenceUnitId,
        annotation.modelScope,
        runId,
        JSON.stringify(annotation.provenance),
        annotation.conceptKey,
      ],
    );
  }

  async insertReviewItem(item: ReviewQueueRecord): Promise<void> {
    await this.client.query(
      `INSERT INTO public.barry_semantic_review_queue (
         dedupe_key, review_type, proposed_payload, risk_level, semantic_version_id
       ) VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (dedupe_key) DO UPDATE SET proposed_payload = EXCLUDED.proposed_payload`,
      [item.dedupeKey, item.reviewType, JSON.stringify(item.proposedPayload), item.riskLevel, this.versionId],
    );
  }

  async rollbackRun(runKey: string): Promise<Record<string, unknown>> {
    const result = await this.client.query(
      'SELECT public.rollback_barry_backfill_run($1) AS result',
      [runKey],
    );
    return result.rows[0]?.result ?? {};
  }
}

export interface DryRunWriteLog {
  documents: DocumentRegistration[];
  units: EvidenceUnitRecord[];
  annotations: AnnotationRecord[];
  reviewItems: ReviewQueueRecord[];
}

export class DryRunBackfillStore implements BackfillStore {
  readonly log: DryRunWriteLog = { documents: [], units: [], annotations: [], reviewItems: [] };
  private readonly ids = new Map<string, string>();

  constructor(private readonly versionId: string) {}

  semanticVersionId(): Promise<string> {
    return Promise.resolve(this.versionId);
  }

  ensureRun(): Promise<string | null> {
    return Promise.resolve(null);
  }

  completeRun(): Promise<void> {
    return Promise.resolve();
  }

  upsertDocument(document: DocumentRegistration): Promise<string> {
    this.log.documents.push(document);
    const key = `doc:${document.documentKey}`;
    if (!this.ids.has(key)) this.ids.set(key, stableUuid(key));
    return Promise.resolve(this.ids.get(key)!);
  }

  upsertEvidenceUnit(unit: EvidenceUnitRecord): Promise<string> {
    this.log.units.push(unit);
    const key = `unit:${unit.sourceType}:${unit.sourceRecordId}`;
    if (!this.ids.has(key)) this.ids.set(key, stableUuid(key));
    return Promise.resolve(this.ids.get(key)!);
  }

  upsertAnnotation(annotation: AnnotationRecord): Promise<void> {
    this.log.annotations.push(annotation);
    return Promise.resolve();
  }

  insertReviewItem(item: ReviewQueueRecord): Promise<void> {
    this.log.reviewItems.push(item);
    return Promise.resolve();
  }

  rollbackRun(): Promise<Record<string, unknown>> {
    return Promise.resolve({ status: 'dry_run_noop' });
  }
}

export const SEMANTIC_WRITABLE_TABLES = [
  'barry_backfill_runs',
  'barry_documents',
  'barry_evidence_units',
  'barry_evidence_concepts',
  'barry_semantic_review_queue',
] as const;

export type { BackfillSourceType };
