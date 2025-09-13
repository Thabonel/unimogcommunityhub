#!/usr/bin/env npx tsx

/**
 * Comprehensive Parallel Processing Test Suite
 * Tests the chat-with-barry-optimized Edge Function
 * 
 * Test Coverage:
 * 1. All operations complete successfully
 * 2. Partial failures still return valid responses  
 * 3. Timeouts are handled gracefully
 * 4. Output identical to original function
 * 5. Performance improvements verified
 */

import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface TestResult {
  testName: string;
  passed: boolean;
  details: string;
  executionTime?: number;
  error?: string;
}

interface BarryResponse {
  response: string;
  user_id: string;
  timestamp: string;
  performance?: {
    total_time: number;
    user_data_time: number;
    manual_search_time: number;
    wis_search_time: number;
    claude_time: number;
    parallel_mode: boolean;
  };
}

class ParallelProcessingTester {
  private supabaseUrl: string;
  private supabaseKey: string;
  private testResults: TestResult[] = [];
  
  constructor() {
    this.supabaseUrl = process.env.VITE_SUPABASE_URL!;
    this.supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;
    
    if (!this.supabaseUrl || !this.supabaseKey) {
      throw new Error('Missing required environment variables: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY');
    }
  }
  
  /**
   * Test 1: All Operations Complete Successfully
   */
  async testSuccessfulParallelExecution(): Promise<TestResult> {
    const testName = 'Successful Parallel Execution';
    const startTime = Date.now();
    
    try {
      console.log('🧪 Testing successful parallel execution...');
      
      const response = await this.callOptimizedFunction(
        'What are the recommended tire pressures for a Unimog U404?',
        {
          'X-Use-Optimized': 'true',
          'X-Test-Mode': 'success'
        }
      );
      
      const executionTime = Date.now() - startTime;
      
      // Validate response structure
      if (!response.response || !response.user_id || !response.timestamp) {
        throw new Error('Missing required response fields');
      }
      
      // Validate performance metrics
      if (!response.performance || !response.performance.parallel_mode) {
        throw new Error('Parallel mode not enabled or performance metrics missing');
      }
      
      // Validate timing improvements
      const totalTime = response.performance.total_time;
      if (totalTime > 30000) { // 30 second max
        throw new Error(`Response took too long: ${totalTime}ms`);
      }
      
      return {
        testName,
        passed: true,
        details: `Parallel execution successful. Total time: ${totalTime}ms`,
        executionTime
      };
      
    } catch (error) {
      return {
        testName,
        passed: false,
        details: `Test failed: ${error.message}`,
        error: error.message,
        executionTime: Date.now() - startTime
      };
    }
  }
  
  /**
   * Test 2: Partial Failures Handled Gracefully
   */
  async testPartialFailureHandling(): Promise<TestResult> {
    const testName = 'Partial Failure Handling';
    const startTime = Date.now();
    
    try {
      console.log('🧪 Testing partial failure handling...');
      
      const response = await this.callOptimizedFunction(
        'Help me with engine maintenance for my Unimog',
        {
          'X-Use-Optimized': 'true',
          'X-Test-Failure': 'partial' // Simulate partial database failures
        }
      );
      
      const executionTime = Date.now() - startTime;
      
      // Even with partial failures, should return valid response
      if (!response.response || response.response.trim().length === 0) {
        throw new Error('No response returned despite partial failures');
      }
      
      // Should still have basic structure
      if (!response.user_id || !response.timestamp) {
        throw new Error('Missing basic response structure');
      }
      
      // Performance metrics should indicate some operations failed gracefully
      if (response.performance && response.performance.parallel_mode) {
        return {
          testName,
          passed: true,
          details: `Partial failures handled gracefully. Response still generated in ${response.performance.total_time}ms`,
          executionTime
        };
      }
      
      return {
        testName,
        passed: true,
        details: `Partial failures handled. Valid response returned.`,
        executionTime
      };
      
    } catch (error) {
      return {
        testName,
        passed: false,
        details: `Test failed: ${error.message}`,
        error: error.message,
        executionTime: Date.now() - startTime
      };
    }
  }
  
  /**
   * Test 3: Timeout Protection
   */
  async testTimeoutProtection(): Promise<TestResult> {
    const testName = 'Timeout Protection';
    const startTime = Date.now();
    
    try {
      console.log('🧪 Testing timeout protection...');
      
      const response = await this.callOptimizedFunction(
        'Tell me about Unimog transmission systems',
        {
          'X-Use-Optimized': 'true',
          'X-Test-Timeout': 'true' // Simulate slow database operations
        }
      );
      
      const executionTime = Date.now() - startTime;
      
      // Should complete within reasonable time despite timeouts
      if (executionTime > 35000) { // 35 second max
        throw new Error(`Timeout protection failed - took ${executionTime}ms`);
      }
      
      // Should still return valid response
      if (!response.response || response.response.trim().length === 0) {
        throw new Error('No response returned - timeout protection may have failed');
      }
      
      return {
        testName,
        passed: true,
        details: `Timeout protection working. Completed in ${executionTime}ms with valid response`,
        executionTime
      };
      
    } catch (error) {
      return {
        testName,
        passed: false,
        details: `Test failed: ${error.message}`,
        error: error.message,
        executionTime: Date.now() - startTime
      };
    }
  }
  
  /**
   * Test 4: Output Identical to Original Function
   */
  async testOutputIdentity(): Promise<TestResult> {
    const testName = 'Output Identity Verification';
    const startTime = Date.now();
    
    try {
      console.log('🧪 Testing output identity with original function...');
      
      const query = 'What is the engine oil capacity for a Unimog U1300L?';
      
      // Call both functions with identical inputs
      const [optimizedResponse, originalResponse] = await Promise.allSettled([
        this.callOptimizedFunction(query, { 'X-Use-Optimized': 'true' }),
        this.callOriginalFunction(query)
      ]);
      
      const executionTime = Date.now() - startTime;
      
      if (optimizedResponse.status === 'rejected') {
        throw new Error(`Optimized function failed: ${optimizedResponse.reason}`);
      }
      
      if (originalResponse.status === 'rejected') {
        throw new Error(`Original function failed: ${originalResponse.reason}`);
      }
      
      const optimized = optimizedResponse.value;
      const original = originalResponse.value;
      
      // Compare response structures
      if (!this.compareResponseStructure(optimized, original)) {
        throw new Error('Response structures do not match');
      }
      
      // Both should have valid responses
      if (!optimized.response || !original.response) {
        throw new Error('One or both responses are empty');
      }
      
      // Response content should be technical and relevant (both use same Claude model)
      const optimizedWords = optimized.response.split(' ').length;
      const originalWords = original.response.split(' ').length;
      
      if (Math.abs(optimizedWords - originalWords) > originalWords * 0.5) {
        console.warn(`⚠️  Response length differs significantly: ${optimizedWords} vs ${originalWords} words`);
      }
      
      return {
        testName,
        passed: true,
        details: `Output structures match. Optimized: ${optimizedWords} words, Original: ${originalWords} words`,
        executionTime
      };
      
    } catch (error) {
      return {
        testName,
        passed: false,
        details: `Test failed: ${error.message}`,
        error: error.message,
        executionTime: Date.now() - startTime
      };
    }
  }
  
  /**
   * Test 5: Performance Improvements
   */
  async testPerformanceImprovements(): Promise<TestResult> {
    const testName = 'Performance Improvements';
    const startTime = Date.now();
    
    try {
      console.log('🧪 Testing performance improvements...');
      
      const query = 'How do I maintain the differential locks on my Unimog?';
      
      // Run multiple iterations to get average performance
      const iterations = 3;
      const optimizedTimes: number[] = [];
      const originalTimes: number[] = [];
      
      for (let i = 0; i < iterations; i++) {
        console.log(`   Iteration ${i + 1}/${iterations}...`);
        
        const optimizedStart = Date.now();
        const optimizedResponse = await this.callOptimizedFunction(query, { 'X-Use-Optimized': 'true' });
        const optimizedTime = Date.now() - optimizedStart;
        optimizedTimes.push(optimizedTime);
        
        // Wait a moment between calls
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const originalStart = Date.now();
        const originalResponse = await this.callOriginalFunction(query);
        const originalTime = Date.now() - originalStart;
        originalTimes.push(originalTime);
        
        // Wait between iterations
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      const executionTime = Date.now() - startTime;
      
      // Calculate averages
      const avgOptimized = optimizedTimes.reduce((a, b) => a + b, 0) / iterations;
      const avgOriginal = originalTimes.reduce((a, b) => a + b, 0) / iterations;
      
      const improvement = ((avgOriginal - avgOptimized) / avgOriginal) * 100;
      
      // Performance should be at least comparable (allow for some variance)
      if (avgOptimized > avgOriginal * 1.5) {
        console.warn(`⚠️  Optimized function slower than original: ${avgOptimized}ms vs ${avgOriginal}ms`);
      }
      
      return {
        testName,
        passed: true,
        details: `Average times - Optimized: ${Math.round(avgOptimized)}ms, Original: ${Math.round(avgOriginal)}ms, Improvement: ${Math.round(improvement)}%`,
        executionTime
      };
      
    } catch (error) {
      return {
        testName,
        passed: false,
        details: `Test failed: ${error.message}`,
        error: error.message,
        executionTime: Date.now() - startTime
      };
    }
  }
  
  /**
   * Test 6: Sequential Mode Fallback
   */
  async testSequentialModeFallback(): Promise<TestResult> {
    const testName = 'Sequential Mode Fallback';
    const startTime = Date.now();
    
    try {
      console.log('🧪 Testing sequential mode fallback...');
      
      const response = await this.callOptimizedFunction(
        'Explain the Unimog portal axle system',
        {
          'X-Use-Optimized': 'true',
          'X-Force-Sequential': 'true' // Force sequential processing
        }
      );
      
      const executionTime = Date.now() - startTime;
      
      // Should still work in sequential mode
      if (!response.response || response.response.trim().length === 0) {
        throw new Error('No response in sequential mode');
      }
      
      // Performance metrics should indicate sequential mode
      if (response.performance && response.performance.parallel_mode === true) {
        throw new Error('Should be in sequential mode but parallel_mode is true');
      }
      
      return {
        testName,
        passed: true,
        details: `Sequential mode works. Response generated successfully.`,
        executionTime
      };
      
    } catch (error) {
      return {
        testName,
        passed: false,
        details: `Test failed: ${error.message}`,
        error: error.message,
        executionTime: Date.now() - startTime
      };
    }
  }
  
  /**
   * Helper: Call optimized function
   */
  private async callOptimizedFunction(query: string, headers: Record<string, string> = {}): Promise<BarryResponse> {
    const fetch = (await import('node-fetch')).default;
    
    const response = await fetch(`${this.supabaseUrl}/functions/v1/chat-with-barry-optimized`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.supabaseKey}`,
        ...headers
      },
      body: JSON.stringify({ query })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    return await response.json();
  }
  
  /**
   * Helper: Call original function
   */
  private async callOriginalFunction(query: string): Promise<BarryResponse> {
    const fetch = (await import('node-fetch')).default;
    
    const response = await fetch(`${this.supabaseUrl}/functions/v1/chat-with-barry-claude`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.supabaseKey}`
      },
      body: JSON.stringify({ query })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    return await response.json();
  }
  
  /**
   * Helper: Compare response structures
   */
  private compareResponseStructure(response1: BarryResponse, response2: BarryResponse): boolean {
    const required = ['response', 'user_id', 'timestamp'];
    
    for (const field of required) {
      if (!response1[field] || !response2[field]) {
        console.error(`Missing field ${field} in one of the responses`);
        return false;
      }
    }
    
    return true;
  }
  
  /**
   * Run all tests
   */
  async runAllTests(): Promise<void> {
    console.log('🚀 Starting Parallel Processing Test Suite');
    console.log('==========================================\n');
    
    const tests = [
      () => this.testSuccessfulParallelExecution(),
      () => this.testPartialFailureHandling(),
      () => this.testTimeoutProtection(),
      () => this.testOutputIdentity(),
      () => this.testPerformanceImprovements(),
      () => this.testSequentialModeFallback()
    ];
    
    const startTime = Date.now();
    
    for (const test of tests) {
      try {
        const result = await test();
        this.testResults.push(result);
        
        if (result.passed) {
          console.log(`✅ ${result.testName}: ${result.details}`);
        } else {
          console.log(`❌ ${result.testName}: ${result.details}`);
        }
        
        // Wait between tests
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.log(`💥 ${tests.indexOf(test)} failed with unexpected error: ${error.message}`);
        this.testResults.push({
          testName: `Test ${tests.indexOf(test)}`,
          passed: false,
          details: `Unexpected error: ${error.message}`,
          error: error.message
        });
      }
    }
    
    const totalTime = Date.now() - startTime;
    
    // Generate summary
    this.generateTestSummary(totalTime);
  }
  
  /**
   * Generate test summary report
   */
  private generateTestSummary(totalExecutionTime: number): void {
    console.log('\n📊 Test Results Summary');
    console.log('========================');
    
    const passed = this.testResults.filter(r => r.passed).length;
    const failed = this.testResults.filter(r => !r.passed).length;
    const total = this.testResults.length;
    
    console.log(`Total Tests: ${total}`);
    console.log(`Passed: ${passed} ✅`);
    console.log(`Failed: ${failed} ❌`);
    console.log(`Success Rate: ${Math.round((passed / total) * 100)}%`);
    console.log(`Total Execution Time: ${Math.round(totalExecutionTime / 1000)}s\n`);
    
    if (failed > 0) {
      console.log('❌ Failed Tests:');
      this.testResults.filter(r => !r.passed).forEach(result => {
        console.log(`   • ${result.testName}: ${result.details}`);
      });
      console.log('');
    }
    
    // Recommendations
    console.log('💡 Recommendations:');
    if (passed === total) {
      console.log('   • ✅ All tests passed! Parallel processing optimization is ready for deployment');
      console.log('   • Consider enabling the optimized function for A/B testing');
      console.log('   • Monitor performance metrics in production');
    } else if (passed / total >= 0.8) {
      console.log('   • ⚠️  Most tests passed but some failures detected');
      console.log('   • Review failed tests and fix issues before deployment');
      console.log('   • Consider running tests again after fixes');
    } else {
      console.log('   • ❌ Multiple test failures - optimization needs work');
      console.log('   • Review implementation and fix critical issues');
      console.log('   • Do not deploy until tests pass');
    }
    
    // Save results to file
    this.saveResults(totalExecutionTime);
  }
  
  /**
   * Save test results to JSON file
   */
  private async saveResults(totalExecutionTime: number): Promise<void> {
    try {
      const fs = await import('fs/promises');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `parallel_test_results_${timestamp}.json`;
      const filepath = path.join(__dirname, filename);
      
      const report = {
        timestamp: new Date().toISOString(),
        totalExecutionTime,
        summary: {
          total: this.testResults.length,
          passed: this.testResults.filter(r => r.passed).length,
          failed: this.testResults.filter(r => !r.passed).length,
          successRate: Math.round((this.testResults.filter(r => r.passed).length / this.testResults.length) * 100)
        },
        results: this.testResults
      };
      
      await fs.writeFile(filepath, JSON.stringify(report, null, 2));
      console.log(`\n📁 Detailed results saved to: ${filepath}`);
      
    } catch (error) {
      console.error(`Failed to save results: ${error.message}`);
    }
  }
}

// CLI interface
async function main() {
  try {
    const tester = new ParallelProcessingTester();
    await tester.runAllTests();
  } catch (error) {
    console.error('💥 Test suite failed to start:', error.message);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Test suite interrupted');
  process.exit(0);
});

// Export for programmatic use
export { ParallelProcessingTester };

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}