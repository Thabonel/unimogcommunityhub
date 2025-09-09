#!/usr/bin/env node

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);
const EXTRACT_PATH = '/Volumes/EDIT/wis-extraction';

console.log('🔍 Diagnosing WIS Extraction Issues\n');

async function checkFilesystem() {
  console.log('📁 Filesystem Analysis:');
  
  // Check mount info
  const { stdout: mountInfo } = await execAsync('mount | grep EDIT');
  console.log(`   Mount: ${mountInfo.trim()}`);
  
  // Check filesystem type and options
  if (mountInfo.includes('exfat')) {
    console.log('   ⚠️  exFAT filesystem detected!');
    console.log('   📝 exFAT limitations:');
    console.log('      - File size limit: 16 EB (not the issue)');
    console.log('      - But may have issues with very large operations');
    console.log('      - Poor performance with large sequential writes');
  }
  
  console.log('');
}

async function checkDiskUsage() {
  console.log('💾 Disk Space Analysis:');
  
  const { stdout: diskInfo } = await execAsync('df -h /Volumes/EDIT/');
  console.log(diskInfo);
  
  // Check if there are other large files taking space
  try {
    const { stdout: largeFiles } = await execAsync('find /Volumes/EDIT/ -size +1G 2>/dev/null | head -10');
    if (largeFiles.trim()) {
      console.log('\n📊 Large files on drive:');
      console.log(largeFiles);
    }
  } catch {
    // Ignore errors
  }
  
  console.log('');
}

async function checkArchiveIntegrity() {
  console.log('📦 Archive Analysis:');
  
  // Check if all parts are accessible
  for (let i = 1; i <= 4; i++) {
    const partPath = path.join(EXTRACT_PATH, `Mercedes09.7z.00${i}`);
    try {
      const stats = await fs.lstat(partPath);
      if (stats.isSymbolicLink()) {
        const target = await fs.readlink(partPath);
        console.log(`   Part ${i}: Linked to ${target}`);
        
        // Check if target exists
        try {
          await fs.stat(target);
          console.log(`   ✅ Target accessible`);
        } catch {
          console.log(`   ❌ Target not accessible!`);
        }
      }
    } catch (error) {
      console.log(`   ❌ Part ${i}: ${error.message}`);
    }
  }
  
  console.log('');
}

async function checkCurrentVDI() {
  console.log('🔧 Current VDI Analysis:');
  
  const vdiPath = path.join(EXTRACT_PATH, 'MERCEDES.vdi');
  try {
    const stats = await fs.stat(vdiPath);
    const sizeGB = (stats.size / 1024 / 1024 / 1024).toFixed(2);
    const progress = ((stats.size / (53.5 * 1024 * 1024 * 1024)) * 100).toFixed(1);
    
    console.log(`   Size: ${sizeGB} GB (${progress}%)`);
    console.log(`   Modified: ${stats.mtime}`);
    
    // Check if file is still growing
    console.log('   ⏱️  Checking if file is still growing...');
    const size1 = stats.size;
    await new Promise(resolve => setTimeout(resolve, 5000));
    const stats2 = await fs.stat(vdiPath);
    const size2 = stats2.size;
    
    if (size2 > size1) {
      console.log(`   ✅ File is growing! (+${((size2 - size1) / 1024 / 1024).toFixed(2)} MB in 5 seconds)`);
    } else {
      console.log(`   ⚠️  File is not growing`);
    }
    
  } catch (error) {
    console.log(`   ❌ ${error.message}`);
  }
  
  console.log('');
}

async function suggestSolutions() {
  console.log('💡 Recommended Solutions:\n');
  
  console.log('1. **Use APFS/HFS+ Drive** (Best):');
  console.log('   - Format a drive with APFS or HFS+');
  console.log('   - These filesystems handle large operations better');
  console.log('');
  
  console.log('2. **Extract to RAM Disk** (Fast but limited):');
  console.log('   - Create 60GB RAM disk: diskutil erasevolume HFS+ "RamDisk" `hdiutil attach -nomount ram://125829120`');
  console.log('   - Extract there, then copy to final location');
  console.log('');
  
  console.log('3. **Use Different Tool**:');
  console.log('   - Try: unzip, tar, or different 7z settings');
  console.log('   - Command: 7z x Mercedes09.7z.001 -mmt=1 (single-threaded)');
  console.log('');
  
  console.log('4. **Extract in Smaller Chunks**:');
  console.log('   - Extract other files first, then VDI');
  console.log('   - Use: 7z x Mercedes09.7z.001 -x!MERCEDES.vdi');
  console.log('');
  
  console.log('5. **Use VM Direct Access**:');
  console.log('   - Import partial VDI into VirtualBox');
  console.log('   - If it boots, copy data from running system');
  console.log('');
}

async function runDiagnostics() {
  try {
    await checkFilesystem();
    await checkDiskUsage();
    await checkArchiveIntegrity();
    await checkCurrentVDI();
    await suggestSolutions();
  } catch (error) {
    console.error('❌ Diagnostic error:', error.message);
  }
}

// Run diagnostics
runDiagnostics();