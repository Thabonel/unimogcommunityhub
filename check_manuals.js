import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ydevatqwkoccxhtejdor.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkZXZhdHF3a29jY3hodGVqZG9yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzIyMDE2MSwiZXhwIjoyMDU4Nzk2MTYxfQ.qUYRgNaX0s8UIjaaZm0RyjBhNyG5oxDY3Oc8wDz-nu8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkManuals() {
  // Check manual_chunks table
  const { data: chunks, error: chunksError, count } = await supabase
    .from('manual_chunks')
    .select('*', { count: 'exact', head: false })
    .limit(5);
  
  console.log('Manual chunks count:', count);
  
  if (chunks && chunks.length > 0) {
    console.log('Sample chunks:');
    chunks.forEach(chunk => {
      console.log(`- ID: ${chunk.id}, Manual: ${chunk.manual_name || 'Unknown'}`);
    });
  }
  
  // Check manuals in storage
  const { data: files, error: storageError } = await supabase
    .storage
    .from('manuals')
    .list('', { limit: 10 });
  
  console.log('\nManuals in storage:', files?.length || 0);
  if (files && files.length > 0) {
    console.log('Sample files:');
    files.forEach(file => {
      console.log(`- ${file.name}`);
    });
  }
}

checkManuals().catch(console.error);