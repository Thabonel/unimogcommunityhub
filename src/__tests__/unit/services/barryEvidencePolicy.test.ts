import { describe, expect, it } from 'vitest';
import {
  citationEvidenceKey,
  decideApplicability,
  deduplicateCitations,
  DOCUMENT_ROLE_PERMISSIONS,
  extractNumericValues,
  isClaimClassPermitted,
  normalizePartNumber,
  normalizeUnit,
  numericValuesMatch,
  PAGE_TYPE_PERMISSIONS,
  partNumbersMatch,
  permittedClaimClasses,
  reconcileCitations,
} from '../../../../supabase/functions/_shared/barry-evidence-policy';

describe('document-role permissions', () => {
  it('prohibits parts catalogues from authorizing procedures, torque, fluids, and diagnosis', () => {
    for (const claimClass of ['procedure_step', 'torque', 'fluid', 'capacity', 'diagnostic_cause'] as const) {
      expect(DOCUMENT_ROLE_PERMISSIONS.parts_catalog.has(claimClass)).toBe(false);
    }
    expect(DOCUMENT_ROLE_PERMISSIONS.parts_catalog.has('part_number')).toBe(true);
    expect(DOCUMENT_ROLE_PERMISSIONS.parts_catalog.has('component_identity')).toBe(true);
  });

  it('restricts unknown roles to general discovery', () => {
    expect([...DOCUMENT_ROLE_PERMISSIONS.unknown]).toEqual(['general_description']);
  });

  it('restricts community content from authoritative specifications', () => {
    expect(DOCUMENT_ROLE_PERMISSIONS.community_content.has('specification')).toBe(false);
    expect(DOCUMENT_ROLE_PERMISSIONS.community_content.has('safety_warning')).toBe(false);
  });
});

describe('page-type permissions', () => {
  it('allows diagrams to support component identity only', () => {
    expect([...PAGE_TYPE_PERMISSIONS.diagram]).toEqual(['component_identity']);
  });

  it('never permits index pages as final evidence', () => {
    expect(PAGE_TYPE_PERMISSIONS.index.size).toBe(0);
  });

  it('enforces role and page type together', () => {
    expect(isClaimClassPermitted('workshop_manual', 'procedure', 'procedure_step')).toBe(true);
    expect(isClaimClassPermitted('workshop_manual', 'diagram', 'procedure_step')).toBe(false);
    expect(isClaimClassPermitted('parts_catalog', 'parts_list', 'part_number')).toBe(true);
    expect(isClaimClassPermitted('parts_catalog', 'diagram', 'procedure_step')).toBe(false);
    expect(isClaimClassPermitted('workshop_manual', 'specification', 'torque')).toBe(true);
  });

  it('intersects requested claim classes', () => {
    const permitted = permittedClaimClasses('parts_catalog', 'parts_list', [
      'procedure_step', 'part_number', 'component_identity',
    ]);
    expect(permitted.sort()).toEqual(['component_identity', 'part_number']);
  });
});

describe('applicability decisions', () => {
  it('resolves exact, conditional, unknown, and incompatible', () => {
    expect(decideApplicability(['vehicle_model.u1700l'], 'vehicle_model.u1700l')).toBe('exact');
    expect(decideApplicability(['vehicle_model.u1700l'], 'vehicle_model.u435')).toBe('incompatible');
    expect(decideApplicability(['vehicle_model.u1700l'])).toBe('conditional');
    expect(decideApplicability([], 'vehicle_model.u1700l')).toBe('unknown');
    expect(decideApplicability([])).toBe('unknown');
  });
});

describe('numeric normalization and matching', () => {
  it('normalizes unit variants', () => {
    expect(normalizeUnit('L')).toBe('litre');
    expect(normalizeUnit('liters')).toBe('litre');
    expect(normalizeUnit('Nm')).toBe('newton_metre');
    expect(normalizeUnit('N·m')).toBe('newton_metre');
    expect(normalizeUnit('bar')).toBe('bar');
  });

  it('extracts values, ranges, and approximate qualifiers', () => {
    const values = extractNumericValues('capacity approx. 2.5 l, torque 80-100 Nm, pressure 6.3 bar');
    expect(values).toHaveLength(3);
    expect(values[0]).toMatchObject({ value: 2.5, unit: 'litre', qualifier: 'approximate' });
    expect(values[1]).toMatchObject({ unit: 'newton_metre', range: { min: 80, max: 100 } });
    expect(values[2]).toMatchObject({ value: 6.3, unit: 'bar' });
  });

  it('matches exact values with unit conversion', () => {
    expect(numericValuesMatch(
      { value: 100, unit: 'psi' },
      { value: 100 * 0.0689476, unit: 'bar' },
    )).toBe(true);
    expect(numericValuesMatch({ value: 2.5, unit: 'l' }, { value: 2.5, unit: 'litres' })).toBe(true);
    expect(numericValuesMatch({ value: 2.5, unit: 'l' }, { value: 2.6, unit: 'litres' })).toBe(false);
  });

  it('never rewrites a range as a single value', () => {
    expect(numericValuesMatch(
      { value: 90, unit: 'Nm', range: { min: 80, max: 100 } },
      { value: 90, unit: 'Nm' },
    )).toBe(false);
    expect(numericValuesMatch(
      { value: 80, unit: 'Nm', range: { min: 80, max: 100 } },
      { value: 100, unit: 'Nm', range: { min: 80, max: 100 } },
    )).toBe(true);
  });

  it('allows a single value within an evidence range', () => {
    expect(numericValuesMatch(
      { value: 90, unit: 'Nm' },
      { value: 80, unit: 'Nm', range: { min: 80, max: 100 } },
    )).toBe(true);
  });
});

describe('part-number normalization', () => {
  it('normalizes punctuation but requires identical digits and letters', () => {
    expect(normalizePartNumber('A 000 997 45 48')).toBe('A0009974548');
    expect(partNumbersMatch('A 000 997 45 48', 'A0009974548')).toBe(true);
    expect(partNumbersMatch('A 000 997 45 48', 'A0009974549')).toBe(false);
    expect(partNumbersMatch('', 'A0009974548')).toBe(false);
  });
});

describe('citation identity and reconciliation', () => {
  const citation = (overrides = {}) => ({
    documentId: 'doc-1',
    physicalPdfPage: 934,
    storageUrl: 'https://example/doc.pdf#page=934',
    ...overrides,
  });

  it('builds deterministic identity from document, page, and block or hash', () => {
    expect(citationEvidenceKey({ documentId: 'd', physicalPdfPage: 5, blockId: 'b1' })).toBe('d:5:b1');
    expect(citationEvidenceKey({ documentId: 'd', physicalPdfPage: 5, contentHash: 'h' })).toBe('d:5:h');
    expect(citationEvidenceKey({ documentId: 'd', physicalPdfPage: 5 })).toBe('d:5:');
  });

  it('deduplicates identical evidence identities and rejects invalid pages', () => {
    const result = deduplicateCitations([
      citation(),
      citation(),
      citation({ blockId: 'block-1' }),
      citation({ physicalPdfPage: 0 }),
      citation({ physicalPdfPage: -3 }),
      citation({ physicalPdfPage: 935 }),
    ]);
    expect(result).toHaveLength(3);
    expect(result[0].physicalPdfPage).toBe(934);
    expect(result[1]).toMatchObject({ physicalPdfPage: 934, blockId: 'block-1' });
    expect(result[2].physicalPdfPage).toBe(935);
  });

  it('keeps only citations used by retained claims', () => {
    const citations = [citation(), citation({ physicalPdfPage: 935 })];
    const used = new Set([citationEvidenceKey(citations[1])]);
    const result = reconcileCitations(citations, used);
    expect(result).toHaveLength(1);
    expect(result[0].physicalPdfPage).toBe(935);
  });
});
