#!/usr/bin/env tsx

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function runMigration() {
  console.log('Running schema migration...\n');

  const migrationPath = path.join(__dirname, '..', '..', 'supabase', 'migrations', '20251018_fix_rps_schema_constraints.sql');
  const migration = fs.readFileSync(migrationPath, 'utf-8');

  const statements = migration.split(';').filter(stmt => stmt.trim() && !stmt.trim().startsWith('--'));

  let successCount = 0;
  for (const statement of statements) {
    try {
      const { error } = await supabase.rpc('exec', { sql_query: statement + ';' });
      if (error) {
        console.error(`Error executing statement: ${error.message}`);
      } else {
        successCount++;
      }
    } catch (e) {
      console.error(`Error: ${e.message}`);
    }
  }

  console.log(`\nSchema migration completed: ${successCount}/${statements.length} statements executed`);
}

runMigration()
  .then(() => {
    console.log('Migration successful!');
    process.exit(0);
  })
  .catch(error => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
