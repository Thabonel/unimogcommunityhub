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

async function getAllIllustrations() {
  console.log('\n📊 RPS Illustrations Inventory\n');

  const { data: illus } = await supabase
    .from('rps_illustrations')
    .select('*')
    .order('group_code, figure_number');

  console.log(`Total illustrations in database: ${(illus || []).length}\n`);

  const grouped = new Map<string, any[]>();
  (illus || []).forEach(i => {
    if (!grouped.has(i.group_code)) {
      grouped.set(i.group_code, []);
    }
    grouped.get(i.group_code)!.push(i);
  });

  console.log('Illustrations by group:\n');
  for (const [groupCode, illustrations] of grouped) {
    console.log(`${groupCode}: ${illustrations.length} illustration(s)`);
    illustrations.forEach(i => {
      console.log(`  - Figure ${i.figure_number} (page ${i.page_number})`);
      console.log(`    ${i.description?.substring(0, 70) || 'No description'}`);
    });
    console.log();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  getAllIllustrations()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Error:', error);
      process.exit(1);
    });
}
