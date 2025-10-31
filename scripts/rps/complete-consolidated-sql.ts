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
  notes: string;
}

interface RpsGroup {
  group_code: string;
  title: string;
  pages: number[];
  items: RpsItem[];
}

interface ConsolidatedData {
  metadata: {
    total_items: number;
    total_groups: number;
  };
  groups: {
    [groupCode: string]: {
      group_code: string;
      title: string;
      items: RpsItem[];
    };
  };
}

async function generateCompleteSql() {
  console.log('Reading consolidated data...');

  const consolidatedPath = path.join(__dirname, 'MASTER_RPS_CONSOLIDATED.json');
  const consolidatedData = JSON.parse(
    fs.readFileSync(consolidatedPath, 'utf-8')
  ) as ConsolidatedData;

  console.log(`Found ${consolidatedData.metadata.total_items} items across ${consolidatedData.metadata.total_groups} groups`);

  // Groups already in database - skip these to avoid duplicates
  const existingGroups = ['EA', 'ED', 'FBD', 'FDA', 'FDB', 'FDE', 'HA', 'J', 'JA', 'JB'];
  console.log(`Skipping ${existingGroups.length} groups already in database: ${existingGroups.join(', ')}`);

  // Generate SQL INSERT statements
  let sql = `BEGIN;

-- RPS Parts List - Complete Consolidated Insert (373 items)
-- Generated from MASTER_RPS_CONSOLIDATED.json
-- Schema mapping:
--   designation -> description
--   quantity_per_assembly -> quantity
--   All other fields -> metadata JSONB

INSERT INTO rps_parts (group_code, item_number, description, nsn, rps_number, quantity, repair_grade, metadata) VALUES
`;

  const valueLines: string[] = [];
  let skippedItems = 0;

  for (const groupCode in consolidatedData.groups) {
    // Skip groups that already exist in database
    if (existingGroups.includes(groupCode)) {
      const group = consolidatedData.groups[groupCode];
      skippedItems += group.items.length;
      console.log(`  Skipping ${groupCode}: ${group.items.length} items`);
      continue;
    }

    const group = consolidatedData.groups[groupCode];
    for (const item of group.items) {
      // Parse quantity - handle ranges, empty strings, etc.
      let quantity = 1;
      if (item.quantity_per_assembly && item.quantity_per_assembly.trim()) {
        const qtyNum = parseInt(item.quantity_per_assembly.trim().split(/[\s-]/)[0]);
        quantity = isNaN(qtyNum) ? 1 : qtyNum;
      }

      // Handle repair_grade - only L, M, H are valid
      // Map to valid values or NULL, store original in metadata if different
      let gradeChar = '';
      let originalGrade = '';
      if (item.repair_grade && item.repair_grade.trim()) {
        originalGrade = item.repair_grade.trim();
        const firstChar = originalGrade.charAt(0).toUpperCase();
        // Only L, M, H are valid
        if (['L', 'M', 'H'].includes(firstChar)) {
          gradeChar = firstChar;
        }
        // Otherwise leave empty (will become NULL in SQL)
      }

      // Escape single quotes in strings
      const escapeString = (s: string): string => {
        return s.replace(/'/g, "''");
      };

      // Handle NSN - truncate to 25 chars if needed, store full in metadata
      let nsnValue = escapeString(item.nsn);
      let nsnDisplay = nsnValue;
      if (nsnValue.length > 25) {
        // Extract primary NSN (before slash) for column, store full in metadata
        const primaryNsn = item.nsn.split('/')[0].trim();
        nsnDisplay = primaryNsn.length <= 25 ? primaryNsn : primaryNsn.substring(0, 25);
      }

      // Build metadata JSON object
      const metadata: any = {};
      if (item.notes && item.notes.trim()) {
        metadata.notes = escapeString(item.notes);
      }
      if (item.manufacturer_code && item.manufacturer_code.trim()) {
        metadata.manufacturer_code = escapeString(item.manufacturer_code);
      }
      if (item.supplier_code && item.supplier_code.trim()) {
        metadata.supplier_code = escapeString(item.supplier_code);
      }
      if (item.unit_of_issue && item.unit_of_issue.trim()) {
        metadata.unit_of_issue = escapeString(item.unit_of_issue);
      }
      // Store full NSN if it was truncated
      if (nsnValue.length > 25) {
        metadata.nsn_full = nsnValue;
      }
      // Store original repair_grade if it was invalid/non-standard
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
      const groupCode = escapeString(group.group_code);
      const itemNum = escapeString(item.item_number);

      // Handle repair_grade as NULL if empty, otherwise as character
      const gradeValue = gradeChar ? `'${gradeChar}'` : 'NULL';
      const valueLine = `('${groupCode}', '${itemNum}', '${description}', '${nsn}', '02155', ${quantity}, ${gradeValue}, ${metadataStr})`;
      valueLines.push(valueLine);
    }
  }

  sql += valueLines.join(',\n') + ';';
  sql += '\n\nCOMMIT;';

  // Write to file
  const outputPath = path.join(__dirname, '..', '..', 'docs', 'rps-consolidated-insert-complete.sql');
  fs.writeFileSync(outputPath, sql, 'utf-8');

  console.log(`\n✓ Complete SQL generated: ${outputPath}`);
  console.log(`✓ Items to INSERT: ${valueLines.length} (NEW groups only)`);
  console.log(`✓ Items SKIPPED: ${skippedItems} (already in database)`);
  console.log(`✓ File size: ${(sql.length / 1024).toFixed(1)} KB`);
}

generateCompleteSql().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
