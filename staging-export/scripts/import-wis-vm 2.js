#!/usr/bin/env node

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

const EXTRACT_PATH = '/Volumes/EDIT/wis-extraction';
const ARCHIVE_PATH = '/Volumes/EDIT/UNIMOG MANUALS/BIG UNIMOG MANUALS';

console.log('🚀 WIS VM Import Alternative\n');
console.log('This approach imports the VM into VirtualBox directly.\n');

async function extractVMFiles() {
  console.log('📦 Extracting VM configuration files...\n');
  
  try {
    // Link archive parts
    for (let i = 1; i <= 4; i++) {
      const source = path.join(ARCHIVE_PATH, `Benz${i}/Mercedes09.7z.00${i}`);
      const target = path.join(EXTRACT_PATH, `Mercedes09.7z.00${i}`);
      
      try {
        await fs.unlink(target).catch(() => {});
        await fs.symlink(source, target);
      } catch (error) {
        console.error(`Failed to link part ${i}:`, error.message);
      }
    }
    
    // Extract just the .vbox file first
    console.log('📋 Extracting VM configuration...');
    await execAsync(`cd "${EXTRACT_PATH}" && 7z e Mercedes09.7z.001 MERCEDES.vbox -y`);
    console.log('✅ Extracted MERCEDES.vbox\n');
    
    // Read vbox configuration
    const vboxPath = path.join(EXTRACT_PATH, 'MERCEDES.vbox');
    const vboxContent = await fs.readFile(vboxPath, 'utf8');
    
    // Extract key info
    const nameMatch = vboxContent.match(/name="([^"]+)"/);
    const osMatch = vboxContent.match(/OSType="([^"]+)"/);
    
    console.log('📋 VM Configuration:');
    console.log(`   Name: ${nameMatch ? nameMatch[1] : 'MERCEDES'}`);
    console.log(`   OS: ${osMatch ? osMatch[1] : 'Windows7'}`);
    console.log(`   Disk: MERCEDES.vdi (53.5 GB)\n`);
    
    return true;
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

async function importVM() {
  console.log('🔧 Import Options:\n');
  
  console.log('Option 1: Direct Import (Recommended)');
  console.log('----------------------------------------');
  console.log('1. Open VirtualBox');
  console.log('2. File → Import Appliance');
  console.log(`3. Browse to: ${EXTRACT_PATH}`);
  console.log('4. Select MERCEDES.vbox');
  console.log('5. The VM will use the VDI from the archive directly\n');
  
  console.log('Option 2: Command Line Import');
  console.log('----------------------------------------');
  console.log('Run these commands:');
  console.log(`cd "${EXTRACT_PATH}"`);
  console.log('VBoxManage import MERCEDES.vbox\n');
  
  console.log('Option 3: Extract Everything First');
  console.log('----------------------------------------');
  console.log('If import fails, extract all files:');
  console.log(`cd "${EXTRACT_PATH}"`);
  console.log('7z x Mercedes09.7z.001 -y\n');
  
  return true;
}

async function setupSharedFolder() {
  console.log('📁 Setting Up Data Extraction:\n');
  
  console.log('After importing the VM:');
  console.log('----------------------------------------');
  console.log('1. Create extraction folder:');
  console.log(`   mkdir "${EXTRACT_PATH}/wis-data"\n`);
  
  console.log('2. Configure shared folder in VirtualBox:');
  console.log('   - Select the VM → Settings → Shared Folders');
  console.log(`   - Add folder: ${EXTRACT_PATH}/wis-data`);
  console.log('   - Name: wis-export');
  console.log('   - Auto-mount: Yes\n');
  
  console.log('3. Start the VM and access shared folder:');
  console.log('   - In Windows: \\\\VBOXSVR\\wis-export');
  console.log('   - Or map as network drive\n');
  
  console.log('4. Copy WIS data to shared folder:');
  console.log('   - C:\\Program Files\\Mercedes-Benz\\WIS → wis-export\\WIS');
  console.log('   - C:\\Program Files\\Mercedes-Benz\\EPC → wis-export\\EPC');
  console.log('   - C:\\Program Files\\Mercedes-Benz\\WDS → wis-export\\WDS\n');
}

async function main() {
  try {
    console.log('This method avoids extracting the 53.5GB VDI file.\n');
    
    // Check if VirtualBox is installed
    try {
      await execAsync('which VBoxManage');
      console.log('✅ VirtualBox is installed\n');
    } catch {
      console.error('❌ VirtualBox not found!');
      console.log('   Install from: https://www.virtualbox.org/wiki/Downloads\n');
      return;
    }
    
    // Extract VM configuration
    const extracted = await extractVMFiles();
    if (!extracted) return;
    
    // Show import instructions
    await importVM();
    
    // Show data extraction setup
    await setupSharedFolder();
    
    console.log('✅ Ready to import!\n');
    console.log('💡 Benefits of this approach:');
    console.log('   - No need to extract 53.5GB VDI');
    console.log('   - Can access WIS directly from Windows');
    console.log('   - Easy to copy specific data');
    console.log('   - Can run WIS to verify data');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

main();