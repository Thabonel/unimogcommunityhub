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

const REQUIRED_BUCKETS = [
  'avatars',
  'profile_photos', 
  'vehicle_photos',
  'manuals',
  'article_files',
  'site_assets'
];

async function testStorageSetup() {
  console.log('🔍 Testing Supabase Storage Setup...\n');
  
  try {
    // List existing buckets
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('❌ Error listing buckets:', listError.message);
      console.error('\nPossible causes:');
      console.error('1. Storage is not enabled in your Supabase project');
      console.error('2. RLS policies are blocking access');
      console.error('3. Invalid credentials\n');
      return;
    }
    
    const existingBuckets = buckets?.map(b => b.name) || [];
    console.log('✅ Connected to Supabase Storage');
    console.log(`📦 Found ${existingBuckets.length} existing buckets:`, existingBuckets);
    
    // Check required buckets
    console.log('\n📋 Checking required buckets:');
    const missingBuckets = [];
    
    for (const bucketName of REQUIRED_BUCKETS) {
      if (existingBuckets.includes(bucketName)) {
        console.log(`  ✅ ${bucketName}`);
      } else {
        console.log(`  ❌ ${bucketName} (missing)`);
        missingBuckets.push(bucketName);
      }
    }
    
    if (missingBuckets.length > 0) {
      console.log('\n🔧 Attempting to create missing buckets...');
      
      for (const bucketName of missingBuckets) {
        const { error: createError } = await supabase.storage.createBucket(bucketName, {
          public: bucketName !== 'manuals', // manuals bucket should be private
          fileSizeLimit: 52428800 // 50MB
        });
        
        if (createError) {
          console.error(`  ❌ Failed to create ${bucketName}:`, createError.message);
        } else {
          console.log(`  ✅ Created ${bucketName}`);
        }
      }
    }
    
    // Test bucket access
    console.log('\n🔐 Testing bucket access:');
    const testBucket = existingBuckets[0] || REQUIRED_BUCKETS[0];
    
    if (testBucket) {
      const { data: files, error: accessError } = await supabase.storage
        .from(testBucket)
        .list('', { limit: 1 });
        
      if (accessError) {
        console.error(`  ❌ Cannot access bucket '${testBucket}':`, accessError.message);
        console.error('\n  Possible RLS policy issue. Check your Supabase dashboard.');
      } else {
        console.log(`  ✅ Can access bucket '${testBucket}'`);
      }
    }
    
    console.log('\n✨ Storage test complete!');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testStorageSetup();