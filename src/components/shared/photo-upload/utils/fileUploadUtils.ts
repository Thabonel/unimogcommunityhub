
import { supabase } from '@/lib/supabase';
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

// Verifies if a bucket exists 
export const verifyBucket = async (bucketId: string): Promise<boolean> => {
  try {
    // Simple check if the bucket exists
    const { data, error } = await supabase.storage.getBucket(bucketId);
    
    if (error) {
      console.log(`Bucket ${bucketId} not found or error:`, error.message);
      return false;
    }
    
    console.log(`Bucket ${bucketId} exists:`, data);
    return true;
  } catch (error) {
    console.error(`Error checking bucket ${bucketId}:`, error);
    return false;
  }
};

// Verifies if a file exists in storage
export const verifyImageExists = async (
  imageUrl: string | null
): Promise<boolean> => {
  if (!imageUrl) return false;
  
  try {
    console.log(`Verifying image exists: ${imageUrl}`);
    
    // For master user in dev mode, we'll just assume the image exists
    // This allows testing the UI without real storage
    if (imageUrl.includes('master-user') || imageUrl.includes('placeholder')) {
      console.log('Development image URL detected, assuming it exists');
      return true;
    }
    
    // Extract the file path from the URL
    // URLs are typically in format: https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/bucket-name/file-path
    const urlParts = imageUrl.split('/');
    const publicIndex = urlParts.findIndex(part => part === 'public');
    
    if (publicIndex <= 0 || publicIndex >= urlParts.length - 1) {
      console.warn(`Invalid image URL format: ${imageUrl}`);
      return false;
    }
    
    const bucket = urlParts[publicIndex + 1];
    // The rest is the file path
    const filePath = urlParts.slice(publicIndex + 2).join('/');
    
    if (!bucket || !filePath) {
      console.warn(`Could not extract bucket or file path from URL: ${imageUrl}`);
      return false;
    }
    
    console.log(`Checking file existence: bucket=${bucket}, path=${filePath}`);
    
    // Check if the file exists
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(filePath);
    
    if (error) {
      console.warn(`Image file not found in storage: ${error.message}`);
      return false;
    }
    
    console.log('File exists in storage');
    return true;
  } catch (error) {
    console.error('Error verifying image existence:', error);
    return false;
  }
};

// Uploads a file to Supabase Storage with simplified approach
export const uploadFile = async (
  file: File,
  bucketId: string,
  toastFn: (options: ToastOptions) => void,
  type: 'profile' | 'vehicle'
): Promise<string | null> => {
  try {
    console.log(`Starting upload to bucket: ${bucketId}`);

    // For master user in development, return a dummy URL
    const isMasterUser = localStorage.getItem('isMasterUser') === 'true';
    if (isMasterUser) {
      console.log('Master user detected, providing development image URL');
      // Return a predictable URL for development
      setTimeout(() => {
        toastFn({
          title: "Development Mode",
          description: `In development mode, real uploads don't occur for master users`,
        });
      }, 500);
      
      return `https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/${bucketId}/master-user-${type}-${Date.now()}.jpg`;
    }

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Simple file path with timestamp
    const fileExt = file.name.split('.').pop();
    const timestamp = Date.now();
    const fileName = `${timestamp}_${fileExt}`;
    
    console.log(`Uploading file to ${bucketId}/${fileName}`);

    // Upload file to Supabase Storage
    const { error: uploadError, data } = await supabase.storage
      .from(bucketId)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucketId)
      .getPublicUrl(fileName);

    console.log(`Upload successful, public URL: ${publicUrl}`);
    return publicUrl;
  } catch (error: any) {
    console.error('Error uploading image:', error);
    
    toastFn({
      title: "Upload failed",
      description: error.message || `Failed to upload ${type} photo.`,
      variant: "destructive",
    });
    
    return null;
  }
};
