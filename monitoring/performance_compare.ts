#!/usr/bin/env npx tsx

/**
 * Performance Comparison Script
 * Compares current performance with baseline metrics
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { compareBaselines } from './performance_baseline.js';

// ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface BaselineResults {
  timestamp: string;
  systemInfo: any;
  metrics: any;
  summary: any;
  testQueries: any[];
}

async function main() {
  const baselineFile = path.join(__dirname, 'baseline_metrics.json');
  
  if (!fs.existsSync(baselineFile)) {
    console.error('❌ No baseline metrics found. Run "npm run monitor:baseline" first.');
    process.exit(1);
  }
  
  console.log('📊 Loading baseline metrics...');
  const baseline: BaselineResults = JSON.parse(fs.readFileSync(baselineFile, 'utf8'));
  
  console.log(`📅 Baseline from: ${baseline.timestamp}`);
  console.log(`⚡ Baseline Barry avg: ${baseline.metrics.barryResponseTimes.avg.toFixed(0)}ms`);
  console.log(`📈 Baseline success rate: ${(baseline.summary.successRate * 100).toFixed(1)}%`);
  
  console.log('\n🔄 Run "npm run monitor:baseline" to measure current performance and compare.');
  console.log('🚨 Alerts will be generated for >10% performance degradation.');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}