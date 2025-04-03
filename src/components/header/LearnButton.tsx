
import { Button } from '@/components/ui/button';
import { BookOpenCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LearnButtonProps {
  onClick?: () => void;
}

export const LearnButton = ({ onClick }: LearnButtonProps) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate('/learn-about-unimogs');
    }
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
