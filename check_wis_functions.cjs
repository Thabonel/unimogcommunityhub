#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

// Connection details
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://ydevatqwkoccxhtejdor.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = <SUPABASE_SERVICE_ROLE_KEY>

if (!SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is required');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function checkAvailableFunctions() {
  console.log('🔍 Checking available WIS functions in the database...');
  
  try {
    // Query to get all functions containing 'wis' in their name
    const { data, error } = await supabase.rpc('sql', {
      query: `
        SELECT 
          proname as function_name,
          prosrc as function_body,
          proargnames as arg_names,
          proargtypes::regtype[] as arg_types
        FROM pg_proc 
        WHERE proname ILIKE '%wis%' 
        AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
        ORDER BY proname;
      `
    });
    
    if (error) {
      console.error('❌ Error querying functions:', error);
      
      // Try alternative approach
      console.log('\n🔄 Trying alternative approach to list functions...');
      const { data: altData, error: altError } = await supabase.rpc('sql', {
        query: `
          SELECT routine_name, routine_type
          FROM information_schema.routines
          WHERE routine_schema = 'public' 
          AND routine_name ILIKE '%wis%'
          ORDER BY routine_name;
        `
      });
      
      if (altError) {
        console.error('❌ Alternative query also failed:', altError);
        return;
      }
      
      console.log('✅ Found functions using information_schema:');
      altData.forEach(func => {
        console.log(`  - ${func.routine_name} (${func.routine_type})`);
      });
      
    } else {
      console.log('✅ Found WIS functions:');
      data.forEach(func => {
        console.log(`  - ${func.function_name}(${func.arg_names ? func.arg_names.join(', ') : 'no args'})`);
      });
    }
  } catch (err) {
    console.error('💥 Exception checking functions:', err.message);
    
    // Try to call the suggested functions directly
    console.log('\n🧪 Testing suggested function names...');
    
    // Test wis_search
    try {
      console.log('\n🔍 Testing wis_search function...');
      const { data, error } = await supabase.rpc('wis_search', {
        search_query: 'oil',
        model_id: null,
        search_limit: 5
      });
      
      if (error) {
        console.log('❌ wis_search error:', error.message);
      } else {
        console.log(`✅ wis_search works! Returned ${data ? data.length : 0} results`);
        if (data && data.length > 0) {
          console.log('📋 Sample result:', JSON.stringify(data[0], null, 2));
        }
      }
    } catch (e) {
      console.log('❌ wis_search exception:', e.message);
    }
    
    // Test unified_wis_search with different parameter names
    try {
      console.log('\n🔍 Testing unified_wis_search with different parameters...');
      const { data, error } = await supabase.rpc('unified_wis_search', {
        query: 'oil change',
        model: null,
        limit: 10
      });
      
      if (error) {
        console.log('❌ unified_wis_search (alt params) error:', error.message);
      } else {
        console.log(`✅ unified_wis_search works! Returned ${data ? data.length : 0} results`);
      }
    } catch (e) {
      console.log('❌ unified_wis_search (alt params) exception:', e.message);
    }
  }
}

async function testWisSuggestTitles() {
  console.log('\n💡 Testing wis_suggest_titles with different approaches...');
  
  // Try the original function call
  try {
    console.log('🧪 Testing wis_suggest_titles (original parameters)...');
    const { data, error } = await supabase.rpc('wis_suggest_titles', {
      search_query: 'brake',
      model_filter: null,
      limit_rows: 5
    });
    
    if (error) {
      console.log('❌ wis_suggest_titles (original) error:', error.message);
    } else {
      console.log(`✅ wis_suggest_titles works! Returned ${data ? data.length : 0} results`);
      if (data && data.length > 0) {
        console.log('📋 Sample result:', JSON.stringify(data[0], null, 2));
      }
    }
  } catch (e) {
    console.log('❌ wis_suggest_titles (original) exception:', e.message);
  }
  
  // Try alternative parameter names
  try {
    console.log('🧪 Testing wis_suggest_titles (alternative parameters)...');
    const { data, error } = await supabase.rpc('wis_suggest_titles', {
      query: 'brake',
      model: null,
      limit: 5
    });
    
    if (error) {
      console.log('❌ wis_suggest_titles (alternative) error:', error.message);
    } else {
      console.log(`✅ wis_suggest_titles (alternative) works! Returned ${data ? data.length : 0} results`);
    }
  } catch (e) {
    console.log('❌ wis_suggest_titles (alternative) exception:', e.message);
  }
}

async function main() {
  console.log('🚀 WIS Functions Discovery Tool');
  console.log('===============================');
  
  await checkAvailableFunctions();
  await testWisSuggestTitles();
  
  console.log('\n✅ Discovery complete!');
}

main().catch(console.error);