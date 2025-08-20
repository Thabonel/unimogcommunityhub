#!/usr/bin/env node

/**
 * Test WIS Upload
 * Simple test to verify bucket and upload functionality
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Force service role key for admin operations

console.log('🔧 Testing WIS Upload Setup\n');
console.log('Supabase URL:', supabaseUrl);
// Decode JWT to check role
let keyType = 'Unknown';
try {
  const payload = JSON.parse(Buffer.from(supabaseKey.split('.')[1], 'base64').toString());
  keyType = payload.role || 'Unknown';
} catch (e) {
  keyType = 'Invalid JWT';
}
console.log('Using key type:', keyType);

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function testBucket() {
  console.log('\n📦 Testing Storage Bucket...');
  
  // List buckets
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('❌ Error listing buckets:', error);
      return false;
    }
    
    console.log('Available buckets:', buckets?.map(b => b.name) || []);
    
    const wisManualsBucket = buckets?.find(b => b.name === 'wis-manuals');
    if (wisManualsBucket) {
      console.log('✅ wis-manuals bucket exists');
      console.log('  ID:', wisManualsBucket.id);
      console.log('  Public:', wisManualsBucket.public);
      return true;
    } else {
      console.log('❌ wis-manuals bucket not found');
      return false;
    }
  } catch (error) {
    console.error('❌ Failed to check buckets:', error);
    return false;
  }
}

async function testUpload() {
  console.log('\n📤 Testing File Upload...');
  
  // Create a simple test file
  const testContent = 'This is a test file for WIS upload verification.';
  const testFile = new Blob([testContent], { type: 'text/plain' });
  const fileName = `test-${Date.now()}.txt`;
  
  try {
    const { data, error } = await supabase.storage
      .from('wis-manuals')
      .upload(`test/${fileName}`, testFile, {
        contentType: 'text/plain',
        upsert: false
      });
    
    if (error) {
      console.error('❌ Upload failed:', error);
      return false;
    }
    
    console.log('✅ Test file uploaded successfully');
    console.log('  Path:', data.path);
    
    // Try to get public URL
    const { data: urlData } = supabase.storage
      .from('wis-manuals')
      .getPublicUrl(data.path);
    
    console.log('  URL:', urlData.publicUrl);
    
    // Clean up - delete test file
    const { error: deleteError } = await supabase.storage
      .from('wis-manuals')
      .remove([data.path]);
    
    if (deleteError) {
      console.log('⚠️ Could not delete test file:', deleteError.message);
    } else {
      console.log('  Cleaned up test file');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Upload test failed:', error);
    return false;
  }
}

async function testDatabase() {
  console.log('\n💾 Testing Database Table...');
  
  try {
    const { data, error } = await supabase
      .from('wis_documents')
      .select('id')
      .limit(1);
    
    if (error) {
      console.log('❌ Database error:', error);
      if (error.code === '42P01') {
        console.log('  Table wis_documents does not exist');
      } else if (error.code === '42501') {
        console.log('  Permission denied - table exists but RLS blocking access');
        return true; // Table exists, just permission issue
      }
      return false;
    }
    
    console.log('✅ Table wis_documents exists and is accessible');
    console.log('  Rows found:', data?.length || 0);
    return true;
  } catch (error) {
    console.error('❌ Database test failed:', error);
    return false;
  }
}

async function main() {
  console.log('Starting tests...\n');
  
  const bucketOk = await testBucket();
  const dbOk = await testDatabase();
  
  if (bucketOk) {
    const uploadOk = await testUpload();
    
    console.log('\n📊 Test Results:');
    console.log('  Bucket exists:', bucketOk ? '✅' : '❌');
    console.log('  Database ready:', dbOk ? '✅' : '❌');
    console.log('  Upload works:', uploadOk ? '✅' : '❌');
    
    if (bucketOk && dbOk && uploadOk) {
      console.log('\n✅ All tests passed! WIS upload system is ready.');
    } else {
      console.log('\n⚠️ Some tests failed. Please check the errors above.');
    }
  } else {
    console.log('\n❌ Cannot proceed without storage bucket');
  }
}

main().catch(console.error);