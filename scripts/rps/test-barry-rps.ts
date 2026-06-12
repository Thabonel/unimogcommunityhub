/**
 * Test Barry RPS Phase 7 Integration
 *
 * Tests that Barry can now return RPS parts with illustration URLs
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ydevatqwkoccxhtejdor.supabase.co';
const SUPABASE_ANON_KEY = <SUPABASE_ANON_KEY>

if (!SUPABASE_ANON_KEY) {
  console.error('VITE_SUPABASE_ANON_KEY environment variable not set');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testBarryRPS() {
  console.log('Testing Barry RPS Phase 7 Integration\n');
  console.log('=====================================\n');

  const testQueries = [
    {
      query: 'Show me parts from group DHA',
      expected: 'Should return DHA turbocharger parts with illustration URLs'
    },
    {
      query: 'What is NIIN 12-301-8395?',
      expected: 'Should return specific part with illustration URL'
    }
  ];

  for (const test of testQueries) {
    console.log(`\nTest Query: "${test.query}"`);
    console.log(`Expected: ${test.expected}`);
    console.log('---');

    try {
      const { data, error } = await supabase.functions.invoke('chat-with-barry', {
        body: { message: test.query }
      });

      if (error) {
        console.error('Error:', error.message);
        continue;
      }

      console.log('Response received:');
      console.log('Type:', typeof data);

      if (typeof data === 'string') {
        console.log('Length:', data.length, 'characters');

        // Check for illustration URLs
        const hasIllustrationURLs = data.includes('rps_illustrations/rps_page_');
        console.log('Contains illustration URLs:', hasIllustrationURLs ? '✅ YES' : '❌ NO');

        // Check for RPS context
        const hasRPSContext = data.toLowerCase().includes('rps') || data.toLowerCase().includes('group');
        console.log('Contains RPS context:', hasRPSContext ? '✅ YES' : '❌ NO');

        // Show first 500 characters
        console.log('\nResponse preview:');
        console.log(data.substring(0, 500) + '...\n');
      } else {
        console.log('Data:', JSON.stringify(data, null, 2));
      }

    } catch (error: any) {
      console.error('Test failed:', error.message);
    }
  }

  console.log('\n=====================================');
  console.log('Testing complete!');
}

testBarryRPS();
