#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

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

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

console.log('\n' + '='.repeat(100));
console.log('APPLYING RPS_ILLUSTRATIONS SCHEMA MIGRATION');
console.log('='.repeat(100) + '\n');

// Create client with service role for admin access
const supabase = createClient(supabaseUrl, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  }
});

async function applyMigration() {
  console.log('Step 1: Checking current table structure...\n');

  try {
    // Check current columns
    const { data: columns, error: checkError } = await supabase.rpc('query', {
      query: `SELECT column_name, data_type FROM information_schema.columns
              WHERE table_name = 'rps_illustrations' ORDER BY ordinal_position`
    });

    if (columns) {
      console.log('Current columns:');
      console.log(JSON.stringify(columns, null, 2));
    }

    if (checkError && !checkError.message.includes('does not exist')) {
      console.log('Check error:', checkError.message);
    }
  } catch (e) {
    console.log('(Cannot check schema via RPC)\n');
  }

  console.log('\nStep 2: Adding image_url column...\n');

  try {
    // First, try using the standard async approach with direct SQL
    const { data, error } = await supabase.rpc('exec_sql', {
      sql_string: 'ALTER TABLE rps_illustrations ADD COLUMN IF NOT EXISTS image_url TEXT;'
    });

    if (!error) {
      console.log('✅ Column added successfully\n');
    } else if (error.message.includes('does not exist')) {
      console.log('RPC function not available, using alternative approach...\n');

      // Try using a transaction-like approach
      const { error: e2 } = await supabase.from('rps_illustrations').select('id').limit(1);

      if (!e2) {
        console.log('Table is accessible. Column likely added or already exists.\n');
      }
    } else {
      console.log('Error:', error.message, '\n');
    }
  } catch (e) {
    console.log('Exception:', e instanceof Error ? e.message : String(e), '\n');
  }

  console.log('Step 3: Verifying column exists...\n');

  try {
    // Try to select the column
    const { data: testSelect, error: testError } = await supabase
      .from('rps_illustrations')
      .select('id, image_url')
      .limit(1);

    if (!testError) {
      console.log('✅ image_url column confirmed to exist!');
      console.log(`   Sample record has image_url field\n`);
      return true;
    } else if (testError.message.includes('image_url')) {
      console.log('⚠️  Column still does not exist: ${testError.message}\n');
      return false;
    } else {
      console.log('Other error:', testError.message, '\n');
      return false;
    }
  } catch (e) {
    console.log('Verification exception:', e instanceof Error ? e.message : String(e), '\n');
    return false;
  }
}

async function linkIllustrations() {
  console.log('Step 4: Linking illustrations to database...\n');

  const illus_dir = path.join(__dirname, 'output', 'ai_illustrations');
  const files = fs.readdirSync(illus_dir).filter(f => f.endsWith('.png')).sort();

  const { data: allIllus } = await supabase
    .from('rps_illustrations')
    .select('id, page_number')
    .limit(16);

  if (!allIllus) {
    console.log('Cannot fetch illustrations');
    return 0;
  }

  let linked = 0;
  const processed = new Set<string>();

  for (const illus of allIllus) {
    const pageStr = String(illus.page_number).padStart(4, '0');

    if (!processed.has(pageStr)) {
      processed.add(pageStr);

      const matchingFile = files.find(f => f.includes(pageStr));
      if (matchingFile) {
        const uploadPath = `rps_illustrations/${matchingFile}`;
        const { data } = supabase.storage.from('rps_illustrations').getPublicUrl(uploadPath);

        const { error } = await supabase
          .from('rps_illustrations')
          .update({ image_url: data.publicUrl })
          .eq('id', illus.id);

        if (!error) {
          console.log(`  ✅ Page ${pageStr}: Linked successfully`);
          linked++;
        } else {
          console.log(`  ❌ Page ${pageStr}: ${error.message}`);
        }
      }
    }
  }

  console.log(`\n✅ Linked ${linked} illustrations\n`);
  return linked;
}

async function verify() {
  console.log('Step 5: Final verification...\n');

  const { count } = await supabase
    .from('rps_illustrations')
    .select('*', { count: 'exact' })
    .not('image_url', 'is', null);

  console.log(`Illustrations with image URLs: ${count}\n`);
  return count || 0;
}

async function main() {
  try {
    const migrationOk = await applyMigration();

    if (migrationOk) {
      const linked = await linkIllustrations();
      const withUrls = await verify();

      console.log('='.repeat(100));
      console.log('✅ MIGRATION AND LINKING COMPLETE');
      console.log('='.repeat(100));
      console.log(`\nResults: ${linked} linked, ${withUrls} total with URLs\n`);
      return 0;
    } else {
      console.log('='.repeat(100));
      console.log('⚠️  MIGRATION VERIFICATION FAILED');
      console.log('='.repeat(100));
      console.log('\nThe image_url column could not be verified.');
      console.log('Please apply the migration manually:');
      console.log('1. Go to Supabase Dashboard SQL Editor');
      console.log('2. Execute: /supabase/migrations/20251018_add_image_url_to_rps_illustrations.sql');
      console.log('3. Re-run this script\n');
      return 1;
    }
  } catch (error) {
    console.error('Failed:', error);
    return 1;
  }
}

main().then(code => process.exit(code));
