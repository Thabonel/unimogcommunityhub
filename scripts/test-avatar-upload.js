import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAvatarUpload() {
  console.log('🧪 Testing Avatar Bucket Upload');
  console.log('==============================\n');
  
  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    console.log('⚠️  Not authenticated - testing anonymous access');
  } else {
    console.log(`✅ Authenticated as: ${user.email}`);
  }
  
  try {
    // Create a test image file (1x1 pixel PNG)
    const pngData = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
      0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, // IHDR chunk
      0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, // 1x1 dimensions
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
      0xDE, 0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41,
      0x54, 0x78, 0x9C, 0x63, 0xF8, 0x00, 0x00, 0x00,
      0x00, 0x01, 0x00, 0x01, 0x9A, 0xDD, 0xDB, 0x95,
      0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44,
      0xAE, 0x42, 0x60, 0x82
    ]);
    
    const timestamp = Date.now();
    const testFileName = user ? 
      `${user.id}/profile_test_${timestamp}.png` : 
      `anonymous/profile_test_${timestamp}.png`;
    
    console.log(`📤 Uploading test image to avatars bucket...`);
    console.log(`   File path: ${testFileName}`);
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(testFileName, pngData, {
        contentType: 'image/png',
        cacheControl: '3600',
        upsert: true
      });
    
    if (uploadError) {
      console.log(`❌ Upload failed: ${uploadError.message}`);
      
      if (uploadError.message.includes('policy')) {
        console.log('💡 This indicates RLS policy issues');
      }
      
      return false;
    }
    
    console.log(`✅ Upload successful!`);
    console.log(`   Path: ${uploadData.path}`);
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(testFileName);
    
    console.log(`🌐 Public URL: ${publicUrl}`);
    
    // Test if we can access the file
    console.log(`🔍 Testing file accessibility...`);
    
    const { data: signedData, error: signedError } = await supabase.storage
      .from('avatars')
      .createSignedUrl(testFileName, 60);
    
    if (signedError) {
      console.log(`❌ Cannot create signed URL: ${signedError.message}`);
    } else {
      console.log(`✅ File is accessible`);
      console.log(`   Signed URL: ${signedData.signedUrl}`);
    }
    
    // Clean up test file
    console.log(`🧹 Cleaning up test file...`);
    const { error: deleteError } = await supabase.storage
      .from('avatars')
      .remove([testFileName]);
    
    if (deleteError) {
      console.log(`⚠️  Could not delete test file: ${deleteError.message}`);
    } else {
      console.log(`✅ Test file cleaned up successfully`);
    }
    
    return true;
    
  } catch (error) {
    console.error(`❌ Test error: ${error.message}`);
    return false;
  }
}

async function main() {
  const success = await testAvatarUpload();
  
  console.log(`\n🎯 RESULT: ${success ? 'SUCCESS' : 'FAILED'}`);
  
  if (success) {
    console.log('✅ Avatar bucket upload works!');
    console.log('📝 Profile and vehicle photos can now use this bucket');
  } else {
    console.log('❌ Avatar bucket upload failed');
    console.log('🔧 RLS policies may need to be fixed');
  }
}

main();