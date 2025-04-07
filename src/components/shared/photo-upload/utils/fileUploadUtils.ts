
import { supabase } from '@/lib/supabase';
import { ToastOptions } from '@/hooks/toast/types';

// Maximum number of retry attempts for bucket operations
const MAX_RETRIES = 3;
// Delay between retries (in milliseconds)
const RETRY_DELAY = 1000;

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

// Helper function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Verifies if a bucket exists and creates it if needed
export const verifyBucket = async (bucketId: string): Promise<boolean> => {
  console.log(`Verifying bucket: ${bucketId}`);
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`Verification attempt ${attempt} for bucket: ${bucketId}`);
      
      // Check if the bucket exists
      const { data, error } = await supabase.storage.getBucket(bucketId);
      
      if (error) {
        console.log(`Bucket check error:`, error.message);
        
        // If bucket doesn't exist, create it
        if (error.message.includes('The resource was not found')) {
          console.log(`Creating bucket ${bucketId} on attempt ${attempt}...`);
          
          const { error: createError } = await supabase.storage.createBucket(bucketId, { 
            public: true 
          });
          
          if (createError) {
            console.error(`Error creating bucket ${bucketId}:`, createError);
            
            if (attempt < MAX_RETRIES) {
              console.log(`Will retry in ${RETRY_DELAY}ms...`);
              await delay(RETRY_DELAY);
              continue;
            }
            
            return false;
          }
          
          // Set public bucket access
          const { error: updateError } = await supabase.storage.updateBucket(bucketId, {
            public: true
          });
          
          if (updateError) {
            console.error(`Error setting bucket ${bucketId} to public:`, updateError);
          }
          
          console.log(`Successfully created bucket: ${bucketId} (public: true)`);
          return true;
        } else {
          // If it's another error, retry if we have attempts left
          if (attempt < MAX_RETRIES) {
            console.log(`Will retry bucket check in ${RETRY_DELAY}ms...`);
            await delay(RETRY_DELAY);
            continue;
          }
          
          console.error(`Failed to verify bucket ${bucketId} after ${MAX_RETRIES} attempts:`, error);
          return false;
        }
      }
      
      // Bucket exists, ensure it's public
      console.log(`Bucket ${bucketId} exists, ensuring it's public`);
      const { error: updateError } = await supabase.storage.updateBucket(bucketId, {
        public: true
      });
      
      if (updateError) {
        console.error(`Error setting bucket ${bucketId} to public:`, updateError);
      } else {
        console.log(`Bucket ${bucketId} confirmed as public`);
      }
      
      return true;
    } catch (error) {
      console.error(`Unexpected error verifying bucket ${bucketId}:`, error);
      
      if (attempt < MAX_RETRIES) {
        console.log(`Will retry in ${RETRY_DELAY}ms...`);
        await delay(RETRY_DELAY);
      } else {
        console.error(`Failed to verify bucket ${bucketId} after ${MAX_RETRIES} attempts due to unexpected error`);
        return false;
      }
    }
  }
  
  return false;
};

// Verifies if a file exists in storage
export const verifyImageExists = async (
  imageUrl: string | null
): Promise<boolean> => {
  if (!imageUrl) return false;
  
  try {
    console.log(`Verifying image exists: ${imageUrl}`);
    
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

// Uploads a file to Supabase Storage
export const uploadFile = async (
  file: File,
  bucketId: string,
  toastFn: (options: ToastOptions) => void,
  type: 'profile' | 'vehicle'
): Promise<string | null> => {
  try {
    console.log(`Starting upload to bucket: ${bucketId}`);

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Create a unique file path with user ID and timestamp
    const userId = user.id;
    const fileExt = file.name.split('.').pop();
    const timestamp = Date.now();
    const fileName = `${userId}/${timestamp}.${fileExt}`;
    const filePath = fileName;

    console.log(`Uploading file to ${bucketId}/${filePath} (content-type: ${file.type})`);

    // Verify the bucket exists before upload
    const bucketExists = await verifyBucket(bucketId);
    if (!bucketExists) {
      console.error(`Failed to verify bucket: ${bucketId}`);
      throw new Error(`Storage not ready: Failed to verify bucket ${bucketId}`);
    }

    // Clear any old cached data (if same path was used before)
    try {
      await supabase.storage.from(bucketId).remove([filePath]);
      console.log(`Cleared any existing file at ${bucketId}/${filePath}`);
    } catch (e) {
      // Ignore errors if file doesn't exist
      console.log("No existing file to clear or couldn't remove (this is normal for new uploads)");
    }

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

    return publicUrl;
  } catch (error: any) {
    console.error('Error uploading image:', error);
    
    // Provide more specific error messages based on the error type
    let errorMessage = error.message || `Failed to upload ${type} photo.`;
    
    if (error.message?.includes('permission') || error.message?.includes('not authorized')) {
      errorMessage = `Permission denied. You may need to login again to upload photos.`;
    } else if (error.message?.includes('storage') || error.message?.includes('bucket')) {
      errorMessage = `Storage error: ${error.message}. Please try again or contact support.`;
    }
    
    toastFn({
      title: "Upload failed",
      description: errorMessage,
      variant: "destructive",
    });
    
    return null;
  }
};
