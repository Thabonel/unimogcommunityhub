#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function updateSupabaseKeys() {
  console.log('🔧 Supabase Key Update Tool\n');
  
  console.log('📋 Instructions:');
  console.log('1. Go to your Supabase Dashboard:');
  console.log(`   https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor/settings/api\n`);
  console.log('2. Find the "Project API keys" section\n');
  console.log('3. Copy the keys when prompted below\n');
  
  try {
    // Get current .env path
    const envPath = path.join(__dirname, '..', '.env');
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Ask for anon key
    const anonKey = await question('Paste your "anon" public key (or press Enter to skip): ');
    
    if (anonKey.trim()) {
      envContent = envContent.replace(
        /VITE_SUPABASE_ANON_KEY=.*/,
        `VITE_SUPABASE_ANON_KEY=${anonKey.trim()}`
      );
      console.log('✅ Updated anon key');
    }
    
    // Ask for service role key
    const serviceKey = await question('\nPaste your "service_role" key for admin access (or press Enter to skip): ');
    
    if (serviceKey.trim()) {
      // Check if service role key exists in .env
      if (envContent.includes('SUPABASE_SERVICE_ROLE_KEY=')) {
        envContent = envContent.replace(
          /SUPABASE_SERVICE_ROLE_KEY=.*/,
          `SUPABASE_SERVICE_ROLE_KEY=${serviceKey.trim()}`
        );
      } else {
        // Add it after the anon key
        envContent = envContent.replace(
          /(VITE_SUPABASE_ANON_KEY=.*)/,
          `$1\nSUPABASE_SERVICE_ROLE_KEY=${serviceKey.trim()}`
        );
      }
      console.log('✅ Updated service role key');
    }
    
    // Write back to .env
    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ .env file updated successfully!');
    
    // Test the new keys
    console.log('\n🧪 Testing new keys...');
    const { createClient } = await import('@supabase/supabase-js');
    
    // Reload env
    const updatedEnv = {};
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        updatedEnv[key.trim()] = valueParts.join('=').trim();
      }
    });
    
    const supabase = createClient(
      updatedEnv.VITE_SUPABASE_URL,
      updatedEnv.VITE_SUPABASE_ANON_KEY
    );
    
    const { error } = await supabase.from('wis_servers').select('*', { head: true });
    
    if (error) {
      console.log('❌ Connection test failed:', error.message);
    } else {
      console.log('✅ Connection test successful!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    rl.close();
  }
}

updateSupabaseKeys();