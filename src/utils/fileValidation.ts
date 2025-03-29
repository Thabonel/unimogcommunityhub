
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface PotentialDuplicate {
  name: string;
  reason: 'filename' | 'similar';
}

// Validate PDF file type
export const validatePdfFile = (file: File): boolean => {
  if (file.type !== "application/pdf") {
    toast({
      title: "Invalid file type",
      description: "Please upload a PDF file",
      variant: "destructive",
    });
    return false;
  }
  
  return true;
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
      description: "Files over 50MB may take longer to upload. Maximum allowed is 100MB due to Supabase limitations.",
    });
  }
};
