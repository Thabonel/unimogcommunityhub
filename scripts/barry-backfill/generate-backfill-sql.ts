import { writeFileSync } from 'node:fs';
import pg from 'pg';
import { stableUuid } from './barry-evidence-store';

const RUN_KEY = process.env.BACKFILL_RUN_KEY ?? 'prod-steering-phase2-1';
const VERSION = process.env.BARRY_SEMANTIC_VERSION ?? '1.0.0-phase1';
const OUT = process.argv[2] ?? '/tmp/barry-phase2-backfill.sql';

function literal(value: unknown): string {
  if (value === null || value === undefined) return 'NULL';
  if (typeof value === 'number') return Number.isFinite(value) ? String(value) : 'NULL';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (Array.isArray(value)) {
    return `ARRAY[${value.map((entry) => literal(entry)).join(', ')}]::text[]`;
  }
  if (typeof value === 'object') {
    return `'${JSON.stringify(value).replace(/'/g, "''")}'::jsonb`;
  }
  return `'${String(value).replace(/'/g, "''")}'`;
}

async function main(): Promise<void> {
  const client = new pg.Client({ connectionString: process.env.BARRY_BACKFILL_DB_URL });
  await client.connect();

  const versionIdResult = await client.query(
    'SELECT id FROM public.barry_semantic_versions WHERE version = $1',
    [VERSION],
  );
  const localVersionId = versionIdResult.rows[0].id;
  const versionSubquery = `(SELECT id FROM public.barry_semantic_versions WHERE version = '${VERSION}')`;

  const runResult = await client.query(
    'SELECT * FROM public.barry_backfill_runs WHERE run_key = $1',
    [RUN_KEY],
  );
  const run = runResult.rows[0];
  if (!run) throw new Error(`Run ${RUN_KEY} not found`);
  const runId = stableUuid(`barry_backfill_run:${RUN_KEY}`);

  const documents = (await client.query(
    'SELECT * FROM public.barry_documents WHERE semantic_version_id = $1 ORDER BY document_key',
    [localVersionId],
  )).rows;

  const units = (await client.query(
    `SELECT unit.*, document.document_key
     FROM public.barry_evidence_units unit
     JOIN public.barry_documents document ON document.id = unit.document_id
     WHERE unit.semantic_version_id = $1
     ORDER BY unit.source_type, unit.source_record_id`,
    [localVersionId],
  )).rows;

  const annotations = (await client.query(
    `SELECT annotation.*, concept.concept_key, unit.source_type AS unit_source_type,
            unit.source_record_id AS unit_source_record_id
     FROM public.barry_evidence_concepts annotation
     JOIN public.barry_semantic_concepts concept ON concept.id = annotation.concept_id
     LEFT JOIN public.barry_evidence_units unit ON unit.id = annotation.evidence_unit_id
     WHERE annotation.semantic_version_id = $1
     ORDER BY annotation.source_type, annotation.source_record_id`,
    [localVersionId],
  )).rows;

  const reviewItems = (await client.query(
    `SELECT * FROM public.barry_semantic_review_queue
     WHERE semantic_version_id = $1 AND dedupe_key LIKE 'evidence_mapping:%'
     ORDER BY dedupe_key`,
    [localVersionId],
  )).rows;

  const documentId = (documentKey: string) => stableUuid(`barry_document:${VERSION}:${documentKey}`);
  const unitId = (sourceType: string, sourceRecordId: string) =>
    stableUuid(`barry_evidence_unit:${VERSION}:${sourceType}:${sourceRecordId}`);

  const sql: string[] = [];
  sql.push('BEGIN;');
  sql.push('');
  sql.push(`INSERT INTO public.barry_backfill_runs (
  id, run_key, semantic_version_id, mode, filters, status, stats, completed_at
) VALUES (
  '${runId}',
  '${RUN_KEY}',
  ${versionSubquery},
  'apply',
  ${literal(run.filters)},
  'completed',
  ${literal(run.stats)},
  now()
)
ON CONFLICT (run_key) DO NOTHING;`);
  sql.push('');

  for (const document of documents) {
    sql.push(`INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  '${documentId(document.document_key)}',
  ${literal(document.document_key)},
  ${literal(document.title)},
  ${literal(document.document_role)},
  ${literal(document.storage_path)},
  ${literal(document.physical_page_count)},
  ${literal(document.checksum)},
  ${literal(document.model_tags)},
  ${literal(document.source_type)},
  ${literal(document.source_record_id)},
  ${versionSubquery},
  ${literal(document.provenance)}
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();`);
  }
  sql.push('');

  for (const unit of units) {
    sql.push(`INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '${unitId(unit.source_type, unit.source_record_id)}',
  '${documentId(unit.document_key)}',
  ${literal(unit.source_type)},
  ${literal(unit.source_record_id)},
  ${literal(unit.physical_pdf_page)},
  ${literal(unit.page_type)},
  ${literal(unit.content_hash)},
  ${literal(unit.system_tags)},
  ${literal(unit.model_tags)},
  ${literal(unit.component_tags)},
  ${literal(unit.extraction_quality)},
  ${versionSubquery},
  '${runId}',
  ${literal(unit.provenance)}
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();`);
  }
  sql.push('');

  for (const annotation of annotations) {
    const unitReference = annotation.unit_source_record_id
      ? `'${unitId(annotation.unit_source_type, annotation.unit_source_record_id)}'`
      : 'NULL';
    sql.push(`INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  ${literal(annotation.source_type)},
  ${literal(annotation.source_record_id)},
  concept.id,
  ${literal(annotation.annotation_role)},
  ${literal(annotation.confidence)},
  ${literal(annotation.method)},
  ${literal(annotation.review_status)},
  ${versionSubquery},
  ${unitReference},
  ${literal(annotation.model_scope)},
  '${runId}',
  ${literal(annotation.provenance)}
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = ${literal(annotation.concept_key)}
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;`);
  }
  sql.push('');

  for (const item of reviewItems) {
    sql.push(`INSERT INTO public.barry_semantic_review_queue (
  dedupe_key, review_type, proposed_payload, query_frequency, affected_systems,
  risk_level, status, semantic_version_id
) VALUES (
  ${literal(item.dedupe_key)},
  ${literal(item.review_type)},
  ${literal(item.proposed_payload)},
  ${literal(item.query_frequency)},
  ${literal(item.affected_systems)},
  ${literal(item.risk_level)},
  ${literal(item.status)},
  ${versionSubquery}
)
ON CONFLICT (dedupe_key) DO UPDATE SET proposed_payload = EXCLUDED.proposed_payload;`);
  }

  sql.push('');
  sql.push('COMMIT;');
  sql.push('');
  writeFileSync(OUT, sql.join('\n') + '\n');

  console.log(JSON.stringify({
    out: OUT,
    runKey: RUN_KEY,
    documents: documents.length,
    units: units.length,
    annotations: annotations.length,
    reviewItems: reviewItems.length,
  }, null, 2));
  await client.end();
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
