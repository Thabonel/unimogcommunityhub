
import { useState } from "react";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { UseFormReturn } from "react-hook-form";

// Define maximum file size (200MB in bytes)
const MAX_FILE_SIZE = 200 * 1024 * 1024;

interface FileUploadFieldProps {
  form: UseFormReturn<any>;
  onFileSelected: (file: File | null) => void;
}

export function FileUploadField({ form, onFileSelected }: FileUploadFieldProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file type
      if (file.type !== "application/pdf") {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file",
          variant: "destructive",
        });
        return;
      }
      
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "File too large",
          description: "Maximum file size is 200MB",
          variant: "destructive",
        });
        return;
      }
      
      setSelectedFile(file);
      form.setValue("fileName", file.name);
      onFileSelected(file);
    }
  };

  return (
    <FormField
      control={form.control}
      name="fileName"
      render={({ field }) => (
        <FormItem>
          <FormLabel>PDF Manual</FormLabel>
          <FormControl>
            <div className="flex items-center gap-2">
              <Input 
                type="file" 
                accept=".pdf"
                className="hidden" 
                id="manual-upload"
                onChange={handleFileChange}
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => document.getElementById("manual-upload")?.click()}
                className="gap-2"
              >
                <Upload size={16} />
                Select PDF
              </Button>
              <div className="text-sm text-muted-foreground">
                {selectedFile ? selectedFile.name : "No file selected"}
              </div>
            </div>
          </FormControl>
          <FormDescription>
            Upload a PDF file (max 200MB)
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
