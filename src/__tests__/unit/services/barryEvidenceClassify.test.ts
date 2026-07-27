import { describe, expect, it } from 'vitest';
import {
  classifyDocumentRole,
  classifyEvidencePage,
} from '../../../../scripts/barry-backfill/barry-evidence-classify';
import type {
  EvidenceSourceRow,
  SourceDocumentRecord,
} from '../../../../scripts/barry-backfill/barry-evidence-types';

function documentRecord(overrides: Partial<SourceDocumentRecord> = {}): SourceDocumentRecord {
  return {
    documentKey: 'doc:1',
    title: 'Document',
    sourceType: 'barry_v2_manual',
    modelTags: [],
    ...overrides,
  };
}

function sourceRow(overrides: Partial<EvidenceSourceRow> = {}): EvidenceSourceRow {
  return {
    sourceType: 'manual_chunk',
    sourceRecordId: 'row-1',
    documentKey: 'doc:1',
    systemTags: [],
    modelTags: [],
    ...overrides,
  };
}

describe('classifyDocumentRole', () => {
  it('classifies verified u435 maintenance filenames as maintenance manuals', () => {
    const result = classifyDocumentRole(documentRecord({
      title: 'u435-maint-46-steering',
      filename: 'u435-maint-46-steering.pdf',
      manualType: 'workshop',
    }));
    expect(result.documentRole).toBe('maintenance_manual');
    expect(result.confidence).toBeGreaterThanOrEqual(0.85);
  });

  it('classifies RPS catalogue identities as parts catalogues', () => {
    expect(classifyDocumentRole(documentRecord({
      title: 'RPS 02155',
      sourceType: 'rps_catalog',
    })).documentRole).toBe('parts_catalog');
    expect(classifyDocumentRole(documentRecord({
      title: 'rps-02202-unimog-gs-with-twist-locks',
      filename: 'rps-02202.pdf',
    })).documentRole).toBe('parts_catalog');
    expect(classifyDocumentRole(documentRecord({
      title: 'RPS Catalog',
      sourceType: 'manual_chunks_document',
    })).documentRole).toBe('parts_catalog');
  });

  it('classifies verified workshop manuals', () => {
    expect(classifyDocumentRole(documentRecord({
      title: 'u1700lunimog435sm',
      manualType: 'workshop',
    })).documentRole).toBe('workshop_manual');
    expect(classifyDocumentRole(documentRecord({
      title: 'U1700L U435 Workshop Manual Volume 1',
      sourceType: 'manual_chunks_document',
    })).documentRole).toBe('workshop_manual');
  });

  it('leaves unverified identities unknown', () => {
    const result = classifyDocumentRole(documentRecord({
      title: 'UHB Unimog Cargo',
      sourceType: 'manual_chunks_document',
    }));
    expect(result.documentRole).toBe('unknown');
    expect(result.confidence).toBeLessThan(0.6);
  });
});

describe('classifyEvidencePage', () => {
  it('classifies structured RPS parts as parts lists, never procedures', () => {
    const result = classifyEvidencePage(sourceRow({
      sourceType: 'rps_part',
      title: 'SEAL RING (ALSO PART OF PB 002)',
    }), 'parts_catalog');
    expect(result.pageType).toBe('parts_list');
  });

  it('classifies structured RPS illustrations as diagrams', () => {
    const result = classifyEvidencePage(sourceRow({
      sourceType: 'rps_illustration',
      title: 'RPS Manual Page 620 - Exploded View Diagram',
    }), 'parts_catalog');
    expect(result.pageType).toBe('diagram');
  });

  it('classifies exploded views as diagrams even inside workshop manuals', () => {
    const result = classifyEvidencePage(sourceRow({
      title: 'Page 934',
      contentText: 'Exploded v1ew Steering box 4 Steering 96 7 Housing 99 9 Needle bearmg 103 12 Ret11mer 108 14 Seal ing ri ng 130',
    }), 'workshop_manual');
    expect(result.pageType).toBe('diagram');
  });

  it('classifies technical data pages as specifications', () => {
    const result = classifyEvidencePage(sourceRow({
      title: 'Page 928',
      contentText: 'Technical data Steering box Ratio in steering box Worm pitch, lefthand Piston diameter',
    }), 'workshop_manual');
    expect(result.pageType).toBe('specification');
  });

  it('classifies checking procedures in workshop manuals as procedures', () => {
    const result = classifyEvidencePage(sourceRow({
      title: 'Page 946',
      contentText: 'Checking tightness of universal joint at steering box 46.11 Checking tightness Turn front wheels to straight ahead position.',
    }), 'workshop_manual');
    expect(result.pageType).toBe('procedure');
  });

  it('refuses to classify procedure-like headings in parts catalogues as procedures', () => {
    const result = classifyEvidencePage(sourceRow({
      contentText: 'Checking tightness of universal joint',
    }), 'parts_catalog');
    expect(result.pageType).toBe('unknown');
    expect(result.confidence).toBeLessThan(0.6);
  });

  it('classifies visual parts-catalogue pages without text as diagrams', () => {
    const result = classifyEvidencePage(sourceRow({
      hasVisualElements: true,
      contentText: '',
    }), 'parts_catalog');
    expect(result.pageType).toBe('diagram');
  });

  it('marks empty unclassifiable pages unknown', () => {
    const result = classifyEvidencePage(sourceRow({ contentText: '' }), 'workshop_manual');
    expect(result.pageType).toBe('unknown');
  });
});
