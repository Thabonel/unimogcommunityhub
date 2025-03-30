
import { CommunityArticlesList } from './CommunityArticlesList';
import { RefreshCw, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Article } from '@/types/article';
import { useState } from 'react';

interface AdminArticleListProps {
  category?: string;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  articles: Article[];
  onArticleDeleted?: (articleId: string) => void;
  onArticleMoved?: (articleId: string) => void;
}

export function AdminArticleList({ 
  category, 
  isLoading, 
  error, 
  onRetry,
  articles,
  onArticleDeleted,
  onArticleMoved
}: AdminArticleListProps) {
  // State to track articles being deleted for better UI feedback
  const [deletingArticles, setDeletingArticles] = useState<string[]>([]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="flex flex-col items-center">
          <RefreshCw className="h-8 w-8 animate-spin text-primary mb-2" />
          <p className="text-muted-foreground">Loading articles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="flex flex-col items-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={onRetry}>Try Again</Button>
        </div>
      </div>
    );
  }
  
  if (articles.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="flex flex-col items-center">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            No articles found {category ? `in ${category}` : ""}.
          </p>
        </div>
      </div>
    );
  }

  const handleArticleDeleted = (articleId: string) => {
    console.log("AdminArticleList: Article deleted with ID:", articleId);
    // Remove article from the deleting list
    setDeletingArticles(prev => prev.filter(id => id !== articleId));
    
    if (onArticleDeleted) {
      onArticleDeleted(articleId);
    }
  };

  const handleArticleMoved = (articleId: string) => {
    console.log("AdminArticleList: Article moved with ID:", articleId);
    if (onArticleMoved) {
      onArticleMoved(articleId);
    }
  };

  // Filter out any articles that are currently being deleted
  const displayedArticles = articles.filter(article => !deletingArticles.includes(article.id));

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">
        {category ? `${category} Articles` : "All Articles"}
      </h2>
      <div className="overflow-hidden">
        <CommunityArticlesList 
          category={category} 
          limit={50} 
          isAdmin={true}
          articles={displayedArticles}
          onArticleDeleted={handleArticleDeleted}
          onArticleMoved={handleArticleMoved}
        />
      </div>
    </div>
  );
}
