/**
 * Specs Flow Test
 * Tests the capability router and specs pipeline
 */

const EDGE_FUNCTION_URL = 'https://ydevatqwkoccxhtejdor.supabase.co/functions/v1/chat-with-barry-agentic';
const ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

interface TestCase {
  name: string;
  query: string;
  expectedIntent?: string;
  expectedCapability?: string;
  shouldHaveValue?: boolean;
  shouldHaveRefs?: boolean;
}

const testCases: TestCase[] = [
  {
    name: 'Turbo boost spec for U1700L',
    query: 'What is the turbo boost spec for U1700L?',
    expectedIntent: 'specs',
    expectedCapability: 'specs',
    shouldHaveValue: true
  },
  {
    name: 'Portal hub oil capacity U435',
    query: 'Portal hub oil capacity for U435',
    expectedIntent: 'specs',
    expectedCapability: 'specs',
    shouldHaveValue: true
  },
  {
    name: 'Differential clearance',
    query: 'What is the differential clearance spec?',
    expectedIntent: 'specs',
    expectedCapability: 'specs'
  }
];

async function runTest(testCase: TestCase): Promise<void> {
  console.log(`\nTesting: ${testCase.name}`);
  console.log(`Query: "${testCase.query}"`);

  try {
    const response = await fetch(EDGE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ANON_KEY}`
      },
      body: JSON.stringify({
        messages: [
          { role: 'user', content: testCase.query }
        ]
      })
    });

    if (!response.ok) {
      console.error(`  ❌ HTTP ${response.status}: ${response.statusText}`);
      return;
    }

    const data = await response.json();

    console.log(`  Status: ${response.status}`);
    console.log(`  Response content: ${data.content?.substring(0, 100)}...`);
    console.log(`  Knowledge mode: ${data.knowledgeMode}`);
    console.log(`  Manual references: ${data.manualReferences?.length || 0}`);

    if (response.status === 200) {
      console.log(`  ✅ Request succeeded`);

      if (testCase.shouldHaveValue && data.content) {
        console.log(`  ✅ Has value in response`);
      } else if (testCase.shouldHaveValue) {
        console.log(`  ⚠️  Expected value but got references instead`);
      }

      if (testCase.shouldHaveRefs && data.manualReferences?.length > 0) {
        console.log(`  ✅ Has manual references`);
      }
    } else {
      console.error(`  ❌ Request failed with status ${response.status}`);
    }
  } catch (error) {
    console.error(`  ❌ Error:`, error);
  }
}

async function main() {
  console.log('========================================');
  console.log('Specs Flow Test Suite');
  console.log('========================================');

  if (!ANON_KEY) {
    console.error('Error: VITE_SUPABASE_ANON_KEY environment variable not set');
    process.exit(1);
  }

  for (const testCase of testCases) {
    await runTest(testCase);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n========================================');
  console.log('Test suite complete');
  console.log('========================================\n');
}

main().catch(console.error);
