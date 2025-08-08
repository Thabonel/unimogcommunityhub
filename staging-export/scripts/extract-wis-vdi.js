#!/usr/bin/env node

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);
const WORK_DIR = path.join(process.cwd(), 'wis-extraction');

console.log('🚀 WIS EPC VDI Extraction\n');
console.log('📊 Archive contains:');
console.log('   - MERCEDES.vdi (53.5 GB) - VirtualBox disk image');
console.log('   - MERCEDES.vbox - VirtualBox configuration');
console.log('   - VirtualBox installer and extension pack\n');

async function extractVDI() {
  console.log('🎯 Options for accessing WIS EPC data:\n');
  
  console.log('1️⃣  Option A: Extract VDI and mount (Recommended)');
  console.log('   - Extract the 53.5GB VDI file');
  console.log('   - Mount it to access Windows filesystem');
  console.log('   - Extract WIS/EPC data directly\n');
  
  console.log('2️⃣  Option B: Use existing VirtualBox');
  console.log('   - Import the VM into VirtualBox');
  console.log('   - Boot Windows and access WIS');
  console.log('   - Extract data from running system\n');
  
  console.log('3️⃣  Option C: Quick sample extraction');
  console.log('   - Extract small portion for testing');
  console.log('   - Understand data structure');
  console.log('   - Plan full extraction\n');
  
  // For now, let's do a quick extraction to understand the structure
  console.log('📦 Starting Option C: Quick sample extraction...\n');
  
  try {
    // Extract just the VirtualBox configuration to understand the VM
    console.log('1. Extracting VirtualBox configuration...');
    const extractCmd = `cd "${WORK_DIR}" && 7z e Mercedes09.7z.001 MERCEDES.vbox -y`;
    await execAsync(extractCmd);
    console.log('✅ Extracted MERCEDES.vbox\n');
    
    // Read the vbox file to understand the VM configuration
    const vboxContent = await fs.readFile(path.join(WORK_DIR, 'MERCEDES.vbox'), 'utf8');
    
    // Parse some key information
    const osMatch = vboxContent.match(/OSType="([^"]+)"/);
    const memMatch = vboxContent.match(/memoryMB="([^"]+)"/);
    
    console.log('📋 VM Configuration:');
    console.log(`   OS Type: ${osMatch ? osMatch[1] : 'Unknown'}`);
    console.log(`   Memory: ${memMatch ? memMatch[1] : 'Unknown'} MB`);
    console.log(`   Disk: MERCEDES.vdi (53.5 GB)\n`);
    
    // Create extraction plan
    console.log('📋 Full Extraction Plan:\n');
    console.log('Step 1: Extract VDI file (requires 54GB free space)');
    console.log('   7z e Mercedes09.7z.001 MERCEDES.vdi\n');
    
    console.log('Step 2: Convert VDI to raw format');
    console.log('   VBoxManage clonehd MERCEDES.vdi MERCEDES.raw --format RAW\n');
    
    console.log('Step 3: Mount the raw disk');
    console.log('   hdiutil attach -imagekey diskimage-class=CRawDiskImage MERCEDES.raw\n');
    
    console.log('Step 4: Access WIS/EPC data');
    console.log('   - Navigate to mounted volume');
    console.log('   - Find WIS/EPC installation');
    console.log('   - Extract data files\n');
    
    // Save extraction script
    const extractScript = `#!/bin/bash
# WIS EPC Full Extraction Script

WORK_DIR="${WORK_DIR}"
cd "$WORK_DIR"

echo "🚀 Starting WIS EPC extraction..."
echo "⚠️  This will use ~54GB of disk space"
echo ""

# Check disk space
AVAILABLE=$(df -g . | awk 'NR==2 {print $4}')
if [ $AVAILABLE -lt 60 ]; then
    echo "❌ Not enough disk space. Need at least 60GB free."
    exit 1
fi

# Extract VDI
echo "📦 Extracting VDI file (this will take 10-20 minutes)..."
7z e Mercedes09.7z.001 MERCEDES.vdi -y

# Check if VirtualBox is installed
if command -v VBoxManage &> /dev/null; then
    echo "✅ VirtualBox found"
    
    # Option to convert to RAW
    echo ""
    echo "Convert to RAW format for mounting? (y/n)"
    read -n 1 CONVERT
    
    if [ "$CONVERT" = "y" ]; then
        echo "🔄 Converting to RAW format..."
        VBoxManage clonehd MERCEDES.vdi MERCEDES.raw --format RAW
        
        echo "🔗 Mounting RAW disk..."
        hdiutil attach -imagekey diskimage-class=CRawDiskImage MERCEDES.raw
        
        echo "✅ Disk mounted. Check /Volumes for Windows partition"
    fi
else
    echo "⚠️  VirtualBox not found. Install it to convert VDI."
fi

echo ""
echo "✅ Extraction complete!"
`;
    
    await fs.writeFile(path.join(WORK_DIR, 'extract-full.sh'), extractScript, { mode: 0o755 });
    console.log('💾 Created extraction script: wis-extraction/extract-full.sh\n');
    
    // Alternative approach
    console.log('🔄 Alternative: Direct data extraction\n');
    console.log('Since this is a Windows VM with WIS installed, we can:');
    console.log('1. Run the VM in VirtualBox');
    console.log('2. Share a folder between host and VM');
    console.log('3. Copy WIS data to shared folder');
    console.log('4. Process and upload to Supabase\n');
    
    console.log('✅ Analysis complete!\n');
    console.log('📌 To proceed:');
    console.log('1. Run: ./wis-extraction/extract-full.sh');
    console.log('2. Or import VM into VirtualBox');
    console.log('3. Access WIS data and export');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

extractVDI();