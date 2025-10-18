#!/usr/bin/env tsx

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PDF_DIR = '/Users/thabonel/Code/Work/rps_processed';
const OUTPUT_DIR = path.join(__dirname, 'output');

interface PDFInfo {
  filename: string;
  pages: number;
  start_page: number;
  end_page: number;
  size_mb: number;
}

async function analyzePDFStructure() {
  console.log('\n' + '='.repeat(80));
  console.log('PHASE 1.1: PDF STRUCTURE ANALYSIS');
  console.log('='.repeat(80) + '\n');

  const pdfFiles = fs.readdirSync(PDF_DIR)
    .filter(f => f.endsWith('.pdf'))
    .sort();

  console.log(`Found ${pdfFiles.length} PDF chunks\n`);

  const analysis: PDFInfo[] = [];
  let totalPages = 0;
  let totalSize = 0;

  for (const pdfFile of pdfFiles) {
    const fullPath = path.join(PDF_DIR, pdfFile);
    const stats = fs.statSync(fullPath);
    const sizeMb = (stats.size / 1024 / 1024).toFixed(2);

    // Extract page range from filename
    const match = pdfFile.match(/pages_(\d+)-(\d+)/);
    if (match) {
      const startPage = parseInt(match[1]);
      const endPage = parseInt(match[2]);
      const pageCount = endPage - startPage + 1;

      analysis.push({
        filename: pdfFile,
        pages: pageCount,
        start_page: startPage,
        end_page: endPage,
        size_mb: parseFloat(sizeMb),
      });

      totalPages += pageCount;
      totalSize += parseFloat(sizeMb);

      console.log(`${pdfFile}`);
      console.log(`  Pages: ${startPage}-${endPage} (${pageCount} pages, ${sizeMb} MB)`);
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`TOTAL: ${pdfFiles.length} chunks, ${totalPages} pages, ${totalSize.toFixed(1)} MB\n`);

  // Save analysis
  const analysisPath = path.join(OUTPUT_DIR, 'pdf_structure_analysis.json');
  fs.writeFileSync(analysisPath, JSON.stringify(analysis, null, 2));

  console.log(`✅ Saved to: pdf_structure_analysis.json\n`);

  return analysis;
}

async function createInitialIndex() {
  console.log('\n' + '='.repeat(60));
  console.log('CREATING INITIAL RPS INDEX');
  console.log('='.repeat(60) + '\n');

  const initialIndex = {
    manual: 'RPS-02155 Unimog',
    total_pages: 930,
    total_pdf_chunks: 10,
    groups: [] as any[],
    extraction_date: new Date().toISOString(),
    notes: 'This index will be filled during extraction phase',
  };

  const indexPath = path.join(OUTPUT_DIR, 'master_rps_index.json');
  fs.writeFileSync(indexPath, JSON.stringify(initialIndex, null, 2));

  console.log('✅ Created master_rps_index.json template\n');

  return initialIndex;
}

async function createProgressTracker() {
  console.log('\n' + '='.repeat(60));
  console.log('CREATING PROGRESS TRACKER');
  console.log('='.repeat(60) + '\n');

  const tracker = {
    creation_date: new Date().toISOString(),
    total_groups: 45,
    completion: {
      indexed: 0,
      extracted: 0,
      illustrations_found: 0,
      illustrations_extracted: 0,
      parts_count: 0,
      database_uploaded: 0,
    },
    groups: [] as any[],
  };

  const trackerPath = path.join(OUTPUT_DIR, 'extraction_progress.json');
  fs.writeFileSync(trackerPath, JSON.stringify(tracker, null, 2));

  console.log('✅ Created extraction_progress.json\n');

  return tracker;
}

async function runPhase1() {
  console.log('\n🚀 STARTING PHASE 1: INDEX CREATION & ANALYSIS\n');

  try {
    // Step 1: Analyze structure
    await analyzePDFStructure();

    // Step 2: Create index
    await createInitialIndex();

    // Step 3: Create tracker
    await createProgressTracker();

    console.log('\n' + '='.repeat(80));
    console.log('✅ PHASE 1.1 COMPLETE');
    console.log('='.repeat(80));
    console.log('\nOutputs created:');
    console.log('  - pdf_structure_analysis.json');
    console.log('  - master_rps_index.json');
    console.log('  - extraction_progress.json\n');

    return 0;
  } catch (error) {
    console.error('Phase 1 failed:', error);
    return 1;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runPhase1()
    .then(code => process.exit(code))
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}
