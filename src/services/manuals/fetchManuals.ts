
import { supabase } from '@/lib/supabase-client';
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
    
    console.log("Fetched manual files:", data?.length || 0, data);
    
    if (!data || data.length === 0) {
      console.log("No manuals found in storage");
      return [];
    }
    
    // Filter out folders and process only files
    const manualFiles = data.filter(item => !item.id.endsWith('/') && item.name !== '.emptyFolderPlaceholder');
    
    console.log("Filtered manual files:", manualFiles.length);
    
    // Transform storage objects to StorageManual type
    return manualFiles.map(item => ({
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
    console.log("Getting signed URL for manual:", fileName);
    
    // Verify bucket first
    const bucketVerification = await verifyManualsBucket();
    console.log("Bucket verification result:", bucketVerification);
    
    // Create signed URL with longer expiry
    const { data, error } = await supabase
      .storage
      .from('manuals')
      .createSignedUrl(fileName, 60 * 60); // 60 minutes for better stability
    
    if (error) {
      console.error("Supabase error creating signed URL:", error);
      throw error;
    }
    
    if (!data?.signedUrl) {
      console.error("No signed URL returned from Supabase");
      throw new Error("No signed URL returned");
    }
    
    console.log("Generated signed URL:", data.signedUrl);
    return data.signedUrl;
  } catch (error) {
    console.error("Error getting signed URL for", fileName, ":", error);
    throw error;
  }
};
