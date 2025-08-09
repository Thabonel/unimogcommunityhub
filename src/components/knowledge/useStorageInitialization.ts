
import { useState, useEffect, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import { ensureSampleManualsExist, verifyManualsBucket } from "@/services/manuals/manualService";

export function useStorageInitialization() {
  const [bucketsChecked, setBucketsChecked] = useState(false);
  const [bucketError, setBucketError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationResult, setVerificationResult] = useState<{success: boolean, message: string} | null>(null);

  // Function to check buckets and initialize storage
  const checkAndInitializeBuckets = useCallback(async () => {
    setIsVerifying(true);
    setBucketError(null);
    setVerificationResult(null);
    
    console.log('Starting bucket verification');
    
    try {
      // First, check if the manuals bucket specifically exists
      const manualsBucketResult = await verifyManualsBucket();
      
      if (!manualsBucketResult) {
        console.log('Manuals bucket verification failed');
        // Buckets already exist in Supabase, no need to create them
        const errorMsg = 'Storage access issue: Could not verify manuals bucket. Please check your connection.';
        setBucketError(errorMsg);
        setVerificationResult({ success: false, message: errorMsg });
        setIsVerifying(false);
        return;
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
    } catch (error) {
      console.error("Error during bucket verification:", error);
      const errorMsg = `Storage initialization error: ${error.message || "Unknown error"}. Please try again.`;
      setBucketError(errorMsg);
      setVerificationResult({ success: false, message: errorMsg });
      toast({
        title: "Storage error",
        description: "Could not verify storage buckets. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
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
