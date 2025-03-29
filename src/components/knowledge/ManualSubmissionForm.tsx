
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { FileUp, Upload, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

const manualFormSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  fileName: z.string().optional(),
});

type ManualFormValues = z.infer<typeof manualFormSchema>;

interface ManualSubmissionFormProps {
  onSubmitSuccess: () => void;
}

export function ManualSubmissionForm({ onSubmitSuccess }: ManualSubmissionFormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const form = useForm<ManualFormValues>({
    resolver: zodResolver(manualFormSchema),
    defaultValues: {
      title: "",
      description: "",
      fileName: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== "application/pdf") {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
      form.setValue("fileName", file.name);
    }
  };

  const onSubmit = async (data: ManualFormValues) => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please upload a PDF manual",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    
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
      
      // Set up progress tracking
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          // Simulate progress until we get actual progress
          if (prev < 90) return prev + 5;
          return prev;
        });
      }, 300);
      
      // Upload the file to Supabase Storage
      const { error: uploadError, data: fileData } = await supabase.storage
        .from('manuals')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });
        
      clearInterval(progressInterval);
      setUploadProgress(100);
        
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
      setUploadProgress(0);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter manual title" {...field} />
              </FormControl>
              <FormDescription>
                Name of the manual (e.g. "U1700L Electrical Systems Guide")
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter a brief description of the manual" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Explain what information the manual contains
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
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
                Upload a PDF file (max 20MB)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {isUploading && uploadProgress > 0 && (
          <div className="w-full bg-secondary rounded-full h-2.5 mb-4">
            <div 
              className="bg-primary h-2.5 rounded-full" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
            <p className="text-xs text-muted-foreground mt-1 text-right">
              {uploadProgress}% uploaded
            </p>
          </div>
        )}

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isUploading} className="gap-2">
            {isUploading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <FileUp size={16} />
                Submit Manual
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
