#!/usr/bin/env npx tsx

/**
 * Barry AI & WIS Performance Monitoring Baseline
 * Comprehensive performance measurement and regression detection
 * 
 * This script measures current system performance before optimizations
 * and provides comparison capabilities for ongoing monitoring.
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { performance } from 'perf_hooks';

// ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Types
interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime: number;
  duration: number;
  success: boolean;
  error?: string;
  metadata?: Record<string, any>;
}

interface TestQuery {
  id: string;
  type: 'simple' | 'complex' | 'vehicle-specific' | 'error-scenario';
  query: string;
  expectedResponseTime: number; // in ms
  description: string;
}

interface BaselineResults {
  timestamp: string;
  systemInfo: {
    nodeVersion: string;
    platform: string;
    cpuUsage: number;
    memoryUsage: number;
  };
  metrics: {
    barryResponseTimes: PerformanceStats;
    databaseQueryTimes: PerformanceStats;
    claudeApiTimes: PerformanceStats;
    uiRenderTimes: PerformanceStats;
    errorRates: {
      total: number;
      byType: Record<string, number>;
    };
  };
  testQueries: TestQueryResult[];
  summary: {
    totalTests: number;
    successRate: number;
    avgResponseTime: number;
    recommendations: string[];
  };
}

interface PerformanceStats {
  count: number;
  avg: number;
  p50: number;
  p95: number;
  p99: number;
  min: number;
  max: number;
}

interface TestQueryResult {
  query: TestQuery;
  metrics: PerformanceMetric[];
  totalTime: number;
  success: boolean;
  error?: string;
}

// Configuration
const CONFIG = {
  supabaseUrl: process.env.VITE_SUPABASE_URL || '',
  supabaseKey: process.env.VITE_SUPABASE_ANON_KEY || '',
  outputDir: path.join(__dirname),
  testIterations: 24, // Reduced for faster initial baseline
  timeoutMs: 30000,
  alertThreshold: 0.1, // 10% degradation threshold
};

// Test queries covering all Barry AI scenarios
const TEST_QUERIES: TestQuery[] = [
  // Simple queries
  {
    id: 'simple_oil_question',
    type: 'simple',
    query: 'What oil should I use for my Unimog?',
    expectedResponseTime: 2000,
    description: 'Basic maintenance question'
  },
  {
    id: 'simple_tire_pressure',
    type: 'simple', 
    query: 'What tire pressure for off-road driving?',
    expectedResponseTime: 2000,
    description: 'Simple operational question'
  },
  {
    id: 'simple_differential_lock',
    type: 'simple',
    query: 'How do I engage differential locks?',
    expectedResponseTime: 2000,
    description: 'Basic operation question'
  },

  // Complex technical queries
  {
    id: 'complex_portal_hub_seals',
    type: 'complex',
    query: 'How do I replace the seals on my portal hubs step by step?',
    expectedResponseTime: 4000,
    description: 'Complex repair procedure with manual search'
  },
  {
    id: 'complex_transmission_repair',
    type: 'complex',
    query: 'My transmission is making grinding noises in 3rd gear, what could be wrong?',
    expectedResponseTime: 4000,
    description: 'Complex diagnostic with multiple possibilities'
  },
  {
    id: 'complex_hydraulic_troubleshoot',
    type: 'complex',
    query: 'Hydraulic system pressure is low, walk me through troubleshooting',
    expectedResponseTime: 4000,
    description: 'Multi-step troubleshooting procedure'
  },

  // Vehicle-specific queries
  {
    id: 'vehicle_u1700l_specific',
    type: 'vehicle-specific',
    query: 'U1700L OM366 engine oil capacity and specifications',
    expectedResponseTime: 3000,
    description: 'Specific model and engine query'
  },
  {
    id: 'vehicle_u435_brakes',
    type: 'vehicle-specific',
    query: 'U435 brake system bleeding procedure',
    expectedResponseTime: 3000,
    description: 'Model-specific maintenance'
  },
  {
    id: 'vehicle_series_comparison',
    type: 'vehicle-specific',
    query: 'Differences between U1300L and U1700L portal axles',
    expectedResponseTime: 3000,
    description: 'Comparative technical analysis'
  },

  // Error scenarios
  {
    id: 'error_nonsense_query',
    type: 'error-scenario',
    query: 'Purple monkey dishwasher transmission',
    expectedResponseTime: 2000,
    description: 'Nonsensical query handling'
  },
  {
    id: 'error_too_vague',
    type: 'error-scenario',
    query: 'Help',
    expectedResponseTime: 2000,
    description: 'Overly vague request'
  },
  {
    id: 'error_non_unimog',
    type: 'error-scenario',
    query: 'How do I fix my Toyota Camry engine?',
    expectedResponseTime: 2000,
    description: 'Non-Unimog vehicle query'
  }
];

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private supabase: any;

  constructor() {
    if (!CONFIG.supabaseUrl || !CONFIG.supabaseKey) {
      console.warn('⚠️  Supabase credentials not found, some tests will be skipped');
    } else {
      this.supabase = createClient(CONFIG.supabaseUrl, CONFIG.supabaseKey);
    }
  }

  // Start measuring a metric
  startMetric(name: string, metadata?: Record<string, any>): string {
    const id = `${name}_${Date.now()}_${Math.random()}`;
    const metric: PerformanceMetric = {
      name,
      startTime: performance.now(),
      endTime: 0,
      duration: 0,
      success: false,
      metadata
    };
    
    this.metrics.push(metric);
    return id;
  }

  // End measuring a metric
  endMetric(name: string, success: boolean = true, error?: string): void {
    const metric = this.metrics.find(m => 
      m.name === name && m.endTime === 0
    );
    
    if (metric) {
      metric.endTime = performance.now();
      metric.duration = metric.endTime - metric.startTime;
      metric.success = success;
      metric.error = error;
    }
  }

  // Measure database query time
  async measureDatabaseQuery(query: string): Promise<PerformanceMetric> {
    const metricName = 'database_query';
    this.startMetric(metricName, { query });
    
    try {
      const startTime = performance.now();
      
      if (!this.supabase) {
        throw new Error('Supabase not configured');
      }
      
      // Example query - adjust based on actual schema
      const { data, error } = await this.supabase
        .from('vehicles')
        .select('*')
        .limit(1);
      
      const endTime = performance.now();
      
      if (error) throw error;
      
      this.endMetric(metricName, true);
      
      return {
        name: metricName,
        startTime,
        endTime,
        duration: endTime - startTime,
        success: true,
        metadata: { query, resultCount: data?.length || 0 }
      };
    } catch (error) {
      this.endMetric(metricName, false, (error as Error).message);
      
      return {
        name: metricName,
        startTime: performance.now(),
        endTime: performance.now(),
        duration: 0,
        success: false,
        error: (error as Error).message
      };
    }
  }

  // Measure Barry AI response time (simulated)
  async measureBarryResponse(query: string): Promise<PerformanceMetric> {
    const metricName = 'barry_response';
    this.startMetric(metricName, { query });
    
    try {
      const startTime = performance.now();
      
      // Simulate Barry AI call - replace with actual Edge Function call
      await this.simulateBarryCall(query);
      
      const endTime = performance.now();
      
      this.endMetric(metricName, true);
      
      return {
        name: metricName,
        startTime,
        endTime,
        duration: endTime - startTime,
        success: true,
        metadata: { query }
      };
    } catch (error) {
      this.endMetric(metricName, false, (error as Error).message);
      
      return {
        name: metricName,
        startTime: performance.now(),
        endTime: performance.now(),
        duration: 0,
        success: false,
        error: (error as Error).message
      };
    }
  }

  // Simulate Barry AI call (replace with actual implementation)
  private async simulateBarryCall(query: string): Promise<void> {
    // Simulate network delay and processing time (faster for baseline)
    const baseDelay = 200; // Reduced from 1000ms
    const complexityMultiplier = query.length > 50 ? 1.5 : 1;
    const randomVariation = Math.random() * 200; // Reduced from 1000ms
    
    const delay = baseDelay * complexityMultiplier + randomVariation;
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate occasional failures
        if (Math.random() < 0.05) { // 5% failure rate
          reject(new Error('Simulated Barry AI timeout'));
        } else {
          resolve();
        }
      }, delay);
    });
  }

  // Calculate statistics from metrics
  calculateStats(metrics: PerformanceMetric[]): PerformanceStats {
    const successfulMetrics = metrics.filter(m => m.success);
    const durations = successfulMetrics.map(m => m.duration);
    
    if (durations.length === 0) {
      return {
        count: 0,
        avg: 0,
        p50: 0,
        p95: 0,
        p99: 0,
        min: 0,
        max: 0
      };
    }
    
    durations.sort((a, b) => a - b);
    
    const count = durations.length;
    const sum = durations.reduce((a, b) => a + b, 0);
    
    return {
      count,
      avg: sum / count,
      p50: durations[Math.floor(count * 0.5)],
      p95: durations[Math.floor(count * 0.95)],
      p99: durations[Math.floor(count * 0.99)],
      min: durations[0],
      max: durations[count - 1]
    };
  }

  // Run a single test query
  async runTestQuery(testQuery: TestQuery): Promise<TestQueryResult> {
    console.log(`🧪 Testing: ${testQuery.description}`);
    
    const queryMetrics: PerformanceMetric[] = [];
    const startTime = performance.now();
    
    try {
      // Measure database query
      const dbMetric = await this.measureDatabaseQuery('test_query');
      queryMetrics.push(dbMetric);
      
      // Measure Barry AI response
      const barryMetric = await this.measureBarryResponse(testQuery.query);
      queryMetrics.push(barryMetric);
      
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      
      const success = queryMetrics.every(m => m.success);
      
      return {
        query: testQuery,
        metrics: queryMetrics,
        totalTime,
        success
      };
    } catch (error) {
      const endTime = performance.now();
      
      return {
        query: testQuery,
        metrics: queryMetrics,
        totalTime: endTime - startTime,
        success: false,
        error: (error as Error).message
      };
    }
  }

  // Get system information
  getSystemInfo() {
    const memUsage = process.memoryUsage();
    
    return {
      nodeVersion: process.version,
      platform: process.platform,
      cpuUsage: process.cpuUsage().user / 1000000, // Convert to ms
      memoryUsage: memUsage.heapUsed / 1024 / 1024 // Convert to MB
    };
  }

  // Run complete baseline measurement
  async runBaseline(): Promise<BaselineResults> {
    console.log('🚀 Starting Barry AI & WIS Performance Baseline');
    console.log('================================================');
    
    const testResults: TestQueryResult[] = [];
    
    // Run test queries
    for (let i = 0; i < TEST_QUERIES.length; i++) {
      const testQuery = TEST_QUERIES[i];
      const result = await this.runTestQuery(testQuery);
      testResults.push(result);
      
      // Brief pause between tests
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Additional random queries from the pool for 100 total
    const remainingTests = CONFIG.testIterations - TEST_QUERIES.length;
    for (let i = 0; i < remainingTests; i++) {
      const randomQuery = TEST_QUERIES[Math.floor(Math.random() * TEST_QUERIES.length)];
      const result = await this.runTestQuery(randomQuery);
      testResults.push(result);
      
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    // Calculate metrics
    const allMetrics = testResults.flatMap(r => r.metrics);
    const barryMetrics = allMetrics.filter(m => m.name === 'barry_response');
    const dbMetrics = allMetrics.filter(m => m.name === 'database_query');
    
    const successfulTests = testResults.filter(r => r.success);
    const failedTests = testResults.filter(r => !r.success);
    
    // Count error types
    const errorsByType: Record<string, number> = {};
    failedTests.forEach(test => {
      if (test.error) {
        errorsByType[test.error] = (errorsByType[test.error] || 0) + 1;
      }
    });
    
    const results: BaselineResults = {
      timestamp: new Date().toISOString(),
      systemInfo: this.getSystemInfo(),
      metrics: {
        barryResponseTimes: this.calculateStats(barryMetrics),
        databaseQueryTimes: this.calculateStats(dbMetrics),
        claudeApiTimes: this.calculateStats([]), // Placeholder
        uiRenderTimes: this.calculateStats([]), // Placeholder
        errorRates: {
          total: failedTests.length,
          byType: errorsByType
        }
      },
      testQueries: testResults,
      summary: {
        totalTests: testResults.length,
        successRate: successfulTests.length / testResults.length,
        avgResponseTime: testResults.reduce((sum, r) => sum + r.totalTime, 0) / testResults.length,
        recommendations: this.generateRecommendations(testResults)
      }
    };
    
    return results;
  }

  // Generate performance recommendations
  generateRecommendations(testResults: TestQueryResult[]): string[] {
    const recommendations: string[] = [];
    const avgResponseTime = testResults.reduce((sum, r) => sum + r.totalTime, 0) / testResults.length;
    const successRate = testResults.filter(r => r.success).length / testResults.length;
    
    if (avgResponseTime > 3000) {
      recommendations.push('Response times are high (>3s). Consider implementing caching or query optimization.');
    }
    
    if (successRate < 0.95) {
      recommendations.push('Success rate is below 95%. Review error handling and system reliability.');
    }
    
    const complexQueries = testResults.filter(r => r.query.type === 'complex');
    const avgComplexTime = complexQueries.reduce((sum, r) => sum + r.totalTime, 0) / complexQueries.length;
    
    if (avgComplexTime > 5000) {
      recommendations.push('Complex queries are slow (>5s). Consider manual search optimization.');
    }
    
    return recommendations;
  }

  // Save results to file
  async saveResults(results: BaselineResults): Promise<void> {
    const filePath = path.join(CONFIG.outputDir, 'baseline_metrics.json');
    await fs.promises.writeFile(filePath, JSON.stringify(results, null, 2));
    console.log(`📊 Results saved to: ${filePath}`);
  }

  // Print summary report
  printSummary(results: BaselineResults): void {
    console.log('\n📊 PERFORMANCE BASELINE SUMMARY');
    console.log('================================');
    
    console.log(`\n🎯 Test Results:`);
    console.log(`   Total Tests: ${results.summary.totalTests}`);
    console.log(`   Success Rate: ${(results.summary.successRate * 100).toFixed(1)}%`);
    console.log(`   Avg Response Time: ${results.summary.avgResponseTime.toFixed(0)}ms`);
    
    console.log(`\n⚡ Barry AI Performance:`);
    console.log(`   Average: ${results.metrics.barryResponseTimes.avg.toFixed(0)}ms`);
    console.log(`   P95: ${results.metrics.barryResponseTimes.p95.toFixed(0)}ms`);
    console.log(`   P99: ${results.metrics.barryResponseTimes.p99.toFixed(0)}ms`);
    
    console.log(`\n🗄️  Database Performance:`);
    console.log(`   Average: ${results.metrics.databaseQueryTimes.avg.toFixed(0)}ms`);
    console.log(`   P95: ${results.metrics.databaseQueryTimes.p95.toFixed(0)}ms`);
    
    if (results.metrics.errorRates.total > 0) {
      console.log(`\n❌ Error Analysis:`);
      console.log(`   Total Errors: ${results.metrics.errorRates.total}`);
      Object.entries(results.metrics.errorRates.byType).forEach(([type, count]) => {
        console.log(`   ${type}: ${count}`);
      });
    }
    
    if (results.summary.recommendations.length > 0) {
      console.log(`\n💡 Recommendations:`);
      results.summary.recommendations.forEach(rec => {
        console.log(`   • ${rec}`);
      });
    }
    
    console.log(`\n🔄 System Info:`);
    console.log(`   Node Version: ${results.systemInfo.nodeVersion}`);
    console.log(`   Platform: ${results.systemInfo.platform}`);
    console.log(`   Memory Usage: ${results.systemInfo.memoryUsage.toFixed(1)}MB`);
    
    console.log('\n✅ Baseline measurement complete!');
  }
}

// Comparison function for future use
export function compareBaselines(current: BaselineResults, baseline: BaselineResults): {
  alerts: string[];
  improvements: string[];
  regressions: string[];
} {
  const alerts: string[] = [];
  const improvements: string[] = [];
  const regressions: string[] = [];
  
  // Compare Barry response times
  const barryDiff = (current.metrics.barryResponseTimes.avg - baseline.metrics.barryResponseTimes.avg) / baseline.metrics.barryResponseTimes.avg;
  
  if (barryDiff > CONFIG.alertThreshold) {
    alerts.push(`Barry response time degraded by ${(barryDiff * 100).toFixed(1)}%`);
    regressions.push('Barry AI performance regression detected');
  } else if (barryDiff < -0.05) {
    improvements.push(`Barry response time improved by ${(-barryDiff * 100).toFixed(1)}%`);
  }
  
  // Compare success rates
  const successDiff = current.summary.successRate - baseline.summary.successRate;
  
  if (successDiff < -CONFIG.alertThreshold) {
    alerts.push(`Success rate dropped by ${(-successDiff * 100).toFixed(1)}%`);
    regressions.push('System reliability degraded');
  } else if (successDiff > 0.05) {
    improvements.push(`Success rate improved by ${(successDiff * 100).toFixed(1)}%`);
  }
  
  return { alerts, improvements, regressions };
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  async function main() {
    try {
      const monitor = new PerformanceMonitor();
      const results = await monitor.runBaseline();
      
      await monitor.saveResults(results);
      monitor.printSummary(results);
      
    } catch (error) {
      console.error('❌ Baseline measurement failed:', error);
      process.exit(1);
    }
  }
  
  main();
}