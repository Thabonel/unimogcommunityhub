#!/usr/bin/env node

/**
 * Split the large procedures SQL file into smaller chunks
 * Each chunk can be run separately in Supabase SQL Editor
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROCEDURES_SQL = path.join(__dirname, '02-import-procedures.sql');
const OUTPUT_DIR = path.join(__dirname, 'procedures-chunks');

// Create output directory
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR);
}

console.log('📚 Splitting procedures SQL into smaller chunks...\n');

// Read the large SQL file
const sqlContent = fs.readFileSync(PROCEDURES_SQL, 'utf8');

// Split by INSERT statements (each batch is already separated)
const lines = sqlContent.split('\n');
let currentChunk = [];
let chunkNumber = 1;
let procedureCount = 0;
let inInsertStatement = false;
let header = '';

// Extract header
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.startsWith('INSERT INTO wis_procedures')) {
    header = lines.slice(0, i).join('\n');
    break;
  }
}

// Process lines and create chunks
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  if (line.startsWith('-- Batch')) {
    // Start of a new batch
    if (currentChunk.length > 0) {
      // Save previous chunk
      saveChunk(chunkNumber, currentChunk, header);
      chunkNumber++;
      currentChunk = [];
    }
  }
  
  if (line.startsWith('INSERT INTO wis_procedures')) {
    inInsertStatement = true;
  }
  
  if (inInsertStatement) {
    currentChunk.push(line);
    
    // Count procedures
    if (line.includes('uuid(')) {
      procedureCount++;
    }
    
    // End of INSERT statement
    if (line.endsWith(';')) {
      inInsertStatement = false;
    }
  }
}

// Save last chunk
if (currentChunk.length > 0) {
  saveChunk(chunkNumber, currentChunk, header);
}

function saveChunk(number, lines, header) {
  const filename = path.join(OUTPUT_DIR, `chunk-${String(number).padStart(2, '0')}-procedures.sql`);
  
  let content = `-- WIS Procedures Import - Chunk ${number}
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor/sql/new
-- This is chunk ${number} of the procedures import

${lines.join('\n')}

-- Verify this chunk
SELECT COUNT(*) as procedures_in_db FROM wis_procedures;
`;

  fs.writeFileSync(filename, content);
  
  // Count procedures in this chunk
  const proceduresInChunk = (lines.join('\n').match(/uuid\(/g) || []).length;
  console.log(`✅ Chunk ${number}: ${proceduresInChunk} procedures → ${filename}`);
}

console.log(`\n📊 Summary:`);
console.log(`- Total chunks created: ${chunkNumber}`);
console.log(`- Total procedures: ${procedureCount}`);
console.log(`- Files saved in: ${OUTPUT_DIR}`);

console.log('\n📋 To import:');
console.log('1. Go to: https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor/sql/new');
console.log('2. Run each chunk file in order (chunk-01, chunk-02, etc.)');
console.log('3. Each chunk should take only a few seconds to run');