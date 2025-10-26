import * as fs from 'fs';
import * as path from 'path';

// Load NIIN index data
const niinDataPath = path.join(process.cwd(), 'scripts/rps/niin-index-extracted.json');
const niinData = JSON.parse(fs.readFileSync(niinDataPath, 'utf-8'));

// Load batch metadata
const batchPath = path.join(process.cwd(), 'scripts/rps/batch-001.json');
const batchData = JSON.parse(fs.readFileSync(batchPath, 'utf-8'));

console.log('=== NIIN Index to PNG Page Verification ===\n');

// Extract all unique group codes from NIIN data
const uniqueGroupCodes = new Set<string>();
niinData.forEach((entry: any) => {
  uniqueGroupCodes.add(entry.group_code);
});

console.log(`Total unique group codes in NIIN index: ${uniqueGroupCodes.size}`);
console.log(`Total NIIN entries: ${niinData.length}\n`);

// NIIN index is from pages 19-28 (pages 0019-0028 in our naming)
const niinPages = Array.from({ length: 10 }, (_, i) => `page_${String(19 + i).padStart(4, '0')}`);

console.log('NIIN Index Pages (in batch-001.json):');
niinPages.forEach(pageKey => {
  if (batchData.pages[pageKey]) {
    const page = batchData.pages[pageKey];
    console.log(`  ${pageKey}: ${page.original_filename} - ${page.type}`);
  } else {
    console.log(`  ${pageKey}: MISSING in batch-001.json`);
  }
});

console.log(`\n=== Group Code Distribution ===\n`);

// Count entries per group code
const groupCodeCounts: Record<string, number> = {};
niinData.forEach((entry: any) => {
  if (!groupCodeCounts[entry.group_code]) {
    groupCodeCounts[entry.group_code] = 0;
  }
  groupCodeCounts[entry.group_code]++;
});

// Sort by count descending
const sortedGroupCodes = Object.entries(groupCodeCounts)
  .sort(([, a], [, b]) => b - a)
  .slice(0, 20);

console.log('Top 20 group codes by NIIN entry count:');
sortedGroupCodes.forEach(([code, count]) => {
  console.log(`  ${code.padEnd(5)}: ${count} entries`);
});

console.log(`\n=== Sample Group Code Examples ===\n`);

// Show sample entries for a few group codes
const sampleGroupCodes = ['MBA', 'MCF', 'MCA', 'ABA'];
sampleGroupCodes.forEach(groupCode => {
  const entries = niinData.filter((e: any) => e.group_code === groupCode).slice(0, 3);
  console.log(`Group ${groupCode}:`);
  entries.forEach((e: any) => {
    console.log(`  Item ${e.group_ident_no}: NIIN ${e.niin}`);
  });
  console.log();
});

console.log('=== Next Steps ===\n');
console.log('1. The NIIN index covers pages 19-28 (administrative index)');
console.log('2. Group codes like MBA, MCF, ABA refer to PARTS GROUPS (not pages)');
console.log('3. We need to find where the ACTUAL parts group pages are located');
console.log('4. Parts group pages will have diagrams + parts lists');
console.log('5. Example: Group "MBA" will have multiple pages showing parts breakdown\n');

console.log('Recommendation:');
console.log('- Continue processing remaining 607 PNG files (batches 2-13)');
console.log('- Look for pages with group codes MBA, MCF, ABA, etc. in their content');
console.log('- Match group code pages to NIIN entries for complete mapping');
