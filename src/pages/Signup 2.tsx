
import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import SignupForm from '@/components/auth/SignupForm';
import { signInWithOAuth } from '@/utils/authUtils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const Signup = () => {
  const { toast } = useToast();
  const [oauthProvider, setOauthProvider] = useState<'facebook'>('facebook');
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const planType = searchParams.get('plan') || 'standard'; // Default to standard plan
  const returnTo = searchParams.get('returnTo') || '/';
  
  const handleOAuthSignUp = async (provider: 'facebook') => {
    try {
      setOauthProvider(provider);
      const { data, error } = await signInWithOAuth(provider);
      
      if (error) throw error;
      
      // Success handling delegated to auth callback
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || `Could not sign up with ${oauthProvider}`,
        variant: "destructive",
      });
      setError(error.message || `Could not sign up with ${oauthProvider}`);
    }
  };

  const handleSignupSuccess = () => {
    // Navigate to returnTo or dashboard
    navigate(returnTo || '/dashboard');
    
    // Show welcome toast
    toast({
      title: "Welcome to Unimog Community Hub!",
      description: "Your account has been created successfully.",
    });
    
    // If plan type is specified, navigate to pricing with trial already started
    if (planType && planType !== 'free') {
      navigate(`/pricing?trial=started&plan=${planType}`);
    }
  };

  const getPlanTitle = () => {
    switch(planType) {
      case 'standard': return 'Standard Plan';
      case 'lifetime': return 'Lifetime Plan';
      case 'trial': return 'Free Trial';
      default: return 'Free Plan';
    }
  };

  return (
    <Layout>
      <div className="container max-w-md py-12">
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
            <CardDescription className="text-center">
              Sign up to join the Unimog community{planType !== 'free' ? ` with our ${getPlanTitle()}` : ''}
            </CardDescription>
          </CardHeader>
          
          {error && (
            <div className="px-6 -mt-2 mb-2">
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4 mr-2" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          )}
          
          <CardContent>
            <SignupForm 
              onOAuthClick={() => handleOAuthSignUp('facebook')} 
              planType={planType as 'standard' | 'lifetime' | 'free' | 'trial'}
              onSignupSuccess={handleSignupSuccess}
              onSignupError={setError}
            />
          </CardContent>
          <CardFooter className="flex flex-col">
            <p className="text-center text-sm text-muted-foreground mt-2">
              Already have an account?{' '}
              <Link 
                to={{
                  pathname: "/login",
                  search: returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ''
                }}
                className="text-primary hover:underline"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default Signup;
