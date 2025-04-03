
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

    setIsLoading(true);
    
    try {
      // First try Google OAuth
      const result = await signInWithOAuth('google');
      
      if (result.error) {
        if (result.error.message?.includes('provider is not enabled')) {
          toast({
            title: "Google auth not fully configured",
            description: "Redirecting to login page with more options",
          });
          navigate('/login');
        } else {
          console.error("OAuth login error:", result.error);
          toast({
            title: "Login failed",
            description: result.error.message || "Could not sign in with Google",
            variant: "destructive",
          });
          // Fallback to login page on any error
          navigate('/login');
        }
      }
    } catch (error: any) {
      console.error("OAuth login error:", error);
      toast({
        title: "Login failed",
        description: error.message || "Could not sign in",
        variant: "destructive",
      });
      // Fallback to login page on any error
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
