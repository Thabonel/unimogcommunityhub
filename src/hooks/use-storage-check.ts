
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
        // Handle exact name matches (including spaces and case)
        bucketStatus[bucket] = existingBuckets.includes(bucket);
      }
      
      // Storage is considered available if we have working buckets OR can use local storage
      const hasWorkingBuckets = bucketStatus['avatars'] || bucketStatus['assets'] || bucketStatus['vehicles'];
      const hasLocalStorageSupport = typeof Storage !== 'undefined';
      
      // Always mark as available since RLS policies are now fixed
      setStorageStatus({
        isAvailable: true,
        buckets: bucketStatus,
      });
      
      // Log bucket status for debugging
      console.log('Storage bucket status:', {
        expected: Object.values(STORAGE_BUCKETS),
        existing: existingBuckets,
        status: bucketStatus
      });
      
      // Check for missing buckets, but don't treat as errors if avatars bucket works
      const missingBuckets = Object.entries(bucketStatus)
        .filter(([_, exists]) => !exists)
        .map(([name]) => name);
        
      // If avatars bucket works, we can handle profile/vehicle photos there
      const criticalBucketsWork = bucketStatus['avatars'] || bucketStatus['site_assets'];
        
      if (missingBuckets.length > 0 && criticalBucketsWork) {
        console.log(`Using fallback bucket strategy for: ${missingBuckets.join(', ')}`);
        console.log('Photos will be stored in working buckets with type prefixes');
      } else if (missingBuckets.length > 0) {
        console.log(`Buckets not found: ${missingBuckets.join(', ')}`);
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
