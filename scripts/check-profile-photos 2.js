import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing environment variables:');
  console.error('VITE_SUPABASE_URL:', !!supabaseUrl);
  console.error('VITE_SUPABASE_ANON_KEY:', !!supabaseAnonKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkProfilePhotos() {
  try {
    console.log('📷 Checking Profile Photos Bucket');
    console.log('=====================================\n');
    
    // List all files in Profile Photos bucket
    const { data: files, error } = await supabase.storage
      .from('Profile Photos')
      .list('', { 
        limit: 100,
        sortBy: { column: 'updated_at', order: 'desc' }
      });
    
    if (error) {
      console.error('❌ Error listing files:', error);
      return;
    }
    
    console.log(`✅ Found ${files.length} files in 'Profile Photos' bucket:\n`);
    
    if (files.length === 0) {
      console.log('   No files found in the bucket.');
      return;
    }
    
    files.forEach((file, i) => {
      console.log(`${i + 1}. ${file.name}`);
      console.log(`   Size: ${file.metadata?.size || 'unknown'} bytes`);
      console.log(`   Last modified: ${file.updated_at || 'unknown'}`);
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('Profile Photos')
        .getPublicUrl(file.name);
      console.log(`   Public URL: ${publicUrl}`);
      console.log('');
    });
    
    // Test accessing one file if it exists
    if (files.length > 0) {
      const testFile = files[0];
      console.log('🔍 Testing file accessibility...\n');
      
      try {
        const { data, error: signedUrlError } = await supabase.storage
          .from('Profile Photos')
          .createSignedUrl(testFile.name, 300);
          
        if (signedUrlError) {
          console.log('❌ Cannot create signed URL:', signedUrlError.message);
        } else {
          console.log('✅ Signed URL created successfully');
          console.log(`   Signed URL: ${data.signedUrl}`);
        }
      } catch (err) {
        console.error('❌ Error testing file access:', err.message);
      }
    }
    
  } catch (err) {
    console.error('❌ Script error:', err);
  }
}

checkProfilePhotos();