import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { verifyImageExists, uploadFile, validateFile } from '../utils/fileUploadUtils';

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
  const { toast } = useToast();
  
  // Determine the bucket ID based on the type
  const bucketId = type === 'profile' ? 'profile_photos' : type === 'vehicle' ? 'vehicle_photos' : 'avatars';
  
  // Verify if the initialImageUrl exists in storage
  useEffect(() => {
    const checkImageExists = async () => {
      if (!initialImageUrl) return;
      
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
    };
    
    checkImageExists();
  }, [initialImageUrl, onImageUploaded]);
  
  const handleFileUpload = async (file: File) => {
    // Validate the file
    if (!validateFile(file, toast)) {
      return;
    }

    // Create a preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    try {
      setIsUploading(true);
      
      // Upload the file
      const publicUrl = await uploadFile(file, bucketId, toast, type);
      
      if (publicUrl) {
        // Update state and trigger the callback
        setImageUrl(publicUrl);
        onImageUploaded(publicUrl);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = () => {
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
    handleFileUpload,
    handleRemovePhoto
  };
};
