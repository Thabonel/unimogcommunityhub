import * as fs from 'fs';
import * as path from 'path';
import { callSonnet } from './anthropic-client';

interface NIINEntry {
  niin: string;
  group_code: string;
  group_ident_no: string;
}

const NIIN_INDEX_PAGES = [
  'rps_page_0019.png',
  'rps_page_0020.png',
  'rps_page_0021.png',
  'rps_page_0022.png',
  'rps_page_0023.png',
  'rps_page_0024.png',
  'rps_page_0025.png',
  'rps_page_0026.png',
  'rps_page_0027.png',
  'rps_page_0028.png'
];

async function extractNIINFromPage(imagePath: string): Promise<NIINEntry[]> {
  console.log(`\n📄 Processing: ${path.basename(imagePath)}`);

  const imageBuffer = fs.readFileSync(imagePath);
  const base64Image = imageBuffer.toString('base64');

  const prompt = `Extract ALL NIIN entries from this Repair Parts Scale NIIN Index page.

The page shows a 3-column table:
- Column 1: NIIN (99-999-9999)
- Column 2: GROUP IDENT NO (like QG, AB, EA, etc.)
- Column 3: Another NIIN
- (repeats across columns)

Return ONLY valid JSON array with this exact structure:
[
  {"niin": "12-156-4991", "group_code": "FDA", "group_ident_no": "019"},
  {"niin": "12-156-4520", "group_code": "ABC", "group_ident_no": "044"}
]

Rules:
- Extract EVERY row from ALL columns
- NIIN format: XX-XXX-XXXX (keep hyphens)
- Group code is 2-3 letters (QG, AB, EA, FDA, etc.)
- Group ident no is usually 3 digits (001, 019, 044)
- Skip header rows
- Skip footer/page number info
- Return ONLY the JSON array, no explanation`;

  try {
    const responseText = await callSonnet(prompt, imagePath);

    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error('❌ No JSON array found in response');
      return [];
    }

    const entries: NIINEntry[] = JSON.parse(jsonMatch[0]);
    console.log(`✅ Extracted ${entries.length} NIIN entries`);

    return entries;

  } catch (error) {
    console.error(`❌ Error processing ${imagePath}:`, error);
    return [];
  }
}

async function main() {
  console.log('🚀 Starting NIIN Index Extraction\n');
  console.log('=' .repeat(60));

  const illustrationsDir = path.join(process.cwd(), 'scripts/rps/output/ai_illustrations');
  const allEntries: NIINEntry[] = [];

  for (const filename of NIIN_INDEX_PAGES) {
    const imagePath = path.join(illustrationsDir, filename);

    if (!fs.existsSync(imagePath)) {
      console.error(`❌ File not found: ${filename}`);
      continue;
    }

    const entries = await extractNIINFromPage(imagePath);
    allEntries.push(...entries);

    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n' + '='.repeat(60));
  console.log(`\n📊 EXTRACTION COMPLETE`);
  console.log(`   Total entries extracted: ${allEntries.length}`);
  console.log(`   Unique NIINs: ${new Set(allEntries.map(e => e.niin)).size}`);
  console.log(`   Unique groups: ${new Set(allEntries.map(e => e.group_code)).size}`);

  const outputPath = path.join(process.cwd(), 'scripts/rps/niin-index-extracted.json');
  fs.writeFileSync(outputPath, JSON.stringify(allEntries, null, 2));
  console.log(`\n💾 Saved to: ${outputPath}`);

  const groupCounts: Record<string, number> = {};
  allEntries.forEach(entry => {
    groupCounts[entry.group_code] = (groupCounts[entry.group_code] || 0) + 1;
  });

  console.log(`\n📋 Top 10 groups by NIIN count:`);
  Object.entries(groupCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .forEach(([group, count]) => {
      console.log(`   ${group}: ${count} parts`);
    });

  const sampleSQL = `
-- Sample SQL to insert into rps_niin_index table:
INSERT INTO rps_niin_index (niin, group_code, group_ident_no)
VALUES
  ('${allEntries[0]?.niin}', '${allEntries[0]?.group_code}', '${allEntries[0]?.group_ident_no}'),
  ('${allEntries[1]?.niin}', '${allEntries[1]?.group_code}', '${allEntries[1]?.group_ident_no}');
`;

  console.log(`\n📝 Sample SQL preview:`);
  console.log(sampleSQL);

  console.log('\n✅ NIIN index extraction complete!');
  console.log('   Next: Create migration to populate rps_niin_index table\n');
}

main().catch(console.error);
