
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { MAX_FILE_SIZE, uploadManual } from "@/utils/manualUploader";
import { checkForDuplicates } from "@/utils/manualDuplicateChecker";
import { ManualFormValues } from "@/types/manuals";

interface UseManualSubmissionProps {
  onSubmitSuccess: () => void;
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
      
      // Upload the manual if no duplicates found
      const success = await uploadManual(
        data,
        selectedFile,
        setUploadProgress
      );
      
      if (success) {
        onSubmitSuccess();
      }
    } finally {
      if (!isUploading) return; // Prevent resetting if we already reset due to duplicate
      
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
