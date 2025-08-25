
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/lib/supabase-client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { articleSchema, ArticleFormValues } from "./types/article";
import { ArticleMetadataFields } from "./ArticleMetadataFields";
import { ArticleContentEditor } from "./ArticleContentEditor";
import { ArticleFileUploader } from "./ArticleFileUploader";

interface ArticleSubmissionFormProps {
  onSuccess: () => void;
  defaultCategory?: "Maintenance" | "Repair" | "Adventures" | "Modifications" | "Tyres";
}

export function ArticleSubmissionForm({ onSuccess, defaultCategory }: ArticleSubmissionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"write" | "upload">("write");
  const [isConverting, setIsConverting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      content: "",
      category: defaultCategory || "Maintenance",
      sourceUrl: "",
      originalFileUrl: "",
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
        original_file_url: values.originalFileUrl || null,
        author_id: user.id,
        author_name: user.user_metadata.full_name || user.email,
        published_at: new Date().toISOString(),
        reading_time: Math.ceil(values.content.split(" ").length / 200), // Estimate reading time
        is_archived: false,
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

  return (
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "write" | "upload")}>
      <TabsList className="grid grid-cols-2 mb-6">
        <TabsTrigger value="write">Write Article</TabsTrigger>
        <TabsTrigger value="upload">Upload File</TabsTrigger>
      </TabsList>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <ArticleMetadataFields form={form} />
          
          <TabsContent value="upload" className="mt-0">
            <ArticleFileUploader 
              form={form} 
              isConverting={isConverting} 
              setIsConverting={setIsConverting} 
            />
          </TabsContent>
          
          <ArticleContentEditor form={form} />
          
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting || isConverting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Article"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </Tabs>
  );
}
