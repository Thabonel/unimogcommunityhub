
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface ArticleLoadingStateProps {
  isLoading: boolean;
  error: string | null;
}

export function ArticleLoadingState({ isLoading, error }: ArticleLoadingStateProps) {
  const navigate = useNavigate();
  
  if (isLoading) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">Loading article...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
        <Button 
          onClick={() => navigate('/knowledge')}
          className="mt-4"
        >
          Return to Knowledge Base
        </Button>
      </div>
    );
  }
  
  return null;
}
