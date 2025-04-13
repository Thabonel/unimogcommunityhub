
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
    
    // Check if the bucket exists by attempting to list files
    const { data: listData, error: listError } = await supabase.storage
      .from('manuals')
      .list();
      
    if (listError) {
      console.error("Error listing manuals bucket:", listError);
      // If we can't list, the bucket might not exist or we don't have access
      
      console.log("Attempting to get bucket info...");
      const { data: bucketData, error: bucketError } = await supabase.storage.getBucket('manuals');
      
      if (bucketError) {
        console.error("Manuals bucket doesn't exist or can't be accessed:", bucketError);
        
        // We can't create the bucket from the client due to RLS restrictions
        // Instead, we'll return an error
        return { 
          success: false, 
          error: "The manuals storage bucket does not exist or cannot be accessed. Please contact an administrator to set up the bucket." 
        };
      }
      
      // Bucket exists but we couldn't list - might be a permissions issue
      return { 
        success: false,
        error: "The manuals bucket exists but we don't have permission to list its contents."
      };
    }
    
    console.log("Successfully verified manuals bucket! Files found:", listData?.length || 0);
    return { success: true };
  } catch (error) {
    console.error("Error verifying manuals bucket:", error);
    return { success: false, error: error.message };
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
