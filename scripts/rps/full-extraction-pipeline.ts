#!/usr/bin/env tsx

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envTempPath = path.join(__dirname, '.env.temp');
if (fs.existsSync(envTempPath)) {
  const envContent = fs.readFileSync(envTempPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      process.env[key.trim()] = value.trim();
    }
  });
}

const supabase = createClient(process.env.VITE_SUPABASE_URL || '', process.env.SUPABASE_SERVICE_ROLE_KEY || '');

const PDF_DIR = '/Users/thabonel/Code/Work/rps_processed';
const OUTPUT_DIR = path.join(__dirname, 'output');
const ILLUS_DIR = path.join(__dirname, 'output', 'all_illustrations');

interface Part {
  item_number: string;
  niin: string | null;
  nsn: string | null;
  description: string;
  quantity: number | null;
  repair_grade: string | null;
}

interface GroupExtraction {
  group_code: string;
  group_name: string;
  rps_number: string;
  page_start: number;
  page_end: number;
  parts: Part[];
  illustrations: any[];
  source_pdf: string;
}

console.log('\n' + '='.repeat(100));
console.log('COMPLETE RPS CATALOG EXTRACTION PIPELINE');
console.log('Full 930-page autonomous extraction');
console.log('='.repeat(100) + '\n');

// Step 1: Extract text from all main PDF chunks
async function extractAllText() {
  console.log('STEP 1: Extracting text from all PDF chunks...\n');
  
  const pdfFiles = fs.readdirSync(PDF_DIR)
    .filter(f => f.endsWith('.pdf') && f.match(/chunk_\d{3}[^a-z]/) || f.match(/chunk_\d{2}[^ab]/))
    .sort();

  const textData: Record<string, string> = {};
  
  for (const pdfFile of pdfFiles) {
    const fullPath = path.join(PDF_DIR, pdfFile);
    try {
      const text = execSync(`pdftotext "${fullPath}" - 2>/dev/null`, { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 });
      textData[pdfFile] = text;
      console.log(`  ✅ ${pdfFile} (${(text.length / 1024).toFixed(0)}KB)`);
    } catch (e) {
      console.log(`  ⚠️  ${pdfFile}: extraction error`);
    }
  }

  console.log(`\n✅ Extracted text from ${Object.keys(textData).length} PDF chunks\n`);
  return textData;
}

// Step 2: Parse text to find all groups and parts
async function parseAllGroups(textData: Record<string, string>) {
  console.log('STEP 2: Parsing all groups and parts...\n');
  
  const groups = new Map<string, GroupExtraction>();
  
  // Common RPS group codes based on military repair parts catalogs
  const knownGroups = [
    'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ',
    'BA', 'BB', 'BC', 'BD', 'BE', 'BF', 'BG', 'BH',
    'CA', 'CB', 'CC', 'CD', 'CE', 'CF', 'CG',
    'DA', 'DB', 'DC', 'DD', 'DE', 'DF', 'DG', 'DH', 'DI', 'DJ', 'DK',
    'EA', 'EB', 'EC', 'ED', 'EE', 'EF', 'EG', 'EH',
    'FA', 'FB', 'FC', 'FD', 'FE', 'FF', 'FG', 'FH', 'FI', 'FJ', 'FK', 'FL',
    'GA', 'GB', 'GC', 'GD', 'GE', 'GF', 'GG', 'GH',
    'HA', 'HB', 'HC', 'HD', 'HE', 'HF', 'HG', 'HH',
    'J', 'JA', 'JB', 'JC', 'JD', 'JE', 'JF', 'JG', 'JH',
    'KA', 'KB', 'KC', 'KD', 'KE', 'KF', 'KG',
    'LA', 'LB', 'LC', 'LD', 'LE', 'LF', 'LG', 'LH',
    'MA', 'MB', 'MC', 'MD', 'ME', 'MF', 'MG',
    'NA', 'NB', 'NC', 'ND', 'NE', 'NF', 'NG', 'NH',
  ];
  
  const itemPattern = /^\s*(\d{3,4})\s+(.+?)(?:\s+([\d\-]{5,}))?\s*$/m;
  const niinPattern = /\b(\d{2}-\d{3}-\d{4})\b/;
  const nsnPattern = /\b([\d\s]{4}[\s\-][\d\-]{2}[\s\-][\d\-]{3}[\s\-]\d{4})\b/;
  
  for (const [pdfFile, text] of Object.entries(textData)) {
    const match = pdfFile.match(/pages_(\d+)-(\d+)/);
    if (!match) continue;
    
    const pageStart = parseInt(match[1]);
    const pageEnd = parseInt(match[2]);
    
    // Find all group codes in this PDF
    for (const groupCode of knownGroups) {
      const groupRegex = new RegExp(`^\\s*${groupCode}\\s+`, 'm');
      if (groupRegex.test(text)) {
        if (!groups.has(groupCode)) {
          groups.set(groupCode, {
            group_code: groupCode,
            group_name: '',
            rps_number: '02155',
            page_start: pageStart,
            page_end: pageEnd,
            parts: [],
            illustrations: [],
            source_pdf: pdfFile,
          });
        }
      }
    }
  }
  
  console.log(`  Found ${groups.size} groups\n`);
  
  // For each group, extract parts from text
  let totalParts = 0;
  for (const [groupCode, groupData] of groups) {
    // Simple extraction: look for item numbers in this group
    const lines = textData[groupData.source_pdf].split('\n');
    let inGroup = false;
    
    for (const line of lines) {
      if (line.includes(groupCode)) {
        inGroup = true;
      } else if (inGroup && line.match(/^[A-Z]{2,3}\s+/) && !line.includes(groupCode)) {
        inGroup = false;
      }
      
      if (inGroup && line.match(/^\s*\d{3,4}\s+/)) {
        const parts = line.split(/\s{2,}/);
        if (parts.length >= 2) {
          groupData.parts.push({
            item_number: parts[0].trim(),
            description: parts[1]?.trim() || '',
            niin: line.match(niinPattern)?.[1] || null,
            nsn: line.match(nsnPattern)?.[1]?.replace(/\s/g, ' ') || null,
            quantity: null,
            repair_grade: null,
          });
          totalParts++;
        }
      }
    }
  }
  
  console.log(`✅ Extracted ${totalParts} parts from all groups\n`);
  return groups;
}

// Step 3: Extract illustrations
async function extractAllIllustrations() {
  console.log('STEP 3: Extracting all illustrations...\n');
  
  if (!fs.existsSync(ILLUS_DIR)) {
    fs.mkdirSync(ILLUS_DIR, { recursive: true });
  }
  
  const pdfFiles = fs.readdirSync(PDF_DIR)
    .filter(f => f.endsWith('.pdf'))
    .sort();
  
  let extracted = 0;
  const illustrations: Record<string, string[]> = {};
  
  for (const pdfFile of pdfFiles) {
    const fullPath = path.join(PDF_DIR, pdfFile);
    const match = pdfFile.match(/pages_(\d+)-(\d+)/);
    if (!match) continue;
    
    const startPage = parseInt(match[1]);
    const endPage = parseInt(match[2]);
    
    // Extract every 5th page as potential illustration (rough heuristic)
    for (let page = startPage; page <= endPage; page += 3) {
      const outputName = `page_${String(page).padStart(4, '0')}`;
      const outputPath = path.join(ILLUS_DIR, outputName);
      
      try {
        execSync(`pdftoppm -png -singlefile -f ${page} -l ${page} "${fullPath}" "${outputPath}" 2>/dev/null`, {
          stdio: 'pipe',
        });
        
        if (fs.existsSync(`${outputPath}.png`)) {
          illustrations[`${pdfFile}_page${page}`] = [`${outputPath}.png`];
          extracted++;
        }
      } catch (e) {
        // Skip failed extractions
      }
    }
  }
  
  console.log(`✅ Extracted ${extracted} illustration pages\n`);
  return illustrations;
}

// Step 4: Upload to database and storage
async function uploadToDatabase(groups: Map<string, GroupExtraction>) {
  console.log('STEP 4: Uploading to database...\n');
  
  let uploaded = 0;
  
  for (const [groupCode, groupData] of groups) {
    try {
      // Create group record
      const { error: groupError } = await supabase
        .from('rps_groups')
        .upsert({
          group_code: groupCode,
          group_name: groupData.group_name,
          rps_number: groupData.rps_number,
          total_parts: groupData.parts.length,
          page_start: groupData.page_start,
          page_end: groupData.page_end,
          chunk_file: groupData.source_pdf,
        })
        .eq('group_code', groupCode);
      
      if (groupError) {
        console.log(`  ⚠️  Group ${groupCode}: ${groupError.message}`);
        continue;
      }
      
      // Create part records
      if (groupData.parts.length > 0) {
        const partsData = groupData.parts.map(part => ({
          group_code: groupCode,
          item_number: part.item_number,
          description: part.description,
          niin: part.niin,
          nsn: part.nsn,
          rps_number: groupData.rps_number,
          quantity: part.quantity,
          repair_grade: part.repair_grade,
          page_number: groupData.page_start,
        }));
        
        const { error: partsError } = await supabase
          .from('rps_parts')
          .upsert(partsData)
          .eq('group_code', groupCode);
        
        if (!partsError) {
          console.log(`  ✅ ${groupCode}: ${groupData.parts.length} parts`);
          uploaded++;
        }
      }
    } catch (e) {
      console.log(`  ⚠️  ${groupCode}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }
  
  console.log(`\n✅ Uploaded ${uploaded} groups to database\n`);
}

// Step 5: Upload illustrations to storage
async function uploadIllustrations(illustrations: Record<string, string[]>) {
  console.log('STEP 5: Uploading illustrations to storage...\n');
  
  let uploaded = 0;
  
  for (const [key, files] of Object.entries(illustrations)) {
    for (const filePath of files) {
      if (fs.existsSync(filePath)) {
        try {
          const fileName = path.basename(filePath);
          const fileContent = fs.readFileSync(filePath);
          
          const { error } = await supabase.storage
            .from('rps_illustrations')
            .upload(fileName, fileContent, { upsert: true });
          
          if (!error) {
            uploaded++;
          }
        } catch (e) {
          // Skip upload errors
        }
      }
    }
  }
  
  console.log(`✅ Uploaded ${uploaded} illustrations to storage\n`);
}

// Step 6: Verification
async function verifyExtraction() {
  console.log('STEP 6: Verification...\n');
  
  const { count: groupCount } = await supabase
    .from('rps_groups')
    .select('*', { count: 'exact' });
  
  const { count: partCount } = await supabase
    .from('rps_parts')
    .select('*', { count: 'exact' });
  
  const { count: illusCount } = await supabase
    .from('rps_illustrations')
    .select('*', { count: 'exact' });
  
  console.log('Final Counts:');
  console.log(`  Groups: ${groupCount}`);
  console.log(`  Parts: ${partCount}`);
  console.log(`  Illustrations: ${illusCount}\n`);
  
  return { groupCount, partCount, illusCount };
}

// Main execution
async function runFullPipeline() {
  try {
    const textData = await extractAllText();
    const groups = await parseAllGroups(textData);
    const illustrations = await extractAllIllustrations();
    await uploadToDatabase(groups);
    await uploadIllustrations(illustrations);
    const results = await verifyExtraction();
    
    console.log('='.repeat(100));
    console.log('✅ COMPLETE RPS EXTRACTION FINISHED');
    console.log('='.repeat(100));
    console.log(`\nResults: ${results.groupCount} groups, ${results.partCount} parts, ${results.illusCount} illustrations\n`);
    
    return 0;
  } catch (error) {
    console.error('Pipeline failed:', error);
    return 1;
  }
}

runFullPipeline().then(code => process.exit(code));
