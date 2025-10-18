#!/usr/bin/env tsx

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ORIGINAL_PDF = '/Users/thabonel/Code/Work/RPS-02155-Unimog-GS-Base-Scale.pdf';
const OUTPUT_DIR = path.join(__dirname, 'output');
const ILLUS_DIR = path.join(OUTPUT_DIR, 'ai_illustrations');

console.log('\n' + '='.repeat(120));
console.log('EXTRACTING PAGES 96-930 FROM COMPLETE RPS PDF');
console.log('='.repeat(120) + '\n');

async function extractAllPages() {
  console.log('STAGE 1: Extracting pages 96-930 from complete RPS PDF...\n');

  if (!fs.existsSync(ILLUS_DIR)) {
    fs.mkdirSync(ILLUS_DIR, { recursive: true });
  }

  let totalExtracted = 0;
  let skipped = 0;

  // Extract pages 96-930
  for (let page = 96; page <= 930; page++) {
    const outputName = `rps_page_${String(page).padStart(4, '0')}`;
    const outputPath = path.join(ILLUS_DIR, outputName);

    // Skip if already exists
    if (fs.existsSync(`${outputPath}.png`)) {
      skipped++;
      continue;
    }

    try {
      execSync(
        `pdftoppm -png -singlefile -f ${page} -l ${page} "${ORIGINAL_PDF}" "${outputPath}" 2>/dev/null`,
        { stdio: 'pipe' }
      );

      if (fs.existsSync(`${outputPath}.png`)) {
        totalExtracted++;

        if (totalExtracted % 50 === 0) {
          console.log(`  Progress: ${totalExtracted} pages extracted... (Page ${page})`);
        }
      }
    } catch (e) {
      // Skip failed pages
    }
  }

  console.log(`\n✅ Extracted ${totalExtracted} new pages (96-930)`);
  console.log(`   Skipped: ${skipped} already existing files`);
  console.log(`   Total in directory: ${totalExtracted + skipped + (fs.readdirSync(ILLUS_DIR).filter(f => f.endsWith('.png')).length - skipped - totalExtracted)}\n`);

  return totalExtracted;
}

async function verifyExtraction() {
  console.log('STAGE 2: Verifying all extracted pages...\n');

  const files = fs.readdirSync(ILLUS_DIR)
    .filter(f => f.endsWith('.png'))
    .sort();

  console.log(`Total PNG files in directory: ${files.length}\n`);

  // Count by range
  let pages1to95 = 0;
  let pages96to930 = 0;

  for (const file of files) {
    const match = file.match(/rps_page_(\d+)/);
    if (match) {
      const pageNum = parseInt(match[1]);
      if (pageNum <= 95) pages1to95++;
      else pages96to930++;
    }
  }

  console.log(`Pages 1-95: ${pages1to95}`);
  console.log(`Pages 96-930: ${pages96to930}`);
  console.log(`Total: ${files.length}`);
  console.log(`Coverage: ${((files.length / 930) * 100).toFixed(1)}%\n`);

  return files.length;
}

async function main() {
  try {
    const extracted = await extractAllPages();
    const total = await verifyExtraction();

    console.log('='.repeat(120));
    console.log('✅ EXTRACTION COMPLETE');
    console.log('='.repeat(120));
    console.log(`\nResults:`);
    console.log(`  • ${extracted} new pages extracted (96-930)`);
    console.log(`  • ${total} total PNG files available`);
    console.log(`  • Ready for comprehensive database linking\n`);

    return 0;
  } catch (error) {
    console.error('Failed:', error);
    return 1;
  }
}

main().then(code => process.exit(code));
