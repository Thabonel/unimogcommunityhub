
import { useState, useEffect, useCallback } from 'react';
import { Article } from "@/types/article";
import { fetchAdminArticles } from "@/services/adminArticleService";

export function useAdminArticles(category?: string, limit: number = 50) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Function to manually trigger a refresh
  const refresh = useCallback(() => {
    console.log("Manually triggering refresh of admin articles");
    setRefreshTrigger(prev => prev + 1);
  }, []);

  // Function to remove an article from the local state
  const removeArticle = useCallback((id: string) => {
    console.log("Removing article from local state:", id);
    setArticles(prevArticles => prevArticles.filter(article => article.id !== id));
  }, []);

  // Function to update an article in the local state
  const updateArticle = useCallback((id: string, data: Partial<Article>) => {
    console.log("Updating article in local state:", id, data);
    setArticles(prevArticles => 
      prevArticles.map(article => 
        article.id === id ? { ...article, ...data } : article
      )
    );
  }, []);

  // Fetch articles from the database
  const loadArticles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Fetching admin articles with category:", category);
      
      const { data, error: fetchError } = await fetchAdminArticles(category, limit);
      
      if (fetchError) {
        throw fetchError;
      }
      
      console.log("Admin articles fetched:", data?.length || 0, "articles");
      setArticles(data || []);
    } catch (err) {
      console.error("Error fetching admin articles:", err);
      setError("Failed to load articles");
    } finally {
      setIsLoading(false);
    }
  }, [category, limit]);

  // Effect to fetch articles when dependencies change or refresh is triggered
  useEffect(() => {
    loadArticles();
  }, [loadArticles, refreshTrigger]);

  return {
    articles,
    isLoading,
    error,
    refresh,
    removeArticle,
    updateArticle
  };
}
