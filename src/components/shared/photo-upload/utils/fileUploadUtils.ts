
import { supabase } from '@/lib/supabase';
import { UseToastReturn } from '@/hooks/toast/types';

// Validates a file before upload
export const validateFile = (
  file: File, 
  toast: UseToastReturn['toast']
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

// Verifies if a bucket exists and creates it if needed
export const verifyBucket = async (bucketId: string): Promise<boolean> => {
  try {
    console.log(`Verifying bucket: ${bucketId}`);
    // Check if the bucket exists
    const { data, error } = await supabase.storage.getBucket(bucketId);
    
    if (error && error.message.includes('The resource was not found')) {
      console.log(`Creating ${bucketId} bucket on demand...`);
      await supabase.storage.createBucket(bucketId, { public: true });
      return true;
    } else if (error) {
      console.error(`Error verifying bucket ${bucketId}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Error verifying ${bucketId} bucket:`, error);
    return false;
  }
};

// Verifies if a file exists in storage
export const verifyImageExists = async (
  imageUrl: string | null
): Promise<boolean> => {
  if (!imageUrl) return false;
  
  try {
    // Extract the file path from the URL
    // URLs are typically in format: https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/bucket-name/file-path
    const urlParts = imageUrl.split('/');
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
          return false;
        } else {
          console.log('File exists in storage');
          return true;
        }
      }
    }
    return false;
  } catch (error) {
    console.error('Error verifying image existence:', error);
    return false;
  }
};

// Uploads a file to Supabase Storage
export const uploadFile = async (
  file: File,
  bucketId: string,
  toast: UseToastReturn['toast'],
  type: 'profile' | 'vehicle'
): Promise<string | null> => {
  try {
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

    // Ensure the bucket exists
    await verifyBucket(bucketId);

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

    toast({
      title: "Upload successful",
      description: `Your ${type === 'profile' ? 'profile' : 'vehicle'} photo has been uploaded.`,
    });

    return publicUrl;
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
    
    return null;
  }
};
