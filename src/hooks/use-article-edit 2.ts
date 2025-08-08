
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArticleFormValues } from "@/components/knowledge/types/article";
import { ArticleData } from "@/types/article";

interface UseArticleEditOptions {
  article: ArticleData;
  onSuccess: () => void;
}

export function useArticleEdit({ article, onSuccess }: UseArticleEditOptions) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(article.original_file_url || null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileUploaded = (url: string, fileName: string) => {
    setUploadedFileUrl(url);
    setUploadedFileName(fileName);
  };

  const handleDownloadFile = () => {
    if (article.original_file_url) {
      window.open(article.original_file_url, '_blank');
    }
  };

  const submitArticleEdit = async (values: ArticleFormValues) => {
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

  return {
    isSubmitting,
    uploadedFileUrl,
    uploadedFileName,
    handleFileUploaded,
    handleDownloadFile,
    submitArticleEdit
  };
}
