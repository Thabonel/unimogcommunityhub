import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔧 Storage RLS Policy Fix Script');
console.log('================================\n');

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables:');
  console.error('VITE_SUPABASE_URL:', !!supabaseUrl);
  console.error('SUPABASE_SERVICE_ROLE_KEY (or anon key as fallback):', !!supabaseServiceKey);
  console.log('\n💡 Make sure your .env file contains:');
  console.log('VITE_SUPABASE_URL=https://your-project.supabase.co');
  console.log('SUPABASE_SERVICE_ROLE_KEY=your_service_role_key');
  process.exit(1);
}

// Use service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// All the buckets that need RLS policies
const BUCKETS = [
  'Profile Photos',  // With space and capitals (as expected by frontend)
  'profile_photos',  // Fallback (lowercase, no space) 
  'vehicle_photos',  // Vehicle photos
  'user-photos',     // User photos (with dash)
  'avatars'          // Avatars bucket
];

async function checkCurrentBuckets() {
  console.log('📋 Checking current storage buckets...\n');
  
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('❌ Failed to list buckets:', error.message);
      return false;
    }
    
    console.log('✅ Current buckets:');
    buckets.forEach(bucket => {
      const isNeeded = BUCKETS.includes(bucket.name);
      console.log(`   ${isNeeded ? '✅' : '⚪'} ${bucket.name} ${isNeeded ? '(NEEDED)' : ''}`);
    });
    
    console.log('\n📋 Required buckets:');
    BUCKETS.forEach(bucketName => {
      const exists = buckets.some(b => b.name === bucketName);
      console.log(`   ${exists ? '✅' : '❌'} ${bucketName} ${exists ? '(EXISTS)' : '(MISSING)'}`);
    });
    
    return true;
  } catch (error) {
    console.error('❌ Exception checking buckets:', error.message);
    return false;
  }
}

async function createMissingBuckets() {
  console.log('\n🔨 Creating missing storage buckets...\n');
  
  const { data: existingBuckets } = await supabase.storage.listBuckets();
  const existingNames = existingBuckets?.map(b => b.name) || [];
  
  for (const bucketName of BUCKETS) {
    if (!existingNames.includes(bucketName)) {
      console.log(`📁 Creating bucket: "${bucketName}"...`);
      
      try {
        const { data, error } = await supabase.storage.createBucket(bucketName, {
          public: true,
          fileSizeLimit: 52428800, // 50MB
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
        });
        
        if (error) {
          console.log(`❌ Failed to create "${bucketName}": ${error.message}`);
        } else {
          console.log(`✅ Created bucket: "${bucketName}"`);
        }
      } catch (err) {
        console.log(`❌ Exception creating "${bucketName}": ${err.message}`);
      }
    } else {
      console.log(`✅ Bucket already exists: "${bucketName}"`);
    }
  }
}

async function applyRLSPolicies() {
  console.log('\n🔒 Applying RLS Policies...\n');
  
  // Read our comprehensive migration file
  const migrationPath = path.join(process.cwd(), 'supabase/migrations/20250809_fix_storage_rls_policies.sql');
  
  if (!fs.existsSync(migrationPath)) {
    console.log('❌ Migration file not found at:', migrationPath);
    console.log('🔄 Applying policies directly instead...\n');
    
    // Apply policies directly
    return await applyPoliciesDirectly();
  }
  
  try {
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    console.log('📁 Loaded migration file');
    console.log(`📏 Migration size: ${migrationSQL.length} characters\n`);
    
    // Try to apply the full migration via RPC if available
    try {
      const { data, error } = await supabase.rpc('exec_sql', { sql: migrationSQL });
      
      if (error) {
        console.log('❌ RPC method failed:', error.message);
        console.log('🔄 Trying alternative approach...\n');
        return await applyPoliciesDirectly();
      } else {
        console.log('✅ Full migration applied successfully!');
        return true;
      }
    } catch (rpcError) {
      console.log('❌ RPC not available:', rpcError.message);
      console.log('🔄 Applying policies individually...\n');
      return await applyPoliciesDirectly();
    }
  } catch (error) {
    console.error('❌ Error reading migration file:', error.message);
    return false;
  }
}

async function applyPoliciesDirectly() {
  console.log('🔧 Applying individual policies...\n');
  
  // Individual policy statements
  const policies = [];
  
  // Generate policies for each bucket
  BUCKETS.forEach(bucketName => {
    const safeBucketName = bucketName.replace(/[^a-zA-Z0-9_]/g, '_');
    
    policies.push({
      name: `${bucketName} - Upload Policy`,
      sql: `
        DROP POLICY IF EXISTS "${safeBucketName}_upload_policy" ON storage.objects;
        CREATE POLICY "${safeBucketName}_upload_policy"
          ON storage.objects FOR INSERT
          WITH CHECK (bucket_id = '${bucketName}' AND auth.uid() IS NOT NULL);
      `
    });
    
    policies.push({
      name: `${bucketName} - Read Policy`,
      sql: `
        DROP POLICY IF EXISTS "${safeBucketName}_read_policy" ON storage.objects;
        CREATE POLICY "${safeBucketName}_read_policy"
          ON storage.objects FOR SELECT
          USING (bucket_id = '${bucketName}');
      `
    });
    
    policies.push({
      name: `${bucketName} - Update Policy`,
      sql: `
        DROP POLICY IF EXISTS "${safeBucketName}_update_policy" ON storage.objects;
        CREATE POLICY "${safeBucketName}_update_policy"
          ON storage.objects FOR UPDATE
          USING (bucket_id = '${bucketName}' AND owner = auth.uid()::text);
      `
    });
    
    policies.push({
      name: `${bucketName} - Delete Policy`,
      sql: `
        DROP POLICY IF EXISTS "${safeBucketName}_delete_policy" ON storage.objects;
        CREATE POLICY "${safeBucketName}_delete_policy"
          ON storage.objects FOR DELETE
          USING (bucket_id = '${bucketName}' AND owner = auth.uid()::text);
      `
    });
  });
  
  // Apply basic setup first
  const setupPolicies = [
    {
      name: 'Enable RLS on storage.objects',
      sql: 'ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;'
    }
  ];
  
  let successCount = 0;
  let totalCount = setupPolicies.length + policies.length;
  
  // Apply setup policies
  for (const policy of setupPolicies) {
    console.log(`📝 ${policy.name}...`);
    try {
      // Try using the SQL editor approach (this might work with service role)
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'apikey': supabaseServiceKey
        },
        body: JSON.stringify({ sql: policy.sql })
      });
      
      if (response.ok) {
        console.log('✅ Applied successfully');
        successCount++;
      } else {
        const error = await response.text();
        console.log(`❌ Failed: ${error}`);
      }
    } catch (err) {
      console.log(`❌ Exception: ${err.message}`);
    }
  }
  
  // Apply individual policies
  for (const policy of policies) {
    console.log(`📝 ${policy.name}...`);
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'apikey': supabaseServiceKey
        },
        body: JSON.stringify({ sql: policy.sql })
      });
      
      if (response.ok) {
        console.log('✅ Applied successfully');
        successCount++;
      } else {
        const error = await response.text();
        console.log(`❌ Failed: ${error}`);
      }
    } catch (err) {
      console.log(`❌ Exception: ${err.message}`);
    }
  }
  
  console.log(`\n📊 Results: ${successCount}/${totalCount} policies applied successfully`);
  return successCount > 0;
}

async function testUpload() {
  console.log('\n🧪 Testing photo upload functionality...\n');
  
  // Create a simple test file
  const testContent = 'test-image-content';
  const testFileName = `test-${Date.now()}.txt`;
  
  for (const bucketName of ['avatars', 'Profile Photos']) {
    console.log(`📤 Testing upload to "${bucketName}"...`);
    
    try {
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(testFileName, testContent, {
          contentType: 'text/plain',
          upsert: true
        });
      
      if (error) {
        console.log(`❌ Upload failed: ${error.message}`);
      } else {
        console.log(`✅ Upload successful: ${data.path}`);
        
        // Clean up test file
        await supabase.storage.from(bucketName).remove([testFileName]);
        console.log('🧹 Test file cleaned up');
      }
    } catch (err) {
      console.log(`❌ Upload exception: ${err.message}`);
    }
  }
}

async function main() {
  try {
    console.log(`🌐 Connecting to: ${supabaseUrl}`);
    console.log(`🔑 Using ${supabaseServiceKey.startsWith('eyJ') ? 'service role' : 'anon'} key\n`);
    
    // Step 1: Check current state
    const checkSuccess = await checkCurrentBuckets();
    if (!checkSuccess) {
      console.log('❌ Failed to check buckets. Exiting...');
      return;
    }
    
    // Step 2: Create missing buckets
    await createMissingBuckets();
    
    // Step 3: Apply RLS policies
    const policySuccess = await applyRLSPolicies();
    
    // Step 4: Test uploads
    if (policySuccess) {
      await testUpload();
    }
    
    console.log('\n🎉 Storage RLS fix attempt completed!');
    console.log('\n📋 Next Steps:');
    console.log('1. Test photo upload in your application');
    console.log('2. Check Supabase Dashboard → Storage → Policies');
    console.log('3. If issues persist, apply policies manually via SQL editor');
    console.log('\n💡 Manual SQL available in: supabase/migrations/20250809_fix_storage_rls_policies.sql');
    
  } catch (error) {
    console.error('💥 Fatal error:', error);
  }
}

main();