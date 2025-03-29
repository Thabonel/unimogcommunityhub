import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Facebook, Loader2, Key } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();

  // Get the redirect path or default to dashboard
  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await signIn(email, password);
      
      if (error) throw error;
      
      toast({
        title: "Logged in successfully",
        description: "Welcome back to Unimog Community Hub!",
      });
      
      // Navigate to the page they were trying to access, or dashboard
      navigate(from);
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: 'facebook') => {
    try {
      await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Could not sign in with " + provider,
        variant: "destructive",
      });
    }
  };

  // Master login function - temporary development helper
  const handleMasterLogin = async () => {
    setIsLoading(true);
    try {
      // Use a pre-defined master email/password or create a session directly
      const masterEmail = "master@development.com";
      const masterPassword = "master123"; // Simple password for development only
      
      // Sign in with the master credentials
      const { error } = await signIn(masterEmail, masterPassword);
      
      if (error) {
        // If the master account doesn't exist yet, create it
        const { error: signUpError } = await supabase.auth.signUp({
          email: masterEmail,
          password: masterPassword,
        });
        
        if (signUpError) throw signUpError;
        
        // Try signing in again
        const { error: retryError } = await signIn(masterEmail, masterPassword);
        if (retryError) throw retryError;
      }
      
      toast({
        title: "Master login successful",
        description: "You've been logged in with master privileges for development",
      });
      
      navigate(from);
    } catch (error: any) {
      toast({
        title: "Master login failed",
        description: error.message || "Could not perform master login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container max-w-md py-12">
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Sign in</CardTitle>
            <CardDescription className="text-center">
              Enter your email and password to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input 
                  id="password" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : "Sign in"}
              </Button>
            </form>
            
            {/* Master Login Button - TEMPORARY FOR DEVELOPMENT */}
            <div className="mt-4">
              <Button 
                variant="outline" 
                className="w-full bg-amber-100 hover:bg-amber-200 border-amber-500"
                onClick={handleMasterLogin}
                disabled={isLoading}
              >
                <Key className="mr-2 h-4 w-4" />
                Development Master Login
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-1">
                For design/development purposes only
              </p>
            </div>
            
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">or continue with</span>
              </div>
            </div>
            
            <div className="w-full">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleOAuthSignIn('facebook')}
                disabled={isLoading}
              >
                <Facebook className="mr-2 h-4 w-4" />
                Facebook
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <p className="text-center text-sm text-muted-foreground mt-2">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default Login;
