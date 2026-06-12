#!/usr/bin/env node
/**
 * Barry v2 Part Number Import
 * Updates barry_v2_content_blocks.part_numbers arrays with extracted part numbers.
 * Stores Mercedes OEM part numbers from manual text on each block.
 *
 * Usage: node scripts/link-barry-v2-rps.mjs
 */

import { createHash } from 'crypto';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const ENRICHMENT_FILE = 'docs/enrichment/enrichment_results.json';
const EXTRACTION_DIR = 'docs/extraction';
const OUTPUT_DIR = 'docs/parts';

function uuidFrom(str) {
  const hex = createHash('md5').update(str).digest('hex');
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20,32)}`;
}

function main() {
  if (!existsSync(ENRICHMENT_FILE)) {
    console.error('Error: run python3 scripts/enrich-barry-v2.py first');
    process.exit(1);
  }

  const enrichment = JSON.parse(readFileSync(ENRICHMENT_FILE, 'utf-8'));
  const partNumbersBySource = enrichment.part_numbers || {};
  
  console.log(`Sources with part numbers: ${Object.keys(partNumbersBySource).length}`);

  // Find which blocks contain which part numbers
  const blockPartMap = new Map(); // block_uuid -> Set of part numbers

  for (const [source, parts] of Object.entries(partNumbersBySource)) {
    const extFile = `${EXTRACTION_DIR}/${source}_extraction.json`;
    if (!existsSync(extFile)) continue;

    const extData = JSON.parse(readFileSync(extFile, 'utf-8'));
    
    for (const part of parts) {
      for (let bi = 0; bi < extData.content_blocks.length; bi++) {
        const block = extData.content_blocks[bi];
        if ((block.content_text || '').includes(part)) {
          const blockUuid = uuidFrom(`block:${source}:${bi}`);
          if (!blockPartMap.has(blockUuid)) blockPartMap.set(blockUuid, new Set());
          blockPartMap.get(blockUuid).add(part);
        }
      }
    }
  }

  console.log(`Blocks with part numbers: ${blockPartMap.size}`);
  console.log(`Total block-part associations: ${[...blockPartMap.values()].reduce((a, s) => a + s.size, 0)}`);

  // Generate SQL UPDATE statements
  console.log('\nGenerating SQL...');
  const sqlLines = ['-- Barry v2 Part Number Import', `-- ${blockPartMap.size} blocks`, 'BEGIN;\n'];

  for (const [blockUuid, parts] of blockPartMap) {
    const partArr = [...parts].sort();
    const partSql = partArr.map(p => `'${p.replace(/'/g, "''")}'`).join(', ');
    sqlLines.push(
      `UPDATE barry_v2_content_blocks SET part_numbers = ARRAY[${partSql}] WHERE id = '${blockUuid}';`
    );
  }

  sqlLines.push('\nCREATE INDEX IF NOT EXISTS idx_barry_v2_blocks_parts ON barry_v2_content_blocks USING gin(part_numbers);');
  sqlLines.push('\nCOMMIT;');

  const sqlContent = sqlLines.join('\n');
  const sqlPath = join(OUTPUT_DIR, 'parts_import.sql');
  writeFileSync(sqlPath, sqlContent);
  console.log(`SQL: ${sqlPath} (${(Buffer.byteLength(sqlContent)/1024).toFixed(0)}KB, ${blockPartMap.size} UPDATEs)`);

  // Show top 10 most common parts
  console.log('\nTop 10 most common part numbers:');
  const partFreq = new Map();
  for (const parts of blockPartMap.values()) {
    for (const p of parts) {
      partFreq.set(p, (partFreq.get(p) || 0) + 1);
    }
  }
  const sorted = [...partFreq.entries()].sort((a, b) => b[1] - a[1]);
  for (const [part, freq] of sorted.slice(0, 10)) {
    console.log(`  ${part.padEnd(16)} ${freq} blocks`);
  }
}

try { main(); } catch (e) { console.error('Fatal:', e); process.exit(1); }
