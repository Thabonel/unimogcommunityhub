
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Facebook } from 'lucide-react';
import { signInWithOAuth } from '@/utils/authUtils';

interface SocialLoginProps {
  isLoading: boolean;
}

const SocialLogin = ({ isLoading }: SocialLoginProps) => {
  const { toast } = useToast();
  const [providersLoading, setProvidersLoading] = useState<Record<string, boolean>>({
    facebook: false
  });
  
  const handleOAuthSignIn = async (provider: 'facebook') => {
    try {
      setProvidersLoading(prev => ({ ...prev, [provider]: true }));
      
      // Call the signInWithOAuth function with the provider
      const { error } = await signInWithOAuth(provider);
      
      if (error) {
        if (error.message?.includes('provider is not enabled')) {
          toast({
            title: "Provider not enabled",
            description: "Facebook authentication is not enabled in your Supabase project. Please enable it in the Supabase dashboard.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      }
      // No need to handle successful case here as the redirect will happen automatically
      
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Could not sign in with Facebook",
        variant: "destructive",
      });
      setProvidersLoading(prev => ({ ...prev, [provider]: false }));
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
          onClick={() => handleOAuthSignIn('facebook')}
          disabled={isLoading || providersLoading.facebook}
        >
          <Facebook className="mr-2 h-4 w-4" />
          Facebook
        </Button>
      </div>
    </div>
  );
};

export default SocialLogin;
