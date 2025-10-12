#!/usr/bin/env tsx
/**
 * Create WIS storage buckets via Supabase Management API
 *
 * Usage:
 *   SUPABASE_ACCESS_TOKEN=<your-token> tsx scripts/create-wis-storage-buckets.ts
 *
 * To get access token:
 *   1. Go to https://supabase.com/dashboard/account/tokens
 *   2. Generate new token
 *   3. Copy and use as SUPABASE_ACCESS_TOKEN
 */

const SUPABASE_PROJECT_REF = 'ydevatqwkoccxhtejdor';
const SUPABASE_ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;

if (!SUPABASE_ACCESS_TOKEN) {
  console.error('❌ Missing SUPABASE_ACCESS_TOKEN environment variable');
  console.error('');
  console.error('To get your access token:');
  console.error('1. Go to https://supabase.com/dashboard/account/tokens');
  console.error('2. Click "Generate New Token"');
  console.error('3. Copy the token');
  console.error('4. Run: SUPABASE_ACCESS_TOKEN=<token> tsx scripts/create-wis-storage-buckets.ts');
  process.exit(1);
}

const API_BASE = `https://api.supabase.com/v1/projects/${SUPABASE_PROJECT_REF}/storage/buckets`;

type BucketConfig = {
  name: string;
  public: boolean;
  file_size_limit: number;
  allowed_mime_types: string[];
};

const BUCKETS: BucketConfig[] = [
  {
    name: 'wis-docs',
    public: true,
    file_size_limit: 52428800, // 50MB
    allowed_mime_types: ['text/html', 'application/pdf'],
  },
  {
    name: 'wis-archives',
    public: false,
    file_size_limit: 52428800, // 50MB
    allowed_mime_types: ['application/json', 'application/zip', 'application/x-tar'],
  },
  {
    name: 'wis-media',
    public: true,
    file_size_limit: 10485760, // 10MB
    allowed_mime_types: [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/gif',
      'image/webp',
      'video/mp4',
    ],
  },
];

async function createBucket(config: BucketConfig): Promise<boolean> {
  console.log(`\n📦 Creating bucket: ${config.name}`);
  console.log(`   Public: ${config.public ? 'Yes' : 'No'}`);
  console.log(`   Size limit: ${(config.file_size_limit / 1024 / 1024).toFixed(0)}MB`);
  console.log(`   MIME types: ${config.allowed_mime_types.join(', ')}`);

  try {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: config.name,
        name: config.name,
        public: config.public,
        file_size_limit: config.file_size_limit,
        allowed_mime_types: config.allowed_mime_types,
      }),
    });

    if (!response.ok) {
      const error = await response.text();

      // Check if bucket already exists
      if (error.includes('already exists') || response.status === 409) {
        console.log(`   ⚠️  Bucket already exists - skipping`);
        return true;
      }

      console.error(`   ❌ Failed: ${response.status} ${response.statusText}`);
      console.error(`   ${error}`);
      return false;
    }

    const result = await response.json();
    console.log(`   ✅ Created successfully`);
    return true;
  } catch (error) {
    console.error(`   ❌ Error:`, error instanceof Error ? error.message : error);
    return false;
  }
}

async function verifyBuckets() {
  console.log('\n🔍 Verifying buckets...\n');

  try {
    const response = await fetch(API_BASE, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('❌ Failed to list buckets');
      return;
    }

    const buckets = await response.json();
    const wisBuckets = buckets.filter((b: any) => b.name.startsWith('wis-'));

    if (wisBuckets.length === 0) {
      console.log('⚠️  No WIS buckets found');
      return;
    }

    console.log('📋 WIS Buckets:\n');
    for (const bucket of wisBuckets) {
      console.log(`   ${bucket.name}`);
      console.log(`     Public: ${bucket.public ? 'Yes' : 'No'}`);
      console.log(`     Size limit: ${(bucket.file_size_limit / 1024 / 1024).toFixed(0)}MB`);
      console.log(`     MIME types: ${bucket.allowed_mime_types?.join(', ') || 'Any'}`);
      console.log('');
    }
  } catch (error) {
    console.error('❌ Error verifying buckets:', error instanceof Error ? error.message : error);
  }
}

async function main() {
  console.log('🚀 WIS Storage Buckets Creation Script');
  console.log('==========================================');
  console.log(`Project: ${SUPABASE_PROJECT_REF}`);
  console.log(`Buckets to create: ${BUCKETS.length}`);

  let successCount = 0;
  let failCount = 0;

  for (const config of BUCKETS) {
    const success = await createBucket(config);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  }

  console.log('\n==========================================');
  console.log(`✅ Success: ${successCount}/${BUCKETS.length}`);
  if (failCount > 0) {
    console.log(`❌ Failed: ${failCount}/${BUCKETS.length}`);
  }

  // Verify buckets exist
  await verifyBuckets();

  console.log('==========================================');
  console.log('\n📝 Next Steps:');
  console.log('1. Configure RLS policies via Dashboard:');
  console.log('   https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor/storage/buckets');
  console.log('');
  console.log('2. See policy configurations in:');
  console.log('   docs/wis-project/CREATE_WIS_STORAGE_BUCKETS.md');
  console.log('');
  console.log('3. Apply schema migration (Migration 3):');
  console.log('   20251012000003_fix_wis_procedures_for_etl.sql');
  console.log('');

  if (failCount > 0) {
    process.exit(1);
  }
}

main();
