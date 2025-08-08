
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { usePhotoUploadState, UsePhotoUploadStateProps } from './hooks/usePhotoUploadState';
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
  const { toast } = useToast();
  
  // Ensure buckets exist when component mounts
  useEffect(() => {
    console.log(`PhotoUploadProvider mounted, initializing storage`);
    
    const initStorage = async () => {
      try {
        await ensureStorageBuckets();
        setInitCompleted(true);
      } catch (err) {
        console.error("Error ensuring storage buckets exist:", err);
        toast({
          title: "Storage initialization error",
          description: "Photo uploads may not work correctly. Please try again later.",
          variant: "destructive",
        });
        setInitCompleted(true); // Still mark as completed so the component renders
      }
    };
    
    initStorage();
  }, [toast]);
  
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
