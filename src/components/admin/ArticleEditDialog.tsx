
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { articleSchema, ArticleFormValues } from "@/components/knowledge/types/article";
import { ArticleData } from "@/types/article";
import { ArticleFormFields } from "./article/ArticleFormFields";
import { ArticlePdfSection } from "./article/ArticlePdfSection";
import { ArticleFormActions } from "./article/ArticleFormActions";

interface ArticleEditDialogProps {
  article: ArticleData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ArticleEditDialog({ article, open, onOpenChange, onSuccess }: ArticleEditDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(article.original_file_url || null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const { toast } = useToast();

  // Initialize form with article data
  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category as any, // Cast to match the enum type
      sourceUrl: article.source_url || "",
      originalFileUrl: article.original_file_url || "",
    },
  });

  const handleFileUploaded = (url: string, fileName: string) => {
    setUploadedFileUrl(url);
    setUploadedFileName(fileName);
    form.setValue("originalFileUrl", url);
  };

  const handleDownloadFile = () => {
    if (article.original_file_url) {
      window.open(article.original_file_url, '_blank');
    }
  };

  const onSubmit = async (values: ArticleFormValues) => {
    setIsSubmitting(true);
    try {
      // Update article in the database
      const { error } = await supabase
        .from('community_articles')
        .update({
          title: values.title,
          excerpt: values.excerpt,
          content: values.content,
          category: values.category,
          source_url: values.sourceUrl || null,
          original_file_url: uploadedFileUrl || article.original_file_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', article.id);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Article updated successfully",
        description: "The article has been updated",
      });
      
      onSuccess();
    } catch (error) {
      console.error("Error updating article:", error);
      toast({
        title: "Update failed",
        description: "There was a problem updating the article. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Article</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ArticleFormFields form={form} />
            
            <div className="space-y-4">
              <ArticlePdfSection
                originalFileUrl={article.original_file_url}
                isSubmitting={isSubmitting}
                onFileUploaded={handleFileUploaded}
                onDownload={handleDownloadFile}
              />
            </div>
            
            <ArticleFormActions 
              isSubmitting={isSubmitting}
              onCancel={() => onOpenChange(false)}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
