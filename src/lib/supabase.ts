
// Add this function to the existing supabase.ts file

/**
 * Ensures that all required storage buckets exist
 * If they don't, attempts to create them
 */
export const ensureStorageBuckets = async (): Promise<boolean> => {
  try {
    // First, check if we have access to storage
    const { data: bucketsList, error: bucketsError } = await supabase
      .storage
      .listBuckets();
    
    // If we can't even list buckets, don't try to create them
    if (bucketsError) {
      console.error("Error listing buckets:", bucketsError);
      return false;
    }
    
    const existingBuckets = new Set(bucketsList?.map(b => b.name) || []);
    const requiredBuckets = ['avatars', 'profile_photos', 'vehicle_photos', 'manuals'];
    const bucketsToCreate = requiredBuckets.filter(name => !existingBuckets.has(name));
    
    // If all buckets already exist, we're good
    if (bucketsToCreate.length === 0) {
      console.log("All required storage buckets already exist");
      return true;
    }
    
    // Try to create buckets that don't exist yet
    const creationErrors = [];
    
    for (const bucketName of bucketsToCreate) {
      try {
        console.log(`Creating ${bucketName} bucket...`);
        const { error } = await supabase.storage.createBucket(bucketName, {
          public: bucketName !== 'manuals' // Make manuals private, others public
        });
        
        if (error) {
          console.error(`Error creating ${bucketName} bucket:`, error);
          creationErrors.push({ name: bucketName, error: error.message });
        }
      } catch (err) {
        console.error(`Error creating ${bucketName} bucket:`, err);
        creationErrors.push({ name: bucketName, error: err.message || String(err) });
      }
    }
    
    // Log errors but don't throw - the storage functionality will degrade gracefully
    if (creationErrors.length > 0) {
      console.error("Failed to create buckets:", creationErrors);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Failed to initialize storage buckets:", error);
    return false;
  }
};
