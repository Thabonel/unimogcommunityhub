#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';

const EXTRACT_PATH = '/Volumes/EDIT/wis-extraction';
const TARGET_SIZE_GB = 53.5; // Expected size of MERCEDES.vdi

async function checkProgress() {
  console.log('📊 Checking WIS VDI extraction progress...\n');
  
  try {
    const vdiPath = path.join(EXTRACT_PATH, 'MERCEDES.vdi');
    
    // Check if file exists
    try {
      const stats = await fs.stat(vdiPath);
      const currentSizeGB = stats.size / 1024 / 1024 / 1024;
      const progress = (currentSizeGB / TARGET_SIZE_GB) * 100;
      
      console.log(`📦 File: MERCEDES.vdi`);
      console.log(`📏 Current size: ${currentSizeGB.toFixed(2)} GB`);
      console.log(`🎯 Target size: ${TARGET_SIZE_GB} GB`);
      console.log(`📊 Progress: ${progress.toFixed(1)}%`);
      
      if (progress >= 99) {
        console.log('\n✅ Extraction appears complete!');
        console.log('\nNext: Run node scripts/mount-and-parse-wis.js');
      } else {
        console.log('\n⏳ Still extracting... Check again in a few minutes.');
        
        // Estimate time remaining
        const mbPerSec = 50; // Approximate extraction speed
        const remainingGB = TARGET_SIZE_GB - currentSizeGB;
        const remainingSeconds = (remainingGB * 1024) / mbPerSec;
        const remainingMinutes = Math.ceil(remainingSeconds / 60);
        
        console.log(`⏱️  Estimated time remaining: ${remainingMinutes} minutes`);
      }
    } catch (error) {
      console.log('❌ VDI file not found yet. Extraction may still be starting...');
      console.log('   Check the extraction terminal for progress.');
    }
    
    // Also check for any 7z processes
    console.log('\n🔍 Checking for active extraction process...');
    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execAsync = promisify(exec);
    
    try {
      const { stdout } = await execAsync('ps aux | grep 7z | grep -v grep');
      if (stdout.trim()) {
        console.log('✅ 7-zip process is running');
      } else {
        console.log('⚠️  No 7-zip process found');
      }
    } catch {
      console.log('⚠️  No 7-zip process found');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run check
checkProgress();

// Auto-refresh every 30 seconds if running as monitor
if (process.argv.includes('--monitor')) {
  setInterval(checkProgress, 30000);
  console.log('\n🔄 Monitoring mode - refreshing every 30 seconds...');
}