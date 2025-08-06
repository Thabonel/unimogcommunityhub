#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDatabaseStructure() {
  console.log('🔍 Checking Supabase Database Structure...\n');

  try {
    // Check all tables
    console.log('📋 Checking Tables:');
    
    const tables = [
      'profiles',
      'vehicles', 
      'community_articles',
      'user_subscriptions',
      'manuals',
      'manual_categories',
      'maintenance_schedules',
      'service_logs',
      'locations',
      'forum_categories',
      'forum_posts',
      'forum_replies',
      'marketplace_listings'
    ];

    for (const table of tables) {
      try {
        const { data, error, count } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          console.log(`  ❌ ${table}: ${error.message}`);
        } else {
          console.log(`  ✅ ${table}: exists (${count || 0} rows)`);
        }
      } catch (err) {
        console.log(`  ❌ ${table}: Error checking table`);
      }
    }

    // Check profiles table structure
    console.log('\n📊 Profiles Table Columns:');
    const { data: profileSample, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (!profileError && profileSample && profileSample.length > 0) {
      const columns = Object.keys(profileSample[0]);
      console.log('  Columns:', columns.join(', '));
    } else if (profileError) {
      console.log('  ❌ Error:', profileError.message);
    }

    // Check storage buckets
    console.log('\n📦 Storage Buckets:');
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    
    if (bucketError) {
      console.log('  ❌ Error listing buckets:', bucketError.message);
    } else if (buckets) {
      if (buckets.length === 0) {
        console.log('  ⚠️ No storage buckets found');
      } else {
        buckets.forEach(bucket => {
          console.log(`  ✅ ${bucket.name} (${bucket.public ? 'public' : 'private'})`);
        });
      }
    }

    // Check for duplicate or extra tables
    console.log('\n🔍 Checking for potential issues:');
    
    // Check if we can query community_articles
    const { error: articlesError } = await supabase
      .from('community_articles')
      .select('id, title')
      .limit(1);
    
    if (articlesError) {
      console.log('  ⚠️ community_articles issue:', articlesError.message);
    } else {
      console.log('  ✅ community_articles is accessible');
    }

    // Check user_subscriptions
    const { error: subError } = await supabase
      .from('user_subscriptions')
      .select('id')
      .limit(1);
    
    if (subError) {
      console.log('  ⚠️ user_subscriptions issue:', subError.message);
    } else {
      console.log('  ✅ user_subscriptions is accessible');
    }

    console.log('\n✨ Database structure check complete!');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

checkDatabaseStructure();