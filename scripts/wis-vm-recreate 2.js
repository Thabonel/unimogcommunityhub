#!/usr/bin/env node
/**
 * WIS VM Recreation Script
 * 
 * Creates a new VM configuration using the existing VDI file
 */

import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

class WISVMRecreator {
  constructor() {
    this.config = {
      vmName: 'WIS_Mercedes',
      vdiPath: '/Volumes/UnimogManuals/wis-extraction/MERCEDES.vdi',
      osType: 'Windows7',
      memory: 2048,
      vram: 128
    };
  }

  async log(message) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
  }

  async run() {
    try {
      await this.log('🚀 Starting WIS VM Recreation');
      
      // Step 1: Check if old VM exists and remove it
      await this.removeOldVM();
      
      // Step 2: Create new VM
      await this.createNewVM();
      
      // Step 3: Configure VM settings
      await this.configureVM();
      
      // Step 4: Attach VDI
      await this.attachVDI();
      
      // Step 5: Start VM
      await this.startVM();
      
      await this.log('✅ VM recreation completed successfully');
      
    } catch (error) {
      await this.log(`💥 VM recreation failed: ${error.message}`);
      throw error;
    }
  }

  async removeOldVM() {
    await this.log('🗑️ Checking for existing VM...');
    
    try {
      // Check if VM exists
      await execAsync(`VBoxManage showvminfo "${this.config.vmName}"`, { timeout: 5000 });
      
      // VM exists, remove it
      await this.log('Removing existing VM...');
      
      // Power off if running
      await execAsync(`VBoxManage controlvm "${this.config.vmName}" poweroff`, { timeout: 5000 }).catch(() => {});
      
      // Unregister and delete
      await execAsync(`VBoxManage unregistervm "${this.config.vmName}" --delete`, { timeout: 10000 });
      
      await this.log('✅ Old VM removed');
      
    } catch (error) {
      // VM doesn't exist, which is fine
      await this.log('No existing VM found');
    }
  }

  async createNewVM() {
    await this.log('🔨 Creating new VM...');
    
    const createCmd = `VBoxManage createvm --name "${this.config.vmName}" --ostype "${this.config.osType}" --register`;
    await this.log(`Executing: ${createCmd}`);
    
    const { stdout, stderr } = await execAsync(createCmd, { timeout: 10000 });
    if (stdout) await this.log(stdout);
    if (stderr && !stderr.includes('already exists')) await this.log(stderr);
    
    await this.log('✅ VM created');
  }

  async configureVM() {
    await this.log('⚙️ Configuring VM settings...');
    
    const settings = [
      `modifyvm "${this.config.vmName}" --memory ${this.config.memory}`,
      `modifyvm "${this.config.vmName}" --vram ${this.config.vram}`,
      `modifyvm "${this.config.vmName}" --acpi on`,
      `modifyvm "${this.config.vmName}" --ioapic on`,
      `modifyvm "${this.config.vmName}" --cpus 1`,
      `modifyvm "${this.config.vmName}" --pae on`,
      `modifyvm "${this.config.vmName}" --hwvirtex on`,
      `modifyvm "${this.config.vmName}" --nestedpaging on`,
      `modifyvm "${this.config.vmName}" --largepages on`,
      `modifyvm "${this.config.vmName}" --clipboard bidirectional`,
      `modifyvm "${this.config.vmName}" --draganddrop bidirectional`,
      `modifyvm "${this.config.vmName}" --audio none`,
      `modifyvm "${this.config.vmName}" --usb on`,
      `modifyvm "${this.config.vmName}" --usbehci on`
    ];
    
    for (const setting of settings) {
      try {
        await execAsync(`VBoxManage ${setting}`, { timeout: 5000 });
        await this.log(`✓ ${setting.split(' ').slice(2).join(' ')}`);
      } catch (error) {
        await this.log(`⚠️ Failed: ${setting} - ${error.message}`);
      }
    }
    
    await this.log('✅ VM configured');
  }

  async attachVDI() {
    await this.log('💿 Attaching VDI file...');
    
    // Create storage controller
    await execAsync(`VBoxManage storagectl "${this.config.vmName}" --name "IDE Controller" --add ide`, { timeout: 5000 });
    
    // Attach VDI
    const attachCmd = `VBoxManage storageattach "${this.config.vmName}" --storagectl "IDE Controller" --port 0 --device 0 --type hdd --medium "${this.config.vdiPath}"`;
    await this.log(`Executing: ${attachCmd}`);
    
    await execAsync(attachCmd, { timeout: 10000 });
    
    await this.log('✅ VDI attached');
  }

  async startVM() {
    await this.log('🚀 Starting VM...');
    
    await this.log('');
    await this.log('📌 IMPORTANT: The VM will start now.');
    await this.log('   Please wait for Windows to boot completely.');
    await this.log('   Then navigate to the WIS application.');
    await this.log('');
    
    try {
      const startCmd = `VBoxManage startvm "${this.config.vmName}" --type gui`;
      const { stdout } = await execAsync(startCmd, { timeout: 30000 });
      
      await this.log('✅ VM started successfully!');
      await this.log('');
      await this.log('📋 Next Steps:');
      await this.log('   1. Wait for Windows to boot');
      await this.log('   2. Look for WIS icon on desktop');
      await this.log('   3. Launch WIS application');
      await this.log('   4. Navigate to visual content sections');
      await this.log('   5. Export diagrams using Print to PDF');
      
    } catch (error) {
      await this.log(`⚠️ Could not start VM: ${error.message}`);
      await this.log('');
      await this.log('Try starting manually from VirtualBox GUI');
    }
  }
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const recreator = new WISVMRecreator();
  recreator.run().catch(console.error);
}

export default WISVMRecreator;