#!/usr/bin/env node

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function addDevServer() {
  console.log('🚀 Adding WIS EPC development server...\n');
  
  try {
    // Check if any servers exist
    const { data: existingServers, error: checkError } = await supabase
      .from('wis_servers')
      .select('*');
    
    if (checkError) {
      console.error('❌ Error checking servers:', checkError);
      return;
    }
    
    if (existingServers && existingServers.length > 0) {
      console.log('📊 Existing servers:');
      console.table(existingServers.map(s => ({
        name: s.name,
        status: s.status,
        url: s.guacamole_url
      })));
      console.log('\n⚠️  Servers already exist. Not adding duplicate.');
      return;
    }
    
    // Add development server
    const { data: newServer, error: insertError } = await supabase
      .from('wis_servers')
      .insert({
        name: 'WIS EPC Development Server',
        host_url: 'localhost:3389',
        guacamole_url: 'http://localhost:8080/guacamole',
        max_concurrent_sessions: 5,
        status: 'maintenance',
        specs: {
          note: 'Update with actual server details when ready',
          environment: 'development',
          instructions: 'Follow docs/WIS-EPC-DEPLOYMENT-GUIDE.md to set up'
        }
      })
      .select()
      .single();
    
    if (insertError) {
      console.error('❌ Error adding server:', insertError);
      return;
    }
    
    console.log('✅ Development server added successfully!');
    console.log('\n📋 Server details:');
    console.log(`   ID: ${newServer.id}`);
    console.log(`   Name: ${newServer.name}`);
    console.log(`   Status: ${newServer.status}`);
    console.log(`   URL: ${newServer.guacamole_url}`);
    
    console.log('\n📌 Next steps:');
    console.log('1. Set up your WIS EPC server following docs/WIS-EPC-DEPLOYMENT-GUIDE.md');
    console.log('2. Update the server details in Supabase when ready');
    console.log('3. Change status from "maintenance" to "active"');
    console.log('4. Test at http://localhost:5173/knowledge/wis-epc');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

addDevServer();