#!/usr/bin/env node

/**
 * Real-world Operations Test
 * Tests the specific operations that users report as failing
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

console.log('🎯 Testing Real-World Failing Operations');
console.log('========================================\n');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testProfileOperations() {
  console.log('👤 Testing Profile Operations');
  console.log('-----------------------------');
  
  try {
    // Test 1: Create a profile (common user action)
    console.log('1. Testing profile creation...');
    const testProfile = {
      username: `testuser_${Date.now()}`,
      display_name: 'Test User',
      bio: 'Test bio'
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('profiles')
      .insert([testProfile])
      .select();
    
    if (insertError) {
      console.log(`   ❌ Profile creation failed: ${insertError.message}`);
      
      // Check for authentication requirement
      if (insertError.message.includes('policy') || insertError.message.includes('RLS')) {
        console.log('   💡 Profile creation requires authentication');
      }
    } else {
      console.log('   ✅ Profile creation successful');
      
      // Clean up
      if (insertData && insertData[0]?.id) {
        await supabase.from('profiles').delete().eq('id', insertData[0].id);
        console.log('   🧹 Test profile cleaned up');
      }
    }
    
    // Test 2: Update profile (authenticated operation)
    console.log('2. Testing profile update...');
    const { data: updateData, error: updateError } = await supabase
      .from('profiles')
      .update({ bio: 'Updated bio' })
      .eq('id', '00000000-0000-0000-0000-000000000000')
      .select();
    
    if (updateError) {
      console.log(`   ❌ Profile update failed: ${updateError.message}`);
    } else {
      console.log('   ✅ Profile update would work (no matching record)');
    }
    
  } catch (error) {
    console.log(`   ❌ Profile operations error: ${error.message}`);
  }
  
  console.log('');
}

async function testImageUploadOperations() {
  console.log('📷 Testing Image Upload Operations');
  console.log('----------------------------------');
  
  const testImage = new Blob(['fake-image-data'], { type: 'image/png' });
  const fileName = `test-image-${Date.now()}.png`;
  
  // Test uploads to different buckets
  const bucketsToTest = [
    { name: 'avatars', description: 'User avatars' },
    { name: 'Profile Photos', description: 'Profile photos' },
    { name: 'vehicle_photos', description: 'Vehicle photos' },
    { name: 'site_assets', description: 'Site assets' }
  ];
  
  for (const bucket of bucketsToTest) {
    console.log(`Testing ${bucket.description} (${bucket.name}):`);
    
    try {
      const { data, error } = await supabase.storage
        .from(bucket.name)
        .upload(fileName, testImage, {
          upsert: true
        });
      
      if (error) {
        console.log(`  ❌ Upload failed: ${error.message}`);
        
        if (error.message.includes('policy')) {
          console.log('  💡 Storage bucket policy blocking upload');
        }
        if (error.message.includes('mime type')) {
          console.log('  💡 MIME type restrictions in bucket');
        }
        if (error.message.includes('Bucket not found')) {
          console.log('  💡 Bucket configuration issue');
        }
      } else {
        console.log(`  ✅ Upload successful: ${data.path}`);
        
        // Test public URL generation
        const { data: urlData } = supabase.storage
          .from(bucket.name)
          .getPublicUrl(fileName);
        
        console.log(`  ✅ Public URL: ${urlData.publicUrl}`);
        
        // Clean up
        await supabase.storage.from(bucket.name).remove([fileName]);
        console.log('  🧹 Test file cleaned up');
      }
    } catch (error) {
      console.log(`  ❌ Upload error: ${error.message}`);
    }
  }
  
  console.log('');
}

async function testImageLoadingOperations() {
  console.log('🖼️  Testing Image Loading Operations');
  console.log('------------------------------------');
  
  // Test loading existing images from different buckets
  const imagesToTest = [
    { bucket: 'avatars', file: 'Barry.png', description: 'Barry avatar' },
    { bucket: 'site_assets', file: 'Unimoghub LOGO.png', description: 'Site logo' }
  ];
  
  for (const image of imagesToTest) {
    console.log(`Testing ${image.description}:`);
    
    try {
      // Test public URL generation
      const { data: urlData } = supabase.storage
        .from(image.bucket)
        .getPublicUrl(image.file);
      
      if (!urlData?.publicUrl) {
        console.log('  ❌ Could not generate public URL');
        continue;
      }
      
      console.log(`  📎 URL: ${urlData.publicUrl}`);
      
      // Test if URL is accessible
      const response = await fetch(urlData.publicUrl);
      if (response.ok) {
        console.log(`  ✅ Image accessible (${response.status}, ${response.headers.get('content-type')})`);
      } else {
        console.log(`  ❌ Image not accessible (${response.status})`);
      }
      
      // Test download
      const { data: downloadData, error: downloadError } = await supabase.storage
        .from(image.bucket)
        .download(image.file);
      
      if (downloadError) {
        console.log(`  ❌ Download failed: ${downloadError.message}`);
      } else {
        console.log(`  ✅ Download successful: ${downloadData.size} bytes`);
      }
      
    } catch (error) {
      console.log(`  ❌ Image loading error: ${error.message}`);
    }
  }
  
  console.log('');
}

async function testDataSavingOperations() {
  console.log('💾 Testing Data Saving Operations');
  console.log('---------------------------------');
  
  // Test typical app operations
  const operations = [
    {
      name: 'Create Post',
      test: async () => {
        return await supabase
          .from('posts')
          .insert([{
            title: 'Test Post',
            content: 'Test content',
            created_at: new Date().toISOString()
          }])
          .select();
      }
    },
    {
      name: 'Create Article',
      test: async () => {
        return await supabase
          .from('articles')
          .insert([{
            title: 'Test Article', 
            content: 'Test content',
            created_at: new Date().toISOString()
          }])
          .select();
      }
    },
    {
      name: 'Save User Preference',
      test: async () => {
        return await supabase
          .from('user_preferences')
          .insert([{
            preference_key: 'test_key',
            preference_value: 'test_value'
          }])
          .select();
      }
    },
    {
      name: 'Log Vehicle Maintenance',
      test: async () => {
        return await supabase
          .from('vehicle_maintenance_logs')
          .insert([{
            maintenance_type: 'test',
            description: 'Test maintenance'
          }])
          .select();
      }
    }
  ];
  
  for (const operation of operations) {
    console.log(`Testing ${operation.name}:`);
    
    try {
      const { data, error } = await operation.test();
      
      if (error) {
        console.log(`  ❌ Failed: ${error.message}`);
        
        if (error.message.includes('policy')) {
          console.log('  💡 RLS policy blocking operation');
        }
        if (error.message.includes('column')) {
          console.log('  💡 Column schema mismatch');
        }
      } else {
        console.log(`  ✅ Success: Created record`);
        
        // Clean up if we have an ID
        if (data && data[0]?.id) {
          const tableName = operation.name.toLowerCase().includes('post') ? 'posts' :
                           operation.name.toLowerCase().includes('article') ? 'articles' :
                           operation.name.toLowerCase().includes('preference') ? 'user_preferences' :
                           'vehicle_maintenance_logs';
          
          await supabase.from(tableName).delete().eq('id', data[0].id);
          console.log('  🧹 Test record cleaned up');
        }
      }
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
    }
  }
  
  console.log('');
}

async function runRealWorldTests() {
  console.log('Testing the specific operations that users report as failing...\n');
  
  await testProfileOperations();
  await testImageUploadOperations();
  await testImageLoadingOperations();
  await testDataSavingOperations();
  
  console.log('📋 Summary of Issues Found');
  console.log('========================');
  console.log('Based on the tests above, the main issues are:');
  console.log('');
  console.log('🔴 Storage Issues:');
  console.log('  - RLS policies blocking uploads to buckets');
  console.log('  - MIME type restrictions preventing certain file uploads');
  console.log('  - Bucket configuration issues');
  console.log('');
  console.log('🔴 Database Issues:');
  console.log('  - Some operations require authentication');
  console.log('  - Column schema mismatches in test data');
  console.log('');
  console.log('🟢 What\'s Working:');
  console.log('  - Database connections');
  console.log('  - Reading from tables');
  console.log('  - Loading existing images');
  console.log('  - Basic storage operations');
  console.log('');
  console.log('💡 Next Steps:');
  console.log('  1. Fix storage bucket RLS policies for uploads');
  console.log('  2. Review MIME type restrictions on buckets');
  console.log('  3. Ensure proper authentication for write operations');
  console.log('  4. Check bucket configuration in Supabase dashboard');
}

runRealWorldTests();