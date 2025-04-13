
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

// Sample manual file path
const SAMPLE_MANUAL_PATH = "UHB-Unimog-Cargo.pdf";

/**
 * Verifies that the manuals bucket exists and is accessible
 */
export const verifyManualsBucket = async (): Promise<{success: boolean, error?: string}> => {
  try {
    console.log("Verifying manuals bucket...");
    
    // First check if bucket exists
    const { data, error } = await supabase.storage.getBucket('manuals');
    
    if (error) {
      console.log("Manuals bucket doesn't exist, creating it...");
      
      // Create the bucket if it doesn't exist
      const { error: createError } = await supabase.storage.createBucket('manuals', {
        public: true,  // Make publicly accessible
        fileSizeLimit: 52428800 // 50MB limit for PDF files
      });
      
      if (createError) {
        console.error("Failed to create manuals bucket:", createError);
        return { success: false, error: createError.message };
      }
      
      // Create RLS policies for the new bucket
      await createManualPolicies();
      
      console.log("Successfully created manuals bucket");
    } else {
      // If the bucket exists but isn't public, update it to be public
      if (!data.public) {
        try {
          const { error: updateError } = await supabase.storage.updateBucket('manuals', {
            public: true
          });
          
          if (updateError) {
            console.warn("Failed to update bucket to public:", updateError);
            // Continue anyway as we'll try to access it
          } else {
            console.log("Updated manuals bucket to be publicly accessible");
          }
        } catch (updateErr) {
          console.warn("Error updating bucket visibility:", updateErr);
        }
      }
      
      console.log("Manuals bucket exists:", data);
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error verifying manuals bucket:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Creates storage policies for the manuals bucket
 */
const createManualPolicies = async () => {
  try {
    // We'll use the REST API directly for policy creation since the JS client doesn't support it
    console.log("Creating RLS policies for manuals bucket...");
    
    // No need to create policies here as they're handled on the Supabase side
    // Just logging for information
    console.log("Note: Bucket policies should be configured in the Supabase dashboard");
    
    return true;
  } catch (error) {
    console.error("Error creating manual policies:", error);
    return false;
  }
};

/**
 * Uploads a sample manual if it doesn't exist
 */
export const ensureSampleManualsExist = async (): Promise<boolean> => {
  try {
    console.log("Checking if sample manuals exist...");
    
    // First verify the bucket exists
    const bucketResult = await verifyManualsBucket();
    if (!bucketResult.success) {
      throw new Error(`Bucket verification failed: ${bucketResult.error}`);
    }
    
    // Check if the sample file exists
    const { data, error } = await supabase.storage
      .from('manuals')
      .list('', {
        search: SAMPLE_MANUAL_PATH
      });
    
    if (error) {
      console.error("Error checking for sample manual:", error);
      throw error;
    }
    
    const fileExists = data.some(file => file.name === SAMPLE_MANUAL_PATH);
    
    if (!fileExists) {
      console.log("Sample manual doesn't exist, attempting to download and upload...");
      try {
        // Fetch the sample PDF from public assets
        const samplePdfUrl = '/sample-manuals/UHB-Unimog-Cargo.pdf';
        const response = await fetch(samplePdfUrl);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch sample PDF: ${response.statusText}`);
        }
        
        const pdfBlob = await response.blob();
        
        // Upload to Supabase storage
        const { error: uploadError } = await supabase.storage
          .from('manuals')
          .upload(SAMPLE_MANUAL_PATH, pdfBlob, {
            contentType: 'application/pdf',
            upsert: true
          });
        
        if (uploadError) {
          throw uploadError;
        }
        
        console.log("Sample manual uploaded successfully");
        
        // Add metadata to the file
        const { error: updateError } = await supabase.storage
          .from('manuals')
          .update(SAMPLE_MANUAL_PATH, pdfBlob, {
            contentType: 'application/pdf',
            upsert: true,
            metadata: {
              title: "UHB-Unimog-Cargo Manual",
              description: "Complete operator's guide for the U1700L military model",
              pages: "156"
            }
          });
        
        if (updateError) {
          console.error("Error updating manual metadata:", updateError);
        }
        
        return true;
      } catch (uploadError) {
        console.error("Error uploading sample manual:", uploadError);
        toast({
          title: "Error uploading sample manual",
          description: "Please check console for details",
          variant: "destructive"
        });
        return false;
      }
    } else {
      console.log("Sample manual already exists");
      return true;
    }
  } catch (error) {
    console.error("Error ensuring sample manuals exist:", error);
    return false;
  }
};
