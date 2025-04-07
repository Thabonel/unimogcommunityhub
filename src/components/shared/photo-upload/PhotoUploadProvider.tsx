
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
  const bucketId = type === 'profile' ? 'avatars' : 'vehicle_photos';
  
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
      toast({
        title: "Upload failed",
        description: error.message || `Failed to upload ${type} photo.`,
        variant: "destructive",
      });
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
