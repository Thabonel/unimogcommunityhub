#!/usr/bin/env node

// This script needs to be run with service role key to create storage buckets
// You need to get your service role key from Supabase dashboard:
// Settings > API > service_role (secret)

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;

// IMPORTANT: You need to temporarily add your service role key here
// Get it from: Supabase Dashboard > Settings > API > service_role
const SERVICE_ROLE_KEY = 'YOUR_SERVICE_ROLE_KEY_HERE';

if (!supabaseUrl) {
  console.error('❌ Missing VITE_SUPABASE_URL in .env file');
  process.exit(1);
}

if (SERVICE_ROLE_KEY === 'YOUR_SERVICE_ROLE_KEY_HERE') {
  console.error('❌ Please add your service role key to this script');
  console.error('Get it from: Supabase Dashboard > Settings > API > service_role (secret)');
  console.error('Edit this file and replace YOUR_SERVICE_ROLE_KEY_HERE with the actual key');
  process.exit(1);
}

// Create client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createStorageBuckets() {
  console.log('🔧 Creating Storage Buckets with Service Role...\n');

  const bucketsToCreate = [
    { name: 'avatars', public: true },
    { name: 'profile_photos', public: true },
    { name: 'vehicle_photos', public: true },
    { name: 'manuals', public: false },
    { name: 'article_files', public: true },
    { name: 'site_assets', public: true }
  ];

  for (const bucket of bucketsToCreate) {
    try {
      // Check if bucket exists
      const { data: existing } = await supabase.storage.getBucket(bucket.name);
      
      if (existing) {
        console.log(`  ⚠️ ${bucket.name} already exists`);
        continue;
      }

      // Create bucket
      const { data, error } = await supabase.storage.createBucket(bucket.name, {
        public: bucket.public,
        fileSizeLimit: bucket.name === 'manuals' ? 104857600 : 52428800, // 100MB for manuals, 50MB for others
        allowedMimeTypes: bucket.name === 'manuals' 
          ? ['application/pdf']
          : ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      });

      if (error) {
        console.error(`  ❌ Failed to create ${bucket.name}:`, error.message);
      } else {
        console.log(`  ✅ Created ${bucket.name} (${bucket.public ? 'public' : 'private'})`);
      }
    } catch (err) {
      console.error(`  ❌ Error with ${bucket.name}:`, err.message);
    }
  }

  // Verify all buckets
  console.log('\n📦 Verifying buckets:');
  const { data: buckets, error } = await supabase.storage.listBuckets();
  
  if (error) {
    console.error('  ❌ Error listing buckets:', error.message);
  } else if (buckets) {
    buckets.forEach(bucket => {
      console.log(`  ✅ ${bucket.name} exists`);
    });
  }

  console.log('\n✨ Storage bucket creation complete!');
  console.log('\n⚠️ IMPORTANT: Remove the service role key from this script after use!');
}

createStorageBuckets();