import type { BarryClaimClass } from './barry-semantic.ts';

export type PolicyDocumentRole =
  | 'workshop_manual'
  | 'maintenance_manual'
  | 'owners_manual'
  | 'parts_catalog'
  | 'service_bulletin'
  | 'validated_knowledge'
  | 'community_content'
  | 'unknown';

export type PolicyPageType =
  | 'procedure'
  | 'diagnostic'
  | 'specification'
  | 'warning'
  | 'diagram'
  | 'parts_list'
  | 'explanation'
  | 'index'
  | 'unknown';

const GENERAL_ONLY: ReadonlySet<BarryClaimClass> = new Set(['general_description']);

export const DOCUMENT_ROLE_PERMISSIONS: Record<PolicyDocumentRole, ReadonlySet<BarryClaimClass>> = {
  workshop_manual: new Set([
    'procedure_step', 'diagnostic_cause', 'diagnostic_test', 'specification',
    'fluid', 'capacity', 'torque', 'part_number', 'compatibility',
    'component_identity', 'safety_warning', 'general_description',
  ]),
  maintenance_manual: new Set([
    'procedure_step', 'diagnostic_test', 'specification', 'fluid', 'capacity',
    'torque', 'component_identity', 'safety_warning', 'general_description',
  ]),
  owners_manual: new Set([
    'procedure_step', 'diagnostic_test', 'specification', 'fluid', 'capacity',
    'compatibility', 'component_identity', 'safety_warning', 'general_description',
  ]),
  parts_catalog: new Set(['component_identity', 'part_number', 'compatibility']),
  service_bulletin: new Set([
    'procedure_step', 'diagnostic_cause', 'diagnostic_test', 'specification',
    'fluid', 'capacity', 'torque', 'part_number', 'compatibility',
    'component_identity', 'safety_warning', 'general_description',
  ]),
  validated_knowledge: GENERAL_ONLY,
  community_content: new Set(['general_description', 'component_identity']),
  unknown: GENERAL_ONLY,
};

export const PAGE_TYPE_PERMISSIONS: Record<PolicyPageType, ReadonlySet<BarryClaimClass>> = {
  procedure: new Set([
    'procedure_step', 'safety_warning', 'specification', 'torque', 'fluid',
    'capacity', 'compatibility', 'component_identity', 'general_description',
  ]),
  diagnostic: new Set([
    'diagnostic_cause', 'diagnostic_test', 'procedure_step',
    'safety_warning', 'component_identity', 'general_description',
  ]),
  specification: new Set([
    'specification', 'fluid', 'capacity', 'torque', 'compatibility', 'general_description',
  ]),
  warning: new Set(['safety_warning', 'general_description']),
  diagram: new Set(['component_identity']),
  parts_list: new Set(['part_number', 'component_identity', 'compatibility']),
  explanation: new Set(['general_description', 'component_identity']),
  index: new Set(),
  unknown: GENERAL_ONLY,
};

export function isClaimClassPermitted(
  documentRole: PolicyDocumentRole,
  pageType: PolicyPageType,
  claimClass: BarryClaimClass,
): boolean {
  return DOCUMENT_ROLE_PERMISSIONS[documentRole].has(claimClass)
    && PAGE_TYPE_PERMISSIONS[pageType].has(claimClass);
}

export function permittedClaimClasses(
  documentRole: PolicyDocumentRole,
  pageType: PolicyPageType,
  requested: BarryClaimClass[],
): BarryClaimClass[] {
  return requested.filter((claimClass) => isClaimClassPermitted(documentRole, pageType, claimClass));
}

export type ApplicabilityDecision =
  | 'exact'
  | 'compatible_series'
  | 'conditional'
  | 'unknown'
  | 'incompatible';

export function decideApplicability(
  evidenceModelScope: string[],
  queryModelConceptKey?: string,
): ApplicabilityDecision {
  if (!queryModelConceptKey) {
    return evidenceModelScope.length ? 'conditional' : 'unknown';
  }
  if (!evidenceModelScope.length) return 'unknown';
  return evidenceModelScope.includes(queryModelConceptKey) ? 'exact' : 'incompatible';
}

const UNIT_ALIASES: Record<string, string> = {
  l: 'litre',
  ltr: 'litre',
  litre: 'litre',
  litres: 'litre',
  liter: 'litre',
  liters: 'litre',
  nm: 'newton_metre',
  'n m': 'newton_metre',
  'newton metre': 'newton_metre',
  'newton metres': 'newton_metre',
  bar: 'bar',
  psi: 'psi',
  kpa: 'kilopascal',
  kg: 'kilogram',
  mm: 'millimetre',
  m: 'metre',
  metre: 'metre',
  metres: 'metre',
  meter: 'metre',
  meters: 'metre',
};

const UNIT_CONVERSIONS: Record<string, { unit: string; factor: number }> = {
  psi: { unit: 'bar', factor: 0.0689476 },
  kilopascal: { unit: 'bar', factor: 0.01 },
  metre: { unit: 'millimetre', factor: 1000 },
  millimetre: { unit: 'metre', factor: 0.001 },
};

export function normalizeUnit(unit: string): string {
  const normalized = unit.toLowerCase().replace(/[·.\s]+/g, ' ').trim();
  return UNIT_ALIASES[normalized] ?? UNIT_ALIASES[normalized.replace(/\s+/g, '')] ?? normalized;
}

export interface NumericValue {
  value: number;
  unit?: string;
  qualifier?: 'approximate' | 'maximum' | 'minimum';
  range?: { min: number; max: number };
}

const NUMERIC_PATTERN = /(?:approx(?:imately)?\.?|about|max(?:imum)?\.?|min(?:imum)?\.?)?\s*(\d+(?:[.,]\d+)?)(?:\s*(?:-|–|to)\s*(\d+(?:[.,]\d+)?))?\s*(litres?|liters?|ltr|l|nm|n[·.\s]?m|newton\s?metres?|bar|psi|kpa|kg|mm|metres?|meters?|m)\b/gi;

export function extractNumericValues(text: string): NumericValue[] {
  const values: NumericValue[] = [];
  for (const match of text.matchAll(NUMERIC_PATTERN)) {
    const qualifier = /approx|about/i.test(match[0]) ? 'approximate'
      : /max/i.test(match[0]) ? 'maximum'
      : /min/i.test(match[0]) ? 'minimum'
      : undefined;
    const first = Number(match[1].replace(',', '.'));
    if (!Number.isFinite(first)) continue;
    const unit = normalizeUnit(match[3]);
    if (match[2]) {
      const second = Number(match[2].replace(',', '.'));
      if (Number.isFinite(second)) {
        values.push({ value: first, unit, qualifier, range: { min: Math.min(first, second), max: Math.max(first, second) } });
        continue;
      }
    }
    values.push({ value: first, unit, qualifier });
  }
  return values;
}

const VALUE_EPSILON = 0.0001;

function convert(value: number, unit: string, targetUnit: string): number | null {
  if (unit === targetUnit) return value;
  const conversion = UNIT_CONVERSIONS[unit];
  if (conversion && conversion.unit === targetUnit) return value * conversion.factor;
  return null;
}

export function numericValuesMatch(claim: NumericValue, evidence: NumericValue): boolean {
  if (!claim.unit || !evidence.unit) return false;
  const claimUnit = normalizeUnit(claim.unit);
  const evidenceUnit = normalizeUnit(evidence.unit);

  if (claim.range) {
    if (!evidence.range) return false;
    const min = convert(claim.range.min, claimUnit, evidenceUnit);
    const max = convert(claim.range.max, claimUnit, evidenceUnit);
    if (min === null || max === null) return false;
    return Math.abs(min - evidence.range.min) < VALUE_EPSILON
      && Math.abs(max - evidence.range.max) < VALUE_EPSILON;
  }

  const converted = convert(claim.value, claimUnit, evidenceUnit);
  if (converted === null) return false;
  if (evidence.range) {
    return converted >= evidence.range.min - VALUE_EPSILON
      && converted <= evidence.range.max + VALUE_EPSILON;
  }
  return Math.abs(converted - evidence.value) < VALUE_EPSILON;
}

export function normalizePartNumber(partNumber: string): string {
  return partNumber.toUpperCase().replace(/[^A-Z0-9]/g, '');
}

export function partNumbersMatch(claim: string, evidence: string): boolean {
  const normalizedClaim = normalizePartNumber(claim);
  const normalizedEvidence = normalizePartNumber(evidence);
  if (!normalizedClaim || !normalizedEvidence) return false;
  return normalizedClaim === normalizedEvidence;
}

export interface CitationIdentity {
  documentId: string;
  physicalPdfPage: number;
  blockId?: string;
  contentHash?: string;
}

export function citationEvidenceKey(citation: CitationIdentity): string {
  const suffix = citation.blockId ?? citation.contentHash ?? '';
  return `${citation.documentId}:${citation.physicalPdfPage}:${suffix}`;
}

export interface CitationCandidate extends CitationIdentity {
  storageUrl?: string;
}

export function deduplicateCitations<T extends CitationCandidate>(citations: T[]): T[] {
  const seen = new Set<string>();
  const result: T[] = [];
  for (const citation of citations) {
    if (!Number.isFinite(citation.physicalPdfPage) || citation.physicalPdfPage <= 0) continue;
    const key = citationEvidenceKey(citation);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(citation);
  }
  return result;
}

export function reconcileCitations<T extends CitationCandidate>(
  citations: T[],
  usedKeys: ReadonlySet<string>,
): T[] {
  return deduplicateCitations(citations).filter((citation) =>
    usedKeys.has(citationEvidenceKey(citation)));
}
