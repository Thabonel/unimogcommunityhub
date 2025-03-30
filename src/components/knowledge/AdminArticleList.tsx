
import { CommunityArticlesList } from './CommunityArticlesList';
import { Table, TableHeader, TableRow, TableHead, TableBody } from '@/components/ui/table';
import { RefreshCw, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminArticleListProps {
  category?: string;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

export function AdminArticleList({ 
  category, 
  isLoading, 
  error, 
  onRetry 
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
        />
      </div>
    </div>
  );
}
