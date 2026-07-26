import { describe, expect, it } from 'vitest';
import { normaliseBarryToolsResponse } from '@/services/openclaw/barryToolsService';

describe('normaliseBarryToolsResponse', () => {
  it('maps barry-tools response shape into BarryOpenClawResponse contract', () => {
    const result = normaliseBarryToolsResponse({
      content: 'Test answer',
      manualReferences: [
        { page_number: 42, storage_url: 'https://example.com/manual.pdf#page=42', title: 'Axle Service' },
      ],
      knowledgeMode: 'search_manual',
      searchResultCount: 1,
      skill_chain: ['search_manual'],
      execution_time_ms: 1234,
    });

    expect(result.content).toBe('Test answer');
    expect(result.knowledgeMode).toBe('search_manual');
    expect(result.searchResultCount).toBe(1);
    expect(result.skill_chain).toEqual(['search_manual']);
    expect(result.execution_time_ms).toBe(1234);
    expect(result.manualReferences).toEqual([
      {
        type: 'manual',
        title: 'Axle Service',
        page_number: 42,
        original_page: 42,
        pdf_page: 42,
        storage_url: 'https://example.com/manual.pdf#page=42',
        manual_type: 'manual',
      },
    ]);
  });

  it('deduplicates manual references and applies safe defaults', () => {
    const result = normaliseBarryToolsResponse({
      manualReferences: [
        { page_number: 10, storage_url: 'https://example.com/manual.pdf#page=10' },
        { page_number: 10, storage_url: 'https://example.com/manual.pdf#page=10' },
      ],
    });

    expect(result.content).toBe('');
    expect(result.knowledgeMode).toBe('tool_use');
    expect(result.searchResultCount).toBe(0);
    expect(result.skill_chain).toEqual([]);
    expect(result.manualReferences).toHaveLength(1);
    expect(result.manualReferences[0].title).toBe('U435 Workshop Manual');
  });

  it('drops references that cannot open a supporting document', () => {
    const result = normaliseBarryToolsResponse({
      manualReferences: [
        { page_number: 0, storage_url: 'https://example.com/manual.pdf' },
        { page_number: 12 },
        { page_number: 13, storage_url: '   ' },
        { page_number: 14, storage_url: 'https://example.com/manual.pdf#page=14' },
      ],
    });

    expect(result.manualReferences).toEqual([
      expect.objectContaining({
        page_number: 14,
        storage_url: 'https://example.com/manual.pdf#page=14',
      }),
    ]);
  });
});
