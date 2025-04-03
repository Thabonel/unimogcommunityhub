
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface LoginButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  className?: string;
  onClick?: () => Promise<void>;
}

export const LoginButton = ({ variant = "default", className = "", onClick }: LoginButtonProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (onClick) {
      return onClick();
    }

    setIsLoading(true);
    
    // Always redirect to login page which provides multiple login options
    try {
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      variant={variant}
      className={`flex items-center gap-2 ${className}`}
      onClick={handleLogin}
      disabled={isLoading}
    >
      <LogIn size={18} />
      <span className="font-medium">Login</span>
    </Button>
  );
};
