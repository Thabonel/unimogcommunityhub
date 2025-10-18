/**
 * Check for missing RPS illustration files in Supabase Storage
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SUPABASE_URL = 'https://ydevatqwkoccxhtejdor.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('SUPABASE_SERVICE_ROLE_KEY environment variable not set');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const BUCKET_NAME = 'rps_illustrations';
const STORAGE_PATH = 'rps_illustrations';
const SOURCE_DIR = path.join(__dirname, 'output', 'ai_illustrations');

async function checkMissingFiles() {
  console.log('Checking for missing RPS illustration files...\n');

  // Get local files
  const localFiles = fs.readdirSync(SOURCE_DIR)
    .filter(f => f.endsWith('.png'))
    .sort();

  console.log(`Local files: ${localFiles.length}`);

  // Get storage files
  const { data: storageFiles, error } = await supabase.storage
    .from(BUCKET_NAME)
    .list(STORAGE_PATH);

  if (error) {
    console.error('Error listing storage files:', error.message);
    process.exit(1);
  }

  console.log(`Storage files: ${storageFiles?.length || 0}\n`);

  // Create set of storage filenames
  const storageFileNames = new Set(storageFiles?.map(f => f.name) || []);

  // Find missing files
  const missingFiles = localFiles.filter(f => !storageFileNames.has(f));

  if (missingFiles.length === 0) {
    console.log('All files uploaded successfully!');
    console.log(`Total: ${localFiles.length} files`);
  } else {
    console.log(`Missing ${missingFiles.length} files:\n`);
    missingFiles.forEach(file => {
      console.log(`  - ${file}`);
    });
    console.log(`\nFiles to upload: ${missingFiles.join(', ')}`);

    // Create list file
    const listPath = path.join(__dirname, 'missing-files.txt');
    fs.writeFileSync(listPath, missingFiles.join('\n'));
    console.log(`\nMissing files list saved to: ${listPath}`);
  }

  // Show statistics
  console.log('\nStatistics:');
  console.log(`  Local files: ${localFiles.length}`);
  console.log(`  Storage files: ${storageFiles?.length || 0}`);
  console.log(`  Missing: ${missingFiles.length}`);
  console.log(`  Upload percentage: ${((storageFiles?.length || 0) / localFiles.length * 100).toFixed(1)}%`);
}

checkMissingFiles();
