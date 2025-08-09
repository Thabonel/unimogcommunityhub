
import { useState, useEffect } from 'react';
import { supabase, STORAGE_BUCKETS } from '@/lib/supabase-client';
import { useToast } from './toast';

export function useStorageCheck() {
  const [isChecking, setIsChecking] = useState(false);
  const [checkComplete, setCheckComplete] = useState(false);
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
      
      // Log any missing buckets but don't try to create them
      const missingBuckets = Object.entries(bucketStatus)
        .filter(([_, exists]) => !exists)
        .map(([name]) => name);
        
      if (missingBuckets.length > 0) {
        console.log(`Buckets not in list: ${missingBuckets.join(', ')}.`);
        // Note: 'Profile Photos' bucket exists but may not show in list due to name mismatch
        // The app expects 'Profile Photos' but was looking for 'profile_photos'
      }
    } catch (error) {
      console.error("Error checking storage availability:", error);
      setStorageStatus({
        isAvailable: false,
        buckets: {},
        error: `Storage check failed: ${error.message || 'Unknown error'}`
      });
    } finally {
      setIsChecking(false);
      setCheckComplete(true);
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
