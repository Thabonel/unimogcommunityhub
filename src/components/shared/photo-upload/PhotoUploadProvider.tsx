
import { createContext, useContext, useEffect, ReactNode } from 'react';
import { usePhotoUploadState, UsePhotoUploadStateProps } from './hooks/usePhotoUploadState';
import { verifyBucket } from './utils/fileUploadUtils';
import { ensureStorageBuckets } from '@/lib/supabase';

// Define the context type
interface PhotoUploadContextType {
  imageUrl: string | null;
  previewUrl: string | null;
  isUploading: boolean;
  type: 'profile' | 'vehicle';
  handleFileUpload: (file: File) => Promise<void>;
  handleRemovePhoto: () => void;
  bucketId: string;
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
  
  // Ensure buckets exist when component mounts
  useEffect(() => {
    console.log(`PhotoUploadProvider mounted, ensuring bucket exists: ${uploadState.bucketId}`);
    
    // First try to directly verify the specific bucket for this component
    verifyBucket(uploadState.bucketId)
      .then(success => {
        if (!success) {
          // If direct verification fails, try the full ensureStorageBuckets
          console.log("Direct bucket verification failed, trying ensureStorageBuckets...");
          return ensureStorageBuckets();
        }
      })
      .catch(err => {
        console.error("Error during bucket initialization:", err);
      });
      
  }, [uploadState.bucketId]);

  return (
    <PhotoUploadContext.Provider value={uploadState}>
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
