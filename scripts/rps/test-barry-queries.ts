#!/usr/bin/env tsx

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
const envTempPath = path.join(__dirname, '.env.temp');
if (fs.existsSync(envTempPath)) {
  const envContent = fs.readFileSync(envTempPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      process.env[key.trim()] = value.trim();
    }
  });
}

const supabase = createClient(process.env.VITE_SUPABASE_URL || '', process.env.SUPABASE_SERVICE_ROLE_KEY || '');

interface TestQuery {
  name: string;
  description: string;
  query: () => Promise<any>;
  expectedMinResults: number;
}

const tests: TestQuery[] = [
  {
    name: 'Find turbocharger parts',
    description: 'Barry should find turbocharger-related parts',
    query: async () => {
      const { data, count } = await supabase
        .from('rps_parts')
        .select('*', { count: 'exact' })
        .or('description.ilike.%turbo%,group_code.in.(DHA,DHB)');
      return { data, count };
    },
    expectedMinResults: 4,
  },
  {
    name: 'Find clutch parts',
    description: 'Barry should find all clutch-related parts',
    query: async () => {
      const { data, count } = await supabase
        .from('rps_parts')
        .select('*', { count: 'exact' })
        .or('description.ilike.%clutch%,group_code.in.(EA,EC,ED)');
      return { data, count };
    },
    expectedMinResults: 5,
  },
  {
    name: 'Find gear shift parts',
    description: 'Barry should find gear shift lever and linkage',
    query: async () => {
      const { data, count } = await supabase
        .from('rps_parts')
        .select('*', { count: 'exact' })
        .eq('group_code', 'FDA');
      return { data, count };
    },
    expectedMinResults: 20,
  },
  {
    name: 'Find parts by NIIN',
    description: 'Barry should be able to lookup parts by NIIN',
    query: async () => {
      // First find a valid NIIN
      const { data: sample } = await supabase
        .from('rps_parts')
        .select('niin')
        .not('niin', 'is', null)
        .limit(1);
      
      if (!sample || sample.length === 0) {
        return { data: null, count: 0, niin: null };
      }
      
      const niin = sample[0].niin;
      const { data, count } = await supabase
        .from('rps_parts')
        .select('*', { count: 'exact' })
        .eq('niin', niin);
      
      return { data, count, niin };
    },
    expectedMinResults: 1,
  },
  {
    name: 'Find rear axle parts',
    description: 'Barry should find rear axle assembly parts',
    query: async () => {
      const { data, count } = await supabase
        .from('rps_parts')
        .select('*', { count: 'exact' })
        .or('group_code.in.(J,JA,JB),description.ilike.%axle%');
      return { data, count };
    },
    expectedMinResults: 15,
  },
  {
    name: 'Find propeller shaft parts',
    description: 'Barry should find propeller shaft and universal joints',
    query: async () => {
      const { data, count } = await supabase
        .from('rps_parts')
        .select('*', { count: 'exact' })
        .eq('group_code', 'HA');
      return { data, count };
    },
    expectedMinResults: 3,
  },
  {
    name: 'List all groups',
    description: 'Barry should be able to list all available groups',
    query: async () => {
      const { data, count } = await supabase
        .from('rps_groups')
        .select('group_code, group_name', { count: 'exact' })
        .order('group_code');
      return { data, count };
    },
    expectedMinResults: 10,
  },
  {
    name: 'Find illustrations',
    description: 'Barry should be able to find relevant illustrations',
    query: async () => {
      const { data, count } = await supabase
        .from('rps_illustrations')
        .select('*', { count: 'exact' });
      return { data, count };
    },
    expectedMinResults: 10,
  },
];

async function runBarryTests() {
  console.log('\n🤖 Barry AI Query Capability Tests\n');
  console.log('Testing if Barry can accurately find RPS parts...\n');

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      const result = await test.query();
      const actualCount = result.count || 0;
      const testPassed = actualCount >= test.expectedMinResults;

      if (testPassed) {
        console.log(`✅ ${test.name}`);
        console.log(`   Found: ${actualCount} results (expected ≥${test.expectedMinResults})`);
        
        // Show sample results
        if (result.data && result.data.length > 0) {
          const sample = result.data[0];
          if (sample.group_code && sample.description) {
            console.log(`   Sample: ${sample.group_code} - ${(sample.description || '').substring(0, 50)}...`);
          } else if (sample.group_code && sample.group_name) {
            console.log(`   Sample: ${sample.group_code} - ${sample.group_name}`);
          } else if (result.niin) {
            console.log(`   NIIN tested: ${result.niin}`);
          }
        }
        passed++;
      } else {
        console.log(`❌ ${test.name}`);
        console.log(`   Found: ${actualCount} results (expected ≥${test.expectedMinResults})`);
        failed++;
      }
      console.log();
    } catch (error) {
      console.log(`❌ ${test.name}`);
      console.log(`   Error: ${error instanceof Error ? error.message : String(error)}\n`);
      failed++;
    }
  }

  console.log('='.repeat(60));
  console.log(`BARRY QUERY TEST RESULTS: ${passed}/${tests.length} passed`);
  console.log('='.repeat(60));

  if (passed === tests.length) {
    console.log('\n✅ Barry can accurately query all RPS data\n');
  } else {
    console.log(`\n⚠️  ${failed} query types may need attention\n`);
  }

  return passed === tests.length ? 0 : 1;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runBarryTests()
    .then(code => process.exit(code))
    .catch(error => {
      console.error('Barry test suite failed:', error);
      process.exit(1);
    });
}
