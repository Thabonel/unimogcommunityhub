
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { signInWithOAuth } from '@/utils/authUtils';
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

    try {
      setIsLoading(true);
      
      // Instead of directly using OAuth, redirect to login page which provides more options
      navigate('/login');
      
      /* Keeping this code commented for reference
      const result = await signInWithOAuth('google');
      
      if (result.error) {
        if (result.error.message?.includes('provider is not enabled')) {
          toast({
            title: "Provider not enabled",
            description: "Google authentication is not enabled. Redirecting to login page.",
          });
          navigate('/login');
        } else {
          console.error("OAuth login error:", result.error);
          toast({
            title: "Login failed",
            description: result.error.message || "Could not sign in with Google",
            variant: "destructive",
          });
        }
      }
      */
    } catch (error: any) {
      console.error("OAuth login error:", error);
      toast({
        title: "Login failed",
        description: error.message || "Could not sign in",
        variant: "destructive",
      });
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
