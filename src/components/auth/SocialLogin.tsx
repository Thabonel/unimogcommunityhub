
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Github, Mail } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

export interface SocialLoginProps {
  isLoading: boolean;
  setError: (error: string) => void;
}

const SocialLogin = ({ isLoading, setError }: SocialLoginProps) => {
  const [isOAuthLoading, setIsOAuthLoading] = useState<boolean>(false);

  const handleOAuthLogin = async (provider: 'github' | 'google') => {
    try {
      setIsOAuthLoading(true);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth-callback`,
        }
      });
      
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("OAuth login error:", error);
      setError(error instanceof Error ? error.message : "Failed to sign in with social provider");
    } finally {
      setIsOAuthLoading(false);
    }
  };
  
  return (
    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-2 gap-3">
        <Button 
          variant="outline" 
          type="button" 
          disabled={isLoading || isOAuthLoading} 
          onClick={() => handleOAuthLogin('github')}
        >
          <Github className="mr-2 h-4 w-4" />
          Github
        </Button>
        
        <Button 
          variant="outline" 
          type="button" 
          disabled={isLoading || isOAuthLoading} 
          onClick={() => handleOAuthLogin('google')}
        >
          <Mail className="mr-2 h-4 w-4" />
          Google
        </Button>
      </div>
    </div>
  );
};

export default SocialLogin;
