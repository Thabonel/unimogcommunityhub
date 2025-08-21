#!/usr/bin/env node
/**
 * WIS RAW Image Mount and Explorer
 * 
 * This script mounts the converted RAW disk image and explores its contents
 * to discover visual assets for the WIS system.
 */

import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

class WISRawExplorer {
  constructor() {
    this.config = {
      rawImagePath: '/Volumes/UnimogManuals/wis-extraction/MERCEDES.raw',
      mountPoint: '/Volumes/UnimogManuals/wis-mount',
      outputDir: './wis-visual-extraction',
      logFile: './wis-visual-logs/raw-exploration.log'
    };
    
    this.stats = {
      startTime: new Date(),
      partitions: [],
      filesystems: [],
      discovered: {
        images: 0,
        diagrams: 0,
        manuals: 0,
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
      await this.log('🚀 Starting WIS RAW Image Exploration');
      await this.log(`📂 RAW Image: ${this.config.rawImagePath}`);
      
      // Step 1: Wait for RAW image to be ready
      await this.waitForRawImage();
      
      // Step 2: Analyze partitions
      await this.analyzePartitions();
      
      // Step 3: Mount partitions and explore
      await this.mountAndExplore();
      
      // Step 4: Generate comprehensive report
      await this.generateReport();
      
      await this.log('✅ RAW exploration completed successfully');
      
    } catch (error) {
      await this.log(`💥 RAW exploration failed: ${error.message}`);
      throw error;
    }
  }

  async waitForRawImage() {
    await this.log('⏳ Waiting for RAW image to be ready...');
    
    let attempts = 0;
    const maxAttempts = 60; // Wait up to 30 minutes
    
    while (attempts < maxAttempts) {
      try {
        const stats = await fs.stat(this.config.rawImagePath);
        const sizeGB = (stats.size / (1024**3)).toFixed(2);
        
        // Check if file is still growing
        await new Promise(resolve => setTimeout(resolve, 5000));
        const stats2 = await fs.stat(this.config.rawImagePath);
        
        if (stats.size === stats2.size && stats.size > 1024**3) {
          await this.log(`✅ RAW image ready: ${sizeGB}GB`);
          return;
        } else {
          await this.log(`⏳ RAW image still converting: ${sizeGB}GB`);
        }
      } catch (error) {
        await this.log(`⏳ Waiting for RAW image creation... (attempt ${attempts + 1}/${maxAttempts})`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 30000)); // Wait 30 seconds
      attempts++;
    }
    
    throw new Error('RAW image conversion timeout');
  }

  async analyzePartitions() {
    await this.log('🔍 Analyzing disk partitions...');
    
    try {
      // Use fdisk to list partitions
      const { stdout } = await execAsync(`fdisk -l "${this.config.rawImagePath}"`, { timeout: 10000 });
      await this.log('Partition table:');
      
      const lines = stdout.split('\n');
      for (const line of lines) {
        if (line.includes('Disk') || line.includes('Device') || line.includes('/dev/')) {
          await this.log(`  ${line.trim()}`);
        }
        
        // Extract partition information
        if (line.includes(this.config.rawImagePath)) {
          const parts = line.split(/\s+/);
          if (parts.length >= 5) {
            const partition = {
              device: parts[0],
              start: parseInt(parts[1]),
              end: parseInt(parts[2]),
              sectors: parseInt(parts[3]),
              type: parts.slice(4).join(' ')
            };
            this.stats.partitions.push(partition);
          }
        }
      }
      
      await this.log(`📊 Found ${this.stats.partitions.length} partitions`);
      
    } catch (error) {
      await this.log(`⚠️ fdisk analysis failed, trying alternative method: ${error.message}`);
      
      // Try parted as alternative
      try {
        const { stdout } = await execAsync(`parted "${this.config.rawImagePath}" print`, { timeout: 10000 });
        await this.log('Parted output:');
        await this.log(stdout);
      } catch (partedError) {
        await this.log(`⚠️ Parted also failed: ${partedError.message}`);
      }
    }
  }

  async mountAndExplore() {
    await this.log('🔗 Mounting and exploring partitions...');
    
    // Create mount point
    await fs.mkdir(this.config.mountPoint, { recursive: true });
    
    // Try different mounting approaches
    await this.log('Attempting direct mount...');
    
    try {
      // Try to mount as loop device
      const { stdout: losetupOut } = await execAsync(`sudo losetup -f --show "${this.config.rawImagePath}"`, { timeout: 10000 });
      const loopDevice = losetupOut.trim();
      
      await this.log(`Loop device created: ${loopDevice}`);
      
      // Scan for partitions
      await execAsync(`sudo partprobe ${loopDevice}`, { timeout: 5000 });
      
      // List available partitions
      const { stdout: lsblkOut } = await execAsync(`lsblk ${loopDevice}`, { timeout: 5000 });
      await this.log('Available partitions:');
      await this.log(lsblkOut);
      
      // Try to mount first partition
      try {
        await execAsync(`sudo mount -o ro ${loopDevice}p1 "${this.config.mountPoint}"`, { timeout: 10000 });
        await this.log('✅ First partition mounted successfully');
        
        // Explore mounted content
        await this.exploreFileSystem();
        
        // Unmount
        await execAsync(`sudo umount "${this.config.mountPoint}"`).catch(() => {});
      } catch (mountError) {
        await this.log(`⚠️ Mount failed: ${mountError.message}`);
      }
      
      // Detach loop device
      await execAsync(`sudo losetup -d ${loopDevice}`).catch(() => {});
      
    } catch (error) {
      await this.log(`⚠️ Loop device mount failed: ${error.message}`);
      
      // Try alternative: direct offset mount
      await this.tryOffsetMount();
    }
  }

  async tryOffsetMount() {
    await this.log('🔍 Trying offset-based mounting...');
    
    // Common partition offsets
    const offsets = [
      1048576,    // 1MB (common for first partition)
      32256,      // 63 sectors * 512 bytes
      2048 * 512, // 2048 sectors (common for modern disks)
    ];
    
    for (const offset of offsets) {
      try {
        await this.log(`Trying offset ${offset}...`);
        
        const mountCmd = `sudo mount -o ro,loop,offset=${offset} "${this.config.rawImagePath}" "${this.config.mountPoint}"`;
        await execAsync(mountCmd, { timeout: 10000 });
        
        await this.log('✅ Mount successful with offset ' + offset);
        
        // Explore the mounted filesystem
        await this.exploreFileSystem();
        
        // Unmount
        await execAsync(`sudo umount "${this.config.mountPoint}"`).catch(() => {});
        
        break; // Success, stop trying other offsets
        
      } catch (error) {
        await this.log(`⚠️ Offset ${offset} failed: ${error.message}`);
      }
    }
  }

  async exploreFileSystem() {
    await this.log('📂 Exploring mounted filesystem...');
    
    try {
      // List root directory
      const rootContents = await fs.readdir(this.config.mountPoint);
      await this.log(`Root directory contents: ${rootContents.slice(0, 20).join(', ')}`);
      
      // Look for WIS-related directories
      const wisDirectories = [
        'WIS', 'wis', 'Mercedes', 'Workshop', 'EPC', 'Manuals',
        'Program Files', 'Documents', 'Data', 'Images'
      ];
      
      for (const dir of wisDirectories) {
        for (const rootItem of rootContents) {
          if (rootItem.toLowerCase().includes(dir.toLowerCase())) {
            await this.log(`📁 Found potential WIS directory: ${rootItem}`);
            await this.exploreDirectory(path.join(this.config.mountPoint, rootItem));
          }
        }
      }
      
      // Search for image files
      await this.searchForImages();
      
    } catch (error) {
      await this.log(`❌ Filesystem exploration error: ${error.message}`);
    }
  }

  async exploreDirectory(dirPath, depth = 0, maxDepth = 3) {
    if (depth > maxDepth) return;
    
    try {
      const contents = await fs.readdir(dirPath);
      
      for (const item of contents.slice(0, 50)) { // Limit to prevent overwhelming
        const itemPath = path.join(dirPath, item);
        
        try {
          const stats = await fs.stat(itemPath);
          
          if (stats.isDirectory() && depth < maxDepth) {
            // Check for promising directory names
            const importantDirs = ['image', 'img', 'diagram', 'picture', 'illustration', 'graphic'];
            if (importantDirs.some(d => item.toLowerCase().includes(d))) {
              await this.log(`  ${'  '.repeat(depth)}📁 ${item}/ (potential images)`);
              await this.exploreDirectory(itemPath, depth + 1, maxDepth);
            }
          } else if (stats.isFile()) {
            // Check for image files
            const ext = path.extname(item).toLowerCase();
            const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.tiff'];
            
            if (imageExts.includes(ext)) {
              this.stats.discovered.images++;
              if (this.stats.discovered.images <= 10) {
                await this.log(`  ${'  '.repeat(depth)}🖼️ ${item}`);
              }
            }
          }
        } catch (error) {
          // Skip inaccessible items
        }
      }
    } catch (error) {
      // Skip inaccessible directories
    }
  }

  async searchForImages() {
    await this.log('🔍 Searching for image files...');
    
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg'];
    
    for (const ext of imageExtensions) {
      try {
        const findCmd = `find "${this.config.mountPoint}" -type f -iname "*${ext}" 2>/dev/null | head -100`;
        const { stdout } = await execAsync(findCmd, { timeout: 30000 });
        
        if (stdout) {
          const files = stdout.trim().split('\n').filter(f => f);
          this.stats.discovered.total += files.length;
          
          if (files.length > 0) {
            await this.log(`📊 Found ${files.length} ${ext} files`);
            
            // Log first few examples
            for (const file of files.slice(0, 3)) {
              const relativePath = file.replace(this.config.mountPoint + '/', '');
              await this.log(`  Example: ${relativePath}`);
            }
          }
        }
      } catch (error) {
        await this.log(`⚠️ Search error for ${ext}: ${error.message}`);
      }
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
        partitions_found: this.stats.partitions.length,
        images_discovered: this.stats.discovered.total
      },
      partitions: this.stats.partitions,
      discovery: this.stats.discovered,
      recommendations: []
    };
    
    // Add recommendations based on findings
    if (this.stats.discovered.total > 0) {
      report.recommendations.push('Visual content found! Ready to proceed with extraction and processing.');
      report.recommendations.push('Use targeted extraction scripts to copy images from mounted filesystem.');
      report.recommendations.push('Categorize images by type (diagrams, parts, procedures, etc.)');
    } else {
      report.recommendations.push('No images found in standard locations.');
      report.recommendations.push('VDI may require booting in VirtualBox to access content.');
      report.recommendations.push('Content might be in proprietary database format.');
    }
    
    // Save report
    await fs.mkdir(this.config.outputDir, { recursive: true });
    const reportFile = path.join(this.config.outputDir, 'raw-exploration-report.json');
    await fs.writeFile(reportFile, JSON.stringify(report, null, 2));
    
    await this.log('\n📊 EXPLORATION SUMMARY:');
    await this.log(`   Duration: ${durationMinutes} minutes`);
    await this.log(`   Partitions found: ${this.stats.partitions.length}`);
    await this.log(`   Images discovered: ${this.stats.discovered.total}`);
    await this.log(`   Report saved to: ${reportFile}`);
    
    if (this.stats.discovered.total === 0) {
      await this.log('\n⚠️ No visual content found through filesystem exploration.');
      await this.log('   Recommendation: Import VDI into VirtualBox and boot the system.');
    } else {
      await this.log('\n✅ Visual content discovered!');
      await this.log('   Ready to proceed with extraction and processing.');
    }
  }
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const explorer = new WISRawExplorer();
  explorer.run().catch(console.error);
}

export default WISRawExplorer;