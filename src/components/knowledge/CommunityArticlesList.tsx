
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import ArticleCard from "./ArticleCard";
import { Button } from "@/components/ui/button";
import { FileText, RefreshCw } from "lucide-react";

interface CommunityArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author_id: string;
  author_name: string;
  source_url?: string;
  published_at: string;
  reading_time: number;
  cover_image?: string;
}

interface CommunityArticlesListProps {
  category?: string;
  limit?: number;
  isAdmin?: boolean;
  articles?: CommunityArticle[];
}

export function CommunityArticlesList({ 
  category, 
  limit = 6, 
  isAdmin = false,
  articles: providedArticles 
}: CommunityArticlesListProps) {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(!providedArticles);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = async () => {
    // If articles are provided as props, use those instead of fetching
    if (providedArticles) {
      // Transform to match ArticleCard props format
      const formattedArticles = providedArticles.map((article: CommunityArticle) => ({
        id: article.id,
        title: article.title,
        excerpt: article.excerpt,
        coverImage: article.cover_image || undefined,
        author: {
          id: article.author_id,
          name: article.author_name,
        },
        publishedAt: new Date(article.published_at).toLocaleDateString(),
        readingTime: article.reading_time || 3,
        likes: 0,
        views: 0,
        categories: [article.category],
        sourceUrl: article.source_url,
      }));
      
      setArticles(formattedArticles);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Build the query
      let query = supabase
        .from('community_articles')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(limit);
      
      // If this is not the admin view, only show approved articles
      // If it's admin view, show all articles regardless of approval status
      if (!isAdmin && category) {
        query = query.eq('category', category);
      } else if (!isAdmin) {
        query = query.eq('is_approved', true);
      } else if (category) {
        query = query.eq('category', category);
      }
      
      const { data, error: fetchError } = await query;
      
      if (fetchError) {
        throw fetchError;
      }
      
      // Transform to match ArticleCard props format
      const formattedArticles = data.map((article: CommunityArticle) => ({
        id: article.id,
        title: article.title,
        excerpt: article.excerpt,
        coverImage: article.cover_image || undefined,
        author: {
          id: article.author_id,
          name: article.author_name,
        },
        publishedAt: new Date(article.published_at).toLocaleDateString(),
        readingTime: article.reading_time || 3,
        likes: 0,
        views: 0,
        categories: [article.category],
        sourceUrl: article.source_url,
      }));
      
      setArticles(formattedArticles);
    } catch (err) {
      console.error("Error fetching community articles:", err);
      setError("Failed to load community articles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [category, limit, isAdmin, providedArticles]);

  const handleArticleDeleted = () => {
    fetchArticles();
  };

  const handleArticleMoved = () => {
    fetchArticles();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="flex flex-col items-center">
          <RefreshCw className="h-8 w-8 animate-spin text-primary mb-2" />
          <p className="text-muted-foreground">Loading articles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="flex flex-col items-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={fetchArticles}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="flex flex-col items-center text-center">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No articles found</h3>
          <p className="text-muted-foreground mb-4">
            {category 
              ? `There are no ${category.toLowerCase()} articles available yet.` 
              : "There are no community articles available yet."}
          </p>
          <p className="text-muted-foreground">
            Be the first to share your knowledge with the community!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {articles.map((article) => (
        <ArticleCard 
          key={article.id} 
          {...article} 
          isAdmin={isAdmin}
          onArticleDeleted={handleArticleDeleted}
          onArticleMoved={handleArticleMoved}
        />
      ))}
    </div>
  );
}
