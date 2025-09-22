#!/usr/bin/env node

/**
 * Batch Process Unimog 435 Maintenance Manual
 * Processes all 26 PDF sections in one operation
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Configuration
const MANUAL_FOLDER = '/Users/thabonel/Documents/Unimog Manuals/Unimog 435 Maintenance Manual - English';
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing environment variables. Please check VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// File mapping with proper names
const fileMapping = {
  '0 - Foreward.pdf': 'Unimog 435 - 00 Foreword',
  '00 - General.pdf': 'Unimog 435 - 01 General',
  '01 - Engine Housing.pdf': 'Unimog 435 - 02 Engine Housing',
  '05 - Engine Timing.pdf': 'Unimog 435 - 03 Engine Timing',
  '07 - Fuel Injectors.pdf': 'Unimog 435 - 04 Fuel Injectors',
  '09 - Air Filter.pdf': 'Unimog 435 - 05 Air Filter',
  '13 - Air Compressor + Belts.pdf': 'Unimog 435 - 06 Air Compressor + Belts',
  '18 - Engine Lubrication.pdf': 'Unimog 435 - 07 Engine Lubrication',
  '24 - Engine Mounts.pdf': 'Unimog 435 - 08 Engine Mounts',
  '25 - Clutch.pdf': 'Unimog 435 - 09 Clutch',
  '26 - Transmission.pdf': 'Unimog 435 - 10 Transmission',
  '29 - Pedal Linkage.pdf': 'Unimog 435 - 11 Pedal Linkage',
  '31 - Frame.pdf': 'Unimog 435 - 12 Frame',
  '32 - Suspension.pdf': 'Unimog 435 - 13 Suspension',
  '33 - Front Axle.pdf': 'Unimog 435 - 14 Front Axle',
  '35 - Rear Axle.pdf': 'Unimog 435 - 15 Rear Axle',
  '40 - Wheels + Prop Shafts.pdf': 'Unimog 435 - 16 Wheels + Prop Shafts',
  '42 - Brakes - Hydraulic + Mechanical.pdf': 'Unimog 435 - 17 Brakes - Hydraulic + Mechanical',
  '43 - Brakes - Pneumatic.pdf': 'Unimog 435 - 18 Brakes - Pneumatic',
  '46 - Steering.pdf': 'Unimog 435 - 19 Steering',
  '49 - Exhaust.pdf': 'Unimog 435 - 20 Exhaust',
  '50 - Cooling System.pdf': 'Unimog 435 - 21 Cooling System',
  '54 - Batteries.pdf': 'Unimog 435 - 22 Batteries',
  '55 - Special Equipment.pdf': 'Unimog 435 - 23 Special Equipment',
  '60 - Body.pdf': 'Unimog 435 - 24 Body',
  '82 - Headlights.pdf': 'Unimog 435 - 25 Headlights'
};

async function processManuals() {
  console.log('🚀 Starting batch processing of Unimog 435 manuals...');

  const files = Object.keys(fileMapping);
  let processed = 0;
  let errors = 0;

  for (const filename of files) {
    const filePath = path.join(MANUAL_FOLDER, filename);
    const manualTitle = fileMapping[filename];

    console.log(`📄 Processing: ${manualTitle}...`);

    try {
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        console.log(`⚠️  File not found: ${filename}`);
        continue;
      }

      // Read PDF file
      const fileBuffer = fs.readFileSync(filePath);
      const fileSize = (fileBuffer.length / 1024 / 1024).toFixed(2);
      console.log(`   📊 Size: ${fileSize}MB`);

      // Upload to Supabase Storage
      const fileName = `${manualTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.pdf`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('manuals')
        .upload(fileName, fileBuffer, {
          contentType: 'application/pdf',
          upsert: true
        });

      if (uploadError) {
        console.error(`   ❌ Upload failed: ${uploadError.message}`);
        errors++;
        continue;
      }

      console.log(`   ✅ Uploaded to storage: ${fileName}`);

      // Trigger processing via Edge Function
      const { data: processData, error: processError } = await supabase.functions.invoke('process-manual', {
        body: {
          fileName: fileName,
          manualTitle: manualTitle,
          storageUrl: uploadData.path
        }
      });

      if (processError) {
        console.error(`   ❌ Processing failed: ${processError.message}`);
        errors++;
        continue;
      }

      console.log(`   ✅ Processing initiated for ${manualTitle}`);
      processed++;

      // Small delay to avoid overwhelming the system
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      console.error(`   ❌ Error processing ${filename}:`, error.message);
      errors++;
    }
  }

  console.log('\n📊 Batch Processing Complete!');
  console.log(`✅ Successfully processed: ${processed} manuals`);
  console.log(`❌ Errors: ${errors} manuals`);

  if (processed > 0) {
    console.log('\n🎉 Unimog 435 manuals are being processed!');
    console.log('📚 Barry will have access to 435-specific maintenance information shortly.');
    console.log('🔍 Check the admin dashboard to monitor processing progress.');
  }
}

// Run the batch processing
processManuals().catch(console.error);