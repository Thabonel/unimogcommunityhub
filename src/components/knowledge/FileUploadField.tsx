
import { useState } from "react";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { FileDropArea } from "./FileDropArea";
import { FileMetadata } from "./FileMetadata";
import { DuplicateWarning } from "./DuplicateWarning";
import { checkLargeFile, checkPotentialDuplicates, validatePdfFile } from "@/utils/fileValidation";

interface FileUploadFieldProps {
  form: UseFormReturn<any>;
  onFileSelected: (file: File | null) => void;
}

export function FileUploadField({ form, onFileSelected }: FileUploadFieldProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDuplicateWarning, setIsDuplicateWarning] = useState(false);
  const [potentialDuplicates, setPotentialDuplicates] = useState<string[]>([]);

  const handleFileSelect = async (file: File) => {
    if (!validatePdfFile(file)) {
      return;
    }
    
    // Process the valid file
    setSelectedFile(file);
    form.setValue("fileName", file.name);
    onFileSelected(file);
    
    // Check for potential duplicates
    const duplicates = await checkPotentialDuplicates(file.name);
    
    if (duplicates.length > 0) {
      setIsDuplicateWarning(true);
      setPotentialDuplicates(duplicates.map(d => d.name));
    } else {
      setIsDuplicateWarning(false);
      setPotentialDuplicates([]);
    }
    
    // Check for large files
    checkLargeFile(file);
  };

  return (
    <FormField
      control={form.control}
      name="fileName"
      render={({ field }) => (
        <FormItem>
          <FormLabel>PDF Manual</FormLabel>
          <FormControl>
            <div className="space-y-2">
              <FileDropArea onFileSelected={handleFileSelect} />
              {selectedFile && <FileMetadata file={selectedFile} />}
              {isDuplicateWarning && selectedFile && (
                <DuplicateWarning potentialDuplicates={potentialDuplicates} />
              )}
            </div>
          </FormControl>
          <FormDescription>
            Upload a PDF file (maximum 100MB). Duplicate files will not be accepted.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
