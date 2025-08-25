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

async function checkU1700L() {
  console.log('Checking U1700L procedures...\n');
  
  // Get a sample of U1700L procedures
  const { data: procedures, error } = await supabase
    .from('wis_procedures')
    .select('procedure_code, title, category')
    .eq('vehicle_id', '22222222-2222-2222-2222-222222222222')
    .limit(10);
    
  if (error) {
    console.error('Error fetching procedures:', error);
    return;
  }
  
  console.log('Sample U1700L procedures:');
  procedures.forEach(proc => {
    console.log(`- ${proc.title} (${proc.procedure_code}) - Category: ${proc.category}`);
  });
  
  // Check if they're U2000 procedures
  const u2000Count = procedures.filter(p => p.procedure_code && p.procedure_code.includes('U2000')).length;
  const u1700Count = procedures.filter(p => p.procedure_code && p.procedure_code.includes('U1700')).length;
  
  console.log(`\nOf the first 10 procedures:`);
  console.log(`- ${u2000Count} have U2000 codes`);
  console.log(`- ${u1700Count} have U1700 codes`);
  
  // Check U1300L procedures
  console.log('\n\nChecking U1300L procedures...');
  const { data: u1300Procs, count } = await supabase
    .from('wis_procedures')
    .select('*', { count: 'exact', head: true })
    .eq('vehicle_id', '11111111-1111-1111-1111-111111111111');
    
  console.log(`U1300L has ${count} procedures`);
  
  // Check all vehicle models
  console.log('\n\nChecking all vehicle models...');
  const { data: models } = await supabase
    .from('wis_models')
    .select('id, model_name, model_code')
    .order('model_code');
    
  if (models) {
    console.log('Vehicle models in database:');
    models.forEach(model => {
      console.log(`- ${model.model_code}: ${model.model_name} (ID: ${model.id})`);
    });
  }
}

checkU1700L().catch(console.error);