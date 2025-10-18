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

async function investigateGroups() {
  console.log('\n🔎 Investigating All Groups in Database\n');

  const { data: allGroups } = await supabase.from('rps_groups').select('*').order('group_code');

  for (const group of allGroups || []) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Group: ${group.group_code}`);
    console.log(`${'='.repeat(60)}`);
    console.log(`  Group Name: ${group.group_name || 'N/A'}`);
    console.log(`  RPS Number: ${group.rps_number || 'N/A'}`);
    console.log(`  Pages: ${group.page_start}${group.page_end ? `-${group.page_end}` : ''}`);
    console.log(`  Chunk File: ${group.chunk_file || 'N/A'}`);

    // Get parts for this group
    const { data: parts, count: partCount } = await supabase
      .from('rps_parts')
      .select('item_number, description', { count: 'exact' })
      .eq('group_code', group.group_code)
      .limit(3);

    console.log(`  Total Parts: ${partCount}`);
    if ((parts || []).length > 0) {
      console.log(`  Sample Parts:`);
      (parts || []).forEach(p => {
        const desc = (p.description || '').substring(0, 60);
        console.log(`    - Item ${p.item_number}: ${desc}...`);
      });
    }

    // Get illustrations for this group
    const { data: illus, count: illusCount } = await supabase
      .from('rps_illustrations')
      .select('figure_number, description')
      .eq('group_code', group.group_code)
      .limit(2);

    console.log(`  Total Illustrations: ${illusCount}`);
    if ((illus || []).length > 0) {
      console.log(`  Sample Illustrations:`);
      (illus || []).forEach(i => {
        console.log(`    - Figure ${i.figure_number}: ${i.description || 'N/A'}`);
      });
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`SUMMARY`);
  console.log(`${'='.repeat(60)}`);

  const totalGroups = (allGroups || []).length;
  const { count: totalParts } = await supabase.from('rps_parts').select('*', { count: 'exact' });
  const { count: totalIllus } = await supabase.from('rps_illustrations').select('*', { count: 'exact' });

  console.log(`\nTotal Groups: ${totalGroups}`);
  console.log(`Total Parts: ${totalParts}`);
  console.log(`Total Illustrations: ${totalIllus}`);

  console.log(`\nGroups in Database:`);
  (allGroups || []).forEach(g => console.log(`  - ${g.group_code}`));

  const expectedGroups = ['EA', 'ED', 'FBD', 'FDA', 'FDB', 'FDE', 'HA', 'J', 'JA', 'JB'];
  const actualGroups = (allGroups || []).map((g: any) => g.group_code);
  const extraGroups = actualGroups.filter(g => !expectedGroups.includes(g));

  if (extraGroups.length > 0) {
    console.log(`\nExtra groups (not in final 10): ${extraGroups.join(', ')}`);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  investigateGroups()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Investigation failed:', error);
      process.exit(1);
    });
}
