#!/usr/bin/env node
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Configuration from MCP setup
const supabaseUrl = 'https://ydevatqwkoccxhtejdor.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkZXZhdHF3a29jY3hodGVqZG9yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzIyMDE2MSwiZXhwIjoyMDU4Nzk2MTYxfQ.qUYRgNaX0s8UIjaaZm0RyjBhNyG5oxDY3Oc8wDz-nu8';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executeSQLFromFile(filepath) {
  try {
    console.log(`\nExecuting SQL from: ${filepath}`);
    const sql = fs.readFileSync(filepath, 'utf8');
    
    // Split SQL into individual statements (simple approach)
    const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      if (statement) {
        console.log(`Executing statement ${i + 1}/${statements.length}...`);
        
        // Use raw query execution
        const { error } = await supabase.rpc('exec_sql', { query: statement + ';' });
        if (error) {
          console.error(`Error in statement ${i + 1}:`, error.message);
        }
      }
    }
    
    console.log('✅ File execution completed');
    
  } catch (error) {
    console.error('❌ Execution failed:', error.message);
  }
}

async function testFunctions() {
  console.log('\n=== Testing Functions ===');
  
  try {
    // Test unified_wis_search
    console.log('\n1. Testing unified_wis_search...');
    const { data: searchData, error: searchError } = await supabase
      .rpc('unified_wis_search', {
        search_query: 'oil change',
        model_id: null,
        search_limit: 10
      });
    
    if (searchError) {
      console.error('unified_wis_search error:', searchError.message);
    } else {
      console.log(`✅ unified_wis_search returned ${searchData?.length || 0} results`);
    }
    
    // Test wis_suggest_titles
    console.log('\n2. Testing wis_suggest_titles...');
    const { data: suggestData, error: suggestError } = await supabase
      .rpc('wis_suggest_titles', {
        search_query: 'brake',
        model_filter: null,
        limit_rows: 10
      });
    
    if (suggestError) {
      console.error('wis_suggest_titles error:', suggestError.message);
    } else {
      console.log(`✅ wis_suggest_titles returned ${suggestData?.length || 0} suggestions`);
    }
    
  } catch (error) {
    console.error('Test error:', error.message);
  }
}

async function main() {
  console.log('🚀 Deploying WIS Functions...');
  
  // Only test the functions since the SQL might already be deployed
  await testFunctions();
  
  console.log('\n✅ Done!');
}

main().catch(console.error);