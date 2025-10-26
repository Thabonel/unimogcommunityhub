import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://ydevatqwkoccxhtejdor.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

interface RpsEntry {
  id: string;
  page_number: number;
  section_title: string;
  content: string;
  page_image_url: string | null;
  metadata: any;
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

console.log('=== RPS Cleanup and Synchronization ===\n');

async function step1_exportDatabase(): Promise<RpsEntry[]> {
  console.log('Step 1: Exporting database entries...');

  let allEntries: RpsEntry[] = [];
  let page = 0;
  const pageSize = 100;
  let hasMore = true;

  while (hasMore) {
    const { data, error } = await supabase
      .from('manual_chunks')
      .select('id, page_number, section_title, content, page_image_url, metadata, rps_group_code, rps_group_name')
      .or('manual_title.ilike.%RPS%,manual_title.ilike.%02155%')
      .range(page * pageSize, (page + 1) * pageSize - 1)
      .order('page_number', { ascending: true });

    if (error) {
      console.error('Database query error:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      hasMore = false;
    } else {
      allEntries = allEntries.concat(data as RpsEntry[]);
      page++;
      console.log(`  Fetched page ${page}: ${data.length} entries (total: ${allEntries.length})`);
    }
  }

  console.log(`✓ Exported ${allEntries.length} database entries\n`);

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'rps-database-export.json'),
    JSON.stringify(allEntries, null, 2)
  );

  return allEntries;
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
): Promise<MatchResult[]> {
  console.log('Step 3: Matching database entries to local files...');

  const pageNumberToFile = new Map<number, LocalFile>();
  localFiles.forEach(file => {
    pageNumberToFile.set(file.originalPageNumber, file);
  });

  const seenPageNumbers = new Set<number>();
  const matches: MatchResult[] = [];

  for (const entry of dbEntries) {
    const isDuplicate = seenPageNumbers.has(entry.page_number);
    seenPageNumbers.add(entry.page_number);

    const localFile = pageNumberToFile.get(entry.page_number) || null;

    matches.push({
      dbEntry: entry,
      localFile,
      isDuplicate,
      newPageNumber: null
    });
  }

  const uniqueMatches = matches.filter(m => !m.isDuplicate);
  const duplicates = matches.filter(m => m.isDuplicate);

  console.log(`  Total database entries: ${dbEntries.length}`);
  console.log(`  Unique entries: ${uniqueMatches.length}`);
  console.log(`  Duplicate entries: ${duplicates.length}`);
  console.log(`  Entries with matching local file: ${matches.filter(m => m.localFile !== null).length}`);
  console.log(`  Entries without local file: ${matches.filter(m => m.localFile === null).length}\n`);

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'rps-match-results.json'),
    JSON.stringify({ uniqueMatches, duplicates }, null, 2)
  );

  return matches;
}

async function step4_createRenumberingMap(matches: MatchResult[]): Promise<MatchResult[]> {
  console.log('Step 4: Creating renumbering map...');

  const uniqueMatches = matches.filter(m => !m.isDuplicate && m.localFile !== null);

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

async function step6_generateSQL(renumberedMatches: MatchResult[]): Promise<void> {
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

  const allMatches = await step3_matchAndDeduplicate(
    JSON.parse(fs.readFileSync(path.join(OUTPUT_DIR, 'rps-database-export.json'), 'utf-8')),
    JSON.parse(fs.readFileSync(path.join(OUTPUT_DIR, 'rps-local-files.json'), 'utf-8'))
  );

  const duplicates = allMatches.filter(m => m.isDuplicate);
  for (const dup of duplicates) {
    deleteStatements.push(
      `DELETE FROM manual_chunks WHERE id = '${dup.dbEntry.id}';`
    );
  }

  const updateSQL = `-- RPS Database Update Script
-- Updates page numbers and image URLs for ${renumberedMatches.length} entries

BEGIN;

${updateStatements.join('\n')}

COMMIT;
`;

  const deleteSQL = `-- RPS Duplicate Deletion Script
-- Deletes ${duplicates.length} duplicate entries

BEGIN;

${deleteStatements.join('\n')}

COMMIT;
`;

  fs.writeFileSync(path.join(OUTPUT_DIR, 'rps-update-database.sql'), updateSQL);
  fs.writeFileSync(path.join(OUTPUT_DIR, 'rps-delete-duplicates.sql'), deleteSQL);

  console.log(`✓ Generated SQL scripts:`);
  console.log(`  - rps-update-database.sql (${updateStatements.length} UPDATEs)`);
  console.log(`  - rps-delete-duplicates.sql (${deleteStatements.length} DELETEs)\n`);
}

async function step7_generateUploadScript(renumberedMatches: MatchResult[]): Promise<void> {
  console.log('Step 7: Generating upload script...');

  const uploadScript = `#!/bin/bash
# RPS Storage Upload Script
# Uploads ${renumberedMatches.length} renumbered PNG files to Supabase storage

SUPABASE_URL="${SUPABASE_URL}"
SUPABASE_SERVICE_KEY="$SUPABASE_SERVICE_ROLE_KEY"

if [ -z "$SUPABASE_SERVICE_KEY" ]; then
  echo "Error: SUPABASE_SERVICE_ROLE_KEY environment variable is required"
  exit 1
fi

echo "=== RPS Storage Upload ==="
echo ""

# First, delete all old RPS files from storage
echo "Step 1: Deleting old RPS files from storage..."
# NOTE: You'll need to do this manually via Supabase dashboard or API
# Storage bucket: manuals
# Folder: rps/
echo ""

# Upload renumbered files
echo "Step 2: Uploading ${renumberedMatches.length} renumbered files..."
cd ${RENUMBERED_DIR}

COUNT=0
for file in rps_page_*.png; do
  COUNT=$((COUNT + 1))

  curl -X POST \\
    "$SUPABASE_URL/storage/v1/object/manuals/rps/$file" \\
    -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \\
    -H "Content-Type: image/png" \\
    --data-binary "@$file"

  if [ $((COUNT % 10)) -eq 0 ]; then
    echo "Uploaded $COUNT/${renumberedMatches.length} files..."
  fi
done

echo ""
echo "✓ Upload complete: $COUNT files"
`;

  fs.writeFileSync(path.join(OUTPUT_DIR, 'rps-upload-to-storage.sh'), uploadScript);
  fs.chmodSync(path.join(OUTPUT_DIR, 'rps-upload-to-storage.sh'), 0o755);

  console.log(`✓ Generated upload script: rps-upload-to-storage.sh\n`);
}

async function generateSummary(renumberedMatches: MatchResult[]): Promise<void> {
  console.log('=== Summary ===\n');

  const summary = {
    timestamp: new Date().toISOString(),
    database: {
      totalEntries: JSON.parse(fs.readFileSync(path.join(OUTPUT_DIR, 'rps-database-export.json'), 'utf-8')).length,
      uniqueEntries: renumberedMatches.length,
      duplicates: JSON.parse(fs.readFileSync(path.join(OUTPUT_DIR, 'rps-database-export.json'), 'utf-8')).length - renumberedMatches.length
    },
    localFiles: {
      total: JSON.parse(fs.readFileSync(path.join(OUTPUT_DIR, 'rps-local-files.json'), 'utf-8')).length,
      matched: renumberedMatches.length
    },
    renumbering: {
      newRange: `1-${renumberedMatches.length}`,
      renumberedFilesLocation: RENUMBERED_DIR
    },
    nextSteps: [
      '1. Review generated files in scripts/rps/',
      '2. Execute rps-delete-duplicates.sql in Supabase SQL editor',
      '3. Execute rps-update-database.sql in Supabase SQL editor',
      '4. Delete old RPS files from Supabase storage (manuals/rps/ folder)',
      '5. Run rps-upload-to-storage.sh to upload renumbered files',
      '6. Verify Barry can load pages correctly'
    ]
  };

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'rps-cleanup-summary.json'),
    JSON.stringify(summary, null, 2)
  );

  console.log('Files Generated:');
  console.log('  - rps-database-export.json (database entries)');
  console.log('  - rps-local-files.json (local PNG files)');
  console.log('  - rps-match-results.json (matching analysis)');
  console.log('  - rps-renumbering-map.json (old → new mapping)');
  console.log('  - rps-update-database.sql (UPDATE statements)');
  console.log('  - rps-delete-duplicates.sql (DELETE statements)');
  console.log('  - rps-upload-to-storage.sh (upload script)');
  console.log('  - rps-cleanup-summary.json (this summary)');
  console.log('');
  console.log('Next Steps:');
  summary.nextSteps.forEach((step, i) => {
    console.log(`  ${step}`);
  });
}

async function main() {
  try {
    const dbEntries = await step1_exportDatabase();
    const localFiles = await step2_listLocalFiles();
    const matches = await step3_matchAndDeduplicate(dbEntries, localFiles);
    const renumberedMatches = await step4_createRenumberingMap(matches);
    await step5_renumberLocalFiles(renumberedMatches);
    await step6_generateSQL(renumberedMatches);
    await step7_generateUploadScript(renumberedMatches);
    await generateSummary(renumberedMatches);

    console.log('\n✓ RPS cleanup and synchronization complete!');
  } catch (error) {
    console.error('\n✗ Error:', error);
    process.exit(1);
  }
}

main();
