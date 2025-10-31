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

  // Groups to replace (delete old, insert consolidated)
  const groupsToReplace = ['EA', 'ED', 'FBD', 'FDA', 'FDB', 'FDE', 'HA', 'J', 'JA', 'JB'];
  console.log(`Replacing ${groupsToReplace.length} groups with consolidated versions`);

  const escapeString = (s: string): string => {
    return s.replace(/'/g, "''");
  };

  let sql = `BEGIN;

-- RPS Parts Replacement - Clean consolidated data
-- Deletes old items and inserts consolidated versions for: ${groupsToReplace.join(', ')}
-- Plus inserts new groups: DEA, DEB, KA, KB, KBA, KBB

-- Delete old items from groups being replaced
DELETE FROM rps_parts WHERE group_code IN (${groupsToReplace.map(g => `'${g}'`).join(', ')});

-- Insert all consolidated items (373 total)
INSERT INTO rps_parts (group_code, item_number, description, nsn, rps_number, quantity, repair_grade, metadata) VALUES
`;

  const valueLines: string[] = [];
  let totalItems = 0;
  let newItems = 0;
  let replacedItems = 0;

  for (const groupCode in consolidatedData.groups) {
    const group = consolidatedData.groups[groupCode];
    const isReplacing = groupsToReplace.includes(groupCode);

    if (isReplacing) {
      replacedItems += group.items.length;
    } else {
      newItems += group.items.length;
    }

    for (const item of group.items) {
      totalItems++;

      // Parse quantity
      let quantity = 1;
      if (item.quantity_per_assembly && item.quantity_per_assembly.trim()) {
        const qtyNum = parseInt(item.quantity_per_assembly.trim().split(/[\s-]/)[0]);
        quantity = isNaN(qtyNum) ? 1 : qtyNum;
      }

      // Handle repair_grade - only L, M, H are valid
      let gradeChar = '';
      let originalGrade = '';
      if (item.repair_grade && item.repair_grade.trim()) {
        originalGrade = item.repair_grade.trim();
        const firstChar = originalGrade.charAt(0).toUpperCase();
        if (['L', 'M', 'H'].includes(firstChar)) {
          gradeChar = firstChar;
        }
      }

      // Handle NSN - truncate to 25 chars if needed
      let nsnValue = escapeString(item.nsn);
      let nsnDisplay = nsnValue;
      if (nsnValue.length > 25) {
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
      if (nsnValue.length > 25) {
        metadata.nsn_full = nsnValue;
      }
      if (originalGrade && originalGrade !== gradeChar) {
        metadata.repair_grade_original = originalGrade;
      }

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

  // Write to file
  const outputPath = path.join(__dirname, '..', '..', 'docs', 'rps-complete-replacement.sql');
  fs.writeFileSync(outputPath, sql, 'utf-8');

  console.log(`\n✓ Complete replacement SQL generated: ${outputPath}`);
  console.log(`✓ Total items to INSERT: ${totalItems}`);
  console.log(`  - New groups (DEA, DEB, KA, KB, KBA, KBB): ${newItems} items`);
  console.log(`  - Replaced groups (${groupsToReplace.join(', ')}): ${replacedItems} items`);
  console.log(`✓ File size: ${(sql.length / 1024).toFixed(1)} KB`);
  console.log(`\nNote: This SQL will DELETE old items from ${groupsToReplace.length} groups first, then INSERT consolidated versions`);
}

generateCompleteSql().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
