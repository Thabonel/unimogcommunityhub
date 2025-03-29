
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
import { FileUpload, Upload } from "lucide-react";

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

  const onSubmit = (data: ManualFormValues) => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please upload a PDF manual",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    // Simulate API call to upload file and submit form
    setTimeout(() => {
      // In a real implementation, you would upload the file and save the form data
      console.log("Submitted manual:", data, "File:", selectedFile);
      
      toast({
        title: "Manual submitted",
        description: "Your manual has been submitted for review",
      });
      
      setIsUploading(false);
      onSubmitSuccess();
    }, 1500);
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

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isUploading} className="gap-2">
            {isUploading ? (
              <>Uploading...</>
            ) : (
              <>
                <FileUpload size={16} />
                Submit Manual
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
