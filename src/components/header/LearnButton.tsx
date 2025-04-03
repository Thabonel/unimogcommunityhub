
import { Button } from '@/components/ui/button';
import { BookOpenCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getRandomUnimogFact } from '@/components/unimog/RandomUnimogFact';
import { useToast } from '@/hooks/use-toast';
import { startTransition } from 'react';

interface LearnButtonProps {
  onClick?: () => void;
}

export const LearnButton = ({ onClick }: LearnButtonProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleClick = () => {
    // Show a random fact in a toast
    const fact = getRandomUnimogFact();
    toast({
      title: "Unimog Fact",
      description: fact,
      duration: 5000,
    });
    
    // Continue with navigation - wrapped in startTransition to prevent suspension errors
    startTransition(() => {
      if (onClick) {
        onClick();
      } else {
        navigate('/learn');
      }
    });
  };
  
  return (
    <Button 
      onClick={handleClick}
      variant="outline"
      className="hidden md:flex items-center gap-2 text-unimog-700 hover:bg-unimog-50 dark:text-unimog-300"
    >
      <BookOpenCheck className="h-4 w-4" />
      Learn About Unimogs
    </Button>
  );
};
