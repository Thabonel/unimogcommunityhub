
import { supabase } from "@/lib/supabase";
import { StorageManual } from "@/types/manuals";
import { verifyManualsBucket } from "./manualService";

/**
 * Fetch all approved manuals from storage
 */
export const fetchApprovedManuals = async (): Promise<StorageManual[]> => {
  try {
    console.log("Fetching manuals from storage...");
    
    // First, ensure the bucket exists and is accessible
    const { success, error: bucketError } = await verifyManualsBucket();
    if (!success) {
      console.error("Failed to verify manuals bucket:", bucketError);
      throw new Error(`Bucket verification failed: ${bucketError}`);
    }
    
    // List all files in the manuals bucket
    const { data, error } = await supabase
      .storage
      .from('manuals')
      .list('', {
        sortBy: { column: 'name', order: 'asc' }
      });
    
    if (error) {
      console.error("Error fetching manuals:", error);
      throw error;
    }
    
    console.log("Fetched manuals:", data);
    
    if (!data || data.length === 0) {
      console.log("No manuals found in storage");
      return [];
    }
    
    // Transform storage objects to StorageManual type
    return data.map(item => ({
      name: item.name,
      size: item.metadata?.size || 0,
      created_at: item.created_at || new Date().toISOString(),
      updated_at: item.updated_at || item.created_at || new Date().toISOString(),
      metadata: {
        title: item.metadata?.title || item.name,
        description: item.metadata?.description || "Unimog Technical Manual",
        pages: item.metadata?.pages || "Unknown"
      }
    }));
  } catch (error) {
    console.error("Error in fetchApprovedManuals:", error);
    return [];
  }
};

/**
 * Get a signed URL for a manual
 */
export const getManualSignedUrl = async (fileName: string): Promise<string> => {
  try {
    // Verify bucket first
    await verifyManualsBucket();
    
    const { data, error } = await supabase
      .storage
      .from('manuals')
      .createSignedUrl(fileName, 60 * 15); // 15 minutes
    
    if (error) throw error;
    if (!data?.signedUrl) throw new Error("No signed URL returned");
    
    return data.signedUrl;
  } catch (error) {
    console.error("Error getting signed URL:", error);
    throw error;
  }
};
