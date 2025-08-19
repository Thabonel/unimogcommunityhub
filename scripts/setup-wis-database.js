#!/usr/bin/env node

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Supabase client with service role key for admin access
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase configuration in .env file');
  process.exit(1);
}

console.log('🔧 Setting up WIS EPC database tables...\n');

// Since we can't execute raw SQL with anon key, let's create the tables using Supabase client
async function setupWISDatabase() {
  try {
    console.log('📋 Creating WIS EPC tables structure...\n');
    
    // Read the migration file to understand the structure
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20240107_wis_epc_sessions.sql');
    const migrationContent = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📄 Migration file loaded successfully');
    console.log('ℹ️  Note: This migration needs to be applied through Supabase Dashboard');
    console.log('\n🚀 Steps to deploy the WIS EPC system:\n');
    
    console.log('1. Go to Supabase Dashboard SQL Editor:');
    console.log(`   https://supabase.com/dashboard/project/${process.env.VITE_SUPABASE_PROJECT_ID}/sql/new\n`);
    
    console.log('2. Copy and paste the migration from:');
    console.log(`   ${migrationPath}\n`);
    
    console.log('3. Click "Run" to execute the migration\n');
    
    console.log('4. After migration, add your first WIS server by running this SQL:');
    console.log(`
INSERT INTO wis_servers (
  name, 
  host_url, 
  guacamole_url, 
  max_concurrent_sessions, 
  status,
  metadata
) VALUES (
  'WIS EPC Server 1',
  'your-server-ip:3389',
  'http://your-server-ip:8080/guacamole',
  5,
  'active',
  '{"environment": "production"}'::jsonb
);
`);
    
    console.log('\n5. Update the server details with your actual VPS information\n');
    
    console.log('📚 Server Setup Guide:');
    console.log('   - Option A: Use Contabo VDS (~$15-20/month)');
    console.log('   - Option B: Use any Windows VPS provider');
    console.log('   - Install Windows + VirtualBox + WIS EPC');
    console.log('   - Install Apache Guacamole for web access');
    console.log('   - Configure firewall for ports 8080 (Guacamole) and 3389 (RDP)\n');
    
    // Let's also save the migration to a more accessible location
    const outputPath = path.join(__dirname, '..', 'wis-epc-migration.sql');
    fs.copyFileSync(migrationPath, outputPath);
    console.log(`✅ Migration file copied to: ${outputPath}`);
    console.log('   You can now easily access it to paste into Supabase Dashboard\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run setup
setupWISDatabase();