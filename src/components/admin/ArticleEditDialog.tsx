
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { articleSchema, ArticleFormValues } from "@/components/knowledge/types/article";
import { ArticleData } from "@/types/article";
import { ArticleFormFields } from "./article/ArticleFormFields";
import { ArticlePdfSection } from "./article/ArticlePdfSection";
import { ArticleFormActions } from "./article/ArticleFormActions";
import { useArticleEdit } from "@/hooks/use-article-edit";

interface ArticleEditDialogProps {
  article: ArticleData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ArticleEditDialog({ article, open, onOpenChange, onSuccess }: ArticleEditDialogProps) {
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

  const { 
    isSubmitting, 
    handleFileUploaded, 
    handleDownloadFile,
    submitArticleEdit 
  } = useArticleEdit({
    article,
    onSuccess
  });

  const onSubmit = async (values: ArticleFormValues) => {
    await submitArticleEdit(values);
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
