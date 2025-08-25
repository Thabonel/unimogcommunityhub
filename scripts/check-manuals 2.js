// Check what manuals are in storage
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing required environment variables:');
  console.error('- VITE_SUPABASE_URL:', !!supabaseUrl);
  console.error('- VITE_SUPABASE_ANON_KEY:', !!supabaseAnonKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkManuals() {
  try {
    console.log('🔍 Checking manuals bucket...');
    
    // List files in manuals bucket
    const { data: files, error } = await supabase.storage
      .from('manuals')
      .list();

    if (error) {
      console.error('❌ Error:', error);
      return;
    }

    console.log(`📚 Found ${files?.length || 0} files:`);
    
    if (files && files.length > 0) {
      files.forEach((file, index) => {
        console.log(`  ${index + 1}. ${file.name} (${Math.round((file.metadata?.size || 0) / 1024)} KB)`);
      });
      
      // Check which are already processed
      const { data: processed, error: procError } = await supabase
        .from('manual_metadata')
        .select('filename, title, processed_at, page_count')
        .order('created_at', { ascending: false });

      if (procError) {
        console.warn('⚠️  Could not check processed files:', procError);
      } else {
        console.log(`\n✅ Already processed: ${processed?.length || 0} files`);
        if (processed && processed.length > 0) {
          processed.forEach(p => {
            console.log(`  • ${p.filename} - ${p.title} (${p.page_count} pages) ${p.processed_at ? '✓' : '⏳'}`);
          });
        }
      }
    } else {
      console.log('📄 No files found in manuals bucket');
    }

  } catch (error) {
    console.error('💥 Error:', error);
  }
}

checkManuals();