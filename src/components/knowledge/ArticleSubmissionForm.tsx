import { useState, useRef } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, LinkIcon, Upload, AlertCircle, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import * as pdfjsLib from 'pdfjs-dist';

// Set the worker source for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const articleSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  excerpt: z.string().min(10, "Summary must be at least 10 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  category: z.enum(["Maintenance", "Repair", "Adventures", "Modifications", "Tyres"]),
  sourceUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
});

type ArticleFormValues = z.infer<typeof articleSchema>;

export function ArticleSubmissionForm({ onSuccess }: { onSuccess: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"write" | "upload">("write");
  const [fileError, setFileError] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      content: "",
      category: "Maintenance",
      sourceUrl: "",
    },
  });

  const onSubmit = async (values: ArticleFormValues) => {
    setIsSubmitting(true);
    try {
      // Get the current authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "You must be logged in to submit an article",
          variant: "destructive",
        });
        return;
      }
      
      // Prepare article data
      const articleData = {
        title: values.title,
        excerpt: values.excerpt,
        content: values.content,
        category: values.category,
        source_url: values.sourceUrl || null,
        author_id: user.id,
        author_name: user.user_metadata.full_name || user.email,
        published_at: new Date().toISOString(),
        reading_time: Math.ceil(values.content.split(" ").length / 200), // Estimate reading time
      };
      
      // Insert into the database
      const { error } = await supabase
        .from('community_articles')
        .insert(articleData);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Article submitted successfully",
        description: "Your article has been submitted for review",
      });
      
      onSuccess();
      form.reset();
      
    } catch (error) {
      console.error("Error submitting article:", error);
      toast({
        title: "Error submitting article",
        description: "There was a problem submitting your article. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const extractTextFromPDF = async (file: File): Promise<string> => {
    setIsConverting(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      
      // Extract text from each page
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n\n';
      }
      
      return fullText;
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      throw new Error('Could not extract text from PDF');
    } finally {
      setIsConverting(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = event.target.files?.[0];
    
    if (!file) return;

    // Check file size - limit to 5MB
    if (file.size > 5 * 1024 * 1024) {
      setFileError("File too large. Please upload a file smaller than 5MB.");
      return;
    }

    try {
      let content = '';
      let fileType = '';
      
      // Handle PDF files
      if (file.type === 'application/pdf') {
        fileType = 'PDF';
        toast({
          title: "Converting PDF",
          description: "Please wait while we extract text from your PDF...",
        });
        content = await extractTextFromPDF(file);
      } 
      // Handle text files
      else if (file.type.includes('text/') || file.type === 'application/json' || 
          file.type.includes('document') || file.type === 'application/octet-stream') {
        fileType = 'Text Document';
        const reader = new FileReader();
        
        content = await new Promise<string>((resolve, reject) => {
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.onerror = () => reject(new Error('Error reading file'));
          reader.readAsText(file);
        });
      } else {
        setFileError("Please upload a text document (PDF, TXT, DOC, DOCX, RTF, MD)");
        return;
      }
      
      // Set content to the form
      form.setValue("content", content);
      
      // Try to extract a title if none is set
      if (!form.getValues("title") && file.name) {
        const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
        form.setValue("title", fileName);
      }

      // Generate excerpt if none exists
      if (!form.getValues("excerpt")) {
        const excerpt = content.slice(0, 150) + (content.length > 150 ? '...' : '');
        form.setValue("excerpt", excerpt);
      }

      toast({
        title: `${fileType} processed`,
        description: "File content has been loaded successfully",
      });
    } catch (error) {
      console.error("Error handling file upload:", error);
      setFileError("Could not process the file. Please try a different file.");
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "write" | "upload")}>
      <TabsList className="grid grid-cols-2 mb-6">
        <TabsTrigger value="write">Write Article</TabsTrigger>
        <TabsTrigger value="upload">Upload File</TabsTrigger>
      </TabsList>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Article Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter a descriptive title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Repair">Repair</SelectItem>
                    <SelectItem value="Adventures">Adventures</SelectItem>
                    <SelectItem value="Modifications">Modifications</SelectItem>
                    <SelectItem value="Tyres">Tyres</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the most appropriate category for your article
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <TabsContent value="upload" className="mt-0">
            <div className="space-y-4">
              <div>
                <FormLabel htmlFor="file-upload">Upload Article File</FormLabel>
                <div className="mt-1">
                  <div 
                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 cursor-pointer hover:bg-muted transition-colors flex flex-col items-center justify-center"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {isConverting ? (
                      <div className="flex flex-col items-center space-y-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <p className="text-sm font-medium">Converting PDF...</p>
                      </div>
                    ) : (
                      <>
                        <FileText className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-sm font-medium">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          PDF, TXT, DOC, DOCX, RTF, MD (max 5MB)
                        </p>
                      </>
                    )}
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".pdf,.txt,.doc,.docx,.rtf,.md,.json"
                      disabled={isConverting}
                    />
                  </div>
                  {fileError && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{fileError}</AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <FormField
            control={form.control}
            name="excerpt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Summary</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Write a brief summary of your article" 
                    className="h-20"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Write your full article content here" 
                    className="h-60"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="sourceUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Source URL (Optional)</FormLabel>
                <FormControl>
                  <div className="flex items-center">
                    <LinkIcon className="w-4 h-4 mr-2 text-muted-foreground" />
                    <Input placeholder="https://facebook.com/groups/unimog/..." {...field} />
                  </div>
                </FormControl>
                <FormDescription>
                  If you're sharing content from Facebook or another site, please include the original link
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting || isConverting}>
              {isSubmitting ? "Submitting..." : "Submit Article"}
            </Button>
          </div>
        </form>
      </Form>
    </Tabs>
  );
}
