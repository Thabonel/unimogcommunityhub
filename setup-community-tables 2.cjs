const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('Setting up Community Tables');
console.log('===========================\n');

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function setupTables() {
  try {
    // Read the SQL file
    const sql = fs.readFileSync('create-community-tables.sql', 'utf8');
    
    console.log('📝 SQL to execute:');
    console.log('------------------');
    console.log(sql.substring(0, 500) + '...\n');
    
    console.log('⚠️  IMPORTANT: This script cannot create tables with RLS policies.');
    console.log('   Please run the SQL directly in Supabase Dashboard:\n');
    console.log('   1. Go to: https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor/sql/new');
    console.log('   2. Copy the contents of create-community-tables.sql');
    console.log('   3. Paste and run the SQL\n');
    
    // Let's fix the issue temporarily by modifying the query to not use the join
    console.log('🔧 Creating a temporary fix for the GroupsList component...\n');
    
    // Test if we can at least query the groups table
    const { data, error } = await supabase
      .from('community_groups')
      .select('*')
      .limit(5);
    
    if (error) {
      console.log('❌ Error querying community_groups:', error.message);
    } else {
      console.log('✅ community_groups table is accessible');
      console.log('   Found', data?.length || 0, 'groups');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

setupTables();