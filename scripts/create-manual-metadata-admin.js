import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import readline from 'readline';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '..', '.env') });

// Create interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise(resolve => {
    rl.question(question, answer => {
      resolve(answer);
    });
  });
}

// Extract model codes from filename
function extractModelCodes(filename) {
  const modelCodes = new Set();
  const patterns = [
    /U\d{3,4}[A-Z]?/g,  // U1700, U5023
    /404[.\s]?\d*/g,    // 404, 404.1
    /406/g, /411/g, /416/g, /421/g, /425/g, /435/g, /437/g,
    /UGN/g,             // UGN
    /FLU-419/g,         // SEE/FLU-419
  ];

  patterns.forEach(pattern => {
    const matches = filename.match(pattern);
    if (matches) {
      matches.forEach(match => modelCodes.add(match.trim()));
    }
  });

  return Array.from(modelCodes);
}

// Categorize manual based on filename
function categorizeManual(filename) {
  const lower = filename.toLowerCase();
  
  if (lower.includes('operator') || lower.includes('owner')) return 'operator';
  if (lower.includes('service') || lower.includes('repair')) return 'service';
  if (lower.includes('parts') || lower.includes('catalog')) return 'parts';
  if (lower.includes('workshop')) return 'workshop';
  if (lower.includes('technical') || lower.includes('specification')) return 'technical';
  if (lower.includes('maintenance')) return 'maintenance';
  if (lower.includes('electrical') || lower.includes('wiring')) return 'electrical';
  if (lower.includes('hydraulic')) return 'hydraulic';
  if (lower.includes('engine')) return 'engine';
  if (lower.includes('transmission') || lower.includes('gearbox')) return 'transmission';
  if (lower.includes('axle') || lower.includes('differential')) return 'drivetrain';
  if (lower.includes('data') || lower.includes('summary')) return 'technical';
  if (lower.includes('modification') || lower.includes('mod')) return 'modification';
  if (lower.includes('crane')) return 'equipment';
  
  return 'general';
}

async function main() {
  console.log('🚀 Creating manual metadata entries with admin authentication...\n');
  
  // Get admin credentials
  console.log('Please provide your admin credentials to create manual metadata:');
  const email = await askQuestion('Email: ');
  const password = await askQuestion('Password: ');
  
  // Create client and authenticate
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
  );
  
  console.log('\n🔐 Authenticating...');
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (authError) {
    console.error('❌ Authentication failed:', authError.message);
    rl.close();
    return;
  }
  
  console.log('✅ Authenticated as:', email);
  
  // Get list of manuals from storage
  const { data: files, error: listError } = await supabase.storage
    .from('manuals')
    .list('', {
      limit: 100,
      offset: 0
    });
  
  if (listError) {
    console.error('❌ Error listing files:', listError.message);
    rl.close();
    return;
  }
  
  console.log(`\n📚 Found ${files.length} manuals in storage\n`);
  
  let created = 0;
  let skipped = 0;
  let errors = 0;
  
  for (const file of files) {
    // Check if metadata already exists
    const { data: existing } = await supabase
      .from('manual_metadata')
      .select('id')
      .eq('filename', file.name)
      .single();
    
    if (existing) {
      console.log(`⏭️  Already exists: ${file.name}`);
      skipped++;
      continue;
    }
    
    // Create metadata entry
    const title = file.name.replace(/\.pdf$/i, '').replace(/[-_]/g, ' ');
    const modelCodes = extractModelCodes(file.name);
    const category = categorizeManual(file.name);
    
    console.log(`📝 Creating metadata for: ${file.name}`);
    console.log(`   Title: ${title}`);
    console.log(`   Category: ${category}`);
    if (modelCodes.length > 0) {
      console.log(`   Model codes: ${modelCodes.join(', ')}`);
    }
    
    const { error: insertError } = await supabase
      .from('manual_metadata')
      .insert({
        filename: file.name,
        title: title,
        model_codes: modelCodes.length > 0 ? modelCodes : null,
        category: category,
        file_size: file.metadata?.size || 0,
        uploaded_by: authData.user.id,
        approval_status: 'approved', // Auto-approve all existing manuals
        approved_by: authData.user.id,
        approved_at: new Date().toISOString()
      });
    
    if (insertError) {
      console.error(`❌ Error: ${insertError.message}`);
      errors++;
    } else {
      console.log(`✅ Created successfully\n`);
      created++;
    }
  }
  
  console.log('\n📊 Summary:');
  console.log(`✅ Created: ${created}`);
  console.log(`⏭️  Skipped: ${skipped}`);
  console.log(`❌ Errors: ${errors}`);
  console.log(`📚 Total: ${files.length}`);
  
  // Show all metadata
  const { data: allMetadata, count } = await supabase
    .from('manual_metadata')
    .select('*', { count: 'exact' })
    .order('category', { ascending: true })
    .order('title', { ascending: true });
  
  if (allMetadata) {
    console.log(`\n📚 Total manual metadata entries: ${count}`);
    
    // Group by category
    const byCategory = {};
    allMetadata.forEach(m => {
      if (!byCategory[m.category]) {
        byCategory[m.category] = [];
      }
      byCategory[m.category].push(m.title);
    });
    
    console.log('\n📂 Manuals by category:');
    Object.entries(byCategory).forEach(([category, titles]) => {
      console.log(`\n${category.toUpperCase()} (${titles.length}):`);
      titles.forEach(title => console.log(`  - ${title}`));
    });
  }
  
  rl.close();
}

main().catch(error => {
  console.error(error);
  rl.close();
});