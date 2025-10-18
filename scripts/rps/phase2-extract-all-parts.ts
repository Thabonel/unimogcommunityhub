#!/usr/bin/env tsx

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PDF_DIR = '/Users/thabonel/Code/Work/rps_processed';
const OUTPUT_DIR = path.join(__dirname, 'output');

async function extractTextFromPDF(pdfPath: string): Promise<string> {
  try {
    // Use pdftotext to extract text from PDF
    const text = execSync(`pdftotext "${pdfPath}" - 2>/dev/null || echo ""`, { encoding: 'utf-8' });
    return text;
  } catch (e) {
    return '';
  }
}

async function buildMasterIndex() {
  console.log('\n' + '='.repeat(80));
  console.log('PHASE 1.2: BUILD MASTER RPS INDEX');
  console.log('='.repeat(80) + '\n');

  const pdfFiles = fs.readdirSync(PDF_DIR)
    .filter(f => f.endsWith('.pdf') && !f.includes('_a') && !f.includes('_b') && !f.includes('_c'))
    .sort();

  console.log(`Analyzing ${pdfFiles.length} complete PDF chunks...\n`);

  const groups = new Map<string, any>();
  let totalPages = 0;

  for (const pdfFile of pdfFiles) {
    const fullPath = path.join(PDF_DIR, pdfFile);
    const match = pdfFile.match(/pages_(\d+)-(\d+)/);

    if (!match) continue;

    const startPage = parseInt(match[1]);
    const endPage = parseInt(match[2]);
    const pageCount = endPage - startPage + 1;

    console.log(`\n📄 ${pdfFile}`);
    console.log(`   Extracting text from pages ${startPage}-${endPage}...`);

    try {
      const text = await extractTextFromPDF(fullPath);

      // Find group codes (pattern: Two or more uppercase letters followed by number)
      // Common patterns: EA, ED, FDA, FDB, HA, J, JA, JB, etc.
      const groupPattern = /\n([A-Z]{1,3})\s/g;
      const foundGroups = new Set<string>();

      let match;
      while ((match = groupPattern.exec(text)) !== null) {
        foundGroups.add(match[1]);
      }

      console.log(`   Found groups: ${Array.from(foundGroups).sort().join(', ')}`);
      totalPages += pageCount;

      for (const groupCode of foundGroups) {
        if (!groups.has(groupCode)) {
          groups.set(groupCode, {
            group_code: groupCode,
            pdf_chunks: [],
            page_ranges: [],
            parts: [],
            illustrations: [],
          });
        }

        groups.get(groupCode)!.pdf_chunks.push(pdfFile);
        groups.get(groupCode)!.page_ranges.push(`${startPage}-${endPage}`);
      }
    } catch (error) {
      console.log(`   ⚠️ Error extracting: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`\nMaster Index Summary:`);
  console.log(`  Total groups found: ${groups.size}`);
  console.log(`  Total pages analyzed: ${totalPages}`);
  console.log(`\n  Groups:`);

  const sortedGroups = Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b));
  sortedGroups.forEach(([code, data]) => {
    console.log(`    ${code}: in ${data.pdf_chunks.length} chunk(s)`);
  });

  // Save master index
  const index = {
    manual: 'RPS-02155 Unimog',
    total_pages: totalPages,
    groups_found: groups.size,
    created_at: new Date().toISOString(),
    groups: Object.fromEntries(sortedGroups),
  };

  const indexPath = path.join(OUTPUT_DIR, 'master_rps_index.json');
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));

  console.log(`\n✅ Saved master index with ${groups.size} groups\n`);

  return index;
}

async function runPhase1Step2() {
  console.log('\n🚀 STARTING PHASE 1.2: INDEX BUILDING\n');

  try {
    const index = await buildMasterIndex();

    console.log('='.repeat(80));
    console.log('✅ PHASE 1.2 COMPLETE');
    console.log('='.repeat(80));
    console.log(`\nFound ${index.groups_found} groups across ${index.total_pages} pages`);
    console.log('\nNext: Phase 2 - Extract all parts and illustrations\n');

    return 0;
  } catch (error) {
    console.error('Phase 1.2 failed:', error);
    return 1;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runPhase1Step2()
    .then(code => process.exit(code))
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}
