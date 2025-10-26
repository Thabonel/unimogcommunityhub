// Export RPS database entries in batches via Supabase MCP
const fs = require('fs');
const path = require('path');

console.log('This file documents the SQL query needed.');
console.log('Claude will execute this via Supabase MCP:');
console.log('');
console.log('SELECT');
console.log('  id::text,');
console.log('  page_number,');
console.log('  section_title,');
console.log('  page_image_url,');
console.log('  rps_group_code,');
console.log('  rps_group_name');
console.log('FROM manual_chunks');
console.log('WHERE manual_title LIKE \'%RPS%\' OR manual_title LIKE \'%02155%\'');
console.log('ORDER BY page_number ASC');
console.log('LIMIT 100 OFFSET 0;');
console.log('');
console.log('Run this query multiple times with OFFSET 0, 100, 200, ... 700');
console.log('to get all ~727 entries, then combine into rps-database-export.json');
