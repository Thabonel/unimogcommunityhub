export interface CoverageRow {
  source_type: string;
  document_role: string;
  page_type: string;
  review_status: string | null;
  units: number;
  annotations: number;
  approved: number;
  proposed: number;
}

export interface CoverageBucket {
  key: string;
  units: number;
  annotations: number;
  approved: number;
  proposed: number;
}

export interface CoverageReport {
  totalUnits: number;
  totalAnnotations: number;
  approvedAnnotations: number;
  proposedAnnotations: number;
  bySourceType: CoverageBucket[];
  byDocumentRole: CoverageBucket[];
  byPageType: CoverageBucket[];
  byReviewStatus: CoverageBucket[];
  byConfidenceBand: CoverageBucket[];
}

function bucketize(rows: CoverageRow[], keyOf: (row: CoverageRow) => string): CoverageBucket[] {
  const buckets = new Map<string, CoverageBucket>();
  for (const row of rows) {
    const key = keyOf(row);
    const bucket = buckets.get(key) ?? { key, units: 0, annotations: 0, approved: 0, proposed: 0 };
    bucket.units += Number(row.units);
    bucket.annotations += Number(row.annotations);
    bucket.approved += Number(row.approved);
    bucket.proposed += Number(row.proposed);
    buckets.set(key, bucket);
  }
  return [...buckets.values()].sort((a, b) => b.units - a.units || a.key.localeCompare(b.key));
}

export function confidenceBand(confidence: number): string {
  if (confidence >= 0.85) return 'high (>=0.85)';
  if (confidence >= 0.6) return 'medium (0.6-0.85)';
  return 'low (<0.6)';
}

export function buildCoverageReport(
  rows: CoverageRow[],
  confidenceBands: CoverageBucket[],
  totalUnits?: number,
): CoverageReport {
  const sum = (values: unknown[]) => values.reduce((total, value) => total + Number(value), 0);
  return {
    totalUnits: totalUnits ?? sum(rows.map((row) => row.units)),
    totalAnnotations: sum(rows.map((row) => row.annotations)),
    approvedAnnotations: sum(rows.map((row) => row.approved)),
    proposedAnnotations: sum(rows.map((row) => row.proposed)),
    bySourceType: bucketize(rows, (row) => row.source_type),
    byDocumentRole: bucketize(rows, (row) => row.document_role),
    byPageType: bucketize(rows, (row) => row.page_type),
    byReviewStatus: bucketize(rows, (row) => row.review_status ?? 'unreviewed'),
    byConfidenceBand: confidenceBands,
  };
}

export const COVERAGE_QUERY = `
SELECT unit.source_type,
       document.document_role,
       unit.page_type,
       annotation.review_status,
       count(DISTINCT unit.id) AS units,
       count(annotation.*) AS annotations,
       count(annotation.*) FILTER (WHERE annotation.review_status = 'approved') AS approved,
       count(annotation.*) FILTER (WHERE annotation.review_status = 'proposed') AS proposed
FROM public.barry_evidence_units unit
JOIN public.barry_documents document ON document.id = unit.document_id
LEFT JOIN public.barry_evidence_concepts annotation ON annotation.evidence_unit_id = unit.id
WHERE unit.semantic_version_id = $1
GROUP BY 1, 2, 3, 4
ORDER BY 1, 2, 3, 4
`;

export const TOTAL_UNITS_QUERY = `
SELECT count(*) AS total_units
FROM public.barry_evidence_units
WHERE semantic_version_id = $1
`;

export const CONFIDENCE_BAND_QUERY = `
SELECT CASE
         WHEN confidence >= 0.85 THEN 'high (>=0.85)'
         WHEN confidence >= 0.6 THEN 'medium (0.6-0.85)'
         ELSE 'low (<0.6)'
       END AS key,
       0 AS units,
       count(*) AS annotations,
       count(*) FILTER (WHERE review_status = 'approved') AS approved,
       count(*) FILTER (WHERE review_status = 'proposed') AS proposed
FROM public.barry_evidence_concepts
WHERE semantic_version_id = $1
GROUP BY 1
ORDER BY 1
`;
