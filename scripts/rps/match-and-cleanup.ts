import * as fs from 'fs';
import * as path from 'path';

// This script will be run by Claude after database export is complete
// It reads each PNG, extracts the title, matches to database, generates SQL

interface DbEntry {
  id: string;
  page_number: number;
  section_title: string;
  page_image_url: string | null;
}

const PNG_DIR = path.join(process.cwd(), 'scripts/rps/output/ai_illustrations');
const OUTPUT_DIR = path.join(process.cwd(), 'scripts/rps');
const DB_EXPORT_FILE = path.join(OUTPUT_DIR, 'rps-database-export.json');

console.log('=== RPS Match and Cleanup ===\n');

// Step 1: Load database export
console.log('Step 1: Loading database export...');
if (!fs.existsSync(DB_EXPORT_FILE)) {
  console.error(`❌ Database export not found: ${DB_EXPORT_FILE}`);
  console.error('Claude needs to export the database first via Supabase MCP');
  process.exit(1);
}

const dbEntries: DbEntry[] = JSON.parse(fs.readFileSync(DB_EXPORT_FILE, 'utf-8'));
console.log(`✓ Loaded ${dbEntries.length} database entries\n`);

// Step 2: List local PNG files
console.log('Step 2: Listing local PNG files...');
const pngFiles = fs.readdirSync(PNG_DIR)
  .filter(f => f.endsWith('.png'))
  .sort()
  .map(filename => {
    const match = filename.match(/rps_page_(\d+)\.png/);
    const pageNum = match ? parseInt(match[1], 10) : 0;
    return {
      filename,
      fullPath: path.join(PNG_DIR, filename),
      pageNumber: pageNum
    };
  });

console.log(`✓ Found ${pngFiles.length} local PNG files\n`);

// Step 3: Claude will process each PNG file
console.log('Step 3: Processing PNG files...');
console.log('Claude will now read each PNG and extract the title.');
console.log('This process requires Claude to view the images.\n');

console.log('To continue, Claude needs to:');
console.log('1. Read each PNG file');
console.log('2. Extract title (bottom for exploded view, top for parts list)');
console.log('3. Match title to database entry');
console.log('4. Generate UPDATE SQL if page number differs');
console.log('5. Generate DELETE SQL for duplicate entries with same title\n');

console.log('Processing first file as example:');
console.log(`File: ${pngFiles[0].filename} (page ${pngFiles[0].pageNumber})`);
console.log('Claude will read this file next...\n');

// Create placeholder for results
const results = {
  total_files: pngFiles.length,
  files: pngFiles,
  instructions: {
    step1: 'Claude reads PNG and extracts title',
    step2: 'Find title in database entries',
    step3: 'If page_number != PNG page number: add to UPDATE list',
    step4: 'If multiple entries have same title: add duplicates to DELETE list',
    step5: 'Continue for all 627 files'
  }
};

fs.writeFileSync(
  path.join(OUTPUT_DIR, 'matching-in-progress.json'),
  JSON.stringify(results, null, 2)
);

console.log('Next: Claude will start reading PNG files to extract titles...');
