import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ydevatqwkoccxhtejdor.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '<JWT_TOKEN>';

const supabase = createClient(supabaseUrl, supabaseKey);

async function deployWISMigration() {
  console.log('🚀 Deploying WIS EPC migration to Supabase...');
  
  try {
    // Read the migration file
    const migrationPath = join(__dirname, '..', 'supabase', 'migrations', '20240107_wis_epc_sessions.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf8');
    
    // Split the migration into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';
      console.log(`\n🔄 Executing statement ${i + 1}/${statements.length}...`);
      
      // Skip comments
      if (statement.trim().startsWith('--')) {
        continue;
      }
      
      const { error } = await supabase.rpc('exec_sql', { sql: statement });
      
      if (error) {
        console.error(`❌ Error executing statement ${i + 1}:`, error);
        // Continue with other statements even if one fails
      } else {
        console.log(`✅ Statement ${i + 1} executed successfully`);
      }
    }
    
    console.log('\n🎉 WIS EPC migration deployment complete!');
    
    // Add initial WIS server configuration
    console.log('\n📊 Adding initial WIS server configuration...');
    const { error: serverError } = await supabase
      .from('wis_servers')
      .insert({
        name: 'WIS EPC Development Server',
        host_url: 'localhost:8080',
        guacamole_url: 'http://localhost:8080/guacamole',
        max_concurrent_sessions: 5,
        status: 'maintenance',
        metadata: {
          environment: 'development',
          note: 'Update with actual server details when ready'
        }
      });
    
    if (serverError) {
      console.error('❌ Error adding initial server:', serverError);
    } else {
      console.log('✅ Initial WIS server configuration added');
    }
    
  } catch (error) {
    console.error('❌ Migration deployment failed:', error);
    process.exit(1);
  }
}

// Run the migration
deployWISMigration();