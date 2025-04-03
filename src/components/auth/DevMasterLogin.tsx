
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Key, Loader2, ShieldCheck } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

const DevMasterLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect path or default to dashboard
  const from = location.state?.from?.pathname || "/dashboard";

  // Master login function - temporary development helper
  const handleMasterLogin = async () => {
    setIsLoading(true);
    try {
      // Use a pre-defined master email/password
      const masterEmail = "master@development.com";
      const masterPassword = "master123";
      
      // First, try to sign in with the master credentials
      const { error } = await supabase.auth.signInWithPassword({
        email: masterEmail,
        password: masterPassword,
      });
      
      if (error) {
        console.log("Master login error, attempting to create account:", error.message);
        
        // If the master account doesn't exist yet, create it
        const { error: signUpError } = await supabase.auth.signUp({
          email: masterEmail,
          password: masterPassword,
        });
        
        if (signUpError) {
          console.log("Failed to create master account:", signUpError.message);
          throw signUpError;
        }
        
        console.log("Master account created, attempting login again");
        
        // Try signing in again after creating the account
        const { error: retryError } = await supabase.auth.signInWithPassword({
          email: masterEmail,
          password: masterPassword,
        });
        
        if (retryError) {
          console.log("Second login attempt failed:", retryError.message);
          throw retryError;
        }
      }
      
      toast({
        title: "Master login successful",
        description: "You've been logged in with master privileges for development",
      });
      
      navigate(from);
    } catch (error: any) {
      console.error("Master login failed with error:", error.message);
      toast({
        title: "Master login failed",
        description: error.message || "Could not perform master login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToAdmin = () => {
    navigate('/admin');
  };

  return (
    <div className="mt-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full bg-amber-100 hover:bg-amber-200 border-amber-500"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              <>
                <Key className="mr-2 h-4 w-4" />
                Development Options
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-56 bg-white">
          <DropdownMenuItem onClick={handleMasterLogin} className="cursor-pointer">
            <Key className="mr-2 h-4 w-4" />
            <span>Development Master Login</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={navigateToAdmin} className="cursor-pointer">
            <ShieldCheck className="mr-2 h-4 w-4" />
            <span>Go to Admin Dashboard</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <p className="text-xs text-muted-foreground text-center mt-1">
        For design/development purposes only
      </p>
    </div>
  );
};

export default DevMasterLogin;
