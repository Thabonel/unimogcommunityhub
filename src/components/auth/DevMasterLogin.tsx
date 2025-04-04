
import { useState, useEffect } from 'react';
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
  const [loginAttempted, setLoginAttempted] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect path or default to dashboard
  const from = location.state?.from?.pathname || "/dashboard";

  // Check if we're already logged in when component mounts
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        console.log("DevMasterLogin: Active session found on mount", 
          { user: data.session.user.email });
      }
    };
    
    checkSession();
  }, []);

  // Master login function - temporary development helper
  const handleMasterLogin = async () => {
    setIsLoading(true);
    setLoginError(null);
    setLoginAttempted(true);
    
    try {
      console.log("Starting master login process...");
      
      // First, check if there's an existing session and sign out from it
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session) {
        console.log("Existing session found. Signing out first...", 
          { user: sessionData.session.user.email });
        await supabase.auth.signOut();
        console.log("Successfully signed out of existing session");
        
        // Add a longer delay after signout before proceeding
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      
      // Use a pre-defined master email/password
      const masterEmail = "master@development.com";
      const masterPassword = "master123";
      
      console.log("Attempting master login with:", masterEmail);
      
      // Try to sign in with the master credentials
      const { error, data } = await supabase.auth.signInWithPassword({
        email: masterEmail,
        password: masterPassword,
      });
      
      if (error) {
        console.log("Master login error, attempting to create account:", error.message);
        
        // If the master account doesn't exist yet, create it
        const { error: signUpError, data: signUpData } = await supabase.auth.signUp({
          email: masterEmail,
          password: masterPassword,
          options: {
            data: {
              full_name: "Development Master",
              display_name: "Master User"
            }
          }
        });
        
        if (signUpError) {
          console.log("Failed to create master account:", signUpError.message);
          throw signUpError;
        }
        
        console.log("Master account created successfully:", signUpData);
        
        // Wait longer before trying to log in again
        console.log("Waiting before attempting login again...");
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Try signing in again after creating the account
        console.log("Attempting second login...");
        const { error: retryError, data: retryData } = await supabase.auth.signInWithPassword({
          email: masterEmail,
          password: masterPassword,
        });
        
        if (retryError) {
          console.log("Second login attempt failed:", retryError.message);
          throw retryError;
        }
        
        console.log("Second login attempt successful:", retryData);
      } else {
        console.log("Master login successful:", data);
      }
      
      // Verify we have a session and create a profile if needed
      const { data: finalCheck } = await supabase.auth.getSession();
      
      if (!finalCheck.session) {
        throw new Error("Failed to establish a session after login");
      }
      
      // Create or update master profile
      try {
        const masterProfile = {
          id: finalCheck.session.user.id,
          email: masterEmail,
          full_name: "Development Master",
          display_name: "Master User",
          bio: "Development testing account",
          unimog_model: "U1700L (Dev)",
          unimog_series: "Development Series",
          avatar_url: "", // Add a default avatar if desired
          location: "Development Environment",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        // Use upsert with onConflict to ensure the profile is created or updated
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert(masterProfile);
          
        if (profileError) {
          console.log("Profile creation error:", profileError.message);
        } else {
          console.log("Master profile created or updated successfully");
        }
      } catch (profileErr) {
        console.log("Error creating profile:", profileErr);
        // Don't throw, we want to continue even if profile creation fails
      }
      
      toast({
        title: "Master login successful",
        description: "You've been logged in with master privileges for development",
      });
      
      // Clear any previous navigation state to start fresh
      window.history.replaceState({}, document.title);
      
      // Force a longer delay before navigation to ensure session is properly established
      console.log("Waiting before navigation...");
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      console.log("Navigating to dashboard...");
      
      // Directly navigate to dashboard with replace to avoid navigation issues
      navigate('/dashboard', { replace: true });
    } catch (error: any) {
      console.error("Master login failed with error:", error.message);
      setLoginError(error.message);
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
    // In development mode, simply navigate to admin
    navigate('/admin');
  };

  return (
    <div className="mt-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className={`w-full ${loginError ? 'bg-red-50' : 'bg-amber-100'} hover:bg-amber-200 border-amber-500`}
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
        {loginAttempted && loginError && (
          <span className="block text-red-500 mt-1">{loginError}</span>
        )}
      </p>
    </div>
  );
};

export default DevMasterLogin;
