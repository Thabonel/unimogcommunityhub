#!/usr/bin/env node

/**
 * Script to add missing columns to manual_metadata table
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase with service role key
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAndAddColumns() {
  console.log('🔍 Checking manual_metadata table structure...\n');

  // First, let's check what columns exist
  const { data: columns, error: columnsError } = await supabase
    .rpc('get_table_columns', { 
      table_name: 'manual_metadata',
      schema_name: 'public' 
    })
    .catch(() => ({ data: null, error: 'Function not found' }));

  if (columnsError || !columns) {
    console.log('⚠️  Could not retrieve table columns, will attempt to add missing columns anyway\n');
  }

  // SQL statements to add missing columns if they don't exist
  const alterStatements = [
    {
      name: 'processing_status',
      sql: `ALTER TABLE manual_metadata 
            ADD COLUMN IF NOT EXISTS processing_status TEXT 
            DEFAULT 'pending' 
            CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed'))`
    },
    {
      name: 'chunk_count',
      sql: `ALTER TABLE manual_metadata 
            ADD COLUMN IF NOT EXISTS chunk_count INTEGER DEFAULT 0`
    },
    {
      name: 'error_message',
      sql: `ALTER TABLE manual_metadata 
            ADD COLUMN IF NOT EXISTS error_message TEXT`
    },
    {
      name: 'processing_started_at',
      sql: `ALTER TABLE manual_metadata 
            ADD COLUMN IF NOT EXISTS processing_started_at TIMESTAMPTZ`
    },
    {
      name: 'processing_completed_at',
      sql: `ALTER TABLE manual_metadata 
            ADD COLUMN IF NOT EXISTS processing_completed_at TIMESTAMPTZ`
    }
  ];

  console.log('📝 Adding missing columns to manual_metadata table...\n');

  for (const statement of alterStatements) {
    console.log(`Adding column: ${statement.name}...`);
    
    // Execute SQL directly using the service role key
    const { error } = await supabase.rpc('exec_sql', { 
      query: statement.sql 
    }).catch(async () => {
      // If exec_sql doesn't exist, try using the Supabase SQL editor API
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: statement.sql
        })
      });
      
      if (!response.ok) {
        return { error: `HTTP ${response.status}` };
      }
      return { error: null };
    });

    if (error) {
      console.log(`⚠️  Could not add ${statement.name}: ${error}`);
      console.log('   This column might already exist or require manual addition\n');
    } else {
      console.log(`✅ Successfully added ${statement.name}\n`);
    }
  }

  console.log('\n📊 Checking current manual_metadata entries...');
  
  const { data: manuals, count } = await supabase
    .from('manual_metadata')
    .select('*', { count: 'exact' })
    .limit(5);

  if (manuals) {
    console.log(`\nFound ${count} manuals in the database`);
    console.log('Sample columns from first entry:');
    if (manuals[0]) {
      console.log(Object.keys(manuals[0]).join(', '));
    }
  }

  console.log('\n✨ Column check complete!');
  console.log('\nNote: If columns couldn\'t be added automatically, you may need to add them manually in Supabase:');
  console.log('1. Go to your Supabase dashboard');
  console.log('2. Navigate to Table Editor > manual_metadata');
  console.log('3. Add the missing columns manually with these specifications:');
  console.log('   - processing_status: TEXT, default "pending"');
  console.log('   - chunk_count: INTEGER, default 0');
  console.log('   - error_message: TEXT, nullable');
  console.log('   - processing_started_at: TIMESTAMPTZ, nullable');
  console.log('   - processing_completed_at: TIMESTAMPTZ, nullable');
}

checkAndAddColumns().catch(console.error);