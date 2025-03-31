
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface ArticleErrorProps {
  error: string;
}

export function ArticleError({ error }: ArticleErrorProps) {
  const navigate = useNavigate();
  
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
