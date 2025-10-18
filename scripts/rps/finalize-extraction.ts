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

async function linkUploadedIllustrations() {
  console.log('\n' + '='.repeat(120));
  console.log('FINALIZING RPS EXTRACTION - LINKING UPLOADED ILLUSTRATIONS');
  console.log('='.repeat(120) + '\n');

  console.log('STAGE 1: Reading uploaded PNG files...\n');

  const illus_dir = path.join(__dirname, 'output', 'ai_illustrations');
  if (!fs.existsSync(illus_dir)) {
    console.log('ERROR: Illustrations directory not found');
    return 0;
  }

  const files = fs.readdirSync(illus_dir)
    .filter(f => f.endsWith('.png'))
    .sort();

  console.log(`Found ${files.length} PNG files\n`);

  if (files.length === 0) {
    console.log('No PNG files to link');
    return 0;
  }

  console.log('STAGE 2: Fetching illustration records from database...\n');

  // Fetch all illustrations
  const { data: allIllus, error: fetchError } = await supabase
    .from('rps_illustrations')
    .select('id, page_number')
    .limit(1000);

  if (fetchError || !allIllus) {
    console.log(`ERROR: ${fetchError?.message || 'Could not fetch illustrations'}`);
    return 0;
  }

  console.log(`Found ${allIllus.length} illustration records\n`);

  console.log('STAGE 3: Creating illustration URL mapping...\n');

  const urlMap: Record<string, string> = {};

  for (const illus of allIllus) {
    const pageStr = String(illus.page_number).padStart(4, '0');
    const matchingFile = files.find(f => f.includes(pageStr));

    if (matchingFile) {
      const uploadPath = `rps_illustrations/${matchingFile}`;
      const { data } = supabase.storage
        .from('rps_illustrations')
        .getPublicUrl(uploadPath);

      urlMap[illus.id] = data.publicUrl;
    }
  }

  console.log(`Mapped ${Object.keys(urlMap).length} illustrations to URLs\n`);

  console.log('STAGE 4: Updating database with image URLs...\n');

  let updateCount = 0;
  const illustrationIds = Object.keys(urlMap);

  for (let i = 0; i < illustrationIds.length; i++) {
    const illustId = illustrationIds[i];
    const imageUrl = urlMap[illustId];

    try {
      const { error: updateError } = await supabase
        .from('rps_illustrations')
        .update({ image_url: imageUrl })
        .eq('id', illustId);

      if (!updateError) {
        updateCount++;

        if ((i + 1) % 10 === 0) {
          console.log(`  Progress: ${i + 1}/${illustrationIds.length} updated...`);
        }
      }
    } catch (e) {
      // Continue
    }
  }

  console.log(`\n✅ Updated ${updateCount} illustration records with URLs\n`);
  return updateCount;
}

async function verifyResults() {
  console.log('STAGE 5: Final verification...\n');

  const { count: groups } = await supabase.from('rps_groups').select('*', { count: 'exact' });
  const { count: parts } = await supabase.from('rps_parts').select('*', { count: 'exact' });
  const { count: illus } = await supabase.from('rps_illustrations').select('*', { count: 'exact' });

  // Count records with image URLs
  const { data: withUrls } = await supabase
    .from('rps_illustrations')
    .select('id')
    .not('image_url', 'is', null);

  const urlCount = (withUrls || []).length;

  console.log('Database Final Status:');
  console.log(`  Groups: ${groups}`);
  console.log(`  Parts: ${parts}`);
  console.log(`  Illustrations: ${illus}`);
  console.log(`  Illustrations with URLs: ${urlCount}\n`);

  return { groups, parts, illus, withUrls: urlCount };
}

async function main() {
  try {
    const linkedCount = await linkUploadedIllustrations();
    const verification = await verifyResults();

    console.log('='.repeat(120));
    console.log('✅ RPS EXTRACTION FINALIZATION COMPLETE');
    console.log('='.repeat(120));
    console.log(`\nFinal Results:`);
    console.log(`  • ${verification.groups} groups in database`);
    console.log(`  • ${verification.parts} parts in database`);
    console.log(`  • ${verification.illus} illustrations in database`);
    console.log(`  • ${verification.withUrls} illustrations with public URLs`);
    console.log(`  • ${linkedCount} illustrations linked in this session\n`);

    console.log('Next Steps:');
    console.log('  1. Run Barry integration tests');
    console.log('  2. Verify illustration links work');
    console.log('  3. Commit changes to git');
    console.log('  4. Deploy to staging\n');

    return 0;
  } catch (error) {
    console.error('Failed:', error);
    return 1;
  }
}

main().then(code => process.exit(code));
