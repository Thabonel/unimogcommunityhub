#!/usr/bin/env node

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAndApplyMigration() {
  console.log('🔍 Checking WIS content tables...\n');
  
  try {
    // Check if tables exist
    const { data: tables, error: tablesError } = await supabase
      .from('wis_procedures')
      .select('id')
      .limit(1);
    
    if (tablesError && tablesError.message.includes('does not exist')) {
      console.log('❌ WIS content tables do not exist');
      console.log('📋 Please run this migration in Supabase SQL Editor:\n');
      
      // Read migration file
      const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20240108_wis_epc_content_tables.sql');
      const migration = fs.readFileSync(migrationPath, 'utf8');
      
      // Save to convenient location
      const outputPath = path.join(__dirname, '..', 'wis-content-migration.sql');
      fs.writeFileSync(outputPath, migration);
      
      console.log('1. Go to: https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor/sql/new');
      console.log('2. Copy and paste the migration from: wis-content-migration.sql');
      console.log('3. Click "Run"');
      console.log('4. Then run: node scripts/seed-wis-sample-data.js');
      
      return false;
    } else if (tablesError) {
      console.error('❌ Error checking tables:', tablesError);
      return false;
    } else {
      console.log('✅ WIS content tables exist!');
      return true;
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return false;
  }
}

async function main() {
  const tablesExist = await checkAndApplyMigration();
  
  if (tablesExist) {
    console.log('\n✅ Tables ready! Running seed script...\n');
    // Import and run seed function
    const { default: seedModule } = await import('./seed-wis-sample-data.js');
    if (typeof seedModule === 'function') {
      await seedModule();
    }
  }
}

main();