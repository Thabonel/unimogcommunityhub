
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Normalize a title or filename for comparison
export const normalizeText = (text: string): string => {
  return text.toLowerCase()
    .replace(/\.[^/.]+$/, '') // Remove file extension
    .replace(/^uhb-|^unimog-|-uhb$|-unimog$/g, '')  // Remove common prefixes/suffixes
    .replace(/[_\-\s]+/g, '')  // Remove separators
    .trim();
};

// Check for duplicates in both storage and database
export const checkForDuplicates = async (
  fileName: string,
  fileSize: number,
  title: string
): Promise<boolean> => {
  try {
    // Check storage for duplicates by filename
    const { data: storageFiles, error: storageError } = await supabase
      .storage
      .from('manuals')
      .list();
    
    if (storageError) throw storageError;
    
    // Normalize both the new file name and the existing file names for comparison
    const normalizedFileName = normalizeText(fileName);
    const normalizedTitle = normalizeText(title);
    
    // Check for filename duplicates with better detection
    for (const file of storageFiles) {
      // Check exact filename match
      if (file.name === fileName) {
        toast({
          title: "Duplicate file detected",
          description: "A file with this exact name already exists in the library",
          variant: "destructive",
        });
        return true;
      }
      
      // Check normalized name similarity
      const normalizedStorageName = normalizeText(file.name);
      if (
        normalizedStorageName === normalizedFileName ||
        (normalizedStorageName.length > 5 && normalizedFileName.length > 5 && 
          (normalizedStorageName.includes(normalizedFileName) || 
           normalizedFileName.includes(normalizedStorageName)))
      ) {
        toast({
          title: "Potential duplicate detected",
          description: `"${file.name}" seems very similar to your file. Please verify this is not a duplicate.`,
          variant: "destructive",
        });
        return true;
      }
    }
    
    // Check database for duplicates by title and file size
    const { data: databaseManuals, error: dbError } = await supabase
      .from('manuals')
      .select('*');
    
    if (dbError) throw dbError;
    
    if (databaseManuals && databaseManuals.length > 0) {
      // Check for exact title match
      const exactTitleMatch = databaseManuals.find(
        manual => manual.title.toLowerCase() === title.toLowerCase()
      );
      
      if (exactTitleMatch) {
        toast({
          title: "Duplicate title detected",
          description: "A manual with this exact title already exists in the library",
          variant: "destructive",
        });
        return true;
      }
      
      // Check for normalized title similarity
      for (const manual of databaseManuals) {
        const normalizedManualTitle = normalizeText(manual.title);
        
        if (
          normalizedManualTitle === normalizedTitle ||
          (normalizedManualTitle.length > 5 && normalizedTitle.length > 5 && 
           (normalizedManualTitle.includes(normalizedTitle) || 
            normalizedTitle.includes(normalizedManualTitle)))
        ) {
          toast({
            title: "Potential duplicate detected",
            description: `"${manual.title}" seems very similar to your title. Please verify this is not a duplicate.`,
            variant: "destructive",
          });
          return true;
        }
      }
      
      // Check for size match with small tolerance (could be same manual)
      const sizeMatch = databaseManuals.some(
        manual => Math.abs(manual.file_size - fileSize) < 1024 // 1KB tolerance
      );
      
      if (sizeMatch) {
        toast({
          title: "Possible duplicate detected",
          description: "A manual with identical file size already exists. Please check if you're uploading a duplicate",
          variant: "destructive",
        });
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error("Error checking for duplicates:", error);
    // In case of error checking duplicates, we allow upload to continue
    return false;
  }
};
