#!/usr/bin/env node
/**
 * WIS VirtualBox VM Explorer
 * 
 * This script manages the existing Mercedes WIS VM to explore and extract visual content
 */

import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

class WISVMExplorer {
  constructor() {
    this.config = {
      vmName: 'MERCEDES',
      outputDir: './wis-visual-extraction',
      screenshotDir: './wis-visual-extraction/screenshots',
      logFile: './wis-visual-logs/vm-exploration.log'
    };
    
    this.vmInfo = {
      uuid: '90975e65-099c-4693-8f65-639a637f53eb',
      vdiPath: '/Volumes/UnimogManuals/wis-extraction/MERCEDES.vdi',
      state: null
    };
  }

  async log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log(logMessage);
    
    try {
      await fs.appendFile(this.config.logFile, logMessage + '\n');
    } catch (error) {
      console.warn('Log write warning:', error.message);
    }
  }

  async run() {
    try {
      await this.log('🚀 Starting WIS VM Explorer');
      
      // Step 1: Check VM state
      await this.checkVMState();
      
      // Step 2: Start VM if needed
      await this.startVM();
      
      // Step 3: Wait for VM to boot
      await this.waitForBoot();
      
      // Step 4: Take screenshots for documentation
      await this.captureScreenshots();
      
      // Step 5: Extract shared folder content if available
      await this.checkSharedFolders();
      
      // Step 6: Generate exploration report
      await this.generateReport();
      
      await this.log('✅ VM exploration completed');
      
    } catch (error) {
      await this.log(`💥 VM exploration failed: ${error.message}`);
      throw error;
    }
  }

  async checkVMState() {
    await this.log('🔍 Checking VM state...');
    
    try {
      const { stdout } = await execAsync(`VBoxManage showvminfo "${this.config.vmName}" --machinereadable | grep "VMState="`, { timeout: 5000 });
      const stateMatch = stdout.match(/VMState="([^"]+)"/);
      
      if (stateMatch) {
        this.vmInfo.state = stateMatch[1];
        await this.log(`VM state: ${this.vmInfo.state}`);
      }
    } catch (error) {
      await this.log(`⚠️ Could not determine VM state: ${error.message}`);
      this.vmInfo.state = 'unknown';
    }
  }

  async startVM() {
    await this.log('🖥️ Starting VM...');
    
    if (this.vmInfo.state === 'running') {
      await this.log('✅ VM is already running');
      return;
    }
    
    try {
      // Start VM in headless mode
      const startCmd = `VBoxManage startvm "${this.config.vmName}" --type headless`;
      await this.log(`Executing: ${startCmd}`);
      
      const { stdout, stderr } = await execAsync(startCmd, { timeout: 30000 });
      if (stdout) await this.log(`Start output: ${stdout}`);
      if (stderr && !stderr.includes('already running')) {
        await this.log(`Start stderr: ${stderr}`);
      }
      
      await this.log('✅ VM started successfully');
      
    } catch (error) {
      if (error.message.includes('already running')) {
        await this.log('✅ VM is already running');
      } else {
        await this.log(`⚠️ Could not start VM: ${error.message}`);
        await this.log('');
        await this.log('📌 MANUAL STEPS REQUIRED:');
        await this.log('   1. Open VirtualBox GUI');
        await this.log('   2. Select "MERCEDES" VM');
        await this.log('   3. Click Start button');
        await this.log('   4. Wait for Windows to boot');
        await this.log('   5. Open WIS application');
        await this.log('   6. Navigate to visual content sections:');
        await this.log('      - Wiring Diagrams');
        await this.log('      - Exploded Views');
        await this.log('      - Component Locations');
        await this.log('      - Service Procedures');
        await this.log('   7. Use Print to PDF or screenshot tools');
        await this.log('   8. Save to shared folder or external drive');
        throw error;
      }
    }
  }

  async waitForBoot() {
    await this.log('⏳ Waiting for VM to boot...');
    
    let attempts = 0;
    const maxAttempts = 30; // Wait up to 5 minutes
    
    while (attempts < maxAttempts) {
      try {
        // Check if guest additions are running (indicates OS is booted)
        const { stdout } = await execAsync(`VBoxManage guestproperty get "${this.config.vmName}" "/VirtualBox/GuestInfo/OS/Product"`, { timeout: 5000 });
        
        if (!stdout.includes('No value set')) {
          await this.log('✅ VM has booted successfully');
          await this.log(`Guest OS: ${stdout}`);
          return;
        }
      } catch (error) {
        // VM still booting
      }
      
      await this.log(`Waiting for boot... (${attempts + 1}/${maxAttempts})`);
      await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
      attempts++;
    }
    
    await this.log('⚠️ VM boot timeout - proceeding anyway');
  }

  async captureScreenshots() {
    await this.log('📸 Capturing VM screenshots...');
    
    await fs.mkdir(this.config.screenshotDir, { recursive: true });
    
    try {
      // Take a screenshot
      const screenshotPath = path.join(this.config.screenshotDir, `wis-vm-${Date.now()}.png`);
      const screenshotCmd = `VBoxManage controlvm "${this.config.vmName}" screenshotpng "${screenshotPath}"`;
      
      await execAsync(screenshotCmd, { timeout: 10000 });
      await this.log(`✅ Screenshot saved: ${screenshotPath}`);
      
    } catch (error) {
      await this.log(`⚠️ Screenshot failed: ${error.message}`);
    }
  }

  async checkSharedFolders() {
    await this.log('📁 Checking for shared folders...');
    
    try {
      const { stdout } = await execAsync(`VBoxManage showvminfo "${this.config.vmName}" | grep "Shared folders:"`, { timeout: 5000 });
      await this.log(`Shared folders info: ${stdout}`);
      
      // Add a shared folder for extraction
      const sharedPath = path.resolve(this.config.outputDir);
      await fs.mkdir(sharedPath, { recursive: true });
      
      try {
        const addShareCmd = `VBoxManage sharedfolder add "${this.config.vmName}" --name "WISExtraction" --hostpath "${sharedPath}" --automount`;
        await execAsync(addShareCmd, { timeout: 5000 });
        await this.log(`✅ Shared folder added: ${sharedPath}`);
      } catch (error) {
        if (error.message.includes('already exists')) {
          await this.log('✅ Shared folder already exists');
        } else {
          await this.log(`⚠️ Could not add shared folder: ${error.message}`);
        }
      }
      
    } catch (error) {
      await this.log(`⚠️ Shared folder check failed: ${error.message}`);
    }
  }

  async generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      vmInfo: this.vmInfo,
      status: 'VM exploration completed',
      recommendations: [
        'VM is configured and ready for manual exploration',
        'Access WIS application within the VM',
        'Use shared folder for extracting content',
        'Consider using screen recording for documentation'
      ],
      manualSteps: {
        accessing_wis: [
          'Open VirtualBox GUI',
          'Double-click MERCEDES VM to open console',
          'Navigate to WIS application (usually on Desktop or Start Menu)',
          'Login if required (check documentation for credentials)'
        ],
        extracting_visuals: [
          'Navigate to visual content sections in WIS',
          'Use File → Export or Print → PDF for diagrams',
          'Save to E:\\ drive (shared folder) if available',
          'Use Windows Snipping Tool for screenshots',
          'Focus on: Wiring diagrams, Parts diagrams, Service procedures'
        ],
        categories_to_extract: [
          'Engine diagrams (M352, OM352, OM366)',
          'Transmission schematics (UG3/40, G28/G32)',
          'Axle assemblies (Portal axles)',
          'Hydraulic systems',
          'Electrical wiring',
          'Brake systems',
          'Steering components',
          'Body and chassis'
        ]
      }
    };
    
    const reportFile = path.join(this.config.outputDir, 'vm-exploration-report.json');
    await fs.writeFile(reportFile, JSON.stringify(report, null, 2));
    
    await this.log('\n📊 VM EXPLORATION REPORT:');
    await this.log(`   VM Name: ${this.config.vmName}`);
    await this.log(`   VM State: ${this.vmInfo.state}`);
    await this.log(`   VDI Path: ${this.vmInfo.vdiPath}`);
    await this.log(`   Report saved to: ${reportFile}`);
    await this.log('');
    await this.log('📌 NEXT STEPS:');
    await this.log('   1. Access VM through VirtualBox GUI');
    await this.log('   2. Navigate to WIS application');
    await this.log('   3. Export visual content to shared folder');
    await this.log('   4. Run categorization scripts on exported content');
  }

  async stopVM() {
    await this.log('🛑 Stopping VM...');
    
    try {
      const stopCmd = `VBoxManage controlvm "${this.config.vmName}" savestate`;
      await execAsync(stopCmd, { timeout: 30000 });
      await this.log('✅ VM saved and stopped');
    } catch (error) {
      await this.log(`⚠️ Could not stop VM: ${error.message}`);
    }
  }
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const explorer = new WISVMExplorer();
  
  // Add cleanup handler
  process.on('SIGINT', async () => {
    console.log('\n⚠️ Interrupted - saving VM state...');
    await explorer.stopVM();
    process.exit(0);
  });
  
  explorer.run().catch(console.error);
}

export default WISVMExplorer;