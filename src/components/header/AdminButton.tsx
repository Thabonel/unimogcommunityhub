
import { Button } from '@/components/ui/button';
import { ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AdminButtonProps {
  onClick?: () => void;
}

export const AdminButton = ({ onClick }: AdminButtonProps) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      console.log("Admin button clicked, navigating to /admin");
      navigate('/admin');
    }
  };
  
  return (
    <Button 
      onClick={handleClick}
      variant="outline"
      className="flex items-center gap-2 bg-purple-100 text-purple-900 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-900/50"
    >
      <ShieldCheck className="h-4 w-4" />
      Admin Dashboard
    </Button>
  );
};
