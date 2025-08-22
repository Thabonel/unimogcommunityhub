#!/usr/bin/env node

/**
 * Automated WIS Data Extraction and Import
 * Processes exported WIS data and imports to PostgreSQL
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

// Configuration
const WIS_EXPORT_DIR = '/Volumes/UnimogManuals/wis-complete-extraction';
const BATCH_SIZE = 100; // Insert in batches for performance
const CSV_PARSER = require('csv-parser');

console.log('🚀 WIS Complete Data Extraction & Import Tool\n');

/**
 * Process procedures from WIS export
 */
async function processProcedures() {
  console.log('📋 Processing procedures...');
  
  const proceduresFile = path.join(WIS_EXPORT_DIR, 'procedures/procedures.csv');
  if (!fs.existsSync(proceduresFile)) {
    console.log('⚠️  Procedures CSV not found');
    return;
  }
  
  const procedures = [];
  let count = 0;
  
  return new Promise((resolve, reject) => {
    fs.createReadStream(proceduresFile)
      .pipe(CSV_PARSER())
      .on('data', async (row) => {
        // Map CSV columns to database fields
        const procedure = {
          procedure_code: row.procedure_code || row.code,
          title: row.title || row.name,
          content: row.content || row.description,
          model_codes: row.model_codes ? row.model_codes.split(',') : extractModelCodes(row.content || ''),
          system_category: row.category || extractCategory(row.content || ''),
          tools_required: row.tools ? row.tools.split(',') : extractTools(row.content || '')
        };
        
        procedures.push(procedure);
        count++;
        
        // Insert in batches
        if (procedures.length >= BATCH_SIZE) {
          await insertBatch('wis_procedures', procedures);
          procedures.length = 0;
        }
      })
      .on('end', async () => {
        // Insert remaining
        if (procedures.length > 0) {
          await insertBatch('wis_procedures', procedures);
        }
        console.log(`✅ Processed ${count} procedures`);
        resolve();
      })
      .on('error', reject);
  });
}

/**
 * Process parts catalog from WIS export
 */
async function processParts() {
  console.log('🔩 Processing parts catalog...');
  
  const partsFile = path.join(WIS_EXPORT_DIR, 'parts/parts.csv');
  if (!fs.existsSync(partsFile)) {
    console.log('⚠️  Parts CSV not found');
    return;
  }
  
  const parts = [];
  let count = 0;
  
  return new Promise((resolve, reject) => {
    fs.createReadStream(partsFile)
      .pipe(CSV_PARSER())
      .on('data', async (row) => {
        const part = {
          part_number: row.part_number || row.number,
          description: row.description || row.name,
          applicable_models: row.models ? row.models.split(',') : [],
          system_category: row.category || row.system,
          price_estimate: parseFloat(row.price) || null
        };
        
        parts.push(part);
        count++;
        
        if (parts.length >= BATCH_SIZE) {
          await insertBatch('wis_parts', parts);
          parts.length = 0;
        }
      })
      .on('end', async () => {
        if (parts.length > 0) {
          await insertBatch('wis_parts', parts);
        }
        console.log(`✅ Processed ${count} parts`);
        resolve();
      })
      .on('error', reject);
  });
}

/**
 * Process service bulletins
 */
async function processBulletins() {
  console.log('📢 Processing service bulletins...');
  
  const bulletinsFile = path.join(WIS_EXPORT_DIR, 'bulletins/bulletins.csv');
  if (!fs.existsSync(bulletinsFile)) {
    console.log('⚠️  Bulletins CSV not found');
    return;
  }
  
  const bulletins = [];
  let count = 0;
  
  return new Promise((resolve, reject) => {
    fs.createReadStream(bulletinsFile)
      .pipe(CSV_PARSER())
      .on('data', async (row) => {
        const bulletin = {
          bulletin_number: row.bulletin_number || row.number,
          title: row.title || row.subject,
          description: row.description || row.content,
          affected_models: row.models ? row.models.split(',') : [],
          issue_date: row.date || row.issue_date
        };
        
        bulletins.push(bulletin);
        count++;
        
        if (bulletins.length >= BATCH_SIZE) {
          await insertBatch('wis_bulletins', bulletins);
          bulletins.length = 0;
        }
      })
      .on('end', async () => {
        if (bulletins.length > 0) {
          await insertBatch('wis_bulletins', bulletins);
        }
        console.log(`✅ Processed ${count} bulletins`);
        resolve();
      })
      .on('error', reject);
  });
}

/**
 * Process wiring diagrams
 */
async function processDiagrams() {
  console.log('⚡ Processing wiring diagrams...');
  
  const diagramsFile = path.join(WIS_EXPORT_DIR, 'diagrams/diagrams.csv');
  if (!fs.existsSync(diagramsFile)) {
    console.log('⚠️  Diagrams CSV not found');
    return;
  }
  
  const diagrams = [];
  let count = 0;
  
  return new Promise((resolve, reject) => {
    fs.createReadStream(diagramsFile)
      .pipe(CSV_PARSER())
      .on('data', async (row) => {
        const diagram = {
          diagram_code: row.diagram_code || row.code,
          title: row.title || row.name,
          type: row.type || 'wiring',
          image_data: row.path || row.file_reference,
          model_codes: row.models ? row.models.split(',') : []
        };
        
        diagrams.push(diagram);
        count++;
        
        if (diagrams.length >= BATCH_SIZE) {
          await insertBatch('wis_diagrams', diagrams);
          diagrams.length = 0;
        }
      })
      .on('end', async () => {
        if (diagrams.length > 0) {
          await insertBatch('wis_diagrams', diagrams);
        }
        console.log(`✅ Processed ${count} diagrams`);
        resolve();
      })
      .on('error', reject);
  });
}

/**
 * Insert batch of records
 */
async function insertBatch(table, records) {
  try {
    const { error } = await supabase
      .from(table)
      .insert(records);
    
    if (error) {
      console.error(`Error inserting into ${table}:`, error);
    }
  } catch (err) {
    console.error(`Failed to insert batch:`, err);
  }
}

// Helper functions
function extractTitle(content) {
  const match = content.match(/^#?\s*(.+)/m);
  return match ? match[1].trim() : 'Untitled';
}

function extractModelCodes(content) {
  const models = [];
  const regex = /U[0-9]{3,4}/g;
  const matches = content.match(regex);
  if (matches) {
    return [...new Set(matches)];
  }
  return models;
}

function extractCategory(content) {
  const categories = ['Engine', 'Transmission', 'Axle', 'Electrical', 'Hydraulic', 'Body', 'Chassis'];
  for (const cat of categories) {
    if (content.toLowerCase().includes(cat.toLowerCase())) {
      return cat;
    }
  }
  return 'General';
}

function extractTools(content) {
  const tools = [];
  const toolRegex = /(torque wrench|socket|screwdriver|pliers|jack|lift|gauge|meter|scanner)/gi;
  const matches = content.match(toolRegex);
  if (matches) {
    return [...new Set(matches.map(t => t.toLowerCase()))];
  }
  return tools;
}

function extractDate(content) {
  const dateRegex = /(\d{4}-\d{2}-\d{2})|(\d{1,2}\/\d{1,2}\/\d{4})/;
  const match = content.match(dateRegex);
  return match ? match[0] : null;
}

function extractModelFromFilename(filename) {
  const models = [];
  const regex = /U[0-9]{3,4}/g;
  const matches = filename.match(regex);
  if (matches) {
    return matches;
  }
  return models;
}

/**
 * Create database tables if needed
 */
async function ensureTables() {
  console.log('🔧 Ensuring database tables exist...');
  
  // Tables should already exist from migration
  // This is just a check
  const { data, error } = await supabase
    .from('wis_procedures')
    .select('id')
    .limit(1);
  
  if (error && error.code === '42P01') {
    console.log('❌ WIS tables not found. Run migration first.');
    process.exit(1);
  }
  
  console.log('✅ Database tables ready');
}

/**
 * Main process
 */
async function main() {
  console.log('📁 Export directory:', WIS_EXPORT_DIR);
  
  if (!fs.existsSync(WIS_EXPORT_DIR)) {
    console.log('❌ Export directory not found. Please export WIS data first.');
    console.log('\nTo export from WIS:');
    console.log('1. Boot the VM with QEMU');
    console.log('2. Login with Admin/12345');
    console.log('3. Open WIS and export data');
    console.log('4. Copy to:', WIS_EXPORT_DIR);
    return;
  }
  
  await ensureTables();
  
  // Process all data types
  await processProcedures();
  await processParts();
  await processBulletins();
  await processDiagrams();
  
  console.log('\n✅ WIS Data Import Complete!');
  console.log('📊 Your Unimog community now has access to:');
  console.log('   - Complete repair procedures');
  console.log('   - Full parts catalog');
  console.log('   - Service bulletins');
  console.log('   - Wiring diagrams');
  console.log('\n🌐 Access at: http://localhost:5173/knowledge/wis-epc');
}

// Run
main().catch(console.error);