
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import LoginForm from '@/components/auth/LoginForm';
import SocialLogin from '@/components/auth/SocialLogin';
import DevMasterLogin from '@/components/auth/DevMasterLogin';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check for redirectFrom in state to show appropriate messages
  const redirectFrom = location.state?.from?.pathname || '';
  const showSubscriptionMessage = redirectFrom.includes('/vehicle') || 
                                  redirectFrom.includes('/trips') || 
                                  redirectFrom.includes('/community');
                                  
  const handleLoginSuccess = () => {
    // Redirect to the location they were trying to access, or dashboard
    const returnTo = location.state?.from?.pathname || '/dashboard';
    navigate(returnTo, { replace: true });
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
          
          {error && (
            <div className="px-6 -mt-2 mb-2">
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4 mr-2" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          )}
          
          {showSubscriptionMessage && !error && (
            <div className="px-6 -mt-2 mb-2">
              <Alert className="mb-4 border-amber-200 bg-amber-50 text-amber-800">
                <AlertCircle className="h-4 w-4 mr-2 text-amber-600" />
                <AlertDescription>
                  Please sign in to access {redirectFrom.includes('trips') ? 'trip planning' : 'premium content'}
                </AlertDescription>
              </Alert>
            </div>
          )}
          
          <CardContent>
            <LoginForm 
              onLoginSuccess={handleLoginSuccess} 
              onLoginError={setError}
              isLoading={isLoading} 
              setIsLoading={setIsLoading} 
            />
            
            {/* Master Login Button - TEMPORARY FOR DEVELOPMENT */}
            {process.env.NODE_ENV === 'development' && <DevMasterLogin />}
            
            <SocialLogin isLoading={isLoading} setError={setError} />
          </CardContent>
          
          <CardFooter className="flex flex-col">
            <p className="text-center text-sm text-muted-foreground mt-2">
              Don't have an account?{' '}
              <Link 
                to={{
                  pathname: "/signup", 
                  search: location.state?.from ? `?returnTo=${encodeURIComponent(location.state.from.pathname)}` : ''
                }} 
                className="text-primary hover:underline"
              >
                Sign up
              </Link>
            </p>
            <p className="text-center text-xs text-muted-foreground mt-4">
              <Link to="/reset-password" className="hover:underline">
                Forgot your password?
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default Login;
