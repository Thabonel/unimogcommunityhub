#!/usr/bin/env tsx

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env
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

const ILLUS_DIR = path.join(__dirname, 'output', 'ai_illustrations');
const OUTPUT_DIR = path.join(__dirname, 'output');

console.log('\n' + '='.repeat(120));
console.log('UPLOADING EXTRACTED ILLUSTRATIONS AND UPDATING DATABASE');
console.log('='.repeat(120) + '\n');

async function uploadIllustrations() {
  console.log('STAGE 1: Reading extracted illustration files...\n');

  if (!fs.existsSync(ILLUS_DIR)) {
    console.log('ERROR: Illustrations directory not found:', ILLUS_DIR);
    return 0;
  }

  const files = fs.readdirSync(ILLUS_DIR)
    .filter(f => f.endsWith('.png'))
    .sort();

  console.log(`Found ${files.length} PNG files to upload\n`);

  if (files.length === 0) {
    console.log('No PNG files found to upload');
    return 0;
  }

  let uploadedCount = 0;
  const uploadedUrls: Record<string, string> = {};

  console.log('STAGE 2: Uploading to Supabase Storage...\n');

  for (let i = 0; i < files.length; i++) {
    const fileName = files[i];
    const filePath = path.join(ILLUS_DIR, fileName);

    try {
      const fileContent = fs.readFileSync(filePath);
      const uploadPath = `rps_illustrations/${fileName}`;

      const { error } = await supabase.storage
        .from('rps_illustrations')
        .upload(uploadPath, fileContent, {
          upsert: true,
          contentType: 'image/png'
        });

      if (error) {
        console.log(`  [${i + 1}/${files.length}] ❌ ${fileName}: ${error.message}`);
      } else {
        const { data } = supabase.storage
          .from('rps_illustrations')
          .getPublicUrl(uploadPath);

        uploadedUrls[fileName] = data.publicUrl;
        uploadedCount++;

        if ((i + 1) % 10 === 0) {
          console.log(`  Progress: ${i + 1}/${files.length} uploaded...`);
        }
      }
    } catch (e) {
      console.log(`  [${i + 1}/${files.length}] ⚠️  Error with ${fileName}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  console.log(`\n✅ Uploaded ${uploadedCount} illustrations to Supabase Storage\n`);
  return uploadedCount;
}

async function linkIllustrationsToDB(uploadedCount: number) {
  if (uploadedCount === 0) {
    console.log('STAGE 3: Skipping database linking (no uploads)\n');
    return 0;
  }

  console.log('STAGE 3: Linking illustrations to database records...\n');

  try {
    // Get all illustrations without URLs
    const { data: illus, error: fetchError } = await supabase
      .from('rps_illustrations')
      .select('id, page_number')
      .is('image_url', null);

    if (fetchError) {
      console.log(`  ⚠️  Error fetching illustrations: ${fetchError.message}`);
      return 0;
    }

    if (!illus || illus.length === 0) {
      console.log('  No illustrations found to link');
      return 0;
    }

    let linkedCount = 0;

    // Try to update with extracted images
    const files = fs.readdirSync(ILLUS_DIR)
      .filter(f => f.endsWith('.png'))
      .sort();

    for (const illus_record of illus) {
      // Look for matching file by page number
      const pageStr = String(illus_record.page_number).padStart(4, '0');
      const matchingFile = files.find(f => f.includes(pageStr));

      if (matchingFile) {
        const uploadPath = `rps_illustrations/${matchingFile}`;
        const { data } = supabase.storage
          .from('rps_illustrations')
          .getPublicUrl(uploadPath);

        const { error: updateError } = await supabase
          .from('rps_illustrations')
          .update({ image_url: data.publicUrl })
          .eq('id', illus_record.id);

        if (!updateError) {
          linkedCount++;
        }
      }
    }

    console.log(`✅ Linked ${linkedCount} illustrations to database\n`);
    return linkedCount;
  } catch (e) {
    console.log(`✅ Error during linking: ${e instanceof Error ? e.message : String(e)}\n`);
    return 0;
  }
}

async function verifyResults() {
  console.log('STAGE 4: Final verification...\n');

  const { count: groups } = await supabase.from('rps_groups').select('*', { count: 'exact' });
  const { count: parts } = await supabase.from('rps_parts').select('*', { count: 'exact' });
  const { count: illus } = await supabase.from('rps_illustrations').select('*', { count: 'exact' });
  const { data: withUrls } = await supabase
    .from('rps_illustrations')
    .select('*')
    .not('image_url', 'is', null);

  console.log('Database Status:');
  console.log(`  Groups: ${groups}`);
  console.log(`  Parts: ${parts}`);
  console.log(`  Illustrations: ${illus}`);
  console.log(`  Illustrations with URLs: ${(withUrls || []).length}\n`);

  return { groups, parts, illus, withUrls: (withUrls || []).length };
}

async function runUploadPipeline() {
  try {
    console.log('Starting illustration upload and linking...\n');

    const uploadedCount = await uploadIllustrations();
    const linkedCount = await linkIllustrationsToDB(uploadedCount);
    const verification = await verifyResults();

    console.log('='.repeat(120));
    console.log('✅ UPLOAD AND LINKING COMPLETE');
    console.log('='.repeat(120));
    console.log(`\nResults:`);
    console.log(`  • ${verification.groups} groups in database`);
    console.log(`  • ${verification.parts} parts in database`);
    console.log(`  • ${verification.illus} illustrations in database`);
    console.log(`  • ${verification.withUrls} illustrations with URLs`);
    console.log(`  • ${uploadedCount} illustrations uploaded to storage\n`);

    return 0;
  } catch (error) {
    console.error('Pipeline failed:', error);
    return 1;
  }
}

runUploadPipeline().then(code => process.exit(code));
