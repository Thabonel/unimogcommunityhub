#!/usr/bin/env node
/**
 * WIS Direct VDI Mount and Visual Content Extractor
 * 
 * This script directly mounts the already-extracted VDI file and extracts visual content
 */

import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

class WISDirectExtractor {
  constructor() {
    this.config = {
      vdiPath: '/Volumes/UnimogManuals/wis-extraction/MERCEDES.vdi',
      mountPoint: '/tmp/wis-vdi-mount',
      outputDir: '/tmp/wis-visual-extraction/discovered',
      logFile: './wis-visual-logs/direct-extraction.log'
    };
    
    this.stats = {
      startTime: new Date(),
      discovered: 0,
      errors: []
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
      await this.log('🚀 Starting WIS Direct VDI Mount and Extraction');
      await this.log(`📂 VDI File: ${this.config.vdiPath}`);
      
      // Step 1: Verify VDI exists
      await this.verifyVDI();
      
      // Step 2: Create mount point
      await this.createMountPoint();
      
      // Step 3: Mount VDI using vboximg-mount
      await this.mountVDI();
      
      // Step 4: Discover visual content
      await this.discoverContent();
      
      // Step 5: Generate report
      await this.generateReport();
      
      await this.log('✅ Direct extraction completed successfully');
      
    } catch (error) {
      await this.log(`💥 Direct extraction failed: ${error.message}`);
      throw error;
    }
  }

  async verifyVDI() {
    await this.log('🔍 Verifying VDI file...');
    
    try {
      const stats = await fs.stat(this.config.vdiPath);
      const sizeGB = (stats.size / (1024**3)).toFixed(2);
      await this.log(`✅ VDI found: ${sizeGB}GB`);
    } catch (error) {
      throw new Error(`VDI file not accessible: ${this.config.vdiPath}`);
    }
  }

  async createMountPoint() {
    await this.log('📁 Creating mount point...');
    
    await fs.mkdir(this.config.mountPoint, { recursive: true });
    await fs.mkdir(this.config.outputDir, { recursive: true });
    
    await this.log('✅ Mount point created');
  }

  async mountVDI() {
    await this.log('🔗 Mounting VDI file...');
    
    // First check if already mounted
    try {
      const contents = await fs.readdir(this.config.mountPoint);
      if (contents.length > 0) {
        await this.log('✅ VDI already mounted');
        return;
      }
    } catch (error) {
      // Directory empty or inaccessible, continue with mount
    }
    
    // Mount using vboximg-mount with read-only flag
    const mountCmd = `vboximg-mount -i "${this.config.vdiPath}" -o ro "${this.config.mountPoint}"`;
    await this.log(`Executing: ${mountCmd}`);
    
    try {
      const { stdout, stderr } = await execAsync(mountCmd, { timeout: 30000 });
      if (stdout) await this.log(`Mount output: ${stdout}`);
      if (stderr) await this.log(`Mount stderr: ${stderr}`);
    } catch (error) {
      // Check if it's already mounted (common error)
      const contents = await fs.readdir(this.config.mountPoint);
      if (contents.length > 0) {
        await this.log('✅ VDI mount successful (already mounted)');
        return;
      }
      throw new Error(`VDI mounting failed: ${error.message}`);
    }
    
    // Verify mount success
    const mountContents = await fs.readdir(this.config.mountPoint);
    await this.log(`Mount contents: ${mountContents.join(', ')}`);
    
    if (mountContents.length === 0) {
      throw new Error('VDI mount appears empty');
    }
    
    await this.log('✅ VDI successfully mounted');
  }

  async discoverContent() {
    await this.log('🔍 Discovering visual content in mounted VDI...');
    
    const discoveredFiles = new Set();
    
    // Check what's in the mount point
    const mountContents = await fs.readdir(this.config.mountPoint);
    await this.log(`Mount point contains: ${mountContents.join(', ')}`);
    
    // Look for partitions or volume files
    for (const item of mountContents) {
      const itemPath = path.join(this.config.mountPoint, item);
      const stats = await fs.stat(itemPath);
      
      if (stats.isFile()) {
        const sizeGB = (stats.size / (1024**3)).toFixed(2);
        await this.log(`  ${item}: ${sizeGB}GB file`);
        
        // If it's a volume file, we need to mount it separately
        if (item.startsWith('vol')) {
          await this.discoverInVolume(item, discoveredFiles);
        }
      }
    }
    
    // Search directly in mount point using find command
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.bmp', '.wmf', '.emf'];
    
    await this.log(`Searching for image files...`);
    
    // Use find command to search for images
    for (const ext of imageExtensions) {
      try {
        const findCmd = `find "${this.config.mountPoint}" -type f \\( -iname "*${ext}" \\) 2>/dev/null | head -100`;
        const { stdout } = await execAsync(findCmd, { timeout: 30000 });
        
        if (stdout) {
          const files = stdout.trim().split('\n').filter(f => f);
          files.forEach(file => {
            const relativePath = file.replace(this.config.mountPoint + '/', '');
            discoveredFiles.add(relativePath);
          });
          
          if (files.length > 0) {
            await this.log(`Found ${files.length} ${ext} files`);
          }
        }
      } catch (error) {
        await this.log(`⚠️ Search error for ${ext}: ${error.message}`);
      }
    }
    
    this.stats.discovered = discoveredFiles.size;
    await this.log(`📊 Total discovered: ${this.stats.discovered} visual files`);
    
    // Save discovery results
    if (discoveredFiles.size > 0) {
      const discoveryData = {
        timestamp: new Date().toISOString(),
        vdiPath: this.config.vdiPath,
        mountPoint: this.config.mountPoint,
        totalFiles: discoveredFiles.size,
        files: Array.from(discoveredFiles).slice(0, 100), // Save first 100 as sample
        fullCount: discoveredFiles.size
      };
      
      const outputFile = path.join(this.config.outputDir, 'discovery-results.json');
      await fs.writeFile(outputFile, JSON.stringify(discoveryData, null, 2));
      await this.log(`✅ Discovery results saved to: ${outputFile}`);
    }
  }

  async discoverInVolume(volumeName, discoveredFiles) {
    await this.log(`📂 Exploring volume: ${volumeName}`);
    
    const volumePath = path.join(this.config.mountPoint, volumeName);
    
    // Try to mount this volume file
    const volumeMountPoint = `/tmp/wis-volume-${volumeName}`;
    await fs.mkdir(volumeMountPoint, { recursive: true });
    
    try {
      // Use regular mount command for volume files
      const mountCmd = `sudo mount -o ro,loop "${volumePath}" "${volumeMountPoint}"`;
      await this.log(`Mounting volume: ${mountCmd}`);
      
      const { stdout, stderr } = await execAsync(mountCmd, { timeout: 10000 });
      if (stdout) await this.log(`Volume mount output: ${stdout}`);
      if (stderr && !stderr.includes('already mounted')) {
        await this.log(`Volume mount stderr: ${stderr}`);
      }
      
      // Search for images in mounted volume using find
      const imageExtensions = ['.jpg', '.png', '.gif', '.svg', '.bmp'];
      
      for (const ext of imageExtensions) {
        try {
          const findCmd = `find "${volumeMountPoint}" -type f -iname "*${ext}" 2>/dev/null | head -50`;
          const { stdout } = await execAsync(findCmd, { timeout: 10000 });
          
          if (stdout) {
            const files = stdout.trim().split('\n').filter(f => f);
            files.forEach(file => {
              const relativePath = file.replace(volumeMountPoint + '/', '');
              discoveredFiles.add(`${volumeName}/${relativePath}`);
            });
            
            if (files.length > 0) {
              await this.log(`  Found ${files.length} ${ext} files in ${volumeName}`);
            }
          }
        } catch (error) {
          // Continue searching
        }
      }
      
      // Unmount when done
      await execAsync(`sudo umount "${volumeMountPoint}"`).catch(() => {});
      
    } catch (error) {
      await this.log(`⚠️ Could not mount volume ${volumeName}: ${error.message}`);
    }
  }

  async generateReport() {
    const duration = Date.now() - this.stats.startTime.getTime();
    const durationSeconds = (duration / 1000).toFixed(2);
    
    const report = {
      summary: {
        started_at: this.stats.startTime.toISOString(),
        completed_at: new Date().toISOString(),
        duration_seconds: parseFloat(durationSeconds),
        vdi_path: this.config.vdiPath,
        mount_point: this.config.mountPoint,
        total_discovered: this.stats.discovered
      },
      next_steps: [
        'Review discovery results',
        'If images found: proceed with categorization and processing',
        'If no images: VDI may need different mounting approach',
        'Consider exploring VDI structure with file manager'
      ]
    };
    
    const reportFile = path.join(this.config.outputDir, 'extraction-report.json');
    await fs.writeFile(reportFile, JSON.stringify(report, null, 2));
    
    await this.log('\n📊 EXTRACTION SUMMARY:');
    await this.log(`   Duration: ${durationSeconds} seconds`);
    await this.log(`   Files discovered: ${this.stats.discovered}`);
    await this.log(`   Report saved to: ${reportFile}`);
    
    if (this.stats.discovered === 0) {
      await this.log('\n⚠️ No visual content found in VDI.');
      await this.log('   The VDI may require different mounting or exploration approach.');
      await this.log('   Consider using VirtualBox to boot the VDI and explore its contents.');
    } else {
      await this.log('\n✅ Visual content discovered successfully!');
      await this.log('   Ready to proceed with categorization and processing.');
    }
  }
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const extractor = new WISDirectExtractor();
  extractor.run().catch(console.error);
}

export default WISDirectExtractor;