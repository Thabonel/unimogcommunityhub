#!/usr/bin/env node

/**
 * Process exported WIS data from DbVisualizer
 * Supports CSV, JSON, and SQL formats
 */

const fs = require('fs').promises;
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const csv = require('csv-parse/sync');
require('dotenv').config();

// Configuration
const config = {
  supabase: {
    url: process.env.VITE_SUPABASE_URL,
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY
  },
  inputDir: process.env.WIS_EXPORT_DIR || path.join(process.env.HOME, 'Documents/wis-extracted-data'),
  batchSize: 100
};

// Initialize Supabase
const supabase = createClient(config.supabase.url, config.supabase.serviceKey);

/**
 * Read and parse CSV file
 */
async function parseCSV(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  return csv.parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });
}

/**
 * Read and parse JSON file
 */
async function parseJSON(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(content);
}

/**
 * Process procedures from exported data
 */
async function processProcedures(data) {
  console.log(`\n📋 Processing ${data.length} procedures...`);
  
  const transformed = data.map(row => ({
    procedure_code: row.PROCEDURE_CODE || row.procedure_code || row.code,
    title: row.TITLE || row.title || row.name,
    model: row.MODEL || row.model || row.vehicle_model,
    system: row.SYSTEM || row.system || row.system_group,
    subsystem: row.SUBSYSTEM || row.subsystem,
    content: row.CONTENT || row.content || row.html_content || row.description,
    steps: row.STEPS ? JSON.parse(row.STEPS) : null,
    tools_required: row.TOOLS ? row.TOOLS.split(',').map(t => t.trim()) : [],
    parts_required: row.PARTS ? row.PARTS.split(',').map(p => p.trim()) : [],
    safety_warnings: row.WARNINGS ? row.WARNINGS.split(',').map(w => w.trim()) : [],
    time_estimate: parseInt(row.TIME_ESTIMATE || row.labor_time) || null,
    difficulty: row.DIFFICULTY || row.difficulty || 'medium'
  }));
  
  // Upload in batches
  let uploaded = 0;
  for (let i = 0; i < transformed.length; i += config.batchSize) {
    const batch = transformed.slice(i, i + config.batchSize);
    
    const { error } = await supabase
      .from('wis_procedures')
      .upsert(batch, { onConflict: 'procedure_code' });
    
    if (error) {
      console.error('Error uploading procedures:', error);
    } else {
      uploaded += batch.length;
      console.log(`  ✅ Uploaded ${uploaded}/${transformed.length} procedures`);
    }
  }
  
  return uploaded;
}

/**
 * Process parts from exported data
 */
async function processParts(data) {
  console.log(`\n🔧 Processing ${data.length} parts...`);
  
  const transformed = data.map(row => ({
    part_number: row.PART_NUMBER || row.part_number || row.number,
    description: row.DESCRIPTION || row.description || row.name,
    category: row.CATEGORY || row.category || row.group,
    models: row.MODELS ? row.MODELS.split(',').map(m => m.trim()) : [],
    superseded_by: row.SUPERSEDED_BY || row.superseded_by || row.replaced_by,
    specifications: {
      weight: row.WEIGHT || row.weight,
      dimensions: row.DIMENSIONS || row.dimensions,
      material: row.MATERIAL || row.material,
      oem_number: row.OEM_NUMBER || row.oem_number
    }
  }));
  
  // Upload in batches
  let uploaded = 0;
  for (let i = 0; i < transformed.length; i += config.batchSize) {
    const batch = transformed.slice(i, i + config.batchSize);
    
    const { error } = await supabase
      .from('wis_parts')
      .upsert(batch, { onConflict: 'part_number' });
    
    if (error) {
      console.error('Error uploading parts:', error);
    } else {
      uploaded += batch.length;
      console.log(`  ✅ Uploaded ${uploaded}/${transformed.length} parts`);
    }
  }
  
  return uploaded;
}

/**
 * Process bulletins from exported data
 */
async function processBulletins(data) {
  console.log(`\n📢 Processing ${data.length} bulletins...`);
  
  const transformed = data.map(row => ({
    bulletin_number: row.BULLETIN_NUMBER || row.bulletin_number || row.number,
    title: row.TITLE || row.title,
    models_affected: row.MODELS ? row.MODELS.split(',').map(m => m.trim()) : [],
    issue_date: row.ISSUE_DATE || row.issue_date || row.date,
    category: row.CATEGORY || row.category || row.type,
    content: row.CONTENT || row.content || row.description,
    priority: row.PRIORITY || row.priority || 'info'
  }));
  
  // Upload all bulletins
  let uploaded = 0;
  for (const bulletin of transformed) {
    const { error } = await supabase
      .from('wis_bulletins')
      .upsert(bulletin, { onConflict: 'bulletin_number' });
    
    if (error) {
      console.error('Error uploading bulletin:', error);
    } else {
      uploaded++;
    }
  }
  
  console.log(`  ✅ Uploaded ${uploaded}/${transformed.length} bulletins`);
  return uploaded;
}

/**
 * Process models from exported data
 */
async function processModels(data) {
  console.log(`\n🚛 Processing ${data.length} models...`);
  
  const transformed = data.map(row => ({
    model_code: row.MODEL_CODE || row.model_code || row.code,
    model_name: row.MODEL_NAME || row.model_name || row.name,
    year_from: parseInt(row.YEAR_FROM || row.year_from) || null,
    year_to: parseInt(row.YEAR_TO || row.year_to) || null,
    engine_options: {
      engines: row.ENGINES ? row.ENGINES.split(',').map(e => e.trim()) : []
    },
    specifications: {
      type: row.TYPE || row.type,
      gvw: row.GVW || row.gvw,
      wheelbase: row.WHEELBASE || row.wheelbase
    }
  }));
  
  // Upload all models
  let uploaded = 0;
  for (const model of transformed) {
    const { error } = await supabase
      .from('wis_models')
      .upsert(model, { onConflict: 'model_code' });
    
    if (error) {
      console.error('Error uploading model:', error);
    } else {
      uploaded++;
    }
  }
  
  console.log(`  ✅ Uploaded ${uploaded}/${transformed.length} models`);
  return uploaded;
}

/**
 * Find and process exported files
 */
async function findExportedFiles() {
  const files = await fs.readdir(config.inputDir);
  const exportedFiles = {
    procedures: null,
    parts: null,
    bulletins: null,
    models: null
  };
  
  for (const file of files) {
    const lower = file.toLowerCase();
    
    if (lower.includes('procedure')) {
      exportedFiles.procedures = path.join(config.inputDir, file);
    } else if (lower.includes('part')) {
      exportedFiles.parts = path.join(config.inputDir, file);
    } else if (lower.includes('bulletin')) {
      exportedFiles.bulletins = path.join(config.inputDir, file);
    } else if (lower.includes('model') || lower.includes('vehicle')) {
      exportedFiles.models = path.join(config.inputDir, file);
    }
  }
  
  return exportedFiles;
}

/**
 * Main processing function
 */
async function main() {
  console.log('================================================');
  console.log('Mercedes WIS Exported Data Processor');
  console.log('================================================\n');
  
  // Check configuration
  if (!config.supabase.url || !config.supabase.serviceKey) {
    console.error('❌ Missing Supabase configuration!');
    process.exit(1);
  }
  
  // Check input directory
  try {
    await fs.access(config.inputDir);
    console.log(`📁 Input directory: ${config.inputDir}`);
  } catch {
    console.error(`❌ Input directory not found: ${config.inputDir}`);
    console.log('\nPlease export WIS data to this directory or set WIS_EXPORT_DIR environment variable');
    process.exit(1);
  }
  
  // Find exported files
  const exportedFiles = await findExportedFiles();
  console.log('\n📋 Found exported files:');
  Object.entries(exportedFiles).forEach(([type, path]) => {
    console.log(`  ${type}: ${path ? path.split('/').pop() : 'NOT FOUND'}`);
  });
  
  const results = {
    procedures: 0,
    parts: 0,
    bulletins: 0,
    models: 0
  };
  
  // Process procedures
  if (exportedFiles.procedures) {
    const ext = path.extname(exportedFiles.procedures).toLowerCase();
    let data;
    
    if (ext === '.csv') {
      data = await parseCSV(exportedFiles.procedures);
    } else if (ext === '.json') {
      data = await parseJSON(exportedFiles.procedures);
    }
    
    if (data) {
      results.procedures = await processProcedures(data);
    }
  }
  
  // Process parts
  if (exportedFiles.parts) {
    const ext = path.extname(exportedFiles.parts).toLowerCase();
    let data;
    
    if (ext === '.csv') {
      data = await parseCSV(exportedFiles.parts);
    } else if (ext === '.json') {
      data = await parseJSON(exportedFiles.parts);
    }
    
    if (data) {
      results.parts = await processParts(data);
    }
  }
  
  // Process bulletins
  if (exportedFiles.bulletins) {
    const ext = path.extname(exportedFiles.bulletins).toLowerCase();
    let data;
    
    if (ext === '.csv') {
      data = await parseCSV(exportedFiles.bulletins);
    } else if (ext === '.json') {
      data = await parseJSON(exportedFiles.bulletins);
    }
    
    if (data) {
      results.bulletins = await processBulletins(data);
    }
  }
  
  // Process models
  if (exportedFiles.models) {
    const ext = path.extname(exportedFiles.models).toLowerCase();
    let data;
    
    if (ext === '.csv') {
      data = await parseCSV(exportedFiles.models);
    } else if (ext === '.json') {
      data = await parseJSON(exportedFiles.models);
    }
    
    if (data) {
      results.models = await processModels(data);
    }
  }
  
  // Summary
  console.log('\n================================================');
  console.log('Processing Complete!');
  console.log('================================================');
  console.log(`✅ Procedures uploaded: ${results.procedures}`);
  console.log(`✅ Parts uploaded: ${results.parts}`);
  console.log(`✅ Bulletins uploaded: ${results.bulletins}`);
  console.log(`✅ Models uploaded: ${results.models}`);
  
  console.log('\n🎉 WIS data successfully imported to Workshop Database!');
  console.log('Visit https://unimogcommunity-staging.netlify.app/knowledge/wis to see the data');
}

// Run the processor
main().catch(console.error);