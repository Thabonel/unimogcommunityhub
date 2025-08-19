#!/usr/bin/env node

/**
 * Script to apply page images schema changes directly
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

async function applySchemaChanges() {
  console.log('🔧 Applying page images schema changes...\n');

  const changes = [
    {
      name: 'Add page_image_url column',
      sql: 'ALTER TABLE manual_chunks ADD COLUMN IF NOT EXISTS page_image_url TEXT'
    },
    {
      name: 'Add visual_content_type column',
      sql: `ALTER TABLE manual_chunks ADD COLUMN IF NOT EXISTS visual_content_type TEXT DEFAULT 'text'`
    },
    {
      name: 'Add has_visual_elements column',
      sql: 'ALTER TABLE manual_chunks ADD COLUMN IF NOT EXISTS has_visual_elements BOOLEAN DEFAULT FALSE'
    },
    {
      name: 'Add visual content index',
      sql: 'CREATE INDEX IF NOT EXISTS idx_manual_chunks_visual_content ON manual_chunks(has_visual_elements, visual_content_type)'
    },
    {
      name: 'Add page image index',
      sql: 'CREATE INDEX IF NOT EXISTS idx_manual_chunks_page_image ON manual_chunks(page_image_url) WHERE page_image_url IS NOT NULL'
    }
  ];

  for (const change of changes) {
    console.log(`Applying: ${change.name}...`);
    
    try {
      const { error } = await supabase.rpc('exec_sql', { sql: change.sql })
        .catch(async () => {
          // Fallback: try direct query
          const response = await fetch(`${process.env.VITE_SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
              'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sql: change.sql })
          });
          
          if (!response.ok) {
            return { error: `HTTP ${response.status}` };
          }
          return { error: null };
        });

      if (error) {
        console.log(`⚠️  ${change.name}: ${error} (may already exist)`);
      } else {
        console.log(`✅ ${change.name}: Success`);
      }
    } catch (err) {
      console.log(`⚠️  ${change.name}: ${err.message} (may already exist)`);
    }
  }

  // Check current schema
  console.log('\n📊 Checking current manual_chunks schema...');
  
  const { data: sample } = await supabase
    .from('manual_chunks')
    .select('*')
    .limit(1);

  if (sample && sample[0]) {
    console.log('Available columns:', Object.keys(sample[0]).join(', '));
  }

  console.log('\n✅ Schema changes complete!');
}

applySchemaChanges().catch(console.error);