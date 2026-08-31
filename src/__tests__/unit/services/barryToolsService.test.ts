import { describe, expect, it } from 'vitest';
import { buildBarryToolsPayload, normaliseBarryToolsResponse } from '@/services/openclaw/barryToolsService';

describe('normaliseBarryToolsResponse', () => {
  it('preserves grounding diagnostics', () => {
    const result = normaliseBarryToolsResponse({
      content: 'Verified answer',
      grounding_mode: 'mandatory_claim_ledger',
      grounding_required: true,
      grounding_reason: 'semantic_intent',
      pipeline_version: '1.0.0-phase4',
      semantic_version: '1.0.0-phase1',
    });

    expect(result).toMatchObject({
      grounding_mode: 'mandatory_claim_ledger',
      grounding_required: true,
      grounding_reason: 'semantic_intent',
      pipeline_version: '1.0.0-phase4',
      semantic_version: '1.0.0-phase1',
    });
  });

  it('maps barry-tools response shape into BarryOpenClawResponse contract', () => {
    const result = normaliseBarryToolsResponse({
      content: 'Test answer',
      manualReferences: [
        {
          page_number: 934,
          pdf_page: 934,
          storage_url: 'https://example.com/workshop-manual.pdf#page=934',
          title: 'Steering Box',
        },
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
        title: 'Steering Box',
        page_number: 934,
        original_page: 934,
        pdf_page: 934,
        storage_url: 'https://example.com/workshop-manual.pdf#page=934',
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

describe('buildBarryToolsPayload', () => {
  it('keeps profile and page context separate from the literal user question', () => {
    const payload = buildBarryToolsPayload({
      messages: [{ role: 'user', content: 'what is the u1700 tray lenth?' }],
      context: {
        vehicle: { model: 'U1700L', modifications: 'Extra 200 L fuel tank and rear winch' },
        page: { name: 'manuals' },
      },
    });

    expect(payload.messages[0].content).toBe('what is the u1700 tray lenth?');
    expect(payload.messages[0].content).not.toContain('fuel tank');
    expect(payload.context?.vehicle?.modifications).toContain('fuel tank');
  });
});
