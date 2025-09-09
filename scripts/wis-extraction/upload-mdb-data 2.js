#!/usr/bin/env node

/**
 * Upload MDB extracted data to Supabase
 * Handles CSV files from mdb-tools extraction
 */

const fs = require('fs').promises;
const path = require('path');
const { parse } = require('csv-parse/sync');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// Initialize Supabase
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

// Progress tracking
let totalFiles = 0;
let processedFiles = 0;

/**
 * Process and upload CSV files from MDB extraction
 */
async function uploadMdbData(mdbDataDir) {
  console.log('📤 Starting MDB data upload to Supabase...');
  
  try {
    // Get all subdirectories (each represents an MDB file)
    const dirs = await fs.readdir(mdbDataDir);
    
    for (const dir of dirs) {
      const dirPath = path.join(mdbDataDir, dir);
      const stat = await fs.stat(dirPath);
      
      if (!stat.isDirectory()) continue;
      
      console.log(`\n📁 Processing MDB: ${dir}`);
      
      // Get all CSV files in this directory
      const csvFiles = await fs.readdir(dirPath);
      const csvFilePaths = csvFiles.filter(f => f.endsWith('.csv'));
      
      totalFiles += csvFilePaths.length;
      
      for (const csvFile of csvFilePaths) {
        await processCsvFile(path.join(dirPath, csvFile), dir);
        processedFiles++;
        showProgress();
      }
    }
    
    console.log('\n✅ MDB data upload complete!');
    console.log(`   Processed ${processedFiles} CSV files`);
    
  } catch (error) {
    console.error('❌ Error uploading MDB data:', error);
    throw error;
  }
}

/**
 * Process individual CSV file
 */
async function processCsvFile(csvPath, mdbName) {
  try {
    const content = await fs.readFile(csvPath, 'utf-8');
    if (!content.trim()) return;
    
    const tableName = path.basename(csvPath, '.csv').toLowerCase();
    
    // Parse CSV
    const records = parse(content, {
      columns: true,
      skip_empty_lines: true,
      relax_quotes: true,
      relax_column_count: true
    });
    
    if (records.length === 0) return;
    
    // Determine target table based on content
    const targetTable = determineTargetTable(tableName, records[0]);
    if (!targetTable) return;
    
    // Transform records for Supabase
    const transformedRecords = await transformRecords(records, targetTable, mdbName);
    
    if (transformedRecords.length === 0) return;
    
    // Upload in batches
    const batchSize = 100;
    for (let i = 0; i < transformedRecords.length; i += batchSize) {
      const batch = transformedRecords.slice(i, i + batchSize);
      
      const { error } = await supabase
        .from(targetTable)
        .upsert(batch, { 
          onConflict: 'procedure_id,model_id',
          ignoreDuplicates: true 
        });
      
      if (error) {
        console.log(`   ⚠️  Error uploading to ${targetTable}:`, error.message);
      }
    }
    
    console.log(`   ✓ Uploaded ${transformedRecords.length} records to ${targetTable}`);
    
  } catch (error) {
    console.log(`   ⚠️  Error processing ${csvPath}:`, error.message);
  }
}

/**
 * Determine which Supabase table to use
 */
function determineTargetTable(tableName, sampleRecord) {
  const lowerName = tableName.toLowerCase();
  const keys = Object.keys(sampleRecord).map(k => k.toLowerCase()).join(' ');
  
  // Check for procedures
  if (lowerName.includes('procedure') || lowerName.includes('repair') || 
      keys.includes('procedure') || keys.includes('repair')) {
    return 'wis_procedures';
  }
  
  // Check for parts
  if (lowerName.includes('part') || lowerName.includes('catalog') ||
      keys.includes('part') || keys.includes('catalog')) {
    return 'wis_parts';
  }
  
  // Check for bulletins
  if (lowerName.includes('bulletin') || lowerName.includes('tsb') ||
      keys.includes('bulletin') || keys.includes('service')) {
    return 'wis_bulletins';
  }
  
  // Check for models
  if (lowerName.includes('model') || lowerName.includes('vehicle') ||
      keys.includes('model') || keys.includes('vehicle')) {
    return 'wis_models';
  }
  
  return null;
}

/**
 * Transform records to match Supabase schema
 */
async function transformRecords(records, targetTable, mdbName) {
  const transformed = [];
  
  for (const record of records) {
    let transformedRecord = {};
    
    switch (targetTable) {
      case 'wis_procedures':
        transformedRecord = {
          procedure_id: generateId(record),
          title: findField(record, ['title', 'name', 'procedure', 'description']),
          description: findField(record, ['description', 'desc', 'details', 'summary']),
          system_category: findField(record, ['system', 'category', 'group']),
          procedure_type: findField(record, ['type', 'procedure_type', 'kind']),
          model_id: findField(record, ['model', 'model_id', 'vehicle']),
          content: JSON.stringify(record),
          source_file: mdbName,
          metadata: {
            original_table: path.basename(mdbName),
            import_date: new Date().toISOString()
          }
        };
        break;
        
      case 'wis_parts':
        transformedRecord = {
          part_number: findField(record, ['part_number', 'part', 'number', 'id']),
          description: findField(record, ['description', 'name', 'title']),
          quantity: parseInt(findField(record, ['quantity', 'qty', 'amount']) || '1'),
          unit: findField(record, ['unit', 'uom', 'measure']) || 'EA',
          category: findField(record, ['category', 'group', 'type']),
          metadata: record
        };
        break;
        
      case 'wis_bulletins':
        transformedRecord = {
          bulletin_id: generateId(record),
          title: findField(record, ['title', 'subject', 'name']),
          bulletin_number: findField(record, ['number', 'bulletin_number', 'id']),
          issue_date: parseDate(findField(record, ['date', 'issue_date', 'created'])),
          category: findField(record, ['category', 'type', 'group']),
          content: findField(record, ['content', 'description', 'body']),
          affected_models: findField(record, ['models', 'vehicles', 'affected']),
          metadata: record
        };
        break;
        
      case 'wis_models':
        transformedRecord = {
          model_id: findField(record, ['model_id', 'id', 'code']),
          model_name: findField(record, ['name', 'model', 'description']),
          model_code: findField(record, ['code', 'model_code', 'variant']),
          year_from: parseInt(findField(record, ['year_from', 'start_year', 'from']) || '1950'),
          year_to: parseInt(findField(record, ['year_to', 'end_year', 'to']) || '2025'),
          metadata: record
        };
        break;
    }
    
    // Only add if we have minimum required fields
    if (hasRequiredFields(transformedRecord, targetTable)) {
      transformed.push(transformedRecord);
    }
  }
  
  return transformed;
}

/**
 * Find field value from various possible column names
 */
function findField(record, possibleNames) {
  for (const name of possibleNames) {
    // Check exact match
    if (record[name]) return record[name];
    
    // Check case-insensitive
    for (const key in record) {
      if (key.toLowerCase() === name.toLowerCase()) {
        return record[key];
      }
    }
    
    // Check partial match
    for (const key in record) {
      if (key.toLowerCase().includes(name.toLowerCase())) {
        return record[key];
      }
    }
  }
  return null;
}

/**
 * Generate unique ID from record
 */
function generateId(record) {
  const idField = findField(record, ['id', 'number', 'code', 'key']);
  if (idField) return String(idField);
  
  // Generate from content hash
  const content = JSON.stringify(record);
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `auto_${Math.abs(hash)}`;
}

/**
 * Parse date string
 */
function parseDate(dateStr) {
  if (!dateStr) return null;
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

/**
 * Check if record has required fields
 */
function hasRequiredFields(record, table) {
  switch (table) {
    case 'wis_procedures':
      return record.procedure_id && record.title;
    case 'wis_parts':
      return record.part_number && record.description;
    case 'wis_bulletins':
      return record.bulletin_id && record.title;
    case 'wis_models':
      return record.model_id && record.model_name;
    default:
      return false;
  }
}

/**
 * Show progress
 */
function showProgress() {
  const percent = Math.round((processedFiles / totalFiles) * 100);
  process.stdout.write(`\r   Progress: [${percent}%] ${processedFiles}/${totalFiles} files`);
}

// Main execution
const mdbDataDir = process.argv[2];
if (!mdbDataDir) {
  console.error('Usage: node upload-mdb-data.js <mdb-data-directory>');
  process.exit(1);
}

uploadMdbData(mdbDataDir).catch(console.error);