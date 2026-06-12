#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

// Connection details
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://ydevatqwkoccxhtejdor.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = <SUPABASE_SERVICE_ROLE_KEY>

if (!SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is required');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function testUnifiedSearch() {
  console.log('\n🔍 Testing unified_wis_search function...');
  
  try {
    const { data, error } = await supabase.rpc('unified_wis_search', {
      search_query: 'oil change',
      model_id: null,
      search_limit: 10
    });
    
    if (error) {
      console.error('❌ Error calling unified_wis_search:', error);
      return false;
    }
    
    console.log(`✅ unified_wis_search returned ${data ? data.length : 0} results`);
    if (data && data.length > 0) {
      console.log('📋 Sample result:', JSON.stringify(data[0], null, 2));
    } else {
      console.log('ℹ️ No results found, but function executed successfully');
    }
    return true;
  } catch (err) {
    console.error('💥 Exception testing unified_wis_search:', err.message);
    return false;
  }
}

async function testSuggestions() {
  console.log('\n💡 Testing wis_suggest_titles function...');
  
  try {
    const { data, error } = await supabase.rpc('wis_suggest_titles', {
      search_query: 'brake',
      model_filter: null,
      limit_rows: 10
    });
    
    if (error) {
      console.error('❌ Error calling wis_suggest_titles:', error);
      return false;
    }
    
    console.log(`✅ wis_suggest_titles returned ${data ? data.length : 0} results`);
    if (data && data.length > 0) {
      console.log('📋 Sample result:', JSON.stringify(data[0], null, 2));
    } else {
      console.log('ℹ️ No results found, but function executed successfully');
    }
    return true;
  } catch (err) {
    console.error('💥 Exception testing wis_suggest_titles:', err.message);
    return false;
  }
}

async function checkWISTables() {
  console.log('\n📊 Checking WIS table structure...');
  
  try {
    // Check if WIS tables exist and have data
    const tables = ['wis_models', 'wis_procedures', 'wis_parts', 'wis_bulletins'];
    
    for (const table of tables) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          console.log(`⚠️ Table ${table}: Error - ${error.message}`);
        } else {
          console.log(`✅ Table ${table}: ${count} records`);
        }
      } catch (e) {
        console.log(`❌ Table ${table}: Not accessible - ${e.message}`);
      }
    }
  } catch (err) {
    console.error('💥 Exception checking WIS tables:', err.message);
  }
}

async function main() {
  console.log('🚀 WIS Functions Test Suite');
  console.log('============================');
  
  // Check WIS tables first
  await checkWISTables();
  
  // Test the functions
  const searchTest = await testUnifiedSearch();
  const suggestTest = await testSuggestions();
  
  console.log('\n📊 Test Results Summary');
  console.log('=======================');
  console.log(`unified_wis_search: ${searchTest ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`wis_suggest_titles: ${suggestTest ? '✅ PASS' : '❌ FAIL'}`);
  
  if (searchTest && suggestTest) {
    console.log('\n🎉 All WIS functions are working correctly!');
  } else {
    console.log('\n⚠️ Some functions may need deployment or debugging.');
  }
}

// Handle errors gracefully
process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

main().catch(console.error);