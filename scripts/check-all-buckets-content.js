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

const BUCKETS_TO_CHECK = [
  'Profile Photos',
  'vehicle_photos', 
  'user-photos',
  'avatars'
];

async function checkBucket(bucketName) {
  try {
    console.log(`\n🪣 Checking bucket: "${bucketName}"`);
    console.log('='.repeat(bucketName.length + 20));
    
    const { data: files, error } = await supabase.storage
      .from(bucketName)
      .list('', { 
        limit: 100,
        sortBy: { column: 'updated_at', order: 'desc' }
      });
    
    if (error) {
      console.error(`❌ Error: ${error.message}`);
      return;
    }
    
    console.log(`✅ Found ${files.length} files:`);
    
    if (files.length === 0) {
      console.log('   (empty)');
      return;
    }
    
    files.forEach((file, i) => {
      console.log(`\n${i + 1}. ${file.name}`);
      console.log(`   Size: ${file.metadata?.size || 'unknown'} bytes`);
      console.log(`   Modified: ${file.updated_at || 'unknown'}`);
      
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(file.name);
      console.log(`   URL: ${publicUrl}`);
    });
    
  } catch (err) {
    console.error(`❌ Error checking ${bucketName}:`, err.message);
  }
}

async function checkAllBuckets() {
  console.log('📷 Checking All Photo Buckets for Content');
  console.log('==========================================');
  
  for (const bucket of BUCKETS_TO_CHECK) {
    await checkBucket(bucket);
  }
}

checkAllBuckets();