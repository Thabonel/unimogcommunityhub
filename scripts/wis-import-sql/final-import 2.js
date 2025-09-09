#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🚀 WIS Import via Supabase REST API');
console.log('====================================\n');

// Since direct SQL import is having issues, let's provide clear instructions
console.log('📋 MANUAL IMPORT INSTRUCTIONS');
console.log('─────────────────────────────\n');

console.log('Since the automated import is having authentication issues,');
console.log('please complete the import manually using Supabase SQL Editor:\n');

console.log('1. Open SQL Editor:');
console.log('   https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor/sql/new\n');

console.log('2. Vehicle Models: ✅ Already imported (41 models)\n');

console.log('3. Import Procedures (33 files):');
console.log('   Location: scripts/wis-import-sql/procedures-chunks/');
console.log('   - Open chunk-01-procedures.sql');
console.log('   - Copy all content');
console.log('   - Paste in SQL Editor');
console.log('   - Click "Run"');
console.log('   - Repeat for all 33 chunks\n');

console.log('4. Import Parts:');
console.log('   - Open: scripts/wis-import-sql/03-import-parts.sql');
console.log('   - Copy all content');
console.log('   - Paste in SQL Editor');
console.log('   - Click "Run"\n');

console.log('5. Import Bulletins:');
console.log('   - Open: scripts/wis-import-sql/04-import-bulletins.sql');
console.log('   - Copy all content');
console.log('   - Paste in SQL Editor');
console.log('   - Click "Run"\n');

console.log('💡 Tips:');
console.log('   - Open multiple SQL Editor tabs to run chunks in parallel');
console.log('   - Each chunk takes about 5-10 seconds');
console.log('   - Total time: ~10-15 minutes\n');

console.log('📊 After import, verify with:');
console.log(`SELECT 
  (SELECT COUNT(*) FROM wis_models) as models,
  (SELECT COUNT(*) FROM wis_procedures) as procedures,
  (SELECT COUNT(*) FROM wis_parts) as parts,
  (SELECT COUNT(*) FROM wis_bulletins) as bulletins;\n`);

console.log('Expected results:');
console.log('- models: 41 ✅');
console.log('- procedures: 6,468');
console.log('- parts: 197+');
console.log('- bulletins: varies\n');

// Check current status via REST API
async function checkStatus() {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/wis_models?select=count`,
      {
        headers: {
          'apikey': SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
          'Prefer': 'count=exact'
        }
      }
    );
    
    const modelCount = response.headers.get('content-range')?.split('/')[1] || '0';
    console.log(`Current status: ${modelCount} vehicle models in database ✅\n`);
  } catch (error) {
    console.log('Could not check current status\n');
  }
}

await checkStatus();

console.log('📁 Files ready at:');
console.log(path.join(__dirname));
console.log('\nPlease proceed with manual import via SQL Editor.');