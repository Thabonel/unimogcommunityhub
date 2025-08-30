import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testUploadCapabilities() {
  console.log('🧪 Testing Upload Capabilities After Policy Fix');
  console.log('================================================\n');
  
  // Check if user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    console.log('⚠️  Not authenticated - will test anonymous access only');
    console.log('📝 To test uploads, you need to be logged in\n');
  } else {
    console.log(`✅ Authenticated as: ${user.email}\n`);
  }
  
  const bucketsToTest = [
    'Profile Photos',
    'vehicle_photos', 
    'user-photos'
  ];
  
  for (const bucket of bucketsToTest) {
    console.log(`🪣 Testing bucket: "${bucket}"`);
    console.log('-'.repeat(bucket.length + 20));
    
    try {
      // Test 1: Can we list files?
      const { data: files, error: listError } = await supabase.storage
        .from(bucket)
        .list('', { limit: 5 });
      
      if (listError) {
        console.log(`❌ List access: ${listError.message}`);
      } else {
        console.log(`✅ List access: OK (${files.length} files)`);
      }
      
      // Test 2: Can we create signed URLs? (indicates read access)
      const { data: signedUrl, error: urlError } = await supabase.storage
        .from(bucket)
        .createSignedUrl('test-file.jpg', 60);
      
      if (urlError) {
        console.log(`❌ URL generation: ${urlError.message}`);
      } else {
        console.log(`✅ URL generation: OK`);
      }
      
      // Test 3: Can we upload? (only if authenticated)
      if (user) {
        // Create a small test file
        const testContent = new Blob(['test content'], { type: 'text/plain' });
        const testFile = new File([testContent], 'test-upload.txt', { type: 'text/plain' });
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(`test-${user.id}/test-upload.txt`, testFile, {
            cacheControl: '3600',
            upsert: true
          });
        
        if (uploadError) {
          if (uploadError.message.includes('policy')) {
            console.log(`❌ Upload test: BLOCKED by RLS policy`);
            console.log(`   This means storage policies still need to be applied!`);
          } else {
            console.log(`❌ Upload test: ${uploadError.message}`);
          }
        } else {
          console.log(`✅ Upload test: SUCCESS`);
          
          // Clean up test file
          await supabase.storage
            .from(bucket)
            .remove([`test-${user.id}/test-upload.txt`]);
          console.log(`🧹 Cleaned up test file`);
        }
      } else {
        console.log(`⏭️  Upload test: Skipped (not authenticated)`);
      }
      
    } catch (err) {
      console.log(`❌ Test failed: ${err.message}`);
    }
    
    console.log('');
  }
  
  if (user) {
    console.log('🎯 SUMMARY FOR AUTHENTICATED USER:');
    console.log('=================================');
    console.log('If you see "BLOCKED by RLS policy" above, you need to:');
    console.log('1. Apply storage policies via Supabase Dashboard');
    console.log('2. Use the SQL from STORAGE_FIX_INSTRUCTIONS.md');
    console.log('3. Test upload again after applying policies');
  } else {
    console.log('🔑 To test upload capabilities:');
    console.log('===============================');
    console.log('1. Log into the app first');
    console.log('2. Then run this script again');
  }
}

testUploadCapabilities();