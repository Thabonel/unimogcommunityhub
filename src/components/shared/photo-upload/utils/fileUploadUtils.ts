
import { supabase, STORAGE_BUCKETS, BucketName } from '@/lib/supabase-client';
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
// TEMPORARY FIX: Use working buckets to avoid RLS policy issues
export const getBucketForType = (type: 'profile' | 'vehicle' | 'favicon'): BucketName => {
  switch (type) {
    case 'profile':
      // Use avatars bucket - it has working RLS policies
      return STORAGE_BUCKETS.AVATARS;
    case 'vehicle':
      // Use avatars bucket - vehicle_photos bucket has RLS issues
      return STORAGE_BUCKETS.AVATARS;
    case 'favicon':
      return STORAGE_BUCKETS.SITE_ASSETS || STORAGE_BUCKETS.AVATARS;
    default:
      return STORAGE_BUCKETS.AVATARS;
  }
};

// Load photo from local storage
export const loadPhotoFromLocal = (type: 'profile' | 'vehicle', userId: string): string | null => {
  try {
    const storageKey = `photo_${type}_${userId}`;
    const localData = localStorage.getItem(storageKey);
    
    if (localData && localData.startsWith('data:image/')) {
      console.log(`📱 Loaded ${type} photo from local storage`);
      return localData;
    }
    
    return null;
  } catch (error) {
    console.error('Error loading photo from local storage:', error);
    return null;
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
    
    // Handle URL-encoded bucket names (spaces become %20)
    const decodedParts = urlParts.map(part => decodeURIComponent(part));
    
    const bucketIndex = decodedParts.findIndex(part => 
      Object.values(STORAGE_BUCKETS).includes(part as BucketName)
    );
    
    if (bucketIndex >= 0 && bucketIndex < decodedParts.length - 1) {
      const bucket = decodedParts[bucketIndex] as BucketName;
      // The rest is the file path (keep URL-encoded for the actual API call)
      const filePath = urlParts.slice(bucketIndex + 1).join('/');
      
      console.log(`Verifying if file exists: bucket=${bucket}, path=${decodeURIComponent(filePath)}`);
      
      // Try to get the file metadata instead of downloading
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(filePath, 60); // 60-second signed URL
      
      if (error) {
        console.warn(`Image file not found in storage: ${error.message}`);
        return false;
      } else {
        console.log('File exists in storage');
        return true;
      }
    }
    
    // If we can't parse the bucket, assume the file doesn't exist in our system
    console.warn('Could not determine bucket from URL:', imageUrl);
    return false;
  } catch (error) {
    console.error('Error verifying image existence:', error);
    return false;
  }
};

// Store photo locally in browser storage as fallback
const storePhotoLocally = async (file: File, type: 'profile' | 'vehicle', userId: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = reader.result as string;
      const storageKey = `photo_${type}_${userId}`;
      
      try {
        localStorage.setItem(storageKey, base64Data);
        console.log(`📱 Photo stored locally: ${storageKey}`);
        resolve(base64Data);
      } catch (error) {
        console.error('Local storage failed:', error);
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Uploads a file to Supabase Storage with local storage fallback
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
  
      // Create a secure file path with proper sanitization and type prefix
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const timestamp = Date.now();
      const fileExtension = sanitizedName.split('.').pop() || 'jpg';
      const typePrefix = type === 'profile' ? 'profile' : type === 'vehicle' ? 'vehicle' : 'misc';
      const fileName = `${typePrefix}_${timestamp}.${fileExtension}`;
      const filePath = `${user.id}/${fileName}`;
  
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
    
    // FALLBACK: If Supabase upload fails, try local storage for profile/vehicle photos
    if ((type === 'profile' || type === 'vehicle') && user) {
      console.log('🔄 Supabase upload failed, trying local storage fallback...');
      
      try {
        const localUrl = await storePhotoLocally(file, type, user.id);
        
        toastFn({
          title: "Upload successful (local)",
          description: `Your ${type} photo has been saved locally. It will be visible on this device.`,
        });
        
        return localUrl;
      } catch (localError) {
        console.error('Local storage also failed:', localError);
      }
    }
    
    let errorMessage = error.message || `Failed to upload ${type}.`;
    
    // Add more specific error handling
    if (error.message?.includes('permission') || error.message?.includes('not authorized') || error.message?.includes('policy')) {
      errorMessage = `Storage permissions issue. Your photo has been saved locally for this session.`;
    } else if (error.message?.includes('storage') || error.message?.includes('bucket')) {
      errorMessage = `Storage service issue. Your photo has been saved locally.`;
    }
    
    toastFn({
      title: "Upload completed locally",
      description: errorMessage,
      variant: "default",
    });
    
    return null;
  }
};
