
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

interface UseManualSubmissionProps {
  onSubmitSuccess: () => void;
}

interface ManualFormValues {
  title: string;
  description: string;
  fileName?: string;
}

export function useManualSubmission({ onSubmitSuccess }: UseManualSubmissionProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
  };

  // Maximum file size: 100MB (in bytes)
  const MAX_FILE_SIZE = 100 * 1024 * 1024;
  
  // Normalize a title or filename for comparison
  const normalizeText = (text: string): string => {
    return text.toLowerCase()
      .replace(/\.[^/.]+$/, '') // Remove file extension
      .replace(/^uhb-|^unimog-|-uhb$|-unimog$/g, '')  // Remove common prefixes/suffixes
      .replace(/[_\-\s]+/g, '')  // Remove separators
      .trim();
  };
  
  const checkForDuplicates = async (fileName: string, fileSize: number, title: string): Promise<boolean> => {
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
  
  const handleSubmit = async (data: ManualFormValues) => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please upload a PDF manual",
        variant: "destructive",
      });
      return;
    }

    // Check if file is too large (over 100MB)
    if (selectedFile.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: "Files must be under 100MB due to Supabase limitations. Please compress your PDF or split it into smaller parts.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(5); // Start at 5%
    
    try {
      // Check for duplicates before proceeding
      const isDuplicate = await checkForDuplicates(
        selectedFile.name,
        selectedFile.size,
        data.title
      );
      
      if (isDuplicate) {
        setIsUploading(false);
        setUploadProgress(0);
        return;
      }
      
      setUploadProgress(15); // Continue progress after duplicate check
      
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication error",
          description: "You must be logged in to submit a manual",
          variant: "destructive",
        });
        setIsUploading(false);
        return;
      }
      
      // Generate a unique file path to prevent naming conflicts
      const fileExt = selectedFile.name.split('.').pop();
      const filePath = `${uuidv4()}.${fileExt}`;
      
      // Increment progress to show we're starting the upload
      setUploadProgress(30);
      
      // For very large files, inform the user this may take some time
      if (selectedFile.size > 50 * 1024 * 1024) { // If larger than 50MB
        toast({
          title: "Large file detected",
          description: "Your file is large. The upload may take some time to complete.",
        });
      }
      
      // Since we can't use onUploadProgress directly, we'll simulate progress
      // Start a progress simulation
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          // Cap the progress at 90% until we confirm the upload is complete
          return prev < 90 ? prev + 1 : prev;
        });
      }, 1000);
      
      // Upload the file to Supabase Storage in the 'manuals' bucket
      const { error: uploadError, data: fileData } = await supabase.storage
        .from('manuals')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });
        
      // Clear the interval once upload is complete
      clearInterval(progressInterval);
      
      // Set progress to 95% if we completed the file upload
      setUploadProgress(95);
        
      if (uploadError) {
        console.error("Error uploading manual:", uploadError);
        if (uploadError.message.includes("exceeded the maximum allowed size")) {
          throw new Error("The file is too large. Supabase limits uploads to 100MB. Please compress your PDF or split it into smaller parts.");
        }
        throw new Error(uploadError.message);
      }
      
      // Get the public URL of the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('manuals')
        .getPublicUrl(filePath);
        
      // Save metadata to the manuals table
      const { error: dbError } = await supabase
        .from('manuals')
        .insert({
          title: data.title,
          description: data.description,
          file_path: filePath,
          file_size: selectedFile.size,
          submitted_by: user.id,
          approved: false, // All manuals start as unapproved
        });
        
      if (dbError) {
        // If there was an error saving to the database, delete the uploaded file
        await supabase.storage.from('manuals').remove([filePath]);
        throw new Error(dbError.message);
      }
      
      // Finally set progress to 100% when everything is complete
      setUploadProgress(100);
      
      toast({
        title: "Manual submitted",
        description: "Your manual has been submitted for review",
      });
      
      onSubmitSuccess();
    } catch (error: any) {
      console.error("Error uploading manual:", error);
      toast({
        title: "Upload failed",
        description: error.message || "An error occurred while uploading the manual",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Only reset progress after a short delay so the user can see 100% or the error state
      setTimeout(() => {
        setUploadProgress(0);
      }, 1000);
    }
  };
  
  return {
    isUploading,
    uploadProgress,
    selectedFile,
    handleFileSelect,
    handleSubmit
  };
}
