import * as fs from 'fs';
import * as path from 'path';

// Database export data from MCP queries (combined from all 8 batches)
// This will be populated by Claude with the actual data from the MCP responses

interface DbEntry {
  id: string;
  page_number: number;
  section_title: string;
  page_image_url: string | null;
  rps_group_code: string | null;
  rps_group_name: string | null;
}

// Placeholder - Claude will populate this with actual data from MCP queries
const databaseEntries: DbEntry[] = [];

console.log('=== RPS Database Export & Matching Preparation ===\n');
console.log(`Database entries to save: ${databaseEntries.length}`);
console.log('PNG files to process: 627\n');

// Save database export
const exportPath = path.join(process.cwd(), 'scripts/rps/rps-database-export.json');
fs.writeFileSync(exportPath, JSON.stringify(databaseEntries, null, 2));
console.log(`✓ Database export saved to: ${exportPath}\n`);

// List PNG files for matching
const PNG_DIR = path.join(process.cwd(), 'scripts/rps/output/ai_illustrations');
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

console.log(`✓ Found ${pngFiles.length} PNG files\n`);
console.log('First 10 files:');
pngFiles.slice(0, 10).forEach(f => {
  console.log(`  ${f.filename} (page ${f.pageNumber})`);
});

console.log('\n=== Ready for Claude to Start Reading PNG Files ===');
console.log('Next: Claude will read each PNG to extract title and match to database');
