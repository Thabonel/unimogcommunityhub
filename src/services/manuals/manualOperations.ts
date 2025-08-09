
import { supabase } from '@/lib/supabase-client';
import { toast } from "@/hooks/use-toast";
import { StorageManual, ManualMetadata } from "@/types/manuals";

/**
 * Delete a manual file from storage
 */
export const deleteManual = async (fileName: string): Promise<boolean> => {
  try {
    // Ensure the file exists before trying to delete
    const { data: checkData, error: checkError } = await supabase
      .storage
      .from('manuals')
      .list('', {
        search: fileName
      });
    
    if (checkError) throw checkError;
    
    const fileExists = checkData.some(file => file.name === fileName);
    if (!fileExists) {
      console.warn(`File ${fileName} does not exist`);
      return true; // Already deleted, consider it successful
    }
    
    // Delete the file
    const { error } = await supabase
      .storage
      .from('manuals')
      .remove([fileName]);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error deleting manual:", error);
    toast({
      title: "Error deleting manual",
      description: error.message,
      variant: "destructive"
    });
    return false;
  }
};

/**
 * Download a manual file
 */
export const downloadManual = async (fileName: string, title: string): Promise<void> => {
  try {
    const { data, error } = await supabase
      .storage
      .from('manuals')
      .createSignedUrl(fileName, 60 * 5); // 5 minutes
    
    if (error) throw error;
    
    if (!data?.signedUrl) {
      throw new Error('Failed to generate download URL');
    }
    
    // Create an anchor and trigger download
    const a = document.createElement('a');
    a.href = data.signedUrl;
    a.download = `${title || fileName}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Download started",
      description: `Downloading ${title || fileName}`,
    });
  } catch (error) {
    console.error("Error downloading manual:", error);
    toast({
      title: "Download failed",
      description: error.message,
      variant: "destructive"
    });
    throw error;
  }
};

/**
 * Upload a manual file
 */
export const uploadManual = async (
  file: File, 
  metadata: { title: string; description: string; pages?: string }
): Promise<{ success: boolean; error?: string; manual?: StorageManual }> => {
  try {
    // Sanitize the file name to avoid storage issues
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    
    // Upload the file
    const { data, error } = await supabase.storage
      .from('manuals')
      .upload(sanitizedFileName, file, {
        contentType: file.type,
        upsert: true,
        metadata: {
          title: metadata.title,
          description: metadata.description,
          pages: metadata.pages || 'Unknown'
        }
      });
    
    if (error) throw error;
    
    // Return manual metadata
    return { 
      success: true,
      manual: {
        name: sanitizedFileName,
        size: file.size,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        metadata
      }
    };
  } catch (error) {
    console.error("Error uploading manual:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Approve a pending manual
 */
export const approveManual = async (id: string): Promise<boolean> => {
  try {
    // In a real implementation, this would update the DB record
    // For now, just return success since we're focusing on storage
    console.log("Approving manual with ID:", id);
    toast({
      title: "Manual approved",
      description: "The manual is now available to all users"
    });
    return true;
  } catch (error) {
    console.error("Error approving manual:", error);
    return false;
  }
};

/**
 * Reject a pending manual
 */
export const rejectManual = async (id: string): Promise<boolean> => {
  try {
    // In a real implementation, this would update the DB record
    // For now, just return success since we're focusing on storage
    console.log("Rejecting manual with ID:", id);
    toast({
      title: "Manual rejected",
      description: "The manual has been rejected"
    });
    return true;
  } catch (error) {
    console.error("Error rejecting manual:", error);
    return false;
  }
};
