/**
 * Upload RPS Illustrations to Supabase Storage
 *
 * Uploads all 930 RPS page illustrations to the rps_illustrations bucket
 *
 * Usage:
 *   export SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"
 *   npx tsx scripts/rps/upload-illustrations-to-storage.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://ydevatqwkoccxhtejdor.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('SUPABASE_SERVICE_ROLE_KEY environment variable not set');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const BUCKET_NAME = 'rps_illustrations';
const STORAGE_PATH = 'rps_illustrations'; // Folder within bucket
const SOURCE_DIR = path.join(__dirname, 'output', 'ai_illustrations');

interface UploadStats {
  total: number;
  uploaded: number;
  skipped: number;
  failed: number;
  errors: Array<{ file: string; error: string }>;
}

async function checkBucketExists(): Promise<boolean> {
  const { data: buckets, error } = await supabase.storage.listBuckets();

  if (error) {
    console.error('Failed to list buckets:', error.message);
    return false;
  }

  return buckets?.some(b => b.name === BUCKET_NAME) || false;
}

async function uploadFile(filePath: string, fileName: string): Promise<boolean> {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const storagePath = `${STORAGE_PATH}/${fileName}`;

    // Check if file already exists
    const { data: existing } = await supabase.storage
      .from(BUCKET_NAME)
      .list(STORAGE_PATH, {
        search: fileName
      });

    if (existing && existing.length > 0) {
      // File exists, update it
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .update(storagePath, fileBuffer, {
          contentType: 'image/png',
          upsert: true
        });

      if (error) {
        throw new Error(error.message);
      }

      return true;
    } else {
      // File doesn't exist, upload it
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(storagePath, fileBuffer, {
          contentType: 'image/png',
          upsert: false
        });

      if (error) {
        throw new Error(error.message);
      }

      return true;
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
}

async function uploadAllIllustrations(): Promise<UploadStats> {
  console.log('Starting RPS illustrations upload...');
  console.log(`Source directory: ${SOURCE_DIR}`);
  console.log(`Target: ${BUCKET_NAME}/${STORAGE_PATH}/`);
  console.log('');

  // Check bucket exists
  const bucketExists = await checkBucketExists();
  if (!bucketExists) {
    console.error(`Bucket "${BUCKET_NAME}" does not exist!`);
    console.error('Please create the bucket in Supabase Storage first.');
    process.exit(1);
  }

  // Get all PNG files
  const files = fs.readdirSync(SOURCE_DIR)
    .filter(f => f.endsWith('.png'))
    .sort();

  const stats: UploadStats = {
    total: files.length,
    uploaded: 0,
    skipped: 0,
    failed: 0,
    errors: []
  };

  console.log(`Found ${files.length} PNG files to upload`);
  console.log('');

  // Upload files with progress
  for (let i = 0; i < files.length; i++) {
    const fileName = files[i];
    const filePath = path.join(SOURCE_DIR, fileName);

    try {
      await uploadFile(filePath, fileName);
      stats.uploaded++;

      // Show progress every 10 files
      if ((i + 1) % 10 === 0 || i === files.length - 1) {
        const percent = ((i + 1) / files.length * 100).toFixed(1);
        console.log(`Progress: ${i + 1}/${files.length} (${percent}%) - ${fileName}`);
      }
    } catch (error: any) {
      stats.failed++;
      stats.errors.push({ file: fileName, error: error.message });
      console.error(`Failed to upload ${fileName}: ${error.message}`);
    }
  }

  return stats;
}

async function verifyUploads(): Promise<void> {
  console.log('');
  console.log('Verifying uploads...');

  const { data: files, error } = await supabase.storage
    .from(BUCKET_NAME)
    .list(STORAGE_PATH);

  if (error) {
    console.error('Failed to list uploaded files:', error.message);
    return;
  }

  console.log(`Total files in storage: ${files?.length || 0}`);

  // Check for expected range
  const expectedFiles = 930;
  if (files && files.length === expectedFiles) {
    console.log('All 930 files successfully uploaded!');
  } else {
    console.warn(`Expected ${expectedFiles} files, found ${files?.length || 0}`);
  }
}

async function main() {
  console.log('RPS Illustrations Upload Script');
  console.log('================================');
  console.log('');

  try {
    const stats = await uploadAllIllustrations();

    console.log('');
    console.log('Upload Summary:');
    console.log('===============');
    console.log(`Total files: ${stats.total}`);
    console.log(`Uploaded: ${stats.uploaded}`);
    console.log(`Failed: ${stats.failed}`);
    console.log('');

    if (stats.errors.length > 0) {
      console.log('Errors:');
      stats.errors.forEach(({ file, error }) => {
        console.log(`  - ${file}: ${error}`);
      });
      console.log('');
    }

    await verifyUploads();

    if (stats.failed === 0) {
      console.log('');
      console.log('Upload complete! All illustrations are now available at:');
      console.log(`https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/${BUCKET_NAME}/${STORAGE_PATH}/rps_page_XXXX.png`);
    } else {
      console.error('');
      console.error('Upload completed with errors. Please retry failed files.');
      process.exit(1);
    }

  } catch (error: any) {
    console.error('');
    console.error('Fatal error:', error.message);
    process.exit(1);
  }
}

main();
