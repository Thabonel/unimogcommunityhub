#!/usr/bin/env node
/**
 * WIS macOS-Specific Mount Explorer
 * 
 * Uses macOS native tools (hdiutil, diskutil) to mount and explore the RAW image
 * without requiring sudo permissions.
 */

import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

class WISMacOSExplorer {
  constructor() {
    this.config = {
      rawImagePath: '/Volumes/UnimogManuals/wis-extraction/MERCEDES.raw',
      vdiPath: '/Volumes/UnimogManuals/wis-extraction/MERCEDES.vdi',
      outputDir: './wis-visual-extraction',
      logFile: './wis-visual-logs/macos-exploration.log'
    };
    
    this.stats = {
      startTime: new Date(),
      discovered: {
        images: 0,
        diagrams: 0,
        schematics: 0,
        total: 0
      }
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
      await this.log('🚀 Starting macOS-specific WIS exploration');
      
      // Step 1: Try VirtualBox direct exploration first
      await this.exploreWithVirtualBox();
      
      // Step 2: If that fails, try hdiutil
      if (this.stats.discovered.total === 0) {
        await this.exploreWithHdiutil();
      }
      
      // Step 3: If still no luck, try diskutil
      if (this.stats.discovered.total === 0) {
        await this.exploreWithDiskutil();
      }
      
      // Step 4: Generate report
      await this.generateReport();
      
    } catch (error) {
      await this.log(`💥 macOS exploration failed: ${error.message}`);
      throw error;
    }
  }

  async exploreWithVirtualBox() {
    await this.log('🔍 Attempting VirtualBox VDI exploration...');
    
    try {
      // Use VBoxManage to get VDI info
      const infoCmd = `VBoxManage showhdinfo "${this.config.vdiPath}"`;
      const { stdout } = await execAsync(infoCmd, { timeout: 10000 });
      
      await this.log('VDI Information:');
      const lines = stdout.split('\n');
      for (const line of lines) {
        if (line.includes('UUID') || line.includes('Size') || line.includes('Format')) {
          await this.log(`  ${line.trim()}`);
        }
      }
      
      // Try to use guestfish for direct VDI exploration
      await this.tryGuestfish();
      
    } catch (error) {
      await this.log(`⚠️ VirtualBox exploration failed: ${error.message}`);
    }
  }

  async tryGuestfish() {
    await this.log('🐟 Attempting guestfish exploration...');
    
    try {
      // Check if guestfish is available
      await execAsync('which guestfish', { timeout: 5000 });
      
      // Create guestfish commands file
      const guestfishCmds = `
add-ro ${this.config.vdiPath}
run
list-filesystems
mount /dev/sda1 /
ls /
find / -name "*.jpg" | head -20
find / -name "*.png" | head -20
find / -name "*.pdf" | head -20
`;
      
      const cmdFile = path.join(this.config.outputDir, 'guestfish-commands.txt');
      await fs.mkdir(this.config.outputDir, { recursive: true });
      await fs.writeFile(cmdFile, guestfishCmds);
      
      // Execute guestfish
      const { stdout } = await execAsync(`guestfish -f "${cmdFile}"`, { 
        timeout: 60000,
        maxBuffer: 10 * 1024 * 1024 
      });
      
      await this.log('Guestfish output:');
      const lines = stdout.split('\n').slice(0, 100);
      for (const line of lines) {
        await this.log(`  ${line}`);
        
        // Count discovered files
        if (line.includes('.jpg') || line.includes('.png')) {
          this.stats.discovered.images++;
        }
      }
      
    } catch (error) {
      await this.log(`⚠️ Guestfish not available or failed: ${error.message}`);
    }
  }

  async exploreWithHdiutil() {
    await this.log('🍎 Attempting hdiutil attachment...');
    
    try {
      // Try to attach the RAW image as read-only
      const attachCmd = `hdiutil attach -readonly -nomount "${this.config.rawImagePath}"`;
      await this.log(`Executing: ${attachCmd}`);
      
      const { stdout } = await execAsync(attachCmd, { timeout: 30000 });
      await this.log('Hdiutil output:');
      await this.log(stdout);
      
      // Parse the output to find disk identifiers
      const diskMatch = stdout.match(/\/dev\/(disk\d+)/);
      if (diskMatch) {
        const diskId = diskMatch[1];
        await this.log(`✅ Disk attached as ${diskId}`);
        
        // List partitions
        await this.exploreAttachedDisk(diskId);
        
        // Detach when done
        await execAsync(`hdiutil detach /dev/${diskId}`, { timeout: 10000 }).catch(() => {});
      }
      
    } catch (error) {
      await this.log(`⚠️ Hdiutil attachment failed: ${error.message}`);
    }
  }

  async exploreWithDiskutil() {
    await this.log('💿 Attempting diskutil exploration...');
    
    try {
      // List all disks to find our image
      const { stdout } = await execAsync('diskutil list', { timeout: 5000 });
      await this.log('Current disk configuration:');
      
      const lines = stdout.split('\n').slice(0, 50);
      for (const line of lines) {
        if (line.includes('disk') || line.includes('Windows') || line.includes('NTFS')) {
          await this.log(`  ${line}`);
        }
      }
      
    } catch (error) {
      await this.log(`⚠️ Diskutil exploration failed: ${error.message}`);
    }
  }

  async exploreAttachedDisk(diskId) {
    await this.log(`📀 Exploring attached disk ${diskId}...`);
    
    try {
      // Get disk info
      const { stdout: diskInfo } = await execAsync(`diskutil info /dev/${diskId}`, { timeout: 5000 });
      await this.log('Disk information:');
      const infoLines = diskInfo.split('\n').slice(0, 20);
      for (const line of infoLines) {
        await this.log(`  ${line}`);
      }
      
      // List partitions
      const { stdout: partList } = await execAsync(`diskutil list /dev/${diskId}`, { timeout: 5000 });
      await this.log('Partition list:');
      await this.log(partList);
      
      // Try to mount partitions
      const partMatch = partList.match(/\d+:\s+Windows_NTFS.*?(disk\d+s\d+)/);
      if (partMatch) {
        const partitionId = partMatch[1];
        await this.log(`Found NTFS partition: ${partitionId}`);
        
        // Mount the partition
        const mountPoint = `/Volumes/WIS_TEMP_${Date.now()}`;
        try {
          await execAsync(`diskutil mount readOnly /dev/${partitionId}`, { timeout: 10000 });
          await this.log(`✅ Partition mounted`);
          
          // Explore mounted content
          await this.exploreMountedVolume(mountPoint);
          
          // Unmount
          await execAsync(`diskutil unmount /dev/${partitionId}`, { timeout: 5000 }).catch(() => {});
          
        } catch (mountError) {
          await this.log(`⚠️ Could not mount partition: ${mountError.message}`);
        }
      }
      
    } catch (error) {
      await this.log(`⚠️ Disk exploration failed: ${error.message}`);
    }
  }

  async exploreMountedVolume(mountPoint) {
    await this.log(`🔍 Exploring mounted volume at ${mountPoint}...`);
    
    try {
      // Check if mount point exists and has content
      const contents = await fs.readdir(mountPoint);
      await this.log(`Volume contents: ${contents.slice(0, 20).join(', ')}`);
      
      // Search for image files
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg'];
      
      for (const ext of imageExtensions) {
        try {
          const findCmd = `find "${mountPoint}" -type f -iname "*${ext}" 2>/dev/null | head -50`;
          const { stdout } = await execAsync(findCmd, { timeout: 20000 });
          
          if (stdout) {
            const files = stdout.trim().split('\n').filter(f => f);
            this.stats.discovered.images += files.length;
            this.stats.discovered.total += files.length;
            
            if (files.length > 0) {
              await this.log(`📊 Found ${files.length} ${ext} files`);
              for (const file of files.slice(0, 3)) {
                await this.log(`  Example: ${path.basename(file)}`);
              }
            }
          }
        } catch (error) {
          // Continue searching
        }
      }
      
    } catch (error) {
      await this.log(`⚠️ Volume exploration error: ${error.message}`);
    }
  }

  async generateReport() {
    const duration = Date.now() - this.stats.startTime.getTime();
    const durationMinutes = (duration / 60000).toFixed(2);
    
    const report = {
      summary: {
        started_at: this.stats.startTime.toISOString(),
        completed_at: new Date().toISOString(),
        duration_minutes: parseFloat(durationMinutes),
        raw_image_path: this.config.rawImagePath,
        vdi_path: this.config.vdiPath,
        total_discovered: this.stats.discovered.total
      },
      discovery: this.stats.discovered,
      recommendations: []
    };
    
    if (this.stats.discovered.total > 0) {
      report.recommendations.push('Visual content discovered! Ready for extraction.');
      report.recommendations.push('Use targeted extraction to copy images.');
      report.recommendations.push('Process and categorize by type.');
    } else {
      report.recommendations.push('No visual content found via direct mounting.');
      report.recommendations.push('RECOMMENDATION: Import VDI into VirtualBox GUI.');
      report.recommendations.push('Boot the virtual machine to access WIS application.');
      report.recommendations.push('Use screen capture or export functions within WIS.');
    }
    
    // Save report
    await fs.mkdir(this.config.outputDir, { recursive: true });
    const reportFile = path.join(this.config.outputDir, 'macos-exploration-report.json');
    await fs.writeFile(reportFile, JSON.stringify(report, null, 2));
    
    await this.log('\n📊 EXPLORATION SUMMARY:');
    await this.log(`   Duration: ${durationMinutes} minutes`);
    await this.log(`   Images discovered: ${this.stats.discovered.images}`);
    await this.log(`   Total files: ${this.stats.discovered.total}`);
    await this.log(`   Report saved to: ${reportFile}`);
    
    if (this.stats.discovered.total === 0) {
      await this.log('\n⚠️ IMPORTANT: Direct file extraction not possible.');
      await this.log('');
      await this.log('📌 RECOMMENDED APPROACH:');
      await this.log('   1. Open VirtualBox application');
      await this.log('   2. Create new VM: File → New');
      await this.log('   3. Name: "Mercedes WIS"');
      await this.log('   4. Type: Microsoft Windows');
      await this.log('   5. Version: Windows XP (32-bit)');
      await this.log('   6. Memory: 2048 MB');
      await this.log('   7. Use existing VDI: /Volumes/UnimogManuals/wis-extraction/MERCEDES.vdi');
      await this.log('   8. Start the VM and wait for Windows to boot');
      await this.log('   9. Navigate to WIS application');
      await this.log('   10. Use built-in export or screenshot features');
      await this.log('');
      await this.log('💡 The WIS system likely stores images in a proprietary database');
      await this.log('   format that requires the application to access.');
    }
  }
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const explorer = new WISMacOSExplorer();
  explorer.run().catch(console.error);
}

export default WISMacOSExplorer;