#!/usr/bin/env node

/**
 * WIS Safe Extractor
 * Alternative extraction method that doesn't require mounting
 * Uses existing files if available
 */

import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const CONFIG = {
  externalDrive: '/Volumes/UnimogManuals',
  searchPaths: [
    '/Volumes/UnimogManuals/wis-data',
    '/Volumes/UnimogManuals/wis-extraction',
    '/Volumes/UnimogManuals/docs'
  ],
  outputPath: '/Volumes/UnimogManuals/wis-ready-to-upload',
  
  // File patterns to find
  patterns: [
    '*.pdf',
    '*.html',
    '*.htm',
    '*.txt',
    '*.doc*',
    '*unimog*',
    '*manual*',
    '*service*',
    '*parts*',
    '*wiring*'
  ]
};

async function findExistingFiles() {
  console.log('🔍 Searching for existing WIS files on external drive...\n');
  
  const files = [];
  
  for (const searchPath of CONFIG.searchPaths) {
    try {
      await fs.access(searchPath);
      console.log(`📁 Checking: ${searchPath}`);
      
      // Search for relevant files
      for (const pattern of CONFIG.patterns) {
        try {
          const { stdout } = await execAsync(
            `find "${searchPath}" -type f -iname "${pattern}" 2>/dev/null | head -100`
          );
          
          const foundFiles = stdout.split('\n').filter(f => f.trim());
          if (foundFiles.length > 0) {
            console.log(`  Found ${foundFiles.length} files matching ${pattern}`);
            files.push(...foundFiles);
          }
        } catch {
          // Ignore errors
        }
      }
    } catch {
      console.log(`  Skipping: ${searchPath} (not accessible)`);
    }
  }
  
  // Remove duplicates
  const uniqueFiles = [...new Set(files)];
  console.log(`\n📊 Total unique files found: ${uniqueFiles.length}`);
  
  return uniqueFiles;
}

async function prepareFiles(files) {
  console.log('\n📦 Preparing files for upload...');
  
  // Create output directory
  await fs.mkdir(CONFIG.outputPath, { recursive: true });
  
  let copiedCount = 0;
  let skippedCount = 0;
  
  for (const file of files) {
    try {
      const fileName = path.basename(file);
      const outputFile = path.join(CONFIG.outputPath, fileName);
      
      // Check if already exists
      try {
        await fs.access(outputFile);
        skippedCount++;
        continue; // Skip if already copied
      } catch {
        // File doesn't exist, proceed to copy
      }
      
      // Copy file
      await fs.copyFile(file, outputFile);
      copiedCount++;
      
      if (copiedCount % 10 === 0) {
        console.log(`  Copied ${copiedCount} files...`);
      }
    } catch (error) {
      console.error(`  Error copying ${file}:`, error.message);
    }
  }
  
  console.log(`\n✅ Preparation complete!`);
  console.log(`  Copied: ${copiedCount} files`);
  console.log(`  Skipped: ${skippedCount} files (already exist)`);
  console.log(`  Location: ${CONFIG.outputPath}`);
}

async function main() {
  console.log('🚀 WIS Safe Extractor\n');
  console.log('This will search for existing WIS files on your external drive');
  console.log('and prepare them for upload without mounting any images.\n');
  
  try {
    // Find existing files
    const files = await findExistingFiles();
    
    if (files.length === 0) {
      console.log('\n❌ No WIS files found on external drive');
      console.log('You may need to extract them from the VDI first');
      return;
    }
    
    // Prepare files for upload
    await prepareFiles(files);
    
    console.log('\n🎯 Next step: Run "npm run wis:upload" to upload files to Supabase');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

// Run
main().catch(console.error);