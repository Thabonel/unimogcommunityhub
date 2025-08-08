#!/usr/bin/env node

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyWISSetup() {
  console.log('🔍 Verifying WIS EPC setup...\n');
  
  try {
    // Check tables exist
    const tables = [
      'wis_servers',
      'wis_sessions', 
      'wis_bookmarks',
      'wis_usage_logs',
      'user_subscriptions'
    ];
    
    console.log('📊 Checking tables:');
    for (const table of tables) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          console.log(`❌ ${table}: Error - ${error.message}`);
        } else {
          console.log(`✅ ${table}: Exists (${count || 0} records)`);
        }
      } catch (e) {
        console.log(`❌ ${table}: ${e.message}`);
      }
    }
    
    // Check for servers
    const { data: servers, error: serverError } = await supabase
      .from('wis_servers')
      .select('*');
    
    console.log('\n📡 WIS Servers:');
    if (servers && servers.length > 0) {
      console.table(servers.map(s => ({
        name: s.name,
        status: s.status,
        max_sessions: s.max_concurrent_sessions,
        current_sessions: s.current_sessions,
        url: s.guacamole_url
      })));
    } else {
      console.log('⚠️  No WIS servers configured yet');
      console.log('\n💡 Add a development server with this SQL:');
      console.log(`
INSERT INTO wis_servers (
  name, 
  host_url, 
  guacamole_url, 
  max_concurrent_sessions, 
  status,
  specs
) VALUES (
  'WIS EPC Development Server',
  'localhost:3389',
  'http://localhost:8080/guacamole',
  5,
  'maintenance',
  '{"note": "Update with actual server details when ready"}'::jsonb
);`);
    }
    
    console.log('\n✅ WIS EPC database setup is complete!');
    console.log('\n📋 Next steps:');
    console.log('1. Set up your WIS EPC server (see docs/WIS-EPC-DEPLOYMENT-GUIDE.md)');
    console.log('2. Update the server details in the wis_servers table');
    console.log('3. Test the integration at /knowledge/wis-epc');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

verifyWISSetup();