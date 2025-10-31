import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface RpsItem {
  item_number: string;
  designation: string;
  nsn: string;
  manufacturer_code: string;
  supplier_code: string;
  quantity_per_assembly: string;
  unit_of_issue: string;
  repair_grade: string;
}

async function generateSQL() {
  console.log('Reading extracted data from pages 222-400...');

  const extractedPath = path.join(__dirname, 'PAGES_222_400_EXTRACTED.json');
  const extractedData = JSON.parse(
    fs.readFileSync(extractedPath, 'utf-8')
  );

  console.log(`Found ${extractedData.summary.total_items} items across ${extractedData.summary.groups_extracted} groups`);

  const escapeString = (s: string): string => {
    if (!s) return '';
    return s.replace(/'/g, "''");
  };

  let sql = `BEGIN;

-- RPS Parts List - Pages 222-400 Extracted Data (387 new items)
-- Generated from PAGES_222_400_EXTRACTED.json
-- These items are NEW to the database (not duplicates of existing data)

INSERT INTO rps_parts (group_code, item_number, description, nsn, rps_number, quantity, repair_grade, metadata) VALUES
`;

  const valueLines: string[] = [];
  let totalItems = 0;
  let itemsWithNilNsn = 0;

  for (const groupCode in extractedData.groups) {
    const group = extractedData.groups[groupCode];

    for (const item of group.items) {
      // Skip items with /NIL NSN values
      if (item.nsn && item.nsn.includes('/NIL')) {
        itemsWithNilNsn++;
        continue;
      }

      totalItems++;

      // Parse quantity - handle ranges, empty strings, etc.
      let quantity = 1;
      if (item.quantity_per_assembly && item.quantity_per_assembly.trim()) {
        const qtyMatch = item.quantity_per_assembly.trim().match(/^(\d+)/);
        if (qtyMatch) {
          quantity = parseInt(qtyMatch[1]);
        }
      }

      // Handle repair_grade - only L, M, H are valid
      let gradeChar = '';
      let originalGrade = '';
      if (item.repair_grade && item.repair_grade.trim()) {
        originalGrade = item.repair_grade.trim();
        if (originalGrade.includes('L')) gradeChar = 'L';
        else if (originalGrade.includes('M')) gradeChar = 'M';
        else if (originalGrade.includes('H')) gradeChar = 'H';
      }

      // Handle NSN - truncate to 25 chars if needed, store full in metadata
      let nsnValue = escapeString(item.nsn);
      let nsnDisplay = nsnValue;
      if (nsnValue.length > 25) {
        const primaryNsn = item.nsn.split('/')[0].trim();
        nsnDisplay = primaryNsn.length <= 25 ? primaryNsn : primaryNsn.substring(0, 25);
      }

      // Build metadata JSON object
      const metadata: any = {};

      if (item.manufacturer_code && item.manufacturer_code.trim()) {
        metadata.manufacturer_code = escapeString(item.manufacturer_code);
      }
      if (item.supplier_code && item.supplier_code.trim()) {
        metadata.supplier_code = escapeString(item.supplier_code);
      }
      if (item.unit_of_issue && item.unit_of_issue.trim()) {
        metadata.unit_of_issue = escapeString(item.unit_of_issue);
      }
      if (nsnValue.length > 25) {
        metadata.nsn_full = nsnValue;
      }
      if (originalGrade && originalGrade !== gradeChar) {
        metadata.repair_grade_original = originalGrade;
      }

      // Build metadata JSON string
      const metadataStr = Object.keys(metadata).length > 0
        ? `jsonb_build_object(${Object.entries(metadata)
            .map(([k, v]) => `'${k}', '${v}'`)
            .join(', ')})`
        : "'{}'::jsonb";

      const description = escapeString(item.designation);
      const nsn = escapeString(nsnDisplay);
      const groupCodeSql = escapeString(group.group_code);
      const itemNum = escapeString(item.item_number);

      const gradeValue = gradeChar ? `'${gradeChar}'` : 'NULL';
      const valueLine = `('${groupCodeSql}', '${itemNum}', '${description}', '${nsn}', '02155', ${quantity}, ${gradeValue}, ${metadataStr})`;
      valueLines.push(valueLine);
    }
  }

  sql += valueLines.join(',\n') + ';';
  sql += '\n\nCOMMIT;';

  const outputPath = path.join(__dirname, '..', '..', 'docs', 'rps-pages-222-400-insert.sql');
  fs.writeFileSync(outputPath, sql, 'utf-8');

  console.log(`\n✓ SQL generated: ${outputPath}`);
  console.log(`✓ Total items to INSERT: ${totalItems}`);
  console.log(`✓ Items skipped (NIL NSN): ${itemsWithNilNsn}`);
  console.log(`✓ File size: ${(sql.length / 1024).toFixed(1)} KB`);
  console.log(`✓ Groups represented: ${extractedData.summary.groups_extracted}`);
  console.log(`\nThis SQL inserts NEW items from pages 222-400 that were not in previous extractions.`);
  console.log(`After running this + previous batches, database will contain: ~850+ items (382 existing + 79 from 90-200 + ${totalItems} from 222-400).`);
}

generateSQL().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
