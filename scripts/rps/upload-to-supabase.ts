#!/usr/bin/env tsx

import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing environment variables:');
  console.error('   VITE_SUPABASE_URL');
  console.error('   SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const OUTPUT_DIR = path.join(__dirname, 'output');
const BUCKET_NAME = 'rps-parts';

interface UploadResult {
  group_code: string;
  uploaded: boolean;
  storage_path?: string;
  error?: string;
}

async function createBucketIfNotExists() {
  console.log('🪣 Checking if storage bucket exists...');

  const { data: buckets } = await supabase.storage.listBuckets();

  const bucketExists = buckets?.some(b => b.name === BUCKET_NAME);

  if (!bucketExists) {
    console.log(`📦 Creating bucket: ${BUCKET_NAME}`);

    const { error } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
      fileSizeLimit: 10485760, // 10MB
    });

    if (error) {
      throw new Error(`Failed to create bucket: ${error.message}`);
    }

    console.log('✅ Bucket created successfully');
  } else {
    console.log(`✅ Bucket already exists: ${BUCKET_NAME}`);
  }
}

async function uploadGroupFile(groupCode: string): Promise<UploadResult> {
  const filename = `group_${groupCode.toLowerCase()}_complete.json`;
  const filePath = path.join(OUTPUT_DIR, filename);

  if (!fs.existsSync(filePath)) {
    return {
      group_code: groupCode,
      uploaded: false,
      error: 'File not found',
    };
  }

  try {
    console.log(`📤 Uploading Group ${groupCode}...`);

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const storagePath = `groups/${filename}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(storagePath, fileContent, {
        contentType: 'application/json',
        upsert: true, // Overwrite if exists
      });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    console.log(`✅ Group ${groupCode} uploaded: ${storagePath}`);

    return {
      group_code: groupCode,
      uploaded: true,
      storage_path: storagePath,
    };
  } catch (error) {
    console.error(`❌ Upload failed for Group ${groupCode}:`, error);

    return {
      group_code: groupCode,
      uploaded: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function uploadAllGroups() {
  console.log('🚀 Starting upload of all RPS groups to Supabase Storage...\n');

  // Step 1: Create bucket
  await createBucketIfNotExists();

  // Step 2: Read extraction summary to find all groups
  const summaryPath = path.join(OUTPUT_DIR, 'extraction_summary.json');

  if (!fs.existsSync(summaryPath)) {
    throw new Error('Extraction summary not found. Run batch-extract-all.ts first.');
  }

  const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf-8'));
  const successfulGroups = summary.results.filter((r: any) => r.success);

  console.log(`📋 Found ${successfulGroups.length} groups to upload\n`);

  // Step 3: Upload each group
  const uploadResults: UploadResult[] = [];

  for (const group of successfulGroups) {
    const result = await uploadGroupFile(group.group_code);
    uploadResults.push(result);

    // Small delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Step 4: Generate upload summary
  const uploadSummary = {
    total_groups: uploadResults.length,
    successful_uploads: uploadResults.filter(r => r.uploaded).length,
    failed_uploads: uploadResults.filter(r => !r.uploaded).length,
    bucket_name: BUCKET_NAME,
    upload_date: new Date().toISOString(),
    results: uploadResults,
  };

  const uploadSummaryPath = path.join(OUTPUT_DIR, 'upload_summary.json');
  fs.writeFileSync(uploadSummaryPath, JSON.stringify(uploadSummary, null, 2));

  console.log(`\n${'='.repeat(80)}`);
  console.log('🎉 UPLOAD COMPLETE');
  console.log(`${'='.repeat(80)}\n`);
  console.log(`📊 Summary:`);
  console.log(`   Total Groups: ${uploadResults.length}`);
  console.log(`   Successful: ${uploadSummary.successful_uploads}`);
  console.log(`   Failed: ${uploadSummary.failed_uploads}`);
  console.log(`   Bucket: ${BUCKET_NAME}`);
  console.log(`\n📄 Upload summary: ${uploadSummaryPath}\n`);

  if (uploadSummary.failed_uploads > 0) {
    console.log('⚠️ Some uploads failed:');
    uploadResults
      .filter(r => !r.uploaded)
      .forEach(r => console.log(`   - Group ${r.group_code}: ${r.error}`));
  }

  return uploadSummary;
}

if (require.main === module) {
  uploadAllGroups()
    .then(() => {
      console.log('✅ All uploads complete!');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Upload failed:', error);
      process.exit(1);
    });
}

export { uploadAllGroups, createBucketIfNotExists };
