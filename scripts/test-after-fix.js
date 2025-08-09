#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Supabase configuration
const supabaseUrl = 'https://ydevatqwkoccxhtejdor.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkZXZhdHF3a29jY3hodGVqZG9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyMjAxNjEsImV4cCI6MjA1ODc5NjE2MX0.kbjmP9__CU21gJfZwyKbw0GVfjX_PL7jmVTZsY-W8uY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('🧪 Testing Supabase after RLS fix...\n');

async function testAfterFix() {
  let testsPassed = 0;
  let testsFailed = 0;

  // Test 1: Authentication
  console.log('1️⃣ Testing Authentication...');
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (user) {
      console.log('✅ User authenticated:', user.email);
      testsPassed++;
    } else {
      console.log('⚠️  No user session - please log in first');
      console.log('   Run this test after logging into the app');
      return;
    }
  } catch (error) {
    console.log('❌ Auth test failed:', error.message);
    testsFailed++;
    return;
  }

  // Test 2: Profile Read
  console.log('\n2️⃣ Testing Profile Read...');
  try {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (error) throw error;
    console.log('✅ Can read profiles table');
    testsPassed++;
  } catch (error) {
    console.log('❌ Profile read failed:', error.message);
    testsFailed++;
  }

  // Test 3: Profile Update
  console.log('\n3️⃣ Testing Profile Update...');
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        updated_at: new Date().toISOString()
      })
      .select();
    
    if (error) throw error;
    console.log('✅ Can update profile');
    testsPassed++;
  } catch (error) {
    console.log('❌ Profile update failed:', error.message);
    testsFailed++;
  }

  // Test 4: Storage Upload
  console.log('\n4️⃣ Testing Storage Upload...');
  try {
    const testFile = Buffer.from('Test file content');
    const fileName = `test-${Date.now()}.txt`;
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase.storage
      .from('Profile Photos')
      .upload(`${user.id}/${fileName}`, testFile, {
        contentType: 'text/plain'
      });
    
    if (error) throw error;
    console.log('✅ Can upload to storage');
    testsPassed++;
    
    // Clean up test file
    await supabase.storage
      .from('Profile Photos')
      .remove([`${user.id}/${fileName}`]);
  } catch (error) {
    console.log('❌ Storage upload failed:', error.message);
    testsFailed++;
  }

  // Test 5: Create Post
  console.log('\n5️⃣ Testing Post Creation...');
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('posts')
      .insert({
        content: 'Test post - can be deleted',
        user_id: user.id
      })
      .select();
    
    if (error) throw error;
    console.log('✅ Can create posts');
    testsPassed++;
    
    // Clean up test post
    if (data && data[0]) {
      await supabase
        .from('posts')
        .delete()
        .eq('id', data[0].id);
    }
  } catch (error) {
    console.log('❌ Post creation failed:', error.message);
    testsFailed++;
  }

  // Test 6: Hero Image Access
  console.log('\n6️⃣ Testing Hero Image Access...');
  try {
    const heroUrl = 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/site_assets/2828a9e2-f57a-4737-b4b6-a24cfc14a95a.png';
    const response = await fetch(heroUrl);
    
    if (response.ok) {
      console.log('✅ Hero image is accessible');
      testsPassed++;
    } else {
      console.log('❌ Hero image returned status:', response.status);
      testsFailed++;
    }
  } catch (error) {
    console.log('❌ Hero image test failed:', error.message);
    testsFailed++;
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 TEST RESULTS:');
  console.log(`✅ Passed: ${testsPassed}`);
  console.log(`❌ Failed: ${testsFailed}`);
  
  if (testsFailed === 0) {
    console.log('\n🎉 ALL TESTS PASSED! Your Supabase is working correctly!');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the errors above.');
    console.log('   You may need to run the RLS fix script in Supabase SQL editor.');
  }
}

testAfterFix();