
import { supabase, STORAGE_BUCKETS, BucketName } from '@/lib/supabase';
import { ToastOptions } from '@/hooks/toast/types';
import { 
  validateFile as validateFileSecure, 
  generateSecureFilePath,
  ALLOWED_FILE_TYPES,
  FILE_SIZE_LIMITS 
} from '@/utils/fileValidation';

// Legacy validation wrapper - redirects to secure validation
export const validateFile = (
  file: File, 
  toast: (options: ToastOptions) => void
): boolean => {
  const result = validateFileSecure(file, { 
    category: 'image',
    allowedTypes: ALLOWED_FILE_TYPES.images
  });
  
  if (!result.valid) {
    // Error toast is already shown by validateFileSecure
    return false;
  }
  
  return true;
};

// Get the appropriate bucket ID based on file type
export const getBucketForType = (type: 'profile' | 'vehicle' | 'favicon'): BucketName => {
  switch (type) {
    case 'profile':
      return STORAGE_BUCKETS.PROFILE_PHOTOS;
    case 'vehicle':
      return STORAGE_BUCKETS.VEHICLE_PHOTOS;
    case 'favicon':
      return STORAGE_BUCKETS.SITE_ASSETS || STORAGE_BUCKETS.PROFILE_PHOTOS; // Fallback to profile if no site_assets
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
      Object.values(STORAGE_BUCKETS).includes(part as BucketName)
    );
    
    if (bucketIndex >= 0 && bucketIndex < urlParts.length - 1) {
      const bucket = urlParts[bucketIndex] as BucketName;
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
  type: 'profile' | 'vehicle' | 'favicon',
  toastFn: (options: ToastOptions) => void
): Promise<string | null> => {
  try {
    // For favicons, accept more file types but still validate
    if (type !== 'favicon' && !validateFile(file, toastFn)) {
      return null;
    }
    
    // Get the appropriate bucket for this file type
    const bucketId = getBucketForType(type);
    console.log(`Starting upload to bucket: ${bucketId}`);

    // For favicon uploads in admin section, use a public path with timestamp
    if (type === 'favicon') {
      // Validate favicon file
      const faviconResult = validateFileSecure(file, {
        allowedTypes: ['image/x-icon', 'image/png', 'image/ico'],
        maxSize: FILE_SIZE_LIMITS.avatar // 2MB for favicons
      });
      
      if (!faviconResult.valid) {
        return null;
      }
      
      // Create a secure file path
      const filePath = `public/favicons/${faviconResult.sanitizedName}`;
      
      console.log(`Uploading favicon to ${bucketId}/${filePath}`);
      
      // Check if user is authenticated first
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // For favicons, we'll create a local URL and notify the user
        toastFn({
          title: "Authentication required",
          description: "Please log in to upload files. You'll need to sign in as an admin to upload a favicon.",
          variant: "destructive",
        });
        
        // Return the temporary object URL for preview purposes only
        // This won't persist after page reload but helps show the selected image
        const tempUrl = URL.createObjectURL(file);
        console.log(`Created temporary URL for preview: ${tempUrl}`);
        return tempUrl;
      }
      
      // If authenticated, continue with normal upload
      const { error: uploadError } = await supabase.storage
        .from(bucketId)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type // Explicitly set content type
        });
  
      if (uploadError) {
        console.error('Favicon upload error:', uploadError);
        throw uploadError;
      }
  
      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage.from(bucketId).getPublicUrl(filePath);
  
      console.log(`Favicon upload successful, public URL: ${publicUrl}`);
  
      toastFn({
        title: "Upload successful",
        description: `Your favicon has been uploaded.`,
      });
  
      return publicUrl;
    } else {
      // Normal flow for other file types
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }
  
      // Create a secure file path with proper sanitization
      const filePath = generateSecureFilePath(user.id, file.name, bucketId);
  
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
        description: `Your ${type} has been uploaded.`,
      });
  
      return publicUrl;
    }
  } catch (error: any) {
    console.error('Error uploading image:', error);
    
    let errorMessage = error.message || `Failed to upload ${type}.`;
    
    // Add more specific error handling
    if (error.message?.includes('permission') || error.message?.includes('not authorized')) {
      errorMessage = `Permission denied. You may need to login again to upload files.`;
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
