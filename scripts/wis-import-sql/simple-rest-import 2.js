#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// First, let's just import the vehicle models cleanly
const vehicleModels = [
  { id: '66666666-6666-6666-6666-666666666666', model_name: 'U20', model_code: 'U20', year_from: 1950, year_to: 1965, engine_code: 'OM636', description: 'U20 Series - Early agricultural Unimog' },
  { id: '77777777-7777-7777-7777-777777777777', model_name: 'U300', model_code: 'U300', year_from: 2000, year_to: 2013, engine_code: 'OM906LA', description: 'U300 Series - Compact implement carrier, 177 hp' },
  { id: '88888888-8888-8888-8888-888888888888', model_name: 'U400', model_code: 'U400', year_from: 2000, year_to: 2013, engine_code: 'OM906LA', description: 'U400 Series - Professional implement carrier, 231 hp' },
  { id: 'aaaa0001-aaaa-aaaa-aaaa-aaaaaaaaaaaa', model_name: 'U216', model_code: 'U216', year_from: 2013, year_to: null, engine_code: 'OM934', description: 'U216 - Modern compact Unimog, 156 hp' },
  { id: 'aaaa0002-aaaa-aaaa-aaaa-aaaaaaaaaaaa', model_name: 'U218', model_code: 'U218', year_from: 2013, year_to: null, engine_code: 'OM934', description: 'U218 - Modern compact Unimog, 177 hp' },
  { id: 'aaaa0003-aaaa-aaaa-aaaa-aaaaaaaaaaaa', model_name: 'U219', model_code: 'U219', year_from: 2013, year_to: null, engine_code: 'OM934', description: 'U219 - Modern compact Unimog, 177 hp' },
  { id: 'aaaa0004-aaaa-aaaa-aaaa-aaaaaaaaaaaa', model_name: 'U318', model_code: 'U318', year_from: 2013, year_to: null, engine_code: 'OM934', description: 'U318 - Modern professional Unimog, 177 hp' },
  { id: 'aaaa0005-aaaa-aaaa-aaaa-aaaaaaaaaaaa', model_name: 'U418', model_code: 'U418', year_from: 2013, year_to: null, engine_code: 'OM934', description: 'U418 - Modern professional Unimog, 177 hp' },
  { id: 'bbbb0001-bbbb-bbbb-bbbb-bbbbbbbbbbbb', model_name: 'U404', model_code: 'U404', year_from: 1955, year_to: 1980, engine_code: 'M180', description: 'U404 - Classic military Unimog with petrol engine' },
  { id: 'bbbb0002-bbbb-bbbb-bbbb-bbbbbbbbbbbb', model_name: 'U406', model_code: 'U406', year_from: 1963, year_to: 1989, engine_code: 'OM352', description: 'U406 - Heavy-duty utility Unimog' },
  { id: 'bbbb0003-bbbb-bbbb-bbbb-bbbbbbbbbbbb', model_name: 'U411', model_code: 'U411', year_from: 1956, year_to: 1974, engine_code: 'OM636', description: 'U411 - Classic utility Unimog' },
  { id: 'bbbb0004-bbbb-bbbb-bbbb-bbbbbbbbbbbb', model_name: 'U413', model_code: 'U413', year_from: 1976, year_to: 1989, engine_code: 'OM352', description: 'U413 - Military/utility Unimog' },
  { id: 'bbbb0005-bbbb-bbbb-bbbb-bbbbbbbbbbbb', model_name: 'U416', model_code: 'U416', year_from: 1976, year_to: 1989, engine_code: 'OM352', description: 'U416 - Heavy-duty utility Unimog' },
  { id: 'bbbb0006-bbbb-bbbb-bbbb-bbbbbbbbbbbb', model_name: 'U421', model_code: 'U421', year_from: 1966, year_to: 1989, engine_code: 'OM352', description: 'U421 - Classic long wheelbase Unimog' },
  { id: 'bbbb0007-bbbb-bbbb-bbbb-bbbbbbbbbbbb', model_name: 'U424', model_code: 'U424', year_from: 1976, year_to: 1991, engine_code: 'OM352', description: 'U424 - Agricultural/forestry Unimog' },
  { id: 'bbbb0008-bbbb-bbbb-bbbb-bbbbbbbbbbbb', model_name: 'U425', model_code: 'U425', year_from: 1976, year_to: 1993, engine_code: 'OM366', description: 'U425 - Heavy-duty agricultural Unimog' },
  { id: 'bbbb0009-bbbb-bbbb-bbbb-bbbbbbbbbbbb', model_name: 'U427', model_code: 'U427', year_from: 1976, year_to: 1993, engine_code: 'OM366', description: 'U427 - Professional implement carrier' },
  { id: 'bbbb0010-bbbb-bbbb-bbbb-bbbbbbbbbbbb', model_name: 'U430', model_code: 'U430', year_from: 2013, year_to: null, engine_code: 'OM936', description: 'U430 - Modern heavy-duty Unimog, 299 hp' },
  { id: 'bbbb0011-bbbb-bbbb-bbbb-bbbbbbbbbbbb', model_name: 'U437', model_code: 'U437', year_from: 1976, year_to: 1993, engine_code: 'OM366', description: 'U437 - Heavy-duty long wheelbase' },
  { id: 'bbbb0012-bbbb-bbbb-bbbb-bbbbbbbbbbbb', model_name: 'U423', model_code: 'U423', year_from: 1976, year_to: 1991, engine_code: 'OM352', description: 'U423 - Agricultural Unimog' },
  { id: 'cccc0001-cccc-cccc-cccc-cccccccccccc', model_name: 'U1000', model_code: 'U1000', year_from: 1975, year_to: 1989, engine_code: 'OM352', description: 'U1000 - Medium-duty truck' },
  { id: 'cccc0002-cccc-cccc-cccc-cccccccccccc', model_name: 'U1100', model_code: 'U1100', year_from: 1975, year_to: 1989, engine_code: 'OM352', description: 'U1100 - Medium-duty truck' },
  { id: 'cccc0003-cccc-cccc-cccc-cccccccccccc', model_name: 'U1200', model_code: 'U1200', year_from: 1984, year_to: 1994, engine_code: 'OM366', description: 'U1200 - Medium-duty truck' },
  { id: 'cccc0004-cccc-cccc-cccc-cccccccccccc', model_name: 'U1400', model_code: 'U1400', year_from: 1989, year_to: 2000, engine_code: 'OM366LA', description: 'U1400 - Medium-duty truck' },
  { id: 'cccc0005-cccc-cccc-cccc-cccccccccccc', model_name: 'U1450', model_code: 'U1450', year_from: 1989, year_to: 2000, engine_code: 'OM366LA', description: 'U1450 - Medium-duty long wheelbase' },
  { id: 'cccc0006-cccc-cccc-cccc-cccccccccccc', model_name: 'U1500', model_code: 'U1500', year_from: 1975, year_to: 1989, engine_code: 'OM352', description: 'U1500 - Heavy-duty truck' },
  { id: 'cccc0007-cccc-cccc-cccc-cccccccccccc', model_name: 'U1550', model_code: 'U1550', year_from: 1989, year_to: 2000, engine_code: 'OM366LA', description: 'U1550 - Heavy-duty long wheelbase' },
  { id: 'cccc0008-cccc-cccc-cccc-cccccccccccc', model_name: 'U1600', model_code: 'U1600', year_from: 1989, year_to: 2000, engine_code: 'OM366LA', description: 'U1600 - Heavy-duty truck' },
  { id: 'cccc0009-cccc-cccc-cccc-cccccccccccc', model_name: 'U1650', model_code: 'U1650', year_from: 1989, year_to: 2000, engine_code: 'OM366LA', description: 'U1650 - Heavy-duty long wheelbase' },
  { id: 'dddd0001-dddd-dddd-dddd-dddddddddddd', model_name: 'U2100', model_code: 'U2100', year_from: 1976, year_to: 1989, engine_code: 'OM352', description: 'U2100 - Heavy-duty truck' },
  { id: 'dddd0002-dddd-dddd-dddd-dddddddddddd', model_name: 'U2450', model_code: 'U2450', year_from: 1989, year_to: 1996, engine_code: 'OM366LA', description: 'U2450 - Heavy-duty long wheelbase' },
  { id: 'eeee0001-eeee-eeee-eeee-eeeeeeeeeeee', model_name: 'U3000', model_code: 'U3000', year_from: 2002, year_to: 2013, engine_code: 'OM904LA', description: 'U3000 - Modern medium-duty truck, 177 hp' },
  { id: 'eeee0002-eeee-eeee-eeee-eeeeeeeeeeee', model_name: 'U4000', model_code: 'U4000', year_from: 2000, year_to: 2013, engine_code: 'OM906LA', description: 'U4000 - Modern heavy-duty truck, 218 hp' },
  { id: 'eeee0003-eeee-eeee-eeee-eeeeeeeeeeee', model_name: 'U5000', model_code: 'U5000', year_from: 2002, year_to: 2013, engine_code: 'OM906LA', description: 'U5000 - Modern extreme-duty truck, 272 hp' },
  { id: 'eeee0004-eeee-eeee-eeee-eeeeeeeeeeee', model_name: 'U4023', model_code: 'U4023', year_from: 2013, year_to: null, engine_code: 'OM936', description: 'U4023 - Modern professional truck, 231 hp' },
  { id: 'eeee0005-eeee-eeee-eeee-eeeeeeeeeeee', model_name: 'U5023', model_code: 'U5023', year_from: 2013, year_to: null, engine_code: 'OM936', description: 'U5023 - Modern extreme-duty truck, 231 hp' }
];

async function importData() {
  console.log('🚀 Simple WIS Import via REST API\n');
  
  try {
    // Step 1: Import Vehicle Models
    console.log('STEP 1: Importing Vehicle Models');
    console.log('─────────────────────────────────');
    
    const url = `${SUPABASE_URL}/rest/v1/wis_models`;
    
    // Try to insert all models
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(vehicleModels)
    });
    
    if (!response.ok) {
      const error = await response.text();
      console.log(`⚠️ Models might already exist or error: ${error}`);
      
      // Try upsert instead
      console.log('Trying upsert instead...');
      const upsertResponse = await fetch(url + '?on_conflict=model_code', {
        method: 'POST',
        headers: {
          'apikey': SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates,return=minimal'
        },
        body: JSON.stringify(vehicleModels)
      });
      
      if (upsertResponse.ok) {
        console.log('✅ Vehicle models upserted successfully!');
      } else {
        console.log('Models import had issues, continuing...');
      }
    } else {
      console.log('✅ Vehicle models imported successfully!');
    }
    
    // Check count
    const countResponse = await fetch(url + '?select=count', {
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Prefer': 'count=exact'
      }
    });
    
    const modelCount = countResponse.headers.get('content-range')?.split('/')[1] || '0';
    console.log(`📊 Total models in database: ${modelCount}\n`);
    
    // Step 2: Import Procedures from chunks
    console.log('STEP 2: Importing Procedures');
    console.log('────────────────────────────');
    console.log('Reading procedure chunks...\n');
    
    const chunksDir = path.join(__dirname, 'procedures-chunks');
    const chunkFiles = fs.readdirSync(chunksDir)
      .filter(f => f.endsWith('.sql'))
      .sort();
    
    console.log(`Found ${chunkFiles.length} chunks to process`);
    console.log('This will be done via SQL Editor for reliability\n');
    
    // Step 3: Show manual import instructions
    console.log('═══════════════════════════════════════');
    console.log('📋 MANUAL IMPORT REQUIRED');
    console.log('═══════════════════════════════════════\n');
    
    console.log('Since database password authentication is having issues,');
    console.log('please complete the import manually:\n');
    
    console.log('1. Go to: https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor/sql/new\n');
    
    console.log('2. Run each procedure chunk:');
    chunkFiles.forEach((file, index) => {
      console.log(`   ${index + 1}. ${file}`);
    });
    
    console.log('\n3. Run: 03-import-parts.sql');
    console.log('4. Run: 04-import-bulletins.sql\n');
    
    console.log('Each file is small enough to run in the SQL Editor.');
    console.log('You can open multiple tabs to run them in parallel.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

importData();