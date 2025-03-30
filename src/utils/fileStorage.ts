
import { supabase } from "@/integrations/supabase/client";

/**
 * Attempts to delete a file from Supabase storage by parsing its URL
 * @param fileUrl The complete URL of the file to delete
 * @returns An object indicating success or error
 */
export async function deleteFileFromStorage(fileUrl: string): Promise<{ success: boolean; error?: any }> {
  if (!fileUrl) {
    console.warn("Empty file URL provided to deleteFileFromStorage");
    return { success: false, error: "Empty file URL" };
  }
  
  try {
    // Extract the bucket name and path from the URL
    let storageUrl;
    try {
      storageUrl = new URL(fileUrl);
    } catch (err) {
      console.error("Invalid URL format:", fileUrl);
      return { success: false, error: "Invalid URL format" };
    }
    
    const pathParts = storageUrl.pathname.split('/');
    
    // Find "public" in the path and get the bucket name and file path
    const publicIndex = pathParts.indexOf('public');
    if (publicIndex === -1 || publicIndex + 2 > pathParts.length) {
      console.error("Invalid storage URL format:", fileUrl);
      return { success: false, error: "Invalid storage URL format" };
    }
    
    const bucketName = pathParts[publicIndex + 1];
    const filePath = pathParts.slice(publicIndex + 2).join('/');
    
    if (!bucketName || !filePath) {
      console.error("Failed to extract bucket name or file path from URL:", fileUrl);
      return { success: false, error: "Failed to extract bucket or file path" };
    }
    
    console.log(`Deleting file from bucket: ${bucketName}, path: ${filePath}`);
    
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);
      
    if (error) {
      // Some storage errors are non-critical (like file already deleted)
      // Log the error but don't necessarily fail the operation
      console.error(`Error deleting file from ${bucketName}/${filePath}:`, error);
      
      // Check if the error indicates the file doesn't exist
      if (error.message && error.message.includes('not found')) {
        console.warn("File already deleted or doesn't exist");
        // Consider this a success as the end result is what we want (file not in storage)
        return { success: true, error: { type: 'not_found', message: error.message } };
      }
      
      return { success: false, error };
    }
    
    console.log(`File deleted successfully from ${bucketName}/${filePath}`);
    return { success: true };
  } catch (error) {
    console.error("Error processing file URL:", error);
    return { success: false, error };
  }
}
