
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { supabase } from '@/lib/supabase';
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
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/auth-callback`,
          scopes: 'email,public_profile'
        }
      });

      if (error) {
        console.error("Facebook login error:", error);
        toast({
          title: "Login failed",
          description: error.message || "Could not sign in with Facebook",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Facebook login error:", error);
      toast({
        title: "Login failed",
        description: error.message || "Could not sign in with Facebook",
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
