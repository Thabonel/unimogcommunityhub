
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { signInWithOAuth } from '@/utils/authUtils';
import { useToast } from '@/hooks/use-toast';

interface LoginButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  className?: string;
  onClick?: () => Promise<void>;
}

export const LoginButton = ({ variant = "default", className = "", onClick }: LoginButtonProps) => {
  const { toast } = useToast();

  const handleLogin = async () => {
    if (onClick) {
      return onClick();
    }

    try {
      const { error } = await signInWithOAuth('google');

      if (error) {
        console.error("OAuth login error:", error);
        toast({
          title: "Login failed",
          description: error.message || "Could not sign in with Google",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("OAuth login error:", error);
      toast({
        title: "Login failed",
        description: error.message || "Could not sign in",
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
