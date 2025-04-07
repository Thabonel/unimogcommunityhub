
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { StorageManual } from "@/types/manuals";

/**
 * Fetch all approved manuals from storage
 */
export const fetchApprovedManuals = async (): Promise<StorageManual[]> => {
  try {
    console.log('Fetching manuals from storage...');
    
    // First, check if the bucket exists
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();
      
    if (bucketsError) {
      console.error('Error listing buckets:', bucketsError);
      throw bucketsError;
    }
    
    const manualsBucketExists = buckets.some(bucket => bucket.name === 'manuals');
    console.log('Manuals bucket exists:', manualsBucketExists);
    
    if (!manualsBucketExists) {
      console.log('Attempting to create manuals bucket...');
      try {
        const { error: createError } = await supabase.storage.createBucket('manuals', { public: false });
        if (createError) throw createError;
        console.log('Successfully created manuals bucket');
      } catch (createError) {
        console.error('Failed to create manuals bucket:', createError);
        throw new Error('Failed to create manuals storage bucket. Please try again later.');
      }
    }
    
    // Fetch files from the 'manuals' storage bucket
    const { data: storageData, error: storageError } = await supabase
      .storage
      .from('manuals')
      .list();

    if (storageError) {
      console.error('Error listing manuals:', storageError);
      
      if (storageError.message.includes('The resource was not found')) {
        // Bucket might not exist, try to create it
        try {
          await supabase.storage.createBucket('manuals', { public: false });
          console.log('Created manuals bucket since it was missing');
          
          // Try listing again
          const { data: retryData, error: retryError } = await supabase
            .storage
            .from('manuals')
            .list();
            
          if (retryError) {
            console.error('Error on retry:', retryError);
            throw retryError;
          }
          
          const manualFiles = mapStorageDataToManuals(retryData || []);
          console.log('Successfully fetched manuals on retry:', manualFiles.length);
          return manualFiles;
        } catch (createError) {
          console.error('Failed to create manuals bucket:', createError);
          throw new Error('Failed to access or create manuals storage bucket');
        }
      } else {
        throw storageError;
      }
    }

    // Map storage data to manuals
    const manualFiles = mapStorageDataToManuals(storageData || []);
    console.log('Fetched manuals:', manualFiles.length);
    console.log('Manual data:', storageData);
    return manualFiles;
  } catch (error) {
    console.error('Error fetching manuals:', error);
    throw error;
  }
};

/**
 * Convert storage data to ManualFile objects
 */
const mapStorageDataToManuals = (storageData: any[]): StorageManual[] => {
  return storageData
    .filter(item => !item.id.endsWith('/'))
    .map(file => ({
      id: file.id,
      name: file.name,
      size: file.metadata?.size || 0,
      created_at: file.created_at,
      updated_at: file.updated_at || file.created_at,
      metadata: {
        title: file.metadata?.title || file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
        description: file.metadata?.description || 'Unimog manual',
        pages: file.metadata?.pages || null
      }
    }));
};

/**
 * Delete a manual from storage
 */
export const deleteManual = async (manualName: string): Promise<void> => {
  try {
    // Delete the file from storage
    const { error: deleteError } = await supabase
      .storage
      .from('manuals')
      .remove([manualName]);
    
    if (deleteError) throw deleteError;
    
    // Also delete any database record if it exists
    const { error: dbDeleteError } = await supabase
      .from('manuals')
      .delete()
      .eq('file_path', manualName);
    
    if (dbDeleteError) {
      console.error('Error deleting manual record:', dbDeleteError);
      // Continue anyway since the file is deleted
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
    // Get a signed URL for the file
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from('manuals')
      .createSignedUrl(fileName, 60 * 60); // 1 hour expiry
    
    if (signedUrlError) throw signedUrlError;
    if (!signedUrlData?.signedUrl) throw new Error("Failed to get signed URL");
    
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
    // Get the file from storage
    const { data, error } = await supabase.storage
      .from('manuals')
      .download(fileName);
    
    if (error) throw error;
    
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

/**
 * Approve a pending manual
 * Note: This is a placeholder for future implementation
 */
export const approveManual = async (id: string): Promise<void> => {
  // This would need to be implemented differently for storage
  toast({
    title: "Manual approved",
    description: "The manual is now visible to all users",
  });
};

/**
 * Reject a pending manual
 * Note: This is a placeholder for future implementation
 */
export const rejectManual = async (id: string): Promise<void> => {
  // This would need to be implemented differently for storage
  toast({
    title: "Manual rejected",
    description: "The manual has been rejected",
  });
};
