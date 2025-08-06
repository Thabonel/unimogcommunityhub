#!/usr/bin/env node

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import { createWriteStream } from 'fs';

const execAsync = promisify(exec);

// Use external drive for extraction
const EXTERNAL_DRIVE = '/Volumes/EDIT';
const ARCHIVE_PATH = path.join(EXTERNAL_DRIVE, 'UNIMOG MANUALS/BIG UNIMOG MANUALS');
const EXTRACT_PATH = path.join(EXTERNAL_DRIVE, 'wis-extraction');

console.log('🚀 WIS EPC Full Extraction\n');
console.log(`📁 Archive path: ${ARCHIVE_PATH}`);
console.log(`📁 Extract path: ${EXTRACT_PATH}\n`);

async function createExtractDirectory() {
  console.log('📁 Creating extraction directory...');
  await fs.mkdir(EXTRACT_PATH, { recursive: true });
  console.log(`✅ Created: ${EXTRACT_PATH}\n`);
}

async function extractVDI() {
  console.log('📦 Starting VDI extraction...');
  console.log('⏱️  This will take approximately 20-30 minutes\n');
  
  try {
    // First, create symbolic links for all parts in extract directory
    console.log('🔗 Setting up archive parts...');
    for (let i = 1; i <= 4; i++) {
      const source = path.join(ARCHIVE_PATH, `Benz${i}/Mercedes09.7z.00${i}`);
      const target = path.join(EXTRACT_PATH, `Mercedes09.7z.00${i}`);
      
      try {
        await fs.unlink(target).catch(() => {});
        await fs.symlink(source, target);
        console.log(`✅ Linked part ${i}`);
      } catch (error) {
        console.error(`❌ Failed to link part ${i}:`, error.message);
        return false;
      }
    }
    
    console.log('\n📊 Extraction progress:');
    
    // Extract VDI with progress
    const extractCmd = `cd "${EXTRACT_PATH}" && 7z x Mercedes09.7z.001 MERCEDES.vdi -y`;
    
    // Create a child process to monitor progress
    const childProcess = exec(extractCmd);
    
    childProcess.stdout.on('data', (data) => {
      process.stdout.write(data);
    });
    
    childProcess.stderr.on('data', (data) => {
      process.stderr.write(data);
    });
    
    await new Promise((resolve, reject) => {
      childProcess.on('exit', (code) => {
        if (code === 0) resolve(true);
        else reject(new Error(`Extraction failed with code ${code}`));
      });
    });
    
    console.log('\n✅ VDI extraction complete!\n');
    
    // Verify extraction
    const vdiPath = path.join(EXTRACT_PATH, 'MERCEDES.vdi');
    const stats = await fs.stat(vdiPath);
    console.log(`📊 VDI size: ${(stats.size / 1024 / 1024 / 1024).toFixed(2)} GB`);
    
    return true;
  } catch (error) {
    console.error('❌ Extraction error:', error.message);
    return false;
  }
}

async function main() {
  try {
    const startTime = Date.now();
    
    // Create extraction directory
    await createExtractDirectory();
    
    // Check if VDI already exists
    const vdiPath = path.join(EXTRACT_PATH, 'MERCEDES.vdi');
    try {
      const stats = await fs.stat(vdiPath);
      console.log('⚠️  VDI file already exists!');
      console.log(`   Size: ${(stats.size / 1024 / 1024 / 1024).toFixed(2)} GB`);
      console.log('   Skipping extraction.\n');
    } catch {
      // Extract VDI
      const extracted = await extractVDI();
      if (!extracted) {
        console.error('❌ Extraction failed');
        return;
      }
    }
    
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    console.log(`\n✅ Total time: ${Math.floor(elapsed / 60)}m ${elapsed % 60}s`);
    
    console.log('\n📋 Next steps:');
    console.log('1. Mount the VDI file');
    console.log('2. Access WIS data');
    console.log('3. Parse and upload to Supabase');
    console.log('\nRun: node scripts/mount-and-parse-wis.js');
    
  } catch (error) {
    console.error('❌ Fatal error:', error);
  }
}

// Run extraction
main();