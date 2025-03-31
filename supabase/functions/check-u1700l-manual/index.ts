
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

    // Initialize Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if the UHB-Unimog-Cargo.pdf exists in the manuals bucket
    const { data: existingFiles, error: listError } = await supabase
      .storage
      .from('manuals')
      .list();

    if (listError) {
      throw new Error(`Error listing files: ${listError.message}`);
    }

    // Check if the manual exists
    const manualExists = existingFiles.some(file => 
      file.name === 'UHB-Unimog-Cargo.pdf' || 
      file.name.includes('UHB-Unimog-Cargo')
    );

    console.log(`U1700L manual exists: ${manualExists}`);

    // If manual doesn't exist, we should ensure the manuals bucket exists
    if (!manualExists) {
      const { data: buckets, error: bucketsError } = await supabase
        .storage
        .listBuckets();
        
      if (bucketsError) {
        throw new Error(`Error listing buckets: ${bucketsError.message}`);
      }
      
      const manualsBucketExists = buckets.some(bucket => bucket.name === 'manuals');
      
      if (!manualsBucketExists) {
        // Create the manuals bucket if it doesn't exist
        const { error: createBucketError } = await supabase
          .storage
          .createBucket('manuals', { public: false });
          
        if (createBucketError) {
          throw new Error(`Error creating manuals bucket: ${createBucketError.message}`);
        }
        
        console.log('Created manuals bucket');
      }
      
      console.log('Manual not found - Admin needs to upload it');
    }

    return new Response(
      JSON.stringify({ 
        manualExists,
        manualName: 'UHB-Unimog-Cargo.pdf'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error('Error in check-u1700l-manual function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Unknown error occurred',
        success: false
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
