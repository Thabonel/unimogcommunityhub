#!/usr/bin/env tsx

/**
 * Barry AI Accuracy Testing Script
 *
 * Tests Barry's ability to find the correct manual pages for common queries.
 * Run before and after changes to measure improvement.
 *
 * Usage:
 *   npx tsx scripts/test-barry-accuracy.ts
 *   npx tsx scripts/test-barry-accuracy.ts --verbose
 *   npx tsx scripts/test-barry-accuracy.ts --json > results.json
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

interface TestQuery {
  id: string;
  query: string;
  expectedManual: string;
  expectedPages: number[];
  category: 'workshop' | 'rps' | 'technical' | 'specification';
  difficulty: 'easy' | 'medium' | 'hard';
}

interface TestResult {
  id: string;
  query: string;
  expectedManual: string;
  expectedPages: number[];
  actualPages: number[];
  foundExpected: boolean;
  matchedPage: number | null;
  rank: number | null;
  similarity: number | null;
  category: string;
  difficulty: string;
}

// Test queries with known correct answers
const TEST_QUERIES: TestQuery[] = [
  // Workshop Manual - Easy (well-documented topics)
  {
    id: 'WM-001',
    query: 'wheel nut torque U1700L',
    expectedManual: 'U435',
    expectedPages: [668],
    category: 'specification',
    difficulty: 'easy'
  },
  {
    id: 'WM-002',
    query: 'engine oil capacity OM366',
    expectedManual: 'U435',
    expectedPages: [127, 128],
    category: 'specification',
    difficulty: 'easy'
  },
  {
    id: 'WM-003',
    query: 'differential bearing preload',
    expectedManual: 'U435',
    expectedPages: [675, 676],
    category: 'workshop',
    difficulty: 'medium'
  },
  {
    id: 'WM-004',
    query: 'front axle seal replacement',
    expectedManual: 'U435',
    expectedPages: [555, 556, 560],
    category: 'workshop',
    difficulty: 'medium'
  },
  {
    id: 'WM-005',
    query: 'portal hub oil change procedure',
    expectedManual: 'U435',
    expectedPages: [737, 738],
    category: 'workshop',
    difficulty: 'easy'
  },
  {
    id: 'WM-006',
    query: 'clutch adjustment',
    expectedManual: 'U435',
    expectedPages: [340, 341, 342],
    category: 'workshop',
    difficulty: 'medium'
  },
  {
    id: 'WM-007',
    query: 'steering box adjustment',
    expectedManual: 'U435',
    expectedPages: [580, 581],
    category: 'workshop',
    difficulty: 'medium'
  },
  {
    id: 'WM-008',
    query: 'brake bleeding procedure',
    expectedManual: 'U435',
    expectedPages: [620, 621, 622],
    category: 'workshop',
    difficulty: 'easy'
  },

  // RPS Catalog - Component lookups
  {
    id: 'RPS-001',
    query: 'portal hub exploded view',
    expectedManual: 'RPS',
    expectedPages: [430, 431, 432],
    category: 'rps',
    difficulty: 'hard'
  },
  {
    id: 'RPS-002',
    query: 'turbocharger parts diagram',
    expectedManual: 'RPS',
    expectedPages: [227, 228, 229],
    category: 'rps',
    difficulty: 'hard'
  },
  {
    id: 'RPS-003',
    query: 'fuel pump assembly',
    expectedManual: 'RPS',
    expectedPages: [190, 191, 200],
    category: 'rps',
    difficulty: 'hard'
  },
  {
    id: 'RPS-004',
    query: 'differential parts list',
    expectedManual: 'RPS',
    expectedPages: [410, 411, 420],
    category: 'rps',
    difficulty: 'hard'
  },
  {
    id: 'RPS-005',
    query: 'gearbox exploded view transmission',
    expectedManual: 'RPS',
    expectedPages: [310, 311, 320],
    category: 'rps',
    difficulty: 'hard'
  },

  // Technical specifications
  {
    id: 'SPEC-001',
    query: 'torque specifications wheel bearing',
    expectedManual: 'U435',
    expectedPages: [668, 737],
    category: 'specification',
    difficulty: 'medium'
  },
  {
    id: 'SPEC-002',
    query: 'coolant capacity',
    expectedManual: 'U435',
    expectedPages: [135, 140],
    category: 'specification',
    difficulty: 'easy'
  },
  {
    id: 'SPEC-003',
    query: 'transmission fluid type',
    expectedManual: 'U435',
    expectedPages: [300, 310],
    category: 'specification',
    difficulty: 'medium'
  },

  // Heavy repair
  {
    id: 'HR-001',
    query: 'turbocharger rebuild',
    expectedManual: 'G604',
    expectedPages: [45, 50, 55],
    category: 'workshop',
    difficulty: 'hard'
  },
  {
    id: 'HR-002',
    query: 'engine overhaul procedure',
    expectedManual: 'G604',
    expectedPages: [10, 20, 30],
    category: 'workshop',
    difficulty: 'hard'
  },

  // Modifications
  {
    id: 'MOD-001',
    query: 'accelerator pedal stop bolt',
    expectedManual: 'G617',
    expectedPages: [1, 2, 3],
    category: 'technical',
    difficulty: 'medium'
  }
];

class AccuracyTester {
  private supabase: ReturnType<typeof createClient>;
  private verbose: boolean;
  private results: TestResult[] = [];

  constructor(options: { verbose?: boolean } = {}) {
    this.verbose = options.verbose || false;

    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    }

    this.supabase = createClient(supabaseUrl, supabaseServiceKey);
  }

  /**
   * Generate embedding for a query using OpenAI
   */
  private async generateEmbedding(text: string): Promise<number[]> {
    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) {
      throw new Error('Missing OPENAI_API_KEY for embedding generation');
    }

    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: text,
        encoding_format: 'float'
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const result = await response.json();
    return result.data[0].embedding;
  }

  /**
   * Search using the RRF function
   */
  private async searchRRF(query: string): Promise<any[]> {
    const embedding = await this.generateEmbedding(query);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (this.supabase.rpc as any)('search_manual_chunks_rrf', {
      query_text: query,
      query_embedding: embedding,
      max_results: 10,
      rrf_k: 60
    });

    if (error) {
      console.error(`Search error: ${error.message}`);
      return [];
    }

    return data || [];
  }

  /**
   * Run a single test query
   */
  private async runTest(test: TestQuery): Promise<TestResult> {
    if (this.verbose) {
      console.log(`\nTesting: ${test.id} - "${test.query}"`);
    }

    const results = await this.searchRRF(test.query);
    const actualPages = results.map(r => r.page_number);

    // Check if any expected page is in results
    let foundExpected = false;
    let matchedPage: number | null = null;
    let rank: number | null = null;
    let similarity: number | null = null;

    for (const expected of test.expectedPages) {
      const idx = actualPages.indexOf(expected);
      if (idx !== -1) {
        foundExpected = true;
        matchedPage = expected;
        rank = idx + 1;
        similarity = results[idx].vector_similarity || results[idx].rrf_score;
        break;
      }
    }

    if (this.verbose) {
      if (foundExpected) {
        console.log(`  PASS: Found page ${matchedPage} at rank ${rank}`);
      } else {
        console.log(`  FAIL: Expected pages ${test.expectedPages.join(',')} not found`);
        console.log(`        Got pages: ${actualPages.slice(0, 5).join(', ')}`);
      }
    }

    return {
      id: test.id,
      query: test.query,
      expectedManual: test.expectedManual,
      expectedPages: test.expectedPages,
      actualPages: actualPages.slice(0, 5),
      foundExpected,
      matchedPage,
      rank,
      similarity,
      category: test.category,
      difficulty: test.difficulty
    };
  }

  /**
   * Run all tests
   */
  async runAllTests(): Promise<void> {
    console.log('Barry AI Accuracy Test Suite\n');
    console.log('='.repeat(60));
    console.log(`Running ${TEST_QUERIES.length} test queries...\n`);

    for (const test of TEST_QUERIES) {
      try {
        const result = await this.runTest(test);
        this.results.push(result);

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Error testing ${test.id}: ${error}`);
        this.results.push({
          id: test.id,
          query: test.query,
          expectedManual: test.expectedManual,
          expectedPages: test.expectedPages,
          actualPages: [],
          foundExpected: false,
          matchedPage: null,
          rank: null,
          similarity: null,
          category: test.category,
          difficulty: test.difficulty
        });
      }
    }
  }

  /**
   * Generate summary report
   */
  generateReport(): void {
    const total = this.results.length;
    const passed = this.results.filter(r => r.foundExpected).length;
    const accuracy = ((passed / total) * 100).toFixed(1);

    // By category
    const categories = ['workshop', 'rps', 'technical', 'specification'];
    const categoryStats: Record<string, { passed: number; total: number }> = {};

    for (const cat of categories) {
      const catResults = this.results.filter(r => r.category === cat);
      categoryStats[cat] = {
        passed: catResults.filter(r => r.foundExpected).length,
        total: catResults.length
      };
    }

    // By difficulty
    const difficulties = ['easy', 'medium', 'hard'];
    const difficultyStats: Record<string, { passed: number; total: number }> = {};

    for (const diff of difficulties) {
      const diffResults = this.results.filter(r => r.difficulty === diff);
      difficultyStats[diff] = {
        passed: diffResults.filter(r => r.foundExpected).length,
        total: diffResults.length
      };
    }

    console.log('\n' + '='.repeat(60));
    console.log('ACCURACY TEST RESULTS');
    console.log('='.repeat(60));
    console.log(`\nOverall: ${passed}/${total} (${accuracy}%)\n`);

    console.log('By Category:');
    for (const [cat, stats] of Object.entries(categoryStats)) {
      if (stats.total > 0) {
        const pct = ((stats.passed / stats.total) * 100).toFixed(0);
        const bar = '█'.repeat(Math.round(stats.passed / stats.total * 20));
        console.log(`  ${cat.padEnd(15)} ${stats.passed}/${stats.total} ${bar} ${pct}%`);
      }
    }

    console.log('\nBy Difficulty:');
    for (const [diff, stats] of Object.entries(difficultyStats)) {
      if (stats.total > 0) {
        const pct = ((stats.passed / stats.total) * 100).toFixed(0);
        const bar = '█'.repeat(Math.round(stats.passed / stats.total * 20));
        console.log(`  ${diff.padEnd(15)} ${stats.passed}/${stats.total} ${bar} ${pct}%`);
      }
    }

    // Failed tests
    const failures = this.results.filter(r => !r.foundExpected);
    if (failures.length > 0) {
      console.log('\nFailed Tests:');
      for (const f of failures) {
        console.log(`  ${f.id}: "${f.query}"`);
        console.log(`    Expected: ${f.expectedManual} pages ${f.expectedPages.join(',')}`);
        console.log(`    Got: pages ${f.actualPages.join(', ') || 'none'}`);
      }
    }

    // Rank distribution for passes
    const passedWithRank = this.results.filter(r => r.foundExpected && r.rank);
    if (passedWithRank.length > 0) {
      const avgRank = passedWithRank.reduce((sum, r) => sum + (r.rank || 0), 0) / passedWithRank.length;
      const top1 = passedWithRank.filter(r => r.rank === 1).length;
      const top3 = passedWithRank.filter(r => r.rank && r.rank <= 3).length;
      const top5 = passedWithRank.filter(r => r.rank && r.rank <= 5).length;

      console.log('\nRank Distribution (passed tests):');
      console.log(`  Average rank: ${avgRank.toFixed(1)}`);
      console.log(`  Top 1: ${top1}/${passedWithRank.length}`);
      console.log(`  Top 3: ${top3}/${passedWithRank.length}`);
      console.log(`  Top 5: ${top5}/${passedWithRank.length}`);
    }

    console.log('\n' + '='.repeat(60));
  }

  /**
   * Export results as JSON
   */
  exportJSON(): string {
    const total = this.results.length;
    const passed = this.results.filter(r => r.foundExpected).length;

    return JSON.stringify({
      timestamp: new Date().toISOString(),
      summary: {
        total,
        passed,
        failed: total - passed,
        accuracy: passed / total
      },
      results: this.results
    }, null, 2);
  }
}

// CLI entry point
async function main() {
  const args = process.argv.slice(2);
  const verbose = args.includes('--verbose') || args.includes('-v');
  const jsonOutput = args.includes('--json');

  const tester = new AccuracyTester({ verbose });

  try {
    await tester.runAllTests();

    if (jsonOutput) {
      console.log(tester.exportJSON());
    } else {
      tester.generateReport();
    }

    process.exit(0);
  } catch (error) {
    console.error('Test suite failed:', error);
    process.exit(1);
  }
}

main();
