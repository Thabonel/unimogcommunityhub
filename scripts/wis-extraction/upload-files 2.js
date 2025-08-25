#!/usr/bin/env node

/**
 * Upload WIS files to Supabase Storage
 * Handles all file types and maintains folder structure
 */

const fs = require('fs').promises;
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// Initialize Supabase
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

// Configuration
const BUCKET_NAME = 'wis-files';
const BATCH_SIZE = 10; // Upload 10 files at a time
const MAX_RETRIES = 3;

// Progress tracking
let totalFiles = 0;
let uploadedFiles = 0;
let failedFiles = [];

/**
 * Main upload function
 */
async function uploadFiles(filesDir) {
  console.log('📤 Starting file upload to Supabase Storage...');
  
  try {
    // Ensure bucket exists
    await ensureBucket();
    
    // Get all files recursively
    const files = await getAllFiles(filesDir);
    totalFiles = files.length;
    
    console.log(`📁 Found ${totalFiles} files to upload`);
    
    // Upload in batches
    for (let i = 0; i < files.length; i += BATCH_SIZE) {
      const batch = files.slice(i, i + BATCH_SIZE);
      await uploadBatch(batch, filesDir);
    }
    
    // Report results
    console.log('\n✅ File upload complete!');
    console.log(`   Successfully uploaded: ${uploadedFiles}/${totalFiles} files`);
    
    if (failedFiles.length > 0) {
      console.log(`   ⚠️  Failed uploads: ${failedFiles.length}`);
      console.log('   Failed files saved to: failed-uploads.json');
      await fs.writeFile(
        path.join(filesDir, '../failed-uploads.json'),
        JSON.stringify(failedFiles, null, 2)
      );
    }
    
  } catch (error) {
    console.error('❌ Error during file upload:', error);
    throw error;
  }
}

/**
 * Ensure storage bucket exists
 */
async function ensureBucket() {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    
    if (!buckets.find(b => b.name === BUCKET_NAME)) {
      console.log(`📦 Creating bucket: ${BUCKET_NAME}`);
      
      const { error } = await supabase.storage.createBucket(BUCKET_NAME, {
        public: false,
        fileSizeLimit: 104857600 // 100MB
      });
      
      if (error && !error.message.includes('already exists')) {
        throw error;
      }
    }
  } catch (error) {
    console.log('⚠️  Could not verify bucket, continuing anyway');
  }
}

/**
 * Get all files recursively
 */
async function getAllFiles(dir, fileList = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      await getAllFiles(fullPath, fileList);
    } else {
      fileList.push(fullPath);
    }
  }
  
  return fileList;
}

/**
 * Upload a batch of files
 */
async function uploadBatch(files, baseDir) {
  const uploadPromises = files.map(file => uploadFile(file, baseDir));
  await Promise.all(uploadPromises);
}

/**
 * Upload single file with retry logic
 */
async function uploadFile(filePath, baseDir, retryCount = 0) {
  try {
    // Get relative path for storage
    const relativePath = path.relative(baseDir, filePath);
    const storagePath = relativePath.replace(/\\/g, '/'); // Ensure forward slashes
    
    // Read file
    const fileBuffer = await fs.readFile(filePath);
    const fileStats = await fs.stat(filePath);
    
    // Skip very large files (>100MB)
    if (fileStats.size > 104857600) {
      console.log(`   ⚠️  Skipping large file: ${relativePath} (${Math.round(fileStats.size / 1048576)}MB)`);
      return;
    }
    
    // Upload to Supabase
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(storagePath, fileBuffer, {
        contentType: getContentType(filePath),
        upsert: true
      });
    
    if (error) {
      throw error;
    }
    
    uploadedFiles++;
    showProgress();
    
    // Also create database entry for searchability
    await createDatabaseEntry(storagePath, fileStats.size);
    
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      // Retry with exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
      return uploadFile(filePath, baseDir, retryCount + 1);
    } else {
      failedFiles.push({
        path: filePath,
        error: error.message
      });
      console.log(`\n   ❌ Failed to upload: ${path.basename(filePath)}`);
    }
  }
}

/**
 * Create database entry for file
 */
async function createDatabaseEntry(storagePath, fileSize) {
  try {
    const fileName = path.basename(storagePath);
    const fileType = path.extname(storagePath).toLowerCase();
    const category = path.dirname(storagePath).split('/')[0] || 'other';
    
    // Determine content type
    let contentType = 'document';
    if (['.jpg', '.jpeg', '.png', '.gif', '.cpg'].includes(fileType)) {
      contentType = 'image';
    } else if (['.pdf'].includes(fileType)) {
      contentType = 'pdf';
    } else if (['.xml', '.html', '.htm'].includes(fileType)) {
      contentType = 'markup';
    }
    
    const { error } = await supabase
      .from('wis_files')
      .upsert({
        file_path: storagePath,
        file_name: fileName,
        file_type: fileType,
        file_size: fileSize,
        category: category,
        content_type: contentType,
        storage_bucket: BUCKET_NAME,
        metadata: {
          uploaded_at: new Date().toISOString()
        }
      }, {
        onConflict: 'file_path'
      });
    
    if (error && !error.message.includes('does not exist')) {
      // Table might not exist yet, that's okay
      console.log('   Note: wis_files table not found, skipping database entry');
    }
  } catch (error) {
    // Non-critical error, continue
  }
}

/**
 * Get content type for file
 */
function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentTypes = {
    '.pdf': 'application/pdf',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.xml': 'application/xml',
    '.html': 'text/html',
    '.htm': 'text/html',
    '.txt': 'text/plain',
    '.csv': 'text/csv',
    '.json': 'application/json'
  };
  return contentTypes[ext] || 'application/octet-stream';
}

/**
 * Show upload progress
 */
function showProgress() {
  const percent = Math.round((uploadedFiles / totalFiles) * 100);
  const progressBar = '='.repeat(Math.floor(percent / 2)) + '-'.repeat(50 - Math.floor(percent / 2));
  process.stdout.write(`\r   Upload Progress: [${progressBar}] ${percent}% (${uploadedFiles}/${totalFiles})`);
}

// Main execution
const filesDir = process.argv[2];
if (!filesDir) {
  console.error('Usage: node upload-files.js <files-directory>');
  process.exit(1);
}

uploadFiles(filesDir).catch(console.error);