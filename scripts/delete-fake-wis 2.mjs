import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function deleteAllFakeData() {
  console.log('🗑️ DELETING ALL FAKE WIS DATA...');
  
  // Delete ALL procedures
  const { error: procError } = await supabase
    .from('wis_procedures')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');
  
  // Delete ALL parts
  const { error: partsError } = await supabase
    .from('wis_parts')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');
  
  // Delete ALL bulletins
  const { error: bulletinsError } = await supabase
    .from('wis_bulletins')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');
  
  if (procError) console.error('Error deleting procedures:', procError);
  if (partsError) console.error('Error deleting parts:', partsError);
  if (bulletinsError) console.error('Error deleting bulletins:', bulletinsError);
  
  // Verify deletion
  const { count: procCount } = await supabase
    .from('wis_procedures')
    .select('*', { count: 'exact', head: true });
  
  const { count: partsCount } = await supabase
    .from('wis_parts')
    .select('*', { count: 'exact', head: true });
  
  const { count: bulletinsCount } = await supabase
    .from('wis_bulletins')
    .select('*', { count: 'exact', head: true });
  
  console.log('✅ DELETION COMPLETE');
  console.log('Remaining records:');
  console.log('- Procedures:', procCount || 0);
  console.log('- Parts:', partsCount || 0);
  console.log('- Bulletins:', bulletinsCount || 0);
}

deleteAllFakeData().catch(console.error);