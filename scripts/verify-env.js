#!/usr/bin/env node

/**
 * Environment Variables Verification Script
 * This script checks if all required environment variables are properly set
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const REQUIRED_VARS = {
  'VITE_SUPABASE_URL': 'Supabase Project URL',
  'VITE_SUPABASE_ANON_KEY': 'Supabase Anonymous Key',
  'VITE_MAPBOX_ACCESS_TOKEN': 'Mapbox Access Token',
  'VITE_OPENAI_API_KEY': 'OpenAI API Key'
};

const OPTIONAL_VARS = {
  'VITE_STRIPE_PREMIUM_MONTHLY_PRICE_ID': 'Stripe Monthly Price ID',
  'VITE_STRIPE_LIFETIME_PRICE_ID': 'Stripe Lifetime Price ID',
  'VITE_APP_URL': 'Application URL'
};

console.log('🔍 Environment Variables Verification\n');
console.log('=' .repeat(50));

// Check required variables
console.log('\n📋 REQUIRED Environment Variables:\n');
let hasErrors = false;

for (const [key, description] of Object.entries(REQUIRED_VARS)) {
  const value = process.env[key];
  
  if (!value || value === '') {
    console.log(`❌ ${key}: MISSING - ${description}`);
    hasErrors = true;
  } else if (value.includes('YOUR_') || value.includes('your_')) {
    console.log(`⚠️  ${key}: PLACEHOLDER VALUE - Please update with real value`);
    hasErrors = true;
  } else {
    // Mask the value for security
    const masked = value.substring(0, 10) + '...' + value.substring(value.length - 4);
    console.log(`✅ ${key}: Set (${masked})`);
  }
}

// Check optional variables
console.log('\n📋 OPTIONAL Environment Variables:\n');

for (const [key, description] of Object.entries(OPTIONAL_VARS)) {
  const value = process.env[key];
  
  if (!value || value === '') {
    console.log(`⚠️  ${key}: Not set - ${description}`);
  } else {
    const masked = value.length > 14 ? value.substring(0, 10) + '...' + value.substring(value.length - 4) : value;
    console.log(`✅ ${key}: Set (${masked})`);
  }
}

// Test Supabase connection
console.log('\n🔗 Testing Supabase Connection...\n');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (supabaseUrl && supabaseKey && !supabaseUrl.includes('YOUR_') && !supabaseKey.includes('YOUR_')) {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Try to get session (won't fail even if not authenticated)
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.log('❌ Supabase connection failed:', error.message);
      if (error.message.includes('Invalid API key')) {
        console.log('\n⚠️  The Supabase API key appears to be invalid.');
        console.log('   Please check that you have the correct anon key from your Supabase dashboard.');
      }
    } else {
      console.log('✅ Supabase connection successful!');
      
      // Try to check if tables exist
      const { error: tableError } = await supabase.from('profiles').select('id').limit(1);
      
      if (!tableError) {
        console.log('✅ Database tables are accessible');
      } else if (tableError.message.includes('Invalid API key')) {
        console.log('❌ Invalid API key - cannot access database');
      } else {
        console.log('⚠️  Database connection works but tables might not be set up');
      }
    }
  } catch (error) {
    console.log('❌ Error testing Supabase:', error.message);
  }
} else {
  console.log('⚠️  Cannot test Supabase connection - missing or invalid credentials');
}

// Summary
console.log('\n' + '=' .repeat(50));
if (hasErrors) {
  console.log('\n❌ CONFIGURATION ISSUES DETECTED\n');
  console.log('To fix the issues:');
  console.log('1. Create a .env file in the project root if it doesn\'t exist');
  console.log('2. Copy .env.example to .env');
  console.log('3. Fill in the missing values with your actual credentials');
  console.log('\nFor deployment (Netlify/Vercel):');
  console.log('1. Go to your deployment platform\'s dashboard');
  console.log('2. Navigate to Environment Variables settings');
  console.log('3. Add all the required variables listed above');
  console.log('4. Redeploy your application');
} else {
  console.log('\n✅ All required environment variables are configured!\n');
  console.log('If you\'re still having issues:');
  console.log('1. Make sure your deployment platform has the same variables');
  console.log('2. Try clearing your browser cache');
  console.log('3. Check that your Supabase project is active and not paused');
}

console.log('\n');
process.exit(hasErrors ? 1 : 0);