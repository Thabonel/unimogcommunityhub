#!/usr/bin/env node

/**
 * Bulk Manual Processing Script
 *
 * Processes all PDFs in the manuals storage bucket and adds them to the knowledge base
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   - VITE_SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Manual metadata mapping for proper categorization
const MANUAL_METADATA = {
  // High Priority - Core Technical
  'G602': { title: 'Technical Description - Cargo', category: 'Technical Manual', priority: 'high' },
  'G607-6': { title: 'Centre Seating', category: 'Modification Manual', priority: 'high' },
  'RPS-02155': { title: 'Repair Parts Scale - Cargo', category: 'Parts Catalog', priority: 'high' },

  // Crane Manuals
  'G620': { title: 'Data Summary - Cargo W/ Crane', category: 'Technical Manual', priority: 'high' },
  'G622': { title: 'Technical Description - Cargo W/ Crane', category: 'Technical Manual', priority: 'high' },
  'G623': { title: 'Light Grade Repair - Crane', category: 'Service Manual', priority: 'high' },
  'G624': { title: 'Medium Grade Repair - Crane', category: 'Service Manual', priority: 'high' },
  'G624-1': { title: 'Heavy Grade Repair - Crane', category: 'Service Manual', priority: 'high' },
  'G627-2': { title: 'Hydraulic Control Valves', category: 'Technical Manual', priority: 'high' },
  'G627-3': { title: 'Inner Boom Rust', category: 'Maintenance Manual', priority: 'high' },
  'G627-4': { title: 'Crane Pressure Gauge and Lockout Circuit Modification', category: 'Modification Manual', priority: 'high' },
  'RPS-02157': { title: 'Repair Parts Scale - Cargo W/ Crane', category: 'Parts Catalog', priority: 'high' },

  // 6x6 Recovery Vehicle Series
  'UNI6X6-LIGHT': { title: '6×6 Recovery - Light Repair', category: 'Service Manual', priority: 'medium' },
  'UNI6X6-MED-VOL1': { title: '6×6 Recovery - Medium Repair Vol 1', category: 'Service Manual', priority: 'medium' },
  'UNI6X6-MED-VOL2': { title: '6×6 Recovery - Medium Repair Vol 2', category: 'Service Manual', priority: 'medium' },
  'UNI6X6-MED-VOL3': { title: '6×6 Recovery - Medium Repair Vol 3', category: 'Service Manual', priority: 'medium' },
  'UNI6X6-MED-VOL4': { title: '6×6 Recovery - Medium Repair Vol 4', category: 'Service Manual', priority: 'medium' },
  'UNI6X6-MED-VOL5': { title: '6×6 Recovery - Medium Repair Vol 5', category: 'Service Manual', priority: 'medium' },
  'UNI6X6-MED-VOL6': { title: '6×6 Recovery - Medium Repair Vol 6', category: 'Service Manual', priority: 'medium' },
  'UNI6X6-MED-VOL7': { title: '6×6 Recovery - Medium Repair Vol 7', category: 'Service Manual', priority: 'medium' },
  'UNI6X6-MED-VOL8': { title: '6×6 Recovery - Medium Repair Vol 8', category: 'Service Manual', priority: 'medium' },
  'UNI6X6-MED-VOL9': { title: '6×6 Recovery - Medium Repair Vol 9', category: 'Service Manual', priority: 'medium' },
  'UNI6X6-MED-VOL10': { title: '6×6 Recovery - Medium Repair Vol 10', category: 'Service Manual', priority: 'medium' },
  'UNI6X6-MED-VOL11': { title: '6×6 Recovery - Medium Repair Vol 11', category: 'Service Manual', priority: 'medium' },
  'UNI6X6-SERVICE': { title: '6×6 Recovery - Service Instruction', category: 'Service Manual', priority: 'medium' },
  'RPS-02229-1': { title: 'Repair Parts Scale Part 1 - 6×6 Recovery', category: 'Parts Catalog', priority: 'medium' },
  'RPS-02229-2': { title: 'Repair Parts Scale Part 2 - 6×6 Recovery', category: 'Parts Catalog', priority: 'medium' },
  'UHB-6X6': { title: 'User Handbook - 6×6 Recovery', category: 'User Manual', priority: 'medium' },

  // Specialized Documents
  'G617-2': { title: 'Coolant Header Tank Modification', category: 'Modification Manual', priority: 'low' },
  'G617-13': { title: 'Tray Seat Legs Modification', category: 'Modification Manual', priority: 'low' },
  'G630': { title: 'Data Summary - Dump W/Winch', category: 'Technical Manual', priority: 'low' },
  'G632': { title: 'Technical Description - Dump W/Winch', category: 'Technical Manual', priority: 'low' },
  'G633': { title: 'Light Repair Supplement - Dump W/Winch', category: 'Service Manual', priority: 'low' },
  'G634': { title: 'Medium Repair Supplement - Dump W/Winch', category: 'Service Manual', priority: 'low' },
  'G637-1': { title: 'Tailgate Top Hinge', category: 'Modification Manual', priority: 'low' },
  'G637-3': { title: 'Engineers Tool Cage', category: 'Modification Manual', priority: 'low' },
  'G639-1': { title: 'Fitment of A Replacement Hyva Hoist Control Valve', category: 'Modification Manual', priority: 'low' },
  'G652': { title: 'Technical Description - UL1750 RAAF', category: 'Technical Manual', priority: 'low' },
  'RPS-02158': { title: 'Repair Parts Scale - Dump W/Winch', category: 'Parts Catalog', priority: 'low' },
  'RPS-02202': { title: 'Repair Parts Scale - Cargo W/ Twist Locks', category: 'Parts Catalog', priority: 'low' },
  'RPS-02204': { title: 'Repair Parts Scale - Cargo W/ Winch W/ Twist Locks', category: 'Parts Catalog', priority: 'low' },
  'RPS-02205': { title: 'Repair Parts Scale - Cargo W/ Crane W/ Twist Locks', category: 'Parts Catalog', priority: 'low' },
  'RPS-02156': { title: 'Repair Parts Scale - Cargo W/ Winch', category: 'Parts Catalog', priority: 'low' }
};

async function listStorageBucketFiles() {
  console.log('📂 Scanning manuals storage bucket...');

  const { data: files, error } = await supabase.storage
    .from('manuals')
    .list('', { limit: 1000 });

  if (error) {
    console.error('❌ Error listing storage files:', error);
    return [];
  }

  return files.filter(file => file.name.toLowerCase().endsWith('.pdf'));
}

async function getExistingManuals() {
  console.log('📋 Checking existing manuals in database...');

  const { data: manuals, error } = await supabase
    .from('manuals')
    .select('title, file_name, storage_path');

  if (error) {
    console.error('❌ Error fetching existing manuals:', error);
    return [];
  }

  return manuals || [];
}

function extractDocumentId(filename) {
  // Extract document ID from filename (e.g., "G602 Technical Description.pdf" -> "G602")
  const match = filename.match(/^([A-Z]\d+(?:-\d+)?|UNI6X6-[A-Z-]+\d*|RPS-\d+(?:-\d+)?)/i);
  return match ? match[1].toUpperCase() : null;
}

async function processManualFile(file, metadata) {
  console.log(`📝 Processing: ${file.name}`);

  try {
    // Call the existing manual processing edge function
    const { data, error } = await supabase.functions.invoke('process-manual', {
      body: {
        fileName: file.name,
        storagePath: file.name,
        metadata: {
          title: metadata.title,
          category: metadata.category,
          vehicle_models: ['Unimog'],
          year_range: { start: 1980, end: 2025 },
          language: 'en',
          priority: metadata.priority,
          source: 'AFS Safety Database',
          document_type: 'PDF'
        }
      }
    });

    if (error) {
      console.error(`❌ Error processing ${file.name}:`, error);
      return false;
    }

    console.log(`✅ Successfully processed: ${file.name}`);
    return true;
  } catch (err) {
    console.error(`❌ Exception processing ${file.name}:`, err);
    return false;
  }
}

async function main() {
  console.log('🚀 Bulk Manual Processing Script');
  console.log('================================');
  console.log('');

  // Get files from storage bucket
  const storageFiles = await listStorageBucketFiles();
  console.log(`📂 Found ${storageFiles.length} PDF files in storage bucket`);

  // Get existing manuals
  const existingManuals = await getExistingManuals();
  const existingFileNames = new Set(existingManuals.map(m => m.file_name));

  // Filter out already processed files
  const newFiles = storageFiles.filter(file => !existingFileNames.has(file.name));
  console.log(`📋 ${newFiles.length} new files to process`);

  if (newFiles.length === 0) {
    console.log('✅ No new files to process');
    return;
  }

  console.log('');
  console.log('📄 New files found:');
  newFiles.forEach(file => {
    const docId = extractDocumentId(file.name);
    const metadata = MANUAL_METADATA[docId];
    console.log(`   • ${file.name} ${metadata ? `(${metadata.title})` : '(unknown)'}`);
  });

  console.log('');
  console.log('🔄 Starting processing...');

  let processed = 0;
  let failed = 0;

  for (const file of newFiles) {
    const docId = extractDocumentId(file.name);
    const metadata = MANUAL_METADATA[docId];

    if (!metadata) {
      console.log(`⚠️  Skipping ${file.name} - no metadata found for document ID: ${docId}`);
      continue;
    }

    const success = await processManualFile(file, metadata);
    if (success) {
      processed++;
    } else {
      failed++;
    }

    // Small delay between processing
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('');
  console.log('📊 Processing Complete:');
  console.log(`   ✅ Successfully processed: ${processed} manuals`);
  console.log(`   ❌ Failed: ${failed} manuals`);
  console.log(`   📈 Total manuals in knowledge base: ${existingManuals.length + processed}`);

  if (processed > 0) {
    console.log('');
    console.log('🎯 Next Steps:');
    console.log('1. Check the admin interface to verify all manuals processed correctly');
    console.log('2. Test Barry AI with questions about the new manual content');
    console.log('3. Update the manual download progress tracker');
  }
}

// Run the script
main().catch(console.error);