import { toast } from "@/hooks/use-toast";
import { supabase } from '@/lib/supabase-client';

export interface PotentialDuplicate {
  name: string;
  reason: 'filename' | 'similar';
}

// Allowed file types configuration
export const ALLOWED_FILE_TYPES = {
  images: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
  documents: ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  manuals: ['application/pdf'],
  all: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
};

// File size limits in bytes
export const FILE_SIZE_LIMITS = {
  avatar: 2 * 1024 * 1024,        // 2MB
  image: 5 * 1024 * 1024,         // 5MB
  document: 10 * 1024 * 1024,     // 10MB
  manual: 50 * 1024 * 1024,       // 50MB
  max: 50 * 1024 * 1024           // 50MB (Supabase limit)
};

// Validate file type against allowed types
export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  if (!allowedTypes.includes(file.type)) {
    toast({
      title: "Invalid file type",
      description: `Please upload one of: ${allowedTypes.join(', ')}`,
      variant: "destructive",
    });
    return false;
  }
  
  // Additional security: Check file extension matches MIME type
  const extension = file.name.toLowerCase().split('.').pop();
  const expectedExtensions: Record<string, string[]> = {
    'image/jpeg': ['jpg', 'jpeg'],
    'image/png': ['png'],
    'image/webp': ['webp'],
    'image/gif': ['gif'],
    'application/pdf': ['pdf'],
    'text/plain': ['txt'],
    'application/msword': ['doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['docx']
  };
  
  const validExtensions = expectedExtensions[file.type];
  if (validExtensions && extension && !validExtensions.includes(extension)) {
    toast({
      title: "File type mismatch",
      description: "File extension doesn't match the file type",
      variant: "destructive",
    });
    return false;
  }
  
  return true;
};

// Validate file size
export const validateFileSize = (file: File, maxSize: number): boolean => {
  if (file.size > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024));
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    toast({
      title: "File too large",
      description: `File size ${fileSizeMB}MB exceeds maximum allowed ${maxSizeMB}MB`,
      variant: "destructive",
    });
    return false;
  }
  
  return true;
};

// Validate PDF file type (backwards compatibility)
export const validatePdfFile = (file: File): boolean => {
  return validateFileType(file, ['application/pdf']);
};

// Sanitize filename to prevent security issues
export const sanitizeFilename = (filename: string): string => {
  // Remove path traversal attempts
  let sanitized = filename.replace(/\.\./g, '');
  
  // Remove special characters except allowed ones
  sanitized = sanitized.replace(/[^a-zA-Z0-9._-]/g, '_');
  
  // Ensure filename is not empty and has an extension
  if (!sanitized || sanitized === '.' || !sanitized.includes('.')) {
    sanitized = `file_${Date.now()}.bin`;
  }
  
  // Limit filename length
  const parts = sanitized.split('.');
  const extension = parts.pop() || 'bin';
  const name = parts.join('.');
  if (name.length > 100) {
    sanitized = `${name.substring(0, 100)}.${extension}`;
  }
  
  return sanitized;
};

// Comprehensive file validation
export const validateFile = (
  file: File, 
  options: {
    allowedTypes?: string[],
    maxSize?: number,
    category?: 'avatar' | 'image' | 'document' | 'manual'
  } = {}
): { valid: boolean; sanitizedName: string } => {
  const { 
    allowedTypes = ALLOWED_FILE_TYPES.all, 
    maxSize = FILE_SIZE_LIMITS.max,
    category 
  } = options;
  
  // Use category-specific limits if provided
  const actualMaxSize = category ? FILE_SIZE_LIMITS[category] : maxSize;
  const actualAllowedTypes = category 
    ? (category === 'image' || category === 'avatar' ? ALLOWED_FILE_TYPES.images : ALLOWED_FILE_TYPES.documents)
    : allowedTypes;
  
  // Validate file type
  if (!validateFileType(file, actualAllowedTypes)) {
    return { valid: false, sanitizedName: '' };
  }
  
  // Validate file size
  if (!validateFileSize(file, actualMaxSize)) {
    return { valid: false, sanitizedName: '' };
  }
  
  // Sanitize filename
  const sanitizedName = sanitizeFilename(file.name);
  
  return { valid: true, sanitizedName };
};

// Enhanced duplicate detection by normalizing filenames
export const checkPotentialDuplicates = async (fileName: string): Promise<PotentialDuplicate[]> => {
  try {
    const { data: storageFiles, error } = await supabase
      .storage
      .from('manuals')
      .list();
    
    if (error) {
      console.error("Error checking for duplicates:", error);
      return [];
    }
    
    // Normalize the input filename
    const normalizedName = fileName.split('.')[0].toLowerCase()
      .replace(/^uhb-|^unimog-|-uhb$|-unimog$/g, '')  // Remove common prefixes/suffixes
      .replace(/[_\-\s]+/g, '');  // Remove separators
    
    const duplicates: PotentialDuplicate[] = [];
    
    storageFiles.forEach(file => {
      const storageNormalizedName = file.name.split('.')[0].toLowerCase()
        .replace(/^uhb-|^unimog-|-uhb$|-unimog$/g, '')
        .replace(/[_\-\s]+/g, '');
        
      // Check for significant similarity
      const isSimilar = 
        // Exact match after normalization
        storageNormalizedName === normalizedName ||
        // One contains the other (allowing for prefix/suffix variations)
        storageNormalizedName.includes(normalizedName) || 
        normalizedName.includes(storageNormalizedName);
      
      if (isSimilar) {
        duplicates.push({
          name: file.name,
          reason: file.name === fileName ? 'filename' : 'similar'
        });
      }
    });
    
    return duplicates;
  } catch (error) {
    console.error("Error checking for duplicates:", error);
    return [];
  }
};

// Check for large files and show a toast notification if needed
export const checkLargeFile = (file: File): void => {
  if (file.size > 50 * 1024 * 1024) {
    toast({
      title: "Large file detected",
      description: "Files over 50MB may take longer to upload. Maximum allowed is 50MB due to Supabase limitations.",
    });
  }
};

// Generate secure file path with user isolation
export const generateSecureFilePath = (userId: string, filename: string, bucket: string): string => {
  const timestamp = Date.now();
  const sanitized = sanitizeFilename(filename);
  
  // Create user-isolated paths
  if (bucket === 'avatars' || bucket === 'profile_photos') {
    return `${userId}/${timestamp}_${sanitized}`;
  } else if (bucket === 'vehicle_photos') {
    return `${userId}/vehicles/${timestamp}_${sanitized}`;
  } else if (bucket === 'manuals' || bucket === 'article_files') {
    return `${userId}/uploads/${timestamp}_${sanitized}`;
  }
  
  // Default fallback
  return `${userId}/${timestamp}_${sanitized}`;
};