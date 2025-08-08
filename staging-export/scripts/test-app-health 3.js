#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAppHealth() {
  console.log('🏥 Testing Application Health...\n');
  
  let allGood = true;

  // Test 1: Database connection
  console.log('1️⃣ Testing Database Connection:');
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('count', { count: 'exact', head: true });
    
    if (error) throw error;
    console.log('  ✅ Database connected');
  } catch (err) {
    console.log('  ❌ Database connection failed:', err.message);
    allGood = false;
  }

  // Test 2: Profiles table structure
  console.log('\n2️⃣ Testing Profiles Table:');
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, status, country, language')
      .limit(1);
    
    if (error) throw error;
    console.log('  ✅ Profiles table has required columns');
  } catch (err) {
    console.log('  ❌ Profiles table missing columns:', err.message);
    allGood = false;
  }

  // Test 3: User subscriptions table
  console.log('\n3️⃣ Testing User Subscriptions:');
  try {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select('id')
      .limit(1);
    
    if (error) throw error;
    console.log('  ✅ User subscriptions table exists');
  } catch (err) {
    console.log('  ❌ User subscriptions table issue:', err.message);
    allGood = false;
  }

  // Test 4: Community articles
  console.log('\n4️⃣ Testing Community Articles:');
  try {
    const { data, error } = await supabase
      .from('community_articles')
      .select('id, author_id')
      .limit(1);
    
    if (error) throw error;
    console.log('  ✅ Community articles table works');
  } catch (err) {
    console.log('  ❌ Community articles issue:', err.message);
    allGood = false;
  }

  // Test 5: Storage buckets
  console.log('\n5️⃣ Testing Storage Buckets:');
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) throw error;
    
    const requiredBuckets = ['avatars', 'profile_photos', 'vehicle_photos', 'manuals', 'article_files', 'site_assets'];
    const existingBuckets = buckets?.map(b => b.name) || [];
    
    const missingBuckets = requiredBuckets.filter(b => !existingBuckets.includes(b));
    
    if (missingBuckets.length > 0) {
      console.log(`  ⚠️ Missing buckets: ${missingBuckets.join(', ')}`);
      allGood = false;
    } else {
      console.log('  ✅ All storage buckets exist');
    }
  } catch (err) {
    console.log('  ❌ Storage check failed:', err.message);
    allGood = false;
  }

  // Test 6: Auth
  console.log('\n6️⃣ Testing Authentication:');
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      console.log('  ✅ Auth working (session exists)');
    } else {
      console.log('  ℹ️ Auth working (no active session)');
    }
  } catch (err) {
    console.log('  ❌ Auth check failed:', err.message);
    allGood = false;
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  if (allGood) {
    console.log('✅ All systems operational!');
  } else {
    console.log('⚠️ Some issues detected. Please run the SQL migrations.');
    console.log('\nTo fix:');
    console.log('1. Go to Supabase Dashboard > SQL Editor');
    console.log('2. Run: scripts/create-storage-buckets-direct.sql');
    console.log('3. Run: supabase/migrations/20240111_fix_profiles_table.sql');
    console.log('4. Run: supabase/migrations/20240111_fix_missing_columns.sql');
  }
}

testAppHealth();