#!/usr/bin/env node

/**
 * Check manual processing options and existing chunks
 */

import fetch from 'node-fetch';

const SUPABASE_URL = 'https://ydevatqwkoccxhtejdor.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkZXZhdHF3a29jY3hodGVqZG9yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzIyMDE2MSwiZXhwIjoyMDU4Nzk2MTYxfQ.qUYRgNaX0s8UIjaaZm0RyjBhNyG5oxDY3Oc8wDz-nu8';

async function checkExistingProcessing() {
  console.log('🔍 Checking existing manual processing...\n');
  
  // Check manual_chunks table
  try {
    const chunksResponse = await fetch(`${SUPABASE_URL}/rest/v1/manual_chunks?limit=10&select=*`, {
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Prefer': 'count=exact'
      }
    });
    
    if (chunksResponse.ok) {
      const chunks = await chunksResponse.json();
      const totalCount = chunksResponse.headers.get('content-range')?.split('/')[1] || '0';
      
      if (chunks && chunks.length > 0) {
        console.log(`✅ Found ${totalCount} manual chunks already processed!`);
        console.log('\nSample chunks:');
        chunks.slice(0, 3).forEach((chunk, i) => {
          console.log(`  ${i+1}. ${chunk.title?.substring(0, 50)}...`);
          console.log(`     Source: ${chunk.source_file || chunk.filename || 'Unknown'}`);
          console.log(`     Content: ${chunk.content?.substring(0, 80)}...`);
        });
        
        // Check unique sources
        const uniqueSources = new Set(chunks.map(c => c.source_file || c.filename).filter(Boolean));
        console.log(`\n📚 Content from ${uniqueSources.size} different manuals`);
        
        return true;
      } else {
        console.log('⚠️ No manual chunks found in database');
      }
    } else {
      console.log('❌ Could not access manual_chunks table');
    }
  } catch (error) {
    console.error('Error checking chunks:', error.message);
  }
  
  // Check for alternative tables
  const tables = ['processed_manuals', 'manual_metadata', 'embeddings'];
  
  for (const table of tables) {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?limit=1&select=*`, {
        headers: {
          'apikey': SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          console.log(`\n✅ Found data in ${table} table:`, Object.keys(data[0]));
        }
      }
    } catch (error) {
      // Table might not exist
    }
  }
  
  return false;
}

async function checkEdgeFunctions() {
  console.log('\n🔧 Checking Edge Functions...');
  
  const functions = ['process-manual', 'process-manuals', 'chat-with-barry'];
  
  for (const func of functions) {
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/${func}`, {
        method: 'OPTIONS',
        headers: {
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
        }
      });
      
      if (response.ok) {
        console.log(`  ✅ ${func} function available`);
      } else {
        console.log(`  ❌ ${func} function not available (${response.status})`);
      }
    } catch (error) {
      console.log(`  ❌ ${func} function error: ${error.message}`);
    }
  }
}

async function main() {
  console.log('📋 Manual Processing Status Report');
  console.log('=' + '='.repeat(50) + '\n');
  
  const hasProcessedContent = await checkExistingProcessing();
  await checkEdgeFunctions();
  
  console.log('\n' + '='.repeat(51));
  console.log('📝 Summary:');
  
  if (hasProcessedContent) {
    console.log('✅ Manuals are already processed and available to Barry AI!');
    console.log('🤖 You can test Barry at: /knowledge/chatgpt');
    console.log('📊 View processing details at: /admin/manual-processing');
  } else {
    console.log('⚠️ No processed manual content found');
    console.log('💡 Options:');
    console.log('  1. Use the admin interface at /admin/manual-processing');
    console.log('  2. Upload manuals individually for processing');
    console.log('  3. Check Edge Function logs for processing errors');
  }
  
  console.log('='.repeat(51));
}

main().catch(console.error);