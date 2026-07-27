import { describe, expect, it } from 'vitest';
import {
  DryRunBackfillStore,
  SEMANTIC_WRITABLE_TABLES,
  stableUuid,
} from '../../../../scripts/barry-backfill/barry-evidence-store';
import {
  buildCoverageReport,
  confidenceBand,
} from '../../../../scripts/barry-backfill/barry-evidence-coverage';
import { reviewStatusForConfidence } from '../../../../scripts/barry-backfill/barry-evidence-types';
import type { DocumentRegistration } from '../../../../scripts/barry-backfill/barry-evidence-types';

const DOCUMENT: DocumentRegistration = {
  documentKey: 'doc:1',
  title: 'Doc',
  documentRole: 'workshop_manual',
  modelTags: [],
  sourceType: 'manual_chunks_document',
  sourceRecordId: 'src-1',
  provenance: {},
};

describe('stableUuid', () => {
  it('produces deterministic RFC-variant identifiers', () => {
    const first = stableUuid('doc:1');
    expect(first).toBe(stableUuid('doc:1'));
    expect(first).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-8[0-9a-f]{3}-[0-9a-f]{12}$/);
    expect(stableUuid('doc:2')).not.toBe(first);
  });
});

describe('reviewStatusForConfidence', () => {
  it('approves only high-confidence deterministic mappings', () => {
    expect(reviewStatusForConfidence(0.9)).toBe('approved');
    expect(reviewStatusForConfidence(0.85)).toBe('approved');
    expect(reviewStatusForConfidence(0.7)).toBe('proposed');
    expect(reviewStatusForConfidence(0.6)).toBe('proposed');
    expect(reviewStatusForConfidence(0.59)).toBeNull();
  });
});

describe('DryRunBackfillStore', () => {
  it('records planned writes without a database connection', async () => {
    const store = new DryRunBackfillStore('version-1');
    expect(await store.ensureRun('run-1', 'dry_run', {})).toBeNull();

    const documentId = await store.upsertDocument(DOCUMENT);
    const unitId = await store.upsertEvidenceUnit({
      sourceType: 'manual_chunk',
      sourceRecordId: 'chunk-1',
      documentKey: 'doc:1',
      pageType: 'specification',
      systemTags: [],
      modelTags: [],
      componentTags: [],
      provenance: {},
    }, documentId, null);
    await store.upsertAnnotation({
      sourceType: 'manual_chunk',
      sourceRecordId: 'chunk-1',
      conceptKey: 'component.steering_gear',
      annotationRole: 'primary_subject',
      confidence: 0.9,
      method: 'deterministic',
      reviewStatus: 'approved',
      modelScope: [],
      provenance: {},
    }, unitId, null);
    await store.insertReviewItem({
      dedupeKey: 'review-1',
      reviewType: 'evidence_mapping',
      proposedPayload: {},
      riskLevel: 'controlled',
    });
    await store.completeRun('run-1', {
      documents: 1,
      evidenceUnits: 1,
      annotationsApproved: 1,
      annotationsProposed: 0,
      reviewItems: 1,
      skipped: 0,
    });

    expect(store.log.documents).toHaveLength(1);
    expect(store.log.units).toHaveLength(1);
    expect(store.log.annotations).toHaveLength(1);
    expect(store.log.reviewItems).toHaveLength(1);
    expect(await store.rollbackRun('run-1')).toEqual({ status: 'dry_run_noop' });
  });

  it('keeps unit identifiers deterministic for idempotent replays', async () => {
    const first = new DryRunBackfillStore('v');
    const second = new DryRunBackfillStore('v');
    const unit = {
      sourceType: 'manual_chunk' as const,
      sourceRecordId: 'chunk-1',
      documentKey: 'doc:1',
      pageType: 'diagram' as const,
      systemTags: [],
      modelTags: [],
      componentTags: [],
      provenance: {},
    };
    expect(await first.upsertEvidenceUnit(unit, 'd', null))
      .toBe(await second.upsertEvidenceUnit(unit, 'd', null));
  });
});

describe('semantic write allowlist', () => {
  it('only permits writes to semantic layer tables', () => {
    expect([...SEMANTIC_WRITABLE_TABLES].sort()).toEqual([
      'barry_backfill_runs',
      'barry_documents',
      'barry_evidence_concepts',
      'barry_evidence_units',
      'barry_semantic_review_queue',
    ]);
    for (const table of SEMANTIC_WRITABLE_TABLES) {
      expect(table.startsWith('barry_')).toBe(true);
      expect(table).not.toMatch(/manual_chunks|rps_parts|barry_v2/);
    }
  });
});

describe('coverage aggregation', () => {
  it('groups rows by source, role, page type, and review status', () => {
    const report = buildCoverageReport([
      { source_type: 'manual_chunk', document_role: 'workshop_manual', page_type: 'specification', review_status: 'approved', units: 3, annotations: 5, approved: 4, proposed: 1 },
      { source_type: 'manual_chunk', document_role: 'workshop_manual', page_type: 'diagram', review_status: 'approved', units: 2, annotations: 4, approved: 4, proposed: 0 },
      { source_type: 'rps_part', document_role: 'parts_catalog', page_type: 'parts_list', review_status: 'proposed', units: 10, annotations: 12, approved: 0, proposed: 12 },
    ], [
      { key: 'high (>=0.85)', units: 0, annotations: 8, approved: 8, proposed: 0 },
      { key: 'medium (0.6-0.85)', units: 0, annotations: 13, approved: 0, proposed: 13 },
    ]);

    expect(report.totalUnits).toBe(15);
    expect(report.totalAnnotations).toBe(21);
    expect(report.approvedAnnotations).toBe(8);
    expect(report.proposedAnnotations).toBe(13);
    expect(report.bySourceType.map((bucket) => bucket.key)).toContain('rps_part');
    expect(report.byPageType.map((bucket) => bucket.key).sort()).toEqual([
      'diagram',
      'parts_list',
      'specification',
    ]);
    expect(report.byConfidenceBand).toHaveLength(2);
  });

  it('assigns confidence bands at the governed thresholds', () => {
    expect(confidenceBand(0.9)).toBe('high (>=0.85)');
    expect(confidenceBand(0.7)).toBe('medium (0.6-0.85)');
    expect(confidenceBand(0.4)).toBe('low (<0.6)');
  });
});
