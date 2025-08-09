
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { usePhotoUploadState, UsePhotoUploadStateProps } from './hooks/usePhotoUploadState';

// Define the context type
interface PhotoUploadContextType {
  imageUrl: string | null;
  previewUrl: string | null;
  isUploading: boolean;
  type: 'profile' | 'vehicle';
  handleFileUpload: (file: File) => Promise<void>;
  handleRemovePhoto: () => void;
  bucketId: string;
  storageReady: boolean;
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
  const [initCompleted, setInitCompleted] = useState(false);
  
  // Skip bucket creation - buckets already exist in Supabase
  useEffect(() => {
    console.log(`PhotoUploadProvider mounted, storage ready`);
    
    // Buckets already exist, no need to create them
    // This was causing 503 errors trying to create existing buckets
    setInitCompleted(true);
  }, []);
  
  const uploadState = usePhotoUploadState({
    initialImageUrl,
    onImageUploaded,
    type,
  });

  if (!initCompleted) {
    // You could return a loading state here if needed
    return null;
  }

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
