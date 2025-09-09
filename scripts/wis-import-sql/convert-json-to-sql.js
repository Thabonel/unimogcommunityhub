#!/usr/bin/env node

/**
 * Convert WIS JSON data to SQL INSERT statements
 * This script reads the JSON files and generates SQL that can be run in Supabase
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Data paths
const PROCEDURES_PATH = '/Volumes/UnimogManuals/wis-generated-data/procedures.json';
const PARTS_PATH = '/Volumes/UnimogManuals/wis-generated-data/parts.json';
const BULLETINS_PATH = '/Volumes/UnimogManuals/wis-generated-data/bulletins.json';

// Output paths
const PROCEDURES_SQL = path.join(__dirname, '02-import-procedures.sql');
const PARTS_SQL = path.join(__dirname, '03-import-parts.sql');
const BULLETINS_SQL = path.join(__dirname, '04-import-bulletins.sql');

// Vehicle ID mapping (matches the IDs from 01-create-vehicle-models.sql)
const VEHICLE_MAP = {
  'U1300L': '11111111-1111-1111-1111-111111111111',
  'U1700L': '22222222-2222-2222-2222-222222222222',
  'U2150L': '33333333-3333-3333-3333-333333333333',
  'U435': '44444444-4444-4444-4444-444444444444',
  'U500': '55555555-5555-5555-5555-555555555555',
  'U20': '66666666-6666-6666-6666-666666666666',
  'U300': '77777777-7777-7777-7777-777777777777',
  'U400': '88888888-8888-8888-8888-888888888888',
  'U500': '99999999-9999-9999-9999-999999999999',
  'U216': 'aaaa0001-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'U218': 'aaaa0002-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'U219': 'aaaa0003-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'U318': 'aaaa0004-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'U418': 'aaaa0005-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'U404': 'bbbb0001-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'U406': 'bbbb0002-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'U411': 'bbbb0003-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'U413': 'bbbb0004-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'U416': 'bbbb0005-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'U421': 'bbbb0006-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'U424': 'bbbb0007-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'U425': 'bbbb0008-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'U427': 'bbbb0009-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'U430': 'bbbb0010-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'U437': 'bbbb0011-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'U423': 'bbbb0012-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'U1000': 'cccc0001-cccc-cccc-cccc-cccccccccccc',
  'U1100': 'cccc0002-cccc-cccc-cccc-cccccccccccc',
  'U1200': 'cccc0003-cccc-cccc-cccc-cccccccccccc',
  'U1400': 'cccc0004-cccc-cccc-cccc-cccccccccccc',
  'U1450': 'cccc0005-cccc-cccc-cccc-cccccccccccc',
  'U1500': 'cccc0006-cccc-cccc-cccc-cccccccccccc',
  'U1550': 'cccc0007-cccc-cccc-cccc-cccccccccccc',
  'U1600': 'cccc0008-cccc-cccc-cccc-cccccccccccc',
  'U1650': 'cccc0009-cccc-cccc-cccc-cccccccccccc',
  'U2100': 'dddd0001-dddd-dddd-dddd-dddddddddddd',
  'U2450': 'dddd0002-dddd-dddd-dddd-dddddddddddd',
  'U3000': 'eeee0001-eeee-eeee-eeee-eeeeeeeeeeee',
  'U4000': 'eeee0002-eeee-eeee-eeee-eeeeeeeeeeee',
  'U5000': 'eeee0003-eeee-eeee-eeee-eeeeeeeeeeee',
  'U4023': 'eeee0004-eeee-eeee-eeee-eeeeeeeeeeee',
  'U5023': 'eeee0005-eeee-eeee-eeee-eeeeeeeeeeee'
};

// Helper function to escape SQL strings
function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  if (typeof str === 'number') return str;
  if (typeof str === 'boolean') return str;
  if (Array.isArray(str)) {
    if (str.length === 0) return 'ARRAY[]::text[]';
    return `ARRAY[${str.map(s => `'${String(s).replace(/'/g, "''")}'`).join(',')}]::text[]`;
  }
  return `'${String(str).replace(/'/g, "''")}'`;
}

// Helper function to format UUID for PostgreSQL
function formatUUID(uuidStr) {
  return `uuid('${uuidStr}')`;
}

// Helper function to generate UUID
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Convert procedures to SQL
function convertProcedures() {
  console.log('📚 Converting procedures to SQL...');
  
  if (!fs.existsSync(PROCEDURES_PATH)) {
    console.log('❌ Procedures file not found at:', PROCEDURES_PATH);
    return;
  }

  const procedures = JSON.parse(fs.readFileSync(PROCEDURES_PATH, 'utf8'));
  let sql = `-- WIS Import Step 2: Import Procedures
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor/sql/new
-- Total procedures to import: ${procedures.length}

-- Clear existing procedures (optional - remove this line if you want to keep existing data)
-- TRUNCATE TABLE wis_procedures CASCADE;

-- Insert procedures in batches
`;

  const batchSize = 100;
  let totalProcessed = 0;

  for (let i = 0; i < procedures.length; i += batchSize) {
    const batch = procedures.slice(i, i + batchSize);
    
    sql += `\n-- Batch ${Math.floor(i/batchSize) + 1} (procedures ${i + 1} to ${Math.min(i + batchSize, procedures.length)})\n`;
    sql += 'INSERT INTO wis_procedures (id, vehicle_id, procedure_code, title, category, subcategory, description, content, difficulty_level, estimated_time_minutes, tools_required, parts_required, safety_warnings, steps, is_published) VALUES\n';
    
    const values = batch.map((proc, index) => {
      const vehicleId = VEHICLE_MAP[proc.model] || VEHICLE_MAP['U1700L']; // Default to U1700L
      const isLast = index === batch.length - 1;
      
      const difficulty = {
        'easy': 1,
        'medium': 2,
        'moderate': 2,
        'hard': 3,
        'difficult': 3,
        'expert': 4,
        'extreme': 5
      }[proc.difficulty?.toLowerCase()] || 2;

      return `(
  ${formatUUID(generateUUID())},
  ${formatUUID(vehicleId)},
  ${escapeSql(proc.procedure_code || `${proc.model}-${proc.system}-${Math.random().toString(36).substring(2, 7)}`)},
  ${escapeSql(proc.title)},
  ${escapeSql(proc.system || 'General')},
  ${escapeSql(proc.subsystem || null)},
  ${escapeSql(proc.description || proc.title)},
  ${escapeSql(proc.content || '')},
  ${difficulty},
  ${proc.time_estimate || 60},
  ${escapeSql(proc.tools_required || [])},
  ${escapeSql(proc.parts_required || [])},
  ${escapeSql(proc.safety_warnings || [])},
  ${escapeSql(JSON.stringify(proc.steps || []))},
  true
)${isLast ? ';' : ','}`;
    }).join('\n');
    
    sql += values;
    totalProcessed += batch.length;
    
    // Add a comment for progress tracking
    if (totalProcessed % 500 === 0) {
      sql += `\n\n-- Progress: ${totalProcessed}/${procedures.length} procedures imported\n`;
    }
  }

  sql += `\n\n-- Verification
SELECT COUNT(*) as total_procedures FROM wis_procedures;
SELECT vehicle_id, COUNT(*) as procedure_count 
FROM wis_procedures 
GROUP BY vehicle_id 
ORDER BY procedure_count DESC;`;

  fs.writeFileSync(PROCEDURES_SQL, sql);
  console.log(`✅ Generated SQL for ${procedures.length} procedures → ${PROCEDURES_SQL}`);
}

// Convert parts to SQL
function convertParts() {
  console.log('🔧 Converting parts to SQL...');
  
  // First try the mercedes_complete_import.sql file
  const MERCEDES_SQL_PATH = '/Volumes/UnimogManuals/MERCEDES-FINAL-DATABASE/mercedes_complete_import.sql';
  
  if (fs.existsSync(MERCEDES_SQL_PATH)) {
    // Just copy the SQL file with a header
    const originalSql = fs.readFileSync(MERCEDES_SQL_PATH, 'utf8');
    const sql = `-- WIS Import Step 3: Import Parts
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor/sql/new
-- Source: mercedes_complete_import.sql

${originalSql}

-- Verification
SELECT COUNT(*) as total_parts FROM wis_parts;
SELECT category, COUNT(*) as part_count 
FROM wis_parts 
GROUP BY category 
ORDER BY part_count DESC;`;

    fs.writeFileSync(PARTS_SQL, sql);
    console.log(`✅ Copied Mercedes parts SQL → ${PARTS_SQL}`);
    return;
  }

  // Fallback to parts.json if SQL doesn't exist
  if (!fs.existsSync(PARTS_PATH)) {
    console.log('❌ Parts file not found');
    return;
  }

  const parts = JSON.parse(fs.readFileSync(PARTS_PATH, 'utf8'));
  let sql = `-- WIS Import Step 3: Import Parts
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor/sql/new
-- Total parts to import: ${parts.length}

INSERT INTO wis_parts (id, part_number, name, description, category, subcategory, manufacturer, price, stock_quantity, unit, specifications, compatible_models, is_active) VALUES\n`;

  const values = parts.map((part, index) => {
    const isLast = index === parts.length - 1;
    return `(
  ${formatUUID(generateUUID())},
  ${escapeSql(part.part_number || `PART-${index + 1}`)},
  ${escapeSql(part.name || 'Unknown Part')},
  ${escapeSql(part.description || '')},
  ${escapeSql(part.category || 'General')},
  ${escapeSql(part.subcategory || null)},
  ${escapeSql(part.manufacturer || 'Mercedes-Benz')},
  ${part.price || 0},
  ${part.stock_quantity || 0},
  ${escapeSql(part.unit || 'piece')},
  ${escapeSql(JSON.stringify(part.specifications || {}))},
  ${escapeSql(part.compatible_models || [])},
  true
)${isLast ? ';' : ','}`;
  }).join('\n');

  sql += values;
  sql += `\n\n-- Verification
SELECT COUNT(*) as total_parts FROM wis_parts;`;

  fs.writeFileSync(PARTS_SQL, sql);
  console.log(`✅ Generated SQL for ${parts.length} parts → ${PARTS_SQL}`);
}

// Convert bulletins to SQL
function convertBulletins() {
  console.log('📢 Converting bulletins to SQL...');
  
  if (!fs.existsSync(BULLETINS_PATH)) {
    console.log('❌ Bulletins file not found at:', BULLETINS_PATH);
    return;
  }

  const bulletins = JSON.parse(fs.readFileSync(BULLETINS_PATH, 'utf8'));
  let sql = `-- WIS Import Step 4: Import Bulletins
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor/sql/new
-- Total bulletins to import: ${bulletins.length}

INSERT INTO wis_bulletins (id, vehicle_id, bulletin_number, title, category, issue_date, description, content, affected_systems, priority, is_active) VALUES\n`;

  const values = bulletins.map((bulletin, index) => {
    const vehicleId = VEHICLE_MAP[bulletin.model] || VEHICLE_MAP['U1700L'];
    const isLast = index === bulletins.length - 1;
    
    return `(
  ${formatUUID(generateUUID())},
  ${formatUUID(vehicleId)},
  ${escapeSql(bulletin.bulletin_number || `WIS-2024-${String(index + 1).padStart(4, '0')}`)},
  ${escapeSql(bulletin.title)},
  ${escapeSql(bulletin.category || 'General')},
  ${escapeSql(bulletin.issue_date || new Date().toISOString())},
  ${escapeSql(bulletin.description || bulletin.title)},
  ${escapeSql(bulletin.content || '')},
  ${escapeSql(bulletin.affected_systems || [])},
  ${escapeSql(bulletin.priority || 'medium')},
  true
)${isLast ? ';' : ','}`;
  }).join('\n');

  sql += values;
  sql += `\n\n-- Verification
SELECT COUNT(*) as total_bulletins FROM wis_bulletins;
SELECT vehicle_id, COUNT(*) as bulletin_count 
FROM wis_bulletins 
GROUP BY vehicle_id 
ORDER BY bulletin_count DESC;`;

  fs.writeFileSync(BULLETINS_SQL, sql);
  console.log(`✅ Generated SQL for ${bulletins.length} bulletins → ${BULLETINS_SQL}`);
}

// Create master import script
function createMasterScript() {
  const masterSql = `-- WIS Complete Import Script
-- Run each numbered SQL file in order in Supabase SQL Editor
-- https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor/sql/new

-- Step 1: Run 01-create-vehicle-models.sql
-- This creates all the Unimog vehicle models in the database

-- Step 2: Run 02-import-procedures.sql
-- This imports 3,234 procedures with full content

-- Step 3: Run 03-import-parts.sql
-- This imports Mercedes parts database

-- Step 4: Run 04-import-bulletins.sql
-- This imports technical bulletins

-- After import, verify with:
SELECT 
  (SELECT COUNT(*) FROM wis_models) as models,
  (SELECT COUNT(*) FROM wis_procedures) as procedures,
  (SELECT COUNT(*) FROM wis_parts) as parts,
  (SELECT COUNT(*) FROM wis_bulletins) as bulletins;

-- Expected results:
-- models: 40+
-- procedures: 3,234
-- parts: 197+
-- bulletins: varies`;

  fs.writeFileSync(path.join(__dirname, '00-master-import-guide.sql'), masterSql);
  console.log('✅ Created master import guide');
}

// Main execution
async function main() {
  console.log('🚀 WIS JSON to SQL Converter');
  console.log('============================\n');

  try {
    convertProcedures();
    convertParts();
    convertBulletins();
    createMasterScript();

    console.log('\n✅ All SQL files generated successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Go to: https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor/sql/new');
    console.log('2. Run each SQL file in order:');
    console.log('   - 01-create-vehicle-models.sql');
    console.log('   - 02-import-procedures.sql (may take a while - 3,234 procedures)');
    console.log('   - 03-import-parts.sql');
    console.log('   - 04-import-bulletins.sql');
    console.log('\n⚠️ Note: The procedures SQL file will be large (~10MB+).');
    console.log('You may need to run it in smaller batches if Supabase times out.');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the converter
main();