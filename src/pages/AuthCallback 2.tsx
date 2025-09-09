
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase-client';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Handle the OAuth callback
    const handleAuthCallback = async () => {
      try {
        // Get the session from the URL hash (Supabase redirects with hash params)
        const { error, data } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth callback error:", error);
          toast({
            title: "Authentication error",
            description: error.message || "Failed to authenticate",
            variant: "destructive",
          });
          navigate('/login');
        } else {
          console.log("Authentication successful:", data);
          toast({
            title: "Successfully authenticated",
            description: "You have been signed in.",
          });
          navigate('/dashboard');
        }
      } catch (err: any) {
        console.error("Auth callback error:", err);
        toast({
          title: "Authentication error",
          description: err.message || "An unexpected error occurred",
          variant: "destructive",
        });
        navigate('/login');
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Authenticating...</h2>
        <p className="text-muted-foreground">Please wait while we complete the authentication process.</p>
      </div>
    </div>
  );
};

export default AuthCallback;
