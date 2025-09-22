#!/usr/bin/env node

/**
 * Batch Upload Unimog 435 Maintenance Manual PDFs
 * Uploads all 26 PDF sections to Supabase storage for processing
 */

const fs = require('fs');
const path = require('path');

// Configuration
const MANUAL_FOLDER = '/Users/thabonel/Documents/Unimog Manuals/Unimog 435 Maintenance Manual - English';

// File mapping with proper sequential naming for Barry
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

function generateUploadCommands() {
  console.log('🚀 Generating upload commands for all 26 Unimog 435 manual sections...\n');

  const files = Object.keys(fileMapping);
  let totalSize = 0;
  let validFiles = 0;
  let commands = [];

  // Check all files and generate commands
  for (const filename of files) {
    const filePath = path.join(MANUAL_FOLDER, filename);
    const manualTitle = fileMapping[filename];

    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      const fileSize = (stats.size / 1024 / 1024).toFixed(2);
      totalSize += stats.size;
      validFiles++;

      console.log(`✅ ${manualTitle} (${fileSize}MB)`);

      // Generate the upload command for admin interface
      commands.push(`"${filePath}" as "${manualTitle}"`);
    } else {
      console.log(`❌ File not found: ${filename}`);
    }
  }

  const totalSizeMB = (totalSize / 1024 / 1024).toFixed(2);

  console.log('\n📊 Summary:');
  console.log(`✅ Valid files: ${validFiles}/26`);
  console.log(`📦 Total size: ${totalSizeMB}MB`);

  console.log('\n🎯 Next Steps:');
  console.log('1. Go to the admin manual processing interface');
  console.log('2. Use bulk upload feature or upload these files:');
  console.log('\n📋 File Upload List:');

  files.forEach(filename => {
    const filePath = path.join(MANUAL_FOLDER, filename);
    const manualTitle = fileMapping[filename];
    if (fs.existsSync(filePath)) {
      console.log(`   • "${filePath}" → "${manualTitle}"`);
    }
  });

  console.log('\n💡 Pro Tip: All files will be processed automatically once uploaded!');
  console.log('🔍 Monitor progress in the admin dashboard.');

  return { validFiles, totalSizeMB, commands };
}

// Generate the upload information
const result = generateUploadCommands();

if (result.validFiles === 26) {
  console.log('\n🎉 All 26 Unimog 435 manual sections are ready for upload!');
} else {
  console.log(`\n⚠️  ${26 - result.validFiles} files are missing and won't be processed.`);
}