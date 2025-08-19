#!/usr/bin/env node

/**
 * Test Script to Verify Fixes
 * Run this after applying the SQL fixes to verify everything works
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

console.log('🔧 Testing After Storage Policy Fixes');
console.log('=====================================\n');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

// Test with both anonymous and authenticated clients
const anonSupabase = createClient(supabaseUrl, supabaseAnonKey);

async function testStorageWithAuth() {
  console.log('🔐 Testing Storage with Authentication');
  console.log('------------------------------------');
  
  // Create a test user session
  console.log('1. Creating test user session...');
  
  const { data: signUpData, error: signUpError } = await anonSupabase.auth.signUp({
    email: `test+${Date.now()}@example.com`,
    password: 'testpassword123'
  });
  
  if (signUpError) {
    console.log(`   ⚠️  Could not create test user: ${signUpError.message}`);
    console.log('   💡 Testing with anonymous access instead...\n');
    return testStorageAnonymous();
  }
  
  console.log('   ✅ Test user session created');
  
  // Test uploads with authentication
  const testBuckets = [
    'avatars',
    'Profile Photos', 
    'vehicle_photos',
    'site_assets'
  ];
  
  for (const bucketName of testBuckets) {
    console.log(`\n2. Testing authenticated upload to ${bucketName}:`);
    
    const testFile = new Blob(['test content'], { type: 'image/png' });
    const fileName = `test-auth-${Date.now()}.png`;
    
    const { data, error } = await anonSupabase.storage
      .from(bucketName)
      .upload(fileName, testFile, {
        upsert: true
      });
    
    if (error) {
      console.log(`   ❌ Upload failed: ${error.message}`);
      
      if (error.message.includes('Bucket not found')) {
        console.log('   💡 Check bucket name case sensitivity');
      }
    } else {
      console.log(`   ✅ Upload successful: ${data.path}`);
      
      // Test public URL
      const { data: urlData } = anonSupabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);
      
      console.log(`   ✅ Public URL: ${urlData.publicUrl}`);
      
      // Clean up
      await anonSupabase.storage.from(bucketName).remove([fileName]);
      console.log('   🧹 Cleaned up test file');
    }
  }
  
  // Clean up test user
  await anonSupabase.auth.signOut();
}

async function testStorageAnonymous() {
  console.log('🌐 Testing Storage without Authentication');
  console.log('----------------------------------------');
  
  const testBuckets = [
    'avatars',
    'Profile Photos',
    'vehicle_photos', 
    'site_assets'
  ];
  
  for (const bucketName of testBuckets) {
    console.log(`\nTesting anonymous upload to ${bucketName}:`);
    
    const testFile = new Blob(['test content'], { type: 'image/png' });
    const fileName = `test-anon-${Date.now()}.png`;
    
    const { data, error } = await anonSupabase.storage
      .from(bucketName)
      .upload(fileName, testFile, {
        upsert: true
      });
    
    if (error) {
      console.log(`   ❌ Anonymous upload failed: ${error.message}`);
      if (error.message.includes('policy')) {
        console.log('   ✅ This is expected - anonymous uploads should be blocked');
      }
    } else {
      console.log(`   ⚠️  Anonymous upload succeeded: ${data.path}`);
      console.log('   💡 This may be a security concern depending on bucket purpose');
      
      // Clean up
      await anonSupabase.storage.from(bucketName).remove([fileName]);
    }
  }
}

async function testImageLoadingAfterFixes() {
  console.log('\n🖼️  Testing Image Loading After Fixes');
  console.log('-------------------------------------');
  
  const imagesToTest = [
    { bucket: 'avatars', file: 'Barry.png', description: 'Barry avatar' },
    { bucket: 'site_assets', file: 'Unimoghub LOGO.png', description: 'Site logo' }
  ];
  
  for (const image of imagesToTest) {
    console.log(`\nTesting ${image.description}:`);
    
    // Test public URL generation
    const { data: urlData } = anonSupabase.storage
      .from(image.bucket)
      .getPublicUrl(image.file);
    
    console.log(`   📎 URL: ${urlData.publicUrl}`);
    
    // Test accessibility
    try {
      const response = await fetch(urlData.publicUrl);
      if (response.ok) {
        console.log(`   ✅ Image accessible (${response.status})`);
      } else {
        console.log(`   ❌ Image not accessible (${response.status})`);
      }
    } catch (fetchError) {
      console.log(`   ❌ Network error: ${fetchError.message}`);
    }
  }
}

async function testBucketConfiguration() {
  console.log('\n⚙️  Testing Bucket Configuration');
  console.log('-------------------------------');
  
  const { data: buckets, error } = await anonSupabase.storage.listBuckets();
  
  if (error) {
    console.log(`❌ Could not list buckets: ${error.message}`);
    return;
  }
  
  console.log(`✅ Found ${buckets.length} buckets:`);
  
  buckets.forEach(bucket => {
    console.log(`\n📦 ${bucket.name}:`);
    console.log(`   - Public: ${bucket.public}`);
    console.log(`   - File size limit: ${bucket.file_size_limit || 'No limit'}`);
    console.log(`   - Allowed MIME types: ${bucket.allowed_mime_types?.join(', ') || 'All types'}`);
  });
  
  // Check for the "Profile Photos" bucket specifically (case sensitivity issue)
  const profilePhotosBucket = buckets.find(b => b.name === 'Profile Photos');
  if (profilePhotosBucket) {
    console.log('\n✅ "Profile Photos" bucket found (case-sensitive name confirmed)');
  } else {
    console.log('\n❌ "Profile Photos" bucket not found - check case sensitivity');
    console.log('Available bucket names:', buckets.map(b => b.name).join(', '));
  }
}

async function runPostFixTests() {
  console.log('Running tests after applying storage policy fixes...\n');
  
  await testBucketConfiguration();
  await testImageLoadingAfterFixes();
  await testStorageAnonymous();
  await testStorageWithAuth();
  
  console.log('\n📋 Post-Fix Summary');
  console.log('==================');
  console.log('If the tests above show:');
  console.log('');
  console.log('✅ Expected Results:');
  console.log('  - Image loading works');
  console.log('  - Anonymous uploads are blocked (security)');
  console.log('  - Authenticated uploads work');
  console.log('  - Proper bucket configuration');
  console.log('');
  console.log('❌ If issues persist:');
  console.log('  1. Ensure the SQL script was applied successfully');
  console.log('  2. Check Supabase dashboard for policy errors');
  console.log('  3. Verify bucket names and case sensitivity');
  console.log('  4. Review authentication flow in the app');
}

runPostFixTests();