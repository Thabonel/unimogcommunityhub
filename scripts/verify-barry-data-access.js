#!/usr/bin/env node

/**
 * Comprehensive verification of Barry AI's data access to manual content
 */

import fetch from 'node-fetch';

const SUPABASE_URL = 'https://ydevatqwkoccxhtejdor.supabase.co';
const SERVICE_ROLE_KEY = '<JWT_TOKEN>';

async function checkAllPossibleTables() {
  console.log('🔍 Searching for manual data across all possible tables...\n');
  
  const possibleTables = [
    'manual_chunks',
    'embeddings',
    'documents',
    'processed_manuals', 
    'manual_metadata',
    'knowledge_base',
    'content_chunks',
    'document_chunks'
  ];
  
  const foundTables = [];
  
  for (const table of possibleTables) {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?limit=3&select=*`, {
        headers: {
          'apikey': SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
          'Prefer': 'count=exact'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const count = response.headers.get('content-range')?.split('/')[1] || '0';
        
        if (parseInt(count) > 0) {
          console.log(`✅ ${table}: ${count} records`);
          if (data.length > 0) {
            console.log(`   Sample columns: ${Object.keys(data[0]).join(', ')}`);
            
            // Check for manual content indicators
            const sampleRecord = data[0];
            const hasManualContent = 
              JSON.stringify(sampleRecord).toLowerCase().includes('unimog') ||
              JSON.stringify(sampleRecord).toLowerCase().includes('engine') ||
              JSON.stringify(sampleRecord).toLowerCase().includes('brake') ||
              JSON.stringify(sampleRecord).toLowerCase().includes('manual') ||
              JSON.stringify(sampleRecord).toLowerCase().includes('.pdf');
              
            if (hasManualContent) {
              console.log(`   🎯 Contains manual content!`);
              foundTables.push({ table, count: parseInt(count), data: data[0] });
            }
          }
        }
      } else if (response.status !== 404) {
        console.log(`❌ ${table}: Access error (${response.status})`);
      }
    } catch (error) {
      // Table likely doesn't exist
    }
  }
  
  return foundTables;
}

async function analyzeBarryFunction() {
  console.log('\n🤖 Analyzing Barry AI function configuration...\n');
  
  try {
    // Check if function exists
    const response = await fetch(`${SUPABASE_URL}/functions/v1/chat-with-barry`, {
      method: 'OPTIONS',
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
      }
    });
    
    console.log(`Barry function status: ${response.status}`);
    
    if (response.status === 200) {
      console.log('✅ Barry function is accessible');
    } else {
      console.log('❌ Barry function may have issues');
    }
    
  } catch (error) {
    console.error('Error checking Barry function:', error.message);
  }
}

async function testDirectDatabaseSearch() {
  console.log('\n🔍 Testing direct database search for manual content...\n');
  
  // Test different search terms that should exist in manuals
  const searchTerms = [
    'unimog',
    'engine oil', 
    'brake',
    'transmission',
    'maintenance',
    'G617', // Common in modification docs
    'G609', // Service instructions
    'hydraulic'
  ];
  
  const foundContent = [];
  
  for (const term of searchTerms) {
    try {
      // Search in manual_chunks
      const response = await fetch(`${SUPABASE_URL}/rest/v1/manual_chunks?content=ilike.*${term}*&limit=3&select=title,content,source_file,filename`, {
        headers: {
          'apikey': SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
        }
      });
      
      if (response.ok) {
        const results = await response.json();
        if (results && results.length > 0) {
          console.log(`✅ "${term}": Found ${results.length} matches`);
          foundContent.push({ term, matches: results.length, sample: results[0] });
          
          // Show sample content
          const sample = results[0];
          console.log(`   Sample: ${sample.content?.substring(0, 100)}...`);
          console.log(`   Source: ${sample.source_file || sample.filename || 'Unknown'}`);
        } else {
          console.log(`❌ "${term}": No matches found`);
        }
      }
    } catch (error) {
      console.log(`❌ "${term}": Search error - ${error.message}`);
    }
  }
  
  return foundContent;
}

async function checkBarrySearchLogic() {
  console.log('\n🧠 Checking Barry AI search logic...\n');
  
  // Read the Barry function to understand how it searches
  try {
    const functionResponse = await fetch(`${SUPABASE_URL}/functions/v1/chat-with-barry`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'test search configuration',
        debug: true
      })
    });
    
    if (functionResponse.status === 401) {
      console.log('⚠️ Barry function requires user authentication');
      console.log('Will check the source code instead...');
      
      // Let's read the function source code
      return true;
    }
  } catch (error) {
    console.log('Note: Will check function source code for search logic');
  }
}

async function main() {
  console.log('🔬 Comprehensive Barry AI Data Access Verification');
  console.log('=' + '='.repeat(60) + '\n');
  
  // Step 1: Find all tables with manual data
  const foundTables = await checkAllPossibleTables();
  
  // Step 2: Check Barry function
  await analyzeBarryFunction();
  
  // Step 3: Test direct searches
  const searchResults = await testDirectDatabaseSearch();
  
  // Step 4: Check Barry's search configuration
  await checkBarrySearchLogic();
  
  // Summary
  console.log('\n' + '='.repeat(61));
  console.log('📊 VERIFICATION SUMMARY');
  console.log('=' + '='.repeat(60));
  
  if (foundTables.length > 0) {
    console.log(`✅ Found manual data in ${foundTables.length} table(s):`);
    foundTables.forEach(({ table, count }) => {
      console.log(`   - ${table}: ${count} records`);
    });
  } else {
    console.log('❌ No manual data found in any tables');
  }
  
  if (searchResults.length > 0) {
    console.log(`\n✅ Direct search successful for ${searchResults.length} terms`);
    console.log('Manual content is searchable in the database');
  } else {
    console.log('\n❌ Direct search failed - content may not be indexed properly');
  }
  
  console.log('\n🎯 NEXT STEPS:');
  if (foundTables.length > 0 && searchResults.length > 0) {
    console.log('1. ✅ Data is present and searchable');
    console.log('2. 🔧 Need to verify Barry uses correct table/search method');
    console.log('3. 🧪 Test Barry with specific manual questions');
  } else {
    console.log('1. 🚨 Manual data may need to be reprocessed');
    console.log('2. 🔍 Check processing pipeline');
    console.log('3. 📤 Upload and process test manual');
  }
  
  console.log('=' + '='.repeat(61));
}

main().catch(console.error);