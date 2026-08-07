import { describe, expect, it } from 'vitest';
import { buildSemanticQueryFrame } from '../../../../supabase/functions/_shared/barry-semantic';
import { groundTechnicalAnswer } from '../../../../supabase/functions/_shared/barry-claim-verifier';
import { BARRY_GROUNDING_PHASE4_CASES } from '../../../../tests/benchmarks/barry-grounding-phase4-cases';

describe('Barry Phase 4 grounding benchmark cases', () => {
  it.each(BARRY_GROUNDING_PHASE4_CASES)('$id never emits a forbidden claim', async (testCase) => {
    const result = await groundTechnicalAnswer({
      requestId: testCase.id,
      query: testCase.query,
      draft: testCase.draft,
      frame: buildSemanticQueryFrame(testCase.query, { queryId: testCase.id }),
      candidates: testCase.candidates.map((candidate) => ({ ...candidate })),
      callModel: async () => [],
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    for (const forbidden of testCase.forbiddenPatterns) {
      expect(result.answer).not.toMatch(forbidden);
    }
    for (const required of testCase.requiredPatterns) {
      expect(result.answer).toMatch(required);
    }
    if (testCase.expectAbstained) {
      expect(result.ledger.abstained).toBe(true);
      expect(result.citedUnits).toHaveLength(0);
    }
  });
});
