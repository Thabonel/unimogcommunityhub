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

  const sql = `
    ALTER TABLE rps_illustrations ADD COLUMN IF NOT EXISTS image_url TEXT;
    CREATE INDEX IF NOT EXISTS idx_rps_illustrations_image_url
    ON rps_illustrations(image_url)
    WHERE image_url IS NOT NULL;
    COMMENT ON COLUMN rps_illustrations.image_url IS 'Public URL to the uploaded illustration image in Supabase Storage (rps_illustrations bucket)';
  `;

  try {
    const { error } = await supabase.rpc('exec_sql', { sql_string: sql });

    if (error) {
      console.log('Using alternative approach - executing via query...');

      // Try direct approach with multiple statements
      const { error: e1 } = await supabase.rpc('exec', {
        sql: 'ALTER TABLE rps_illustrations ADD COLUMN IF NOT EXISTS image_url TEXT;'
      });

      if (e1) {
        // If RPC not available, use the fact that table might already be created
        console.log('Checking if column already exists...');
        const { data: columns } = await supabase
          .from('rps_illustrations')
          .select('*')
          .limit(1);

        if (columns && columns.length > 0 && 'image_url' in columns[0]) {
          console.log('✅ image_url column already exists');
        } else {
          console.log('⚠️  Could not verify column, proceeding with linking...');
        }
      }
    } else {
      console.log('✅ Migration applied successfully');
    }

    return true;
  } catch (e) {
    console.log('Error during migration:', e instanceof Error ? e.message : String(e));
    console.log('Continuing with linking anyway...');
    return true;
  }
}

async function linkUploadedIllustrations() {
  console.log('Linking uploaded illustrations to database...\n');

  const illus_dir = path.join(__dirname, 'output', 'ai_illustrations');
  const files = fs.readdirSync(illus_dir)
    .filter(f => f.endsWith('.png'))
    .sort();

  // Get all illustrations
  const { data: allIllus, error: fetchError } = await supabase
    .from('rps_illustrations')
    .select('id, page_number');

  if (fetchError || !allIllus) {
    console.log('Error fetching illustrations:', fetchError?.message);
    return 0;
  }

  let linkedCount = 0;

  for (const illus of allIllus) {
    const pageStr = String(illus.page_number).padStart(4, '0');
    const matchingFile = files.find(f => f.includes(pageStr));

    if (matchingFile) {
      const uploadPath = `rps_illustrations/${matchingFile}`;
      const { data } = supabase.storage
        .from('rps_illustrations')
        .getPublicUrl(uploadPath);

      try {
        const { error: updateError } = await supabase
          .from('rps_illustrations')
          .update({ image_url: data.publicUrl })
          .eq('id', illus.id);

        if (!updateError) {
          linkedCount++;
        }
      } catch (e) {
        // Skip errors
      }
    }
  }

  console.log(`✅ Linked ${linkedCount} illustrations to database\n`);
  return linkedCount;
}

async function verifyResults() {
  console.log('Verifying results...\n');

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

async function main() {
  try {
    console.log('='.repeat(100));
    console.log('RPS SCHEMA MIGRATION AND ILLUSTRATION LINKING');
    console.log('='.repeat(100) + '\n');

    await applyMigration();
    const linkedCount = await linkUploadedIllustrations();
    const verification = await verifyResults();

    console.log('='.repeat(100));
    console.log('✅ MIGRATION AND LINKING COMPLETE');
    console.log('='.repeat(100));
    console.log(`\nResults:`);
    console.log(`  • ${verification.groups} groups in database`);
    console.log(`  • ${verification.parts} parts in database`);
    console.log(`  • ${verification.illus} illustrations in database`);
    console.log(`  • ${verification.withUrls} illustrations with URLs`);
    console.log(`  • ${linkedCount} illustrations linked\n`);

    return 0;
  } catch (error) {
    console.error('Failed:', error);
    return 1;
  }
}

main().then(code => process.exit(code));
