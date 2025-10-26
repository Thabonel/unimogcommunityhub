import * as fs from 'fs';
import * as path from 'path';

const niinDataPath = path.join(process.cwd(), 'scripts/rps/niin-index-extracted.json');
const niinData = JSON.parse(fs.readFileSync(niinDataPath, 'utf-8'));

const outputPath = path.join(process.cwd(), 'docs/migrations/populate-rps-niin-index.sql');

const sqlLines: string[] = [];

sqlLines.push('BEGIN;');
sqlLines.push('');

for (const entry of niinData) {
  const { niin, group_code, group_ident_no } = entry;
  sqlLines.push(`INSERT INTO rps_niin_index (niin, group_code, group_ident_no) VALUES ('${niin}', '${group_code}', '${group_ident_no}');`);
}

sqlLines.push('');
sqlLines.push('COMMIT;');

const sqlContent = sqlLines.join('\n');

fs.writeFileSync(outputPath, sqlContent);

console.log(`Generated SQL file: ${outputPath}`);
console.log(`Total INSERT statements: ${niinData.length}`);
console.log(`File size: ${(sqlContent.length / 1024).toFixed(2)} KB`);
