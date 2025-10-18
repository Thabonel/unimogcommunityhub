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

interface TestResult {
  name: string;
  passed: boolean;
  details: string;
  expected: any;
  actual: any;
}

const results: TestResult[] = [];

async function test(name: string, fn: () => Promise<{ passed: boolean; details: string; expected: any; actual: any }>) {
  try {
    const result = await fn();
    results.push({
      name,
      passed: result.passed,
      details: result.details,
      expected: result.expected,
      actual: result.actual,
    });
    console.log(`${result.passed ? '✅' : '❌'} ${name}`);
    if (!result.passed) {
      console.log(`   Expected: ${JSON.stringify(result.expected)}`);
      console.log(`   Actual: ${JSON.stringify(result.actual)}`);
    }
  } catch (error) {
    results.push({
      name,
      passed: false,
      details: error instanceof Error ? error.message : String(error),
      expected: null,
      actual: null,
    });
    console.log(`❌ ${name}`);
    console.log(`   Error: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function runTests() {
  console.log('\n🧪 RPS Import Verification Tests\n');

  // Test 1: Total group count
  await test('Total groups imported (10)', async () => {
    const { count } = await supabase.from('rps_groups').select('*', { count: 'exact' });
    const expected = 10;
    const actual = count || 0;
    return {
      passed: actual === expected,
      details: `Found ${actual} groups`,
      expected,
      actual,
    };
  });

  // Test 2: Total parts count
  await test('Total parts imported (73)', async () => {
    const { count } = await supabase.from('rps_parts').select('*', { count: 'exact' });
    const expected = 73;
    const actual = count || 0;
    return {
      passed: actual === expected,
      details: `Found ${actual} parts`,
      expected,
      actual,
    };
  });

  // Test 3: Total illustrations count
  await test('Total illustrations imported (10)', async () => {
    const { count } = await supabase.from('rps_illustrations').select('*', { count: 'exact' });
    const expected = 10;
    const actual = count || 0;
    return {
      passed: actual === expected,
      details: `Found ${actual} illustrations`,
      expected,
      actual,
    };
  });

  // Test 4: All expected groups exist
  await test('All 10 groups exist (EA, ED, FBD, FDA, FDB, FDE, HA, J, JA, JB)', async () => {
    const expectedGroups = ['EA', 'ED', 'FBD', 'FDA', 'FDB', 'FDE', 'HA', 'J', 'JA', 'JB'];
    const { data: groups } = await supabase.from('rps_groups').select('group_code').order('group_code');
    const actual = (groups || []).map((g: any) => g.group_code).sort();
    const passed = JSON.stringify(actual) === JSON.stringify(expectedGroups.sort());
    return {
      passed,
      details: passed ? 'All groups found' : 'Missing or extra groups',
      expected: expectedGroups.sort(),
      actual,
    };
  });

  // Test 5: FDA has 26 parts
  await test('Group FDA has 26 parts', async () => {
    const { count } = await supabase.from('rps_parts').select('*', { count: 'exact' }).eq('group_code', 'FDA');
    const expected = 26;
    const actual = count || 0;
    return {
      passed: actual === expected,
      details: `Found ${actual} parts in FDA`,
      expected,
      actual,
    };
  });

  // Test 6: FDB has 13 parts
  await test('Group FDB has 13 parts', async () => {
    const { count } = await supabase.from('rps_parts').select('*', { count: 'exact' }).eq('group_code', 'FDB');
    const expected = 13;
    const actual = count || 0;
    return {
      passed: actual === expected,
      details: `Found ${actual} parts in FDB`,
      expected,
      actual,
    };
  });

  // Test 7: JA has 11 parts
  await test('Group JA has 11 parts', async () => {
    const { count } = await supabase.from('rps_parts').select('*', { count: 'exact' }).eq('group_code', 'JA');
    const expected = 11;
    const actual = count || 0;
    return {
      passed: actual === expected,
      details: `Found ${actual} parts in JA`,
      expected,
      actual,
    };
  });

  // Test 8: No NULL descriptions
  await test('No parts have NULL descriptions', async () => {
    const { data: nullParts } = await supabase.from('rps_parts').select('id').is('description', null);
    const actual = (nullParts || []).length;
    const expected = 0;
    return {
      passed: actual === expected,
      details: actual === 0 ? 'All parts have descriptions' : `Found ${actual} parts with NULL description`,
      expected,
      actual,
    };
  });

  // Test 9: NIIN fields are properly populated
  await test('NIIN fields are either properly formatted or NULL', async () => {
    const { data: parts } = await supabase.from('rps_parts').select('niin').not('niin', 'is', null);
    const validNIINs = (parts || []).filter((p: any) => {
      const niin = p.niin;
      // NIIN format: XX-XXX-XXXX (11-14 chars with dashes)
      return niin && /^\d{2}-\d{3}-\d{4}/.test(niin);
    }).length;
    const total = (parts || []).length;
    const passed = validNIINs === total;
    return {
      passed,
      details: `${validNIINs}/${total} NIINs properly formatted`,
      expected: total,
      actual: validNIINs,
    };
  });

  // Test 10: NSN fields are properly populated
  await test('NSN fields are either properly formatted or NULL', async () => {
    const { data: parts } = await supabase.from('rps_parts').select('nsn').not('nsn', 'is', null);
    const validNSNs = (parts || []).filter((p: any) => {
      const nsn = p.nsn;
      // NSN should be numeric, possibly with spaces or dashes
      return nsn && /^[\d\s\-]+$/.test(nsn);
    }).length;
    const total = (parts || []).length;
    const passed = validNSNs === total;
    return {
      passed,
      details: `${validNSNs}/${total} NSNs properly formatted`,
      expected: total,
      actual: validNSNs,
    };
  });

  // Test 11: Composite key uniqueness (group_code + item_number)
  await test('No duplicate (group_code, item_number) pairs', async () => {
    const { data: parts } = await supabase.from('rps_parts').select('group_code, item_number');
    const seen = new Set<string>();
    let duplicates = 0;
    (parts || []).forEach((p: any) => {
      const key = `${p.group_code}:${p.item_number}`;
      if (seen.has(key)) {
        duplicates++;
      } else {
        seen.add(key);
      }
    });
    return {
      passed: duplicates === 0,
      details: duplicates === 0 ? 'All composite keys unique' : `Found ${duplicates} duplicates`,
      expected: 0,
      actual: duplicates,
    };
  });

  // Test 12: Repair grades are valid
  await test('Repair grades are valid (L, M, H, or NULL)', async () => {
    const { data: parts } = await supabase.from('rps_parts').select('repair_grade').not('repair_grade', 'is', null);
    const validGrades = (parts || []).filter((p: any) => /^[LMH]$/.test(p.repair_grade)).length;
    const total = (parts || []).length;
    const passed = validGrades === total;
    return {
      passed,
      details: `${validGrades}/${total} repair grades valid`,
      expected: total,
      actual: validGrades,
    };
  });

  // Test 13: Item numbers are numeric
  await test('Item numbers are numeric or alphanumeric', async () => {
    const { data: parts } = await supabase.from('rps_parts').select('item_number');
    const validItems = (parts || []).filter((p: any) => /^[0-9A-Z\-]+$/.test(p.item_number)).length;
    const total = (parts || []).length;
    const passed = validItems === total;
    return {
      passed,
      details: `${validItems}/${total} item numbers valid`,
      expected: total,
      actual: validItems,
    };
  });

  // Test 14: Query by NIIN sample
  await test('Can query parts by NIIN', async () => {
    const { data: parts } = await supabase.from('rps_parts').select('*').not('niin', 'is', null).limit(1);
    if (!parts || parts.length === 0) {
      return {
        passed: false,
        details: 'No parts with NIIN found',
        expected: 'At least 1 part with NIIN',
        actual: 0,
      };
    }
    const niin = parts[0].niin;
    const { data: found } = await supabase.from('rps_parts').select('*').eq('niin', niin);
    const passed = (found || []).length > 0;
    return {
      passed,
      details: `Found ${(found || []).length} part(s) with NIIN ${niin}`,
      expected: 1,
      actual: (found || []).length,
    };
  });

  // Test 15: Query by group_code
  await test('Can query parts by group_code', async () => {
    const { data: parts } = await supabase.from('rps_parts').select('*').eq('group_code', 'FDA');
    const expected = 26;
    const actual = (parts || []).length;
    return {
      passed: actual === expected,
      details: `Found ${actual} parts in group FDA`,
      expected,
      actual,
    };
  });

  // Test 16: Illustrations have descriptions
  await test('Illustrations have descriptions or titles', async () => {
    const { data: illus } = await supabase.from('rps_illustrations').select('description, title').limit(5);
    const hasContent = (illus || []).filter((i: any) => i.description || i.title).length;
    const total = (illus || []).length;
    const passed = hasContent >= Math.max(0, total - 1);
    return {
      passed,
      details: `${hasContent}/${total} illustrations have content`,
      expected: total,
      actual: hasContent,
    };
  });

  // Test 17: Page numbers are valid
  await test('Parts have valid page_number entries', async () => {
    const { data: parts } = await supabase.from('rps_parts').select('page_number').not('page_number', 'is', null);
    const validPages = (parts || []).filter((p: any) => typeof p.page_number === 'number' && p.page_number > 0).length;
    const total = (parts || []).length;
    const passed = validPages === total;
    return {
      passed,
      details: `${validPages}/${total} parts have valid page numbers`,
      expected: total,
      actual: validPages,
    };
  });

  // Test 18: Sample data accuracy - FDA Gear Shift Lever
  await test('Sample data accuracy: FDA Gear Shift Lever found', async () => {
    const { data: parts } = await supabase.from('rps_parts').select('*').eq('group_code', 'FDA').ilike('description', '%gear%shift%');
    const passed = (parts || []).length > 0;
    return {
      passed,
      details: passed ? `Found gear shift related part in FDA` : 'Gear shift part not found',
      expected: true,
      actual: passed,
    };
  });

  // Test 19: Check field lengths are correct
  await test('Column VARCHAR lengths support data', async () => {
    const { data: parts } = await supabase.from('rps_parts').select('niin, nsn, item_number, rps_number, group_code');
    let passed = true;
    let issues: string[] = [];

    (parts || []).forEach((p: any) => {
      if (p.niin && p.niin.length > 20) issues.push(`NIIN too long: ${p.niin.length}`);
      if (p.nsn && p.nsn.length > 25) issues.push(`NSN too long: ${p.nsn.length}`);
      if (p.item_number && p.item_number.length > 16) issues.push(`item_number too long: ${p.item_number.length}`);
      if (p.rps_number && p.rps_number.length > 10) issues.push(`rps_number too long: ${p.rps_number.length}`);
      if (p.group_code && p.group_code.length > 5) issues.push(`group_code too long: ${p.group_code.length}`);
    });

    passed = issues.length === 0;
    return {
      passed,
      details: passed ? 'All column lengths within limits' : issues[0],
      expected: 'All within limits',
      actual: issues.length > 0 ? issues[0] : 'OK',
    };
  });

  // Test 20: Cross-references are removed from descriptions
  await test('Cross-references cleaned from descriptions', async () => {
    const { data: parts } = await supabase.from('rps_parts').select('description').limit(10);
    const hasRefs = (parts || []).filter((p: any) => /refer to|see|refer|section|page|figure/i.test(p.description || '')).length;
    const total = (parts || []).length;
    const ratioClean = (total - hasRefs) / total;
    const passed = ratioClean > 0.8; // 80% should be clean
    return {
      passed,
      details: `${ratioClean * 100}% of descriptions are clean`,
      expected: '>80%',
      actual: `${(ratioClean * 100).toFixed(1)}%`,
    };
  });

  console.log('\n' + '='.repeat(80));
  console.log('TEST SUMMARY');
  console.log('='.repeat(80) + '\n');

  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  const passRate = (passed / total * 100).toFixed(1);

  console.log(`Results: ${passed}/${total} tests passed (${passRate}%)\n`);

  if (passed < total) {
    console.log('Failed Tests:');
    results
      .filter(r => !r.passed)
      .forEach(r => {
        console.log(`  - ${r.name}: ${r.details}`);
      });
  }

  const allPassed = passed === total;
  console.log(`\n${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}\n`);

  return allPassed ? 0 : 1;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runTests()
    .then(code => process.exit(code))
    .catch(error => {
      console.error('Test suite failed:', error);
      process.exit(1);
    });
}

export { runTests };
