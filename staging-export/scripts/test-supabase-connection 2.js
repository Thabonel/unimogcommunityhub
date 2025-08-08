#!/usr/bin/env node

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

console.log('🔍 Testing Supabase connection...\n');

// Show current configuration (masked)
console.log('📋 Current configuration:');
console.log(`SUPABASE_URL: ${process.env.VITE_SUPABASE_URL}`);
console.log(`ANON_KEY: ${process.env.VITE_SUPABASE_ANON_KEY?.substring(0, 20)}...`);
console.log(`PROJECT_ID: ${process.env.VITE_SUPABASE_PROJECT_ID}\n`);

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase configuration');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    // Test 1: Basic connection
    console.log('1️⃣ Testing basic connection...');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.log(`❌ Auth error: ${authError.message}`);
    } else {
      console.log('✅ Basic connection successful');
      console.log(`   Session: ${authData.session ? 'Active' : 'None'}`);
    }
    
    // Test 2: Query a simple table
    console.log('\n2️⃣ Testing table access...');
    const { data: testData, error: testError, count } = await supabase
      .from('wis_servers')
      .select('*', { count: 'exact', head: true });
    
    if (testError) {
      console.log(`❌ Table access error: ${testError.message}`);
      
      // If it's an API key error, provide instructions
      if (testError.message.includes('Invalid API key')) {
        console.log('\n🔧 To fix this issue:\n');
        console.log('1. Go to your Supabase Dashboard:');
        console.log(`   https://supabase.com/dashboard/project/${process.env.VITE_SUPABASE_PROJECT_ID}/settings/api\n`);
        console.log('2. Copy the "anon" public key (under Project API keys)\n');
        console.log('3. Update your .env file with:');
        console.log('   VITE_SUPABASE_ANON_KEY=<your-new-anon-key>\n');
        console.log('4. If you need admin access, also add:');
        console.log('   SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>');
      }
    } else {
      console.log('✅ Table access successful');
      console.log(`   wis_servers count: ${count || 0}`);
    }
    
    // Test 3: Try RPC function
    console.log('\n3️⃣ Testing RPC functions...');
    const { data: rpcData, error: rpcError } = await supabase
      .rpc('get_available_server');
    
    if (rpcError) {
      console.log(`❌ RPC error: ${rpcError.message}`);
    } else {
      console.log('✅ RPC functions working');
      console.log(`   Available servers: ${rpcData?.length || 0}`);
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testConnection();