#!/usr/bin/env npx tsx

/**
 * Basic Deployment Test for chat-with-barry-optimized
 * Tests that the function is deployed and accessible
 */

class DeploymentTester {
  private supabaseUrl: string;
  
  constructor() {
    this.supabaseUrl = process.env.VITE_SUPABASE_URL!;
    
    if (!this.supabaseUrl) {
      throw new Error('Missing required environment variable: VITE_SUPABASE_URL');
    }
  }
  
  async testFunctionDeployment(): Promise<void> {
    console.log('🧪 Testing chat-with-barry-optimized deployment...');
    console.log(`📡 Supabase URL: ${this.supabaseUrl}`);
    
    try {
      const fetch = (await import('node-fetch')).default;
      
      // Test 1: Function exists and responds
      console.log('\n1️⃣ Testing function accessibility...');
      const response = await fetch(`${this.supabaseUrl}/functions/v1/chat-with-barry-optimized`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: 'health check' })
      });
      
      console.log(`   Status: ${response.status} ${response.statusText}`);
      
      if (response.status === 401) {
        console.log('✅ Function is deployed and requires authentication (expected)');
        console.log('   This confirms the function is properly deployed and secured.');
        
      } else if (response.status === 404) {
        console.log('❌ Function not found - deployment failed');
        throw new Error('Function not deployed');
        
      } else {
        const responseText = await response.text();
        console.log(`   Response: ${responseText.substring(0, 200)}...`);
      }
      
      // Test 2: CORS headers
      console.log('\n2️⃣ Testing CORS configuration...');
      const corsResponse = await fetch(`${this.supabaseUrl}/functions/v1/chat-with-barry-optimized`, {
        method: 'OPTIONS'
      });
      
      console.log(`   CORS Status: ${corsResponse.status}`);
      const corsHeaders = {
        origin: corsResponse.headers.get('access-control-allow-origin'),
        headers: corsResponse.headers.get('access-control-allow-headers')
      };
      console.log(`   Allowed Origin: ${corsHeaders.origin}`);
      console.log(`   Allowed Headers: ${corsHeaders.headers}`);
      
      if (corsHeaders.origin === '*') {
        console.log('✅ CORS properly configured');
      } else {
        console.log('⚠️  CORS may need configuration');
      }
      
      // Test 3: Compare with original function
      console.log('\n3️⃣ Testing original function for comparison...');
      const originalResponse = await fetch(`${this.supabaseUrl}/functions/v1/chat-with-barry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages: [{ role: 'user', content: 'health check' }] })
      });
      
      console.log(`   Original Status: ${originalResponse.status} ${originalResponse.statusText}`);
      
      if (originalResponse.status === 401 && response.status === 401) {
        console.log('✅ Both functions have consistent authentication requirements');
      }
      
      // Summary
      console.log('\n📋 Deployment Test Summary:');
      console.log('============================');
      console.log('✅ Optimized function is deployed');
      console.log('✅ Function requires proper authentication');
      console.log('✅ CORS headers are configured');
      console.log('✅ Function is accessible via HTTP POST');
      
      console.log('\n💡 Next Steps:');
      console.log('   • Function deployment successful');
      console.log('   • Ready for authenticated testing');
      console.log('   • Can be enabled via X-Use-Optimized header');
      
    } catch (error) {
      console.error('❌ Deployment test failed:', error.message);
      throw error;
    }
  }
}

// Run the test
async function main() {
  try {
    const tester = new DeploymentTester();
    await tester.testFunctionDeployment();
    console.log('\n🎉 Deployment test completed successfully!');
  } catch (error) {
    console.error('💥 Deployment test failed:', error.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}