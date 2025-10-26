import * as fs from 'fs';
import * as path from 'path';

interface RpsEntry {
  id: string;
  page_number: number;
  section_title: string;
  page_image_url: string | null;
  rps_group_code: string | null;
  rps_group_name: string | null;
}

interface LocalFile {
  filename: string;
  fullPath: string;
  originalPageNumber: number;
}

interface MatchResult {
  dbEntry: RpsEntry;
  localFile: LocalFile | null;
  isDuplicate: boolean;
  newPageNumber: number | null;
}

const OUTPUT_DIR = path.join(process.cwd(), 'scripts/rps');
const PNG_DIR = path.join(process.cwd(), 'scripts/rps/output/ai_illustrations');
const RENUMBERED_DIR = path.join(process.cwd(), 'scripts/rps/output/ai_illustrations_renumbered');

console.log('=== RPS Cleanup and Synchronization (MCP Version) ===\n');
console.log('This script analyzes local files and generates SQL for Claude to execute via MCP.\n');

async function step1_analyzeDatabaseExport(): Promise<RpsEntry[]> {
  console.log('Step 1: Reading pre-exported database data...');
  console.log('(Claude will export this via MCP first)\n');

  const exportPath = path.join(OUTPUT_DIR, 'rps-database-export.json');

  if (!fs.existsSync(exportPath)) {
    console.log('❌ Database export not found!');
    console.log('Claude needs to run this SQL query first:');
    console.log(`
SELECT
  id::text,
  page_number,
  section_title,
  page_image_url,
  rps_group_code,
  rps_group_name
FROM manual_chunks
WHERE manual_title LIKE '%RPS%' OR manual_title LIKE '%02155%'
ORDER BY page_number ASC;
`);
    console.log('\nSave results to: scripts/rps/rps-database-export.json');
    process.exit(1);
  }

  const dbEntries: RpsEntry[] = JSON.parse(fs.readFileSync(exportPath, 'utf-8'));
  console.log(`✓ Loaded ${dbEntries.length} database entries\n`);

  return dbEntries;
}

async function step2_listLocalFiles(): Promise<LocalFile[]> {
  console.log('Step 2: Listing local PNG files...');

  if (!fs.existsSync(PNG_DIR)) {
    throw new Error(`PNG directory not found: ${PNG_DIR}`);
  }

  const files = fs.readdirSync(PNG_DIR)
    .filter(f => f.endsWith('.png'))
    .sort();

  const localFiles: LocalFile[] = files.map(filename => {
    const match = filename.match(/rps_page_(\d+)\.png/);
    const originalPageNumber = match ? parseInt(match[1], 10) : 0;

    return {
      filename,
      fullPath: path.join(PNG_DIR, filename),
      originalPageNumber
    };
  });

  console.log(`✓ Found ${localFiles.length} local PNG files\n`);

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'rps-local-files.json'),
    JSON.stringify(localFiles, null, 2)
  );

  return localFiles;
}

async function step3_matchAndDeduplicate(
  dbEntries: RpsEntry[],
  localFiles: LocalFile[]
): Promise<{ unique: MatchResult[], duplicates: MatchResult[] }> {
  console.log('Step 3: Matching database entries to local files...');

  const pageNumberToFile = new Map<number, LocalFile>();
  localFiles.forEach(file => {
    pageNumberToFile.set(file.originalPageNumber, file);
  });

  const seenPageNumbers = new Set<number>();
  const allMatches: MatchResult[] = [];

  for (const entry of dbEntries) {
    const isDuplicate = seenPageNumbers.has(entry.page_number);
    seenPageNumbers.add(entry.page_number);

    const localFile = pageNumberToFile.get(entry.page_number) || null;

    allMatches.push({
      dbEntry: entry,
      localFile,
      isDuplicate,
      newPageNumber: null
    });
  }

  const unique = allMatches.filter(m => !m.isDuplicate && m.localFile !== null);
  const duplicates = allMatches.filter(m => m.isDuplicate);
  const noFileMatch = allMatches.filter(m => !m.isDuplicate && m.localFile === null);

  console.log(`  Total database entries: ${dbEntries.length}`);
  console.log(`  Unique entries with files: ${unique.length}`);
  console.log(`  Duplicate entries to delete: ${duplicates.length}`);
  console.log(`  Entries without local file: ${noFileMatch.length}\n`);

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'rps-match-analysis.json'),
    JSON.stringify({ unique, duplicates, noFileMatch }, null, 2)
  );

  return { unique, duplicates };
}

async function step4_createRenumberingMap(uniqueMatches: MatchResult[]): Promise<MatchResult[]> {
  console.log('Step 4: Creating renumbering map...');

  uniqueMatches.forEach((match, index) => {
    match.newPageNumber = index + 1;
  });

  console.log(`✓ Created renumbering map for ${uniqueMatches.length} entries (1-${uniqueMatches.length})\n`);

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'rps-renumbering-map.json'),
    JSON.stringify(uniqueMatches, null, 2)
  );

  return uniqueMatches;
}

async function step5_renumberLocalFiles(renumberedMatches: MatchResult[]): Promise<void> {
  console.log('Step 5: Renumbering local PNG files...');

  if (!fs.existsSync(RENUMBERED_DIR)) {
    fs.mkdirSync(RENUMBERED_DIR, { recursive: true });
  }

  let copiedCount = 0;

  for (const match of renumberedMatches) {
    if (!match.localFile || match.newPageNumber === null) continue;

    const newFilename = `rps_page_${String(match.newPageNumber).padStart(4, '0')}.png`;
    const sourcePath = match.localFile.fullPath;
    const destPath = path.join(RENUMBERED_DIR, newFilename);

    fs.copyFileSync(sourcePath, destPath);
    copiedCount++;

    if (copiedCount % 50 === 0) {
      console.log(`  Copied ${copiedCount}/${renumberedMatches.length} files...`);
    }
  }

  console.log(`✓ Renumbered ${copiedCount} PNG files to: ${RENUMBERED_DIR}\n`);
}

async function step6_generateSQL(
  renumberedMatches: MatchResult[],
  duplicates: MatchResult[]
): Promise<void> {
  console.log('Step 6: Generating SQL update scripts...');

  const updateStatements: string[] = [];
  const deleteStatements: string[] = [];

  for (const match of renumberedMatches) {
    if (match.newPageNumber === null) continue;

    const newFilename = `rps_page_${String(match.newPageNumber).padStart(4, '0')}.png`;
    const newImageUrl = `https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/manuals/rps/${newFilename}`;

    updateStatements.push(
      `UPDATE manual_chunks SET page_number = ${match.newPageNumber}, page_image_url = '${newImageUrl}' WHERE id = '${match.dbEntry.id}';`
    );
  }

  for (const dup of duplicates) {
    deleteStatements.push(
      `DELETE FROM manual_chunks WHERE id = '${dup.dbEntry.id}';`
    );
  }

  const deleteSQL = `-- RPS Duplicate Deletion Script
-- Deletes ${duplicates.length} duplicate entries

BEGIN;

${deleteStatements.join('\n')}

COMMIT;
`;

  const updateSQL = `-- RPS Database Update Script
-- Updates page numbers and image URLs for ${renumberedMatches.length} entries

BEGIN;

${updateStatements.join('\n')}

COMMIT;
`;

  fs.writeFileSync(path.join(OUTPUT_DIR, 'rps-delete-duplicates.sql'), deleteSQL);
  fs.writeFileSync(path.join(OUTPUT_DIR, 'rps-update-database.sql'), updateSQL);

  console.log(`✓ Generated SQL scripts:`);
  console.log(`  - rps-delete-duplicates.sql (${deleteStatements.length} DELETEs)`);
  console.log(`  - rps-update-database.sql (${updateStatements.length} UPDATEs)\n`);
}

async function generateSummary(
  renumberedMatches: MatchResult[],
  duplicates: MatchResult[]
): Promise<void> {
  console.log('=== Summary ===\n');

  const summary = {
    timestamp: new Date().toISOString(),
    results: {
      uniqueEntries: renumberedMatches.length,
      duplicatesRemoved: duplicates.length,
      newPageRange: `1-${renumberedMatches.length}`,
      renumberedFilesLocation: RENUMBERED_DIR
    },
    filesGenerated: [
      'rps-local-files.json - List of all 627 local PNG files',
      'rps-match-analysis.json - Matching results and duplicates',
      'rps-renumbering-map.json - Old page → new page mapping',
      'rps-delete-duplicates.sql - SQL to delete duplicate entries',
      'rps-update-database.sql - SQL to update page numbers and URLs',
      'rps-cleanup-summary.json - This summary'
    ],
    nextSteps: [
      '1. Review generated SQL files',
      '2. Execute rps-delete-duplicates.sql via Supabase MCP',
      '3. Execute rps-update-database.sql via Supabase MCP',
      '4. Delete old RPS files from Supabase storage (manuals/rps/ folder)',
      '5. Upload renumbered files from: ' + RENUMBERED_DIR,
      '6. Verify Barry can load pages correctly'
    ]
  };

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'rps-cleanup-summary.json'),
    JSON.stringify(summary, null, 2)
  );

  console.log('Files Generated:');
  summary.filesGenerated.forEach(file => console.log(`  - ${file}`));
  console.log('');
  console.log('Next Steps:');
  summary.nextSteps.forEach(step => console.log(`  ${step}`));
}

async function main() {
  try {
    const dbEntries = await step1_analyzeDatabaseExport();
    const localFiles = await step2_listLocalFiles();
    const { unique, duplicates } = await step3_matchAndDeduplicate(dbEntries, localFiles);
    const renumberedMatches = await step4_createRenumberingMap(unique);
    await step5_renumberLocalFiles(renumberedMatches);
    await step6_generateSQL(renumberedMatches, duplicates);
    await generateSummary(renumberedMatches, duplicates);

    console.log('\n✓ RPS cleanup and synchronization complete!');
    console.log('\nNext: Claude will execute the SQL files via MCP\n');
  } catch (error) {
    console.error('\n✗ Error:', error);
    process.exit(1);
  }
}

main();
