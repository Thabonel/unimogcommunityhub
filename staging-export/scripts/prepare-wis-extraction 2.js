#!/usr/bin/env node

import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const ARCHIVE_PATH = '/Volumes/EDIT/UNIMOG MANUALS/BIG UNIMOG MANUALS';
const WORK_DIR = path.join(process.cwd(), 'wis-extraction');

console.log('🚀 WIS EPC Data Preparation\n');

async function checkArchiveParts() {
  console.log('📦 Checking archive parts...\n');
  
  const parts = [
    'Benz1/Mercedes09.7z.001',
    'Benz2/Mercedes09.7z.002',
    'Benz3/Mercedes09.7z.003',
    'Benz4/Mercedes09.7z.004'
  ];
  
  let totalSize = 0;
  for (const part of parts) {
    const fullPath = path.join(ARCHIVE_PATH, part);
    try {
      const stats = await fs.stat(fullPath);
      const sizeGB = (stats.size / 1024 / 1024 / 1024).toFixed(2);
      console.log(`✅ ${part}: ${sizeGB} GB`);
      totalSize += stats.size;
    } catch (error) {
      console.error(`❌ Missing: ${part}`);
      return false;
    }
  }
  
  console.log(`\n📊 Total archive size: ${(totalSize / 1024 / 1024 / 1024).toFixed(2)} GB\n`);
  return true;
}

async function createWorkDirectory() {
  console.log('📁 Creating work directory...');
  await fs.mkdir(WORK_DIR, { recursive: true });
  console.log(`✅ Created: ${WORK_DIR}\n`);
}

async function testExtraction() {
  console.log('🧪 Testing extraction with first 100MB...\n');
  
  const firstPart = path.join(ARCHIVE_PATH, 'Benz1/Mercedes09.7z.001');
  
  try {
    // First, try to list the contents without extracting
    console.log('📋 Attempting to list archive contents...');
    
    // 7z needs all parts in the same directory for multi-part archives
    // Let's create symbolic links
    console.log('\n🔗 Creating symbolic links for all parts...');
    
    for (let i = 1; i <= 4; i++) {
      const source = path.join(ARCHIVE_PATH, `Benz${i}/Mercedes09.7z.00${i}`);
      const target = path.join(WORK_DIR, `Mercedes09.7z.00${i}`);
      
      try {
        // Remove existing link if any
        await fs.unlink(target).catch(() => {});
        // Create new link
        await fs.symlink(source, target);
        console.log(`✅ Linked part ${i}`);
      } catch (error) {
        console.error(`❌ Failed to link part ${i}:`, error.message);
      }
    }
    
    // Now try to list the archive
    console.log('\n📋 Listing archive contents...');
    const listCmd = `cd "${WORK_DIR}" && 7z l Mercedes09.7z.001 | head -100`;
    const { stdout } = await execAsync(listCmd);
    console.log('\nArchive contents preview:');
    console.log(stdout);
    
    // Save full listing for analysis
    console.log('\n💾 Saving full archive listing...');
    await execAsync(`cd "${WORK_DIR}" && 7z l Mercedes09.7z.001 > archive-contents.txt`);
    console.log('✅ Saved to: wis-extraction/archive-contents.txt');
    
    return true;
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

async function analyzeArchiveContents() {
  console.log('\n🔍 Analyzing archive structure...\n');
  
  try {
    const contentsFile = path.join(WORK_DIR, 'archive-contents.txt');
    const content = await fs.readFile(contentsFile, 'utf8');
    
    // Parse 7z listing
    const lines = content.split('\n');
    const files = [];
    let inFileList = false;
    
    for (const line of lines) {
      if (line.includes('-------------------')) {
        inFileList = !inFileList;
        continue;
      }
      
      if (inFileList && line.trim()) {
        // Parse: date time attr size compressed name
        const match = line.match(/(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2})\s+([\.D]+)\s+(\d+)\s+(\d+)\s+(.+)/);
        if (match) {
          const [, datetime, attr, size, compressed, filepath] = match;
          files.push({
            path: filepath.trim(),
            size: parseInt(size),
            isDir: attr.includes('D')
          });
        }
      }
    }
    
    // Analyze structure
    const stats = {
      totalFiles: files.filter(f => !f.isDir).length,
      totalDirs: files.filter(f => f.isDir).length,
      totalSize: files.reduce((sum, f) => sum + f.size, 0),
      topDirs: new Set(),
      fileTypes: new Map(),
      wisFiles: [],
      epcFiles: []
    };
    
    files.forEach(file => {
      if (!file.isDir) {
        // Get file extension
        const ext = path.extname(file.path).toLowerCase();
        if (ext) {
          stats.fileTypes.set(ext, (stats.fileTypes.get(ext) || 0) + 1);
        }
        
        // Check for WIS/EPC files
        const upperPath = file.path.toUpperCase();
        if (upperPath.includes('WIS') || upperPath.includes('WORKSHOP')) {
          stats.wisFiles.push(file);
        }
        if (upperPath.includes('EPC') || upperPath.includes('PARTS')) {
          stats.epcFiles.push(file);
        }
      }
      
      // Get top-level directory
      const parts = file.path.split(/[\/\\]/);
      if (parts.length > 0 && parts[0]) {
        stats.topDirs.add(parts[0]);
      }
    });
    
    console.log('📊 Archive Statistics:');
    console.log(`   Total files: ${stats.totalFiles.toLocaleString()}`);
    console.log(`   Total directories: ${stats.totalDirs.toLocaleString()}`);
    console.log(`   Total size: ${(stats.totalSize / 1024 / 1024 / 1024).toFixed(2)} GB`);
    
    console.log('\n📁 Top-level directories:');
    Array.from(stats.topDirs).slice(0, 20).forEach(dir => {
      console.log(`   - ${dir}`);
    });
    
    console.log('\n📄 File types (top 10):');
    Array.from(stats.fileTypes.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .forEach(([ext, count]) => {
        console.log(`   ${ext}: ${count.toLocaleString()} files`);
      });
    
    console.log(`\n🔧 WIS files found: ${stats.wisFiles.length}`);
    console.log(`🔧 EPC files found: ${stats.epcFiles.length}`);
    
    // Save analysis
    await fs.writeFile(
      path.join(WORK_DIR, 'archive-analysis.json'),
      JSON.stringify(stats, null, 2)
    );
    
    return stats;
  } catch (error) {
    console.error('❌ Error analyzing archive:', error.message);
    return null;
  }
}

async function main() {
  try {
    // Check archive parts
    const partsOk = await checkArchiveParts();
    if (!partsOk) {
      console.error('\n❌ Archive parts missing or corrupted');
      return;
    }
    
    // Create work directory
    await createWorkDirectory();
    
    // Test extraction
    const extracted = await testExtraction();
    if (!extracted) {
      console.error('\n❌ Failed to access archive');
      return;
    }
    
    // Analyze contents
    const analysis = await analyzeArchiveContents();
    if (!analysis) {
      console.error('\n❌ Failed to analyze archive');
      return;
    }
    
    console.log('\n✅ Analysis complete!');
    console.log('\n📌 Next steps:');
    console.log('1. Review archive-contents.txt to understand structure');
    console.log('2. Create extraction plan based on file types');
    console.log('3. Extract specific WIS/EPC data');
    console.log('4. Convert to Supabase format');
    
    console.log('\n💡 To extract specific files:');
    console.log('   node scripts/extract-wis-selective.js');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

main();