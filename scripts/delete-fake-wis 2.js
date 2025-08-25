const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '/Users/thabonel/Documents/unimogcommunityhub/.env' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function deleteAllFakeData() {
  console.log('🗑️ Deleting ALL WIS data (fake generated data)...');
  
  // Delete ALL procedures
  const procResult = await supabase
    .from('wis_procedures')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete everything
  
  // Delete ALL parts
  const partsResult = await supabase
    .from('wis_parts')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');
  
  // Delete ALL bulletins
  const bulletinsResult = await supabase
    .from('wis_bulletins')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');
  
  console.log('✅ All fake WIS data has been deleted');
  
  // Verify deletion
  const { count: procCount } = await supabase.from('wis_procedures').select('*', { count: 'exact', head: true });
  const { count: partsCount } = await supabase.from('wis_parts').select('*', { count: 'exact', head: true });
  const { count: bulletinsCount } = await supabase.from('wis_bulletins').select('*', { count: 'exact', head: true });
  
  console.log('Remaining records after deletion:');
  console.log('- Procedures:', procCount || 0);
  console.log('- Parts:', partsCount || 0);
  console.log('- Bulletins:', bulletinsCount || 0);
}

deleteAllFakeData().catch(console.error);