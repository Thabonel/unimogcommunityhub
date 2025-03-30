
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { signInWithOAuth } from '@/utils/authUtils';

interface LoginButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  className?: string;
}

export const LoginButton = ({ variant = "default", className = "" }: LoginButtonProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async () => {
    try {
      await signInWithOAuth('google');
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Error",
        description: "Could not sign in. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button 
      variant={variant}
      className={`flex items-center gap-2 ${className}`}
      onClick={handleLogin}
    >
      <LogIn size={18} />
      <span className="font-medium">Login</span>
    </Button>
  );
};
