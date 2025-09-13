#!/usr/bin/env node

// scripts/test-barry-mcp.js
// Test script to verify Barry MCP connection and WIS data access

import fetch from 'node-fetch';

console.log('🤖 Barry MCP Connection Test');
console.log('=============================');

// Test configurations
const TEST_QUERIES = [
  {
    query: 'brake pad replacement',
    vehicleModel: 'U1700L',
    expected: ['brake', 'pad', 'replacement', 'procedure']
  },
  {
    query: 'engine oil change',
    vehicleModel: 'U1700L', 
    expected: ['oil', 'engine', 'change', 'maintenance']
  },
  {
    query: 'portal axle maintenance',
    vehicleModel: 'U1700L',
    expected: ['portal', 'axle', 'maintenance', 'differential']
  },
  {
    query: 'transmission troubleshooting',
    vehicleModel: 'U1700L',
    expected: ['transmission', 'troubleshoot', 'gearbox']
  }
];

/**
 * Test Barry API endpoint connection
 */
async function testBarryAPIEndpoint(baseUrl) {
  console.log(`1. Testing Barry API endpoint: ${baseUrl}`);
  
  try {
    const response = await fetch(`${baseUrl}/.netlify/functions/barry-wis`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'User-Agent': 'Barry-MCP-Test/1.0'
      },
      body: JSON.stringify({
        query: 'test connection',
        vehicleModel: 'U1700L',
        contentType: 'procedures'
      })
    });
    
    if (!response.ok) {
      console.log(`❌ API endpoint failed: ${response.status} ${response.statusText}`);
      return false;
    }
    
    const data = await response.json();
    console.log(`✅ API endpoint responding (success: ${data.success})`);
    return data;
    
  } catch (error) {
    console.log(`❌ API endpoint error: ${error.message}`);
    return false;
  }
}

/**
 * Test Barry MCP query processing
 */
async function testBarryMCPQuery(baseUrl, testCase) {
  console.log(`\n2. Testing query: "${testCase.query}" for ${testCase.vehicleModel}`);
  
  try {
    const response = await fetch(`${baseUrl}/.netlify/functions/barry-wis`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'User-Agent': 'Barry-MCP-Test/1.0'
      },
      body: JSON.stringify({
        query: testCase.query,
        vehicleModel: testCase.vehicleModel,
        contentType: 'procedures'
      })
    });
    
    const data = await response.json();
    
    if (!data.success) {
      console.log(`❌ Query failed: ${data.error}`);
      return false;
    }
    
    console.log(`✅ Query successful`);
    console.log(`   Response length: ${data.response?.length || 0} characters`);
    console.log(`   Results found: ${data.context?.results?.length || 0}`);
    console.log(`   Suggestions: ${data.context?.suggestions?.length || 0}`);
    
    // Check if response contains expected keywords
    const responseText = data.response?.toLowerCase() || '';
    const keywordsFound = testCase.expected.filter(keyword => 
      responseText.includes(keyword.toLowerCase())
    );
    
    console.log(`   Keywords found: ${keywordsFound.length}/${testCase.expected.length} (${keywordsFound.join(', ')})`);
    
    // Show sample response
    if (data.response) {
      const preview = data.response.substring(0, 200);
      console.log(`   Response preview: "${preview}${data.response.length > 200 ? '...' : ''}"`);
    }
    
    // Show sample results
    if (data.context?.results?.length > 0) {
      console.log(`   Sample results:`);
      data.context.results.slice(0, 2).forEach((result, i) => {
        console.log(`     ${i + 1}. ${result.title || result.name || result.id} (${result.content_type || 'unknown'})`);
      });
    }
    
    return data;
    
  } catch (error) {
    console.log(`❌ Query error: ${error.message}`);
    return false;
  }
}

/**
 * Test MCP database access specifically
 */
async function testMCPDatabaseAccess(baseUrl) {
  console.log(`\n3. Testing MCP database access with specific data queries`);
  
  // Test for known data patterns
  const dbTests = [
    {
      name: 'WIS Content Search',
      query: 'oil change maintenance procedure',
      expectation: 'Should find maintenance procedures'
    },
    {
      name: 'Vehicle Model Filter',
      query: 'U1700L specific maintenance',
      expectation: 'Should filter by vehicle model'
    },
    {
      name: 'Parts Catalog Query',
      query: 'brake parts catalog',
      expectation: 'Should search parts information'
    }
  ];
  
  let successCount = 0;
  
  for (const test of dbTests) {
    try {
      console.log(`   Testing: ${test.name}`);
      
      const response = await fetch(`${baseUrl}/.netlify/functions/barry-wis`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'User-Agent': 'Barry-MCP-DB-Test/1.0'
        },
        body: JSON.stringify({
          query: test.query,
          vehicleModel: 'U1700L'
        })
      });
      
      const data = await response.json();
      
      if (data.success && data.context?.results) {
        console.log(`   ✅ ${test.name}: ${data.context.results.length} results found`);
        successCount++;
      } else {
        console.log(`   ❌ ${test.name}: ${data.error || 'No results'}`);
      }
      
    } catch (error) {
      console.log(`   ❌ ${test.name}: ${error.message}`);
    }
  }
  
  console.log(`   Database access tests: ${successCount}/${dbTests.length} passed`);
  return successCount === dbTests.length;
}

/**
 * Test response quality and structure
 */
async function testResponseQuality(baseUrl) {
  console.log(`\n4. Testing response quality and structure`);
  
  try {
    const response = await fetch(`${baseUrl}/.netlify/functions/barry-wis`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'User-Agent': 'Barry-MCP-Quality-Test/1.0'
      },
      body: JSON.stringify({
        query: 'How do I change the oil in my Unimog U1700L?',
        vehicleModel: 'U1700L',
        contentType: 'procedures'
      })
    });
    
    const data = await response.json();
    
    if (!data.success) {
      console.log(`❌ Quality test failed: ${data.error}`);
      return false;
    }
    
    const checks = {
      hasResponse: !!data.response,
      hasContext: !!data.context,
      hasResults: !!(data.context?.results?.length),
      hasSuggestions: !!(data.context?.suggestions?.length),
      responseLength: data.response?.length > 100,
      mentionsVehicle: data.response?.includes('U1700L'),
      includesSafety: data.response?.toLowerCase().includes('safety') || 
                     data.response?.toLowerCase().includes('precaution'),
      hasBarryTone: data.response?.toLowerCase().includes('barry') ||
                   data.response?.includes('recommend') ||
                   data.response?.includes('suggest')
    };
    
    const passedChecks = Object.values(checks).filter(Boolean).length;
    const totalChecks = Object.keys(checks).length;
    
    console.log(`   Quality checks: ${passedChecks}/${totalChecks} passed`);
    Object.entries(checks).forEach(([check, passed]) => {
      console.log(`   ${passed ? '✅' : '❌'} ${check}`);
    });
    
    if (passedChecks >= totalChecks * 0.75) {
      console.log(`   ✅ Response quality acceptable`);
      return true;
    } else {
      console.log(`   ❌ Response quality needs improvement`);
      return false;
    }
    
  } catch (error) {
    console.log(`❌ Quality test error: ${error.message}`);
    return false;
  }
}

/**
 * Main test runner
 */
async function runBarryMCPTests() {
  const testEnvironments = [
    {
      name: 'Staging',
      url: 'https://unimogcommunity-staging.netlify.app',
      priority: 'high'
    },
    {
      name: 'Production',
      url: 'https://unimogcommunityhub.com',
      priority: 'medium'
    }
  ];
  
  console.log(`Testing ${testEnvironments.length} environments...\n`);
  
  for (const env of testEnvironments) {
    console.log(`\n🌐 Testing ${env.name} Environment: ${env.url}`);
    console.log('=' .repeat(50));
    
    // Test 1: Basic API connectivity
    const apiTest = await testBarryAPIEndpoint(env.url);
    if (!apiTest) {
      console.log(`❌ ${env.name} API not accessible, skipping further tests`);
      continue;
    }
    
    // Test 2: Query processing
    let queryTestsPassed = 0;
    for (const testCase of TEST_QUERIES.slice(0, 2)) { // Test first 2 queries
      const queryResult = await testBarryMCPQuery(env.url, testCase);
      if (queryResult) queryTestsPassed++;
    }
    
    // Test 3: Database access
    const dbTest = await testMCPDatabaseAccess(env.url);
    
    // Test 4: Response quality
    const qualityTest = await testResponseQuality(env.url);
    
    // Environment summary
    console.log(`\n📊 ${env.name} Environment Summary:`);
    console.log(`   API Connection: ${apiTest ? '✅' : '❌'}`);
    console.log(`   Query Processing: ${queryTestsPassed}/${Math.min(2, TEST_QUERIES.length)} ✅`);
    console.log(`   Database Access: ${dbTest ? '✅' : '❌'}`);
    console.log(`   Response Quality: ${qualityTest ? '✅' : '❌'}`);
    
    const overallHealth = apiTest && queryTestsPassed > 0 && (dbTest || qualityTest);
    console.log(`   Overall Health: ${overallHealth ? '✅ HEALTHY' : '❌ NEEDS ATTENTION'}`);
  }
  
  console.log('\n🎯 Final Recommendations:');
  console.log('1. If staging tests pass, Barry MCP is ready for UI integration');
  console.log('2. If tests fail, check Supabase connection and WIS data setup');
  console.log('3. Test the live interface at /knowledge/wis');
  console.log('4. Monitor browser console for any client-side errors');
  console.log('\n✅ Barry MCP testing complete!');
}

// Add fetch polyfill check
if (typeof fetch === 'undefined') {
  console.log('Installing node-fetch...');
  try {
    const { default: nodeFetch } = await import('node-fetch');
    global.fetch = nodeFetch;
  } catch (error) {
    console.error('Please install node-fetch: npm install node-fetch');
    process.exit(1);
  }
}

// Run the tests
runBarryMCPTests().catch(error => {
  console.error('\n❌ Test suite failed:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
});