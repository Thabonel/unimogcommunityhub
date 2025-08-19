#!/usr/bin/env node

/**
 * Storage Bucket Test Script
 * Specifically tests all storage bucket operations that are failing
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

console.log('🪣 Storage Bucket Comprehensive Test');
console.log('===================================\n');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Storage buckets that should exist
const EXPECTED_BUCKETS = {
  AVATARS: 'avatars',
  PROFILE_PHOTOS: 'Profile Photos',
  VEHICLE_PHOTOS: 'vehicle_photos',
  MANUALS: 'manuals',
  ARTICLE_FILES: 'article_files',
  SITE_ASSETS: 'site_assets'
};

async function listAllBuckets() {
  console.log('📋 Listing All Storage Buckets');
  console.log('------------------------------');
  
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('❌ Failed to list buckets:', error.message);
      return null;
    }
    
    if (!buckets || buckets.length === 0) {
      console.log('⚠️  No storage buckets found');
      return [];
    }
    
    console.log(`✅ Found ${buckets.length} buckets:`);
    buckets.forEach((bucket, index) => {
      console.log(`  ${index + 1}. ${bucket.name}`);
      console.log(`     - Public: ${bucket.public}`);
      console.log(`     - Created: ${bucket.created_at}`);
      console.log(`     - Updated: ${bucket.updated_at}`);
    });
    
    return buckets;
    
  } catch (error) {
    console.error('❌ Error listing buckets:', error.message);
    return null;
  }
}

async function testBucketAccess(bucketName) {
  console.log(`\n🔍 Testing Bucket: ${bucketName}`);
  console.log(''.padEnd(40, '-'));
  
  try {
    // Test 1: List files in bucket
    console.log('1. Testing file listing...');
    const { data: files, error: listError } = await supabase.storage
      .from(bucketName)
      .list('', { limit: 10 });
    
    if (listError) {
      console.log(`   ❌ List failed: ${listError.message}`);
    } else {
      console.log(`   ✅ List successful: ${files?.length || 0} items found`);
      if (files && files.length > 0) {
        files.slice(0, 3).forEach((file, index) => {
          console.log(`      ${index + 1}. ${file.name} (${file.metadata?.size || 'unknown size'})`);
        });
        if (files.length > 3) {
          console.log(`      ... and ${files.length - 3} more`);
        }
      }
    }
    
    // Test 2: Upload test file
    console.log('2. Testing file upload...');
    const testFileName = `test-upload-${Date.now()}.txt`;
    const testContent = `Test file created at ${new Date().toISOString()}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(testFileName, new Blob([testContent], { type: 'text/plain' }), {
        upsert: true
      });
    
    if (uploadError) {
      console.log(`   ❌ Upload failed: ${uploadError.message}`);
      
      // Provide specific error guidance
      if (uploadError.message.includes('policy')) {
        console.log('   💡 This is likely a bucket policy issue');
      }
      if (uploadError.message.includes('permission')) {
        console.log('   💡 Permission denied - check bucket settings');
      }
      if (uploadError.message.includes('bucket')) {
        console.log('   💡 Bucket configuration issue');
      }
    } else {
      console.log(`   ✅ Upload successful: ${uploadData?.path}`);
      
      // Test 3: Get public URL
      console.log('3. Testing public URL generation...');
      try {
        const { data: publicUrlData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(testFileName);
        
        if (publicUrlData?.publicUrl) {
          console.log(`   ✅ Public URL: ${publicUrlData.publicUrl}`);
          
          // Test 4: Verify file is accessible
          console.log('4. Testing file accessibility...');
          try {
            const response = await fetch(publicUrlData.publicUrl);
            if (response.ok) {
              console.log(`   ✅ File is publicly accessible (${response.status})`);
            } else {
              console.log(`   ⚠️  File not accessible via public URL (${response.status})`);
            }
          } catch (fetchError) {
            console.log(`   ❌ Error accessing file: ${fetchError.message}`);
          }
        } else {
          console.log('   ❌ Failed to generate public URL');
        }
      } catch (urlError) {
        console.log(`   ❌ Public URL error: ${urlError.message}`);
      }
      
      // Test 5: Download file
      console.log('5. Testing file download...');
      const { data: downloadData, error: downloadError } = await supabase.storage
        .from(bucketName)
        .download(testFileName);
      
      if (downloadError) {
        console.log(`   ❌ Download failed: ${downloadError.message}`);
      } else {
        console.log(`   ✅ Download successful: ${downloadData?.size} bytes`);
      }
      
      // Test 6: Clean up test file
      console.log('6. Cleaning up test file...');
      const { error: deleteError } = await supabase.storage
        .from(bucketName)
        .remove([testFileName]);
      
      if (deleteError) {
        console.log(`   ⚠️  Could not delete test file: ${deleteError.message}`);
      } else {
        console.log('   ✅ Test file cleaned up');
      }
    }
    
  } catch (error) {
    console.log(`   ❌ Unexpected error: ${error.message}`);
  }
}

async function createMissingBuckets(existingBuckets) {
  console.log('\n🛠️  Creating Missing Buckets');
  console.log('----------------------------');
  
  const existingBucketNames = existingBuckets?.map(b => b.name) || [];
  const expectedBucketNames = Object.values(EXPECTED_BUCKETS);
  const missingBuckets = expectedBucketNames.filter(name => !existingBucketNames.includes(name));
  
  if (missingBuckets.length === 0) {
    console.log('✅ All expected buckets exist');
    return;
  }
  
  console.log(`Found ${missingBuckets.length} missing buckets:`);
  missingBuckets.forEach(bucket => console.log(`  - ${bucket}`));
  
  for (const bucketName of missingBuckets) {
    try {
      console.log(`\nCreating bucket: ${bucketName}`);
      
      // Determine if bucket should be public
      const isPublic = bucketName !== EXPECTED_BUCKETS.MANUALS; // manuals should be private
      
      const { data, error } = await supabase.storage.createBucket(bucketName, {
        public: isPublic,
        fileSizeLimit: 52428800, // 50MB
        allowedMimeTypes: null // Allow all file types
      });
      
      if (error) {
        console.log(`  ❌ Failed to create ${bucketName}: ${error.message}`);
        
        if (error.message.includes('already exists')) {
          console.log('  💡 Bucket already exists (race condition or permission issue)');
        }
      } else {
        console.log(`  ✅ Successfully created ${bucketName}`);
      }
      
    } catch (error) {
      console.log(`  ❌ Error creating ${bucketName}: ${error.message}`);
    }
  }
}

async function testStoragePolicies() {
  console.log('\n🔐 Testing Storage Policies');
  console.log('---------------------------');
  
  // Test common policy scenarios
  const policyTests = [
    {
      bucket: 'site_assets',
      description: 'Public assets (should allow anonymous read/write)',
      expectation: 'Allow all operations'
    },
    {
      bucket: 'Profile Photos',
      description: 'Profile photos (should allow authenticated users)',
      expectation: 'May require authentication'
    },
    {
      bucket: 'avatars',
      description: 'User avatars (should allow user access)',
      expectation: 'May require authentication'
    },
    {
      bucket: 'manuals',
      description: 'Private manuals (should be restricted)',
      expectation: 'Restricted access'
    }
  ];
  
  for (const test of policyTests) {
    console.log(`\nTesting: ${test.bucket}`);
    console.log(`Expected: ${test.expectation}`);
    
    // Try to list files without authentication
    try {
      const { data, error } = await supabase.storage
        .from(test.bucket)
        .list('', { limit: 1 });
      
      if (error) {
        if (error.message.includes('policy')) {
          console.log(`  ⚠️  Policy restriction: ${error.message}`);
          console.log(`  💡 This may be intentional based on bucket purpose`);
        } else {
          console.log(`  ❌ Access error: ${error.message}`);
        }
      } else {
        console.log(`  ✅ Anonymous access allowed`);
        if (test.bucket === 'manuals' && data) {
          console.log(`  ⚠️  Warning: Private bucket is publicly accessible!`);
        }
      }
    } catch (error) {
      console.log(`  ❌ Test error: ${error.message}`);
    }
  }
}

async function runStorageTests() {
  try {
    // Step 1: List all existing buckets
    const existingBuckets = await listAllBuckets();
    
    if (existingBuckets === null) {
      console.log('\n❌ Cannot proceed with tests - unable to access storage');
      return;
    }
    
    // Step 2: Create missing buckets
    await createMissingBuckets(existingBuckets);
    
    // Step 3: Test each expected bucket
    console.log('\n🧪 Testing Individual Buckets');
    console.log('=============================');
    
    for (const bucketName of Object.values(EXPECTED_BUCKETS)) {
      await testBucketAccess(bucketName);
    }
    
    // Step 4: Test storage policies
    await testStoragePolicies();
    
    // Step 5: Summary
    console.log('\n📊 Storage Test Summary');
    console.log('======================');
    console.log('If any tests failed above, the issues are likely:');
    console.log('1. Missing storage buckets (can be created)');
    console.log('2. Incorrect bucket policies (need to be configured)');
    console.log('3. Supabase storage not properly enabled');
    console.log('4. Network connectivity issues');
    console.log('\nCheck the Supabase dashboard Storage section for detailed configuration.');
    
  } catch (error) {
    console.error('Storage test failed:', error);
  }
}

// Run the tests
runStorageTests();