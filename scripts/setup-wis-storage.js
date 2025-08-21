#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

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

async function createStorageBucket() {
  console.log('🔧 Creating wis-manuals storage bucket...');
  
  // Create the bucket
  const { data: bucket, error: bucketError } = await supabase.storage.createBucket('wis-manuals', {
    public: true,
    fileSizeLimit: 52428800, // 50MB
    allowedMimeTypes: ['text/html', 'application/json', 'application/pdf', 'image/*']
  });

  if (bucketError) {
    if (bucketError.message.includes('already exists')) {
      console.log('✅ Bucket already exists');
    } else {
      console.error('❌ Error creating bucket:', bucketError.message);
      return false;
    }
  } else {
    console.log('✅ Storage bucket created successfully');
  }

  return true;
}

async function uploadSampleFiles() {
  console.log('\n📤 Uploading sample files from external drive...');
  
  const files = [
    {
      localPath: '/Volumes/UnimogManuals/wis-ready-to-upload/bulletins/tsb_2020_001_portal_axle.html',
      storagePath: 'bulletins/tsb_2020_001_portal_axle.html',
      contentType: 'text/html'
    },
    {
      localPath: '/Volumes/UnimogManuals/wis-ready-to-upload/manuals/unimog_400_oil_change.html',
      storagePath: 'manuals/unimog_400_oil_change.html',
      contentType: 'text/html'
    },
    {
      localPath: '/Volumes/UnimogManuals/wis-ready-to-upload/parts/unimog_portal_axle_parts.json',
      storagePath: 'parts/unimog_portal_axle_parts.json',
      contentType: 'application/json'
    }
  ];

  for (const file of files) {
    try {
      // Check if file exists
      if (!fs.existsSync(file.localPath)) {
        console.log(`⚠️  File not found: ${file.localPath}`);
        continue;
      }

      // Read file
      const fileContent = fs.readFileSync(file.localPath);
      
      // Upload to Supabase
      const { data, error } = await supabase.storage
        .from('wis-manuals')
        .upload(file.storagePath, fileContent, {
          contentType: file.contentType,
          upsert: true
        });

      if (error) {
        console.error(`❌ Error uploading ${file.storagePath}:`, error.message);
      } else {
        console.log(`✅ Uploaded: ${file.storagePath}`);
        
        // Get public URL
        const { data: urlData } = supabase.storage
          .from('wis-manuals')
          .getPublicUrl(file.storagePath);
        
        console.log(`   URL: ${urlData.publicUrl}`);
      }
    } catch (err) {
      console.error(`❌ Error processing ${file.localPath}:`, err.message);
    }
  }
}

async function insertSampleData() {
  console.log('\n📝 Inserting sample data into database...');

  // Insert sample vehicles
  const vehicles = [
    {
      model_code: 'U400',
      model_name: 'Unimog 400',
      year_from: 2000,
      year_to: 2013,
      engine_options: { engines: ['OM904LA', 'OM906LA'] },
      specifications: { 
        wheelbase: '2900mm',
        gvw: '7490kg',
        payload: '3500kg'
      }
    },
    {
      model_code: 'U500',
      model_name: 'Unimog 500',
      year_from: 2013,
      year_to: 2023,
      engine_options: { engines: ['OM934LA', 'OM936LA'] },
      specifications: {
        wheelbase: '3350mm',
        gvw: '14500kg',
        payload: '8500kg'
      }
    },
    {
      model_code: 'U5000',
      model_name: 'Unimog 5000',
      year_from: 2002,
      year_to: 2015,
      engine_options: { engines: ['OM924LA', 'OM926LA'] },
      specifications: {
        wheelbase: '3850mm',
        gvw: '14000kg',
        payload: '8000kg'
      }
    }
  ];

  for (const vehicle of vehicles) {
    const { error } = await supabase
      .from('wis_models')
      .upsert(vehicle, { onConflict: 'model_code' });
    
    if (error) {
      console.error(`❌ Error inserting vehicle ${vehicle.model_name}:`, error.message);
    } else {
      console.log(`✅ Inserted vehicle: ${vehicle.model_name}`);
    }
  }

  // Insert sample procedure
  const procedure = {
    procedure_code: 'PROC-001',
    title: 'Engine Oil and Filter Change - Unimog 400',
    model: 'Unimog 400',
    system: 'Engine',
    subsystem: 'Lubrication',
    content: 'Complete procedure for changing engine oil and filter on Unimog 400 series',
    tools_required: ['Oil drain pan', 'Filter wrench', 'Socket set'],
    parts_required: ['Engine oil 15W-40', 'Oil filter A 000 180 06 09'],
    safety_warnings: ['Engine must be warm but not hot', 'Use jack stands'],
    time_estimate: 45,
    difficulty: 'easy'
  };

  const { error: procError } = await supabase
    .from('wis_procedures')
    .upsert(procedure, { onConflict: 'procedure_code' });

  if (procError) {
    console.error('❌ Error inserting procedure:', procError.message);
  } else {
    console.log('✅ Inserted sample procedure');
  }

  // Parse and insert parts from JSON file
  try {
    const partsFile = '/Volumes/UnimogManuals/wis-ready-to-upload/parts/unimog_portal_axle_parts.json';
    if (fs.existsSync(partsFile)) {
      const partsData = JSON.parse(fs.readFileSync(partsFile, 'utf8'));
      
      for (const part of partsData.parts) {
        const partRecord = {
          part_number: part.number,
          description: part.description,
          category: partsData.category,
          models: ['U400', 'U500'],
          superseded_by: part.superseded_by,
          price: part.price,
          availability: part.quantity > 0 ? 'In Stock' : 'Out of Stock',
          specifications: { notes: part.notes }
        };

        const { error } = await supabase
          .from('wis_parts')
          .upsert(partRecord, { onConflict: 'part_number' });

        if (error) {
          console.error(`❌ Error inserting part ${part.number}:`, error.message);
        } else {
          console.log(`✅ Inserted part: ${part.number}`);
        }
      }
    }
  } catch (err) {
    console.error('❌ Error processing parts:', err.message);
  }

  // Insert sample bulletin
  const bulletin = {
    bulletin_number: 'TSB-2020-001',
    title: 'Portal Axle Seal Replacement Procedure',
    models_affected: ['Unimog 400', 'Unimog 500'],
    issue_date: '2020-03-15',
    category: 'Drivetrain',
    content: 'Updated procedure for portal axle seal replacement to address premature wear',
    priority: 'recommended'
  };

  const { error: bulletinError } = await supabase
    .from('wis_bulletins')
    .upsert(bulletin, { onConflict: 'bulletin_number' });

  if (bulletinError) {
    console.error('❌ Error inserting bulletin:', bulletinError.message);
  } else {
    console.log('✅ Inserted sample bulletin');
  }
}

async function main() {
  console.log('🚀 Setting up WIS Storage and Data\n');
  
  // Create bucket
  const bucketCreated = await createStorageBucket();
  if (!bucketCreated) {
    console.error('❌ Failed to create storage bucket');
    process.exit(1);
  }

  // Upload files
  await uploadSampleFiles();

  // Insert sample data
  await insertSampleData();

  console.log('\n✨ WIS setup complete!');
  console.log('📍 Test at: http://localhost:5173/knowledge/wis');
}

main().catch(console.error);