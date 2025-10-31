import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

interface RPSPart {
  item_number: string;
  designation: string;
  nsn: string | null;
  niin: string | null;
  manufacturer_code: string;
  manufacturer_part_no: string;
  supplier_code: string;
  supplier_part_no: string;
  quantity: string;
  unit_of_issue: string;
  essential: string;
  grade_of_repair: string;
  notes: string;
}

interface RPSPage {
  page_number: number;
  rps_page_number: number;
  extraction_date: string;
  page_type: string;
  is_parts_list: boolean;
  group_code: string;
  group_name: string;
  issue_number: number;
  rps_number: string;
  parts: RPSPart[];
  parts_extracted: number;
  parts_with_nsn: number;
  status: string;
  group_complete?: boolean;
}

// Pages to process (33-99, including newly extracted pages)
const pages = [33, 34, 35, 36, 37, 38, 41, 45, 47, 49, 51, 53, 55, 57, 59, 61, 63, 65, 67, 69, 71, 73, 75, 77, 79, 81, 83, 85, 87, 89, 91, 93, 97, 99];

const docsDir = join(process.cwd(), 'docs');

// Escape single quotes for SQL
function escapeSql(str: string): string {
  return str.replace(/'/g, "''");
}

// Format NULL or string value for SQL
function sqlValue(value: string | null | undefined): string {
  if (value === null || value === undefined || value === '') {
    return 'NULL';
  }
  return `'${escapeSql(value)}'`;
}

// Format integer or NULL for SQL
function sqlInt(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === '') {
    return 'NULL';
  }
  const num = typeof value === 'string' ? parseInt(value, 10) : value;
  return isNaN(num) ? 'NULL' : num.toString();
}

// Generate metadata JSONB
function generateMetadata(part: RPSPart, page: RPSPage): string {
  const metadata = {
    manufacturer_code: part.manufacturer_code,
    manufacturer_part_no: part.manufacturer_part_no,
    supplier_code: part.supplier_code,
    supplier_part_no: part.supplier_part_no,
    unit_of_issue: part.unit_of_issue,
    essential: part.essential,
    notes: part.notes,
    extraction_date: page.extraction_date,
    rps_page_number: page.rps_page_number,
    group_name: page.group_name
  };
  return `'${escapeSql(JSON.stringify(metadata))}'::jsonb`;
}

// Main script
console.log('Generating RPS import SQL...');

let sql = `-- Import RPS Parts from Pages 33-99
-- Generated: ${new Date().toISOString().split('T')[0]}
-- Extraction Range: Pages 33-99 (Groups A through ABC complete)

BEGIN;

-- Delete existing data for pages 33-99 if reimporting
DELETE FROM rps_parts WHERE page_number BETWEEN 33 AND 99;

`;

let totalParts = 0;
let totalWithNSN = 0;

for (const pageNum of pages) {
  const jsonPath = join(docsDir, `rps-extraction-page-${pageNum}.json`);

  try {
    const jsonData = readFileSync(jsonPath, 'utf-8');
    const page: RPSPage = JSON.parse(jsonData);

    if (!page.is_parts_list || !page.parts || page.parts.length === 0) {
      console.log(`Skipping page ${pageNum} (not a parts list or no parts)`);
      continue;
    }

    sql += `\n-- Group ${page.group_code}: ${page.group_name} (Page ${pageNum})\n`;

    for (const part of page.parts) {
      const niin = sqlValue(part.niin);
      const nsn = sqlValue(part.nsn);
      const groupCode = sqlValue(page.group_code);
      const itemNumber = sqlValue(part.item_number);
      const description = sqlValue(part.designation);
      const rpsNumber = sqlValue(page.rps_number);
      const quantity = sqlInt(part.quantity);
      const repairGrade = part.grade_of_repair ? sqlValue(part.grade_of_repair.charAt(0)) : 'NULL';
      const pageNumber = page.page_number;
      const metadata = generateMetadata(part, page);

      sql += `INSERT INTO rps_parts (niin, nsn, group_code, item_number, description, rps_number, quantity, repair_grade, page_number, metadata) VALUES\n`;
      sql += `(${niin}, ${nsn}, ${groupCode}, ${itemNumber}, ${description}, ${rpsNumber}, ${quantity}, ${repairGrade}, ${pageNumber}, ${metadata});\n`;

      totalParts++;
      if (part.niin) totalWithNSN++;
    }

    console.log(`Page ${pageNum}: ${page.parts.length} parts (${page.parts.filter(p => p.niin).length} with NSN)`);

  } catch (error) {
    console.error(`Error processing page ${pageNum}:`, error);
  }
}

sql += `\nCOMMIT;

-- Summary
-- Total Parts Imported: ${totalParts}
-- Parts with NSN: ${totalWithNSN} (${Math.round((totalWithNSN / totalParts) * 100)}%)
-- Pages Processed: ${pages.length}
`;

// Write SQL file
const outputPath = join(docsDir, 'import-rps-parts-33-99.sql');
writeFileSync(outputPath, sql, 'utf-8');

console.log(`\nSQL file generated: ${outputPath}`);
console.log(`Total parts: ${totalParts}`);
console.log(`Parts with NSN: ${totalWithNSN} (${Math.round((totalWithNSN / totalParts) * 100)}%)`);
