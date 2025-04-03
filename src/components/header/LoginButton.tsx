
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { signInWithOAuth } from '@/utils/authUtils';

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

    // Navigate directly to the login page instead of attempting OAuth
    navigate('/login');
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
