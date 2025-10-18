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

async function debugDatabase() {
  console.log('\n🔍 Database Debug Report\n');

  // Get all groups
  const { data: allGroups } = await supabase.from('rps_groups').select('group_code').order('group_code');
  console.log('All Groups in Database:');
  (allGroups || []).forEach(g => console.log(`  - ${g.group_code}`));

  console.log('\nExpected Groups:');
  const expectedGroups = ['EA', 'ED', 'FBD', 'FDA', 'FDB', 'FDE', 'HA', 'J', 'JA', 'JB'];
  expectedGroups.forEach(g => console.log(`  - ${g}`));

  const actualGroupSet = new Set((allGroups || []).map((g: any) => g.group_code));
  const expectedGroupSet = new Set(expectedGroups);

  const extra = Array.from(actualGroupSet).filter(g => !expectedGroupSet.has(g));
  const missing = Array.from(expectedGroupSet).filter(g => !actualGroupSet.has(g));

  if (extra.length > 0) {
    console.log(`\n⚠️  Extra groups (should be removed): ${extra.join(', ')}`);
  }
  if (missing.length > 0) {
    console.log(`\n⚠️  Missing groups: ${missing.join(', ')}`);
  }

  // Get counts for each group
  console.log('\n\nParts per Group:');
  for (const group of allGroups || []) {
    const { count } = await supabase.from('rps_parts').select('*', { count: 'exact' }).eq('group_code', group.group_code);
    console.log(`  ${group.group_code}: ${count} parts`);
  }

  // Get NSN format examples
  console.log('\n\nSample NSN values (malformed):');
  const { data: badNSNs } = await supabase
    .from('rps_parts')
    .select('nsn, group_code, item_number')
    .not('nsn', 'is', null)
    .limit(20);

  (badNSNs || []).forEach((p: any) => {
    if (!/^[\d\s\-]+$/.test(p.nsn)) {
      console.log(`  Group ${p.group_code}, Item ${p.item_number}: "${p.nsn}"`);
    }
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  debugDatabase()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Debug failed:', error);
      process.exit(1);
    });
}
