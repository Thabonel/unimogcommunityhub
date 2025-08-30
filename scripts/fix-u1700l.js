import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file
dotenv.config({ path: join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ydevatqwkoccxhtejdor.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_KEY;

if (!supabaseKey) {
  console.error('No Supabase key found in environment');
  console.log('Please set VITE_SUPABASE_ANON_KEY or SUPABASE_SERVICE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixU1700L() {
  console.log('Starting U1700L fix...');
  console.log('Using Supabase URL:', supabaseUrl);
  
  // Update vehicle descriptions
  console.log('\n1. Updating vehicle descriptions...');
  const { error: updateError1 } = await supabase
    .from('wis_models')
    .update({
      model_name: 'Unimog U1700L (435 Series)',
      description: 'Heavy-duty Unimog 435 series (Australia) - uses U1300L procedures due to shared platform'
    })
    .eq('id', '22222222-2222-2222-2222-222222222222');
    
  if (updateError1) {
    console.error('Error updating U1700L:', updateError1);
  } else {
    console.log('✓ Updated U1700L description');
  }
  
  const { error: updateError2 } = await supabase
    .from('wis_models')
    .update({
      model_name: 'Unimog U1300L (435 Series)',
      description: 'Medium-duty Unimog 435 series with OM366 engine'
    })
    .eq('id', '11111111-1111-1111-1111-111111111111');
    
  if (updateError2) {
    console.error('Error updating U1300L:', updateError2);
  } else {
    console.log('✓ Updated U1300L description');
  }
  
  // Delete existing U1700L procedures (the generic U2000 ones)
  console.log('\n2. Deleting generic U2000 procedures from U1700L...');
  const { error: deleteError1 } = await supabase
    .from('wis_procedures')
    .delete()
    .eq('vehicle_id', '22222222-2222-2222-2222-222222222222');
    
  if (deleteError1) {
    console.error('Error deleting procedures:', deleteError1);
  } else {
    console.log('✓ Deleted old U1700L procedures');
  }
  
  // Delete existing U1700L parts
  console.log('\n3. Deleting any existing U1700L parts...');
  const { error: deleteError2 } = await supabase
    .from('wis_parts')
    .delete()
    .eq('vehicle_id', '22222222-2222-2222-2222-222222222222');
    
  if (deleteError2) {
    console.error('Error deleting parts:', deleteError2);
  } else {
    console.log('✓ Deleted old U1700L parts');
  }
  
  // Get U1300L procedures
  console.log('\n4. Fetching U1300L procedures...');
  const { data: u1300Procedures, error: fetchError1 } = await supabase
    .from('wis_procedures')
    .select('*')
    .eq('vehicle_id', '11111111-1111-1111-1111-111111111111');
    
  if (fetchError1) {
    console.error('Error fetching U1300L procedures:', fetchError1);
    return;
  }
  
  if (u1300Procedures && u1300Procedures.length > 0) {
    console.log(`✓ Found ${u1300Procedures.length} U1300L procedures to copy`);
    
    // Transform and insert procedures for U1700L
    const u1700Procedures = u1300Procedures.map(proc => ({
      vehicle_id: '22222222-2222-2222-2222-222222222222',
      procedure_code: proc.procedure_code.replace('U1300L', 'U1700L'),
      title: proc.title ? proc.title.replace('U1300L', 'U1700L (435 Series)') : proc.title,
      category: proc.category,
      subcategory: proc.subcategory,
      description: proc.description ? proc.description.replace('U1300L', 'U1700L (435 Series)') : proc.description,
      content: proc.content ? proc.content.replace('U1300L', 'U1700L/U1300L (435 Series)') : proc.content,
      difficulty_level: proc.difficulty_level,
      estimated_time_minutes: proc.estimated_time_minutes,
      tools_required: proc.tools_required,
      parts_required: proc.parts_required,
      safety_warnings: proc.safety_warnings,
      steps: proc.steps,
      is_published: proc.is_published
    }));
    
    console.log('5. Inserting U1700L procedures...');
    const { error: insertError1 } = await supabase
      .from('wis_procedures')
      .insert(u1700Procedures);
      
    if (insertError1) {
      console.error('Error inserting procedures:', insertError1);
    } else {
      console.log('✓ Successfully inserted U1700L procedures');
    }
  } else {
    console.log('⚠ No U1300L procedures found to copy');
  }
  
  // Get U1300L parts
  console.log('\n6. Fetching U1300L parts...');
  const { data: u1300Parts, error: fetchError2 } = await supabase
    .from('wis_parts')
    .select('*')
    .eq('vehicle_id', '11111111-1111-1111-1111-111111111111');
    
  if (fetchError2) {
    console.error('Error fetching U1300L parts:', fetchError2);
    return;
  }
  
  if (u1300Parts && u1300Parts.length > 0) {
    console.log(`✓ Found ${u1300Parts.length} U1300L parts to copy`);
    
    // Transform and insert parts for U1700L
    const u1700Parts = u1300Parts.map(part => ({
      vehicle_id: '22222222-2222-2222-2222-222222222222',
      part_number: part.part_number,
      part_name: part.part_name,
      category: part.category,
      subcategory: part.subcategory,
      description: part.description,
      price_estimate: part.price_estimate,
      availability_status: part.availability_status,
      superseded_by: part.superseded_by,
      notes: (part.notes || '') + ' (Compatible with U1300L/435 Series)'
    }));
    
    console.log('7. Inserting U1700L parts...');
    const { error: insertError2 } = await supabase
      .from('wis_parts')
      .insert(u1700Parts);
      
    if (insertError2) {
      console.error('Error inserting parts:', insertError2);
    } else {
      console.log('✓ Successfully inserted U1700L parts');
    }
  } else {
    console.log('⚠ No U1300L parts found to copy');
  }
  
  // Verify the fix
  console.log('\n8. Verifying the fix...');
  const { count: procCount } = await supabase
    .from('wis_procedures')
    .select('*', { count: 'exact', head: true })
    .eq('vehicle_id', '22222222-2222-2222-2222-222222222222');
    
  const { count: partCount } = await supabase
    .from('wis_parts')
    .select('*', { count: 'exact', head: true })
    .eq('vehicle_id', '22222222-2222-2222-2222-222222222222');
    
  console.log(`\n✅ Fix complete!`);
  console.log(`U1700L now has ${procCount} procedures and ${partCount} parts from U1300L/435 Series`);
  console.log('\nRefresh the Workshop Database page to see the changes.');
}

fixU1700L().catch(console.error);