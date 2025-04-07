
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
      console.error('Missing environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
      throw new Error('Missing environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    }

    console.log('Initializing Supabase client with service role key');
    // Initialize Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // First check if the manuals bucket exists
    console.log('Checking if manuals bucket exists...');
    let manualsBucketExists = false;
    let bucketError = null;
    let bucketData = null;
    
    try {
      const { data: bucket, error: bucketCheckError } = await supabase
        .storage
        .getBucket('manuals');
        
      if (bucketCheckError) {
        console.error('Error getting manuals bucket:', bucketCheckError.message);
        bucketError = bucketCheckError.message;
      } else {
        console.log('Manuals bucket exists:', bucket);
        bucketData = bucket;
        manualsBucketExists = true;
      }
    } catch (bucketCheckError) {
      console.error('Exception checking manuals bucket:', bucketCheckError);
      bucketError = bucketCheckError.toString();
    }
    
    // Create the bucket if it doesn't exist
    let createBucketError = null;
    let createBucketData = null;
    if (!manualsBucketExists) {
      console.log('Creating manuals bucket...');
      try {
        const { data: createdBucket, error: createError } = await supabase
          .storage
          .createBucket('manuals', { 
            public: false,
            fileSizeLimit: 52428800 // 50MB
          });
          
        if (createError) {
          console.error('Error creating manuals bucket:', createError.message);
          createBucketError = createError.message;
        } else {
          console.log('Created manuals bucket successfully');
          createBucketData = createdBucket;
          manualsBucketExists = true;
        }
      } catch (createError) {
        console.error('Exception creating bucket:', createError);
        createBucketError = createError.toString();
      }
    }

    // Only proceed with file check if the bucket exists
    let manualExists = false;
    let filesList: any[] = [];
    let listError = null;
    let listData = null;
    
    if (manualsBucketExists) {
      // Check if the UHB-Unimog-Cargo.pdf exists in the manuals bucket
      try {
        console.log('Checking for manuals in the bucket...');
        const { data: existingFiles, error: filesError } = await supabase
          .storage
          .from('manuals')
          .list();

        if (filesError) {
          console.error('Error listing files:', filesError.message);
          listError = filesError.message;
        } else {
          filesList = existingFiles || [];
          listData = existingFiles;
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
      } catch (error) {
        console.error('Exception listing files:', error);
        listError = error.toString();
      }
    }

    // Try to upload a placeholder manual if it doesn't exist
    let uploadAttempted = false;
    let uploadError = null;
    let uploadSuccess = false;
    
    if (manualsBucketExists && !manualExists) {
      console.log('Manual not found, attempting to create a placeholder...');
      uploadAttempted = true;
      
      try {
        // Create a simple placeholder PDF file (in a real app, you'd have a real PDF)
        const placeholderPdf = new Uint8Array([37, 80, 68, 70, 45, 49, 46, 51, 10, 37, 226, 227, 207, 211, 10]); // %PDF-1.3 header
        
        const { data: uploadData, error: uploadErr } = await supabase
          .storage
          .from('manuals')
          .upload('UHB-Unimog-Cargo.pdf', placeholderPdf, {
            contentType: 'application/pdf',
            upsert: true
          });
          
        if (uploadErr) {
          console.error('Error uploading placeholder manual:', uploadErr);
          uploadError = uploadErr.message;
        } else {
          console.log('Successfully uploaded placeholder manual');
          uploadSuccess = true;
        }
      } catch (err) {
        console.error('Exception uploading placeholder manual:', err);
        uploadError = err.toString();
      }
    }

    return new Response(
      JSON.stringify({ 
        manualExists,
        manualName: 'UHB-Unimog-Cargo.pdf',
        bucketExists: manualsBucketExists,
        filesInBucket: filesList.length,
        files: filesList.map(f => f.name),
        bucketData,
        createBucketData,
        listData,
        uploadAttempted,
        uploadSuccess,
        supabaseUrl,
        errors: {
          bucket: bucketError,
          createBucket: createBucketError,
          listFiles: listError,
          upload: uploadError
        }
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
        success: false,
        stack: error.stack
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
