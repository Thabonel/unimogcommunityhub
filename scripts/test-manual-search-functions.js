#!/usr/bin/env node

/**
 * Test manual search functions and verify Barry can find content
 */

import fetch from 'node-fetch';

const SUPABASE_URL = 'https://ydevatqwkoccxhtejdor.supabase.co';
const SERVICE_ROLE_KEY = '<JWT_TOKEN>';

async function testDirectContentSearch() {
  console.log('🔍 Testing direct content search in manual_chunks...\n');
  
  const searchTerms = ['engine', 'oil', 'brake', 'unimog', 'transmission'];
  
  for (const term of searchTerms) {
    try {
      // Simple ILIKE search
      const response = await fetch(`${SUPABASE_URL}/rest/v1/manual_chunks?content=ilike.*${term}*&limit=3&select=id,manual_title,page_number,content`, {
        headers: {
          'apikey': SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
        }
      });
      
      if (response.ok) {
        const results = await response.json();
        console.log(`✅ "${term}": Found ${results.length} matches`);
        if (results.length > 0) {
          const sample = results[0];
          console.log(`   Manual: ${sample.manual_title || 'Unknown'}`);
          console.log(`   Page: ${sample.page_number || 'N/A'}`);
          console.log(`   Content: ${sample.content?.substring(0, 80)}...`);
        }
      } else {
        console.log(`❌ "${term}": Search failed (${response.status})`);
      }
    } catch (error) {
      console.log(`❌ "${term}": Error - ${error.message}`);
    }
    console.log();
  }
}

async function testBasicTextSearch() {
  console.log('🧪 Testing basic text-based search function...\n');
  
  // Try different parameter combinations
  const testCases = [
    {
      name: 'Parameter order 1',
      params: { query_text: 'engine', match_count: 2, similarity_threshold: 0.1 }
    },
    {
      name: 'Parameter order 2', 
      params: { match_count: 2, match_threshold: 0.1, query_text: 'engine' }
    },
    {
      name: 'Minimal params',
      params: { query_text: 'brake' }
    }
  ];
  
  for (const testCase of testCases) {
    try {
      console.log(`Testing: ${testCase.name}`);
      
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/search_manual_chunks`, {
        method: 'POST',
        headers: {
          'apikey': SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testCase.params)
      });
      
      if (response.ok) {
        const results = await response.json();
        console.log(`✅ Success: Found ${results.length} results`);
        if (results.length > 0) {
          console.log(`   Sample: ${results[0].manual_title} - ${results[0].content?.substring(0, 50)}...`);
        }
      } else {
        const error = await response.text();
        console.log(`❌ Failed: ${error.substring(0, 100)}...`);
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
    console.log();
  }
}

async function checkEmbeddingData() {
  console.log('🔬 Checking embedding data availability...\n');
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/manual_chunks?select=id,embedding&is.embedding.null=false&limit=3`, {
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
      }
    });
    
    if (response.ok) {
      const results = await response.json();
      console.log(`✅ Found ${results.length} chunks with embeddings`);
      
      if (results.length > 0) {
        const embedding = results[0].embedding;
        if (embedding) {
          const embeddingStr = JSON.stringify(embedding);
          console.log(`   Sample embedding: ${embeddingStr.substring(0, 100)}...`);
          console.log(`   Embedding length: ${Array.isArray(embedding) ? embedding.length : 'Not array'}`);
        }
      }
    } else {
      console.log('❌ Could not check embeddings');
    }
  } catch (error) {
    console.log(`❌ Error checking embeddings: ${error.message}`);
  }
}

async function testSimpleSearch() {
  console.log('\n🎯 Creating simple search alternative...\n');
  
  // Create a simple search that Barry can use as fallback
  const searchQuery = 'engine oil change';
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/manual_chunks?select=id,manual_title,page_number,section_title,content&content=ilike.*engine*oil*&limit=5`, {
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
      }
    });
    
    if (response.ok) {
      const results = await response.json();
      console.log(`✅ Simple search found ${results.length} relevant chunks for "${searchQuery}"`);
      
      results.forEach((result, i) => {
        console.log(`\n${i+1}. ${result.manual_title} - Page ${result.page_number}`);
        console.log(`   Section: ${result.section_title || 'N/A'}`);
        console.log(`   Content: ${result.content?.substring(0, 120)}...`);
      });
      
      return results;
    }
  } catch (error) {
    console.log(`❌ Simple search failed: ${error.message}`);
  }
  
  return [];
}

async function main() {
  console.log('🧪 Manual Search Function Testing');
  console.log('=' + '='.repeat(50) + '\n');
  
  await testDirectContentSearch();
  await testBasicTextSearch(); 
  await checkEmbeddingData();
  const simpleResults = await testSimpleSearch();
  
  console.log('\n' + '='.repeat(51));
  console.log('📊 SUMMARY');
  console.log('=' + '='.repeat(50));
  
  if (simpleResults.length > 0) {
    console.log('✅ Manual content is accessible and searchable');
    console.log('✅ Barry should be able to find relevant manual information');
    console.log('\n💡 RECOMMENDATION:');
    console.log('The manual data exists and can be searched. If Barry isn\'t working:');
    console.log('1. Check the OpenAI API key in Edge Function environment');
    console.log('2. Test with a logged-in user (Barry requires authentication)');
    console.log('3. The search_manual_chunks function may need parameter fixes');
  } else {
    console.log('❌ Manual content search is not working properly');
    console.log('\n💡 RECOMMENDATION:');
    console.log('1. Check manual processing and embeddings');
    console.log('2. Verify search function definitions');
    console.log('3. Consider reprocessing manuals');
  }
  
  console.log('=' + '='.repeat(51));
}

main().catch(console.error);