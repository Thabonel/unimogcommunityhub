
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
        sortBy: { column: 'created_at', order: 'asc' }
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
 * Get a public URL for a manual (bucket is public, no signing needed)
 */
export const getManualPublicUrl = (fileName: string): string => {
  console.log("Getting public URL for manual:", fileName);

  // Use getPublicUrl for public bucket - handles all encoding automatically
  const { data } = supabase
    .storage
    .from('manuals')
    .getPublicUrl(fileName);

  console.log("Generated public URL:", data.publicUrl);
  return data.publicUrl;
};
