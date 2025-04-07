import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/toast';
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
    if (!initialImageUrl) return;
    
    const checkImageExists = async () => {
      try {
        console.log(`Checking if image exists: ${initialImageUrl}`);
        const fileExists = await verifyImageExists(initialImageUrl);
        
        if (!fileExists) {
          console.log('Image does not exist in storage, clearing reference');
          // Clear the image URL if the file doesn't exist
          setImageUrl(null);
          onImageUploaded('');
        } else {
          console.log('Image exists in storage, keeping reference');
          // Keep the existing URL since file exists
          setImageUrl(initialImageUrl);
        }
      } catch (error) {
        console.error('Error checking if image exists:', error);
        // If there's an error checking, we'll assume the file doesn't exist
        setImageUrl(null);
        onImageUploaded('');
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
      
      toast({
        title: "Processing upload",
        description: `Uploading ${type === 'profile' ? 'profile' : 'vehicle'} photo...`,
      });
      
      console.log(`Starting upload to ${bucketId}...`);
      
      // Upload the file
      const publicUrl = await uploadFile(file, bucketId, toast, type);
      
      if (publicUrl) {
        // Update state and trigger the callback
        setImageUrl(publicUrl);
        onImageUploaded(publicUrl);
        console.log(`File uploaded successfully to ${bucketId}:`, publicUrl);
        
        toast({
          title: "Upload complete",
          description: `Your ${type === 'profile' ? 'profile' : 'vehicle'} photo has been uploaded.`,
          variant: "default",
        });
      } else {
        throw new Error("Upload failed - no URL returned");
      }
    } catch (error) {
      console.error('Error in handleFileUpload:', error);
      
      // Clean up the preview
      setPreviewUrl(null);
      
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred during upload.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    
    setImageUrl(null);
    setPreviewUrl(null);
    onImageUploaded('');
    
    console.log(`Photo removed from ${type} upload component`);
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
