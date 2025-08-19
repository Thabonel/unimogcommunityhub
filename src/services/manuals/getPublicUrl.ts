import { supabase } from '@/lib/supabase-client';

/**
 * Get a public URL for a manual (alternative to signed URL)
 * This requires the manuals bucket to be public or have appropriate RLS policies
 */
export const getManualPublicUrl = (fileName: string): string => {
  try {
    console.log("Getting public URL for manual:", fileName);
    
    const { data } = supabase
      .storage
      .from('manuals')
      .getPublicUrl(fileName);
    
    if (!data?.publicUrl) {
      throw new Error("No public URL returned");
    }
    
    console.log("Generated public URL:", data.publicUrl);
    return data.publicUrl;
  } catch (error) {
    console.error("Error getting public URL for", fileName, ":", error);
    throw error;
  }
};

/**
 * Try to get a working URL for the manual, with fallback options
 */
export const getManualUrl = async (fileName: string): Promise<string> => {
  try {
    // First try signed URL (more secure but can have CORS issues)
    console.log("Attempting to get signed URL for:", fileName);
    
    const { data, error } = await supabase
      .storage
      .from('manuals')
      .createSignedUrl(fileName, 60 * 60); // 1 hour expiry
    
    if (!error && data?.signedUrl) {
      console.log("Successfully got signed URL");
      return data.signedUrl;
    }
    
    // If signed URL fails, try public URL as fallback
    console.log("Signed URL failed, trying public URL as fallback");
    const publicUrl = getManualPublicUrl(fileName);
    
    if (publicUrl) {
      return publicUrl;
    }
    
    throw new Error("Could not generate URL for manual");
  } catch (error) {
    console.error("Error getting manual URL:", error);
    throw error;
  }
};