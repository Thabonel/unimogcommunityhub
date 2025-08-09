#!/usr/bin/env node

// Quick script to verify Supabase connection
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ydevatqwkoccxhtejdor.supabase.co';
const supabaseAnonKey = '<JWT_TOKEN>';

console.log('🔍 Testing Supabase connection...\n');

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    // Test 1: Check if we can connect to the database
    console.log('1. Testing database connection...');
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Database connection failed:', error.message);
      console.error('   Error details:', error);
    } else {
      console.log('✅ Database connection successful!');
    }
    
    // Test 2: Check auth
    console.log('\n2. Testing auth service...');
    const { data: session, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('❌ Auth service failed:', authError.message);
    } else {
      console.log('✅ Auth service accessible!');
      if (session?.session) {
        console.log('   Current session found for:', session.session.user.email);
      } else {
        console.log('   No active session');
      }
    }
    
    // Test 3: Check storage
    console.log('\n3. Testing storage service...');
    const { data: buckets, error: storageError } = await supabase
      .storage
      .listBuckets();
    
    if (storageError) {
      console.error('❌ Storage service failed:', storageError.message);
    } else {
      console.log('✅ Storage service accessible!');
      console.log('   Buckets found:', buckets?.length || 0);
    }
    
    console.log('\n📊 Summary:');
    console.log('   URL:', supabaseUrl);
    console.log('   Key length:', supabaseAnonKey.length);
    console.log('   Key prefix:', supabaseAnonKey.substring(0, 20) + '...');
    
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

testConnection();