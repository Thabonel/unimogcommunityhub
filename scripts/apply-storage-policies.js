import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables:');
  console.error('VITE_SUPABASE_URL:', !!supabaseUrl);
  console.error('SUPABASE_SERVICE_ROLE_KEY (or anon key as fallback):', !!supabaseServiceKey);
  process.exit(1);
}

// Use service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyStoragePolicies() {
  console.log('🔒 Applying Storage Policies');
  console.log('============================\n');
  
  // Key policies to apply directly via API
  const policies = [
    {
      name: 'Profile Photos Upload Policy',
      sql: `
        DROP POLICY IF EXISTS "Allow authenticated uploads to profile photos" ON storage.objects;
        CREATE POLICY "Allow authenticated uploads to profile photos"
          ON storage.objects FOR INSERT
          WITH CHECK (bucket_id = 'Profile Photos' AND auth.uid() IS NOT NULL);
      `
    },
    {
      name: 'Profile Photos Read Policy',
      sql: `
        DROP POLICY IF EXISTS "Allow public read access to profile photos" ON storage.objects;
        CREATE POLICY "Allow public read access to profile photos"
          ON storage.objects FOR SELECT
          USING (bucket_id = 'Profile Photos');
      `
    },
    {
      name: 'Vehicle Photos Upload Policy',
      sql: `
        DROP POLICY IF EXISTS "Allow authenticated uploads to vehicle photos" ON storage.objects;
        CREATE POLICY "Allow authenticated uploads to vehicle photos"
          ON storage.objects FOR INSERT
          WITH CHECK (bucket_id = 'vehicle_photos' AND auth.uid() IS NOT NULL);
      `
    },
    {
      name: 'Vehicle Photos Read Policy',
      sql: `
        DROP POLICY IF EXISTS "Allow public read access to vehicle photos" ON storage.objects;
        CREATE POLICY "Allow public read access to vehicle photos"
          ON storage.objects FOR SELECT
          USING (bucket_id = 'vehicle_photos');
      `
    }
  ];
  
  for (const policy of policies) {
    try {
      console.log(`📝 Applying: ${policy.name}...`);
      
      const { data, error } = await supabase.rpc('execute_sql', { 
        sql_query: policy.sql 
      });
      
      if (error) {
        console.log(`❌ Failed: ${error.message}`);
        // Try alternative approach using raw query
        console.log('🔄 Trying alternative method...');
        
        const { data: altData, error: altError } = await supabase
          .from('_dummy_table_that_does_not_exist')
          .select('*'); // This will fail but might give us insight
          
        console.log('Alternative method not available via client API');
      } else {
        console.log(`✅ Applied successfully`);
      }
    } catch (err) {
      console.log(`❌ Exception: ${err.message}`);
    }
    console.log('');
  }
  
  console.log('⚠️  NOTE: Storage policies may need to be applied manually via Supabase Dashboard');
  console.log('📋 Go to: Supabase Dashboard → Storage → Policies');
  console.log('📄 Use the SQL from: scripts/fix-storage-policies.sql');
}

applyStoragePolicies();