
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/toast';
import { verifyImageExists, uploadFile, getBucketForType } from '../utils/fileUploadUtils';
import { ensureStorageBuckets } from '@/lib/supabase';

export interface UsePhotoUploadStateProps {
  initialImageUrl?: string | null;
  onImageUploaded: (url: string) => void;
  type: 'profile' | 'vehicle';
}

export const usePhotoUploadState = ({
  initialImageUrl,
  onImageUploaded,
  type
}: UsePhotoUploadStateProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(initialImageUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [storageReady, setStorageReady] = useState(false);
  const { toast } = useToast();
  
  // Get the bucket ID based on the type
  const bucketId = getBucketForType(type);
  
  // Ensure buckets exist when component mounts
  useEffect(() => {
    console.log(`PhotoUploadState initialized, ensuring storage buckets exist for ${type}`);
    
    const initStorage = async () => {
      try {
        const result = await ensureStorageBuckets();
        setStorageReady(result.success);
        
        if (!result.success) {
          console.error("Failed to initialize storage:", result.error);
          toast({
            title: "Storage initialization failed",
            description: "Image uploads might not work properly. Please try again later.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error initializing storage:", error);
        setStorageReady(false);
      }
    };
    
    initStorage();
  }, [type, toast]);
  
  // Verify if the initialImageUrl exists in storage
  useEffect(() => {
    const checkImageExists = async () => {
      if (!initialImageUrl || !storageReady) return;
      
      try {
        const fileExists = await verifyImageExists(initialImageUrl);
        
        if (!fileExists) {
          console.log('Clearing reference to deleted file');
          // Clear the image URL if the file doesn't exist
          setImageUrl(null);
          onImageUploaded('');
        } else {
          // Keep the existing URL since file exists
          setImageUrl(initialImageUrl);
        }
      } catch (error) {
        console.error("Error checking if image exists:", error);
      }
    };
    
    if (storageReady) {
      checkImageExists();
    }
  }, [initialImageUrl, onImageUploaded, storageReady]);
  
  const handleFileUpload = async (file: File) => {
    if (!storageReady) {
      toast({
        title: "Storage not ready",
        description: "Please wait for storage initialization or try again later.",
        variant: "destructive",
      });
      return;
    }
    
    // Create a preview URL immediately for better UX
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    try {
      setIsUploading(true);
      console.log(`Starting file upload for ${type}`);
      
      // Upload the file
      const publicUrl = await uploadFile(file, type, toast);
      
      if (publicUrl) {
        // Update state and trigger the callback
        setImageUrl(publicUrl);
        onImageUploaded(publicUrl);
        console.log(`File uploaded successfully:`, publicUrl);
      }
      
      // Clean up the preview URL
      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error('Error in handleFileUpload:', error);
      
      toast({
        title: "Upload failed",
        description: "An unexpected error occurred during upload.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    // Clean up preview URL if it exists
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    
    setImageUrl(null);
    setPreviewUrl(null);
    onImageUploaded('');
  };

  return {
    imageUrl,
    previewUrl,
    isUploading,
    type,
    bucketId,
    storageReady,
    handleFileUpload,
    handleRemovePhoto
  };
};
