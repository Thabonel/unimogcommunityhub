#!/usr/bin/env tsx

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env
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

async function debug() {
  console.log('DEBUG: Illustration mismatch analysis\n');

  // Get all illustrations
  const { data: allIllus } = await supabase
    .from('rps_illustrations')
    .select('id, page_number');

  console.log('Database illustrations:');
  if (allIllus) {
    allIllus.forEach(ill => {
      console.log(`  - ID: ${ill.id}, Page: ${String(ill.page_number).padStart(4, '0')}`);
    });
  }

  console.log('\nExtracted PNG files:');
  const illus_dir = path.join(__dirname, 'output', 'ai_illustrations');
  const files = fs.readdirSync(illus_dir)
    .filter(f => f.endsWith('.png'))
    .sort();

  files.slice(0, 20).forEach(f => console.log(`  - ${f}`));
  if (files.length > 20) console.log(`  ... and ${files.length - 20} more`);

  console.log('\nMatching analysis:');
  if (allIllus) {
    for (const ill of allIllus) {
      const pageStr = String(ill.page_number).padStart(4, '0');
      const matching = files.filter(f => f.includes(pageStr));
      console.log(`  Page ${pageStr}: ${matching.length} matches`);
      if (matching.length > 0) {
        matching.forEach(m => console.log(`    - ${m}`));
      }
    }
  }

  // Try direct update
  console.log('\nAttempting direct update on one record...');
  if (allIllus && allIllus.length > 0) {
    const testIll = allIllus[0];
    const pageStr = String(testIll.page_number).padStart(4, '0');
    const matchingFile = files.find(f => f.includes(pageStr));

    if (matchingFile) {
      const uploadPath = `rps_illustrations/${matchingFile}`;
      const { data } = supabase.storage
        .from('rps_illustrations')
        .getPublicUrl(uploadPath);

      console.log(`  Test URL: ${data.publicUrl}`);

      const { data: updateResult, error: updateError } = await supabase
        .from('rps_illustrations')
        .update({ image_url: data.publicUrl })
        .eq('id', testIll.id)
        .select();

      if (updateError) {
        console.log(`  Update error: ${updateError.message}`);
      } else {
        console.log(`  Update succeeded: ${updateResult?.length || 0} records updated`);
        if (updateResult && updateResult.length > 0) {
          console.log(`  Result: ${JSON.stringify(updateResult[0], null, 2)}`);
        }
      }
    }
  }
}

debug().catch(console.error);
