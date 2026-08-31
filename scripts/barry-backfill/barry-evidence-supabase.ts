import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  BackfillFilters,
  BackfillStats,
  BackfillStore,
  DocumentRegistration,
  EvidenceSourceRow,
  SourceDocumentRecord,
} from './barry-evidence-types';
import type { AnnotationRecord, EvidenceUnitRecord, ReviewQueueRecord } from './barry-evidence-types';
import type { CoverageBucket, CoverageRow } from './barry-evidence-coverage';

export class SupabaseSourceReader {
  constructor(private readonly client: SupabaseClient) {}

  async loadSourceDocuments(): Promise<SourceDocumentRecord[]> {
    const documents: SourceDocumentRecord[] = [];

    const { data: manuals, error } = await this.client
      .from('barry_v2_manuals')
      .select('id, title, filename, storage_path, total_pages, manual_type');
    if (error) throw new Error(`manuals read failed: ${error.message}`);

    const { data: applicable } = await this.client
      .from('barry_v2_manual_applicable_models')
      .select('manual_id, vehicle_model_id');
    const { data: models } = await this.client
      .from('barry_v2_vehicle_models')
      .select('id, name');
    const modelNames = new Map((models ?? []).map((model) => [model.id, model.name]));
    const manualModels = new Map<string, string[]>();
    for (const link of applicable ?? []) {
      const name = modelNames.get(link.vehicle_model_id);
      if (!name) continue;
      manualModels.set(link.manual_id, [...(manualModels.get(link.manual_id) ?? []), name]);
    }

    for (const manual of manuals ?? []) {
      documents.push({
        documentKey: `barry_v2_manual:${manual.id}`,
        title: manual.title,
        sourceType: 'barry_v2_manual',
        sourceRecordId: manual.id,
        storagePath: manual.storage_path ?? undefined,
        physicalPageCount: manual.total_pages ?? undefined,
        modelTags: manualModels.get(manual.id) ?? [],
        filename: manual.filename ?? undefined,
        manualType: manual.manual_type ?? undefined,
      });
    }

    const { data: chunkDocs } = await this.client
      .from('manual_chunks')
      .select('manual_id, manual_title, page_number');
    const chunkAggregates = new Map<string, { title: string; maxPage: number }>();
    for (const row of chunkDocs ?? []) {
      const current = chunkAggregates.get(row.manual_id);
      chunkAggregates.set(row.manual_id, {
        title: row.manual_title,
        maxPage: Math.max(current?.maxPage ?? 0, row.page_number ?? 0),
      });
    }
    for (const [manualId, aggregate] of chunkAggregates) {
      documents.push({
        documentKey: `manual_chunks_document:${manualId}`,
        title: aggregate.title,
        sourceType: 'manual_chunks_document',
        sourceRecordId: manualId,
        physicalPageCount: aggregate.maxPage || undefined,
        modelTags: [],
      });
    }

    const { data: rpsNumbers } = await this.client
      .from('rps_parts')
      .select('rps_number')
      .not('rps_number', 'is', null);
    const { data: illustrationNumbers } = await this.client
      .from('rps_illustrations')
      .select('rps_number')
      .not('rps_number', 'is', null);
    const rpsSet = new Set([
      ...(rpsNumbers ?? []).map((row) => row.rps_number),
      ...(illustrationNumbers ?? []).map((row) => row.rps_number),
    ]);
    for (const rpsNumber of rpsSet) {
      documents.push({
        documentKey: `rps_catalog:${rpsNumber}`,
        title: `RPS ${rpsNumber}`,
        sourceType: 'rps_catalog',
        modelTags: [],
      });
    }

    return documents;
  }

  async loadSourceRows(
    filters: BackfillFilters,
    registrations: Map<string, DocumentRegistration>,
  ): Promise<EvidenceSourceRow[]> {
    const rows: EvidenceSourceRow[] = [];
    const wanted = new Set(filters.sources ?? [
      'manual_chunk',
      'barry_v2_content_block',
      'rps_part',
      'rps_illustration',
      'barry_v2_specification',
    ]);
    const documentIds = new Map(
      [...registrations.values()]
        .filter((registration) => registration.sourceRecordId)
        .map((registration) => [registration.sourceRecordId as string, registration.documentKey]),
    );

    type PageFilterQuery<T> = {
      gte: (column: string, value: number) => T;
      lte: (column: string, value: number) => T;
    };
    const applyPageFilter = <T extends PageFilterQuery<T>>(query: T): T => {
      if (filters.pageStart == null) return query;
      return query.gte('page_number', filters.pageStart).lte('page_number', filters.pageEnd ?? filters.pageStart) as T;
    };

    if (wanted.has('manual_chunk')) {
      let query = this.client
        .from('manual_chunks')
        .select('id, manual_id, section_title, page_number, content, has_visual_elements, extraction_quality')
        .in('manual_id', [...documentIds.keys()])
        .order('id');
      query = applyPageFilter(query);
      const { data, error } = await query;
      if (error) throw new Error(`manual_chunks read failed: ${error.message}`);
      for (const row of data ?? []) {
        rows.push({
          sourceType: 'manual_chunk',
          sourceRecordId: row.id,
          documentKey: documentIds.get(row.manual_id)!,
          physicalPdfPage: row.page_number ?? undefined,
          title: row.section_title ?? undefined,
          contentText: row.content ?? undefined,
          hasVisualElements: row.has_visual_elements ?? false,
          systemTags: [],
          modelTags: [],
          extractionQuality: row.extraction_quality ?? undefined,
        });
      }
    }

    if (wanted.has('barry_v2_content_block') || wanted.has('barry_v2_specification')) {
      const { data: chapters } = await this.client
        .from('barry_v2_manual_chapters')
        .select('id, manual_id')
        .in('manual_id', [...documentIds.keys()]);
      const chapterManual = new Map((chapters ?? []).map((chapter) => [chapter.id, chapter.manual_id]));
      const chapterIds = [...chapterManual.keys()];

      const blocksById = new Map<string, Record<string, unknown>>();
      if (chapterIds.length) {
        let blockQuery = this.client
          .from('barry_v2_content_blocks')
          .select('id, chapter_id, title, page_number, content_text, system_tags, model_tags, extraction_quality')
          .in('chapter_id', chapterIds)
          .order('id');
        blockQuery = applyPageFilter(blockQuery);
        const { data: blocks, error } = await blockQuery;
        if (error) throw new Error(`content blocks read failed: ${error.message}`);
        for (const block of blocks ?? []) blocksById.set(block.id, block);

        if (wanted.has('barry_v2_content_block')) {
          for (const block of blocks ?? []) {
            const manualId = chapterManual.get(block.chapter_id);
            rows.push({
              sourceType: 'barry_v2_content_block',
              sourceRecordId: block.id,
              documentKey: documentIds.get(manualId)!,
              physicalPdfPage: block.page_number ?? undefined,
              title: block.title ?? undefined,
              contentText: block.content_text ?? undefined,
              systemTags: block.system_tags ?? [],
              modelTags: block.model_tags ?? [],
              extractionQuality: block.extraction_quality ?? undefined,
            });
          }
        }
      }

      if (wanted.has('barry_v2_specification')) {
        const { data: allBlocks } = chapterIds.length
          ? await this.client
            .from('barry_v2_content_blocks')
            .select('id, chapter_id')
            .in('chapter_id', chapterIds)
          : { data: [] };
        const blockManual = new Map((allBlocks ?? []).map((block) => [block.id, chapterManual.get(block.chapter_id)]));
        const { data: specs } = await this.client
          .from('barry_v2_specifications')
          .select('id, block_id, category, name, source_page, model_tags, system_tag')
          .in('block_id', [...blockManual.keys()]);
        for (const spec of specs ?? []) {
          const manualId = blockManual.get(spec.block_id);
          if (!manualId || !documentIds.has(manualId)) continue;
          rows.push({
            sourceType: 'barry_v2_specification',
            sourceRecordId: spec.id,
            documentKey: documentIds.get(manualId)!,
            physicalPdfPage: spec.source_page ?? undefined,
            systemTags: spec.system_tag ? [spec.system_tag] : [],
            modelTags: spec.model_tags ?? [],
            specCategory: spec.category ?? undefined,
            specName: spec.name ?? undefined,
          });
        }
      }
    }

    if (wanted.has('rps_part') || wanted.has('rps_illustration')) {
      const { data: groups } = await this.client.from('rps_groups').select('group_code, group_name');
      const groupNames = new Map((groups ?? []).map((group) => [group.group_code, group.group_name]));

      if (wanted.has('rps_part')) {
        let query = this.client
          .from('rps_parts')
          .select('id, rps_number, group_code, description, page_number, vehicle_model')
          .not('rps_number', 'is', null)
          .order('id');
        query = applyPageFilter(query);
        const { data, error } = await query;
        if (error) throw new Error(`rps_parts read failed: ${error.message}`);
        for (const part of data ?? []) {
          const documentKey = `rps_catalog:${part.rps_number}`;
          if (!registrations.has(documentKey)) continue;
          rows.push({
            sourceType: 'rps_part',
            sourceRecordId: part.id,
            documentKey,
            physicalPdfPage: part.page_number ?? undefined,
            title: part.description ?? undefined,
            systemTags: [],
            modelTags: [],
            groupCode: part.group_code ?? undefined,
            groupName: groupNames.get(part.group_code) ?? undefined,
            vehicleModel: part.vehicle_model ?? undefined,
          });
        }
      }

      if (wanted.has('rps_illustration')) {
        let query = this.client
          .from('rps_illustrations')
          .select('id, rps_number, group_code, description, page_number')
          .not('rps_number', 'is', null)
          .order('id');
        query = applyPageFilter(query);
        const { data, error } = await query;
        if (error) throw new Error(`rps_illustrations read failed: ${error.message}`);
        for (const illustration of data ?? []) {
          const documentKey = `rps_catalog:${illustration.rps_number}`;
          if (!registrations.has(documentKey)) continue;
          rows.push({
            sourceType: 'rps_illustration',
            sourceRecordId: illustration.id,
            documentKey,
            physicalPdfPage: illustration.page_number ?? undefined,
            title: illustration.description ?? undefined,
            systemTags: [],
            modelTags: [],
            groupCode: illustration.group_code ?? undefined,
            groupName: groupNames.get(illustration.group_code) ?? undefined,
          });
        }
      }
    }

    return rows;
  }
}

export class SupabaseRestStore implements BackfillStore {
  private conceptIds?: Map<string, string>;

  constructor(
    private readonly client: SupabaseClient,
    private readonly versionId: string,
  ) {}

  semanticVersionId(): Promise<string> {
    return Promise.resolve(this.versionId);
  }

  private async conceptId(conceptKey: string): Promise<string> {
    if (!this.conceptIds) {
      const { data, error } = await this.client
        .from('barry_semantic_concepts')
        .select('id, concept_key');
      if (error) throw new Error(`concept read failed: ${error.message}`);
      this.conceptIds = new Map((data ?? []).map((concept) => [concept.concept_key, concept.id]));
    }
    const id = this.conceptIds.get(conceptKey);
    if (!id) throw new Error(`Unknown concept key ${conceptKey}`);
    return id;
  }

  async ensureRun(runKey: string, mode: 'dry_run' | 'apply', filters: Record<string, unknown>): Promise<string | null> {
    const { data, error } = await this.client
      .from('barry_backfill_runs')
      .upsert({
        run_key: runKey,
        semantic_version_id: this.versionId,
        mode,
        filters,
      }, { onConflict: 'run_key' })
      .select('id')
      .single();
    if (error) throw new Error(`run upsert failed: ${error.message}`);
    return data?.id ?? null;
  }

  async completeRun(runKey: string, stats: BackfillStats): Promise<void> {
    const { error } = await this.client
      .from('barry_backfill_runs')
      .update({ status: 'completed', stats, completed_at: new Date().toISOString() })
      .eq('run_key', runKey);
    if (error) throw new Error(`run completion failed: ${error.message}`);
  }

  private async insertThenUpdate(
    table: string,
    insertPayload: Record<string, unknown>,
    updatePayload: Record<string, unknown>,
    conflictMatch: Record<string, unknown>,
  ): Promise<string> {
    const inserted = await this.client.from(table).insert(insertPayload).select('id').single();
    if (!inserted.error) return inserted.data.id;
    if (inserted.error.code !== '23505') {
      throw new Error(`${table} insert failed: ${inserted.error.message}`);
    }
    let update = this.client.from(table).update(updatePayload);
    for (const [column, value] of Object.entries(conflictMatch)) {
      update = update.eq(column, value);
    }
    const updated = await update.select('id').single();
    if (updated.error) throw new Error(`${table} update failed: ${updated.error.message}`);
    return updated.data.id;
  }

  upsertDocument(document: DocumentRegistration): Promise<string> {
    const insertPayload = {
      document_key: document.documentKey,
      title: document.title,
      document_role: document.documentRole,
      storage_path: document.storagePath ?? null,
      physical_page_count: document.physicalPageCount ?? null,
      checksum: document.checksum ?? null,
      model_tags: document.modelTags,
      source_type: document.sourceType,
      source_record_id: document.sourceRecordId ?? null,
      semantic_version_id: this.versionId,
      provenance: document.provenance,
    };
    const { ...updatePayload } = insertPayload;
    return this.insertThenUpdate(
      'barry_documents',
      insertPayload,
      { ...updatePayload, updated_at: new Date().toISOString() },
      { semantic_version_id: this.versionId, document_key: document.documentKey },
    );
  }

  upsertEvidenceUnit(unit: EvidenceUnitRecord, documentId: string, runId: string | null): Promise<string> {
    const insertPayload = {
      document_id: documentId,
      source_type: unit.sourceType,
      source_record_id: unit.sourceRecordId,
      physical_pdf_page: unit.physicalPdfPage ?? null,
      page_type: unit.pageType,
      content_hash: unit.contentHash ?? null,
      system_tags: unit.systemTags,
      model_tags: unit.modelTags,
      component_tags: unit.componentTags,
      extraction_quality: unit.extractionQuality ?? null,
      semantic_version_id: this.versionId,
      backfill_run_id: runId,
      provenance: unit.provenance,
    };
    const { backfill_run_id: _ignored, ...updateBase } = insertPayload;
    return this.insertThenUpdate(
      'barry_evidence_units',
      insertPayload,
      { ...updateBase, updated_at: new Date().toISOString() },
      {
        semantic_version_id: this.versionId,
        source_type: unit.sourceType,
        source_record_id: unit.sourceRecordId,
      },
    );
  }

  async upsertAnnotation(annotation: AnnotationRecord, evidenceUnitId: string, runId: string | null): Promise<void> {
    const conceptId = await this.conceptId(annotation.conceptKey);
    const insertPayload = {
      source_type: annotation.sourceType,
      source_record_id: annotation.sourceRecordId,
      concept_id: conceptId,
      annotation_role: annotation.annotationRole,
      confidence: annotation.confidence,
      method: annotation.method,
      review_status: annotation.reviewStatus,
      semantic_version_id: this.versionId,
      evidence_unit_id: evidenceUnitId,
      model_scope: annotation.modelScope,
      backfill_run_id: runId,
      provenance: annotation.provenance,
    };
    const { backfill_run_id: _ignored, ...updatePayload } = insertPayload;
    await this.insertThenUpdate(
      'barry_evidence_concepts',
      insertPayload,
      updatePayload,
      {
        source_type: annotation.sourceType,
        source_record_id: annotation.sourceRecordId,
        concept_id: conceptId,
        annotation_role: annotation.annotationRole,
        semantic_version_id: this.versionId,
      },
    );
  }

  async insertReviewItem(item: ReviewQueueRecord): Promise<void> {
    const { error } = await this.client
      .from('barry_semantic_review_queue')
      .upsert({
        dedupe_key: item.dedupeKey,
        review_type: item.reviewType,
        proposed_payload: item.proposedPayload,
        risk_level: item.riskLevel,
        semantic_version_id: this.versionId,
      }, { onConflict: 'dedupe_key' });
    if (error) throw new Error(`review item upsert failed: ${error.message}`);
  }

  async rollbackRun(runKey: string): Promise<Record<string, unknown>> {
    const { data, error } = await this.client
      .rpc('rollback_barry_backfill_run', { target_run_key: runKey });
    if (error) throw new Error(`rollback failed: ${error.message}`);
    return data as Record<string, unknown>;
  }
}

export async function loadCoverageViaRest(
  client: SupabaseClient,
  versionId: string,
): Promise<{ rows: CoverageRow[]; bands: CoverageBucket[]; totalUnits: number }> {
  const { data: documents, error: documentsError } = await client
    .from('barry_documents')
    .select('id, document_role')
    .eq('semantic_version_id', versionId);
  if (documentsError) throw new Error(documentsError.message);
  const documentRoles = new Map((documents ?? []).map((document) => [document.id, document.document_role]));

  const { data: units, error: unitsError } = await client
    .from('barry_evidence_units')
    .select('id, source_type, document_id, page_type')
    .eq('semantic_version_id', versionId);
  if (unitsError) throw new Error(unitsError.message);

  const { data: annotations, error: annotationsError } = await client
    .from('barry_evidence_concepts')
    .select('evidence_unit_id, review_status, confidence')
    .eq('semantic_version_id', versionId);
  if (annotationsError) throw new Error(annotationsError.message);

  const groups = new Map<string, CoverageRow>();
  const annotationsByUnit = new Map<string, typeof annotations>();
  for (const annotation of annotations ?? []) {
    const list = annotationsByUnit.get(annotation.evidence_unit_id) ?? [];
    list.push(annotation);
    annotationsByUnit.set(annotation.evidence_unit_id, list);
  }

  for (const unit of units ?? []) {
    const unitAnnotations = annotationsByUnit.get(unit.id) ?? [];
    const statuses = new Set(unitAnnotations.map((annotation) => annotation.review_status));
    if (!statuses.size) statuses.add(null);
    for (const status of statuses) {
      const key = `${unit.source_type}|${documentRoles.get(unit.document_id)}|${unit.page_type}|${status}`;
      const row = groups.get(key) ?? {
        source_type: unit.source_type,
        document_role: documentRoles.get(unit.document_id) ?? 'unknown',
        page_type: unit.page_type,
        review_status: status,
        units: 0,
        annotations: 0,
        approved: 0,
        proposed: 0,
      };
      row.units += 1;
      const inStatus = unitAnnotations.filter((annotation) => annotation.review_status === status);
      row.annotations += inStatus.length;
      row.approved += inStatus.filter((annotation) => annotation.review_status === 'approved').length;
      row.proposed += inStatus.filter((annotation) => annotation.review_status === 'proposed').length;
      groups.set(key, row);
    }
  }

  const bandMap = new Map<string, CoverageBucket>();
  for (const annotation of annotations ?? []) {
    const key = annotation.confidence >= 0.85
      ? 'high (>=0.85)'
      : annotation.confidence >= 0.6
        ? 'medium (0.6-0.85)'
        : 'low (<0.6)';
    const band = bandMap.get(key) ?? { key, units: 0, annotations: 0, approved: 0, proposed: 0 };
    band.annotations += 1;
    if (annotation.review_status === 'approved') band.approved += 1;
    if (annotation.review_status === 'proposed') band.proposed += 1;
    bandMap.set(key, band);
  }

  return {
    rows: [...groups.values()],
    bands: [...bandMap.values()],
    totalUnits: (units ?? []).length,
  };
}
