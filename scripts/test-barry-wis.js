#!/usr/bin/env node

// scripts/test-barry-wis.js
// Test script to verify Barry WIS functionality

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

console.log('🤖 Barry WIS Connection Test');
console.log('============================');

async function testSupabaseConnection() {
  console.log('1. Testing Supabase connection...');
  
  try {
    const { data, error } = await supabase
      .from('wis_content')
      .select('count(*)')
      .limit(1);
    
    if (error) {
      console.log('❌ Supabase connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Supabase connection successful');
    return true;
  } catch (error) {
    console.log('❌ Supabase connection error:', error.message);
    return false;
  }
}

async function testWISContentTable() {
  console.log('2. Testing WIS content table...');
  
  try {
    const { data, error } = await supabase
      .from('wis_content')
      .select('id, title, content_type, vehicle_model')
      .limit(5);
    
    if (error) {
      console.log('❌ WIS content query failed:', error.message);
      return false;
    }
    
    console.log(`✅ WIS content table accessible (${data?.length || 0} sample records)`);
    if (data?.length > 0) {
      console.log('   Sample records:');
      data.forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.title} (${item.content_type}) - ${item.vehicle_model || 'Universal'}`);
      });
    }
    return true;
  } catch (error) {
    console.log('❌ WIS content query error:', error.message);
    return false;
  }
}

async function testVectorSearch() {
  console.log('3. Testing vector search function...');
  
  try {
    const { data, error } = await supabase
      .rpc('search_wis_content_vector', {
        search_query: 'engine oil change',
        vehicle_filter: 'U1700L',
        similarity_threshold: 0.3,
        max_results: 3
      });
    
    if (error) {
      console.log('⚠️  Vector search not available:', error.message);
      console.log('   This is expected if vector search hasn\'t been set up yet');
      return false;
    }
    
    console.log(`✅ Vector search working (${data?.length || 0} results)`);
    return true;
  } catch (error) {
    console.log('⚠️  Vector search error:', error.message);
    return false;
  }
}

async function testTextSearch() {
  console.log('4. Testing text search fallback...');
  
  try {
    const { data, error } = await supabase
      .from('wis_content')
      .select('id, title, content_type, description')
      .or('title.ilike.%oil%,description.ilike.%oil%')
      .limit(3);
    
    if (error) {
      console.log('❌ Text search failed:', error.message);
      return false;
    }
    
    console.log(`✅ Text search working (${data?.length || 0} results for "oil")`);
    if (data?.length > 0) {
      console.log('   Results:');
      data.forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.title} (${item.content_type})`);
      });
    }
    return true;
  } catch (error) {
    console.log('❌ Text search error:', error.message);
    return false;
  }
}

async function testStorageAccess() {
  console.log('5. Testing storage bucket access...');
  
  try {
    const { data, error } = await supabase.storage
      .from('wis-manuals')
      .list('', { limit: 3 });
    
    if (error) {
      console.log('❌ Storage access failed:', error.message);
      return false;
    }
    
    console.log(`✅ Storage bucket accessible (${data?.length || 0} top-level items)`);
    if (data?.length > 0) {
      console.log('   Items:');
      data.forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.name} (${item.metadata?.size || 'unknown size'})`);
      });
    }
    return true;
  } catch (error) {
    console.log('❌ Storage access error:', error.message);
    return false;
  }
}

async function runTests() {
  console.log(`Environment: ${process.env.VITE_SUPABASE_URL ? 'Configured' : 'Missing URL'}`);
  console.log('');

  const results = {
    connection: await testSupabaseConnection(),
    wisTable: await testWISContentTable(),
    vectorSearch: await testVectorSearch(),
    textSearch: await testTextSearch(),
    storage: await testStorageAccess()
  };

  console.log('');
  console.log('📊 Test Results Summary:');
  console.log('========================');
  console.log(`Supabase Connection: ${results.connection ? '✅' : '❌'}`);
  console.log(`WIS Content Table: ${results.wisTable ? '✅' : '❌'}`);
  console.log(`Vector Search: ${results.vectorSearch ? '✅' : '⚠️ '}`);
  console.log(`Text Search: ${results.textSearch ? '✅' : '❌'}`);
  console.log(`Storage Access: ${results.storage ? '✅' : '❌'}`);

  const criticalTests = [results.connection, results.wisTable, results.textSearch];
  const criticalPassed = criticalTests.filter(Boolean).length;

  console.log('');
  if (criticalPassed === criticalTests.length) {
    console.log('🎉 Barry WIS is ready for basic functionality!');
    console.log('   You can now test the Barry integration in the WIS interface.');
  } else {
    console.log('⚠️  Some critical tests failed. Barry WIS may not work properly.');
    console.log('   Please check your Supabase configuration and WIS content setup.');
  }

  console.log('');
  console.log('Next steps:');
  console.log('1. Test the Netlify function: /.netlify/functions/barry-wis');
  console.log('2. Try asking Barry a question in the WIS interface');
  console.log('3. Check the browser console for any errors');
}

// Run the tests
runTests().catch(error => {
  console.error('Test script failed:', error);
  process.exit(1);
});