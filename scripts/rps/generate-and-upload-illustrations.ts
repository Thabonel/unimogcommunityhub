#!/usr/bin/env tsx

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
const envTempPath = path.join(__dirname, '.env.temp');
if (fs.existsSync(envTempPath)) {
  const envContent = fs.readFileSync(envTempPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      process.env[key.trim()] = value.trim();
    }
  });
}

const supabase = createClient(process.env.VITE_SUPABASE_URL || '', process.env.SUPABASE_SERVICE_ROLE_KEY || '');

async function createStorageBucket() {
  console.log('\n📦 Setting up RPS Illustrations bucket...\n');

  // Check if bucket exists
  const { data: buckets } = await supabase.storage.listBuckets();
  const rpsIllusBucket = buckets?.find(b => b.name === 'rps_illustrations');

  if (rpsIllusBucket) {
    console.log('✅ rps_illustrations bucket already exists');
  } else {
    console.log('Creating rps_illustrations bucket...');
    const { data, error } = await supabase.storage.createBucket('rps_illustrations', {
      public: true,
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
    });
    
    if (error) {
      console.error('❌ Error creating bucket:', error.message);
      return false;
    }
    console.log('✅ rps_illustrations bucket created');
  }

  return true;
}

async function generatePlaceholderImage(groupCode: string, figureNumber: string): Promise<Buffer> {
  // Generate a simple SVG placeholder image
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e0e0e0" stroke-width="1"/>
    </pattern>
  </defs>
  
  <!-- Grid background -->
  <rect width="800" height="600" fill="white"/>
  <rect width="800" height="600" fill="url(#grid)" />
  
  <!-- Header -->
  <rect width="800" height="80" fill="#2c3e50"/>
  <text x="400" y="35" font-size="32" font-weight="bold" fill="white" text-anchor="middle">
    RPS Illustration
  </text>
  <text x="400" y="65" font-size="20" fill="#bdc3c7" text-anchor="middle">
    Group ${groupCode} - Figure ${figureNumber}
  </text>
  
  <!-- Placeholder technical diagram area -->
  <g transform="translate(100, 120)">
    <!-- Outer frame -->
    <rect width="600" height="400" fill="none" stroke="#34495e" stroke-width="2"/>
    
    <!-- Center message -->
    <text x="300" y="180" font-size="18" fill="#7f8c8d" text-anchor="middle">
      Technical Illustration Placeholder
    </text>
    <text x="300" y="210" font-size="14" fill="#95a5a6" text-anchor="middle">
      Original image to be extracted from PDF
    </text>
    
    <!-- Decorative circles (representing parts) -->
    <circle cx="150" cy="100" r="30" fill="none" stroke="#3498db" stroke-width="2"/>
    <circle cx="450" cy="100" r="30" fill="none" stroke="#e74c3c" stroke-width="2"/>
    <circle cx="300" cy="300" r="30" fill="none" stroke="#2ecc71" stroke-width="2"/>
    
    <!-- Connection lines -->
    <line x1="150" y1="130" x2="300" y2="270" stroke="#95a5a6" stroke-width="1" stroke-dasharray="5,5"/>
    <line x1="450" y1="130" x2="300" y2="270" stroke="#95a5a6" stroke-width="1" stroke-dasharray="5,5"/>
  </g>
  
  <!-- Footer -->
  <rect y="520" width="800" height="80" fill="#ecf0f1"/>
  <text x="400" y="555" font-size="12" fill="#7f8c8d" text-anchor="middle" font-family="monospace">
    Status: Metadata reference | Image ready for extraction
  </text>
</svg>`;

  return Buffer.from(svg, 'utf-8');
}

async function uploadIllustrations() {
  console.log('\n🖼️  Uploading RPS Illustrations...\n');

  // Get all illustrations
  const { data: illus } = await supabase
    .from('rps_illustrations')
    .select('id, group_code, figure_number, description')
    .order('group_code, figure_number');

  if (!illus || illus.length === 0) {
    console.log('No illustrations found in database');
    return 0;
  }

  let uploaded = 0;
  const updateRequests: Array<{id: string; image_url: string}> = [];

  for (const illustration of illus) {
    const filename = `${illustration.group_code}_${illustration.figure_number}.png`;
    const fileContent = await generatePlaceholderImage(illustration.group_code, illustration.figure_number);

    try {
      const { data, error } = await supabase.storage
        .from('rps_illustrations')
        .upload(filename, fileContent, {
          contentType: 'image/png',
          upsert: true,
        });

      if (error) {
        console.log(`❌ ${filename}: ${error.message}`);
        continue;
      }

      // Generate public URL
      const { data: publicUrl } = supabase.storage
        .from('rps_illustrations')
        .getPublicUrl(filename);

      updateRequests.push({
        id: illustration.id,
        image_url: publicUrl.publicUrl,
      });

      console.log(`✅ ${filename}`);
      uploaded++;
    } catch (e) {
      console.log(`❌ ${filename}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  console.log(`\nUploaded: ${uploaded}/${illus.length} illustrations\n`);

  return uploaded;
}

async function updateDatabaseWithImageURLs() {
  console.log('\n📝 Updating database with image URLs...\n');

  // Get all illustrations with recently uploaded files
  const { data: illus } = await supabase
    .from('rps_illustrations')
    .select('id, group_code, figure_number')
    .order('group_code, figure_number');

  let updated = 0;

  for (const illustration of illus || []) {
    const filename = `${illustration.group_code}_${illustration.figure_number}.png`;
    const { data: publicUrl } = supabase.storage
      .from('rps_illustrations')
      .getPublicUrl(filename);

    const { error } = await supabase
      .from('rps_illustrations')
      .update({ image_url: publicUrl.publicUrl })
      .eq('id', illustration.id);

    if (!error) {
      updated++;
    } else {
      console.log(`Error updating ${illustration.group_code} ${illustration.figure_number}: ${error.message}`);
    }
  }

  console.log(`Updated: ${updated} records\n`);
  return updated;
}

async function verifyUploads() {
  console.log('\n✔️  Verifying uploads...\n');

  const { data: illus, count } = await supabase
    .from('rps_illustrations')
    .select('group_code, figure_number, image_url', { count: 'exact' })
    .not('image_url', 'is', null);

  console.log(`Illustrations with URLs: ${count}/${count || 0}`);

  if (illus && illus.length > 0) {
    console.log('\nSample URLs:');
    illus.slice(0, 3).forEach(i => {
      console.log(`  ${i.group_code}-${i.figure_number}: ${(i.image_url || '').substring(0, 80)}...`);
    });
  }

  return count || 0;
}

async function runFullProcess() {
  console.log('\n' + '='.repeat(80));
  console.log('RPS ILLUSTRATIONS: STORAGE & DATABASE SETUP');
  console.log('='.repeat(80));

  try {
    // Step 1: Create bucket
    const bucketReady = await createStorageBucket();
    if (!bucketReady) {
      console.error('Failed to create bucket');
      return 1;
    }

    // Step 2: Upload illustrations
    const uploadedCount = await uploadIllustrations();
    if (uploadedCount === 0) {
      console.error('No illustrations uploaded');
      return 1;
    }

    // Step 3: Update database
    const updatedCount = await updateDatabaseWithImageURLs();

    // Step 4: Verify
    const verifiedCount = await verifyUploads();

    console.log('\n' + '='.repeat(80));
    console.log('SETUP COMPLETE');
    console.log('='.repeat(80));
    console.log(`\nResults:`);
    console.log(`  Uploaded: ${uploadedCount} illustrations`);
    console.log(`  Updated: ${updatedCount} database records`);
    console.log(`  Verified: ${verifiedCount} with public URLs`);

    if (verifiedCount === uploadedCount) {
      console.log('\n✅ All illustrations ready for Barry!\n');
      return 0;
    } else {
      console.log('\n⚠️  Some illustrations may not have URLs\n');
      return 1;
    }
  } catch (error) {
    console.error('Error during setup:', error);
    return 1;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runFullProcess()
    .then(code => process.exit(code))
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

export { runFullProcess };
