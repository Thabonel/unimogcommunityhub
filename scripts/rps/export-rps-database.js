#!/usr/bin/env node

// This script documents how to export RPS database via Supabase MCP
// Claude will run the SQL queries and combine results

console.log('=== RPS Database Export Instructions ===\n');
console.log('Claude needs to run these SQL queries via Supabase MCP:\n');

const batches = [
  'OFFSET 0',   // 0-99
  'OFFSET 100', // 100-199
  'OFFSET 200', // 200-299
  'OFFSET 300', // 300-399
  'OFFSET 400', // 400-499
  'OFFSET 500', // 500-599
  'OFFSET 600', // 600-699
  'OFFSET 700'  // 700-799
];

batches.forEach((offset, i) => {
  console.log(`Batch ${i + 1}:`);
  console.log(`SELECT`);
  console.log(`  id::text,`);
  console.log(`  page_number,`);
  console.log(`  section_title,`);
  console.log(`  page_image_url,`);
  console.log(`  rps_group_code,`);
  console.log(`  rps_group_name`);
  console.log(`FROM manual_chunks`);
  console.log(`WHERE manual_title LIKE '%RPS%' OR manual_title LIKE '%02155%'`);
  console.log(`ORDER BY page_number ASC`);
  console.log(`LIMIT 100 ${offset};`);
  console.log('');
});

console.log('After running all batches, combine results into:');
console.log('scripts/rps/rps-database-export.json');
console.log('');
console.log('Then run: npx tsx scripts/rps/cleanup-and-sync-mcp.ts');
