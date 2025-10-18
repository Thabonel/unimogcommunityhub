#!/usr/bin/env tsx

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PDF_DIR = '/Users/thabonel/Code/Work/rps_processed';
const OUTPUT_DIR = path.join(__dirname, 'output');
const ILLUS_DIR = path.join(OUTPUT_DIR, 'ai_illustrations');

console.log('\n' + '='.repeat(120));
console.log('EXTRACTING REMAINING PDF PAGES (96-930)');
console.log('='.repeat(120) + '\n');

async function extractRemainingPages() {
  console.log('STAGE 1: Extracting pages 96-930 from all PDF chunks...\n');

  if (!fs.existsSync(ILLUS_DIR)) {
    fs.mkdirSync(ILLUS_DIR, { recursive: true });
  }

  const pdfFiles = fs.readdirSync(PDF_DIR)
    .filter(f => f.endsWith('.pdf'))
    .sort();

  console.log(`Found ${pdfFiles.length} PDF files\n`);

  let totalExtracted = 0;
  let startPage = 96; // Start from page 96

  for (const pdfFile of pdfFiles) {
    const fullPath = path.join(PDF_DIR, pdfFile);
    const match = pdfFile.match(/pages_(\d+)-(\d+)/);

    if (!match) {
      console.log(`  Skipping ${pdfFile} (no page range found)`);
      continue;
    }

    const pdfStartPage = parseInt(match[1]);
    const pdfEndPage = parseInt(match[2]);

    // Only process if this PDF contains pages >= 96
    if (pdfEndPage < 96) {
      console.log(`  Skipping ${pdfFile} (ends at page ${pdfEndPage})`);
      continue;
    }

    // Calculate which pages in this PDF to extract
    const extractStart = Math.max(pdfStartPage, 96);
    const extractEnd = Math.min(pdfEndPage, 930);

    console.log(`  Processing ${pdfFile} (extracting pages ${extractStart}-${extractEnd})...`);

    // Extract pages from this PDF
    for (let page = extractStart; page <= extractEnd; page++) {
      const outputName = `rps_page_${String(page).padStart(4, '0')}`;
      const outputPath = path.join(ILLUS_DIR, outputName);

      // Skip if already exists (from earlier extraction)
      if (fs.existsSync(`${outputPath}.png`)) {
        continue;
      }

      try {
        execSync(
          `pdftoppm -png -singlefile -f ${page} -l ${page} "${fullPath}" "${outputPath}" 2>/dev/null`,
          { stdio: 'pipe' }
        );

        if (fs.existsSync(`${outputPath}.png`)) {
          totalExtracted++;

          if (totalExtracted % 50 === 0) {
            console.log(`    Progress: ${totalExtracted} pages extracted...`);
          }
        }
      } catch (e) {
        // Skip failed pages
      }
    }
  }

  console.log(`\n✅ Extracted ${totalExtracted} additional pages (96-930)\n`);
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
  console.log(`Total: ${files.length}\n`);

  return files.length;
}

async function main() {
  try {
    const extracted = await extractRemainingPages();
    const total = await verifyExtraction();

    console.log('='.repeat(120));
    console.log('✅ EXTRACTION OF REMAINING PAGES COMPLETE');
    console.log('='.repeat(120));
    console.log(`\nResults:`);
    console.log(`  • ${extracted} new pages extracted (96-930)`);
    console.log(`  • ${total} total PNG files available`);
    console.log(`  • Ready for database linking\n`);

    return 0;
  } catch (error) {
    console.error('Failed:', error);
    return 1;
  }
}

main().then(code => process.exit(code));
