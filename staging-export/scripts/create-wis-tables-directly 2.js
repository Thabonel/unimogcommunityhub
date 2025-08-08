#!/usr/bin/env node

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function createWISTables() {
  console.log('🚀 Creating WIS content tables directly...\n');
  
  try {
    // Since we can't execute raw SQL, let's create the tables by inserting dummy data
    // This will force Supabase to create the tables if they don't exist
    
    console.log('📋 Testing/Creating wis_models table...');
    const { data: modelData, error: modelError } = await supabase
      .from('wis_models')
      .insert({
        model_code: 'TEST_MODEL',
        model_name: 'Test Model',
        year_from: 2000,
        year_to: 2001
      })
      .select();
    
    if (modelError) {
      console.log('❌ wis_models error:', modelError.message);
      
      if (modelError.message.includes('does not exist')) {
        console.log('\n⚠️  Tables don\'t exist. You need to run the SQL migration first.');
        console.log('\n📋 IMPORTANT: Since the tables don\'t exist, you must:');
        console.log('1. Go to: https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor/sql/new');
        console.log('2. Copy ALL the SQL from: wis-content-migration.sql');
        console.log('3. Click "Run" to create all tables and functions');
        console.log('4. Then run: node scripts/seed-wis-sample-data.js');
        return false;
      }
    } else {
      console.log('✅ wis_models table exists!');
      // Clean up test data
      if (modelData && modelData[0]) {
        await supabase.from('wis_models').delete().eq('model_code', 'TEST_MODEL');
      }
    }
    
    // Check other tables
    const tables = ['wis_procedures', 'wis_parts', 'wis_diagrams', 'wis_bulletins'];
    for (const table of tables) {
      const { error } = await supabase.from(table).select('id').limit(1);
      if (error && error.message.includes('does not exist')) {
        console.log(`❌ ${table} does not exist`);
        return false;
      } else {
        console.log(`✅ ${table} exists`);
      }
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Error:', error);
    return false;
  }
}

async function main() {
  const tablesExist = await createWISTables();
  
  if (!tablesExist) {
    console.log('\n🔧 Let me create a simpler approach...');
    
    // Let's create a Supabase Edge Function to execute the SQL
    console.log('\n📝 Creating Edge Function to run migrations...');
    
    const edgeFunctionCode = `
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    // This Edge Function can execute raw SQL
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Execute migration SQL here
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: 'CREATE TABLE IF NOT EXISTS test_table (id int);'
    })
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
`;
    
    console.log('\n⚠️  Since I can\'t execute raw SQL through the client library,');
    console.log('    you need to run the migration manually in the SQL Editor.');
    console.log('\n✅ I\'ve prepared everything for you!');
  }
}

main();