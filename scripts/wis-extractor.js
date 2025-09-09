#!/usr/bin/env node

/**
 * WIS Data Extractor
 * Safely extracts Unimog-specific data from Mercedes WIS system
 * All operations on external drive only
 */

import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import { createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';

const execAsync = promisify(exec);

// Configuration
const CONFIG = {
  externalDrive: '/Volumes/UnimogManuals',
  rawImage: '/Volumes/UnimogManuals/wis-extraction/MERCEDES.raw',
  mountPoint: '/Volumes/WIS_MOUNT',
  extractPath: '/Volumes/UnimogManuals/wis-extracted',
  minFreeSpace: 10 * 1024 * 1024 * 1024, // 10GB minimum
  batchSize: 100 * 1024 * 1024, // 100MB batches
  
  // Unimog-specific patterns
  unimogPatterns: [
    '*unimog*',
    '*U400*', '*U500*', '*U1000*', '*U1300*', '*U1700*', '*U2150*', '*U4000*', '*U5000*',
    '*406*', '*416*', '*424*', '*425*', '*435*', '*437*',
    '*portal*axle*',
    '*mog*'
  ]
};

// Progress tracking
let progress = {
  totalFiles: 0,
  processedFiles: 0,
  totalSize: 0,
  processedSize: 0,
  errors: [],
  startTime: Date.now()
};

// Save progress for resume capability
async function saveProgress() {
  await fs.writeFile(
    path.join(CONFIG.externalDrive, 'wis-progress.json'),
    JSON.stringify(progress, null, 2)
  );
}

// Load previous progress if exists
async function loadProgress() {
  try {
    const data = await fs.readFile(
      path.join(CONFIG.externalDrive, 'wis-progress.json'),
      'utf-8'
    );
    progress = JSON.parse(data);
    console.log('📥 Resuming from previous extraction...');
  } catch {
    console.log('🆕 Starting fresh extraction...');
  }
}

// Check available disk space
async function checkDiskSpace() {
  const { stdout } = await execAsync(`df -k ${CONFIG.externalDrive}`);
  const lines = stdout.split('\n');
  const data = lines[1].split(/\s+/);
  const available = parseInt(data[3]) * 1024; // Convert to bytes
  
  if (available < CONFIG.minFreeSpace) {
    throw new Error(`Insufficient space: ${(available / 1024 / 1024 / 1024).toFixed(2)}GB available, need at least 10GB`);
  }
  
  return available;
}

// Mount the Windows image safely (read-only)
async function mountImage() {
  console.log('🔧 Mounting Windows image (read-only)...');
  
  try {
    // First, check if already mounted
    const { stdout: mountCheck } = await execAsync('mount');
    if (mountCheck.includes(CONFIG.mountPoint)) {
      console.log('✅ Image already mounted');
      return true;
    }
    
    // Create mount point if doesn't exist
    await execAsync(`sudo mkdir -p ${CONFIG.mountPoint}`).catch(() => {});
    
    // Try to mount using hdiutil (macOS native)
    console.log('📀 Attempting to mount with hdiutil...');
    await execAsync(`sudo hdiutil attach -readonly -nomount ${CONFIG.rawImage}`);
    
    // Get the disk identifier
    const { stdout: diskInfo } = await execAsync('diskutil list');
    const diskMatch = diskInfo.match(/disk\d+s\d+.*Windows/i);
    
    if (diskMatch) {
      const diskId = diskMatch[0].split(/\s+/)[0];
      console.log(`📍 Found Windows partition: ${diskId}`);
      
      // Mount the Windows partition
      await execAsync(`sudo mount -t ntfs -o ro /dev/${diskId} ${CONFIG.mountPoint}`);
      console.log('✅ Image mounted successfully');
      return true;
    }
    
    throw new Error('Could not find Windows partition');
  } catch (error) {
    console.error('❌ Mount failed:', error.message);
    console.log('💡 Trying alternative mount method...');
    
    // Alternative: Try with qemu-nbd if available
    try {
      await execAsync('which qemu-nbd');
      console.log('Using qemu-nbd method...');
      // Implementation for qemu-nbd mount
      // This would require additional setup
    } catch {
      console.log('qemu-nbd not available');
    }
    
    return false;
  }
}

// Unmount the image
async function unmountImage() {
  console.log('🔧 Unmounting image...');
  try {
    await execAsync(`sudo umount ${CONFIG.mountPoint}`);
    await execAsync(`sudo hdiutil detach ${CONFIG.mountPoint}`);
    console.log('✅ Image unmounted');
  } catch (error) {
    console.log('⚠️ Unmount warning:', error.message);
  }
}

// Find Unimog-specific files
async function findUnimogFiles() {
  console.log('🔍 Searching for Unimog files...');
  
  const files = [];
  const searchPaths = [
    'Program Files/Mercedes-Benz/WIS',
    'Program Files/Mercedes-Benz/EPC',
    'Program Files (x86)/Mercedes-Benz',
    'ProgramData/Mercedes-Benz',
    'Users/Public/Documents/Mercedes-Benz'
  ];
  
  for (const searchPath of searchPaths) {
    const fullPath = path.join(CONFIG.mountPoint, searchPath);
    
    try {
      await fs.access(fullPath);
      console.log(`📁 Searching in: ${searchPath}`);
      
      for (const pattern of CONFIG.unimogPatterns) {
        try {
          const { stdout } = await execAsync(
            `find "${fullPath}" -iname "${pattern}" -type f 2>/dev/null | head -1000`
          );
          
          const foundFiles = stdout.split('\n').filter(f => f.trim());
          files.push(...foundFiles);
          
          if (foundFiles.length > 0) {
            console.log(`  Found ${foundFiles.length} files matching ${pattern}`);
          }
        } catch {
          // Ignore find errors
        }
      }
    } catch {
      console.log(`  Skipping: ${searchPath} (not found)`);
    }
  }
  
  // Remove duplicates
  const uniqueFiles = [...new Set(files)];
  console.log(`📊 Total unique Unimog files found: ${uniqueFiles.length}`);
  
  return uniqueFiles;
}

// Extract files in batches
async function extractFiles(files) {
  console.log('📤 Starting extraction to external drive...');
  
  // Create extraction directory
  await fs.mkdir(CONFIG.extractPath, { recursive: true });
  
  let currentBatchSize = 0;
  let batchNumber = 1;
  
  for (const file of files) {
    try {
      // Check disk space before each file
      const available = await checkDiskSpace();
      
      // Get file stats
      const stats = await fs.stat(file);
      const fileSize = stats.size;
      
      // Check if we need a new batch
      if (currentBatchSize + fileSize > CONFIG.batchSize) {
        console.log(`📦 Batch ${batchNumber} complete (${(currentBatchSize / 1024 / 1024).toFixed(2)}MB)`);
        batchNumber++;
        currentBatchSize = 0;
        
        // Save progress after each batch
        await saveProgress();
      }
      
      // Determine output path
      const relativePath = path.relative(CONFIG.mountPoint, file);
      const outputPath = path.join(CONFIG.extractPath, relativePath);
      
      // Create directory structure
      await fs.mkdir(path.dirname(outputPath), { recursive: true });
      
      // Copy file
      await pipeline(
        createReadStream(file),
        createWriteStream(outputPath)
      );
      
      // Update progress
      progress.processedFiles++;
      progress.processedSize += fileSize;
      currentBatchSize += fileSize;
      
      // Show progress every 10 files
      if (progress.processedFiles % 10 === 0) {
        const percent = ((progress.processedFiles / files.length) * 100).toFixed(1);
        console.log(`⏳ Progress: ${progress.processedFiles}/${files.length} files (${percent}%)`);
      }
      
    } catch (error) {
      console.error(`❌ Failed to extract ${file}:`, error.message);
      progress.errors.push({ file, error: error.message });
    }
  }
  
  console.log('✅ Extraction complete!');
  await saveProgress();
}

// Generate extraction report
async function generateReport() {
  const duration = Date.now() - progress.startTime;
  const report = {
    summary: {
      totalFiles: progress.processedFiles,
      totalSize: `${(progress.processedSize / 1024 / 1024 / 1024).toFixed(2)}GB`,
      duration: `${Math.floor(duration / 60000)} minutes`,
      errors: progress.errors.length
    },
    errors: progress.errors,
    timestamp: new Date().toISOString()
  };
  
  await fs.writeFile(
    path.join(CONFIG.externalDrive, 'wis-extraction-report.json'),
    JSON.stringify(report, null, 2)
  );
  
  console.log('\n📊 Extraction Report:');
  console.log(`  Files: ${report.summary.totalFiles}`);
  console.log(`  Size: ${report.summary.totalSize}`);
  console.log(`  Duration: ${report.summary.duration}`);
  console.log(`  Errors: ${report.summary.errors}`);
}

// Main extraction process
async function main() {
  console.log('🚀 WIS Data Extractor Starting...');
  console.log('📍 External Drive:', CONFIG.externalDrive);
  console.log('📍 Image:', CONFIG.rawImage);
  
  try {
    // Load previous progress if exists
    await loadProgress();
    
    // Check disk space
    const available = await checkDiskSpace();
    console.log(`💾 Available space: ${(available / 1024 / 1024 / 1024).toFixed(2)}GB`);
    
    // Mount the image
    const mounted = await mountImage();
    if (!mounted) {
      throw new Error('Failed to mount Windows image');
    }
    
    // Find Unimog files
    const files = await findUnimogFiles();
    if (files.length === 0) {
      throw new Error('No Unimog files found');
    }
    
    // Extract files
    await extractFiles(files);
    
    // Generate report
    await generateReport();
    
    console.log('\n✅ Extraction completed successfully!');
    console.log(`📁 Files extracted to: ${CONFIG.extractPath}`);
    
  } catch (error) {
    console.error('\n❌ Extraction failed:', error.message);
    progress.errors.push({ general: error.message });
    await saveProgress();
  } finally {
    // Always try to unmount
    await unmountImage();
  }
}

// Handle interruption
process.on('SIGINT', async () => {
  console.log('\n⚠️ Extraction interrupted, saving progress...');
  await saveProgress();
  await unmountImage();
  process.exit(0);
});

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { main as extractWISData };