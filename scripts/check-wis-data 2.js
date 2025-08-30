#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkWISData() {
  console.log('🔍 Checking WIS Database Status...\n');
  
  // Check vehicles (wis_models)
  console.log('📋 Checking Vehicles (wis_models):');
  const { data: vehicles, error: vehicleError } = await supabase
    .from('wis_models')
    .select('*');
  
  if (vehicleError) {
    console.error('❌ Error fetching vehicles:', vehicleError.message);
  } else {
    console.log(`✅ Found ${vehicles?.length || 0} vehicles:`);
    vehicles?.forEach(v => {
      console.log(`   - ${v.model_name} (${v.model_code}) - Years: ${v.year_from}-${v.year_to}`);
    });
  }
  
  // Check procedures
  console.log('\n📋 Checking Procedures (wis_procedures):');
  const { data: procedures, error: procError } = await supabase
    .from('wis_procedures')
    .select('*');
  
  if (procError) {
    console.error('❌ Error fetching procedures:', procError.message);
  } else {
    console.log(`✅ Found ${procedures?.length || 0} procedures:`);
    procedures?.forEach(p => {
      console.log(`   - ${p.title} (${p.procedure_code})`);
    });
  }
  
  // Check parts
  console.log('\n📋 Checking Parts (wis_parts):');
  const { data: parts, error: partError } = await supabase
    .from('wis_parts')
    .select('*');
  
  if (partError) {
    console.error('❌ Error fetching parts:', partError.message);
  } else {
    console.log(`✅ Found ${parts?.length || 0} parts:`);
    parts?.forEach(p => {
      console.log(`   - ${p.part_number}: ${p.description} - $${p.price}`);
    });
  }
  
  // Check bulletins
  console.log('\n📋 Checking Bulletins (wis_bulletins):');
  const { data: bulletins, error: bulletinError } = await supabase
    .from('wis_bulletins')
    .select('*');
  
  if (bulletinError) {
    console.error('❌ Error fetching bulletins:', bulletinError.message);
  } else {
    console.log(`✅ Found ${bulletins?.length || 0} bulletins:`);
    bulletins?.forEach(b => {
      console.log(`   - ${b.bulletin_number}: ${b.title}`);
    });
  }
  
  // Check storage bucket
  console.log('\n📁 Checking Storage Bucket (wis-manuals):');
  const { data: files, error: storageError } = await supabase.storage
    .from('wis-manuals')
    .list('', { limit: 100 });
  
  if (storageError) {
    console.error('❌ Error checking storage:', storageError.message);
  } else {
    console.log(`✅ Found ${files?.length || 0} folders/files in storage:`);
    files?.forEach(f => {
      console.log(`   - ${f.name}`);
    });
    
    // Check each subfolder
    const folders = ['manuals', 'bulletins', 'parts'];
    for (const folder of folders) {
      const { data: subFiles, error: subError } = await supabase.storage
        .from('wis-manuals')
        .list(folder, { limit: 10 });
      
      if (!subError && subFiles) {
        console.log(`\n   📂 ${folder}/ contains ${subFiles.length} files:`);
        subFiles.forEach(f => {
          console.log(`      - ${f.name}`);
        });
      }
    }
  }
  
  // Test file accessibility
  console.log('\n🌐 Testing File Accessibility:');
  const testUrls = [
    'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/wis-manuals/manuals/unimog_400_oil_change.html',
    'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/wis-manuals/bulletins/tsb_2020_001_portal_axle.html'
  ];
  
  for (const url of testUrls) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        console.log(`   ✅ ${url.split('/').pop()} - Accessible (${response.status})`);
      } else {
        console.log(`   ❌ ${url.split('/').pop()} - Not accessible (${response.status})`);
      }
    } catch (err) {
      console.log(`   ❌ ${url.split('/').pop()} - Error: ${err.message}`);
    }
  }
  
  console.log('\n📊 Summary:');
  console.log('===========');
  console.log(`Vehicles: ${vehicles?.length || 0}`);
  console.log(`Procedures: ${procedures?.length || 0}`);
  console.log(`Parts: ${parts?.length || 0}`);
  console.log(`Bulletins: ${bulletins?.length || 0}`);
  console.log(`Storage Items: ${files?.length || 0}`);
}

// Run the check
checkWISData().catch(console.error);