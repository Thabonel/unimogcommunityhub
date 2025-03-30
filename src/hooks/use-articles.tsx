
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { type DateRange } from "react-day-picker";
import { ArticleData } from "@/types/article";
import { sendArticleDeletedNotification } from "@/utils/emailUtils";

export function useArticles() {
  const [articles, setArticles] = useState<ArticleData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(),
    to: undefined,
  });
  const { toast } = useToast();
  
  const fetchArticles = async () => {
    try {
      let query = supabase
        .from("community_articles")
        .select("*")
        .order("order", { ascending: true })
        .order("published_at", { ascending: false });

      if (dateRange.from) {
        query = query.gte("published_at", dateRange.from.toISOString());
      }
      if (dateRange.to) {
        const endOfDay = new Date(dateRange.to);
        endOfDay.setHours(23, 59, 59, 999);
        query = query.lte("published_at", endOfDay.toISOString());
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching articles:", error);
        toast({
          title: "Error fetching articles",
          description: "Failed to load articles. Please try again.",
          variant: "destructive",
        });
      } else {
        setArticles(data || []);
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
      toast({
        title: "Error fetching articles",
        description: "Failed to load articles. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDateRangeChange = (newRange: DateRange | undefined) => {
    setDateRange({
      from: newRange?.from || new Date(),
      to: newRange?.to,
    });
  };

  const deleteArticle = async (articleId: string) => {
    try {
      // First, check if article has a PDF file to delete and get article details for notification
      const { data: articleData } = await supabase
        .from("community_articles")
        .select("original_file_url, title, category")
        .eq("id", articleId)
        .single();
      
      if (!articleData) {
        throw new Error("Article not found");
      }
      
      // If article has a PDF file, delete it from storage
      if (articleData?.original_file_url) {
        const filePath = articleData.original_file_url.split('/').pop();
        if (filePath) {
          await supabase
            .storage
            .from('article_files')
            .remove([filePath]);
        }
      }

      // Then delete the article
      const { error } = await supabase
        .from("community_articles")
        .delete()
        .eq("id", articleId);

      if (error) {
        console.error("Error deleting article:", error);
        toast({
          title: "Error deleting article",
          description: "Failed to delete the article. Please try again.",
          variant: "destructive",
        });
        return false;
      } else {
        setArticles((prevArticles) =>
          prevArticles.filter((article) => article.id !== articleId)
        );
        toast({
          title: "Article deleted",
          description: "Article deleted successfully."
        });
        
        // Send email notification to admin
        const { data: currentUser } = await supabase.auth.getUser();
        if (currentUser?.user?.email) {
          await sendArticleDeletedNotification(
            currentUser.user.email,
            articleData.title,
            articleData.category,
            currentUser.user.email
          );
        }
        
        return true;
      }
    } catch (error) {
      console.error("Error deleting article:", error);
      toast({
        title: "Error deleting article",
        description: "Failed to delete the article. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateArticleOrder = async (articles: ArticleData[]) => {
    try {
      for (const article of articles) {
        const { error } = await supabase
          .from("community_articles")
          .update({ order: article.order })
          .eq("id", article.id);
        
        if (error) throw error;
      }
      
      toast({
        title: "Order updated",
        description: "Article order has been saved successfully."
      });
      
      return true;
    } catch (error) {
      console.error("Error updating article order:", error);
      toast({
        title: "Error updating order",
        description: "Failed to update the article order. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [dateRange]);

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    articles: filteredArticles,
    searchQuery,
    setSearchQuery,
    dateRange,
    handleDateRangeChange,
    fetchArticles,
    deleteArticle,
    updateArticleOrder
  };
}
