
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
  
  const handleSubmit = async (data: ManualFormValues) => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please upload a PDF manual",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(10); // Start at 10%
    
    try {
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
      if (selectedFile.size > 100 * 1024 * 1024) { // If larger than 100MB
        toast({
          title: "Large file detected",
          description: "Your file is very large. The upload may take some time to complete.",
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
