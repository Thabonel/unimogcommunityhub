
import { useState, useRef, useEffect } from "react";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { UseFormReturn } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FileUploadFieldProps {
  form: UseFormReturn<any>;
  onFileSelected: (file: File | null) => void;
}

export function FileUploadField({ form, onFileSelected }: FileUploadFieldProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDuplicateWarning, setIsDuplicateWarning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    // Check file type
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

  // Check for potential duplicates by filename only
  const checkPotentialDuplicates = async (fileName: string) => {
    try {
      const { data: storageFiles, error } = await supabase
        .storage
        .from('manuals')
        .list();
      
      if (error) {
        console.error("Error checking for duplicates:", error);
        return;
      }
      
      // Check for filename similarities
      const baseName = fileName.split('.')[0].toLowerCase();
      const similarFiles = storageFiles.filter(file => {
        const storageBaseName = file.name.split('.')[0].toLowerCase();
        return storageBaseName.includes(baseName) || baseName.includes(storageBaseName);
      });
      
      if (similarFiles.length > 0) {
        setIsDuplicateWarning(true);
      } else {
        setIsDuplicateWarning(false);
      }
    } catch (error) {
      console.error("Error checking for duplicates:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (validateFile(file)) {
        setSelectedFile(file);
        form.setValue("fileName", file.name);
        onFileSelected(file);
        
        // Check for potential duplicates
        checkPotentialDuplicates(file.name);
        
        // Inform user about large files
        if (file.size > 50 * 1024 * 1024) {
          toast({
            title: "Large file detected",
            description: "Files over 50MB may take longer to upload. Maximum allowed is 100MB due to Supabase limitations.",
          });
        }
      } else {
        // Clear the input field if validation fails
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      
      if (validateFile(file)) {
        setSelectedFile(file);
        form.setValue("fileName", file.name);
        onFileSelected(file);
        
        // Check for potential duplicates
        checkPotentialDuplicates(file.name);
        
        // Inform user about large files
        if (file.size > 50 * 1024 * 1024) {
          toast({
            title: "Large file detected",
            description: "Files over 50MB may take longer to upload. Maximum allowed is 100MB due to Supabase limitations.",
          });
        }
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <FormField
      control={form.control}
      name="fileName"
      render={({ field }) => (
        <FormItem>
          <FormLabel>PDF Manual</FormLabel>
          <FormControl>
            <div 
              className={`flex flex-col border-2 border-dashed rounded-md p-6 ${
                isDragging ? "border-primary bg-primary/10" : "border-muted-foreground/25"
              } transition-colors text-center hover:bg-muted`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <Input 
                type="file" 
                accept=".pdf"
                className="hidden" 
                id="manual-upload"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <div className="flex flex-col items-center gap-2">
                <Upload size={36} className="text-muted-foreground" />
                <p className="text-sm font-medium">
                  Drag and drop your PDF here or{" "}
                  <Button 
                    type="button" 
                    variant="link" 
                    onClick={handleButtonClick}
                    className="p-0 h-auto font-medium"
                  >
                    browse files
                  </Button>
                </p>
                <p className="text-xs text-muted-foreground">
                  PDF files only (max 100MB)
                </p>
              </div>
              {selectedFile && (
                <div className="mt-4 p-2 bg-secondary rounded-md text-sm">
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              )}
              
              {isDuplicateWarning && selectedFile && (
                <Alert variant="warning" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    The filename is similar to existing manuals. Please check to avoid duplicates.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </FormControl>
          <FormDescription>
            Upload a PDF file (maximum 100MB). Duplicate files will not be accepted.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    </FormField>
  );
}
