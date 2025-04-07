
import { createContext, useContext, useEffect, ReactNode } from 'react';
import { usePhotoUploadState, UsePhotoUploadStateProps } from './hooks/usePhotoUploadState';
import { verifyBucket } from './utils/fileUploadUtils';

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
  
  // Verify bucket exists when component mounts
  useEffect(() => {
    const ensureBucket = async () => {
      await verifyBucket(uploadState.bucketId);
    };
    
    ensureBucket();
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
