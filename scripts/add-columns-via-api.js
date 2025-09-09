#!/usr/bin/env node

/**
 * Add missing columns to WIS tables via Supabase API
 */

import fetch from 'node-fetch';

const SUPABASE_URL = 'https://ydevatqwkoccxhtejdor.supabase.co';
const SERVICE_ROLE_KEY = '<JWT_TOKEN>';

async function runSQL(query) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
    },
    body: JSON.stringify({ query })
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`SQL Error: ${error}`);
  }
  
  return await response.json();
}

async function addMissingColumns() {
  console.log('🔧 Adding missing columns to WIS tables...\n');
  
  const queries = [
    // Add is_published to wis_procedures
    `ALTER TABLE wis_procedures ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;`,
    
    // Add timestamps to wis_procedures
    `ALTER TABLE wis_procedures 
     ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
     ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();`,
    
    // Add columns to wis_parts
    `ALTER TABLE wis_parts
     ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true,
     ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
     ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();`,
    
    // Add columns to wis_bulletins
    `ALTER TABLE wis_bulletins
     ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true,
     ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
     ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();`,
    
    // Create indexes
    `CREATE INDEX IF NOT EXISTS idx_wis_procedures_published ON wis_procedures(is_published) WHERE is_published = true;`,
    `CREATE INDEX IF NOT EXISTS idx_wis_parts_published ON wis_parts(is_published) WHERE is_published = true;`,
    `CREATE INDEX IF NOT EXISTS idx_wis_bulletins_published ON wis_bulletins(is_published) WHERE is_published = true;`
  ];
  
  for (const query of queries) {
    try {
      console.log(`Running: ${query.substring(0, 50)}...`);
      await runSQL(query);
      console.log('✅ Success\n');
    } catch (error) {
      console.error(`❌ Error: ${error.message}\n`);
    }
  }
  
  console.log('✨ Column additions complete!\n');
  console.log('Now run: node scripts/import-wis-data.js');
}

// Run the script
addMissingColumns().catch(console.error);