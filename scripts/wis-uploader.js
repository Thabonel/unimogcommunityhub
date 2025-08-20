#!/usr/bin/env node

/**
 * WIS Data Uploader
 * Uploads extracted WIS data to Supabase
 * Processes files from external drive and removes after successful upload
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';
import { createReadStream } from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configuration
const CONFIG = {
  extractPath: '/Volumes/UnimogManuals/wis-extracted',
  supabaseUrl: process.env.VITE_SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY,
  bucketName: 'wis-manuals',
  batchSize: 10, // Upload 10 files at a time
  maxFileSize: 50 * 1024 * 1024, // 50MB max per file
  
  // File categorization rules
  categories: {
    manuals: ['.pdf', '.doc', '.docx', '.txt'],
    parts: ['parts', 'epc', 'catalog'],
    bulletins: ['bulletin', 'tsb', 'notice'],
    wiring: ['wiring', 'circuit', 'electrical', '.dwg']
  }
};

// Supabase client
const supabase = createClient(CONFIG.supabaseUrl, CONFIG.supabaseKey);

// Upload progress
let uploadProgress = {
  totalFiles: 0,
  uploadedFiles: 0,
  skippedFiles: 0,
  failedFiles: 0,
  totalSize: 0,
  errors: [],
  startTime: Date.now()
};

// Save upload progress
async function saveProgress() {
  await fs.writeFile(
    '/Volumes/UnimogManuals/wis-upload-progress.json',
    JSON.stringify(uploadProgress, null, 2)
  );
}

// Load previous upload progress
async function loadProgress() {
  try {
    const data = await fs.readFile(
      '/Volumes/UnimogManuals/wis-upload-progress.json',
      'utf-8'
    );
    uploadProgress = JSON.parse(data);
    console.log('📥 Resuming previous upload session...');
  } catch {
    console.log('🆕 Starting new upload session...');
  }
}

// Determine file category
function getFileCategory(filePath) {
  const fileName = path.basename(filePath).toLowerCase();
  const ext = path.extname(filePath).toLowerCase();
  
  for (const [category, patterns] of Object.entries(CONFIG.categories)) {
    for (const pattern of patterns) {
      if (pattern.startsWith('.')) {
        if (ext === pattern) return category;
      } else {
        if (fileName.includes(pattern)) return category;
      }
    }
  }
  
  return 'manuals'; // Default category
}

// Generate unique file hash
async function getFileHash(filePath) {
  const fileBuffer = await fs.readFile(filePath);
  return crypto.createHash('md5').update(fileBuffer).digest('hex');
}

// Check if file already uploaded
async function isFileUploaded(fileHash) {
  try {
    const { data, error } = await supabase
      .from('wis_documents')
      .select('id')
      .eq('file_hash', fileHash)
      .single();
    
    return !!data;
  } catch {
    return false;
  }
}

// Upload file to Supabase storage
async function uploadFile(filePath) {
  const fileName = path.basename(filePath);
  const category = getFileCategory(filePath);
  const stats = await fs.stat(filePath);
  
  // Skip if file too large
  if (stats.size > CONFIG.maxFileSize) {
    console.log(`⚠️ Skipping ${fileName} (too large: ${(stats.size / 1024 / 1024).toFixed(2)}MB)`);
    uploadProgress.skippedFiles++;
    return null;
  }
  
  // Generate file hash to check duplicates
  const fileHash = await getFileHash(filePath);
  
  // Check if already uploaded
  if (await isFileUploaded(fileHash)) {
    console.log(`⏭️ Skipping ${fileName} (already uploaded)`);
    uploadProgress.skippedFiles++;
    return null;
  }
  
  // Generate storage path
  const timestamp = Date.now();
  const safeFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const storagePath = `${category}/${timestamp}_${safeFileName}`;
  
  try {
    // Upload to Supabase storage
    const fileBuffer = await fs.readFile(filePath);
    const { data, error } = await supabase.storage
      .from(CONFIG.bucketName)
      .upload(storagePath, fileBuffer, {
        contentType: getContentType(fileName),
        upsert: false
      });
    
    if (error) throw error;
    
    // Create database entry
    const dbEntry = {
      file_name: fileName,
      file_path: storagePath,
      file_size: stats.size,
      file_hash: fileHash,
      category: category,
      original_path: filePath.replace(CONFIG.extractPath, ''),
      uploaded_at: new Date().toISOString()
    };
    
    const { error: dbError } = await supabase
      .from('wis_documents')
      .insert(dbEntry);
    
    if (dbError) throw dbError;
    
    uploadProgress.uploadedFiles++;
    uploadProgress.totalSize += stats.size;
    
    console.log(`✅ Uploaded: ${fileName} (${category})`);
    
    // Delete local file after successful upload
    await fs.unlink(filePath);
    
    return storagePath;
    
  } catch (error) {
    console.error(`❌ Failed to upload ${fileName}:`, error.message);
    uploadProgress.failedFiles++;
    uploadProgress.errors.push({ file: fileName, error: error.message });
    return null;
  }
}

// Get content type for file
function getContentType(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  const types = {
    '.pdf': 'application/pdf',
    '.html': 'text/html',
    '.htm': 'text/html',
    '.txt': 'text/plain',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.json': 'application/json'
  };
  
  return types[ext] || 'application/octet-stream';
}

// Get all files to upload
async function getFilesToUpload() {
  const files = [];
  
  async function scanDirectory(dir) {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          await scanDirectory(fullPath);
        } else if (entry.isFile()) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      console.error(`Error scanning ${dir}:`, error.message);
    }
  }
  
  await scanDirectory(CONFIG.extractPath);
  return files;
}

// Process files in batches
async function processFiles(files) {
  console.log(`📤 Processing ${files.length} files for upload...`);
  
  uploadProgress.totalFiles = files.length;
  
  for (let i = 0; i < files.length; i += CONFIG.batchSize) {
    const batch = files.slice(i, i + CONFIG.batchSize);
    const batchNumber = Math.floor(i / CONFIG.batchSize) + 1;
    
    console.log(`\n📦 Processing batch ${batchNumber}/${Math.ceil(files.length / CONFIG.batchSize)}`);
    
    // Upload batch in parallel
    const uploadPromises = batch.map(file => uploadFile(file));
    await Promise.all(uploadPromises);
    
    // Save progress after each batch
    await saveProgress();
    
    // Show progress
    const percent = ((uploadProgress.uploadedFiles + uploadProgress.skippedFiles) / files.length * 100).toFixed(1);
    console.log(`⏳ Overall progress: ${percent}%`);
  }
}

// Create necessary database tables
async function ensureDatabaseTables() {
  console.log('🔧 Ensuring database tables exist...');
  
  // Create wis_documents table if not exists
  const { error } = await supabase.rpc('create_wis_documents_table', {
    table_sql: `
      CREATE TABLE IF NOT EXISTS wis_documents (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        file_name VARCHAR(255) NOT NULL,
        file_path VARCHAR(500) NOT NULL,
        file_size BIGINT,
        file_hash VARCHAR(32) UNIQUE,
        category VARCHAR(50),
        original_path TEXT,
        uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        metadata JSONB
      );
      
      CREATE INDEX IF NOT EXISTS idx_wis_documents_hash ON wis_documents(file_hash);
      CREATE INDEX IF NOT EXISTS idx_wis_documents_category ON wis_documents(category);
    `
  }).catch(() => {
    // Table might already exist, that's okay
  });
}

// Generate upload report
async function generateReport() {
  const duration = Date.now() - uploadProgress.startTime;
  
  const report = {
    summary: {
      totalFiles: uploadProgress.totalFiles,
      uploadedFiles: uploadProgress.uploadedFiles,
      skippedFiles: uploadProgress.skippedFiles,
      failedFiles: uploadProgress.failedFiles,
      totalSize: `${(uploadProgress.totalSize / 1024 / 1024).toFixed(2)}MB`,
      duration: `${Math.floor(duration / 60000)} minutes`,
      successRate: `${((uploadProgress.uploadedFiles / uploadProgress.totalFiles) * 100).toFixed(1)}%`
    },
    errors: uploadProgress.errors,
    timestamp: new Date().toISOString()
  };
  
  await fs.writeFile(
    '/Volumes/UnimogManuals/wis-upload-report.json',
    JSON.stringify(report, null, 2)
  );
  
  console.log('\n📊 Upload Report:');
  console.log(`  Total Files: ${report.summary.totalFiles}`);
  console.log(`  Uploaded: ${report.summary.uploadedFiles}`);
  console.log(`  Skipped: ${report.summary.skippedFiles}`);
  console.log(`  Failed: ${report.summary.failedFiles}`);
  console.log(`  Total Size: ${report.summary.totalSize}`);
  console.log(`  Duration: ${report.summary.duration}`);
  console.log(`  Success Rate: ${report.summary.successRate}`);
}

// Clean up empty directories
async function cleanupDirectories() {
  console.log('🧹 Cleaning up empty directories...');
  
  async function removeEmptyDirs(dir) {
    try {
      const entries = await fs.readdir(dir);
      
      if (entries.length === 0) {
        await fs.rmdir(dir);
        console.log(`  Removed empty directory: ${dir}`);
        return true;
      }
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry);
        const stat = await fs.stat(fullPath);
        
        if (stat.isDirectory()) {
          await removeEmptyDirs(fullPath);
        }
      }
      
      // Check again after processing subdirectories
      const remaining = await fs.readdir(dir);
      if (remaining.length === 0) {
        await fs.rmdir(dir);
        console.log(`  Removed empty directory: ${dir}`);
      }
    } catch (error) {
      console.error(`  Error cleaning ${dir}:`, error.message);
    }
  }
  
  await removeEmptyDirs(CONFIG.extractPath);
}

// Main upload process
async function main() {
  console.log('🚀 WIS Data Uploader Starting...');
  console.log('📍 Extract Path:', CONFIG.extractPath);
  console.log('📍 Supabase URL:', CONFIG.supabaseUrl);
  
  try {
    // Check if extraction directory exists
    await fs.access(CONFIG.extractPath);
    
    // Load previous progress
    await loadProgress();
    
    // Ensure database tables exist
    await ensureDatabaseTables();
    
    // Get files to upload
    const files = await getFilesToUpload();
    
    if (files.length === 0) {
      console.log('ℹ️ No files found to upload');
      return;
    }
    
    console.log(`📊 Found ${files.length} files to process`);
    
    // Process and upload files
    await processFiles(files);
    
    // Clean up empty directories
    await cleanupDirectories();
    
    // Generate report
    await generateReport();
    
    console.log('\n✅ Upload completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Upload failed:', error.message);
    uploadProgress.errors.push({ general: error.message });
    await saveProgress();
  }
}

// Handle interruption
process.on('SIGINT', async () => {
  console.log('\n⚠️ Upload interrupted, saving progress...');
  await saveProgress();
  process.exit(0);
});

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { main as uploadWISData };