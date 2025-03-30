
import { CommunityArticlesList } from './CommunityArticlesList';
import { Table, TableHeader, TableRow, TableHead, TableBody } from '@/components/ui/table';
import { RefreshCw, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

interface AdminArticleListProps {
  category?: string;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  articles: Article[];
}

export function AdminArticleList({ 
  category, 
  isLoading, 
  error, 
  onRetry,
  articles
}: AdminArticleListProps) {
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
          articles={articles}
        />
      </div>
    </div>
  );
}
