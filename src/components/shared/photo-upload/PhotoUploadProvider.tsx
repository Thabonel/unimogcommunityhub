
import { createContext, useContext, useEffect, ReactNode, useState } from 'react';
import { usePhotoUploadState, UsePhotoUploadStateProps } from './hooks/usePhotoUploadState';
import { verifyBucket } from './utils/fileUploadUtils';
import { ensureStorageBuckets } from '@/lib/supabase';
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
  
  // Ensure buckets exist when component mounts
  useEffect(() => {
    let mounted = true;
    
    const initBuckets = async () => {
      try {
        // First ensure all storage buckets exist
        await ensureStorageBuckets();
        
        // Then verify the specific bucket for this component
        const bucketExists = await verifyBucket(uploadState.bucketId);
        
        if (mounted && bucketExists) {
          console.log(`Bucket ${uploadState.bucketId} is ready`);
          setIsBucketReady(true);
        } else if (mounted) {
          console.error(`Failed to verify bucket: ${uploadState.bucketId}`);
          toast({
            title: "Storage Error",
            description: "Failed to initialize image storage. Please try again later.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error initializing storage buckets:", error);
        if (mounted) {
          toast({
            title: "Storage Error",
            description: "Failed to initialize image storage. Please try again later.",
            variant: "destructive",
          });
        }
      }
    };
    
    console.log(`PhotoUploadProvider initializing buckets: type=${type}, bucket=${uploadState.bucketId}`);
    initBuckets();
    
    // Cleanup function to prevent state updates if component unmounts
    return () => {
      mounted = false;
    };
  }, [uploadState.bucketId, type, toast]);

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
