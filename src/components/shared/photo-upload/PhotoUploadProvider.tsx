
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
  const uploadState = usePhotoUploadState({
    initialImageUrl,
    onImageUploaded,
    type,
  });

  // Immediately provide the upload state - storage is ready
  return (
    <PhotoUploadContext.Provider value={{ ...uploadState, storageReady: true }}>
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
