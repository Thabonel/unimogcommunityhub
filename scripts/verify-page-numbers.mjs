#!/usr/bin/env node
/**
 * Verification script for PRD 5 - Check Barry page number fix
 *
 * Success Criteria:
 * 1. page_number = 0 count should be 0
 * 2. page_number = 1 count should be > 50
 * 3. Total chunks >= 1800
 * 4. Embedding coverage >= 80%
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '..', '.env') });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function verify() {
  console.log('='.repeat(60));
  console.log('PRD 5 VERIFICATION - Barry Page Number Fix');
  console.log('='.repeat(60));
  console.log('');

  const results = {
    page_zero_count: null,
    page_one_count: null,
    total_chunks: null,
    chunks_with_embeddings: null,
    embedding_coverage: null,
    page_distribution: []
  };

  // Check 1: Count of page_number = 0
  console.log('Checking page_number = 0 count...');
  const { count: pageZeroCount, error: err1 } = await supabase
    .from('manual_chunks')
    .select('*', { count: 'exact', head: true })
    .eq('page_number', 0);

  if (err1) {
    console.error('Error checking page 0:', err1.message);
  } else {
    results.page_zero_count = pageZeroCount || 0;
    console.log(`   page_number = 0: ${results.page_zero_count}`);
  }

  // Check 2: Count of page_number = 1
  console.log('Checking page_number = 1 count...');
  const { count: pageOneCount, error: err2 } = await supabase
    .from('manual_chunks')
    .select('*', { count: 'exact', head: true })
    .eq('page_number', 1);

  if (err2) {
    console.error('Error checking page 1:', err2.message);
  } else {
    results.page_one_count = pageOneCount || 0;
    console.log(`   page_number = 1: ${results.page_one_count}`);
  }

  // Check 3: Total chunks
  console.log('Checking total chunk count...');
  const { count: totalCount, error: err3 } = await supabase
    .from('manual_chunks')
    .select('*', { count: 'exact', head: true });

  if (err3) {
    console.error('Error checking total:', err3.message);
  } else {
    results.total_chunks = totalCount || 0;
    console.log(`   Total chunks: ${results.total_chunks}`);
  }

  // Check 4: Embedding coverage
  console.log('Checking embedding coverage...');
  const { count: withEmbeddings, error: err4 } = await supabase
    .from('manual_chunks')
    .select('*', { count: 'exact', head: true })
    .not('embedding', 'is', null);

  if (err4) {
    console.error('Error checking embeddings:', err4.message);
  } else {
    results.chunks_with_embeddings = withEmbeddings || 0;
    if (results.total_chunks > 0) {
      results.embedding_coverage = ((results.chunks_with_embeddings / results.total_chunks) * 100).toFixed(1);
    }
    console.log(`   Chunks with embeddings: ${results.chunks_with_embeddings}`);
    console.log(`   Embedding coverage: ${results.embedding_coverage}%`);
  }

  // Check 5: Page distribution (first 10 pages)
  console.log('Checking page distribution...');
  const { data: pageDistribution, error: err5 } = await supabase
    .from('manual_chunks')
    .select('page_number')
    .not('page_number', 'is', null)
    .order('page_number', { ascending: true });

  if (err5) {
    console.error('Error checking distribution:', err5.message);
  } else {
    // Count occurrences
    const counts = {};
    for (const row of pageDistribution) {
      counts[row.page_number] = (counts[row.page_number] || 0) + 1;
    }

    // Get top 10 pages by count
    const sortedPages = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    results.page_distribution = sortedPages;

    console.log('   Top 10 pages by chunk count:');
    for (const [page, count] of sortedPages) {
      console.log(`      Page ${page}: ${count} chunks`);
    }
  }

  // Evaluate success criteria
  console.log('\n' + '='.repeat(60));
  console.log('SUCCESS CRITERIA EVALUATION');
  console.log('='.repeat(60));

  const criteria = [];

  // Criterion 1: page_number = 0 count should be 0
  const c1_pass = results.page_zero_count === 0;
  criteria.push({ name: 'page_number = 0 count is 0', pass: c1_pass, value: results.page_zero_count });
  console.log(`[${c1_pass ? 'PASS' : 'FAIL'}] page_number = 0 count is 0 (actual: ${results.page_zero_count})`);

  // Criterion 2: page_number = 1 count > 50
  const c2_pass = results.page_one_count > 50;
  criteria.push({ name: 'page_number = 1 count > 50', pass: c2_pass, value: results.page_one_count });
  console.log(`[${c2_pass ? 'PASS' : 'FAIL'}] page_number = 1 count > 50 (actual: ${results.page_one_count})`);

  // Criterion 3: Total chunks >= 1800
  const c3_pass = results.total_chunks >= 1800;
  criteria.push({ name: 'Total chunks >= 1800', pass: c3_pass, value: results.total_chunks });
  console.log(`[${c3_pass ? 'PASS' : 'FAIL'}] Total chunks >= 1800 (actual: ${results.total_chunks})`);

  // Criterion 4: Embedding coverage >= 80%
  const c4_pass = parseFloat(results.embedding_coverage) >= 80;
  criteria.push({ name: 'Embedding coverage >= 80%', pass: c4_pass, value: results.embedding_coverage });
  console.log(`[${c4_pass ? 'PASS' : 'FAIL'}] Embedding coverage >= 80% (actual: ${results.embedding_coverage}%)`);

  // Criterion 5: Natural page distribution (page 1 should be in top 5)
  const topPages = results.page_distribution.slice(0, 5).map(([p]) => parseInt(p));
  const c5_pass = topPages.includes(1) || topPages.includes(2);
  criteria.push({ name: 'Natural page distribution', pass: c5_pass, value: topPages.join(', ') });
  console.log(`[${c5_pass ? 'PASS' : 'FAIL'}] Natural page distribution (top pages: ${topPages.join(', ')})`);

  const allPass = criteria.every(c => c.pass);

  console.log('\n' + '='.repeat(60));
  if (allPass) {
    console.log('ALL CRITERIA PASSED - PDF PAGE FIX VERIFIED');
  } else {
    const failing = criteria.filter(c => !c.pass).map(c => c.name);
    console.log(`CRITERIA FAILED: ${failing.join(', ')}`);
    console.log('\nAction needed:');
    if (!c1_pass || !c2_pass) {
      console.log('  - Run: node scripts/local-process-manuals.mjs');
    }
    if (!c3_pass) {
      console.log('  - Check if all manuals are being processed');
    }
    if (!c4_pass) {
      console.log('  - Run: node scripts/generate-embeddings.ts');
    }
  }
  console.log('='.repeat(60));

  return { allPass, results, criteria };
}

verify().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
