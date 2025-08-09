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

async function listRecursive(bucketName, path = '', depth = 0) {
  if (depth > 3) return; // Prevent infinite recursion
  
  try {
    const { data: items, error } = await supabase.storage
      .from(bucketName)
      .list(path, { 
        limit: 100,
        sortBy: { column: 'updated_at', order: 'desc' }
      });
    
    if (error) {
      console.log('  '.repeat(depth) + `❌ Error: ${error.message}`);
      return;
    }
    
    for (const item of items) {
      const itemPath = path ? `${path}/${item.name}` : item.name;
      const indent = '  '.repeat(depth);
      
      if (item.metadata) {
        // It's a file
        console.log(`${indent}📄 ${item.name} (${item.metadata.size || 'unknown'} bytes)`);
        const { data: { publicUrl } } = supabase.storage
          .from(bucketName)
          .getPublicUrl(itemPath);
        console.log(`${indent}   URL: ${publicUrl}`);
      } else {
        // It's a folder
        console.log(`${indent}📁 ${item.name}/`);
        // Recursively list folder contents
        await listRecursive(bucketName, itemPath, depth + 1);
      }
    }
  } catch (err) {
    console.log('  '.repeat(depth) + `❌ Error: ${err.message}`);
  }
}

async function checkBucketRecursive(bucketName) {
  console.log(`\n🪣 Recursive check: "${bucketName}"`);
  console.log('='.repeat(bucketName.length + 25));
  
  await listRecursive(bucketName);
}

async function main() {
  console.log('📂 Recursive Bucket Content Check');
  console.log('=================================');
  
  const buckets = ['Profile Photos', 'vehicle_photos', 'user-photos'];
  
  for (const bucket of buckets) {
    await checkBucketRecursive(bucket);
  }
}

main();