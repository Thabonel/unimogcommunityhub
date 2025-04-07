
import { supabase, verifyBucket } from "@/lib/supabase";
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
