
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function BackToKnowledge() {
  const navigate = useNavigate();
  
  return (
    <Button 
      variant="ghost" 
      className="flex items-center" 
      onClick={() => navigate('/knowledge')}
    >
      <ArrowLeft className="mr-2" size={16} />
      Back to Knowledge Base
    </Button>
  );
}
