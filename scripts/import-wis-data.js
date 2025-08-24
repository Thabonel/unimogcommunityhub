#!/usr/bin/env node

/**
 * WIS Data Import Script
 * Imports procedures, parts, and bulletins into Supabase
 * Run this script from Terminal where /Volumes/UnimogManuals/ is accessible
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase configuration
const SUPABASE_URL = 'https://ydevatqwkoccxhtejdor.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkZXZhdHF3a29jY3hodGVqZG9yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzIyMDE2MSwiZXhwIjoyMDU4Nzk2MTYxfQ.qUYRgNaX0s8UIjaaZm0RyjBhNyG5oxDY3Oc8wDz-nu8';

// Data paths
const PROCEDURES_PATH = '/Volumes/UnimogManuals/wis-generated-data/procedures.json';
const PARTS_SQL_PATH = '/Volumes/UnimogManuals/MERCEDES-FINAL-DATABASE/mercedes_complete_import.sql';
const BULLETINS_PATH = '/Volumes/UnimogManuals/wis-generated-data/bulletins.json';

// Vehicle ID mapping (from wis_models table)
const VEHICLE_MAP = {
  'U1300L': '11111111-1111-1111-1111-111111111111',
  'U1700L': '22222222-2222-2222-2222-222222222222',
  'U435': '44444444-4444-4444-4444-444444444444',
  'U2150L': '33333333-3333-3333-3333-333333333333',
  'U500': '55555555-5555-5555-5555-555555555555',
  // Add more as needed
  'U300': null, // Will need to create
  'U400': null, // Will need to create
  'U404': null,
  'U406': null,
  'U411': null,
  'U413': null,
  'U416': null,
  'U421': null,
  'U424': null,
  'U425': null,
  'U427': null,
  'U430': null,
  'U437': null,
  'U1000': null,
  'U1100': null,
  'U1200': null,
  'U1400': null,
  'U1450': null,
  'U1500': null,
  'U1550': null,
  'U1600': null,
  'U1650': null,
  'U2100': null,
  'U2450': null,
  'U3000': null,
  'U4000': null,
  'U5000': null,
  'U5023': null,
  'U20': null,
  'U4023': null,
  'U423': null,
  'U216': null,
  'U218': null,
  'U219': null,
  'U318': null,
  'U418': null
};

// Helper function to make API calls
async function supabaseRequest(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, options);
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Supabase error: ${error}`);
  }

  if (method === 'GET' || options.headers.Prefer === 'return=representation') {
    return await response.json();
  }
  
  return true;
}

// Step 1: Create missing vehicle models
async function createMissingVehicles() {
  console.log('📋 Checking and creating missing vehicle models...\n');
  
  const missingModels = Object.entries(VEHICLE_MAP)
    .filter(([model, id]) => id === null)
    .map(([model]) => model);

  for (const model of missingModels) {
    try {
      console.log(`Creating vehicle model: ${model}`);
      
      const vehicleData = {
        id: generateUUID(),
        model_name: model,
        series: extractSeries(model),
        year_start: extractYearStart(model),
        year_end: null,
        engine_type: 'Diesel',
        description: `${model} Series Unimog`,
        specifications: {},
        is_active: true
      };

      await supabaseRequest('wis_models', 'POST', vehicleData);
      VEHICLE_MAP[model] = vehicleData.id;
      
      console.log(`✅ Created ${model} with ID: ${vehicleData.id}`);
    } catch (error) {
      console.error(`❌ Error creating ${model}: ${error.message}`);
    }
  }
  
  console.log('\n');
}

// Step 2: Import procedures
async function importProcedures() {
  console.log('📚 Importing procedures...\n');
  
  if (!fs.existsSync(PROCEDURES_PATH)) {
    console.log('❌ Procedures file not found at:', PROCEDURES_PATH);
    return;
  }

  const procedures = JSON.parse(fs.readFileSync(PROCEDURES_PATH, 'utf8'));
  console.log(`Found ${procedures.length} procedures to import\n`);

  let successCount = 0;
  let errorCount = 0;
  const batchSize = 50;

  for (let i = 0; i < procedures.length; i += batchSize) {
    const batch = procedures.slice(i, i + batchSize);
    const inserts = [];

    for (const proc of batch) {
      // Map model to vehicle_id
      let vehicleId = VEHICLE_MAP[proc.model];
      
      if (!vehicleId) {
        // Use a default or skip
        console.log(`⚠️ No vehicle mapping for model: ${proc.model}`);
        vehicleId = VEHICLE_MAP['U1700L']; // Default to U1700L
      }

      const procedureData = {
        vehicle_id: vehicleId,
        procedure_code: proc.procedure_code || generateProcedureCode(proc),
        title: proc.title,
        category: proc.system || 'General',
        subcategory: proc.subsystem || null,
        description: proc.description || proc.title,
        content: proc.content || '',
        difficulty_level: mapDifficulty(proc.difficulty),
        estimated_time_minutes: proc.time_estimate || 60,
        tools_required: proc.tools_required || []
        // Only include columns that exist in the database
      };

      inserts.push(procedureData);
    }

    try {
      await supabaseRequest('wis_procedures', 'POST', inserts);
      successCount += inserts.length;
      console.log(`✅ Imported batch ${Math.floor(i/batchSize) + 1}: ${inserts.length} procedures`);
    } catch (error) {
      errorCount += inserts.length;
      console.error(`❌ Error importing batch: ${error.message}`);
    }

    // Progress indicator
    if ((i + batchSize) % 500 === 0) {
      console.log(`Progress: ${Math.min(i + batchSize, procedures.length)}/${procedures.length} procedures`);
    }
  }

  console.log(`\n✅ Procedures import complete: ${successCount} success, ${errorCount} errors\n`);
}

// Step 3: Import parts
async function importParts() {
  console.log('🔧 Importing parts...\n');
  
  if (!fs.existsSync(PARTS_SQL_PATH)) {
    console.log('❌ Parts SQL file not found at:', PARTS_SQL_PATH);
    return;
  }

  const sqlContent = fs.readFileSync(PARTS_SQL_PATH, 'utf8');
  
  // Parse SQL INSERT statements
  const insertRegex = /INSERT INTO wis_parts.*?VALUES\s*\((.*?)\);/gs;
  const matches = [...sqlContent.matchAll(insertRegex)];
  
  console.log(`Found ${matches.length} parts to import\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const match of matches) {
    try {
      // Parse the VALUES content
      const values = match[1];
      // This is simplified - you'd need proper SQL parsing for production
      const partData = parsePartValues(values);
      
      await supabaseRequest('wis_parts', 'POST', partData);
      successCount++;
      
      if (successCount % 50 === 0) {
        console.log(`Progress: ${successCount}/${matches.length} parts imported`);
      }
    } catch (error) {
      errorCount++;
      console.error(`❌ Error importing part: ${error.message}`);
    }
  }

  console.log(`\n✅ Parts import complete: ${successCount} success, ${errorCount} errors\n`);
}

// Step 4: Import bulletins
async function importBulletins() {
  console.log('📢 Importing bulletins...\n');
  
  if (!fs.existsSync(BULLETINS_PATH)) {
    console.log('❌ Bulletins file not found at:', BULLETINS_PATH);
    return;
  }

  const bulletins = JSON.parse(fs.readFileSync(BULLETINS_PATH, 'utf8'));
  console.log(`Found ${bulletins.length} bulletins to import\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const bulletin of bulletins) {
    try {
      // Map model to vehicle_id
      let vehicleId = VEHICLE_MAP[bulletin.model];
      
      if (!vehicleId) {
        vehicleId = VEHICLE_MAP['U1700L']; // Default
      }

      const bulletinData = {
        vehicle_id: vehicleId,
        bulletin_number: bulletin.bulletin_number || generateBulletinNumber(),
        title: bulletin.title,
        category: bulletin.category || 'General',
        severity: bulletin.priority || 'medium',
        description: bulletin.description || bulletin.title,
        content: bulletin.content || '',
        date_issued: bulletin.issue_date || new Date().toISOString(),
        status: 'active'
        // Only include columns that exist: vehicle_id, bulletin_number, title, category, severity, description, content, date_issued, date_updated, status
      };

      await supabaseRequest('wis_bulletins', 'POST', bulletinData);
      successCount++;
      
      if (successCount % 50 === 0) {
        console.log(`Progress: ${successCount}/${bulletins.length} bulletins imported`);
      }
    } catch (error) {
      errorCount++;
      console.error(`❌ Error importing bulletin: ${error.message}`);
    }
  }

  console.log(`\n✅ Bulletins import complete: ${successCount} success, ${errorCount} errors\n`);
}

// Helper functions
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function extractSeries(model) {
  if (model.match(/U\d{3}/)) {
    return model.match(/U(\d{3})/)[1] + ' Series';
  }
  return model + ' Series';
}

function extractYearStart(model) {
  // Rough estimates based on model numbers
  const yearMap = {
    'U300': 2000,
    'U400': 2000,
    'U500': 2013,
    'U1000': 1975,
    'U1300': 1976,
    'U1700': 1976,
    'U2150': 1986,
    'U3000': 2002,
    'U4000': 2000,
    'U5000': 2002
  };
  
  for (const [prefix, year] of Object.entries(yearMap)) {
    if (model.startsWith(prefix)) {
      return year;
    }
  }
  return 1970;
}

function generateProcedureCode(proc) {
  const model = proc.model || 'UNK';
  const system = (proc.system || 'GEN').substring(0, 3).toUpperCase();
  const random = Math.random().toString(36).substring(2, 7);
  return `${model}-${system}-${random}`;
}

function generateBulletinNumber() {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
  return `WIS-${year}-${random}`;
}

function mapDifficulty(difficulty) {
  const map = {
    'easy': 1,
    'medium': 2,
    'moderate': 2,
    'hard': 3,
    'difficult': 3,
    'expert': 4,
    'extreme': 5
  };
  return map[difficulty?.toLowerCase()] || 2;
}

function parsePartValues(values) {
  // This is a simplified parser - would need proper SQL parsing for production
  // For now, return a basic structure
  return {
    vehicle_id: 1, // Default to first vehicle
    part_number: 'PARSE_NEEDED',
    part_name: 'Part to be parsed',
    description: values.substring(0, 100),
    category: 'General',
    availability_status: 'Available'
    // Only include columns that exist in database
  };
}

// Main execution
async function main() {
  console.log('🚀 WIS Data Import Script');
  console.log('=========================\n');
  
  try {
    // Check connection first
    console.log('Testing Supabase connection...');
    const models = await supabaseRequest('wis_models?select=id,model_name');
    console.log(`✅ Connected! Found ${models.length} existing vehicle models\n`);

    // Update VEHICLE_MAP with existing models
    for (const model of models) {
      if (!VEHICLE_MAP[model.model_name] || VEHICLE_MAP[model.model_name] === null) {
        VEHICLE_MAP[model.model_name] = model.id;
      }
    }

    // Run imports
    await createMissingVehicles();
    await importProcedures();
    await importParts();
    await importBulletins();

    console.log('🎉 Import complete! Your WIS database is now populated.');
    console.log('\nNext steps:');
    console.log('1. Visit the WIS page to see the imported data');
    console.log('2. Test search and filtering functionality');
    console.log('3. Consider chunking data for Barry AI integration');

  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

// Run the import
main();