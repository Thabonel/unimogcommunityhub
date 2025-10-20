/**
 * Test script for hybrid search edge function
 *
 * Tests the search-rps-hybrid edge function with various queries
 * to verify routing logic and results.
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing environment variables');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

interface TestCase {
  query: string;
  expectedRoute: 'code' | 'lexical';
  expectedGroupCode: string | null;
  expectedDiagram: boolean;
  expectedPage?: number;
  description: string;
}

const testCases: TestCase[] = [
  {
    query: 'fuel pump',
    expectedRoute: 'code',
    expectedGroupCode: 'dea',
    expectedDiagram: false,
    expectedPage: 171,
    description: 'Should use hard filter for DEA (fuel pump)'
  },
  {
    query: 'fuel tank',
    expectedRoute: 'code',
    expectedGroupCode: 'da',
    expectedDiagram: false,
    expectedPage: 165,
    description: 'Should use hard filter for DA (fuel tank)'
  },
  {
    query: 'fuel pump exploded view',
    expectedRoute: 'code',
    expectedGroupCode: 'dea',
    expectedDiagram: true,
    expectedPage: 171,
    description: 'Should filter for DEA + diagram'
  },
  {
    query: 'show me the crankcase',
    expectedRoute: 'code',
    expectedGroupCode: 'a',
    expectedDiagram: false,
    expectedPage: 50,
    description: 'Should use hard filter for A (crankcase)'
  },
  {
    query: 'what is the oil system',
    expectedRoute: 'lexical',
    expectedGroupCode: null,
    expectedDiagram: false,
    description: 'Should use lexical search (no specific code match)'
  },
  {
    query: 'DEA diagram',
    expectedRoute: 'code',
    expectedGroupCode: 'dea',
    expectedDiagram: true,
    expectedPage: 171,
    description: 'Should extract inline code "DEA"'
  }
];

async function testQuery(testCase: TestCase): Promise<boolean> {
  console.log('\n' + '='.repeat(70));
  console.log(`Test: ${testCase.description}`);
  console.log(`Query: "${testCase.query}"`);
  console.log('-'.repeat(70));

  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/search-rps-hybrid`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: testCase.query,
        top_k: 5
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ FAILED: HTTP ${response.status}`);
      console.error(`   Error: ${errorText}`);
      return false;
    }

    const data = await response.json();

    // Verify routing
    console.log(`Route used: ${data.route_used}`);
    console.log(`Routed params:`, data.routed_params);

    let allPassed = true;

    // Check route
    if (data.route_used !== testCase.expectedRoute) {
      console.error(`❌ Route mismatch: expected "${testCase.expectedRoute}", got "${data.route_used}"`);
      allPassed = false;
    } else {
      console.log(`✓ Route correct: ${data.route_used}`);
    }

    // Check group code
    if (data.routed_params.wantGroupCode !== testCase.expectedGroupCode) {
      console.error(`❌ Group code mismatch: expected ${testCase.expectedGroupCode}, got ${data.routed_params.wantGroupCode}`);
      allPassed = false;
    } else {
      console.log(`✓ Group code correct: ${data.routed_params.wantGroupCode || 'null'}`);
    }

    // Check diagram flag
    if (data.routed_params.wantDiagram !== testCase.expectedDiagram) {
      console.error(`❌ Diagram flag mismatch: expected ${testCase.expectedDiagram}, got ${data.routed_params.wantDiagram}`);
      allPassed = false;
    } else {
      console.log(`✓ Diagram flag correct: ${data.routed_params.wantDiagram}`);
    }

    // Check expected page (if specified)
    if (testCase.expectedPage && data.hits.length > 0) {
      const topPage = data.hits[0].page_number;
      if (topPage !== testCase.expectedPage) {
        console.error(`❌ Top result page mismatch: expected ${testCase.expectedPage}, got ${topPage}`);
        allPassed = false;
      } else {
        console.log(`✓ Top result page correct: ${topPage}`);
      }
    }

    // Show results
    console.log(`\nResults (${data.hits.length}):`);
    for (const hit of data.hits.slice(0, 3)) {
      console.log(`  Page ${hit.page_number}: ${hit.rps_group_name} (${hit.visual}) - score: ${hit.score.toFixed(3)}`);
    }

    if (allPassed) {
      console.log('\n✅ TEST PASSED');
    } else {
      console.log('\n❌ TEST FAILED');
    }

    return allPassed;

  } catch (error) {
    console.error(`❌ FAILED: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}

async function main() {
  console.log('='.repeat(70));
  console.log('HYBRID SEARCH EDGE FUNCTION TEST SUITE');
  console.log('='.repeat(70));

  let passed = 0;
  let failed = 0;

  for (const testCase of testCases) {
    const result = await testQuery(testCase);
    if (result) {
      passed++;
    } else {
      failed++;
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('TEST SUMMARY');
  console.log('='.repeat(70));
  console.log(`Total tests: ${testCases.length}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Success rate: ${((passed / testCases.length) * 100).toFixed(1)}%`);
  console.log('='.repeat(70));

  if (failed > 0) {
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
