
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author_id: string;
  author_name: string;
  published_at: string;
  reading_time: number;
  cover_image?: string;
  source_url?: string;
}

export function useArticles(category?: string, limit?: number) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Fetching articles with category:", category, "limit:", limit);
      
      // Build the query for approved articles
      let query = supabase
        .from('community_articles')
        .select('*')
        .eq('is_approved', true)
        .order('published_at', { ascending: false });
      
      // Only filter by category if one is provided
      if (category) {
        query = query.eq('category', category);
      }
      
      // Add limit if provided
      if (limit) {
        query = query.limit(limit);
      }
      
      const { data, error: fetchError } = await query;
      
      if (fetchError) {
        throw fetchError;
      }
      
      console.log("Articles fetched:", data?.length || 0, "articles");
      setArticles(data || []);
    } catch (err) {
      console.error("Error fetching articles:", err);
      setError("Failed to load articles");
    } finally {
      setIsLoading(false);
    }
  }, [category, limit]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  return {
    articles,
    isLoading,
    error,
    fetchArticles
  };
}
