#!/usr/bin/env node

/**
 * Check WIS table schema via Supabase API
 */

import fetch from 'node-fetch';

const SUPABASE_URL = 'https://ydevatqwkoccxhtejdor.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkZXZhdHF3a29jY3hodGVqZG9yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzIyMDE2MSwiZXhwIjoyMDU4Nzk2MTYxfQ.qUYRgNaX0s8UIjaaZm0RyjBhNyG5oxDY3Oc8wDz-nu8';

async function checkSchema() {
  console.log('📊 Checking WIS table schemas...\n');
  
  // Get table info from Supabase
  const tables = ['wis_procedures', 'wis_parts', 'wis_bulletins'];
  
  for (const table of tables) {
    console.log(`\n🔍 Checking ${table}:`);
    console.log('=' + '='.repeat(40));
    
    try {
      // Try to get one row to see what columns are accepted
      const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?limit=1`, {
        method: 'GET',
        headers: {
          'apikey': SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          const columns = Object.keys(data[0]);
          console.log('Available columns:', columns.join(', '));
        } else {
          console.log('Table exists but is empty');
          
          // Try to insert an empty row to see required fields
          const testInsert = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
            method: 'POST',
            headers: {
              'apikey': SERVICE_ROLE_KEY,
              'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal'
            },
            body: JSON.stringify({})
          });
          
          if (!testInsert.ok) {
            const error = await testInsert.text();
            // Parse error to find required fields
            console.log('Table structure hint from error:', error.substring(0, 200));
          }
        }
      } else {
        const error = await response.text();
        console.log('Error accessing table:', error);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  }
  
  console.log('\n\n✨ Schema check complete!');
}

// Run the script
checkSchema().catch(console.error);