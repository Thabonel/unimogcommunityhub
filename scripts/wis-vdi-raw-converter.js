#!/usr/bin/env node

/**
 * WIS VDI to RAW Converter
 * Converts the entire VDI to RAW format for direct access
 * Then extracts WIS files without needing mounting
 */

import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

const CONFIG = {
  vdiFile: '/Volumes/UnimogManuals/wis-extraction/MERCEDES.vdi',
  rawFile: '/Volumes/UnimogManuals/wis-extraction/MERCEDES.raw',
  extractPath: '/Volumes/UnimogManuals/wis-ready-to-upload',
  tempPath: '/Volumes/UnimogManuals/wis-temp',
  chunkSize: '1G', // Process in 1GB chunks
};

let progress = {
  stage: 'starting',
  converted: 0,
  totalSize: 0,
  startTime: Date.now(),
  errors: []
};

async function saveProgress() {
  await fs.writeFile(
    '/Volumes/UnimogManuals/wis-conversion-progress.json',
    JSON.stringify(progress, null, 2)
  );
}

async function checkSpace() {
  console.log('💾 Checking disk space...');
  
  const { stdout } = await execAsync('df -k /Volumes/UnimogManuals');
  const lines = stdout.split('\n');
  const data = lines[1].split(/\s+/);
  const available = parseInt(data[3]) * 1024; // Convert to bytes
  
  const vdiStats = await fs.stat(CONFIG.vdiFile);
  const vdiSize = vdiStats.size;
  
  console.log(`  VDI size: ${(vdiSize / 1024 / 1024 / 1024).toFixed(2)}GB`);
  console.log(`  Available: ${(available / 1024 / 1024 / 1024).toFixed(2)}GB`);
  
  if (available < vdiSize * 1.2) { // Need 20% extra space
    throw new Error('Insufficient disk space for conversion');
  }
  
  progress.totalSize = vdiSize;
  return { vdiSize, available };
}

async function convertVDI() {
  console.log('🔄 Converting VDI to RAW format...');
  console.log('This may take 30-60 minutes for a 54GB file...');
  
  progress.stage = 'converting';
  await saveProgress();
  
  try {
    // Check if RAW file already exists
    try {
      const rawStats = await fs.stat(CONFIG.rawFile);
      console.log('✅ RAW file already exists, skipping conversion');
      progress.converted = rawStats.size;
      progress.stage = 'converted';
      await saveProgress();
      return true;
    } catch {
      // RAW file doesn't exist, proceed with conversion
    }
    
    console.log('Starting qemu-img conversion...');
    
    // Use spawn for better progress monitoring
    return new Promise((resolve, reject) => {
      const convert = spawn('qemu-img', [
        'convert',
        '-f', 'vdi',
        '-O', 'raw',
        '-p', // Show progress
        CONFIG.vdiFile,
        CONFIG.rawFile
      ]);
      
      convert.stdout.on('data', (data) => {
        const output = data.toString();
        console.log(output.trim());
        
        // Extract progress percentage
        const match = output.match(/\((\d+\.\d+)\/100%\)/);
        if (match) {
          const percent = parseFloat(match[1]);
          progress.converted = (percent / 100) * progress.totalSize;
          console.log(`📊 Conversion progress: ${percent.toFixed(1)}%`);
        }
      });
      
      convert.stderr.on('data', (data) => {
        console.error('Conversion error:', data.toString());
      });
      
      convert.on('close', (code) => {
        if (code === 0) {
          console.log('✅ VDI conversion completed successfully');
          progress.stage = 'converted';
          progress.converted = progress.totalSize;
          saveProgress();
          resolve(true);
        } else {
          reject(new Error(`Conversion failed with code ${code}`));
        }
      });
      
      convert.on('error', reject);
    });
    
  } catch (error) {
    console.error('❌ Conversion failed:', error.message);
    progress.errors.push({ stage: 'conversion', error: error.message });
    await saveProgress();
    return false;
  }
}

async function analyzeRAW() {
  console.log('\n🔍 Analyzing RAW file structure...');
  
  try {
    // Get file type information
    const { stdout: fileInfo } = await execAsync(`file "${CONFIG.rawFile}"`);
    console.log('File type:', fileInfo);
    
    // Try to find filesystem signatures
    console.log('Searching for NTFS signatures...');
    const { stdout: signatures } = await execAsync(
      `hexdump -C "${CONFIG.rawFile}" | head -100 | grep -i ntfs || echo "No NTFS signature found in first blocks"`
    );
    console.log(signatures);
    
    // Look for WIS-related strings in the first part of the file
    console.log('Searching for WIS references...');
    const { stdout: wisStrings } = await execAsync(
      `strings "${CONFIG.rawFile}" | grep -i "wis\\|unimog\\|mercedes" | head -20`
    );
    
    if (wisStrings.trim()) {
      console.log('📝 Found WIS references:');
      console.log(wisStrings);
      return true;
    } else {
      console.log('⚠️ No WIS references found in accessible areas');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Analysis failed:', error.message);
    return false;
  }
}

async function extractFilesFromRAW() {
  console.log('\n📤 Extracting files from RAW image...');
  
  try {
    // Create extraction directory
    await fs.mkdir(CONFIG.extractPath, { recursive: true });
    
    // Try using 7zip to extract files
    try {
      await execAsync('which 7z');
      console.log('Using 7zip for extraction...');
      
      const { stdout } = await execAsync(
        `7z l "${CONFIG.rawFile}" | grep -i "unimog\\|wis\\|mercedes" | head -20`
      );
      
      if (stdout.trim()) {
        console.log('📋 Found relevant files:');
        console.log(stdout);
        
        // Extract relevant files
        await execAsync(
          `7z x "${CONFIG.rawFile}" -o"${CONFIG.extractPath}" "*unimog*" "*wis*" "*mercedes*" -r`
        );
        
        console.log('✅ Extraction with 7zip completed');
        return true;
      } else {
        console.log('No files found with 7zip');
      }
      
    } catch {
      console.log('7zip not available');
    }
    
    // Alternative: Try photorec for file recovery
    try {
      await execAsync('which photorec');
      console.log('Trying PhotoRec for file recovery...');
      
      // Create PhotoRec config
      const photorecConfig = `${CONFIG.tempPath}/photorec.cfg`;
      await fs.mkdir(CONFIG.tempPath, { recursive: true });
      
      const config = `
search,doc,enable
search,pdf,enable
search,jpg,enable
search,png,enable
search,txt,enable
`;
      
      await fs.writeFile(photorecConfig, config);
      
      // Run PhotoRec (this might take a while)
      console.log('⚠️ PhotoRec recovery may take several hours...');
      console.log('This will recover deleted/lost files from the image');
      
    } catch {
      console.log('PhotoRec not available');
    }
    
    console.log('⚠️ Extraction requires specialized tools or manual partition mounting');
    return false;
    
  } catch (error) {
    console.error('❌ Extraction failed:', error.message);
    return false;
  }
}

async function cleanup() {
  console.log('\n🧹 Cleanup options:');
  console.log(`  RAW file: ${CONFIG.rawFile} (${(progress.totalSize / 1024 / 1024 / 1024).toFixed(2)}GB)`);
  console.log('  Keep RAW file for future use? (Manual decision needed)');
  
  // Clean up temp files
  try {
    await execAsync(`rm -rf "${CONFIG.tempPath}"`);
    console.log('✅ Cleaned up temporary files');
  } catch {
    // Ignore cleanup errors
  }
}

async function generateReport() {
  const duration = Date.now() - progress.startTime;
  
  const report = {
    conversion: {
      vdiFile: CONFIG.vdiFile,
      rawFile: CONFIG.rawFile,
      size: `${(progress.totalSize / 1024 / 1024 / 1024).toFixed(2)}GB`,
      duration: `${Math.floor(duration / 60000)} minutes`,
      success: progress.stage === 'converted'
    },
    extraction: {
      outputPath: CONFIG.extractPath,
      filesExtracted: 0 // Will be updated if extraction succeeds
    },
    errors: progress.errors,
    timestamp: new Date().toISOString()
  };
  
  await fs.writeFile(
    '/Volumes/UnimogManuals/wis-conversion-report.json',
    JSON.stringify(report, null, 2)
  );
  
  console.log('\n📊 Conversion Report:');
  console.log(`  Duration: ${report.conversion.duration}`);
  console.log(`  Size: ${report.conversion.size}`);
  console.log(`  Success: ${report.conversion.success ? '✅' : '❌'}`);
  console.log(`  Errors: ${report.errors.length}`);
}

async function main() {
  console.log('🚀 WIS VDI to RAW Converter\n');
  
  try {
    // Check prerequisites
    const spaceCheck = await checkSpace();
    
    // Convert VDI to RAW
    const conversionOk = await convertVDI();
    
    if (conversionOk) {
      // Analyze the RAW file
      const analysisOk = await analyzeRAW();
      
      if (analysisOk) {
        // Try to extract files
        await extractFilesFromRAW();
      }
    }
    
    // Generate report
    await generateReport();
    
    // Cleanup
    await cleanup();
    
    console.log('\n✅ Conversion process completed');
    console.log('Check the report file for details');
    
  } catch (error) {
    console.error('\n❌ Process failed:', error.message);
    progress.errors.push({ stage: 'main', error: error.message });
    await saveProgress();
  }
}

// Handle interruption
process.on('SIGINT', async () => {
  console.log('\n⚠️ Process interrupted, saving progress...');
  progress.errors.push({ stage: 'interrupted', error: 'User interrupted' });
  await saveProgress();
  process.exit(0);
});

main().catch(console.error);