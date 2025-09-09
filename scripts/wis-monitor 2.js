#!/usr/bin/env node

/**
 * WIS Process Monitor
 * Monitors extraction and upload progress
 */

import fs from 'fs/promises';
import path from 'path';

const EXTERNAL_DRIVE = '/Volumes/UnimogManuals';

async function checkProgress() {
  console.log('📊 WIS Process Status\n');
  console.log('═'.repeat(50));
  
  // Check extraction progress
  try {
    const extractProgress = await fs.readFile(
      path.join(EXTERNAL_DRIVE, 'wis-progress.json'),
      'utf-8'
    );
    const extract = JSON.parse(extractProgress);
    
    console.log('\n📤 Extraction Progress:');
    console.log(`  Files: ${extract.processedFiles}/${extract.totalFiles || '?'}`);
    console.log(`  Size: ${(extract.processedSize / 1024 / 1024 / 1024).toFixed(2)}GB`);
    console.log(`  Errors: ${extract.errors.length}`);
    
    if (extract.startTime) {
      const duration = Date.now() - extract.startTime;
      console.log(`  Duration: ${Math.floor(duration / 60000)} minutes`);
    }
  } catch {
    console.log('\n📤 Extraction: Not started or no data');
  }
  
  // Check upload progress
  try {
    const uploadProgress = await fs.readFile(
      path.join(EXTERNAL_DRIVE, 'wis-upload-progress.json'),
      'utf-8'
    );
    const upload = JSON.parse(uploadProgress);
    
    console.log('\n☁️ Upload Progress:');
    console.log(`  Total Files: ${upload.totalFiles}`);
    console.log(`  Uploaded: ${upload.uploadedFiles}`);
    console.log(`  Skipped: ${upload.skippedFiles}`);
    console.log(`  Failed: ${upload.failedFiles}`);
    console.log(`  Size: ${(upload.totalSize / 1024 / 1024).toFixed(2)}MB`);
    console.log(`  Errors: ${upload.errors.length}`);
    
    if (upload.totalFiles > 0) {
      const percent = ((upload.uploadedFiles + upload.skippedFiles) / upload.totalFiles * 100).toFixed(1);
      console.log(`  Progress: ${percent}%`);
    }
  } catch {
    console.log('\n☁️ Upload: Not started or no data');
  }
  
  // Check disk space
  try {
    const { execSync } = await import('child_process');
    const dfOutput = execSync(`df -h ${EXTERNAL_DRIVE}`).toString();
    const lines = dfOutput.split('\n');
    const data = lines[1].split(/\s+/);
    
    console.log('\n💾 Disk Space:');
    console.log(`  Used: ${data[2]}`);
    console.log(`  Available: ${data[3]}`);
    console.log(`  Usage: ${data[4]}`);
  } catch {
    console.log('\n💾 Disk Space: Unable to check');
  }
  
  // Check for extracted files
  try {
    const extractPath = path.join(EXTERNAL_DRIVE, 'wis-extracted');
    const files = await countFiles(extractPath);
    console.log(`\n📁 Extracted Files: ${files} files in wis-extracted/`);
  } catch {
    console.log('\n📁 Extracted Files: Directory not found');
  }
  
  console.log('\n' + '═'.repeat(50));
}

async function countFiles(dir) {
  let count = 0;
  
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      if (entry.isFile()) {
        count++;
      } else if (entry.isDirectory()) {
        count += await countFiles(path.join(dir, entry.name));
      }
    }
  } catch {
    // Ignore errors
  }
  
  return count;
}

// Show recent errors
async function showErrors() {
  console.log('\n❌ Recent Errors:\n');
  
  try {
    const extractProgress = await fs.readFile(
      path.join(EXTERNAL_DRIVE, 'wis-progress.json'),
      'utf-8'
    );
    const extract = JSON.parse(extractProgress);
    
    if (extract.errors && extract.errors.length > 0) {
      console.log('Extraction Errors:');
      extract.errors.slice(-5).forEach(err => {
        console.log(`  - ${err.file || 'General'}: ${err.error || err.general}`);
      });
    }
  } catch {
    // No extraction errors
  }
  
  try {
    const uploadProgress = await fs.readFile(
      path.join(EXTERNAL_DRIVE, 'wis-upload-progress.json'),
      'utf-8'
    );
    const upload = JSON.parse(uploadProgress);
    
    if (upload.errors && upload.errors.length > 0) {
      console.log('\nUpload Errors:');
      upload.errors.slice(-5).forEach(err => {
        console.log(`  - ${err.file || 'General'}: ${err.error || err.general}`);
      });
    }
  } catch {
    // No upload errors
  }
}

// Main monitor
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--watch')) {
    // Continuous monitoring
    console.clear();
    await checkProgress();
    
    setInterval(async () => {
      console.clear();
      await checkProgress();
    }, 5000); // Update every 5 seconds
    
  } else if (args.includes('--errors')) {
    // Show errors
    await showErrors();
    
  } else {
    // One-time check
    await checkProgress();
  }
}

// Run
main().catch(console.error);