/**
 * Image compression utility for optimizing uploads
 * Reduces file size while maintaining quality for profile photos
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSizeMB?: number;
}

/**
 * Compress an image file before upload
 * @param file - The image file to compress
 * @param options - Compression options
 * @returns Compressed image file
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.85,
    maxSizeMB = 2
  } = options;

  // If file is already small enough, return as is
  if (file.size <= maxSizeMB * 1024 * 1024) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth || height > maxHeight) {
          const aspectRatio = width / height;
          
          if (width > height) {
            width = maxWidth;
            height = width / aspectRatio;
          } else {
            height = maxHeight;
            width = height * aspectRatio;
          }
        }
        
        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress image
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to blob with compression
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image'));
              return;
            }
            
            // Create new file from blob
            const compressedFile = new File(
              [blob],
              file.name,
              { type: 'image/jpeg', lastModified: Date.now() }
            );
            
            // If still too large, try with lower quality
            if (compressedFile.size > maxSizeMB * 1024 * 1024 && quality > 0.5) {
              compressImage(file, { ...options, quality: quality - 0.1 })
                .then(resolve)
                .catch(reject);
            } else {
              resolve(compressedFile);
            }
          },
          'image/jpeg',
          quality
        );
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * Convert HEIC/HEIF to JPEG (for iPhone photos)
 * Note: This requires the browser to support these formats
 * @param file - The HEIC/HEIF file
 * @returns Converted JPEG file
 */
export async function convertHeicToJpeg(file: File): Promise<File> {
  // Check if file is HEIC/HEIF
  const isHeic = file.type === 'image/heic' || 
                 file.type === 'image/heif' ||
                 file.name.toLowerCase().endsWith('.heic') ||
                 file.name.toLowerCase().endsWith('.heif');
  
  if (!isHeic) {
    return file;
  }
  
  // For now, we'll just return the file as browsers that support HEIC
  // will handle it automatically. For full support, you'd need a 
  // library like heic2any
  return file;
}

/**
 * Get image dimensions from a file
 * @param file - The image file
 * @returns Image dimensions
 */
export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * Format file size for display
 * @param bytes - File size in bytes
 * @returns Formatted string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}