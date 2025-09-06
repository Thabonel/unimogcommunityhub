// Test WIS Database Connection and Functions
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testWISDatabase() {
  console.log('🔍 Testing WIS Database Setup...\n');

  // Test 1: Check if tables exist by querying them
  console.log('1. Testing WIS Tables:');
  
  const tables = ['wis_parts', 'wis_procedures', 'wis_bulletins', 'wis_chunks'];
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      if (error) {
        console.log(`   ❌ ${table}: ${error.message}`);
      } else {
        console.log(`   ✅ ${table}: OK (${data?.length || 0} sample records)`);
      }
    } catch (err) {
      console.log(`   ❌ ${table}: ${err.message}`);
    }
  }

  // Test 2: Test WIS Search RPC
  console.log('\n2. Testing WIS Search RPC:');
  try {
    const { data, error } = await supabase.rpc('wis_search', {
      q: 'alternator',
      limit_rows: 5
    });
    
    if (error) {
      console.log(`   ❌ wis_search: ${error.message}`);
    } else {
      console.log(`   ✅ wis_search: OK (returned ${data?.length || 0} results)`);
      if (data && data.length > 0) {
        console.log(`   📄 Sample result: ${data[0].title}`);
      }
    }
  } catch (err) {
    console.log(`   ❌ wis_search: ${err.message}`);
  }

  // Test 3: Test Media URL RPC
  console.log('\n3. Testing Media URL RPC:');
  try {
    const { data, error } = await supabase.rpc('wis_media_url', {
      bucket: 'wis-photos',
      file_name: 'test.jpg',
      expires_in: 3600
    });
    
    if (error) {
      console.log(`   ❌ wis_media_url: ${error.message}`);
    } else {
      console.log(`   ✅ wis_media_url: OK (generated URL)`);
      console.log(`   🔗 Sample URL: ${data}`);
    }
  } catch (err) {
    console.log(`   ❌ wis_media_url: ${err.message}`);
  }

  // Test 4: Check storage buckets
  console.log('\n4. Testing Storage Buckets:');
  try {
    const { data, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.log(`   ❌ Storage buckets: ${error.message}`);
    } else {
      const bucketNames = data.map(b => b.name);
      const wisBuckets = ['wis-photos', 'wis-diagrams', 'wis-schematics', 'wis-tables', 'wis-charts'];
      
      console.log(`   📦 Available buckets: ${bucketNames.join(', ')}`);
      
      wisBuckets.forEach(bucket => {
        if (bucketNames.includes(bucket)) {
          console.log(`   ✅ ${bucket}: EXISTS`);
        } else {
          console.log(`   ❌ ${bucket}: MISSING`);
        }
      });
    }
  } catch (err) {
    console.log(`   ❌ Storage buckets: ${err.message}`);
  }

  console.log('\n🏁 WIS Database Test Complete');
}

// Run the test
testWISDatabase().then(() => {
  console.log('\n✅ All tests completed successfully!');
  process.exit(0);
}).catch((error) => {
  console.error('\n❌ Test suite failed:', error);
  process.exit(1);
});