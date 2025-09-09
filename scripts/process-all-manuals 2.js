#!/usr/bin/env node

/**
 * Process all PDF manuals through the chunking system for Barry AI
 */

import fetch from 'node-fetch';

const SUPABASE_URL = 'https://ydevatqwkoccxhtejdor.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkZXZhdHF3a29jY3hodGVqZG9yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzIyMDE2MSwiZXhwIjoyMDU4Nzk2MTYxfQ.qUYRgNaX0s8UIjaaZm0RyjBhNyG5oxDY3Oc8wDz-nu8';

// Manual list from storage
const MANUAL_FILES = [
  'G600-Data-Summary.pdf',
  'G603-Unimog-all-types-Light-Repair.pdf',
  'G604-1-Unimog-all-types-Medium-Repair.pdf',
  'G604-2-Unimog-all-types-Heavy-Repair.pdf',
  'G607-1-Brushguard-Modification.pdf',
  'G607-2-Horn-Relocation-Modification.pdf',
  'G607-3-Hydraulic-Jack-Stowage-Bkt-Modification.pdf',
  'G607-4-Tray-Seating-Grab-Handle-Modification.pdf',
  'G609-10-Overhaul-of-Brake-Caliper-Assemblies.pdf',
  'G609-7-InspectionReplacement-TailgateSidegate-Hinges.-Misc-Inst.pdf',
  'G609-9-Hydraulic-Cabin-Tilting-Kit.-Gen-Inst.pdf',
  'G609-Unimog-all-types-Servicing-Instruction.pdf',
  'G617-10-Accelerator-Pedal-Cross-Shaft-Modification.pdf',
  'G617-11-Iifting-and-Tiedown-Point-Modificationpdf.pdf',
  'G617-12-Water-Pump-Jockey-Pulley-Bkt-Modification.pdf',
  'G617-14-Brake-Line-Chafing-Modification.pdf',
  'G617-15-Clutch-Output-Shaft-Bearing-Modification.pdf',
  'G617-16-Clutch-Master-Cylinder-Removal-Modification.pdf',
  'G617-18-Tray-Floor-Headboard-Assembly-Modification.pdf',
  'G617-20-Engine-Warning-Device-Modification.pdf',
  'G617-21-Modification-Record-Plate-Modification.pdf',
  'G617-23-Fitting-Additional-Blackout-Driving-Light-Modification.pdf',
  'G617-24-Transmission-Oil-Distribution-Pipe-Modification.pdf',
  'G617-25-Fitting-of-Austeyr-Weapon-Bkts-Modification.pdf',
  'G617-26-Handbrake-Lever-Modification.pdf',
  'G617-29-Transmission-Shift-Mechanism-Modification.pdf',
  'G617-2-Coolant-Header-Tank-Modification.pdf',
  'G617-36-Fitting-of-12.5-Ton-Trl-Safety-Chain-Mounts-Modification.pdf',
  'G617-3-Clearance-Light-Wiring-Modification.pdf',
  'G617-4-Accelerator-Pedal-Stop-Bolt-Modification.pdf',
  'G617-6-Brake-Caliper-Protection-Shrouds-Modification.pdf',
  'G617-7-Change-of-Engine-Shutdown-Method-Modification.pdf',
  'G617-9-Fuel-Tank-Drain-Plug-Modification.pdf',
  'G618-1-Unimog-all-types-Technical-Inspection.pdf',
  'G619-22-Rear-Axle-Pinion-Seal-Installation-Tool-Misc-Inst.pdf',
  'G619-25-Partial-Torque-Tube-Removal-Misc-Inst.pdf',
  'G619-26-Radiator-Coolant-TEC-PGXL-Misc-Inst.pdf',
  'G619-29-Stripping-Assembly-Calibration-of-Winch-Torque-Limiter-Misc-Inst.pdf',
  'G619-30-Wheel-Rim-and-Tyre-Configuration-Misc-Inst.pdf',
  'G619-6-Turbocharger-Fault-Diagnosis-Misc-Inst.pdf',
  'G629-Servicing-Instruction-Crane.pdf',
  'G650-Unimog-UL1750-RAAF-Data-Summary.pdf',
  'RPS-02202-Unimog-GS-with-Twist-Locks.pdf',
  'UHB-Unimog-Cargo.pdf',
  'unimog compressor.pdf'
];

async function checkProcessedManuals() {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/manual_chunks?select=filename`, {
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      const processedFiles = new Set(data.map(item => item.filename));
      return processedFiles;
    }
  } catch (error) {
    console.error('Error checking processed manuals:', error);
  }
  return new Set();
}

async function triggerProcessing(filename) {
  try {
    // Call the process-manual Edge Function
    const response = await fetch(`${SUPABASE_URL}/functions/v1/process-manual`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        filename: filename,
        bucket: 'manuals'
      })
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(`Error processing ${filename}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🚀 Manual Processing for Barry AI');
  console.log('=' + '='.repeat(50) + '\n');
  
  // Check what's already processed
  console.log('📊 Checking existing processed manuals...');
  const processedFiles = await checkProcessedManuals();
  console.log(`Found ${processedFiles.size} already processed\n`);
  
  // Filter unprocessed files
  const unprocessedFiles = MANUAL_FILES.filter(file => !processedFiles.has(file));
  
  if (unprocessedFiles.length === 0) {
    console.log('✅ All manuals are already processed!');
    return;
  }
  
  console.log(`📚 Processing ${unprocessedFiles.length} unprocessed manuals...\n`);
  
  let successCount = 0;
  let failCount = 0;
  
  for (let i = 0; i < unprocessedFiles.length; i++) {
    const file = unprocessedFiles[i];
    const progress = Math.round((i / unprocessedFiles.length) * 100);
    
    console.log(`[${progress}%] Processing: ${file}`);
    
    const result = await triggerProcessing(file);
    
    if (result && result.success) {
      successCount++;
      console.log(`  ✅ Success: ${result.chunks} chunks created`);
    } else {
      failCount++;
      console.log(`  ❌ Failed to process`);
    }
    
    // Small delay between files to avoid overwhelming the server
    if (i < unprocessedFiles.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.log('\n' + '='.repeat(51));
  console.log('📈 Processing Complete:');
  console.log(`  ✅ Success: ${successCount}`);
  console.log(`  ❌ Failed: ${failCount}`);
  console.log('='.repeat(51));
  
  if (successCount > 0) {
    console.log('\n✨ Manuals are now available for Barry AI to search!');
    console.log('Test it at: /knowledge/chatgpt');
  }
}

main().catch(console.error);