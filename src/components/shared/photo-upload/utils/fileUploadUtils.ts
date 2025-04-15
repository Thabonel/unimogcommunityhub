
import { supabase, STORAGE_BUCKETS } from '@/lib/supabase';
import { ToastOptions } from '@/hooks/toast/types';

// Validates a file before upload
export const validateFile = (
  file: File, 
  toast: (options: ToastOptions) => void
): boolean => {
  // Check file type
  if (!file.type.startsWith('image/')) {
    toast({
      title: "Invalid file type",
      description: "Please upload an image file (.jpg, .jpeg, .png)",
      variant: "destructive",
    });
    return false;
  }

  // Check file size (limit to 5MB)
  if (file.size > 5 * 1024 * 1024) {
    toast({
      title: "File too large",
      description: "Please upload an image smaller than 5MB",
      variant: "destructive",
    });
    return false;
  }

  return true;
};

// Get the appropriate bucket ID based on file type
export const getBucketForType = (type: 'profile' | 'vehicle'): string => {
  switch (type) {
    case 'profile':
      return STORAGE_BUCKETS.PROFILE_PHOTOS;
    case 'vehicle':
      return STORAGE_BUCKETS.VEHICLE_PHOTOS;
    default:
      return STORAGE_BUCKETS.AVATARS; // default fallback
  }
};

// Verifies if a file exists in storage
export const verifyImageExists = async (
  imageUrl: string | null
): Promise<boolean> => {
  if (!imageUrl) return false;
  
  try {
    // Extract the file path from the URL
    const urlParts = imageUrl.split('/');
    const bucketIndex = urlParts.findIndex(part => 
      Object.values(STORAGE_BUCKETS).includes(part)
    );
    
    if (bucketIndex >= 0 && bucketIndex < urlParts.length - 1) {
      const bucket = urlParts[bucketIndex];
      // The rest is the file path
      const filePath = urlParts.slice(bucketIndex + 1).join('/');
      
      console.log(`Verifying if file exists: bucket=${bucket}, path=${filePath}`);
      
      // Check if the file exists by trying to get metadata
      const { data, error } = await supabase.storage
        .from(bucket)
        .download(filePath);
      
      if (error) {
        console.warn(`Image file not found in storage: ${error.message}`);
        return false;
      } else {
        console.log('File exists in storage');
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error('Error verifying image existence:', error);
    return false;
  }
};

// Uploads a file to Supabase Storage with improved error handling
export const uploadFile = async (
  file: File,
  type: 'profile' | 'vehicle',
  toastFn: (options: ToastOptions) => void
): Promise<string | null> => {
  try {
    // Get the appropriate bucket for this file type
    const bucketId = getBucketForType(type);
    console.log(`Starting upload to bucket: ${bucketId}`);

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Create a unique file path with timestamp and user ID
    const fileExt = file.name.split('.').pop();
    const timestamp = Date.now();
    const filePath = `${user.id}/${timestamp}.${fileExt}`;

    console.log(`Uploading file to ${bucketId}/${filePath}`);

    // Upload file to Supabase Storage with explicit content type
    const { error: uploadError, data } = await supabase.storage
      .from(bucketId)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type // Explicitly set content type
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    // Get the public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage.from(bucketId).getPublicUrl(filePath);

    console.log(`Upload successful, public URL: ${publicUrl}`);

    toastFn({
      title: "Upload successful",
      description: `Your ${type} photo has been uploaded.`,
    });

    return publicUrl;
  } catch (error: any) {
    console.error('Error uploading image:', error);
    
    let errorMessage = error.message || `Failed to upload ${type} photo.`;
    
    // Add more specific error handling
    if (error.message?.includes('permission') || error.message?.includes('not authorized')) {
      errorMessage = `Permission denied. You may need to login again to upload photos.`;
    } else if (error.message?.includes('storage') || error.message?.includes('bucket')) {
      errorMessage = `Storage error. Please try again or contact support if the issue persists.`;
    }
    
    toastFn({
      title: "Upload failed",
      description: errorMessage,
      variant: "destructive",
    });
    
    return null;
  }
};
