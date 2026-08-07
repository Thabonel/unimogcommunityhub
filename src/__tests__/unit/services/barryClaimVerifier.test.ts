import { describe, expect, it } from 'vitest';
import { buildSemanticQueryFrame } from '../../../../supabase/functions/_shared/barry-semantic';
import type { ShadowEvidenceCandidate } from '../../../../supabase/functions/_shared/barry-retrieval-planner';
import {
  buildEvidenceUnits,
  groundTechnicalAnswer,
  type ModelVerdict,
} from '../../../../supabase/functions/_shared/barry-claim-verifier';

function candidate(overrides: Partial<ShadowEvidenceCandidate> = {}): ShadowEvidenceCandidate {
  return {
    candidateId: 'c1',
    source: 'manual_search',
    ...overrides,
  };
}

const SPEC_PAGE = candidate({
  candidateId: 'spec-928',
  manualTitle: 'U1700L U435 Workshop Manual',
  title: 'Steering technical data',
  pageNumber: 928,
  storageUrl: 'https://example.invalid/manual.pdf#page=928',
  contentPreview: 'Technical data. Steering box ratio 19.33:1. Capacity 2.25 L. Clamping bolt tightening torque 64 Nm.',
});

const DIAGRAM_PAGE = candidate({
  candidateId: 'diagram-934',
  manualTitle: 'U1700L U435 Workshop Manual',
  title: 'Exploded view steering box',
  pageNumber: 934,
  storageUrl: 'https://example.invalid/manual.pdf#page=934',
  contentPreview: 'Exploded view steering box. 14 Sealing ring. 145 Gearing shaft. 220 Repair set.',
});

const RPS_PAGE = candidate({
  candidateId: 'rps-pa',
  manualTitle: 'RPS Catalog U1700L U435 PA',
  title: 'Sealing ring',
  pageNumber: 12,
  storageUrl: 'https://example.invalid/rps.pdf#page=12',
  contentPreview: 'Sealing ring 000 586 12 34, quantity 2.',
});

const PROCEDURE_PAGE = candidate({
  candidateId: 'proc-946',
  manualTitle: 'U1700L U435 Workshop Manual',
  title: 'Removal and installation of pitman arm',
  pageNumber: 946,
  storageUrl: 'https://example.invalid/manual.pdf#page=946',
  contentPreview: 'Removal and installation. Remove the pitman arm from the sector shaft using a puller.',
});

function frameFor(query: string) {
  return buildSemanticQueryFrame(query, { queryId: 'test-request' });
}

describe('buildEvidenceUnits', () => {
  it('classifies document roles and page types for evidence', () => {
    const units = buildEvidenceUnits(frameFor('steering torque specs'), [SPEC_PAGE, DIAGRAM_PAGE, RPS_PAGE]);
    const byId = new Map(units.map((unit) => [unit.evidenceKey, unit]));
    expect(byId.get('spec-928')?.documentRole).toBe('workshop_manual');
    expect(byId.get('diagram-934')?.pageType).toBe('diagram');
    expect(byId.get('rps-pa')?.documentRole).toBe('parts_catalog');
  });
});

describe('groundTechnicalAnswer deterministic checks', () => {
  it('supports a torque claim when the value appears in eligible evidence', async () => {
    const result = await groundTechnicalAnswer({
      requestId: 'r1',
      query: 'what is the clamping bolt torque',
      draft: 'Tighten the clamping bolt to 64 Nm.',
      frame: frameFor('what is the clamping bolt torque'),
      candidates: [SPEC_PAGE],
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.answer).toContain('64 Nm');
    expect(result.ledger.decisions[0]).toMatchObject({ status: 'supported', reasonCode: 'numeric_match' });
    expect(result.citedUnits.map((unit) => unit.evidenceKey)).toEqual(['spec-928']);
  });

  it('removes a torque claim whose value is absent from all evidence', async () => {
    const result = await groundTechnicalAnswer({
      requestId: 'r2',
      query: 'what is the clamping bolt torque',
      draft: 'Tighten the clamping bolt to 90 Nm.',
      frame: frameFor('what is the clamping bolt torque'),
      candidates: [SPEC_PAGE],
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.answer).not.toContain('90 Nm');
    expect(result.ledger.decisions[0].status).toBe('conflicted');
    expect(result.ledger.abstained).toBe(true);
    expect(result.citedUnits).toHaveLength(0);
  });

  it('marks a value as unsupported when no evidence is eligible', async () => {
    const result = await groundTechnicalAnswer({
      requestId: 'r3',
      query: 'what oil goes in the steering',
      draft: 'The steering system takes 4.5 L of oil.',
      frame: frameFor('what oil goes in the steering'),
      candidates: [DIAGRAM_PAGE],
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.answer).not.toContain('4.5 L');
    expect(result.ledger.decisions[0]).toMatchObject({ status: 'unsupported', reasonCode: 'no_eligible_evidence' });
  });

  it('supports a part-number claim only from parts evidence', async () => {
    const result = await groundTechnicalAnswer({
      requestId: 'r4',
      query: 'which seal kit do I need',
      draft: 'Order seal kit 000 586 12 34.',
      frame: frameFor('which seal kit do I need'),
      candidates: [RPS_PAGE],
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.answer).toContain('000 586 12 34');
    expect(result.ledger.decisions[0].reasonCode).toBe('part_number_match');
  });

  it('rejects a part number that is not in the evidence', async () => {
    const result = await groundTechnicalAnswer({
      requestId: 'r5',
      query: 'which seal kit do I need',
      draft: 'Order seal kit 000 999 88 77.',
      frame: frameFor('which seal kit do I need'),
      candidates: [RPS_PAGE],
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.answer).not.toContain('000 999 88 77');
    expect(result.ledger.decisions[0].reasonCode).toBe('part_number_not_in_evidence');
  });
});

describe('groundTechnicalAnswer model stage', () => {
  const draft = '1. Remove the pitman arm from the sector shaft.';

  it('keeps a procedure claim the model supports and cites its evidence', async () => {
    const verdicts: ModelVerdict[] = [
      { claimId: 'claim-0', status: 'supported', evidenceKeys: ['proc-946'] },
    ];
    const result = await groundTechnicalAnswer({
      requestId: 'r6',
      query: 'how do I remove the pitman arm',
      draft,
      frame: frameFor('how do I remove the pitman arm'),
      candidates: [PROCEDURE_PAGE],
      callModel: async () => verdicts,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.answer).toContain('Remove the pitman arm');
    expect(result.citedUnits.map((unit) => unit.evidenceKey)).toEqual(['proc-946']);
  });

  it('drops a claim when the model returns supported without evidence keys', async () => {
    const result = await groundTechnicalAnswer({
      requestId: 'r7',
      query: 'how do I remove the pitman arm',
      draft,
      frame: frameFor('how do I remove the pitman arm'),
      candidates: [PROCEDURE_PAGE],
      callModel: async () => [{ claimId: 'claim-0', status: 'supported' }],
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.answer).not.toContain('Remove the pitman arm');
    expect(result.ledger.decisions[0]).toMatchObject({ status: 'unsupported', reasonCode: 'verdict_without_evidence' });
  });

  it('rejects narrowed text that introduces values absent from evidence', async () => {
    const result = await groundTechnicalAnswer({
      requestId: 'r8',
      query: 'how do I remove the pitman arm',
      draft,
      frame: frameFor('how do I remove the pitman arm'),
      candidates: [PROCEDURE_PAGE],
      callModel: async () => [{
        claimId: 'claim-0',
        status: 'narrowed',
        evidenceKeys: ['proc-946'],
        finalText: '1. Remove the pitman arm and tighten to 120 Nm.',
      }],
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.ledger.decisions[0]).toMatchObject({ status: 'unsupported', reasonCode: 'unsafe_narrowing' });
    expect(result.answer).not.toContain('120 Nm');
  });

  it('fails closed when the verifier model throws', async () => {
    const result = await groundTechnicalAnswer({
      requestId: 'r9',
      query: 'how do I remove the pitman arm',
      draft,
      frame: frameFor('how do I remove the pitman arm'),
      candidates: [PROCEDURE_PAGE],
      callModel: async () => {
        throw new Error('upstream timeout');
      },
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.reasonCode).toBe('verifier_model_error');
    expect(result.ledger?.verifierStatus).toBe('model_error');
  });

  it('fails closed when no model is available for claims that need one', async () => {
    const result = await groundTechnicalAnswer({
      requestId: 'r10',
      query: 'how do I remove the pitman arm',
      draft,
      frame: frameFor('how do I remove the pitman arm'),
      candidates: [PROCEDURE_PAGE],
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.reasonCode).toBe('verifier_unavailable');
  });

  it('never lets a diagram authorize a procedure claim', async () => {
    let modelSawEvidence = false;
    const result = await groundTechnicalAnswer({
      requestId: 'r11',
      query: 'how do I rebuild the steering box',
      draft,
      frame: frameFor('how do I rebuild the steering box'),
      candidates: [DIAGRAM_PAGE],
      callModel: async (payload) => {
        modelSawEvidence = payload.claims.length > 0;
        return [];
      },
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(modelSawEvidence).toBe(false);
    expect(result.answer).not.toContain('Remove the pitman arm');
    expect(result.ledger.decisions[0].reasonCode).toBe('no_eligible_evidence');
  });
});

describe('groundTechnicalAnswer reconstruction', () => {
  it('passes through a draft with no technical claims unchanged', async () => {
    const draft = 'The steering box sits between the column and the linkage.';
    const result = await groundTechnicalAnswer({
      requestId: 'r12',
      query: 'where is the steering box',
      draft,
      frame: frameFor('where is the steering box'),
      candidates: [],
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.answer).toBe(draft);
    expect(result.ledger.claims).toHaveLength(0);
  });

  it('appends an evidence-gap note naming the missing claim class', async () => {
    const result = await groundTechnicalAnswer({
      requestId: 'r13',
      query: 'what oil and how much for the steering',
      draft: 'Use ATF in the steering system.',
      frame: frameFor('what oil and how much for the steering'),
      candidates: [DIAGRAM_PAGE],
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.answer).not.toContain('Use ATF');
    expect(result.answer).toContain('no verified fluid specification');
  });
});
