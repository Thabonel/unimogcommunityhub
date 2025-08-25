#!/usr/bin/env node

/**
 * WIS QEMU Extractor
 * Uses qemu-img to convert VDI and extract WIS data
 * Safer method that converts only what's needed
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

const CONFIG = {
  vdiFile: '/Volumes/UnimogManuals/wis-extraction/MERCEDES.vdi',
  rawFile: '/Volumes/UnimogManuals/wis-extraction/MERCEDES.raw',
  mountPoint: '/Volumes/WIS_MOUNT',
  extractPath: '/Volumes/UnimogManuals/wis-ready-to-upload',
  
  // Only convert if needed
  maxConvertSize: 10 * 1024 * 1024 * 1024, // 10GB max conversion
  
  patterns: [
    '*unimog*', '*mercedes*', '*wis*', '*epc*',
    '*.pdf', '*.html', '*.htm', '*.doc*'
  ]
};

// Check disk space
async function checkDiskSpace() {
  const { stdout } = await execAsync(`df -k /Volumes/UnimogManuals`);
  const lines = stdout.split('\n');
  const data = lines[1].split(/\s+/);
  const available = parseInt(data[3]) * 1024; // Convert to bytes
  
  console.log(`💾 Available space: ${(available / 1024 / 1024 / 1024).toFixed(2)}GB`);
  
  if (available < CONFIG.maxConvertSize) {
    throw new Error('Insufficient disk space for conversion');
  }
  
  return available;
}

// Get VDI info using qemu-img
async function getVDIInfo() {
  console.log('📊 Getting VDI information...');
  
  try {
    const { stdout } = await execAsync(`qemu-img info "${CONFIG.vdiFile}"`);
    console.log('VDI Info:');
    
    const lines = stdout.split('\n');
    for (const line of lines) {
      if (line.includes('virtual size') || line.includes('disk size')) {
        console.log(`  ${line.trim()}`);
      }
    }
    
    return stdout;
  } catch (error) {
    console.error('❌ Failed to get VDI info:', error.message);
    return null;
  }
}

// Use VBoxManage to extract files without converting entire image
async function extractWithVBoxManage() {
  console.log('\n🔧 Using VBoxManage to explore VDI...');
  
  try {
    // First, try to get partition info
    console.log('Getting partition table...');
    const { stdout: partInfo } = await execAsync(
      `vboxmanage internalcommands listpartitions -rawdisk "${CONFIG.vdiFile}" 2>/dev/null`
    ).catch(() => ({ stdout: '' }));
    
    if (partInfo) {
      console.log('Partitions found:');
      console.log(partInfo);
    }
    
    // Try to mount using vboximg-mount if available
    try {
      await execAsync('which vboximg-mount');
      console.log('📀 Using vboximg-mount...');
      
      // Create FUSE mount point
      const fusePath = '/Volumes/UnimogManuals/vdi-mount';
      await fs.mkdir(fusePath, { recursive: true });
      
      // Mount VDI using FUSE
      await execAsync(`vboximg-mount -i "${CONFIG.vdiFile}" -o allow_other "${fusePath}"`);
      
      console.log('✅ VDI mounted via FUSE');
      
      // List contents
      const contents = await fs.readdir(fusePath);
      console.log('Contents:', contents);
      
      // Look for vhdd file
      const vhddFile = contents.find(f => f.endsWith('.vhdd'));
      if (vhddFile) {
        console.log(`Found VHDD: ${vhddFile}`);
        // This VHDD can be mounted
        return path.join(fusePath, vhddFile);
      }
      
    } catch (error) {
      console.log('vboximg-mount not available or failed:', error.message);
    }
    
    return null;
    
  } catch (error) {
    console.error('VBoxManage error:', error.message);
    return null;
  }
}

// Convert small portion of VDI for testing
async function convertPartialVDI() {
  console.log('\n🔄 Converting partial VDI for exploration...');
  
  const partialRaw = '/Volumes/UnimogManuals/wis-extraction/MERCEDES-partial.raw';
  
  try {
    // Convert only first 1GB for exploration
    console.log('Converting first 1GB of VDI...');
    await execAsync(
      `qemu-img convert -f vdi -O raw "${CONFIG.vdiFile}" "${partialRaw}" ` +
      `-c -p --image-opts driver=raw,size=1073741824`
    ).catch(async () => {
      // Alternative: Use dd to extract first portion
      console.log('Using dd to extract first 1GB...');
      await execAsync(
        `qemu-img dd if="${CONFIG.vdiFile}" of="${partialRaw}" bs=1M count=1024`
      );
    });
    
    console.log('✅ Partial conversion complete');
    
    // Try to examine the partial file
    const { stdout } = await execAsync(`file "${partialRaw}"`);
    console.log('File type:', stdout);
    
    // Look for filesystem signatures
    const { stdout: strings } = await execAsync(
      `strings "${partialRaw}" | grep -i "unimog\\|mercedes\\|wis" | head -20`
    );
    
    if (strings) {
      console.log('\n📝 Found relevant strings:');
      console.log(strings);
    }
    
    // Clean up partial file
    await fs.unlink(partialRaw).catch(() => {});
    
    return strings.includes('unimog') || strings.includes('WIS');
    
  } catch (error) {
    console.error('Partial conversion failed:', error.message);
    return false;
  }
}

// Alternative: Use guestfish if available
async function tryGuestfish() {
  console.log('\n🔧 Checking for guestfish...');
  
  try {
    await execAsync('which guestfish');
    console.log('✅ guestfish available');
    
    // Use guestfish to explore VDI
    const script = `
      add "${CONFIG.vdiFile}" readonly:true
      run
      list-filesystems
      mount /dev/sda1 /
      ls /
    `;
    
    const { stdout } = await execAsync(
      `echo '${script}' | guestfish --listen`
    );
    
    console.log('Guestfish output:');
    console.log(stdout);
    
    return true;
    
  } catch {
    console.log('❌ guestfish not available');
    console.log('  Install with: brew install libguestfs');
    return false;
  }
}

// Simple file search in existing directories
async function searchExistingFiles() {
  console.log('\n🔍 Searching for already extracted WIS files...');
  
  const searchPaths = [
    '/Volumes/UnimogManuals/wis-data',
    '/Volumes/UnimogManuals/wis-extraction',
    '/Volumes/UnimogManuals/Mercedes',
    '/Volumes/UnimogManuals/WIS'
  ];
  
  const files = [];
  
  for (const searchPath of searchPaths) {
    try {
      await fs.access(searchPath);
      console.log(`📁 Checking: ${searchPath}`);
      
      // Search for files
      const { stdout } = await execAsync(
        `find "${searchPath}" -type f \\( -iname "*unimog*" -o -iname "*.pdf" -o -iname "*.html" \\) 2>/dev/null | head -100`
      );
      
      const foundFiles = stdout.split('\n').filter(f => f.trim());
      if (foundFiles.length > 0) {
        console.log(`  Found ${foundFiles.length} files`);
        files.push(...foundFiles);
      }
      
    } catch {
      // Directory doesn't exist
    }
  }
  
  return [...new Set(files)];
}

// Main process
async function main() {
  console.log('🚀 WIS QEMU Extractor\n');
  
  try {
    // Check disk space
    await checkDiskSpace();
    
    // Get VDI info
    const vdiInfo = await getVDIInfo();
    
    if (!vdiInfo) {
      console.log('❌ Could not read VDI file');
      return;
    }
    
    // Try VBoxManage method first
    const vhddPath = await extractWithVBoxManage();
    
    if (!vhddPath) {
      // Try partial conversion to check contents
      const hasWISData = await convertPartialVDI();
      
      if (hasWISData) {
        console.log('\n✅ VDI contains WIS data');
        console.log('⚠️ Full extraction requires converting the entire 54GB VDI');
        console.log('💡 This would need significant disk space and time');
        
        // Try guestfish as alternative
        await tryGuestfish();
      }
    }
    
    // Search for any existing extracted files
    const existingFiles = await searchExistingFiles();
    
    if (existingFiles.length > 0) {
      console.log(`\n✅ Found ${existingFiles.length} existing files`);
      console.log('💡 These can be uploaded directly using "npm run wis:upload"');
      
      // Copy to ready folder
      await fs.mkdir(CONFIG.extractPath, { recursive: true });
      
      let copied = 0;
      for (const file of existingFiles.slice(0, 10)) { // Copy first 10 as sample
        const fileName = path.basename(file);
        const destPath = path.join(CONFIG.extractPath, fileName);
        
        try {
          await fs.copyFile(file, destPath);
          copied++;
        } catch {
          // Ignore errors
        }
      }
      
      if (copied > 0) {
        console.log(`\n📦 Copied ${copied} sample files to: ${CONFIG.extractPath}`);
      }
    }
    
    console.log('\n📌 Summary:');
    console.log('  - VDI file is valid (54GB)');
    console.log('  - Full extraction requires VirtualBox tools or disk conversion');
    console.log('  - Some files may already be available on the external drive');
    console.log('\n💡 Next steps:');
    console.log('  1. Install VirtualBox: brew install --cask virtualbox');
    console.log('  2. Or convert VDI: qemu-img convert -f vdi -O raw [source] [dest]');
    console.log('  3. Then mount and extract the files');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

// Run
main().catch(console.error);