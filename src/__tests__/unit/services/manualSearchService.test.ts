import { describe, expect, it } from 'vitest';
import type { StorageManual } from '@/types/manuals';
import {
  buildManualSearchResults,
  normalizeManualSearchQuery,
  resolveManualFileName,
} from '@/services/manuals/manualSearchService';
import { clampPdfPage } from '@/components/knowledge/pdf-viewer/pdfPage';

const manuals: StorageManual[] = [{
  name: 'U435_Workshop_Manual.pdf',
  size: 1024,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
  metadata: {
    title: 'U435 Workshop Manual',
    description: 'Workshop procedures and specifications',
  },
}];

describe('manual library search helpers', () => {
  it('normalizes user input into safe search terms', () => {
    expect(normalizeManualSearchQuery('  steering, torque) or(id.eq.secret  '))
      .toBe('steering torque or id eq secret');
  });

  it('resolves an OCR chunk to an accessible PDF using its metadata filename', () => {
    expect(resolveManualFileName({
      manual_title: 'Different indexed title',
      pdf_storage_path: null,
      metadata: { filename: 'U435_Workshop_Manual.pdf' },
    }, manuals)).toBe('U435_Workshop_Manual.pdf');
  });

  it('maps OCR content to a page result with a focused snippet', () => {
    const results = buildManualSearchResults([{
      id: 'chunk-1',
      manual_title: 'U435 Workshop Manual',
      section_title: 'Steering box',
      content: 'Remove the steering housing. Tighten the clamping bolt to 64 Nm before refitting the cover.',
      page_number: 946,
      pdf_storage_path: 'U435_Workshop_Manual.pdf',
      metadata: { filename: 'U435_Workshop_Manual.pdf' },
      extraction_quality: 0.95,
    }], manuals, 'clamping bolt');

    expect(results[0]).toMatchObject({
      chunkId: 'chunk-1',
      fileName: 'U435_Workshop_Manual.pdf',
      pageNumber: 946,
      source: 'ocr',
    });
    expect(results[0].snippet).toContain('clamping bolt');
  });

  it('does not expose indexed chunks without an accessible PDF', () => {
    const results = buildManualSearchResults([{
      id: 'chunk-private',
      manual_title: 'Private Manual',
      section_title: null,
      content: 'steering procedure',
      page_number: 10,
      pdf_storage_path: 'Private.pdf',
      metadata: { filename: 'Private.pdf' },
      extraction_quality: 1,
    }], manuals, 'steering');

    expect(results).toEqual([]);
  });

  it('returns a page-one result when the stored manual title matches', () => {
    const results = buildManualSearchResults([], manuals, 'workshop specifications');

    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({
      fileName: 'U435_Workshop_Manual.pdf',
      pageNumber: 1,
      source: 'title',
    });
  });
});

describe('PDF page navigation', () => {
  it('clamps linked page numbers to the loaded PDF bounds', () => {
    expect(clampPdfPage(946, 1185)).toBe(946);
    expect(clampPdfPage(1500, 1185)).toBe(1185);
    expect(clampPdfPage(0, 1185)).toBe(1);
  });
});
