
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
    const initBuckets = async () => {
      // First ensure all storage buckets exist
      await ensureStorageBuckets();
      
      // Then verify the specific bucket for this component
      await verifyBucket(uploadState.bucketId);
    };
    
    initBuckets();
  }, [uploadState.bucketId]);

  console.log(`PhotoUploadProvider initialized: type=${type}, bucket=${uploadState.bucketId}, initialUrl=${initialImageUrl}`);

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
