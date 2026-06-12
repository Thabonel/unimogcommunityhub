import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), '..');
const registryPath = path.join(repoRoot, 'docs/BARRY_V2_CANONICAL_MANUAL_REGISTRY.json');
const outputPath = path.join(repoRoot, 'docs/BARRY_V2_SOURCE_DOCUMENTS_IMPORT.sql');

function sqlString(value) {
  if (value === null || value === undefined) return 'NULL';
  return `'${String(value).replace(/'/g, "''")}'`;
}

function sqlNumber(value) {
  return Number.isFinite(value) ? String(value) : 'NULL';
}

function sqlBoolean(value) {
  return value ? 'true' : 'false';
}

function sqlJson(value) {
  return `${sqlString(JSON.stringify(value ?? {}))}::jsonb`;
}

function rowSql(record) {
  return `(
    ${sqlString(record.canonical_id)},
    ${sqlString(record.normalized_title)},
    ${sqlString(record.canonical_file)},
    ${sqlString(record.canonical_path)},
    ${sqlString(record.canonical_sha256)},
    ${sqlString(record.document_type)},
    ${sqlString(record.source_group)},
    ${sqlNumber(record.file_size_mb)},
    ${sqlNumber(record.page_count)},
    ${sqlString(record.quality_status)},
    ${sqlNumber(record.quality_score)},
    ${sqlNumber(record.duplicate_count)},
    ${sqlBoolean(record.use_for_extraction)},
    ${sqlJson(record)}
  )`;
}

function main() {
  const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
  const records = registry.records ?? [];

  let sql = '';
  sql += '-- Barry v2 source document import generated from docs/BARRY_V2_CANONICAL_MANUAL_REGISTRY.json\n';
  sql += '-- Run after supabase/migrations/20260612000000_barry_v2_pilot_schema.sql.\n\n';
  sql += 'BEGIN;\n\n';
  sql += `INSERT INTO barry_v2_source_documents (
  canonical_id,
  normalized_title,
  filename,
  local_path,
  sha256,
  document_type,
  source_group,
  file_size_mb,
  page_count,
  quality_status,
  quality_score,
  duplicate_count,
  use_for_extraction,
  registry_payload
)\nVALUES\n`;
  sql += records.map(rowSql).join(',\n');
  sql += `\nON CONFLICT (canonical_id) DO UPDATE SET
  normalized_title = EXCLUDED.normalized_title,
  filename = EXCLUDED.filename,
  local_path = EXCLUDED.local_path,
  sha256 = EXCLUDED.sha256,
  document_type = EXCLUDED.document_type,
  source_group = EXCLUDED.source_group,
  file_size_mb = EXCLUDED.file_size_mb,
  page_count = EXCLUDED.page_count,
  quality_status = EXCLUDED.quality_status,
  quality_score = EXCLUDED.quality_score,
  duplicate_count = EXCLUDED.duplicate_count,
  use_for_extraction = EXCLUDED.use_for_extraction,
  registry_payload = EXCLUDED.registry_payload,
  updated_at = now();\n\n`;
  sql += 'COMMIT;\n';

  fs.writeFileSync(outputPath, sql);
  console.log(`Generated ${records.length} source document rows`);
  console.log(outputPath);
}

main();
