#!/usr/bin/env node

import 'dotenv/config';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const execAsync = promisify(exec);

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const ARCHIVE_PATH = '/Volumes/EDIT/UNIMOG MANUALS/BIG UNIMOG MANUALS';
const EXTRACT_PATH = '/tmp/wis-extract';

console.log('🚀 WIS EPC Data Extraction Tool\n');

async function checkDiskSpace() {
  console.log('📊 Checking disk space...');
  const { stdout } = await execAsync('df -h /tmp');
  console.log(stdout);
  
  // We need at least 50GB free for extraction
  const { stdout: available } = await execAsync("df /tmp | awk 'NR==2 {print $4}'");
  const availableGB = parseInt(available) / 1024 / 1024;
  
  if (availableGB < 50) {
    console.error('❌ Not enough disk space. Need at least 50GB free in /tmp');
    console.log(`   Available: ${availableGB.toFixed(2)}GB`);
    return false;
  }
  
  console.log(`✅ Sufficient disk space: ${availableGB.toFixed(2)}GB available\n`);
  return true;
}

async function extract7zArchive() {
  console.log('📦 Extracting WIS EPC archive...');
  console.log('   This will take 15-30 minutes for 42GB\n');
  
  // Create extraction directory
  await fs.mkdir(EXTRACT_PATH, { recursive: true });
  
  // Extract the multi-part archive
  const firstPart = path.join(ARCHIVE_PATH, 'Benz1/Mercedes09.7z.001');
  
  try {
    // First, let's test extraction with listing
    console.log('📋 Listing archive contents...');
    const { stdout: listOutput } = await execAsync(`7z l "${firstPart}" | head -50`, { maxBuffer: 1024 * 1024 * 10 });
    console.log('Archive contents preview:');
    console.log(listOutput);
    
    // Ask user to confirm before full extraction
    console.log('\n⚠️  Full extraction will use ~42GB of disk space.');
    console.log('   For now, let\'s analyze the structure first.\n');
    
    // Extract just the directory structure
    console.log('🔍 Extracting directory structure only...');
    await execAsync(`7z l "${firstPart}" > ${EXTRACT_PATH}/archive-structure.txt`);
    
    return true;
  } catch (error) {
    console.error('❌ Error during extraction:', error.message);
    console.log('\n💡 Make sure 7-zip is installed:');
    console.log('   brew install p7zip');
    return false;
  }
}

async function analyzeWISStructure() {
  console.log('\n🔍 Analyzing WIS EPC structure...');
  
  try {
    const structureFile = `${EXTRACT_PATH}/archive-structure.txt`;
    const content = await fs.readFile(structureFile, 'utf8');
    
    // Find different file types
    const lines = content.split('\n');
    const fileTypes = new Map();
    const directories = new Set();
    
    lines.forEach(line => {
      // 7z list format: date time attr size compressed name
      const match = line.match(/\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\s+[\.D]+\s+(\d+)\s+\d+\s+(.+)/);
      if (match) {
        const [, size, filePath] = match;
        const ext = path.extname(filePath).toLowerCase();
        const dir = path.dirname(filePath).split('/')[0];
        
        if (ext) {
          fileTypes.set(ext, (fileTypes.get(ext) || 0) + 1);
        }
        if (dir && dir !== '.') {
          directories.add(dir);
        }
      }
    });
    
    console.log('\n📁 Top-level directories found:');
    Array.from(directories).slice(0, 10).forEach(dir => {
      console.log(`   - ${dir}`);
    });
    
    console.log('\n📄 File types found:');
    Array.from(fileTypes.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .forEach(([ext, count]) => {
        console.log(`   ${ext}: ${count} files`);
      });
    
    return { directories: Array.from(directories), fileTypes };
  } catch (error) {
    console.error('❌ Error analyzing structure:', error.message);
    return null;
  }
}

async function createExtractionPlan() {
  console.log('\n📋 Creating extraction plan...');
  
  const plan = {
    // Key directories to extract based on WIS EPC structure
    proceduresDirs: ['WIS', 'Workshop', 'Procedures'],
    partsDirs: ['EPC', 'Parts', 'Catalog'],
    wiringDirs: ['WDS', 'Wiring', 'Diagrams'],
    bulletinsDirs: ['TSB', 'Bulletins', 'Technical'],
    
    // File patterns to look for
    patterns: {
      procedures: ['*.pdf', '*.html', '*.xml'],
      parts: ['*.dat', '*.db', '*.xml'],
      diagrams: ['*.svg', '*.png', '*.jpg', '*.dwg']
    }
  };
  
  console.log('\n🎯 Extraction strategy:');
  console.log('1. Extract and analyze WIS procedure files');
  console.log('2. Extract EPC parts catalog data');
  console.log('3. Extract wiring diagrams');
  console.log('4. Convert to Supabase format');
  console.log('5. Upload in batches\n');
  
  return plan;
}

async function main() {
  try {
    // Check prerequisites
    console.log('🔧 Checking prerequisites...\n');
    
    // Check if 7z is installed
    try {
      await execAsync('which 7z');
      console.log('✅ 7-zip is installed');
    } catch {
      console.error('❌ 7-zip not found. Install with: brew install p7zip');
      return;
    }
    
    // Check disk space
    const hasSpace = await checkDiskSpace();
    if (!hasSpace) return;
    
    // Extract and analyze
    const extracted = await extract7zArchive();
    if (!extracted) return;
    
    const structure = await analyzeWISStructure();
    if (!structure) return;
    
    const plan = await createExtractionPlan();
    
    console.log('✅ Analysis complete!\n');
    console.log('📌 Next steps:');
    console.log('1. Run full extraction (requires 42GB free space)');
    console.log('2. Parse WIS/EPC data files');
    console.log('3. Convert to structured format');
    console.log('4. Upload to Supabase\n');
    
    console.log('💡 To continue with full extraction, run:');
    console.log('   node scripts/extract-wis-full.js');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

main();