import { describe, expect, it } from 'vitest';
import { PHASE1_SEMANTIC_REGISTRY } from '../../../../supabase/functions/_shared/barry-semantic';
import {
  adaptEvidenceRow,
  resolveModelScope,
} from '../../../../scripts/barry-backfill/barry-evidence-adapters';
import type {
  AdapterContext,
  DocumentRegistration,
  EvidenceSourceRow,
} from '../../../../scripts/barry-backfill/barry-evidence-types';

const WORKSHOP_DOC: DocumentRegistration = {
  documentKey: 'manual_chunks_document:wm',
  title: 'U1700L U435 Workshop Manual Volume 1',
  documentRole: 'workshop_manual',
  modelTags: ['U1700L', 'U435'],
  sourceType: 'manual_chunks_document',
  sourceRecordId: 'wm',
  provenance: {},
};

const RPS_DOC: DocumentRegistration = {
  documentKey: 'rps_catalog:02155',
  title: 'RPS 02155',
  documentRole: 'parts_catalog',
  modelTags: [],
  sourceType: 'rps_catalog',
  provenance: {},
};

const CONTEXT: AdapterContext = {
  registry: PHASE1_SEMANTIC_REGISTRY,
  semanticVersion: '1.0.0-phase1',
  documentRoles: new Map([
    [WORKSHOP_DOC.documentKey, WORKSHOP_DOC],
    [RPS_DOC.documentKey, RPS_DOC],
  ]),
};

function row(overrides: Partial<EvidenceSourceRow>): EvidenceSourceRow {
  return {
    sourceType: 'manual_chunk',
    sourceRecordId: 'row-1',
    documentKey: WORKSHOP_DOC.documentKey,
    systemTags: [],
    modelTags: [],
    ...overrides,
  };
}

describe('resolveModelScope', () => {
  it('resolves verified model tags to concept keys', () => {
    expect(resolveModelScope(['U1700L', 'U435'], CONTEXT).sort()).toEqual([
      'vehicle_model.u1700l',
      'vehicle_model.u435',
    ]);
    expect(resolveModelScope(['1700l'], CONTEXT)).toEqual(['vehicle_model.u1700l']);
    expect(resolveModelScope(['unknown-model'], CONTEXT)).toEqual([]);
  });
});

describe('manual_chunk adapter', () => {
  it('maps the page 928 technical data page to steering specification concepts', () => {
    const result = adaptEvidenceRow(row({
      physicalPdfPage: 928,
      title: 'Page 928',
      contentText: 'Technical data Steering box Ratio in steering box Worm pitch, lefthand Piston diameter Swept piston area Max. rotation of steenng shaft Hydraulic torque at 100',
    }), CONTEXT);

    expect(result.unit.pageType).toBe('specification');
    const byKey = new Map(result.annotations.map((a) => [a.conceptKey, a]));
    expect(byKey.get('component.steering_gear')?.annotationRole).toBe('primary_subject');
    expect(byKey.get('property.torque')?.annotationRole).toBe('property');
    expect(byKey.get('vehicle_system.steering')).toBeDefined();
    for (const annotation of result.annotations) {
      expect(annotation.method).toBe('deterministic');
      expect(annotation.modelScope).toContain('vehicle_model.u1700l');
      expect(annotation.provenance.document_key).toBe(WORKSHOP_DOC.documentKey);
    }
  });

  it('maps exploded view 934 as diagram with no operation or property annotations', () => {
    const result = adaptEvidenceRow(row({
      physicalPdfPage: 934,
      title: 'Page 934',
      contentText: 'Exploded v1ew Steering box 4 Steering 96 7 Housing 99 9 Needle bearmg 103 12 Ret11mer 108 14 Seal ing ri ng 130 17 Cover 133 20 Rerainer 137 22 Sealing ring 143',
    }), CONTEXT);

    expect(result.unit.pageType).toBe('diagram');
    expect(result.annotations.every((a) =>
      a.annotationRole === 'primary_subject'
      || a.annotationRole === 'mentioned_component'
      || a.annotationRole === 'applicability')).toBe(true);
    expect(result.annotations.some((a) => a.annotationRole === 'operation')).toBe(false);
    expect(result.annotations.some((a) => a.annotationRole === 'property')).toBe(false);
    expect(result.annotations.some((a) => a.conceptKey === 'component.steering_gear')).toBe(true);
  });

  it('maps page 946 tightness check as a procedure without inventing unverified concepts', () => {
    const result = adaptEvidenceRow(row({
      physicalPdfPage: 946,
      title: 'Page 946',
      contentText: 'Checking tightness of universal joint at steering box 46.11 Checking tightness Turn front wheels to straight ahead position. 2 Raise hood on outside and remove front panel. 3 Pull off rubber seal on s',
    }), CONTEXT);

    expect(result.unit.pageType).toBe('procedure');
    const byKey = new Map(result.annotations.map((a) => [a.conceptKey, a]));
    expect(byKey.get('component.steering_gear')?.annotationRole).toBe('primary_subject');
    expect(byKey.get('component.steering_column_coupling')).toBeUndefined();
    expect(result.annotations.some((a) => a.annotationRole === 'operation')).toBe(true);
    expect(result.annotations.some((a) => a.annotationRole === 'property')).toBe(false);
  });

  it('keeps wheel hub drive pages 605 and 609 out of steering concepts', () => {
    for (const page of [605, 609]) {
      const result = adaptEvidenceRow(row({
        physicalPdfPage: page,
        title: `Page ${page}`,
        contentText: 'Disassembly and Assembly of IJI/heel Hub Orive 33.6 15 Unscrew bleeder line and brake line holder, de- taching wheel hub drive. 16 Lock dr1ve gear usmg special tool No. 6',
      }), CONTEXT);

      expect(result.unit.pageType).toBe('procedure');
      expect(result.annotations.some((a) => a.conceptKey === 'component.portal_hub')).toBe(true);
      expect(result.annotations.some((a) => a.conceptKey === 'component.steering_gear')).toBe(false);
      expect(result.annotations.some((a) => a.conceptKey === 'vehicle_system.steering')).toBe(false);
    }
  });

  it('retains provenance and semantic-version scoped identity on every annotation', () => {
    const result = adaptEvidenceRow(row({
      physicalPdfPage: 928,
      contentText: 'Technical data Steering box Ratio in steering box',
    }), CONTEXT);
    for (const annotation of result.annotations) {
      expect(annotation.provenance.source).toBe('phase2_backfill');
      expect(annotation.sourceType).toBe('manual_chunk');
      expect(annotation.sourceRecordId).toBe('row-1');
    }
  });
});

describe('rps_part adapter', () => {
  it('maps steering box seal rings as parts-list evidence, never procedures', () => {
    const result = adaptEvidenceRow(row({
      sourceType: 'rps_part',
      sourceRecordId: 'fa39bb1e-ef77-4b03-b4c6-ee997fb94879',
      documentKey: RPS_DOC.documentKey,
      title: 'SEAL RING (ALSO PART OF PB 002)',
      groupCode: 'PB',
      groupName: 'STEERING BOX ASSEMBLY',
      physicalPdfPage: 605,
    }), CONTEXT);

    expect(result.unit.pageType).toBe('parts_list');
    const byKey = new Map(result.annotations.map((a) => [a.conceptKey, a]));
    expect(byKey.get('part.sealing_ring')?.annotationRole).toBe('primary_subject');
    expect(byKey.get('component.steering_gear')?.annotationRole).toBe('mentioned_component');
    expect(result.annotations.every((a) => a.annotationRole !== 'operation')).toBe(true);
  });

  it('routes parts without verified applicability to the review queue', () => {
    const result = adaptEvidenceRow(row({
      sourceType: 'rps_part',
      sourceRecordId: 'a72b9390-d112-4901-8487-3d7a38e574ee',
      documentKey: RPS_DOC.documentKey,
      title: 'SEAL RING (ALSO PART OF PB 002 AND PB 9010)',
      groupCode: 'PB',
      groupName: 'STEERING BOX ASSEMBLY',
    }), CONTEXT);

    expect(result.reviewItems.some((item) =>
      String(item.proposedPayload.reason).includes('model applicability'))).toBe(true);
    expect(result.annotations.every((a) => a.reviewStatus !== 'approved' || a.confidence >= 0.85)).toBe(true);
  });

  it('keeps proposed status for model-assisted-style low confidence mappings', () => {
    const result = adaptEvidenceRow(row({
      sourceType: 'rps_part',
      sourceRecordId: 'b3c8cc0f-21f8-46f8-a452-aa4045e1ed16',
      documentKey: RPS_DOC.documentKey,
      title: 'SEAL RING (ALSO PART OF PB 002 AND PB 9010)',
      groupCode: 'PB',
      groupName: 'STEERING BOX ASSEMBLY',
    }), CONTEXT);
    const seal = result.annotations.find((a) => a.conceptKey === 'part.sealing_ring');
    expect(seal?.reviewStatus).toBe('proposed');
  });
});

describe('rps_illustration adapter', () => {
  it('maps the power steering pump illustration as a diagram of the pump', () => {
    const result = adaptEvidenceRow(row({
      sourceType: 'rps_illustration',
      sourceRecordId: '4c6814a2-12e8-4877-9123-80d72c36cfef',
      documentKey: RPS_DOC.documentKey,
      title: 'RPS Manual Page 620 - Exploded View Diagram',
      groupCode: 'PBA',
      groupName: 'POWER STEERING PUMP AND DRIVE',
      physicalPdfPage: 620,
    }), CONTEXT);

    expect(result.unit.pageType).toBe('diagram');
    expect(result.annotations.some((a) =>
      a.conceptKey === 'component.power_steering_pump'
      && a.annotationRole === 'primary_subject')).toBe(true);
    expect(result.annotations.every((a) => a.annotationRole !== 'operation')).toBe(true);
  });
});

describe('specification adapter', () => {
  it('routes specifications without applicability to safety-critical review', () => {
    const result = adaptEvidenceRow(row({
      sourceType: 'barry_v2_specification',
      sourceRecordId: 'spec-1',
      documentKey: WORKSHOP_DOC.documentKey,
      specCategory: 'capacities',
      specName: 'steering fluid capacity',
      physicalPdfPage: 928,
    }), CONTEXT);

    expect(result.unit.pageType).toBe('specification');
    expect(result.annotations.some((a) => a.conceptKey === 'property.fluid_capacity')).toBe(true);
    expect(result.reviewItems.some((item) => item.riskLevel === 'safety_critical')).toBe(true);
  });
});

describe('unsupported sources', () => {
  it('rejects unknown source types', () => {
    expect(() => adaptEvidenceRow(row({
      sourceType: 'validated_answer' as EvidenceSourceRow['sourceType'],
    }), CONTEXT)).toThrow();
  });
});
