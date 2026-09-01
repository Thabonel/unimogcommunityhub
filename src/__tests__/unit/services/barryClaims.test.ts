import { describe, expect, it } from 'vitest';
import {
  BARRY_CLAIM_PIPELINE_VERSION,
  extractTechnicalClaims,
  summarizeLedger,
  type GroundingLedger,
} from '../../../../supabase/functions/_shared/barry-claims';

describe('extractTechnicalClaims', () => {
  it('classifies a torque value with unit as a torque claim', () => {
    const claims = extractTechnicalClaims('Tighten the clamping bolt to 64 Nm.');
    expect(claims).toHaveLength(1);
    expect(claims[0].claimClass).toBe('torque');
    expect(claims[0].safetyCritical).toBe(true);
    expect(claims[0].numericValues).toEqual([
      expect.objectContaining({ value: 64, unit: 'newton_metre' }),
    ]);
  });

  it('classifies a litre value as a capacity claim', () => {
    const claims = extractTechnicalClaims('The steering system holds 2.25 L of oil.');
    expect(claims).toHaveLength(1);
    expect(claims[0].claimClass).toBe('capacity');
  });

  it('preserves ranges instead of collapsing them to a single value', () => {
    const claims = extractTechnicalClaims('Check dimension a is 6-8 mm.');
    expect(claims[0].claimClass).toBe('specification');
    expect(claims[0].numericValues[0].range).toEqual({ min: 6, max: 8 });
  });

  it('classifies numbered steps as procedure claims', () => {
    const claims = extractTechnicalClaims('1. Remove the pitman arm from the sector shaft.');
    expect(claims).toHaveLength(1);
    expect(claims[0].claimClass).toBe('procedure_step');
  });

  it('classifies fluid mentions as fluid claims', () => {
    const claims = extractTechnicalClaims('Fill the reservoir with ATF.');
    expect(claims[0].claimClass).toBe('fluid');
  });

  it('classifies warning language as safety claims', () => {
    const claims = extractTechnicalClaims('Warning: never open the system while it is pressurised.');
    expect(claims[0].claimClass).toBe('safety_warning');
  });

  it('classifies Mercedes-style part numbers as part-number claims', () => {
    const claims = extractTechnicalClaims('Order seal kit 000 586 12 34 before starting.');
    expect(claims[0].claimClass).toBe('part_number');
    expect(claims[0].partNumbers).toContain('000 586 12 34');
  });

  it('links claims to semantic concepts', () => {
    const claims = extractTechnicalClaims('1. Remove the steering gear sealing ring.');
    expect(claims[0].subjectConceptKeys).toContain('component.steering_gear');
  });

  it('grounds general descriptions that identify a known technical concept', () => {
    const claims = extractTechnicalClaims('The steering box sits between the column and the linkage.');
    expect(claims).toHaveLength(1);
    expect(claims[0].claimClass).toBe('general_description');
    expect(claims[0].subjectConceptKeys).toContain('component.steering_gear');
  });

  it('skips headings and bold-only label lines', () => {
    const draft = '## Procedure\n**Tools required**\n1. Drain the hydraulic oil from the reservoir.';
    const claims = extractTechnicalClaims(draft);
    expect(claims).toHaveLength(1);
    expect(claims[0].lineIndex).toBe(0);
  });
});

describe('summarizeLedger', () => {
  it('produces a redacted count-only summary', () => {
    const ledger: GroundingLedger = {
      requestId: 'r1',
      pipelineVersion: BARRY_CLAIM_PIPELINE_VERSION,
      semanticVersion: '1.0.0-phase1',
      claims: [
        {
          claimId: 'claim-0',
          text: 'Tighten to 64 Nm.',
          claimClass: 'torque',
          subjectConceptKeys: [],
          safetyCritical: true,
          numericValues: [{ value: 64, unit: 'newton_metre' }],
          partNumbers: [],
          modelMentions: [],
          lineIndex: 0,
        },
      ],
      decisions: [
        { claimId: 'claim-0', status: 'supported', evidenceKeys: ['e1'], confidence: 0.95, reasonCode: 'numeric_match' },
      ],
      citedEvidenceKeys: ['e1'],
      abstained: false,
      verifierStatus: 'ok',
      verifierLatencyMs: 12,
    };
    const summary = summarizeLedger(ledger);
    expect(JSON.stringify(summary)).not.toContain('Tighten');
    expect(summary).toMatchObject({
      claim_count: 1,
      cited_evidence_count: 1,
      abstained: false,
      verifier_status: 'ok',
    });
  });
});
