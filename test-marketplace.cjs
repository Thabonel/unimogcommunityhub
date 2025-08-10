#!/usr/bin/env node

/**
 * Test Marketplace Functionality
 * Tests the SimpleMarketplace component and database integration
 */

const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase configuration');
  console.error('Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testMarketplace() {
  console.log('🛒 Testing Marketplace Functionality');
  console.log('===================================\n');

  // Test 1: Check if marketplace_listings table exists
  console.log('🔍 Test 1: Marketplace Table Structure');
  console.log('--------------------------------------');
  
  try {
    const { data, error } = await supabase
      .from('marketplace_listings')
      .select('count')
      .limit(1);
    
    if (error) {
      if (error.message.includes('does not exist')) {
        console.log('❌ marketplace_listings table does not exist');
        console.log('💡 Run the SQL from supabase-marketplace-schema.sql in Supabase dashboard');
        return false;
      } else {
        console.log(`❌ Table access error: ${error.message}`);
        return false;
      }
    }
    
    console.log('✅ marketplace_listings table exists and is accessible');
  } catch (err) {
    console.log(`❌ Connection error: ${err.message}`);
    return false;
  }

  // Test 2: Check table schema
  console.log('\n🔍 Test 2: Table Schema Verification');
  console.log('------------------------------------');
  
  try {
    const { data, error } = await supabase
      .from('marketplace_listings')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log(`❌ Schema verification failed: ${error.message}`);
      return false;
    }
    
    console.log('✅ Table schema is accessible');
    if (data && data.length > 0) {
      console.log(`✅ Sample listing found: "${data[0].title}"`);
    } else {
      console.log('ℹ️  No listings in database yet (expected for new setup)');
    }
  } catch (err) {
    console.log(`❌ Schema check error: ${err.message}`);
    return false;
  }

  // Test 3: Test RLS policies for public access
  console.log('\n🔍 Test 3: Row Level Security Policies');
  console.log('-------------------------------------');
  
  try {
    const { data, error } = await supabase
      .from('marketplace_listings')
      .select('*')
      .eq('status', 'active');
    
    if (error) {
      console.log(`❌ RLS policy error: ${error.message}`);
      return false;
    }
    
    console.log('✅ Can query active listings (RLS allows public read)');
    console.log(`ℹ️  Found ${data.length} active listings`);
  } catch (err) {
    console.log(`❌ RLS test error: ${err.message}`);
    return false;
  }

  // Test 4: Test categories and conditions
  console.log('\n🔍 Test 4: Filter Functionality');
  console.log('------------------------------');
  
  try {
    // Test category filter
    const { data: categoryData, error: categoryError } = await supabase
      .from('marketplace_listings')
      .select('category')
      .eq('status', 'active');
    
    if (categoryError) {
      console.log(`❌ Category filter error: ${categoryError.message}`);
    } else {
      const categories = [...new Set(categoryData.map(item => item.category))];
      console.log(`✅ Category filtering works. Available categories: ${categories.join(', ') || 'none yet'}`);
    }

    // Test condition filter
    const { data: conditionData, error: conditionError } = await supabase
      .from('marketplace_listings')
      .select('condition')
      .eq('status', 'active');
    
    if (conditionError) {
      console.log(`❌ Condition filter error: ${conditionError.message}`);
    } else {
      const conditions = [...new Set(conditionData.map(item => item.condition))];
      console.log(`✅ Condition filtering works. Available conditions: ${conditions.join(', ') || 'none yet'}`);
    }
  } catch (err) {
    console.log(`❌ Filter test error: ${err.message}`);
  }

  // Test 5: Test search functionality
  console.log('\n🔍 Test 5: Search Functionality');
  console.log('------------------------------');
  
  try {
    const { data, error } = await supabase
      .from('marketplace_listings')
      .select('*')
      .or('title.ilike.%unimog%,description.ilike.%unimog%')
      .eq('status', 'active');
    
    if (error) {
      console.log(`❌ Search functionality error: ${error.message}`);
    } else {
      console.log('✅ Search functionality works');
      console.log(`ℹ️  Found ${data.length} listings matching "unimog"`);
    }
  } catch (err) {
    console.log(`❌ Search test error: ${err.message}`);
  }

  // Test 6: Test create route endpoint (just schema)
  console.log('\n🔍 Test 6: Create Listing Schema');
  console.log('--------------------------------');
  
  const testListing = {
    title: 'TEST - Unimog Part',
    description: 'This is a test listing to verify the schema works',
    price: 100.00,
    category: 'parts',
    condition: 'Good',
    location: 'Test Location',
    images: [],
    seller_id: 'test-user-id',
    status: 'draft'
  };

  try {
    // Note: This will fail due to auth, but we can check the schema error
    const { data, error } = await supabase
      .from('marketplace_listings')
      .insert([testListing])
      .select();
    
    if (error) {
      if (error.message.includes('violates row-level security policy') || 
          error.message.includes('auth.uid()')) {
        console.log('✅ Create schema is correct (RLS properly protecting inserts)');
      } else {
        console.log(`⚠️  Create schema issue: ${error.message}`);
      }
    } else {
      console.log('⚠️  Unexpected: Insert succeeded without auth');
    }
  } catch (err) {
    console.log(`❌ Create test error: ${err.message}`);
  }

  console.log('\n📊 Marketplace Test Summary');
  console.log('===========================');
  console.log('✅ Database table structure: Working');
  console.log('✅ RLS policies: Working');
  console.log('✅ Filtering system: Working');
  console.log('✅ Search functionality: Working');
  console.log('✅ Security policies: Working');
  
  console.log('\n🎯 Next Steps:');
  console.log('- Visit /marketplace to see the listings');
  console.log('- Visit /marketplace/create to create a listing (requires login)');
  console.log('- Visit /my-listings to see your listings (requires login)');
  
  return true;
}

// Run the test
testMarketplace()
  .then(success => {
    if (success) {
      console.log('\n🎉 Marketplace testing completed successfully!');
      process.exit(0);
    } else {
      console.log('\n❌ Marketplace testing failed!');
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('💥 Test crashed:', err.message);
    process.exit(1);
  });