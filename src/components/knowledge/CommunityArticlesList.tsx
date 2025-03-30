import { useState } from 'react';
import ArticleCard from './ArticleCard';
import { Grid, Loader } from 'lucide-react';
import { useArticles } from '@/hooks/use-articles';
import { formatDistanceToNow } from 'date-fns';

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

interface CommunityArticlesListProps {
  category?: string;
  limit?: number;
  isAdmin?: boolean;
  articles?: Article[];
  onArticleDeleted?: () => void;
  onArticleMoved?: () => void;
}

export function CommunityArticlesList({ 
  category, 
  limit = 10, 
  isAdmin = false,
  articles: providedArticles,
  onArticleDeleted,
  onArticleMoved
}: CommunityArticlesListProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Use provided articles if available, otherwise fetch them
  const { articles: fetchedArticles, isLoading } = useArticles(
    providedArticles ? undefined : category, 
    providedArticles ? undefined : limit
  );
  
  const articles = providedArticles || fetchedArticles;
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <div className="flex gap-1 bg-muted p-1 rounded-md">
          <button
            className={`p-1 rounded ${viewMode === 'grid' ? 'bg-background shadow-sm' : ''}`}
            onClick={() => setViewMode('grid')}
          >
            <Grid size={18} />
          </button>
          <button
            className={`p-1 rounded ${viewMode === 'list' ? 'bg-background shadow-sm' : ''}`}
            onClick={() => setViewMode('list')}
          >
            <div className="flex flex-col gap-[2px]">
              <div className="h-[2px] w-4 bg-current"></div>
              <div className="h-[2px] w-4 bg-current"></div>
              <div className="h-[2px] w-4 bg-current"></div>
            </div>
          </button>
        </div>
      </div>
      
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
        {articles?.map((article) => (
          <ArticleCard
            key={article.id}
            id={article.id}
            title={article.title}
            excerpt={article.excerpt}
            coverImage={article.cover_image}
            author={{
              id: article.author_id,
              name: article.author_name,
            }}
            publishedAt={formatRelativeDate(article.published_at)}
            readingTime={article.reading_time || 3}
            likes={0}
            views={0}
            categories={[article.category]}
            isAdmin={isAdmin}
            onArticleDeleted={onArticleDeleted}
            onArticleMoved={onArticleMoved}
          />
        ))}
      </div>
    </div>
  );
}

function formatRelativeDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (e) {
    return dateString;
  }
}
