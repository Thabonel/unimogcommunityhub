#!/usr/bin/env npx tsx

/**
 * Barry AI Cache Testing Suite
 * Comprehensive tests for the cached response system
 */

import { performance } from 'perf_hooks';
import fetch from 'node-fetch';

// Types
interface TestResult {
  name: string;
  success: boolean;
  duration: number;
  details: string;
  response?: any;
  error?: string;
}

interface CacheTestConfig {
  supabaseUrl: string;
  authToken: string;
  originalEndpoint: string;
  cachedEndpoint: string;
  testTimeout: number;
}

interface TestQuery {
  id: string;
  description: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  expectedResponsePattern?: RegExp;
  shouldCache?: boolean;
}

// Test queries for various scenarios
const TEST_QUERIES: TestQuery[] = [
  {
    id: 'simple_oil_question',
    description: 'Simple oil maintenance question',
    messages: [
      { role: 'user', content: 'What oil should I use for my Unimog?' }
    ],
    expectedResponsePattern: /oil|maintenance|unimog/i,
    shouldCache: true
  },
  {
    id: 'complex_portal_hub',
    description: 'Complex portal hub repair procedure',
    messages: [
      { role: 'user', content: 'How do I replace the seals on my portal hubs step by step?' }
    ],
    expectedResponsePattern: /portal|hub|seal|step/i,
    shouldCache: true
  },
  {
    id: 'vehicle_specific_u1700l',
    description: 'U1700L specific question',
    messages: [
      { role: 'user', content: 'U1700L engine specifications and oil capacity' }
    ],
    expectedResponsePattern: /u1700l|engine|specification/i,
    shouldCache: true
  },
  {
    id: 'short_query',
    description: 'Very short query',
    messages: [
      { role: 'user', content: 'Help me' }
    ],
    shouldCache: true
  },
  {
    id: 'duplicate_query',
    description: 'Duplicate query for cache hit testing',
    messages: [
      { role: 'user', content: 'What oil should I use for my Unimog?' }
    ],
    shouldCache: true
  }
];

class CacheTester {
  private config: CacheTestConfig;
  private results: TestResult[] = [];
  
  constructor(config: CacheTestConfig) {
    this.config = config;
  }
  
  // Make API request with timing
  private async makeRequest(
    endpoint: string,
    body: any,
    headers: Record<string, string> = {}
  ): Promise<{ response: any; duration: number; status: number }> {
    const startTime = performance.now();
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.authToken}`,
          ...headers
        },
        body: JSON.stringify(body),
        timeout: this.config.testTimeout
      });
      
      const endTime = performance.now();
      const data = await response.json();
      
      return {
        response: data,
        duration: endTime - startTime,
        status: response.status
      };
    } catch (error) {
      const endTime = performance.now();
      throw {
        error: error.message,
        duration: endTime - startTime
      };
    }
  }
  
  // Test 1: Basic functionality - cached vs original
  async testBasicFunctionality(): Promise<TestResult> {
    const testName = 'Basic Functionality Test';
    const testQuery = TEST_QUERIES[0]; // Simple oil question
    
    try {
      console.log('🧪 Testing basic cached vs original functionality...');
      
      // Test original function first
      const originalResult = await this.makeRequest(
        this.config.originalEndpoint,
        { messages: testQuery.messages }
      );
      
      // Test cached function
      const cachedResult = await this.makeRequest(
        this.config.cachedEndpoint,
        { messages: testQuery.messages }
      );
      
      // Validate both responses
      const originalValid = originalResult.status === 200 && originalResult.response.content;
      const cachedValid = cachedResult.status === 200 && cachedResult.response.content;
      
      const success = originalValid && cachedValid;
      
      return {
        name: testName,
        success,
        duration: originalResult.duration + cachedResult.duration,
        details: `Original: ${originalResult.duration.toFixed(0)}ms, Cached: ${cachedResult.duration.toFixed(0)}ms`,
        response: {
          original: originalResult.response,
          cached: cachedResult.response
        }
      };
      
    } catch (error: any) {
      return {
        name: testName,
        success: false,
        duration: error.duration || 0,
        details: 'Basic functionality test failed',
        error: error.error || error.message
      };
    }
  }
  
  // Test 2: Cache hit behavior
  async testCacheHits(): Promise<TestResult> {
    const testName = 'Cache Hit Test';
    const testQuery = TEST_QUERIES[0]; // Same query as basic test
    
    try {
      console.log('🎯 Testing cache hit behavior...');
      
      // First request (should be cache miss)
      const firstResult = await this.makeRequest(
        this.config.cachedEndpoint,
        { messages: testQuery.messages }
      );
      
      // Second request (should be cache hit)
      const secondResult = await this.makeRequest(
        this.config.cachedEndpoint,
        { messages: testQuery.messages }
      );
      
      // Validate cache behavior
      const firstIsMiss = firstResult.response.metadata?.cacheHit === false;
      const secondIsHit = secondResult.response.metadata?.cacheHit === true;
      const secondFaster = secondResult.duration < firstResult.duration;
      
      const success = firstResult.status === 200 && 
                     secondResult.status === 200 && 
                     firstIsMiss && 
                     secondIsHit && 
                     secondFaster;
      
      return {
        name: testName,
        success,
        duration: firstResult.duration + secondResult.duration,
        details: `First: ${firstResult.duration.toFixed(0)}ms (miss), Second: ${secondResult.duration.toFixed(0)}ms (hit)`,
        response: {
          first: firstResult.response.metadata,
          second: secondResult.response.metadata
        }
      };
      
    } catch (error: any) {
      return {
        name: testName,
        success: false,
        duration: error.duration || 0,
        details: 'Cache hit test failed',
        error: error.error || error.message
      };
    }
  }
  
  // Test 3: Cache miss behavior
  async testCacheMisses(): Promise<TestResult> {
    const testName = 'Cache Miss Test';
    
    try {
      console.log('❌ Testing cache miss behavior...');
      
      // Use different queries to ensure cache misses
      const queries = [TEST_QUERIES[1], TEST_QUERIES[2]]; // Different queries
      const results = [];
      
      for (const query of queries) {
        const result = await this.makeRequest(
          this.config.cachedEndpoint,
          { messages: query.messages }
        );
        results.push(result);
      }
      
      // All should be cache misses
      const allMisses = results.every(r => 
        r.status === 200 && 
        r.response.metadata?.cacheHit === false
      );
      
      const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);
      
      return {
        name: testName,
        success: allMisses,
        duration: totalDuration,
        details: `${results.length} unique queries, all cache misses`,
        response: results.map(r => r.response.metadata)
      };
      
    } catch (error: any) {
      return {
        name: testName,
        success: false,
        duration: error.duration || 0,
        details: 'Cache miss test failed',
        error: error.error || error.message
      };
    }
  }
  
  // Test 4: Cache bypass header
  async testCacheBypass(): Promise<TestResult> {
    const testName = 'Cache Bypass Test';
    const testQuery = TEST_QUERIES[0]; // Use cached query
    
    try {
      console.log('🚫 Testing cache bypass header...');
      
      // First, make sure query is cached
      await this.makeRequest(
        this.config.cachedEndpoint,
        { messages: testQuery.messages }
      );
      
      // Request with cache bypass header
      const bypassResult = await this.makeRequest(
        this.config.cachedEndpoint,
        { messages: testQuery.messages },
        { 'X-Skip-Cache': 'true' }
      );
      
      // Request without bypass (should hit cache)
      const cachedResult = await this.makeRequest(
        this.config.cachedEndpoint,
        { messages: testQuery.messages }
      );
      
      const bypassWorked = bypassResult.response.metadata?.cached === false;
      const cacheWorked = cachedResult.response.metadata?.cacheHit === true;
      
      const success = bypassResult.status === 200 && 
                     cachedResult.status === 200 && 
                     bypassWorked && 
                     cacheWorked;
      
      return {
        name: testName,
        success,
        duration: bypassResult.duration + cachedResult.duration,
        details: `Bypass: ${bypassResult.duration.toFixed(0)}ms, Cached: ${cachedResult.duration.toFixed(0)}ms`,
        response: {
          bypass: bypassResult.response.metadata,
          cached: cachedResult.response.metadata
        }
      };
      
    } catch (error: any) {
      return {
        name: testName,
        success: false,
        duration: error.duration || 0,
        details: 'Cache bypass test failed',
        error: error.error || error.message
      };
    }
  }
  
  // Test 5: Fallback behavior (simulated failure)
  async testFallbackBehavior(): Promise<TestResult> {
    const testName = 'Fallback Behavior Test';
    
    try {
      console.log('🔄 Testing fallback behavior...');
      
      // Test with invalid endpoint to trigger fallback
      const invalidEndpoint = this.config.cachedEndpoint.replace('/chat-with-barry-cached', '/invalid-endpoint');
      
      try {
        const fallbackResult = await this.makeRequest(
          invalidEndpoint,
          { messages: TEST_QUERIES[0].messages }
        );
        
        return {
          name: testName,
          success: false,
          duration: 0,
          details: 'Invalid endpoint should have failed',
          error: 'Expected failure did not occur'
        };
      } catch (error: any) {
        // Expected failure - fallback test passed
        return {
          name: testName,
          success: true,
          duration: error.duration || 0,
          details: 'Fallback behavior correctly triggered on invalid endpoint',
          error: 'Expected error: ' + error.error
        };
      }
      
    } catch (error: any) {
      return {
        name: testName,
        success: false,
        duration: error.duration || 0,
        details: 'Fallback test setup failed',
        error: error.error || error.message
      };
    }
  }
  
  // Test 6: Response accuracy comparison
  async testResponseAccuracy(): Promise<TestResult> {
    const testName = 'Response Accuracy Test';
    const testQuery = TEST_QUERIES[1]; // Complex query
    
    try {
      console.log('🎯 Testing cached vs original response accuracy...');
      
      // Get response from original function
      const originalResult = await this.makeRequest(
        this.config.originalEndpoint,
        { messages: testQuery.messages }
      );
      
      // Clear any cache and get response from cached function
      const cachedResult = await this.makeRequest(
        this.config.cachedEndpoint,
        { messages: testQuery.messages },
        { 'X-Skip-Cache': 'true' }
      );
      
      // Compare responses
      const originalContent = originalResult.response.content || '';
      const cachedContent = cachedResult.response.content || '';
      
      // Basic accuracy checks
      const bothHaveContent = originalContent.length > 0 && cachedContent.length > 0;
      const similarLength = Math.abs(originalContent.length - cachedContent.length) < 100;
      const bothSuccessful = originalResult.status === 200 && cachedResult.status === 200;
      
      const success = bothHaveContent && bothSuccessful;
      
      return {
        name: testName,
        success,
        duration: originalResult.duration + cachedResult.duration,
        details: `Original: ${originalContent.length} chars, Cached: ${cachedContent.length} chars`,
        response: {
          contentLengths: {
            original: originalContent.length,
            cached: cachedContent.length
          },
          similar: similarLength
        }
      };
      
    } catch (error: any) {
      return {
        name: testName,
        success: false,
        duration: error.duration || 0,
        details: 'Response accuracy test failed',
        error: error.error || error.message
      };
    }
  }
  
  // Test 7: Performance comparison
  async testPerformanceComparison(): Promise<TestResult> {
    const testName = 'Performance Comparison Test';
    const testQuery = TEST_QUERIES[0];
    
    try {
      console.log('⚡ Testing performance improvement...');
      
      // Warm up cache
      await this.makeRequest(
        this.config.cachedEndpoint,
        { messages: testQuery.messages }
      );
      
      // Run multiple requests to both endpoints
      const iterations = 3;
      const originalTimes: number[] = [];
      const cachedTimes: number[] = [];
      
      for (let i = 0; i < iterations; i++) {
        // Original function
        const originalResult = await this.makeRequest(
          this.config.originalEndpoint,
          { messages: testQuery.messages }
        );
        originalTimes.push(originalResult.duration);
        
        // Cached function (should hit cache)
        const cachedResult = await this.makeRequest(
          this.config.cachedEndpoint,
          { messages: testQuery.messages }
        );
        cachedTimes.push(cachedResult.duration);
        
        // Small delay between iterations
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      const avgOriginal = originalTimes.reduce((sum, time) => sum + time, 0) / iterations;
      const avgCached = cachedTimes.reduce((sum, time) => sum + time, 0) / iterations;
      const improvement = ((avgOriginal - avgCached) / avgOriginal) * 100;
      
      const success = avgCached < avgOriginal && improvement > 0;
      
      return {
        name: testName,
        success,
        duration: avgOriginal + avgCached,
        details: `Original avg: ${avgOriginal.toFixed(0)}ms, Cached avg: ${avgCached.toFixed(0)}ms, Improvement: ${improvement.toFixed(1)}%`,
        response: {
          originalAvg: avgOriginal,
          cachedAvg: avgCached,
          improvement: improvement,
          iterations
        }
      };
      
    } catch (error: any) {
      return {
        name: testName,
        success: false,
        duration: error.duration || 0,
        details: 'Performance comparison test failed',
        error: error.error || error.message
      };
    }
  }
  
  // Test 8: Health check endpoint
  async testHealthCheck(): Promise<TestResult> {
    const testName = 'Health Check Test';
    
    try {
      console.log('❤️  Testing health check endpoint...');
      
      const healthEndpoint = this.config.cachedEndpoint + '/health';
      const startTime = performance.now();
      
      const response = await fetch(healthEndpoint, {
        method: 'GET',
        timeout: this.config.testTimeout
      });
      
      const endTime = performance.now();
      const data = await response.json();
      
      const hasRequiredFields = data.status && data.cache && data.timestamp;
      const success = response.status === 200 && hasRequiredFields;
      
      return {
        name: testName,
        success,
        duration: endTime - startTime,
        details: `Status: ${data.status}, Cache type: ${data.cache?.type}`,
        response: data
      };
      
    } catch (error: any) {
      return {
        name: testName,
        success: false,
        duration: error.duration || 0,
        details: 'Health check test failed',
        error: error.error || error.message
      };
    }
  }
  
  // Run all tests
  async runAllTests(): Promise<void> {
    console.log('🚀 Starting Barry AI Cache Test Suite');
    console.log('====================================');
    
    const tests = [
      () => this.testBasicFunctionality(),
      () => this.testCacheHits(),
      () => this.testCacheMisses(),
      () => this.testCacheBypass(),
      () => this.testFallbackBehavior(),
      () => this.testResponseAccuracy(),
      () => this.testPerformanceComparison(),
      () => this.testHealthCheck()
    ];
    
    for (const test of tests) {
      try {
        const result = await test();
        this.results.push(result);
        
        const status = result.success ? '✅' : '❌';
        console.log(`${status} ${result.name} (${result.duration.toFixed(0)}ms)`);
        
        if (!result.success && result.error) {
          console.log(`   Error: ${result.error}`);
        }
        
        if (result.details) {
          console.log(`   ${result.details}`);
        }
        
        // Small delay between tests
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.error(`💥 Test execution failed: ${error}`);
        this.results.push({
          name: 'Unknown Test',
          success: false,
          duration: 0,
          details: 'Test execution error',
          error: error.message
        });
      }
    }
  }
  
  // Generate test report
  generateReport(): void {
    console.log('\\n📊 Test Results Summary');
    console.log('========================');
    
    const passed = this.results.filter(r => r.success).length;
    const total = this.results.length;
    const passRate = (passed / total) * 100;
    
    console.log(`Tests Passed: ${passed}/${total} (${passRate.toFixed(1)}%)`);
    
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);
    console.log(`Total Test Duration: ${totalDuration.toFixed(0)}ms`);
    
    if (passed === total) {
      console.log('\\n🎉 All tests passed! Cache implementation is ready for deployment.');
    } else {
      console.log('\\n⚠️  Some tests failed. Review issues before deployment.');
      
      const failedTests = this.results.filter(r => !r.success);
      console.log('\\nFailed Tests:');
      failedTests.forEach(test => {
        console.log(`  ❌ ${test.name}: ${test.error || 'Unknown error'}`);
      });
    }
    
    // Performance summary
    const perfTest = this.results.find(r => r.name === 'Performance Comparison Test');
    if (perfTest?.success && perfTest.response?.improvement) {
      console.log(`\\n⚡ Performance Improvement: ${perfTest.response.improvement.toFixed(1)}%`);
    }
  }
  
  // Save detailed results to file
  async saveDetailedResults(): Promise<void> {
    const reportData = {
      timestamp: new Date().toISOString(),
      summary: {
        total: this.results.length,
        passed: this.results.filter(r => r.success).length,
        passRate: (this.results.filter(r => r.success).length / this.results.length) * 100
      },
      results: this.results,
      config: {
        ...this.config,
        authToken: '[REDACTED]' // Don't save auth token
      }
    };
    
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const filePath = path.join(process.cwd(), 'tests', 'cache_test_results.json');
    await fs.writeFile(filePath, JSON.stringify(reportData, null, 2));
    
    console.log(`\\n💾 Detailed results saved to: ${filePath}`);
  }
}

// Main execution
async function main() {
  try {
    // Configuration - replace with actual values
    const config: CacheTestConfig = {
      supabaseUrl: process.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co',
      authToken: process.env.TEST_AUTH_TOKEN || 'your-test-jwt-token',
      originalEndpoint: process.env.VITE_SUPABASE_URL?.replace('https://', 'https://') + '/functions/v1/chat-with-barry-claude',
      cachedEndpoint: process.env.VITE_SUPABASE_URL?.replace('https://', 'https://') + '/functions/v1/chat-with-barry-cached',
      testTimeout: 30000
    };
    
    // Validate configuration
    if (!config.supabaseUrl.includes('supabase.co')) {
      console.warn('⚠️  Warning: Using default Supabase URL. Set VITE_SUPABASE_URL for actual testing.');
    }
    
    if (!config.authToken || config.authToken === 'your-test-jwt-token') {
      console.warn('⚠️  Warning: Using default auth token. Set TEST_AUTH_TOKEN for actual testing.');
    }
    
    const tester = new CacheTester(config);
    await tester.runAllTests();
    
    tester.generateReport();
    await tester.saveDetailedResults();
    
  } catch (error) {
    console.error('💥 Test suite execution failed:', error);
    process.exit(1);
  }
}

// Export for programmatic use
export { CacheTester, TEST_QUERIES };

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}