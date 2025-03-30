
import { supabase } from "@/integrations/supabase/client";

/**
 * Attempts to delete a file from Supabase storage by parsing its URL
 * @param fileUrl The complete URL of the file to delete
 * @returns An object indicating success or error
 */
export async function deleteFileFromStorage(fileUrl: string): Promise<{ success: boolean; error?: any }> {
  try {
    // Extract the bucket name and path from the URL
    const storageUrl = new URL(fileUrl);
    const pathParts = storageUrl.pathname.split('/');
    
    // Find "public" in the path and get the bucket name and file path
    const publicIndex = pathParts.indexOf('public');
    if (publicIndex === -1 || publicIndex + 2 > pathParts.length) {
      console.error("Invalid storage URL format:", fileUrl);
      return { success: false, error: "Invalid storage URL format" };
    }
    
    const bucketName = pathParts[publicIndex + 1];
    const filePath = pathParts.slice(publicIndex + 2).join('/');
    
    console.log(`Deleting file from bucket: ${bucketName}, path: ${filePath}`);
    
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);
      
    if (error) {
      console.error(`Error deleting file from ${bucketName}/${filePath}:`, error);
      return { success: false, error };
    }
    
    console.log(`File deleted successfully from ${bucketName}/${filePath}`);
    return { success: true };
  } catch (error) {
    console.error("Error processing file URL:", error);
    return { success: false, error };
  }
}
