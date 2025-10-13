/**
 * Bulk upload WIS documentation files to Supabase Storage
 *
 * Usage:
 *   1. Place your WIS files in a local directory like:
 *      /path/to/wis-files/
 *        ├── U435/
 *        │   ├── procedures/
 *        │   │   ├── oil_change.html
 *        │   │   └── brake_service.html
 *        │   ├── bulletins/
 *        │   │   └── tsb_2020_001.html
 *        │   └── parts/
 *        │       └── parts_list.json
 *        ├── U400/
 *        │   └── procedures/
 *        │       └── transmission.html
 *        └── ...
 *
 *   2. Run: npx tsx scripts/upload-wis-docs.ts /path/to/wis-files
 *
 * This will upload all files to wis-docs bucket with the structure:
 *   model/U435/procedures/oil_change.html
 *   model/U435/bulletins/tsb_2020_001.html
 *   model/U400/procedures/transmission.html
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing environment variables:');
  console.error('   VITE_SUPABASE_URL');
  console.error('   SUPABASE_SERVICE_ROLE_KEY (not VITE_SUPABASE_ANON_KEY!)');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

interface UploadResult {
  success: number;
  failed: number;
  skipped: number;
  errors: string[];
}

async function uploadDirectory(localDir: string): Promise<UploadResult> {
  const result: UploadResult = {
    success: 0,
    failed: 0,
    skipped: 0,
    errors: []
  };

  if (!fs.existsSync(localDir)) {
    console.error(`❌ Directory not found: ${localDir}`);
    process.exit(1);
  }

  console.log(`📂 Scanning directory: ${localDir}\n`);

  // Recursively find all files
  const files = getAllFiles(localDir);
  console.log(`📄 Found ${files.length} files to upload\n`);

  for (const localPath of files) {
    // Get relative path from base directory
    const relativePath = path.relative(localDir, localPath);

    // Convert to storage path: U435/procedures/file.html -> model/U435/procedures/file.html
    const storagePath = `model/${relativePath.replace(/\\/g, '/')}`;

    // Check if file already exists
    const { data: existingFile } = await supabase.storage
      .from('wis-docs')
      .list(path.dirname(storagePath), {
        search: path.basename(storagePath)
      });

    if (existingFile && existingFile.length > 0) {
      console.log(`⏭️  Skipping (already exists): ${storagePath}`);
      result.skipped++;
      continue;
    }

    // Read file content
    const fileContent = fs.readFileSync(localPath);

    // Determine content type
    const contentType = getContentType(localPath);

    // Upload to Supabase Storage
    console.log(`⬆️  Uploading: ${storagePath}`);
    const { data, error } = await supabase.storage
      .from('wis-docs')
      .upload(storagePath, fileContent, {
        contentType,
        upsert: false
      });

    if (error) {
      console.error(`❌ Failed: ${storagePath}`);
      console.error(`   ${error.message}`);
      result.failed++;
      result.errors.push(`${storagePath}: ${error.message}`);
    } else {
      console.log(`✅ Uploaded: ${storagePath}`);
      result.success++;
    }
  }

  return result;
}

function getAllFiles(dir: string): string[] {
  const files: string[] = [];

  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...getAllFiles(fullPath));
    } else {
      // Only include HTML and JSON files
      if (fullPath.endsWith('.html') || fullPath.endsWith('.json')) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

function getContentType(filePath: string): string {
  if (filePath.endsWith('.html')) {
    return 'text/html';
  } else if (filePath.endsWith('.json')) {
    return 'application/json';
  } else {
    return 'application/octet-stream';
  }
}

// Main execution
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Usage: npx tsx scripts/upload-wis-docs.ts <local-directory>');
  console.log('');
  console.log('Example:');
  console.log('  npx tsx scripts/upload-wis-docs.ts /Volumes/UnimogManuals/WIS-Prepared');
  console.log('');
  console.log('Expected directory structure:');
  console.log('  /Volumes/UnimogManuals/WIS-Prepared/');
  console.log('    ├── U435/');
  console.log('    │   ├── procedures/');
  console.log('    │   │   ├── oil_change.html');
  console.log('    │   │   └── brake_service.html');
  console.log('    │   ├── bulletins/');
  console.log('    │   │   └── tsb_2020_001.html');
  console.log('    │   └── parts/');
  console.log('    │       └── parts_list.json');
  console.log('    └── U400/');
  console.log('        └── procedures/');
  console.log('            └── transmission.html');
  process.exit(0);
}

const localDirectory = args[0];

console.log('╔══════════════════════════════════════════════════╗');
console.log('║   WIS Documentation Bulk Upload Utility          ║');
console.log('╚══════════════════════════════════════════════════╝\n');

uploadDirectory(localDirectory)
  .then((result) => {
    console.log('\n╔══════════════════════════════════════════════════╗');
    console.log('║   Upload Complete                                ║');
    console.log('╚══════════════════════════════════════════════════╝\n');
    console.log(`✅ Successfully uploaded: ${result.success}`);
    console.log(`⏭️  Skipped (already exist): ${result.skipped}`);
    console.log(`❌ Failed: ${result.failed}`);

    if (result.errors.length > 0) {
      console.log('\nErrors:');
      result.errors.forEach(err => console.log(`  - ${err}`));
    }

    console.log('\n📋 Next steps:');
    console.log('  1. Go to Admin → WIS Data Population');
    console.log('  2. Click "Populate Procedures" to process the uploaded files');
    console.log('  3. ETL processor will scan and import all procedures');
  })
  .catch((error) => {
    console.error('\n❌ Upload failed:', error);
    process.exit(1);
  });
