
import { createContext, useContext, useEffect, ReactNode } from 'react';
import { usePhotoUploadState, UsePhotoUploadStateProps } from './hooks/usePhotoUploadState';
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
    console.log(`PhotoUploadProvider mounted, ensuring storage buckets exist`);
    
    // Trigger bucket initialization on component mount
    ensureStorageBuckets().catch(err => {
      console.error("Error ensuring storage buckets exist:", err);
    });
  }, []);

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
