#!/usr/bin/env node
/**
 * Alternative WIS VDI Extractor
 * 
 * This script handles the specific case where 7z archive parts are in separate directories
 * and need to be linked/copied together for proper extraction.
 */

import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

class AlternativeWISExtractor {
  constructor() {
    this.config = {
      sourceDir: '/Volumes/EDIT/UNIMOG MANUALS/BIG UNIMOG MANUALS',
      workingDir: '/tmp/wis-visual-extraction',
      tempArchiveDir: '/tmp/wis-visual-extraction/archive-parts',
      logFile: './wis-visual-logs/alternative-extraction.log'
    };
  }

  async log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log(logMessage);
    
    try {
      await fs.appendFile(this.config.logFile, logMessage + '\n');
    } catch (error) {
      console.warn('Failed to write to log file:', error.message);
    }
  }

  async run() {
    try {
      await this.log('🚀 Starting Alternative WIS VDI Extraction');
      
      // Step 1: Create temporary directory for archive parts
      await this.setupTempDirectory();
      
      // Step 2: Copy/link all archive parts to same directory
      await this.consolidateArchiveParts();
      
      // Step 3: Extract using 7z
      await this.extractVDI();
      
      // Step 4: Clean up temp files
      await this.cleanup();
      
      await this.log('✅ Alternative extraction completed successfully');
      
    } catch (error) {
      await this.log(`💥 Alternative extraction failed: ${error.message}`);
      throw error;
    }
  }

  async setupTempDirectory() {
    await this.log('📁 Setting up temporary archive directory...');
    
    await fs.mkdir(this.config.tempArchiveDir, { recursive: true });
    await fs.mkdir(this.config.workingDir, { recursive: true });
    
    await this.log('✅ Temporary directory created');
  }

  async consolidateArchiveParts() {
    await this.log('🔗 Consolidating archive parts...');
    
    const parts = [
      { source: 'Benz1/Mercedes09.7z.001', dest: 'Mercedes09.7z.001' },
      { source: 'Benz2/Mercedes09.7z.002', dest: 'Mercedes09.7z.002' },
      { source: 'Benz3/Mercedes09.7z.003', dest: 'Mercedes09.7z.003' },
      { source: 'Benz4/Mercedes09.7z.004', dest: 'Mercedes09.7z.004' }
    ];

    for (const part of parts) {
      const sourcePath = path.join(this.config.sourceDir, part.source);
      const destPath = path.join(this.config.tempArchiveDir, part.dest);
      
      await this.log(`📎 Linking ${part.source} -> ${part.dest}`);
      
      try {
        // Create hard link if possible (faster), otherwise copy
        await fs.link(sourcePath, destPath);
        await this.log(`✅ Hard link created for ${part.dest}`);
      } catch (error) {
        await this.log(`⚠️ Hard link failed, copying file: ${error.message}`);
        await fs.copyFile(sourcePath, destPath);
        await this.log(`✅ File copied: ${part.dest}`);
      }
    }
    
    await this.log('✅ All archive parts consolidated');
  }

  async extractVDI() {
    await this.log('📦 Extracting VDI from consolidated archive...');
    
    const firstPart = path.join(this.config.tempArchiveDir, 'Mercedes09.7z.001');
    const extractCmd = `7z x "${firstPart}" -o"${this.config.workingDir}" -y`;
    
    await this.log(`Executing: ${extractCmd}`);
    
    try {
      const { stdout, stderr } = await execAsync(extractCmd, {
        maxBuffer: 1024 * 1024 * 100,
        timeout: 30 * 60 * 1000 // 30 minutes timeout
      });
      
      await this.log(`7z extraction stdout: ${stdout}`);
      if (stderr) await this.log(`7z extraction stderr: ${stderr}`);
      
      // Verify VDI was extracted
      const vdiPath = path.join(this.config.workingDir, 'MERCEDES.vdi');
      const vdiExists = await fs.access(vdiPath).then(() => true).catch(() => false);
      
      if (vdiExists) {
        const stats = await fs.stat(vdiPath);
        await this.log(`✅ VDI extracted successfully: ${(stats.size / (1024**3)).toFixed(2)}GB`);
      } else {
        throw new Error('VDI file not found after extraction');
      }
      
    } catch (error) {
      throw new Error(`VDI extraction failed: ${error.message}`);
    }
  }

  async cleanup() {
    await this.log('🧹 Cleaning up temporary files...');
    
    try {
      await fs.rm(this.config.tempArchiveDir, { recursive: true, force: true });
      await this.log('✅ Temporary archive parts cleaned up');
    } catch (error) {
      await this.log(`⚠️ Cleanup warning: ${error.message}`);
    }
  }
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const extractor = new AlternativeWISExtractor();
  extractor.run().catch(console.error);
}

export default AlternativeWISExtractor;