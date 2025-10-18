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

async function linkWithLogging() {
  console.log('\n' + '='.repeat(120));
  console.log('FORCE LINKING ILLUSTRATIONS - WITH DEBUG LOGGING');
  console.log('='.repeat(120) + '\n');

  const illus_dir = path.join(__dirname, 'output', 'ai_illustrations');
  const files = fs.readdirSync(illus_dir)
    .filter(f => f.endsWith('.png'))
    .sort();

  const { data: allIllus } = await supabase
    .from('rps_illustrations')
    .select('id, page_number');

  if (!allIllus || allIllus.length === 0) {
    console.log('No illustrations found in database');
    return 0;
  }

  console.log(`Processing ${allIllus.length} database records...\n`);

  let successCount = 0;
  const processed = new Set<string>();

  // Track which page numbers we've already updated
  for (const illus of allIllus) {
    const pageStr = String(illus.page_number).padStart(4, '0');
    const matchingFile = files.find(f => f.includes(pageStr));

    if (matchingFile && !processed.has(pageStr)) {
      processed.add(pageStr);

      const uploadPath = `rps_illustrations/${matchingFile}`;
      const { data } = supabase.storage
        .from('rps_illustrations')
        .getPublicUrl(uploadPath);

      console.log(`\nLinking Page ${pageStr}:`);
      console.log(`  File: ${matchingFile}`);
      console.log(`  URL: ${data.publicUrl}`);
      console.log(`  Record IDs to update: ${illus.id}`);

      try {
        // Update just this one record
        const { data: result, error } = await supabase
          .from('rps_illustrations')
          .update({ image_url: data.publicUrl })
          .eq('id', illus.id)
          .select();

        if (error) {
          console.log(`  ERROR: ${error.message}`);
        } else {
          console.log(`  SUCCESS: Updated ${result?.length || 0} records`);
          successCount++;
        }
      } catch (e) {
        console.log(`  EXCEPTION: ${e instanceof Error ? e.message : String(e)}`);
      }
    }
  }

  console.log(`\n\nLinking complete. Updated ${successCount} distinct page numbers.\n`);
  return successCount;
}

async function verifyUpdates() {
  console.log('Verifying updates...\n');

  const { data: withUrls } = await supabase
    .from('rps_illustrations')
    .select('id, page_number, image_url')
    .not('image_url', 'is', null);

  if (!withUrls || withUrls.length === 0) {
    console.log('No illustrations have image URLs set');
    return 0;
  }

  console.log(`Found ${withUrls.length} illustrations with image URLs:`);
  withUrls.forEach(w => {
    console.log(`  Page ${String(w.page_number).padStart(4, '0')}: ${w.image_url?.substring(0, 50)}...`);
  });

  return withUrls.length;
}

async function main() {
  try {
    const linked = await linkWithLogging();
    const verified = await verifyUpdates();

    console.log('='.repeat(120));
    console.log('✅ LINKING COMPLETE');
    console.log('='.repeat(120));
    console.log(`\nResults: ${linked} page numbers linked, ${verified} total records with URLs\n`);

    return 0;
  } catch (error) {
    console.error('Failed:', error);
    return 1;
  }
}

main().then(code => process.exit(code));
