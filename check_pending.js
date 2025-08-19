import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ydevatqwkoccxhtejdor.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkZXZhdHF3a29jY3hodGVqZG9yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzIyMDE2MSwiZXhwIjoyMDU4Nzk2MTYxfQ.qUYRgNaX0s8UIjaaZm0RyjBhNyG5oxDY3Oc8wDz-nu8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPending() {
  const { data, error } = await supabase
    .from('pending_manual_uploads')
    .select('*')
    .eq('approval_status', 'pending');
  
  console.log('Pending uploads:', data?.length || 0);
  if (data && data.length > 0) {
    console.log('\nDetails:');
    data.forEach(upload => {
      console.log(`- Title: ${upload.title}`);
      console.log(`  Filename: ${upload.filename}`);
      console.log(`  Status: ${upload.approval_status}`);
      console.log(`  Category: ${upload.category}`);
      console.log(`  Uploaded: ${upload.created_at}`);
    });
  }
}

checkPending().catch(console.error);
