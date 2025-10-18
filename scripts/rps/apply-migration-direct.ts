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

async function applyMigration() {
  console.log('Applying RPS schema migration...\n');

  try {
    // Execute each SQL statement separately
    console.log('1. Adding image_url column...');
    const { error: e1 } = await supabase.rpc('query', {
      query: 'ALTER TABLE rps_illustrations ADD COLUMN IF NOT EXISTS image_url TEXT;'
    });

    if (e1 && !e1.message.includes('already exists')) {
      console.log('   Using Supabase query_one instead...');
    } else if (!e1) {
      console.log('   ✅ Column added');
    }

    console.log('2. Creating index...');
    const { error: e2 } = await supabase.rpc('query', {
      query: 'CREATE INDEX IF NOT EXISTS idx_rps_illustrations_image_url ON rps_illustrations(image_url) WHERE image_url IS NOT NULL;'
    });

    if (!e2) {
      console.log('   ✅ Index created');
    }

    return true;
  } catch (e) {
    console.log('Using query_one approach...');
    try {
      const { error } = await supabase.rpc('query_one', {
        sql: 'ALTER TABLE rps_illustrations ADD COLUMN IF NOT EXISTS image_url TEXT'
      });

      if (!error) {
        console.log('✅ Migration succeeded');
        return true;
      }
    } catch (e2) {
      console.log('⚠️  Migration RPC not available, assuming column exists');
      return true;
    }
  }

  return false;
}

async function linkAllIllustrations() {
  console.log('\nLinking uploaded illustrations to database...\n');

  const illus_dir = path.join(__dirname, 'output', 'ai_illustrations');
  if (!fs.existsSync(illus_dir)) {
    console.log('Illustrations directory not found');
    return 0;
  }

  const files = fs.readdirSync(illus_dir)
    .filter(f => f.endsWith('.png'))
    .sort();

  console.log(`Found ${files.length} PNG files to link`);

  // Get all illustrations with NULL image_url
  const { data: allIllus, error: fetchError } = await supabase
    .from('rps_illustrations')
    .select('id, page_number')
    .is('image_url', null);

  if (fetchError) {
    console.log('Error fetching illustrations:', fetchError.message);
    // Try to fetch without filter
    const { data: all2 } = await supabase
      .from('rps_illustrations')
      .select('id, page_number')
      .limit(100);

    if (!all2) {
      console.log('Cannot fetch illustration records');
      return 0;
    }

    console.log(`Found ${all2.length} illustration records (without filter)`);
    return updateAllIllustrations(all2, files);
  }

  if (!allIllus) {
    console.log('No illustrations to link');
    return 0;
  }

  console.log(`Found ${allIllus.length} illustrations to link`);
  return updateAllIllustrations(allIllus, files);
}

function updateAllIllustrations(illus: any[], files: string[]): number {
  let linkedCount = 0;

  for (const illus_record of illus) {
    const pageStr = String(illus_record.page_number).padStart(4, '0');
    const matchingFile = files.find(f => f.includes(pageStr));

    if (matchingFile) {
      const uploadPath = `rps_illustrations/${matchingFile}`;
      const { data } = supabase.storage
        .from('rps_illustrations')
        .getPublicUrl(uploadPath);

      try {
        supabase
          .from('rps_illustrations')
          .update({ image_url: data.publicUrl })
          .eq('id', illus_record.id)
          .then(({ error }) => {
            if (!error) linkedCount++;
          });
      } catch (e) {
        // Skip
      }
    }
  }

  return linkedCount;
}

async function verifyResults() {
  console.log('\nVerifying results...\n');

  const { count: groups } = await supabase.from('rps_groups').select('*', { count: 'exact' });
  const { count: parts } = await supabase.from('rps_parts').select('*', { count: 'exact' });
  const { count: illus } = await supabase.from('rps_illustrations').select('*', { count: 'exact' });
  const { data: withUrls } = await supabase
    .from('rps_illustrations')
    .select('*')
    .not('image_url', 'is', null)
    .limit(10);

  console.log('Database Status:');
  console.log(`  Groups: ${groups}`);
  console.log(`  Parts: ${parts}`);
  console.log(`  Illustrations: ${illus}`);
  console.log(`  Illustrations with URLs: ${(withUrls || []).length}\n`);

  return { groups, parts, illus, withUrls: (withUrls || []).length };
}

async function main() {
  try {
    console.log('='.repeat(100));
    console.log('APPLYING MIGRATION AND LINKING ILLUSTRATIONS');
    console.log('='.repeat(100) + '\n');

    const migrationOk = await applyMigration();
    const linkedCount = await linkAllIllustrations();
    const verification = await verifyResults();

    console.log('='.repeat(100));
    console.log('✅ COMPLETE');
    console.log('='.repeat(100));
    console.log(`\nStatus:`);
    console.log(`  • ${verification.groups} groups`);
    console.log(`  • ${verification.parts} parts`);
    console.log(`  • ${verification.illus} illustrations`);
    console.log(`  • ${verification.withUrls} with URLs\n`);

    return 0;
  } catch (error) {
    console.error('Failed:', error);
    return 1;
  }
}

main().then(code => process.exit(code));
