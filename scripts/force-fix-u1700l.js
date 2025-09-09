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

async function forceFixU1700L() {
  console.log('Force fixing U1700L...\n');
  
  // Count existing U2000 procedures
  const { count: beforeCount } = await supabase
    .from('wis_procedures')
    .select('*', { count: 'exact', head: true })
    .eq('vehicle_id', '22222222-2222-2222-2222-222222222222');
    
  console.log(`U1700L currently has ${beforeCount} procedures`);
  
  // Delete ALL procedures for U1700L
  console.log('\nDeleting ALL U1700L procedures...');
  const { error: deleteError } = await supabase
    .from('wis_procedures')
    .delete()
    .eq('vehicle_id', '22222222-2222-2222-2222-222222222222');
    
  if (deleteError) {
    console.error('Error deleting procedures:', deleteError);
    return;
  }
  
  // Verify deletion
  const { count: afterCount } = await supabase
    .from('wis_procedures')
    .select('*', { count: 'exact', head: true })
    .eq('vehicle_id', '22222222-2222-2222-2222-222222222222');
    
  console.log(`After deletion: U1700L has ${afterCount} procedures`);
  
  // Since U1300L has no procedures, let's just add a message procedure
  console.log('\nAdding informational procedure for U1700L...');
  
  const infoProcedure = {
    vehicle_id: '22222222-2222-2222-2222-222222222222',
    procedure_code: 'U1700L-INFO-001',
    title: 'U1700L (435 Series) - No Procedures Available',
    category: 'Information',
    subcategory: 'Notice',
    description: 'U1700L is an Australia-specific variant of the Unimog 435 series',
    content: `# U1700L (435 Series) Information

## About the U1700L
The Unimog U1700L is an Australia-specific variant of the Unimog 435 series. It shares technical characteristics with the U1300L model.

## Technical Procedures
Currently, there are no specific procedures loaded for the U1700L in the Workshop Information System.

### Recommended Actions:
1. Refer to U1300L documentation for compatible procedures
2. Consult your local Unimog specialist for model-specific information
3. Use the general Unimog 435 series maintenance guidelines

## Key Specifications:
- Engine: OM366A (similar to U1300L's OM366)
- Part of the Unimog 435 series
- Heavy-duty variant designed for Australian conditions
- Compatible with many U1300L parts and procedures

## Note:
The U1700L is not included in the standard Mercedes-Benz WIS system as it was a market-specific model. For maintenance and repair, technicians typically reference U1300L procedures due to the shared platform.`,
    difficulty_level: 1,
    estimated_time_minutes: 5,
    tools_required: [],
    parts_required: [],
    safety_warnings: [],
    steps: null,
    is_published: true
  };
  
  const { error: insertError } = await supabase
    .from('wis_procedures')
    .insert([infoProcedure]);
    
  if (insertError) {
    console.error('Error inserting info procedure:', insertError);
  } else {
    console.log('✓ Added informational procedure for U1700L');
  }
  
  // Final count
  const { count: finalCount } = await supabase
    .from('wis_procedures')
    .select('*', { count: 'exact', head: true })
    .eq('vehicle_id', '22222222-2222-2222-2222-222222222222');
    
  console.log(`\n✅ Fix complete! U1700L now has ${finalCount} procedure(s)`);
  console.log('Refresh the Workshop Database page to see the changes.');
}

forceFixU1700L().catch(console.error);