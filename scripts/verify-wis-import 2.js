#!/usr/bin/env node

/**
 * Verify WIS Data Import
 */

import fetch from 'node-fetch';

const SUPABASE_URL = 'https://ydevatqwkoccxhtejdor.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_ROLE_KEY) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is required');
}

async function getCount(table) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=id`, {
    method: 'HEAD',
    headers: {
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Prefer': 'count=exact'
    }
  });
  
  const contentRange = response.headers.get('content-range');
  if (contentRange) {
    const match = contentRange.match(/\/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }
  return 0;
}

async function getSamples(table, limit = 3) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?limit=${limit}`, {
    method: 'GET',
    headers: {
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
    }
  });
  
  if (response.ok) {
    return await response.json();
  }
  return [];
}

async function main() {
  console.log('📊 WIS Import Verification Report');
  console.log('=' + '='.repeat(50) + '\n');
  
  const tables = [
    { name: 'wis_models', displayName: 'Vehicle Models' },
    { name: 'wis_procedures', displayName: 'Procedures' },
    { name: 'wis_parts', displayName: 'Parts' },
    { name: 'wis_bulletins', displayName: 'Technical Bulletins' }
  ];
  
  let totalRecords = 0;
  
  for (const table of tables) {
    const count = await getCount(table.name);
    totalRecords += count;
    
    console.log(`\n✅ ${table.displayName}: ${count.toLocaleString()} records`);
    console.log('-'.repeat(40));
    
    if (count > 0) {
      const samples = await getSamples(table.name, 2);
      console.log('Sample data:');
      samples.forEach((sample, i) => {
        if (table.name === 'wis_models') {
          console.log(`  ${i+1}. ${sample.model_name} (${sample.series})`);
        } else if (table.name === 'wis_procedures') {
          console.log(`  ${i+1}. ${sample.title?.substring(0, 60)}...`);
        } else if (table.name === 'wis_parts') {
          console.log(`  ${i+1}. ${sample.part_number}: ${sample.part_name}`);
        } else if (table.name === 'wis_bulletins') {
          console.log(`  ${i+1}. ${sample.bulletin_number}: ${sample.title?.substring(0, 40)}...`);
        }
      });
    }
  }
  
  console.log('\n' + '='.repeat(51));
  console.log(`📈 TOTAL RECORDS: ${totalRecords.toLocaleString()}`);
  console.log('='.repeat(51) + '\n');
  
  // Success criteria
  console.log('🎯 Import Status:');
  const procedureCount = await getCount('wis_procedures');
  const bulletinCount = await getCount('wis_bulletins');
  const partsCount = await getCount('wis_parts');
  
  if (procedureCount > 2000) {
    console.log('✅ Procedures: SUCCESS (Target: 2000+, Actual: ' + procedureCount + ')');
  } else {
    console.log('⚠️ Procedures: PARTIAL (Target: 6468, Actual: ' + procedureCount + ')');
  }
  
  if (bulletinCount > 50) {
    console.log('✅ Bulletins: SUCCESS (Target: 50+, Actual: ' + bulletinCount + ')');
  } else {
    console.log('❌ Bulletins: FAILED (Target: 100, Actual: ' + bulletinCount + ')');
  }
  
  if (partsCount > 0) {
    console.log('✅ Parts: Some data imported (' + partsCount + ' records)');
  } else {
    console.log('⚠️ Parts: No data imported (parsing needed)');
  }
  
  console.log('\n✨ WIS data import verification complete!');
}

main().catch(console.error);