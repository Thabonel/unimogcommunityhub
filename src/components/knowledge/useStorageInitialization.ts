
import { useState, useEffect, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import { ensureStorageBuckets } from "@/lib/supabase";
import { ensureSampleManualsExist, verifyManualsBucket } from "@/services/manuals/manualService";

// Keep track of initialization globally to prevent multiple attempts
let globalInitializationComplete = false;
let globalInitializationInProgress = false;

export function useStorageInitialization() {
  const [bucketsChecked, setBucketsChecked] = useState(globalInitializationComplete);
  const [bucketError, setBucketError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(!globalInitializationComplete);
  const [verificationResult, setVerificationResult] = useState<{success: boolean, message: string} | null>(
    globalInitializationComplete ? { success: true, message: 'Storage already verified.' } : null
  );

  // Function to check buckets and initialize storage
  const checkAndInitializeBuckets = useCallback(async () => {
    // If already checked globally, don't check again
    if (globalInitializationComplete) {
      console.log('Storage already verified globally');
      setBucketsChecked(true);
      setIsVerifying(false);
      setVerificationResult({ success: true, message: 'Storage already verified.' });
      return;
    }
    
    // If another component is checking, wait for it
    if (globalInitializationInProgress) {
      console.log('Storage check already in progress, waiting...');
      while (globalInitializationInProgress) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      if (globalInitializationComplete) {
        setBucketsChecked(true);
        setIsVerifying(false);
        setVerificationResult({ success: true, message: 'Storage verified by another component.' });
        return;
      }
    }
    
    globalInitializationInProgress = true;
    setIsVerifying(true);
    setBucketError(null);
    setVerificationResult(null);
    
    console.log('Starting bucket verification');
    
    try {
      // First, check if the manuals bucket specifically exists
      const manualsBucketResult = await verifyManualsBucket();
      
      if (!manualsBucketResult) {
        console.log('Manuals bucket verification failed, trying full bucket initialization...');
        // If direct verification fails, try the complete initialization
        const bucketsResult = await ensureStorageBuckets();
        
        if (!bucketsResult.success) {
          const errorMsg = `Storage setup issue: ${bucketsResult.error || 'Could not create or access required buckets'}. Please try again or contact support.`;
          setBucketError(errorMsg);
          setVerificationResult({ success: false, message: errorMsg });
          setIsVerifying(false);
          return;
        }
        
        // Check the manuals bucket again after initialization
        const retryResult = await verifyManualsBucket();
        if (!retryResult) {
          const errorMsg = "Storage setup issue: Could not create or access the manuals bucket after initialization. Please try again or contact support.";
          setBucketError(errorMsg);
          setVerificationResult({ success: false, message: errorMsg });
          setIsVerifying(false);
          return;
        }
      }
      
      // If we got here, the bucket exists
      console.log('Storage buckets verified successfully, now checking for manuals...');
      
      // Add a sample manual if none exist (for demonstration) - silently
      const samplesAdded = await ensureSampleManualsExist();
      
      // No toast notification - samples are added silently
      if (samplesAdded) {
        console.log('Sample manual added for demonstration');
      }
      
      setBucketsChecked(true);
      setVerificationResult({ success: true, message: 'Storage buckets verified successfully.' });
      globalInitializationComplete = true;
    } catch (error: any) {
      console.error("Error during bucket verification:", error);
      const errorMsg = `Storage initialization error: ${error.message || "Unknown error"}. Please try again.`;
      setBucketError(errorMsg);
      setVerificationResult({ success: false, message: errorMsg });
      // Mark as complete even if there was an error to prevent infinite loops
      globalInitializationComplete = true;
      // Don't show toast for known issues like profile_photos
      if (!error.message?.includes('profile_photos')) {
        toast({
          title: "Storage error",
          description: "Could not verify storage buckets. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setIsVerifying(false);
      globalInitializationInProgress = false;
    }
  }, []); // Remove checkCount dependency to avoid infinite loop

  // Ensure storage buckets exist when component mounts
  useEffect(() => {
    if (!bucketsChecked) {
      checkAndInitializeBuckets();
    }
  }, [bucketsChecked, checkAndInitializeBuckets]);

  return {
    bucketsChecked,
    bucketError,
    isVerifying,
    verificationResult,
    checkAndInitializeBuckets
  };
}
