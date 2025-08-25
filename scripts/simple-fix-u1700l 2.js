import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file
dotenv.config({ path: join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ydevatqwkoccxhtejdor.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function simpleFixU1700L() {
  console.log('Simple fix for U1700L...\n');
  
  // Count existing procedures
  const { data: existingProcs, count: beforeCount } = await supabase
    .from('wis_procedures')
    .select('id, procedure_code', { count: 'exact' })
    .eq('vehicle_id', '22222222-2222-2222-2222-222222222222')
    .like('procedure_code', 'U2000%');
    
  console.log(`Found ${beforeCount} U2000 procedures for U1700L`);
  
  if (existingProcs && existingProcs.length > 0) {
    console.log(`\nDeleting ${existingProcs.length} U2000 procedures...`);
    
    // Delete them one by one to avoid any bulk operation issues
    for (const proc of existingProcs) {
      const { error } = await supabase
        .from('wis_procedures')
        .delete()
        .eq('id', proc.id);
        
      if (error) {
        console.error(`Error deleting ${proc.procedure_code}:`, error.message);
      }
    }
    
    console.log('Deletion complete');
  }
  
  // Verify
  const { count: afterCount } = await supabase
    .from('wis_procedures')
    .select('*', { count: 'exact', head: true })
    .eq('vehicle_id', '22222222-2222-2222-2222-222222222222');
    
  console.log(`\n✅ U1700L now has ${afterCount} procedures`);
  
  // Show what's left
  const { data: remaining } = await supabase
    .from('wis_procedures')
    .select('procedure_code, title')
    .eq('vehicle_id', '22222222-2222-2222-2222-222222222222')
    .limit(5);
    
  if (remaining && remaining.length > 0) {
    console.log('\nRemaining procedures (first 5):');
    remaining.forEach(p => console.log(`- ${p.title} (${p.procedure_code})`));
  }
}

simpleFixU1700L().catch(console.error);