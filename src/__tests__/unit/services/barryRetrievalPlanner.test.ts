import { describe, expect, it } from 'vitest';
import {
  buildSemanticQueryFrame,
} from '../../../../supabase/functions/_shared/barry-semantic';
import {
  expandSemanticRelationships,
  inferDocumentRole,
  inferPageType,
  planSemanticRetrieval,
  SHADOW_RETRIEVAL_WEIGHTS_VERSION,
  type ShadowEvidenceCandidate,
} from '../../../../supabase/functions/_shared/barry-retrieval-planner';

function candidate(overrides: Partial<ShadowEvidenceCandidate> = {}): ShadowEvidenceCandidate {
  return {
    candidateId: 'c1',
    source: 'manual_search',
    ...overrides,
  };
}

describe('relationship expansion', () => {
  it('expands exactly one hop through approved relationships', () => {
    const frame = buildSemanticQueryFrame('my steeringbox is leaking, what do I do');
    const expansions = expandSemanticRelationships(frame);

    expect(expansions.every((expansion) => expansion.distance === 1)).toBe(true);
    const targets = expansions.map((expansion) => expansion.targetConceptKey);
    expect(targets).toContain('component.sector_shaft');
    expect(targets).toContain('part.sealing_ring');
    expect(targets).toContain('property.fluid_capacity');

    const sources = new Set(expansions.map((expansion) => expansion.sourceConceptKey));
    for (const source of sources) {
      expect([
        ...frame.systemConceptKeys,
        ...frame.componentConceptKeys,
        ...frame.symptomConceptKeys,
      ]).toContain(source);
    }
  });

  it('does not expand from expanded concepts (no second hop)', () => {
    const frame = buildSemanticQueryFrame('steering box leak');
    const expansions = expandSemanticRelationships(frame);
    const seeds = new Set([
      ...frame.systemConceptKeys,
      ...frame.componentConceptKeys,
      ...frame.symptomConceptKeys,
    ]);
    const nonSeedSources = expansions.filter((expansion) => !seeds.has(expansion.sourceConceptKey));
    expect(nonSeedSources).toHaveLength(0);
  });
});

describe('runtime role and page inference', () => {
  it('classifies verified identities deterministically', () => {
    expect(inferDocumentRole(candidate({ manualTitle: 'RPS Catalog' }))).toBe('parts_catalog');
    expect(inferDocumentRole(candidate({ manualTitle: 'U1700L U435 Workshop Manual Volume 1' }))).toBe('workshop_manual');
    expect(inferDocumentRole(candidate({ manualTitle: 'u435-maint-46-steering' }))).toBe('maintenance_manual');
    expect(inferDocumentRole(candidate({ source: 'validated_knowledge_base' }))).toBe('validated_knowledge');
    expect(inferDocumentRole(candidate({ manualTitle: 'UHB Unimog Cargo' }))).toBe('unknown');
  });

  it('classifies exploded views as diagrams even in workshop manuals', () => {
    expect(inferPageType(candidate({
      contentPreview: 'Exploded v1ew Steering box 4 Steering 96 7 Housing',
      manualTitle: 'U1700L U435 Workshop Manual Volume 1',
    }), 'workshop_manual')).toBe('diagram');
    expect(inferPageType(candidate({
      contentPreview: 'Technical data Steering box Ratio in steering box',
    }), 'workshop_manual')).toBe('specification');
    expect(inferPageType(candidate({
      contentPreview: 'Checking tightness of universal joint at steering box',
    }), 'workshop_manual')).toBe('procedure');
  });
});

describe('shadow retrieval planning', () => {
  it('excludes incompatible applicability', () => {
    const frame = buildSemanticQueryFrame('steering box leak', {
      vehicleModelConceptKey: 'vehicle_model.u435',
    });
    const plan = planSemanticRetrieval(frame, [
      candidate({ candidateId: 'incompat', manualTitle: 'U1700L only handbook', contentPreview: 'steering box' }),
    ]);
    expect(plan.excluded).toEqual([{ candidateId: 'incompat', reasonCode: 'incompatible_applicability' }]);
    expect(plan.ranked).toHaveLength(0);
  });

  it('scores component identity above ambiguous pump mentions without silent selection', () => {
    const frame = buildSemanticQueryFrame('the pump is leaking');
    expect(frame.ambiguities.length).toBeGreaterThan(0);
    const ambiguousKeys = new Set(frame.ambiguities.flatMap((a) => a.candidateConceptKeys));

    const plan = planSemanticRetrieval(frame, [
      candidate({
        candidateId: 'steering-pump-page',
        manualTitle: 'U1700L U435 Workshop Manual Volume 1',
        contentPreview: 'Checking the power steering pump drive belt',
      }),
      candidate({
        candidateId: 'water-pump-page',
        manualTitle: 'U1700L U435 Workshop Manual Volume 1',
        contentPreview: 'Removing the water pump from the coolant circuit',
      }),
    ]);

    expect(plan.ranked).toHaveLength(2);
    for (const entry of plan.ranked) {
      const matchedAmbiguous = entry.matchedConceptKeys.filter((key) => ambiguousKeys.has(key));
      if (matchedAmbiguous.length) {
        expect(entry.components.ambiguityPenalty).toBeGreaterThan(0);
      }
    }
    const scores = plan.ranked.map((entry) => entry.score);
    expect(new Set(scores).size).toBeGreaterThanOrEqual(1);
  });

  it('rewards direct concept matches over relationship expansion', () => {
    const frame = buildSemanticQueryFrame('my steeringbox is leaking, what do I do');
    const plan = planSemanticRetrieval(frame, [
      candidate({
        candidateId: 'direct',
        contentPreview: 'Checking tightness of universal joint at steering box 46.11',
        manualTitle: 'U1700L U435 Workshop Manual Volume 1',
      }),
      candidate({
        candidateId: 'expansion-only',
        contentPreview: 'Sealing ring 14 Sealing ring 22 Cover Retainer',
        manualTitle: 'U1700L U435 Workshop Manual Volume 1',
      }),
    ]);

    const direct = plan.ranked.find((entry) => entry.candidateId === 'direct');
    const expansion = plan.ranked.find((entry) => entry.candidateId === 'expansion-only');
    expect(direct).toBeDefined();
    expect(direct!.components.conceptIdentity).toBeGreaterThan(0);
    expect(direct!.score).toBeGreaterThan(expansion?.score ?? 0);
  });

  it('penalizes candidates whose role and page type permit no requested claim class', () => {
    const frame = buildSemanticQueryFrame('my steeringbox is leaking, what do I do');
    const plan = planSemanticRetrieval(frame, [
      candidate({
        candidateId: 'diagram',
        contentPreview: 'Exploded view Steering box Housing Needle bearing Sealing ring',
        manualTitle: 'U1700L U435 Workshop Manual Volume 1',
      }),
      candidate({
        candidateId: 'procedure',
        contentPreview: 'Checking tightness of universal joint at steering box 46.11',
        manualTitle: 'U1700L U435 Workshop Manual Volume 1',
      }),
    ]);
    const diagram = plan.ranked.find((entry) => entry.candidateId === 'diagram')!;
    const procedure = plan.ranked.find((entry) => entry.candidateId === 'procedure')!;
    expect(diagram.pageType).toBe('diagram');
    expect(diagram.permittedClaimClasses).toEqual([]);
    expect(diagram.components.roleFitness).toBeLessThan(0);
    expect(procedure.permittedClaimClasses.length).toBeGreaterThan(0);
    expect(procedure.components.roleFitness).toBeGreaterThan(0);
  });

  it('is deterministic and auditable', () => {
    const frame = buildSemanticQueryFrame('my steeringbox is leaking, what do I do');
    const candidates = [
      candidate({ candidateId: 'a', contentPreview: 'Technical data Steering box', manualTitle: 'U1700L U435 Workshop Manual Volume 1' }),
      candidate({ candidateId: 'b', contentPreview: 'Exploded view Steering box', manualTitle: 'RPS Catalog' }),
    ];
    const first = planSemanticRetrieval(frame, candidates);
    const second = planSemanticRetrieval(frame, candidates);
    expect(first).toEqual(second);
    expect(first.weightsVersion).toBe(SHADOW_RETRIEVAL_WEIGHTS_VERSION);
    expect(first.ranked.every((entry) => entry.components && typeof entry.score === 'number')).toBe(true);
  });
});
