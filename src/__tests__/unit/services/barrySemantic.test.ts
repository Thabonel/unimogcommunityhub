import { describe, expect, it } from 'vitest';
import {
  BARRY_SEMANTIC_VERSION,
  PHASE1_SEMANTIC_REGISTRY,
  PHASE1_SEMANTIC_VERSION,
  buildSemanticQueryFrame,
  createSemanticGroundingTelemetry,
  normalizeSemanticText,
} from '../../../../supabase/functions/_shared/barry-semantic';
import { BARRY_SEMANTIC_PHASE1_CASES } from '../../../../tests/benchmarks/barry-semantic-phase1-cases';

function frameConceptKeys(frame: ReturnType<typeof buildSemanticQueryFrame>): string[] {
  return [
    ...(frame.vehicleModelConceptKey ? [frame.vehicleModelConceptKey] : []),
    ...frame.vehicleVariantConceptKeys,
    ...frame.systemConceptKeys,
    ...frame.componentConceptKeys,
    ...frame.symptomConceptKeys,
    ...frame.operationConceptKeys,
    ...frame.propertyConceptKeys,
    ...frame.fluidConceptKeys,
    ...frame.partConceptKeys,
    ...frame.toolConceptKeys,
    ...frame.hazardConceptKeys,
  ];
}

describe('Barry semantic query frame', () => {
  it.each(BARRY_SEMANTIC_PHASE1_CASES)('$id resolves the expected meaning', (testCase) => {
    const frame = buildSemanticQueryFrame(testCase.query, {
      queryId: testCase.id,
      vehicleModelConceptKey: testCase.vehicleModelConceptKey,
    });
    const resolved = frameConceptKeys(frame);

    expect(frame.semanticVersion).toBe(BARRY_SEMANTIC_VERSION);
    expect(resolved).toEqual(expect.arrayContaining(testCase.expectedConceptKeys));
    expect(frame.requestedClaimClasses).toEqual(expect.arrayContaining(testCase.expectedClaimClasses));

    for (const term of testCase.expectedAmbiguityTerms ?? []) {
      expect(frame.ambiguities.some((ambiguity) => ambiguity.term === term)).toBe(true);
    }
    for (const forbidden of testCase.forbiddenConceptKeys ?? []) {
      expect(resolved).not.toContain(forbidden);
    }
  });

  it('normalizes punctuation, spacing, and apostrophes deterministically', () => {
    expect(normalizeSemanticText("  Steering-box won't START  ")).toBe('steering box wont start');
  });

  it('creates telemetry without storing the raw question', () => {
    const frame = buildSemanticQueryFrame('my steeringbox is leaking', {
      queryId: 'request-123',
      vehicleModelConceptKey: 'vehicle_model.u1700l',
    });
    const telemetry = createSemanticGroundingTelemetry(frame);

    expect(telemetry).toMatchObject({
      request_id: 'request-123',
      semantic_version: BARRY_SEMANTIC_VERSION,
      unresolved_term_count: 0,
      ambiguous_concept_count: 0,
    });
    expect(JSON.stringify(telemetry)).not.toContain('steeringbox');
  });

  it('uses an active, immutable version label for the Phase 1 registry', () => {
    expect(PHASE1_SEMANTIC_VERSION).toEqual({
      version: BARRY_SEMANTIC_VERSION,
      status: 'active',
      changeSummary: 'Initial U435 and U1700L semantic foundation',
    });
    expect(PHASE1_SEMANTIC_REGISTRY.version).toBe(PHASE1_SEMANTIC_VERSION.version);
  });

  it('keeps ontology references internally consistent', () => {
    const conceptKeys = new Set(
      PHASE1_SEMANTIC_REGISTRY.concepts.map((concept) => concept.conceptKey),
    );

    expect(conceptKeys.size).toBe(PHASE1_SEMANTIC_REGISTRY.concepts.length);
    for (const concept of PHASE1_SEMANTIC_REGISTRY.concepts) {
      if (concept.systemConceptKey) expect(conceptKeys.has(concept.systemConceptKey)).toBe(true);
    }
    for (const alias of PHASE1_SEMANTIC_REGISTRY.aliases) {
      expect(conceptKeys.has(alias.conceptKey)).toBe(true);
      for (const contextKey of alias.contextConceptKeys ?? []) {
        expect(conceptKeys.has(contextKey)).toBe(true);
      }
    }
    for (const relationship of PHASE1_SEMANTIC_REGISTRY.relationships) {
      expect(conceptKeys.has(relationship.sourceConceptKey)).toBe(true);
      expect(conceptKeys.has(relationship.targetConceptKey)).toBe(true);
      expect(relationship.confidence).toBeGreaterThan(0);
      expect(relationship.confidence).toBeLessThanOrEqual(1);
    }
  });

  it('represents property requests as typed query constraints', () => {
    const frame = buildSemanticQueryFrame('What is the wheel hub tightening torque?');

    expect(frame.constraints).toContainEqual({
      propertyConceptKey: 'property.torque',
      operator: 'unknown',
      value: '',
    });
  });
});
