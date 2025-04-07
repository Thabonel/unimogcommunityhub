
import { supabase, verifyBucket } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { StorageManual } from "@/types/manuals";

/**
 * Delete a manual from storage
 */
export const deleteManual = async (manualName: string): Promise<void> => {
  try {
    console.log(`Attempting to delete manual: ${manualName}`);
    
    // Delete the file from storage
    const { error: deleteError } = await supabase
      .storage
      .from('manuals')
      .remove([manualName]);
    
    if (deleteError) {
      console.error('Error deleting manual file:', deleteError);
      throw deleteError;
    }
    
    console.log(`Successfully deleted manual: ${manualName}`);
    
    // Also delete any database record if it exists
    try {
      const { error: dbDeleteError } = await supabase
        .from('manuals')
        .delete()
        .eq('file_path', manualName);
      
      if (dbDeleteError) {
        console.error('Error deleting manual record:', dbDeleteError);
        // Continue anyway since the file is deleted
      }
    } catch (dbError) {
      // Log but don't fail if DB record deletion fails
      console.error('Error with database record deletion:', dbError);
    }
  } catch (error) {
    console.error('Error deleting manual:', error);
    throw error;
  }
};

/**
 * Get a signed URL for viewing a PDF
 */
export const getManualSignedUrl = async (fileName: string): Promise<string> => {
  try {
    console.log('Getting signed URL for:', fileName);
    
    // Verify the bucket exists first
    const bucketVerification = await verifyBucket('manuals');
    if (!bucketVerification.success) {
      throw new Error(`Could not access the manuals storage: ${bucketVerification.error}`);
    }
    
    // Get a signed URL for the file
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from('manuals')
      .createSignedUrl(fileName, 60 * 60); // 1 hour expiry
    
    if (signedUrlError) {
      console.error('Error getting signed URL:', signedUrlError);
      throw signedUrlError;
    }
    
    if (!signedUrlData?.signedUrl) {
      throw new Error("Failed to get signed URL");
    }
    
    console.log('Signed URL created successfully');
    return signedUrlData.signedUrl;
  } catch (error) {
    console.error('Error getting signed URL:', error);
    throw error;
  }
};

/**
 * Download a manual file
 */
export const downloadManual = async (fileName: string, title: string): Promise<void> => {
  try {
    console.log(`Downloading manual: ${fileName}`);
    
    // Verify the bucket exists first
    const bucketVerification = await verifyBucket('manuals');
    if (!bucketVerification.success) {
      throw new Error(`Could not access the manuals storage: ${bucketVerification.error}`);
    }
    
    // Get the file from storage
    const { data, error } = await supabase.storage
      .from('manuals')
      .download(fileName);
    
    if (error) {
      console.error('Error downloading manual:', error);
      throw error;
    }
    
    // Create a download link
    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = title + '.pdf';
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    toast({
      title: 'Download started',
      description: `Downloading ${title}`,
    });
  } catch (error) {
    console.error('Error downloading manual:', error);
    throw error;
  }
};
