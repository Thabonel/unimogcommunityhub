
import { Button } from '@/components/ui/button';
import { BookOpenCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LearnButton = () => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    // Navigate to the learn about unimogs page
    navigate('/learn');
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
