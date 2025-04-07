
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

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    }

    console.log('Initializing Supabase client with service role key');
    // Initialize Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // First check if the manuals bucket exists
    console.log('Checking if manuals bucket exists...');
    let manualsBucketExists = false;
    
    try {
      const { data: bucket, error: bucketError } = await supabase
        .storage
        .getBucket('manuals');
        
      if (bucketError) {
        console.log('Error getting manuals bucket:', bucketError.message);
        // Bucket doesn't exist, we'll create it
      } else {
        console.log('Manuals bucket exists:', bucket);
        manualsBucketExists = true;
      }
    } catch (bucketCheckError) {
      console.error('Error checking manuals bucket:', bucketCheckError);
      // Continue to creation attempt
    }
    
    // Create the bucket if it doesn't exist
    if (!manualsBucketExists) {
      console.log('Creating manuals bucket...');
      try {
        const { error: createBucketError } = await supabase
          .storage
          .createBucket('manuals', { 
            public: false,
            fileSizeLimit: 52428800 // 50MB
          });
          
        if (createBucketError) {
          console.error('Error creating manuals bucket:', createBucketError.message);
        } else {
          console.log('Created manuals bucket successfully');
          manualsBucketExists = true;
        }
      } catch (createError) {
        console.error('Exception creating bucket:', createError);
      }
    }

    // Only proceed with file check if the bucket exists
    let manualExists = false;
    let filesList: any[] = [];
    
    if (manualsBucketExists) {
      // Check if the UHB-Unimog-Cargo.pdf exists in the manuals bucket
      try {
        console.log('Checking for manuals in the bucket...');
        const { data: existingFiles, error: listError } = await supabase
          .storage
          .from('manuals')
          .list();

        if (listError) {
          console.error('Error listing files:', listError.message);
        } else {
          filesList = existingFiles || [];
          console.log(`Found ${filesList.length} files in manuals bucket`);
          
          // Check if the manual exists
          manualExists = filesList.some(file => 
            file.name === 'UHB-Unimog-Cargo.pdf' || 
            file.name.includes('UHB-Unimog-Cargo')
          );
          
          console.log('U1700L manual exists:', manualExists);
          if (filesList.length > 0) {
            console.log('Files in bucket:', filesList.map(f => f.name).join(', '));
          }
        }
      } catch (listError) {
        console.error('Exception listing files:', listError);
      }
    }

    return new Response(
      JSON.stringify({ 
        manualExists,
        manualName: 'UHB-Unimog-Cargo.pdf',
        bucketExists: manualsBucketExists,
        filesInBucket: filesList.length,
        files: filesList.map(f => f.name)
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
