
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { type DateRange } from "react-day-picker";
import { ArticleData } from "@/types/article";
import { sendArticleDeletedNotification } from "@/utils/emailUtils";

export function useArticles() {
  const [articles, setArticles] = useState<ArticleData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // Last 90 days by default
    to: new Date(),
  });
  const { toast } = useToast();
  
  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from("community_articles")
        .select("*")
        .order("is_approved", { ascending: false }) // Published articles first
        .order("published_at", { ascending: false });

      if (dateRange.from) {
        query = query.gte("created_at", dateRange.from.toISOString());
      }
      if (dateRange.to) {
        const endOfDay = new Date(dateRange.to);
        endOfDay.setHours(23, 59, 59, 999);
        query = query.lte("created_at", endOfDay.toISOString());
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateRangeChange = (newRange: DateRange | undefined) => {
    setDateRange({
      from: newRange?.from || new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      to: newRange?.to || new Date(),
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
        try {
          const { data: currentUser } = await supabase.auth.getUser();
          if (currentUser?.user?.email) {
            await sendArticleDeletedNotification(
              currentUser.user.email,
              articleData.title,
              articleData.category,
              currentUser.user.email
            );
          }
        } catch (notificationError) {
          console.error("Failed to send notification:", notificationError);
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
  
  const updateArticleStatus = async (articleId: string, isApproved: boolean) => {
    try {
      const { error } = await supabase
        .from("community_articles")
        .update({ 
          is_approved: isApproved,
          published_at: isApproved ? new Date().toISOString() : null
        })
        .eq("id", articleId);
        
      if (error) throw error;
      
      toast({
        title: isApproved ? "Article published" : "Article unpublished",
        description: `Article has been ${isApproved ? 'published' : 'moved to drafts'}.`
      });
      
      // Update local state
      setArticles(articles.map(article => 
        article.id === articleId 
          ? {...article, is_approved: isApproved, published_at: isApproved ? new Date().toISOString() : null}
          : article
      ));
      
      return true;
    } catch (error) {
      console.error("Error updating article status:", error);
      toast({
        title: "Error updating article",
        description: "Failed to update the article status. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [dateRange]);

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    articles: filteredArticles,
    isLoading,
    searchQuery,
    setSearchQuery,
    dateRange,
    handleDateRangeChange,
    fetchArticles,
    deleteArticle,
    updateArticleOrder,
    updateArticleStatus
  };
}
