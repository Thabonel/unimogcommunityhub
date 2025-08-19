import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ydevatqwkoccxhtejdor.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkZXZhdHF3a29jY3hodGVqZG9yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzIyMDE2MSwiZXhwIjoyMDU4Nzk2MTYxfQ.qUYRgNaX0s8UIjaaZm0RyjBhNyG5oxDY3Oc8wDz-nu8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  // Check for pending_manual_uploads table
  const { data: pendingUploads, error: pendingError } = await supabase
    .from('pending_manual_uploads')
    .select('*')
    .limit(3);
  
  console.log('Pending Manual Uploads table exists:', !pendingError);
  if (pendingError) {
    console.log('Error:', pendingError.message);
  } else {
    console.log('Sample pending uploads:', pendingUploads?.length || 0);
  }
  
  // Check storage buckets
  const { data: buckets } = await supabase.storage.listBuckets();
  console.log('\nStorage buckets:', buckets?.map(b => b.name).join(', '));
  
  // Check for pending-manuals bucket
  const hasPendingBucket = buckets?.some(b => b.name === 'pending-manuals');
  console.log('Has pending-manuals bucket:', hasPendingBucket);
  
  // Check for manuals bucket  
  const hasManualsBucket = buckets?.some(b => b.name === 'manuals');
  console.log('Has manuals bucket:', hasManualsBucket);
}

checkTables().catch(console.error);
