
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { ArticleFormValues } from "./types/article";
import { useToast } from "@/hooks/use-toast";
import { processFile } from "@/utils/fileProcessingUtils";
import { FileDropArea } from "./FileDropArea";
import { FileConversionStatus } from "./FileConversionStatus";
import { FileUploadError } from "./FileUploadError";

interface ArticleFileUploaderProps {
  form: UseFormReturn<ArticleFormValues>;
  isConverting: boolean;
  setIsConverting: (value: boolean) => void;
}

export function ArticleFileUploader({ form, isConverting, setIsConverting }: ArticleFileUploaderProps) {
  const [fileError, setFileError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    setFileError(null);
    
    if (!file) return;

    try {
      setIsConverting(true);
      
      toast({
        title: "Processing document",
        description: "Please wait while we extract text from your file...",
      });
      
      const { content, fileType } = await processFile(file);
      
      // Set content to the form
      form.setValue("content", content);
      
      // Set title from filename if none exists
      if (!form.getValues("title") && file.name) {
        const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
        form.setValue("title", fileName);
      }

      // Generate excerpt if none exists
      if (!form.getValues("excerpt")) {
        const cleanContent = content.replace(/Note: .+formatting may be lost\.\n\n/g, '');
        const excerpt = cleanContent.slice(0, 150) + (cleanContent.length > 150 ? '...' : '');
        form.setValue("excerpt", excerpt);
      }

      toast({
        title: `${fileType} processed`,
        description: "File content has been loaded successfully",
      });
    } catch (error) {
      console.error("Error handling file upload:", error);
      setFileError(typeof error === 'object' && error !== null && 'message' in error 
        ? String(error.message) 
        : "Could not process the file. Please try a different file format.");
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div>
      <div className="space-y-4">
        <FileDropArea onFileSelected={handleFileUpload} />
        <FileConversionStatus isConverting={isConverting} />
      </div>
      <FileUploadError error={fileError} />
    </div>
  );
}
