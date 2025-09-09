// Test script to verify WIS database functions are deployed
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ydevatqwkoccxhtejdor.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your_anon_key_here'
);

async function testWISFunctions() {
  console.log('🔍 Testing WIS Database Functions...\n');
  
  try {
    // Test 1: Check if WIS models exist
    console.log('1. Testing WIS Models...');
    const { data: models, error: modelsError } = await supabase
      .from('wis_models')
      .select('*')
      .limit(3);
    
    if (modelsError) {
      console.log('❌ Models Error:', modelsError.message);
    } else {
      console.log('✅ Models found:', models?.length || 0);
      if (models && models.length > 0) {
        console.log('   Sample:', models[0].model_name);
      }
    }
    
    // Test 2: Check if procedures exist
    console.log('\n2. Testing WIS Procedures...');
    const { data: procedures, error: procError } = await supabase
      .from('wis_procedures')
      .select('*')
      .limit(3);
    
    if (procError) {
      console.log('❌ Procedures Error:', procError.message);
    } else {
      console.log('✅ Procedures found:', procedures?.length || 0);
      if (procedures && procedures.length > 0) {
        console.log('   Sample:', procedures[0].title);
      }
    }
    
    // Test 3: Test unified search function
    console.log('\n3. Testing Unified Search Function...');
    const { data: searchResults, error: searchError } = await supabase
      .rpc('unified_wis_search', {
        search_query: 'oil',
        model_id: null,
        search_limit: 5
      });
    
    if (searchError) {
      console.log('❌ Search Function Error:', searchError.message);
      console.log('   This means the migration needs to be deployed');
    } else {
      console.log('✅ Search Function Working!');
      console.log('   Results found:', searchResults?.length || 0);
      if (searchResults && searchResults.length > 0) {
        console.log('   Sample result:', searchResults[0].title);
      }
    }
    
    // Test 4: Test search procedures function
    console.log('\n4. Testing Search Procedures Function...');
    const { data: procSearchResults, error: procSearchError } = await supabase
      .rpc('search_wis_procedures', {
        search_query: 'oil',
        model_filter: '',
        search_limit: 3
      });
    
    if (procSearchError) {
      console.log('❌ Procedure Search Error:', procSearchError.message);
      console.log('   Functions may need to be deployed');
    } else {
      console.log('✅ Procedure Search Working!');
      console.log('   Results found:', procSearchResults?.length || 0);
    }
    
  } catch (error) {
    console.log('❌ General Error:', error.message);
  }
  
  console.log('\n🏁 WIS Database Test Complete!');
}

// Run the test
testWISFunctions();