#!/usr/bin/env node

/**
 * Smoke test for Unimog WIS MCP Server
 * Tests all MCP tools with sample data
 */

const { spawn } = require('child_process');
const path = require('path');

class SmokeTest {
  constructor() {
    this.serverProcess = null;
    this.testResults = [];
  }

  async runTest() {
    console.log('🔥 Starting Unimog WIS MCP Server Smoke Test');
    console.log('=' .repeat(50));

    try {
      await this.startServer();
      await this.runAllTests();
      this.printResults();
    } catch (error) {
      console.error('❌ Smoke test failed:', error.message);
      process.exit(1);
    } finally {
      if (this.serverProcess) {
        this.serverProcess.kill();
      }
    }

    const failed = this.testResults.filter(r => !r.success);
    if (failed.length > 0) {
      console.error(`❌ ${failed.length} test(s) failed`);
      process.exit(1);
    }

    console.log('✅ All smoke tests passed!');
  }

  async startServer() {
    return new Promise((resolve, reject) => {
      const serverPath = path.join(__dirname, '../dist/server.js');
      this.serverProcess = spawn('node', [serverPath], {
        env: { 
          ...process.env, 
          MCP_TRANSPORT: 'stdio',
          LOG_LEVEL: 'error' // Reduce noise during testing
        },
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let output = '';
      this.serverProcess.stdout.on('data', (data) => {
        output += data.toString();
      });

      this.serverProcess.stderr.on('data', (data) => {
        const errorOutput = data.toString();
        if (errorOutput.includes('MCP server started')) {
          resolve();
        }
      });

      // Give server time to start
      setTimeout(() => {
        if (this.serverProcess && !this.serverProcess.killed) {
          resolve();
        } else {
          reject(new Error('Server failed to start'));
        }
      }, 3000);

      this.serverProcess.on('error', reject);
    });
  }

  async sendMCPRequest(method, params = {}) {
    return new Promise((resolve, reject) => {
      const request = {
        jsonrpc: '2.0',
        id: Math.random().toString(36).substr(2, 9),
        method,
        params
      };

      const requestStr = JSON.stringify(request) + '\n';
      
      let responseData = '';
      const timeout = setTimeout(() => {
        reject(new Error(`Request timeout for ${method}`));
      }, 10000);

      const dataHandler = (data) => {
        responseData += data.toString();
        
        try {
          const lines = responseData.split('\n').filter(line => line.trim());
          for (const line of lines) {
            const response = JSON.parse(line);
            if (response.id === request.id) {
              clearTimeout(timeout);
              this.serverProcess.stdout.off('data', dataHandler);
              resolve(response);
              return;
            }
          }
        } catch (e) {
          // Still receiving data, continue
        }
      };

      this.serverProcess.stdout.on('data', dataHandler);
      this.serverProcess.stdin.write(requestStr);
    });
  }

  async testSearchProcedures() {
    console.log('Testing search_procedures...');
    
    try {
      const response = await this.sendMCPRequest('tools/call', {
        name: 'search_procedures',
        arguments: {
          term: 'starter motor',
          limit: 5
        }
      });

      const success = !response.error;
      let rowCount = 0;

      if (success && response.result && response.result.content) {
        try {
          const data = JSON.parse(response.result.content[0].text);
          rowCount = data.procedures ? data.procedures.length : 0;
        } catch (e) {
          // Could not parse response content
        }
      }

      this.testResults.push({
        test: 'search_procedures',
        success,
        rowCount,
        error: response.error?.message
      });

      console.log(`  ${success ? '✅' : '❌'} search_procedures - Found ${rowCount} procedures`);
      
    } catch (error) {
      this.testResults.push({
        test: 'search_procedures',
        success: false,
        error: error.message
      });
      console.log(`  ❌ search_procedures - ${error.message}`);
    }
  }

  async testGetProcedure() {
    console.log('Testing get_procedure...');
    
    try {
      // First, try to get a procedure ID from search results
      let procedureId = 'test-procedure-id';
      
      const response = await this.sendMCPRequest('tools/call', {
        name: 'get_procedure',
        arguments: {
          id_or_code: procedureId
        }
      });

      const success = !response.error;
      
      this.testResults.push({
        test: 'get_procedure',
        success,
        error: response.error?.message
      });

      console.log(`  ${success ? '✅' : '❌'} get_procedure - ${success ? 'Retrieved procedure details' : response.error?.message}`);
      
    } catch (error) {
      this.testResults.push({
        test: 'get_procedure',
        success: false,
        error: error.message
      });
      console.log(`  ❌ get_procedure - ${error.message}`);
    }
  }

  async testGetAssets() {
    console.log('Testing get_assets...');
    
    try {
      const response = await this.sendMCPRequest('tools/call', {
        name: 'get_assets',
        arguments: {
          procedure_id: 'test-procedure-id',
          types: ['diagram'],
          limit: 3
        }
      });

      const success = !response.error;
      let assetCount = 0;

      if (success && response.result && response.result.content) {
        try {
          const data = JSON.parse(response.result.content[0].text);
          assetCount = data.assets ? data.assets.length : 0;
        } catch (e) {
          // Could not parse response content
        }
      }

      this.testResults.push({
        test: 'get_assets',
        success,
        assetCount,
        error: response.error?.message
      });

      console.log(`  ${success ? '✅' : '❌'} get_assets - Found ${assetCount} assets`);
      
    } catch (error) {
      this.testResults.push({
        test: 'get_assets',
        success: false,
        error: error.message
      });
      console.log(`  ❌ get_assets - ${error.message}`);
    }
  }

  async testGetParts() {
    console.log('Testing get_parts...');
    
    try {
      const response = await this.sendMCPRequest('tools/call', {
        name: 'get_parts',
        arguments: {
          model_code: 'U1300'
        }
      });

      const success = !response.error;
      let partCount = 0;

      if (success && response.result && response.result.content) {
        try {
          const data = JSON.parse(response.result.content[0].text);
          partCount = data.parts ? data.parts.length : 0;
        } catch (e) {
          // Could not parse response content
        }
      }

      this.testResults.push({
        test: 'get_parts',
        success,
        partCount,
        error: response.error?.message
      });

      console.log(`  ${success ? '✅' : '❌'} get_parts - Found ${partCount} parts`);
      
    } catch (error) {
      this.testResults.push({
        test: 'get_parts',
        success: false,
        error: error.message
      });
      console.log(`  ❌ get_parts - ${error.message}`);
    }
  }

  async testRunNamedQuery() {
    console.log('Testing run_named_query...');
    
    try {
      const response = await this.sendMCPRequest('tools/call', {
        name: 'run_named_query',
        arguments: {
          name: 'torque_specs_by_model',
          params_json: {
            model_code: 'U1700'
          }
        }
      });

      const success = !response.error;
      let rowCount = 0;

      if (success && response.result && response.result.content) {
        try {
          const data = JSON.parse(response.result.content[0].text);
          rowCount = data.rows ? data.rows.length : 0;
        } catch (e) {
          // Could not parse response content
        }
      }

      this.testResults.push({
        test: 'run_named_query',
        success,
        rowCount,
        error: response.error?.message
      });

      console.log(`  ${success ? '✅' : '❌'} run_named_query - Returned ${rowCount} rows`);
      
    } catch (error) {
      this.testResults.push({
        test: 'run_named_query',
        success: false,
        error: error.message
      });
      console.log(`  ❌ run_named_query - ${error.message}`);
    }
  }

  async runAllTests() {
    console.log('\nRunning MCP tool tests...\n');
    
    await this.testSearchProcedures();
    await this.testGetProcedure();
    await this.testGetAssets();
    await this.testGetParts();
    await this.testRunNamedQuery();
  }

  printResults() {
    console.log('\n' + '=' .repeat(50));
    console.log('📊 Test Results Summary:');
    console.log('=' .repeat(50));
    
    this.testResults.forEach(result => {
      const status = result.success ? '✅' : '❌';
      const details = [];
      
      if (result.rowCount !== undefined) details.push(`${result.rowCount} rows`);
      if (result.assetCount !== undefined) details.push(`${result.assetCount} assets`);
      if (result.partCount !== undefined) details.push(`${result.partCount} parts`);
      if (result.error) details.push(`Error: ${result.error}`);
      
      const detailStr = details.length > 0 ? ` (${details.join(', ')})` : '';
      console.log(`${status} ${result.test}${detailStr}`);
    });

    const passed = this.testResults.filter(r => r.success).length;
    const total = this.testResults.length;
    console.log(`\n📈 Overall: ${passed}/${total} tests passed`);
  }
}

// Run smoke test if called directly
if (require.main === module) {
  const test = new SmokeTest();
  test.runTest().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = SmokeTest;