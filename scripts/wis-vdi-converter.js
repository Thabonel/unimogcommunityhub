#!/usr/bin/env node

/**
 * WIS VDI Converter
 * Converts VDI to a mountable format and extracts WIS data
 * Uses macOS native tools to safely access VDI contents
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

const CONFIG = {
  vdiFile: '/Volumes/UnimogManuals/wis-extraction/MERCEDES.vdi',
  mountPoint: '/Volumes/WIS_VDI',
  extractPath: '/Volumes/UnimogManuals/wis-extracted',
  searchPath: '/Volumes/UnimogManuals/wis-ready-to-upload',
  
  // Patterns to search for
  patterns: [
    '*unimog*',
    '*U400*', '*U500*', '*U1000*', '*U1300*', '*U1700*',
    '*406*', '*416*', '*424*', '*425*', '*435*',
    '*.pdf', '*.html', '*.htm'
  ]
};

// Check if VirtualBox tools are available
async function checkVBoxTools() {
  try {
    await execAsync('which vboximg-mount');
    return true;
  } catch {
    console.log('⚠️ VirtualBox tools not found');
    console.log('  Install with: brew install --cask virtualbox');
    return false;
  }
}

// Mount VDI using hdiutil (macOS native)
async function mountVDI() {
  console.log('🔧 Attempting to mount VDI file...');
  
  try {
    // Check if already mounted
    const { stdout: mountCheck } = await execAsync('mount');
    if (mountCheck.includes(CONFIG.mountPoint)) {
      console.log('✅ VDI already mounted');
      return true;
    }
    
    // Try to attach VDI directly with hdiutil
    console.log('📀 Attaching VDI with hdiutil...');
    const { stdout } = await execAsync(`hdiutil attach -readonly -nomount "${CONFIG.vdiFile}" 2>&1`);
    
    // Parse output to find disk identifier
    const lines = stdout.split('\n');
    let diskId = null;
    
    for (const line of lines) {
      if (line.includes('/dev/disk')) {
        const match = line.match(/\/dev\/(disk\d+)/);
        if (match) {
          diskId = match[1];
          break;
        }
      }
    }
    
    if (diskId) {
      console.log(`📍 Found disk: ${diskId}`);
      
      // List partitions
      const { stdout: partInfo } = await execAsync(`diskutil list ${diskId}`);
      console.log('Partitions found:');
      console.log(partInfo);
      
      // Try to mount Windows partition if found
      const ntfsMatch = partInfo.match(/(disk\d+s\d+).*Microsoft/i) || 
                        partInfo.match(/(disk\d+s\d+).*Windows/i) ||
                        partInfo.match(/(disk\d+s\d+).*NTFS/i);
      
      if (ntfsMatch) {
        const partition = ntfsMatch[1];
        console.log(`📍 Mounting partition: ${partition}`);
        
        // Create mount point
        await execAsync(`sudo mkdir -p ${CONFIG.mountPoint}`).catch(() => {});
        
        // Mount read-only
        await execAsync(`sudo mount -t ntfs -o ro /dev/${partition} ${CONFIG.mountPoint}`);
        console.log('✅ VDI mounted successfully');
        return true;
      }
    }
    
    throw new Error('Could not find suitable partition in VDI');
    
  } catch (error) {
    console.error('❌ Mount failed:', error.message);
    
    // Alternative method: Try to use vdfuse if available
    try {
      await execAsync('which vdfuse');
      console.log('💡 Trying vdfuse method...');
      
      const fusePath = '/Volumes/UnimogManuals/vdi-fuse';
      await fs.mkdir(fusePath, { recursive: true });
      
      await execAsync(`vdfuse -r -f "${CONFIG.vdiFile}" "${fusePath}"`);
      console.log('✅ VDI mounted with vdfuse');
      
      CONFIG.mountPoint = fusePath;
      return true;
      
    } catch {
      console.log('vdfuse not available');
    }
    
    return false;
  }
}

// Search for WIS files in mounted VDI
async function searchVDI() {
  console.log('🔍 Searching for WIS files in VDI...');
  
  const files = [];
  const searchPaths = [
    '',
    'Program Files',
    'Program Files (x86)',
    'ProgramData',
    'Users',
    'Windows',
    'Mercedes-Benz',
    'WIS',
    'EPC'
  ];
  
  for (const searchPath of searchPaths) {
    const fullPath = path.join(CONFIG.mountPoint, searchPath);
    
    try {
      await fs.access(fullPath);
      console.log(`📁 Checking: ${searchPath || '/'}`);
      
      // Search for relevant files
      for (const pattern of CONFIG.patterns) {
        try {
          const { stdout } = await execAsync(
            `find "${fullPath}" -maxdepth 3 -iname "${pattern}" -type f 2>/dev/null | head -100`
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
      // Directory doesn't exist
    }
  }
  
  // Remove duplicates
  const uniqueFiles = [...new Set(files)];
  console.log(`\n📊 Total unique files found: ${uniqueFiles.length}`);
  
  return uniqueFiles;
}

// Copy files to external drive
async function extractFiles(files) {
  console.log('\n📤 Extracting files to external drive...');
  
  await fs.mkdir(CONFIG.searchPath, { recursive: true });
  
  let copied = 0;
  let failed = 0;
  
  for (const file of files) {
    try {
      const fileName = path.basename(file);
      const outputPath = path.join(CONFIG.searchPath, fileName);
      
      // Check if already exists
      try {
        await fs.access(outputPath);
        console.log(`⏭️ Skipping ${fileName} (already exists)`);
        continue;
      } catch {
        // File doesn't exist, proceed
      }
      
      // Copy file
      await execAsync(`cp "${file}" "${outputPath}"`);
      copied++;
      
      if (copied % 10 === 0) {
        console.log(`  Copied ${copied} files...`);
      }
      
    } catch (error) {
      console.error(`❌ Failed to copy ${file}:`, error.message);
      failed++;
    }
  }
  
  console.log(`\n✅ Extraction complete!`);
  console.log(`  Copied: ${copied} files`);
  console.log(`  Failed: ${failed} files`);
  console.log(`  Location: ${CONFIG.searchPath}`);
}

// Unmount VDI
async function unmountVDI() {
  console.log('\n🔧 Unmounting VDI...');
  
  try {
    // Try to unmount
    await execAsync(`sudo umount ${CONFIG.mountPoint} 2>/dev/null`).catch(() => {});
    
    // Detach disk
    const { stdout } = await execAsync('hdiutil info');
    const lines = stdout.split('\n');
    
    for (const line of lines) {
      if (line.includes(CONFIG.vdiFile)) {
        const match = line.match(/\/dev\/(disk\d+)/);
        if (match) {
          await execAsync(`hdiutil detach /dev/${match[1]}`);
          console.log('✅ VDI unmounted');
          break;
        }
      }
    }
  } catch (error) {
    console.log('⚠️ Unmount warning:', error.message);
  }
}

// Main process
async function main() {
  console.log('🚀 WIS VDI Converter\n');
  
  try {
    // Check if VDI exists
    await fs.access(CONFIG.vdiFile);
    const stats = await fs.stat(CONFIG.vdiFile);
    console.log(`📦 VDI File: ${CONFIG.vdiFile}`);
    console.log(`📦 Size: ${(stats.size / 1024 / 1024 / 1024).toFixed(2)}GB\n`);
    
    // Check available tools
    const hasVBox = await checkVBoxTools();
    
    // Mount VDI
    const mounted = await mountVDI();
    if (!mounted) {
      console.log('\n❌ Could not mount VDI file');
      console.log('💡 Try installing VirtualBox tools or FUSE for macOS');
      return;
    }
    
    // Search for files
    const files = await searchVDI();
    
    if (files.length === 0) {
      console.log('\n⚠️ No WIS files found in VDI');
    } else {
      // Extract files
      await extractFiles(files);
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    // Always try to unmount
    await unmountVDI();
  }
}

// Handle interruption
process.on('SIGINT', async () => {
  console.log('\n⚠️ Interrupted, cleaning up...');
  await unmountVDI();
  process.exit(0);
});

// Run
main().catch(console.error);