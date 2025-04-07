import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

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

interface PhotoUploadProviderProps {
  initialImageUrl?: string | null;
  onImageUploaded: (url: string) => void;
  type: 'profile' | 'vehicle';
  children: ReactNode;
}

export const PhotoUploadProvider = ({
  initialImageUrl,
  onImageUploaded,
  type,
  children,
}: PhotoUploadProviderProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(initialImageUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Determine the bucket ID based on the type
  const bucketId = type === 'profile' ? 'profile_photos' : type === 'vehicle' ? 'vehicle_photos' : 'avatars';
  
  // Verify bucket exists when component mounts
  useEffect(() => {
    const verifyBucket = async () => {
      try {
        // Check if the bucket exists
        const bucketName = bucketId;
        const { data, error } = await supabase.storage.getBucket(bucketName);
        
        if (error && error.message.includes('The resource was not found')) {
          console.log(`Creating ${bucketName} bucket on demand...`);
          await supabase.storage.createBucket(bucketName, { public: true });
        }
      } catch (error) {
        console.error(`Error verifying ${type} bucket:`, error);
      }
    };
    
    verifyBucket();
  }, [type, bucketId]);

  // Verify if the initialImageUrl exists in storage
  useEffect(() => {
    const verifyImageExists = async () => {
      if (!initialImageUrl) return;
      
      try {
        // Extract the file path from the URL
        // URLs are typically in format: https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/bucket-name/file-path
        const urlParts = initialImageUrl.split('/');
        const bucketIndex = urlParts.findIndex(part => part === 'public') + 1;
        
        if (bucketIndex > 0 && bucketIndex < urlParts.length - 1) {
          const bucket = urlParts[bucketIndex];
          // The rest is the file path
          const filePath = urlParts.slice(bucketIndex + 1).join('/');
          
          if (bucket && filePath) {
            console.log(`Verifying if file exists: bucket=${bucket}, path=${filePath}`);
            
            // Check if the file exists
            const { data, error } = await supabase.storage
              .from(bucket)
              .download(filePath);
            
            if (error) {
              console.warn(`Image file not found in storage: ${error.message}`);
              console.log('Clearing reference to deleted file');
              // Clear the image URL if the file doesn't exist
              setImageUrl(null);
              onImageUploaded('');
            } else {
              console.log('File exists in storage');
              // Keep the existing URL since file exists
              setImageUrl(initialImageUrl);
            }
          }
        }
      } catch (error) {
        console.error('Error verifying image existence:', error);
        // In case of error, clear the image URL to be safe
        setImageUrl(null);
        onImageUploaded('');
      }
    };
    
    verifyImageExists();
  }, [initialImageUrl, onImageUploaded]);
  
  console.log(`PhotoUploadProvider initialized: type=${type}, bucket=${bucketId}, initialUrl=${initialImageUrl}`);

  const handleFileUpload = async (file: File) => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (.jpg, .jpeg, .png)",
        variant: "destructive",
      });
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    // Create a preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    try {
      setIsUploading(true);
      console.log(`Starting upload to bucket: ${bucketId}`);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Create a unique file path with user ID
      const userId = user.id;
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      console.log(`Uploading file to ${bucketId}/${filePath}`);

      // First, ensure the bucket exists
      try {
        const { error: bucketError } = await supabase.storage.getBucket(bucketId);
        if (bucketError && bucketError.message.includes('The resource was not found')) {
          console.log(`Bucket ${bucketId} not found, creating it...`);
          await supabase.storage.createBucket(bucketId, { public: true });
        }
      } catch (bucketError) {
        console.error('Error checking/creating bucket:', bucketError);
        // Continue with upload attempt anyway
      }

      // Upload file to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from(bucketId)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage.from(bucketId).getPublicUrl(filePath);

      console.log(`Upload successful, public URL: ${publicUrl}`);

      // Update state and trigger the callback
      setImageUrl(publicUrl);
      onImageUploaded(publicUrl);

      toast({
        title: "Upload successful",
        description: `Your ${type === 'profile' ? 'profile' : 'vehicle'} photo has been uploaded.`,
      });

    } catch (error: any) {
      console.error('Error uploading image:', error);
      
      // Provide more specific error messages based on the error type
      let errorMessage = error.message || `Failed to upload ${type} photo.`;
      
      // Add more specific error handling
      if (error.message?.includes('permission') || error.message?.includes('not authorized')) {
        errorMessage = `Permission denied. You may need to login again to upload photos.`;
      } else if (error.message?.includes('storage') || error.message?.includes('bucket')) {
        errorMessage = `Storage error. Please try again or contact support if the issue persists.`;
      }
      
      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      // Clear preview on error
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    setImageUrl(null);
    setPreviewUrl(null);
    onImageUploaded('');
  };

  const value = {
    imageUrl,
    previewUrl,
    isUploading,
    type,
    handleFileUpload,
    handleRemovePhoto,
    bucketId
  };

  return (
    <PhotoUploadContext.Provider value={value}>
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
