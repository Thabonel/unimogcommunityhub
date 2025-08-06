#!/usr/bin/env node

import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

const EXTRACT_PATH = '/Volumes/EDIT/wis-extraction';
const VDI_PATH = path.join(EXTRACT_PATH, 'MERCEDES.vdi');
const TARGET_SIZE = 53.5 * 1024 * 1024 * 1024; // 53.5 GB in bytes
const LOG_FILE = path.join(EXTRACT_PATH, 'extraction-resume.log');

async function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(message);
  await fs.appendFile(LOG_FILE, logMessage);
}

async function getCurrentSize() {
  try {
    const stats = await fs.stat(VDI_PATH);
    return stats.size;
  } catch {
    return 0;
  }
}

async function checkDiskSpace() {
  const { exec } = await import('child_process');
  const { promisify } = await import('util');
  const execAsync = promisify(exec);
  
  try {
    const { stdout } = await execAsync(`df -B1 /Volumes/EDIT/ | tail -1 | awk '{print $4}'`);
    const availableBytes = parseInt(stdout.trim());
    const availableGB = (availableBytes / 1024 / 1024 / 1024).toFixed(2);
    await log(`💾 Available disk space: ${availableGB} GB`);
    return availableBytes;
  } catch (error) {
    await log(`⚠️ Could not check disk space: ${error.message}`);
    return null;
  }
}

async function extractWithRetry(attempt = 1) {
  const maxAttempts = 5;
  
  await log(`\n🚀 Extraction attempt ${attempt} of ${maxAttempts}`);
  
  // Check current progress
  const currentSize = await getCurrentSize();
  const currentGB = (currentSize / 1024 / 1024 / 1024).toFixed(2);
  const progress = ((currentSize / TARGET_SIZE) * 100).toFixed(1);
  
  await log(`📊 Current VDI size: ${currentGB} GB (${progress}%)`);
  
  if (currentSize >= TARGET_SIZE * 0.99) {
    await log(`✅ Extraction appears complete!`);
    return true;
  }
  
  // Check disk space
  const availableSpace = await checkDiskSpace();
  const neededSpace = TARGET_SIZE - currentSize;
  
  if (availableSpace && availableSpace < neededSpace * 1.1) {
    await log(`❌ Insufficient disk space! Need ${(neededSpace / 1024 / 1024 / 1024).toFixed(2)} GB`);
    return false;
  }
  
  // Prepare extraction command
  const args = [
    'x',
    path.join(EXTRACT_PATH, 'Mercedes09.7z.001'),
    'MERCEDES.vdi',
    '-y',
    '-bb3',  // Show more verbose output
    '-bsp1', // Show progress
    '-bse1', // Show errors to stderr
    `-o${EXTRACT_PATH}`
  ];
  
  await log(`🔧 Running: 7z ${args.join(' ')}`);
  
  return new Promise((resolve) => {
    const extract = spawn('7z', args, {
      cwd: EXTRACT_PATH,
      stdio: ['ignore', 'pipe', 'pipe']
    });
    
    let lastProgress = 0;
    let progressTimer;
    let idleTime = 0;
    const maxIdleTime = 300000; // 5 minutes
    
    // Monitor progress
    progressTimer = setInterval(async () => {
      const size = await getCurrentSize();
      const sizeGB = (size / 1024 / 1024 / 1024).toFixed(2);
      
      if (size > lastProgress) {
        const speedMBps = ((size - lastProgress) / 1024 / 1024 / 10).toFixed(2);
        await log(`📈 Progress: ${sizeGB} GB (${speedMBps} MB/s)`);
        lastProgress = size;
        idleTime = 0;
      } else {
        idleTime += 10000;
        if (idleTime >= maxIdleTime) {
          await log(`⚠️ No progress for 5 minutes, stopping...`);
          extract.kill('SIGTERM');
        }
      }
    }, 10000); // Check every 10 seconds
    
    extract.stdout.on('data', (data) => {
      const output = data.toString();
      // Log progress lines
      if (output.includes('%') || output.includes('Extracting')) {
        process.stdout.write('\r' + output.trim());
      }
    });
    
    extract.stderr.on('data', async (data) => {
      await log(`⚠️ Error: ${data.toString()}`);
    });
    
    extract.on('close', async (code) => {
      clearInterval(progressTimer);
      
      if (code === 0) {
        await log(`✅ Extraction completed successfully!`);
        resolve(true);
      } else {
        await log(`❌ Extraction failed with code ${code}`);
        
        // Check if we made progress
        const newSize = await getCurrentSize();
        if (newSize > currentSize) {
          await log(`📊 Made progress: ${((newSize - currentSize) / 1024 / 1024 / 1024).toFixed(2)} GB extracted`);
          
          if (attempt < maxAttempts) {
            await log(`🔄 Retrying in 30 seconds...`);
            setTimeout(() => {
              extractWithRetry(attempt + 1).then(resolve);
            }, 30000);
          } else {
            await log(`❌ Max attempts reached`);
            resolve(false);
          }
        } else {
          await log(`❌ No progress made, stopping`);
          resolve(false);
        }
      }
    });
    
    extract.on('error', async (error) => {
      await log(`❌ Process error: ${error.message}`);
      clearInterval(progressTimer);
      resolve(false);
    });
  });
}

async function main() {
  await log('\n🎯 WIS VDI Extraction with Resume Support\n');
  
  // Check if 7z is installed
  try {
    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execAsync = promisify(exec);
    await execAsync('which 7z');
  } catch {
    await log('❌ 7z not found! Install with: brew install p7zip');
    return;
  }
  
  // Start extraction
  const success = await extractWithRetry();
  
  if (success) {
    const finalSize = await getCurrentSize();
    const finalGB = (finalSize / 1024 / 1024 / 1024).toFixed(2);
    await log(`\n✅ Final VDI size: ${finalGB} GB`);
    await log('\n📋 Next steps:');
    await log('1. Run: node scripts/mount-and-parse-wis.js');
    await log('2. Or import VM in VirtualBox');
  } else {
    await log('\n❌ Extraction failed');
    await log('💡 Try running manually:');
    await log(`   cd "${EXTRACT_PATH}"`);
    await log('   7z x Mercedes09.7z.001 MERCEDES.vdi -y');
  }
}

// Run extraction
main().catch(console.error);