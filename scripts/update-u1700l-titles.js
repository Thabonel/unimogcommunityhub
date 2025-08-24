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

async function updateU1700LTitles() {
  console.log('Updating U1700L procedure titles...\n');
  
  // Get all U2000 procedures for U1700L
  const { data: procedures, error: fetchError } = await supabase
    .from('wis_procedures')
    .select('id, title, procedure_code, description')
    .eq('vehicle_id', '22222222-2222-2222-2222-222222222222')
    .like('procedure_code', 'U2000%');
    
  if (fetchError) {
    console.error('Error fetching procedures:', fetchError);
    return;
  }
  
  console.log(`Found ${procedures.length} U2000 procedures to update`);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const proc of procedures) {
    // Update title and description to indicate they're placeholders
    const newTitle = proc.title.replace('Unimog U2000', 'U1700L (435 Series) - PLACEHOLDER DATA');
    const newDescription = 'PLACEHOLDER: This is generic data. U1700L shares characteristics with U1300L (435 Series). Consult U1300L documentation or your local specialist.';
    
    const { error } = await supabase
      .from('wis_procedures')
      .update({ 
        title: newTitle,
        description: newDescription
      })
      .eq('id', proc.id);
      
    if (error) {
      console.error(`Error updating ${proc.procedure_code}:`, error.message);
      errorCount++;
    } else {
      successCount++;
    }
  }
  
  console.log(`\n✅ Updated ${successCount} procedures`);
  if (errorCount > 0) {
    console.log(`⚠️  Failed to update ${errorCount} procedures`);
  }
  
  // Show sample of updated procedures
  const { data: updated } = await supabase
    .from('wis_procedures')
    .select('title, procedure_code')
    .eq('vehicle_id', '22222222-2222-2222-2222-222222222222')
    .limit(5);
    
  if (updated) {
    console.log('\nSample updated procedures:');
    updated.forEach(p => console.log(`- ${p.title}`));
  }
  
  console.log('\nRefresh the Workshop Database to see the changes.');
}

updateU1700LTitles().catch(console.error);