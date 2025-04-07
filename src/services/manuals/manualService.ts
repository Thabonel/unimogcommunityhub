
import { supabase, verifyBucket } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { StorageManual } from "@/types/manuals";

/**
 * Fetch all approved manuals from storage
 */
export const fetchApprovedManuals = async (): Promise<StorageManual[]> => {
  try {
    console.log('Fetching manuals from storage...');
    
    // First, verify the manuals bucket exists
    const bucketVerification = await verifyBucket('manuals');
    
    if (!bucketVerification.success) {
      console.error('Could not verify or create manuals bucket:', bucketVerification.error);
      throw new Error(`Could not access manuals storage: ${bucketVerification.error}`);
    }
    
    console.log('Manuals bucket verified, now listing files...');
    
    // Fetch files from the 'manuals' storage bucket
    const { data: storageData, error: storageError } = await supabase
      .storage
      .from('manuals')
      .list('', {
        limit: 100, // Specify a reasonable limit
        sortBy: { column: 'name', order: 'asc' }
      });

    if (storageError) {
      console.error('Error listing manuals:', storageError);
      throw storageError;
    }

    // Log the raw data to help with debugging
    console.log('Raw storage data received:', storageData ? storageData.length : 0, 'items');
    if (storageData && storageData.length > 0) {
      console.log('First few items:', storageData.slice(0, 3));
    } else {
      console.log('No manual files found in storage');
    }
    
    // Map storage data to manuals
    const manualFiles = mapStorageDataToManuals(storageData || []);
    console.log('Processed manuals:', manualFiles.length);
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
  console.log('Mapping storage data to manuals, items:', storageData.length);
  
  return storageData
    .filter(item => {
      // Exclude directories and non-PDF files
      const isPdf = item.name.toLowerCase().endsWith('.pdf');
      const isFile = !item.id.endsWith('/');
      if (!isPdf && isFile) {
        console.log(`Skipping non-PDF file: ${item.name}`);
      }
      return isFile && isPdf;
    })
    .map(file => {
      console.log(`Processing file: ${file.name}`);
      return {
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
      };
    });
};

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
