// Quick test script to populate WIS data
// Run this in the browser console on the WIS page

async function testWISPopulation() {
  console.log('🚀 Starting WIS data population test...');

  try {
    // Import the service
    const { wisDataService } = await import('/src/services/wis/wisDataService.ts');

    console.log('📊 Running health check...');
    const healthResult = await wisDataService.healthCheck();
    console.log('Health check result:', healthResult);

    if (healthResult.status === 'error') {
      console.error('❌ Health check failed, aborting');
      return;
    }

    console.log('✅ Health check passed, starting population...');
    const result = await wisDataService.populateAllWISData();

    if (result.success) {
      console.log('🎉 WIS data population completed successfully!');
      console.log('📈 Results:', result.details);
      console.log(`📊 Total items added: ${result.details.reduce((sum, r) => sum + (r.count || 0), 0)}`);
    } else {
      console.error('❌ WIS data population failed:', result.message);
      console.log('📋 Details:', result.details);
    }

  } catch (error) {
    console.error('💥 Test script error:', error);
  }
}

// Auto-run if this is being executed directly
if (typeof window !== 'undefined') {
  testWISPopulation();
}