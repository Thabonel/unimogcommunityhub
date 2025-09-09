#!/usr/bin/env node

/**
 * Import WIS data using Supabase REST API (works with IPv4)
 * Fallback option if direct database connection isn't available
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing required environment variables');
  console.error('Please ensure VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env');
  process.exit(1);
}

// Parse SQL INSERT statements to extract values
function parseSQLInserts(sql) {
  const records = [];
  
  // Match INSERT INTO ... VALUES patterns
  const insertPattern = /INSERT INTO (\w+) \((.*?)\) VALUES([\s\S]*?);/g;
  let match;
  
  while ((match = insertPattern.exec(sql)) !== null) {
    const tableName = match[1];
    const columns = match[2].split(',').map(c => c.trim());
    const valuesSection = match[3];
    
    // Parse each value tuple
    const valuePattern = /\(([\s\S]*?)\)(?:,|$)/g;
    let valueMatch;
    
    while ((valueMatch = valuePattern.exec(valuesSection)) !== null) {
      const values = [];
      const valueStr = valueMatch[1];
      
      // Parse individual values (handling nested arrays, json, etc.)
      let current = '';
      let depth = 0;
      let inString = false;
      let escape = false;
      
      for (let i = 0; i < valueStr.length; i++) {
        const char = valueStr[i];
        
        if (escape) {
          current += char;
          escape = false;
          continue;
        }
        
        if (char === '\\') {
          escape = true;
          current += char;
          continue;
        }
        
        if (char === "'" && !inString) {
          inString = true;
        } else if (char === "'" && inString && valueStr[i-1] !== "'") {
          inString = false;
        }
        
        if (!inString) {
          if (char === '[' || char === '{' || char === '(') depth++;
          if (char === ']' || char === '}' || char === ')') depth--;
          
          if (char === ',' && depth === 0) {
            values.push(parseValue(current.trim()));
            current = '';
            continue;
          }
        }
        
        current += char;
      }
      
      if (current.trim()) {
        values.push(parseValue(current.trim()));
      }
      
      // Create object from columns and values
      const record = {};
      columns.forEach((col, idx) => {
        if (values[idx] !== undefined) {
          record[col] = values[idx];
        }
      });
      
      records.push({ table: tableName, record });
    }
  }
  
  return records;
}

// Parse individual SQL value
function parseValue(str) {
  // Remove uuid() wrapper
  if (str.startsWith('uuid(')) {
    return str.slice(5, -1).replace(/'/g, '');
  }
  
  // NULL
  if (str === 'NULL') return null;
  
  // Boolean
  if (str === 'true') return true;
  if (str === 'false') return false;
  
  // Number
  if (/^\d+(\.\d+)?$/.test(str)) {
    return parseFloat(str);
  }
  
  // Array
  if (str.startsWith('ARRAY[')) {
    const arrayContent = str.slice(6, str.indexOf(']'));
    if (arrayContent === '') return [];
    return arrayContent.split(',').map(item => {
      return item.trim().replace(/^'|'$/g, '').replace(/''/g, "'");
    });
  }
  
  // String (remove quotes and handle escapes)
  if (str.startsWith("'") && str.endsWith("'")) {
    return str.slice(1, -1).replace(/''/g, "'");
  }
  
  return str;
}

// Batch insert records via REST API
async function batchInsert(tableName, records, batchSize = 50) {
  const url = `${SUPABASE_URL}/rest/v1/${tableName}`;
  
  console.log(`📤 Inserting ${records.length} records into ${tableName}...`);
  
  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'apikey': SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(batch)
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`HTTP ${response.status}: ${error}`);
      }
      
      process.stdout.write(`\r   Progress: ${Math.min(i + batchSize, records.length)}/${records.length} records`);
    } catch (error) {
      console.error(`\n❌ Failed at batch ${Math.floor(i/batchSize) + 1}: ${error.message}`);
      throw error;
    }
  }
  
  console.log(`\n✅ Successfully inserted ${records.length} records into ${tableName}\n`);
}

// Main import function
async function importWISData() {
  console.log('🚀 WIS Data Import via REST API');
  console.log('================================\n');
  
  try {
    // Step 1: Vehicle Models
    console.log('STEP 1: Importing Vehicle Models');
    console.log('─────────────────────────────────');
    
    const vehicleSQL = fs.readFileSync(
      path.join(__dirname, '01-create-vehicle-models-fixed.sql'), 
      'utf8'
    );
    
    const vehicleRecords = parseSQLInserts(vehicleSQL)
      .filter(r => r.table === 'wis_models')
      .map(r => r.record);
    
    await batchInsert('wis_models', vehicleRecords);
    
    // Step 2: Procedures
    console.log('STEP 2: Importing Procedures');
    console.log('────────────────────────────');
    
    const chunksDir = path.join(__dirname, 'procedures-chunks');
    const chunkFiles = fs.readdirSync(chunksDir)
      .filter(f => f.endsWith('.sql'))
      .sort();
    
    let allProcedures = [];
    
    for (const chunkFile of chunkFiles) {
      const chunkSQL = fs.readFileSync(path.join(chunksDir, chunkFile), 'utf8');
      const procedures = parseSQLInserts(chunkSQL)
        .filter(r => r.table === 'wis_procedures')
        .map(r => r.record);
      allProcedures.push(...procedures);
    }
    
    await batchInsert('wis_procedures', allProcedures, 25); // Smaller batch for large records
    
    // Step 3: Parts
    console.log('STEP 3: Importing Parts');
    console.log('───────────────────────');
    
    const partsSQL = fs.readFileSync(
      path.join(__dirname, '03-import-parts.sql'), 
      'utf8'
    );
    
    const partsRecords = parseSQLInserts(partsSQL)
      .filter(r => r.table === 'wis_parts')
      .map(r => r.record);
    
    await batchInsert('wis_parts', partsRecords);
    
    // Step 4: Bulletins
    console.log('STEP 4: Importing Bulletins');
    console.log('───────────────────────────');
    
    const bulletinsSQL = fs.readFileSync(
      path.join(__dirname, '04-import-bulletins.sql'), 
      'utf8'
    );
    
    const bulletinRecords = parseSQLInserts(bulletinsSQL)
      .filter(r => r.table === 'wis_bulletins')
      .map(r => r.record);
    
    await batchInsert('wis_bulletins', bulletinRecords);
    
    // Verification
    console.log('VERIFICATION');
    console.log('────────────');
    
    const tables = ['wis_models', 'wis_procedures', 'wis_parts', 'wis_bulletins'];
    const counts = {};
    
    for (const table of tables) {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/${table}?select=count`,
        {
          headers: {
            'apikey': SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
            'Prefer': 'count=exact'
          }
        }
      );
      
      const count = response.headers.get('content-range')?.split('/')[1] || '0';
      counts[table] = count;
    }
    
    console.log('\n📊 Import Summary:');
    console.log(`   Vehicle Models: ${counts.wis_models}`);
    console.log(`   Procedures: ${counts.wis_procedures}`);
    console.log(`   Parts: ${counts.wis_parts}`);
    console.log(`   Bulletins: ${counts.wis_bulletins}`);
    
    console.log('\n🎉 WIS data import completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Import failed:', error.message);
    process.exit(1);
  }
}

// Run import
importWISData();