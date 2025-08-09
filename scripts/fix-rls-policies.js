#!/usr/bin/env node

/**
 * Script to fix Row Level Security policies in Supabase
 * Run this to resolve 403 and 406 errors
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing required environment variables');
  console.error('Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file');
  process.exit(1);
}

console.log('🔧 Fixing Row Level Security Policies\n');
console.log('This script will guide you through fixing the RLS policies.\n');

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function testCurrentPolicies() {
  console.log('📋 Testing current policies...\n');
  
  // Test if we can read from community_articles
  const { data: articles, error: articlesError } = await supabase
    .from('community_articles')
    .select('id')
    .limit(1);
  
  if (articlesError) {
    console.log('❌ Cannot read from community_articles:', articlesError.message);
  } else {
    console.log('✅ Can read from community_articles');
  }
  
  // Test if we can read from profiles
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id')
    .limit(1);
  
  if (profilesError) {
    console.log('❌ Cannot read from profiles:', profilesError.message);
  } else {
    console.log('✅ Can read from profiles');
  }
  
  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (user) {
    console.log(`\n👤 Testing as authenticated user: ${user.email}`);
    
    // Test if we can read our own profile
    const { data: myProfile, error: myProfileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (myProfileError) {
      console.log('❌ Cannot read own profile:', myProfileError.message);
    } else {
      console.log('✅ Can read own profile');
    }
  } else {
    console.log('\n⚠️  Not authenticated - some tests skipped');
  }
}

async function showFixInstructions() {
  console.log('\n📝 TO FIX THE RLS POLICIES:\n');
  console.log('1. Go to your Supabase Dashboard:');
  console.log(`   https://supabase.com/dashboard/project/${supabaseUrl.split('.')[0].split('//')[1]}/sql/new\n`);
  
  console.log('2. Copy and paste the following SQL:\n');
  
  // Read the migration file
  const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20250809_fix_rls_policies.sql');
  const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
  
  console.log('```sql');
  console.log(migrationSQL);
  console.log('```\n');
  
  console.log('3. Click "Run" to execute the SQL\n');
  console.log('4. After running, test your application again\n');
  
  console.log('ALTERNATIVE: If you have the Supabase CLI installed:');
  console.log('   supabase db push --db-url "postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres"\n');
}

async function checkStoragePolicies() {
  console.log('\n📦 Checking Storage Policies...\n');
  
  const buckets = ['profile_photos', 'vehicle_photos', 'avatars'];
  
  for (const bucket of buckets) {
    try {
      // Try to list files in the bucket
      const { data, error } = await supabase.storage
        .from(bucket)
        .list('', { limit: 1 });
      
      if (error) {
        console.log(`❌ Cannot access ${bucket} bucket:`, error.message);
      } else {
        console.log(`✅ Can access ${bucket} bucket`);
      }
    } catch (err) {
      console.log(`❌ Error checking ${bucket} bucket:`, err.message);
    }
  }
  
  console.log('\n📝 TO FIX STORAGE POLICIES:');
  console.log('1. Go to Storage in your Supabase Dashboard');
  console.log('2. For each bucket (profile_photos, vehicle_photos, avatars):');
  console.log('   - Click on the bucket');
  console.log('   - Go to "Policies" tab');
  console.log('   - Ensure these policies exist:');
  console.log('     • SELECT: Allow public read (or authenticated only)');
  console.log('     • INSERT: Allow authenticated users');
  console.log('     • UPDATE: Allow users to update own files');
  console.log('     • DELETE: Allow users to delete own files');
}

// Run the script
async function main() {
  await testCurrentPolicies();
  await showFixInstructions();
  await checkStoragePolicies();
  
  console.log('\n✅ Diagnostics complete!\n');
  console.log('After applying the fixes, your application should work correctly.');
  console.log('If you still have issues, check the browser console for specific errors.');
}

main().catch(console.error);