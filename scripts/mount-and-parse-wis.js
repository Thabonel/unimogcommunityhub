#!/usr/bin/env node

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

const EXTRACT_PATH = '/Volumes/EDIT/wis-extraction';
const VDI_PATH = path.join(EXTRACT_PATH, 'MERCEDES.vdi');
const MOUNT_PATH = path.join(EXTRACT_PATH, 'wis-mount');

console.log('🚀 WIS VDI Mount and Parse\n');

async function checkVirtualBox() {
  console.log('🔍 Checking VirtualBox installation...');
  try {
    await execAsync('which VBoxManage');
    console.log('✅ VirtualBox is installed\n');
    return true;
  } catch {
    console.error('❌ VirtualBox not found!');
    console.log('   Install from: https://www.virtualbox.org/wiki/Downloads\n');
    return false;
  }
}

async function mountVDI() {
  console.log('🔗 Mounting VDI file...\n');
  
  try {
    // Create mount directory
    await fs.mkdir(MOUNT_PATH, { recursive: true });
    
    // Option 1: Try to mount directly with hdiutil (macOS)
    console.log('Method 1: Trying direct mount with hdiutil...');
    try {
      const { stdout } = await execAsync(`hdiutil attach "${VDI_PATH}" -mountpoint "${MOUNT_PATH}"`);
      console.log('✅ Mounted successfully!');
      console.log(stdout);
      return true;
    } catch (error) {
      console.log('❌ Direct mount failed:', error.message);
    }
    
    // Option 2: Convert to raw format first
    console.log('\nMethod 2: Converting to raw format...');
    const rawPath = path.join(EXTRACT_PATH, 'MERCEDES.raw');
    
    // Check if already converted
    try {
      await fs.stat(rawPath);
      console.log('✅ Raw file already exists');
    } catch {
      console.log('🔄 Converting VDI to raw (this may take 10-15 minutes)...');
      await execAsync(`VBoxManage clonehd "${VDI_PATH}" "${rawPath}" --format RAW`);
      console.log('✅ Conversion complete');
    }
    
    // Mount the raw file
    console.log('🔗 Mounting raw disk image...');
    const { stdout } = await execAsync(`hdiutil attach -imagekey diskimage-class=CRawDiskImage "${rawPath}" -nomount`);
    console.log('✅ Disk attached:', stdout);
    
    // Find Windows partition
    const diskInfo = await execAsync('diskutil list');
    console.log('\n📋 Available disks:');
    console.log(diskInfo.stdout);
    
    return true;
  } catch (error) {
    console.error('❌ Mount error:', error.message);
    return false;
  }
}

async function findWISData() {
  console.log('\n🔍 Searching for WIS data...\n');
  
  // Common WIS installation paths
  const wisPatterns = [
    'Program Files/Mercedes-Benz/WIS',
    'Program Files (x86)/Mercedes-Benz/WIS',
    'Mercedes/WIS',
    'WIS',
    'EPC',
    'WDS'
  ];
  
  // If mounted, search for WIS directories
  try {
    const volumes = await fs.readdir('/Volumes');
    console.log('📁 Mounted volumes:', volumes);
    
    for (const volume of volumes) {
      if (volume.includes('Windows') || volume.includes('MERCEDES')) {
        console.log(`\n🔍 Checking volume: ${volume}`);
        const volumePath = `/Volumes/${volume}`;
        
        for (const pattern of wisPatterns) {
          const checkPath = path.join(volumePath, pattern);
          try {
            await fs.stat(checkPath);
            console.log(`✅ Found: ${checkPath}`);
            return checkPath;
          } catch {
            // Not found, continue
          }
        }
      }
    }
  } catch (error) {
    console.error('❌ Error searching volumes:', error.message);
  }
  
  return null;
}

async function analyzeWISStructure(wisPath) {
  console.log(`\n📊 Analyzing WIS structure at: ${wisPath}\n`);
  
  try {
    const contents = await fs.readdir(wisPath);
    console.log('📁 WIS directories:', contents);
    
    // Look for key WIS components
    const components = {
      procedures: null,
      parts: null,
      wiring: null,
      bulletins: null
    };
    
    for (const dir of contents) {
      const dirPath = path.join(wisPath, dir);
      const stats = await fs.stat(dirPath);
      
      if (stats.isDirectory()) {
        const upperDir = dir.toUpperCase();
        
        if (upperDir.includes('WIS') || upperDir.includes('WORKSHOP')) {
          components.procedures = dirPath;
        } else if (upperDir.includes('EPC') || upperDir.includes('PARTS')) {
          components.parts = dirPath;
        } else if (upperDir.includes('WDS') || upperDir.includes('WIRING')) {
          components.wiring = dirPath;
        } else if (upperDir.includes('TSB') || upperDir.includes('BULLETIN')) {
          components.bulletins = dirPath;
        }
      }
    }
    
    console.log('\n✅ Found components:');
    Object.entries(components).forEach(([key, value]) => {
      console.log(`   ${key}: ${value || 'Not found'}`);
    });
    
    return components;
  } catch (error) {
    console.error('❌ Error analyzing structure:', error.message);
    return null;
  }
}

async function main() {
  try {
    // Check prerequisites
    const hasVBox = await checkVirtualBox();
    if (!hasVBox) {
      console.log('💡 Alternative: Import the VM into VirtualBox and access data from running system');
      return;
    }
    
    // Check if VDI exists
    try {
      const stats = await fs.stat(VDI_PATH);
      console.log(`📦 VDI found: ${(stats.size / 1024 / 1024 / 1024).toFixed(2)} GB\n`);
    } catch {
      console.error('❌ VDI not found at:', VDI_PATH);
      console.log('   Run extract-wis-full.js first');
      return;
    }
    
    // Mount VDI
    const mounted = await mountVDI();
    if (!mounted) {
      console.log('\n💡 Alternative approach:');
      console.log('1. Import MERCEDES.vbox into VirtualBox');
      console.log('2. Start the VM');
      console.log('3. Share a folder between host and VM');
      console.log('4. Copy WIS data to shared folder');
      return;
    }
    
    // Find WIS data
    const wisPath = await findWISData();
    if (!wisPath) {
      console.log('\n⚠️  Could not find WIS data automatically');
      console.log('   Please check mounted volumes manually');
      return;
    }
    
    // Analyze structure
    const components = await analyzeWISStructure(wisPath);
    if (!components) {
      return;
    }
    
    console.log('\n✅ Ready to parse WIS data!');
    console.log('\n📋 Next steps:');
    console.log('1. Parse procedures and convert to JSON');
    console.log('2. Extract parts catalog');
    console.log('3. Process wiring diagrams');
    console.log('4. Upload to Supabase');
    console.log('\nRun: node scripts/parse-wis-data.js');
    
  } catch (error) {
    console.error('❌ Fatal error:', error);
  }
}

// Run mount and parse
main();