
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Facebook, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { signInWithOAuth } from '@/utils/authUtils';

interface SocialSignupProps {
  isLoading: boolean;
}

export const SocialSignup = ({ isLoading }: SocialSignupProps) => {
  const { toast } = useToast();
  
  const handleOAuthSignUp = async (provider: 'facebook' | 'google') => {
    try {
      await signInWithOAuth(provider);
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || `Could not sign up with ${provider}`,
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">or continue with</span>
        </div>
      </div>
      
      <div className="flex flex-col space-y-2">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => handleOAuthSignUp('facebook')}
          disabled={isLoading}
        >
          <Facebook className="mr-2 h-4 w-4" />
          Facebook
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => handleOAuthSignUp('google')}
          disabled={isLoading}
        >
          <Mail className="mr-2 h-4 w-4" />
          Google
        </Button>
      </div>
    </div>
  );
};
