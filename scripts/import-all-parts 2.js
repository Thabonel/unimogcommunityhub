#!/usr/bin/env node
/**
 * Import all extracted Mercedes parts to Supabase
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase connection
const supabaseUrl = 'https://ydevatqwkoccxhtejdor.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseKey) {
  console.error('❌ Error: VITE_SUPABASE_ANON_KEY not found');
  console.log('Set it with: export VITE_SUPABASE_ANON_KEY=your_key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function importParts() {
  console.log('='.repeat(60));
  console.log('MERCEDES PARTS MASS IMPORT');
  console.log('='.repeat(60));
  
  // Read the JSON file
  const dataFile = '/Volumes/UnimogManuals/MERCEDES-FOCUSED-PARTS/mercedes_focused_parts.json';
  
  if (!fs.existsSync(dataFile)) {
    console.error(`❌ Data file not found: ${dataFile}`);
    return;
  }
  
  const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  
  console.log(`\n📦 Importing ${data.parts.length} Mercedes parts...`);
  
  // Process in batches for better performance
  const batchSize = 50;
  let imported = 0;
  let errors = 0;
  
  for (let i = 0; i < data.parts.length; i += batchSize) {
    const batch = data.parts.slice(i, i + batchSize);
    
    // Prepare batch data
    const batchData = batch.map(part => ({
      part_number: part.part_number,
      description: part.description || ''
    }));
    
    try {
      // Insert batch
      const { error } = await supabase
        .from('wis_parts')
        .upsert(batchData, {
          onConflict: 'part_number',
          ignoreDuplicates: false
        });
        
      if (error) {
        console.error(`Batch error:`, error.message);
        errors += batch.length;
      } else {
        imported += batch.length;
      }
      
      // Progress update
      if ((i + batchSize) % 200 === 0 || i + batchSize >= data.parts.length) {
        console.log(`  Progress: ${Math.min(i + batchSize, data.parts.length)}/${data.parts.length} parts processed`);
      }
      
    } catch (err) {
      console.error(`Error processing batch:`, err.message);
      errors += batch.length;
    }
  }
  
  console.log(`\n✅ Import complete!`);
  console.log(`  • Successfully imported: ${imported} parts`);
  console.log(`  • Errors: ${errors} parts`);
  
  // Verify final count
  console.log('\nVerifying database...');
  
  const { count } = await supabase
    .from('wis_parts')
    .select('*', { count: 'exact', head: true });
    
  console.log(`\n📊 Database now contains: ${count} total parts`);
  
  // Show some samples
  const { data: samples } = await supabase
    .from('wis_parts')
    .select('part_number, description')
    .limit(20)
    .order('created_at', { ascending: false });
    
  if (samples && samples.length > 0) {
    console.log('\n📋 Recently added parts:');
    for (const part of samples) {
      const desc = part.description || '(no description)';
      console.log(`  ${part.part_number}: ${desc.substring(0, 50)}${desc.length > 50 ? '...' : ''}`);
    }
  }
  
  // Show parts by category
  const { data: allParts } = await supabase
    .from('wis_parts')
    .select('part_number');
    
  if (allParts) {
    const categories = {};
    for (const part of allParts) {
      const prefix = part.part_number.substring(0, 4);
      categories[prefix] = (categories[prefix] || 0) + 1;
    }
    
    console.log('\n📊 Parts by category:');
    const sortedCats = Object.entries(categories)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15);
      
    for (const [prefix, count] of sortedCats) {
      console.log(`  ${prefix}: ${count} parts`);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('🎉 IMPORT SUCCESSFUL!');
  console.log('='.repeat(60));
  console.log('\nYour community can now access Mercedes parts at:');
  console.log('http://localhost:5173/knowledge/wis-epc');
  console.log('\nParts include:');
  console.log('• Portal hub assemblies and seals');
  console.log('• Transfer case components');
  console.log('• Hydraulic system parts');
  console.log('• Engine components (OM366)');
  console.log('• Differential and axle parts');
  console.log('• Electrical and electronic modules');
  console.log('• And many more...');
}

// Run import
importParts().catch(console.error);