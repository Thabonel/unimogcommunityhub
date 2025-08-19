
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';
import ArticleCard from '@/components/knowledge/ArticleCard';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ArticleData {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author_id: string;
  author_name: string;
  author_avatar?: string;
  published_at: string;
  reading_time: number;
  likes: number;
  views: number;
  category: string;
  cover_image?: string;
}

interface CommunityArticlesListProps {
  category?: string;
}

export function CommunityArticlesList({ category }: CommunityArticlesListProps) {
  const [articles, setArticles] = useState<ArticleData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        // Add cache-busting timestamp to force fresh data
        const timestamp = Date.now();
        
        // Start building query
        let query = supabase
          .from('community_articles')
          .select('*')
          .order('published_at', { ascending: false });
        
        // Filter by category if provided
        if (category && category !== 'community') {
          query = query.eq('category', category);
        }
        
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }
        
        setArticles(data as ArticleData[]);
      } catch (err) {
        console.error('Error fetching community articles:', err);
        setError('Failed to load articles. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [category]);

  // Render loading skeletons
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-3 w-[100px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Render error message
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  // Render empty state
  if (articles.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-medium mb-2">No articles found</h3>
        <p className="text-muted-foreground">
          {category 
            ? `There are no articles in the ${category} category yet.` 
            : 'There are no community articles yet.'}
        </p>
      </div>
    );
  }

  // Render articles list
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          id={article.id}
          title={article.title}
          excerpt={article.excerpt || article.content.substring(0, 120) + '...'}
          coverImage={article.cover_image}
          author={{
            id: article.author_id,
            name: article.author_name,
            avatarUrl: article.author_avatar,
          }}
          publishedAt={new Date(article.published_at).toLocaleDateString()}
          readingTime={article.reading_time || 3}
          likes={article.likes}
          views={article.views}
          categories={[article.category]}
        />
      ))}
    </div>
  );
}
