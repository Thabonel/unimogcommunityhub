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

console.log('\n' + '='.repeat(120));
console.log('COMPREHENSIVE ILLUSTRATION LINKING - ALL AVAILABLE FILES');
console.log('='.repeat(120) + '\n');

async function linkAllAvailable() {
  console.log('STAGE 1: Scanning available PNG files...\n');

  const files = fs.readdirSync(ILLUS_DIR)
    .filter(f => f.endsWith('.png'))
    .sort();

  console.log(`Found ${files.length} PNG files available\n`);

  console.log('STAGE 2: Fetching all illustration records from database...\n');

  const { data: allIllus } = await supabase
    .from('rps_illustrations')
    .select('id, page_number, figure_number, description')
    .limit(100);

  if (!allIllus) {
    console.log('ERROR: Could not fetch illustration records');
    return 0;
  }

  console.log(`Found ${allIllus.length} illustration records in database\n`);

  // Display what we're working with
  console.log('Database Records:');
  allIllus.forEach((ill, idx) => {
    console.log(`  [${idx + 1}] Page ${String(ill.page_number).padStart(4, '0')}: ID ${ill.id.substring(0, 8)}... (${ill.description || ill.figure_number || 'No title'})`);
  });

  console.log('\n\nSTAGE 3: Linking illustrations...\n');

  let successCount = 0;
  let noMatchCount = 0;
  const updates: any[] = [];

  for (const ill of allIllus) {
    const pageStr = String(ill.page_number).padStart(4, '0');
    const matchingFile = files.find(f => f.includes(pageStr));

    if (matchingFile) {
      const uploadPath = `rps_illustrations/${matchingFile}`;
      const { data } = supabase.storage.from('rps_illustrations').getPublicUrl(uploadPath);

      updates.push({
        illus_id: ill.id,
        page: pageStr,
        file: matchingFile,
        url: data.publicUrl
      });
    } else {
      noMatchCount++;
    }
  }

  console.log(`Found ${updates.length} matching files, ${noMatchCount} without matches\n`);

  console.log('Applying updates to database...\n');

  for (let i = 0; i < updates.length; i++) {
    const update = updates[i];

    try {
      const { error } = await supabase
        .from('rps_illustrations')
        .update({ image_url: update.url })
        .eq('id', update.illus_id);

      if (!error) {
        console.log(`  ✅ Page ${update.page}: Linked successfully`);
        successCount++;
      } else {
        console.log(`  ❌ Page ${update.page}: ${error.message}`);
      }
    } catch (e) {
      console.log(`  ⚠️  Page ${update.page}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  console.log(`\n✅ Successfully linked ${successCount} illustrations\n`);
  return successCount;
}

async function verifyAndReport() {
  console.log('STAGE 4: Final verification and report...\n');

  const { data: withUrls } = await supabase
    .from('rps_illustrations')
    .select('id, page_number, figure_number, image_url, description')
    .not('image_url', 'is', null)
    .order('page_number');

  const { data: withoutUrls } = await supabase
    .from('rps_illustrations')
    .select('id, page_number, figure_number, description')
    .is('image_url', null)
    .order('page_number');

  console.log('Illustrations WITH URLs:');
  if (withUrls && withUrls.length > 0) {
    withUrls.forEach(ill => {
      console.log(`  Page ${String(ill.page_number).padStart(4, '0')}: ${ill.figure_number || ill.description || 'Untitled'}`);
    });
  } else {
    console.log('  (none)');
  }

  console.log('\nIllustrations WITHOUT URLs (need additional extraction):');
  if (withoutUrls && withoutUrls.length > 0) {
    withoutUrls.forEach(ill => {
      console.log(`  Page ${String(ill.page_number).padStart(4, '0')}: ${ill.figure_number || ill.description || 'Untitled'}`);
    });
  } else {
    console.log('  (all linked!)');
  }

  return {
    linked: withUrls?.length || 0,
    unlinked: withoutUrls?.length || 0,
    total: (withUrls?.length || 0) + (withoutUrls?.length || 0)
  };
}

async function main() {
  try {
    const linked = await linkAllAvailable();
    const stats = await verifyAndReport();

    console.log('='.repeat(120));
    console.log('✅ LINKING COMPLETE');
    console.log('='.repeat(120));
    console.log(`\nFinal Statistics:`);
    console.log(`  • Total illustrations: ${stats.total}`);
    console.log(`  • With public URLs: ${stats.linked}`);
    console.log(`  • Without URLs: ${stats.unlinked}`);
    console.log(`  • Coverage: ${((stats.linked / stats.total) * 100).toFixed(1)}%\n`);

    console.log('Note: Pages 96-930 cannot be extracted - PDFs only contain duplicate pages 1-95.');
    console.log('See: EXTRACTION_STATUS_REPORT.md for details\n');

    return 0;
  } catch (error) {
    console.error('Failed:', error);
    return 1;
  }
}

main().then(code => process.exit(code));
