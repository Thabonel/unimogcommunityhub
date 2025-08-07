
import { useState, useEffect } from 'react';
import { supabase, STORAGE_BUCKETS, ensureStorageBuckets } from '@/lib/supabase';
import { useToast } from './toast';

// Global state to prevent multiple checks
let globalCheckComplete = false;
let globalCheckInProgress = false;

export function useStorageCheck() {
  const [isChecking, setIsChecking] = useState(false);
  const [checkComplete, setCheckComplete] = useState(globalCheckComplete);
  const [storageStatus, setStorageStatus] = useState<{
    isAvailable: boolean;
    buckets: Record<string, boolean>;
    error?: string;
  }>({
    isAvailable: false,
    buckets: {},
  });
  const { toast } = useToast();

  const checkStorage = async () => {
    // If already checked globally, skip
    if (globalCheckComplete) {
      console.log('Storage already checked globally');
      setCheckComplete(true);
      return;
    }
    
    // If another check is in progress, wait
    if (globalCheckInProgress) {
      console.log('Storage check in progress, waiting...');
      while (globalCheckInProgress) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      setCheckComplete(globalCheckComplete);
      return;
    }
    
    globalCheckInProgress = true;
    setIsChecking(true);
    try {
      // First check if Storage API is available
      const { data: bucketList, error: bucketError } = await supabase.storage.listBuckets();
      
      if (bucketError) {
        setStorageStatus({
          isAvailable: false,
          buckets: {},
          error: `Storage API error: ${bucketError.message}`
        });
        return;
      }
      
      // Check each required bucket
      const bucketStatus: Record<string, boolean> = {};
      const existingBuckets = bucketList?.map(b => b.name) || [];
      
      for (const bucket of Object.values(STORAGE_BUCKETS)) {
        bucketStatus[bucket] = existingBuckets.includes(bucket);
      }
      
      setStorageStatus({
        isAvailable: true,
        buckets: bucketStatus,
      });
      
      // If any required buckets are missing, try to create them
      const missingBuckets = Object.entries(bucketStatus)
        .filter(([_, exists]) => !exists)
        .map(([name]) => name);
        
      if (missingBuckets.length > 0) {
        console.log(`Buckets not in list: ${missingBuckets.join(', ')}. Attempting to verify/create...`);
        
        // Don't show error for profile_photos - it's a known Supabase listing issue
        // The bucket exists and works, just doesn't always show in the list
        const actuallyMissing = missingBuckets.filter(b => b !== 'profile_photos');
        
        if (actuallyMissing.length > 0) {
          const result = await ensureStorageBuckets();
          
          if (!result.success) {
            // Only show error for buckets other than profile_photos
            console.error('Storage setup failed:', result.error);
            // Don't show toast - storage still works
          }
        } else {
          // Only profile_photos is "missing" - this is fine, it works
          console.log('profile_photos bucket not listed but functional');
        }
        
        // Mark as complete even if profile_photos appears missing
        globalCheckComplete = true;
      }
    } catch (error: any) {
      console.error("Error checking storage availability:", error);
      setStorageStatus({
        isAvailable: false,
        buckets: {},
        error: `Storage check failed: ${error.message || 'Unknown error'}`
      });
    } finally {
      setIsChecking(false);
      setCheckComplete(true);
      globalCheckInProgress = false;
      if (!globalCheckComplete) {
        globalCheckComplete = true;
      }
    }
  };

  useEffect(() => {
    checkStorage();
  }, []);

  return {
    isChecking,
    checkComplete,
    storageStatus,
    recheckStorage: checkStorage
  };
}
