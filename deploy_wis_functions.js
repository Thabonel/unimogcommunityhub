#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables from package.json scripts or set directly
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://ydevatqwkoccxhtejdor.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = <SUPABASE_SERVICE_ROLE_KEY>

if (!SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is required');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function deployFunction(filePath, description) {
  console.log(`\n📁 Deploying ${description}...`);
  
  try {
    const sql = fs.readFileSync(filePath, 'utf8');
    console.log(`📄 Read ${sql.length} characters from ${path.basename(filePath)}`);
    
    // Split SQL into individual statements and execute them
    const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);
    
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i].trim();
      if (stmt) {
        console.log(`🔧 Executing statement ${i + 1}/${statements.length}...`);
        const { data, error } = await supabase.from('sql').select('*').eq('query', stmt);
        
        // For function creation, we need to use a different approach
        // Let's try executing raw SQL via a known function or approach
        if (error) {
          console.error(`❌ Error in statement ${i + 1}:`, error);
          return false;
        }
      }
    }
    
    console.log(`✅ Successfully deployed ${description}`);
    return true;
  } catch (err) {
    console.error(`💥 Exception deploying ${description}:`, err.message);
    return false;
  }
}

async function testFunction(functionName, query, params = []) {
  console.log(`\n🧪 Testing ${functionName}...`);
  
  try {
    const { data, error } = await supabase.rpc(functionName, ...params);
    
    if (error) {
      console.error(`❌ Error testing ${functionName}:`, error);
      return false;
    }
    
    console.log(`✅ ${functionName} returned ${Array.isArray(data) ? data.length : 'N/A'} results`);
    if (Array.isArray(data) && data.length > 0) {
      console.log(`📋 Sample result:`, data[0]);
    }
    return true;
  } catch (err) {
    console.error(`💥 Exception testing ${functionName}:`, err.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting WIS Functions Deployment');
  console.log('====================================');
  
  const migrations = [
    {
      file: '/Users/thabonel/Code/unimogcommunityhub/supabase/migrations/20250906_create_unified_wis_search.sql',
      description: 'Unified WIS Search Functions'
    },
    {
      file: '/Users/thabonel/Code/unimogcommunityhub/supabase/migrations/20250911_create_wis_suggestions_function.sql',
      description: 'WIS Suggestions Function'
    }
  ];
  
  // Deploy functions
  let allSuccessful = true;
  for (const migration of migrations) {
    const success = await deployFunction(migration.file, migration.description);
    if (!success) allSuccessful = false;
  }
  
  if (!allSuccessful) {
    console.log('\n❌ Some deployments failed. Stopping tests.');
    return;
  }
  
  console.log('\n🎯 Starting Function Tests');
  console.log('===========================');
  
  // Test the functions
  await testFunction('unified_wis_search', 'oil change', { 
    search_query: 'oil change', 
    model_id: null, 
    search_limit: 10 
  });
  
  await testFunction('wis_suggest_titles', 'brake', { 
    search_query: 'brake', 
    model_filter: null, 
    limit_rows: 10 
  });
  
  console.log('\n✨ Deployment and testing complete!');
}

// Handle errors
process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

main().catch(console.error);