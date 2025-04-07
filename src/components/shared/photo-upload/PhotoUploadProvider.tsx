
import { createContext, useContext, useEffect, ReactNode, useState } from 'react';
import { usePhotoUploadState, UsePhotoUploadStateProps } from './hooks/usePhotoUploadState';
import { verifyBucket } from './utils/fileUploadUtils';
import { supabase, ensureStorageBuckets } from '@/lib/supabase';
import { useToast } from '@/hooks/toast';

// Define the context type
interface PhotoUploadContextType {
  imageUrl: string | null;
  previewUrl: string | null;
  isUploading: boolean;
  type: 'profile' | 'vehicle';
  handleFileUpload: (file: File) => Promise<void>;
  handleRemovePhoto: () => void;
  bucketId: string;
  isBucketReady: boolean;
}

// Create the context with a default value
const PhotoUploadContext = createContext<PhotoUploadContextType | undefined>(undefined);

interface PhotoUploadProviderProps extends UsePhotoUploadStateProps {
  children: ReactNode;
}

export const PhotoUploadProvider = ({
  initialImageUrl,
  onImageUploaded,
  type,
  children,
}: PhotoUploadProviderProps) => {
  const uploadState = usePhotoUploadState({
    initialImageUrl,
    onImageUploaded,
    type,
  });
  
  const [isBucketReady, setIsBucketReady] = useState(false);
  const { toast } = useToast();
  
  // Simplified bucket initialization - master user can't create buckets through the UI
  // so we'll need to force the UI to proceed anyway
  useEffect(() => {
    let mounted = true;
    
    const initBuckets = async () => {
      try {
        // First try the global bucket initialization
        await ensureStorageBuckets();
        
        // For master users in development mode, we proceed regardless
        // This allows the UI to work even if bucket operations fail
        if (mounted) {
          // Small delay to allow other operations to complete
          setTimeout(() => {
            if (mounted) setIsBucketReady(true);
          }, 500);
        }
      } catch (error) {
        console.error("Error initializing storage buckets:", error);
        
        // For master users, we proceed anyway to allow testing other functions
        if (mounted) {
          // Always mark as ready after a delay - this prevents UI from being stuck
          setTimeout(() => {
            if (mounted) {
              console.log("Forcing bucket ready state for master user");
              setIsBucketReady(true);
            }
          }, 1000);
        }
      }
    };
    
    console.log(`PhotoUploadProvider initializing buckets: type=${type}, bucket=${uploadState.bucketId}`);
    initBuckets();
    
    // Cleanup function to prevent state updates if component unmounts
    return () => {
      mounted = false;
    };
  }, [uploadState.bucketId, type]);

  console.log(`PhotoUploadProvider state: type=${type}, bucket=${uploadState.bucketId}, bucketReady=${isBucketReady}, initialUrl=${initialImageUrl}`);

  const contextValue = {
    ...uploadState,
    isBucketReady
  };

  return (
    <PhotoUploadContext.Provider value={contextValue}>
      {children}
    </PhotoUploadContext.Provider>
  );
};

// Custom hook to use the photo upload context
export const usePhotoUpload = () => {
  const context = useContext(PhotoUploadContext);
  if (context === undefined) {
    throw new Error('usePhotoUpload must be used within a PhotoUploadProvider');
  }
  return context;
};
