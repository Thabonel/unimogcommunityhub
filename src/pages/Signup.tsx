
import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import SignupForm from '@/components/auth/SignupForm';
import { signInWithOAuth } from '@/utils/authUtils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const Signup = () => {
  const { toast } = useToast();
  const { t } = useTranslation('auth');
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
        title: t('errors.signup_failed'),
        description: error.message || `${t('errors.oauth_signup_failed')} ${oauthProvider}`,
        variant: "destructive",
      });
      setError(error.message || `${t('errors.oauth_signup_failed')} ${oauthProvider}`);
    }
  };

  const handleSignupSuccess = () => {
    // Navigate to profile setup - conversion tracking happens after profile completion
    navigate('/profile/setup');
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
            <CardTitle className="text-2xl font-bold text-center">{t('signup.title')}</CardTitle>
            <CardDescription className="text-center">
              {t('signup.description')} <span className="font-semibold text-primary">{t('signup.free_trial')}</span> {t('signup.access_all')}
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
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-800 text-center">
                <strong>{t('signup.privacy_notice')}</strong> {t('signup.privacy_text')}
              </p>
            </div>
            <SignupForm
              onOAuthClick={() => handleOAuthSignUp('facebook')}
              planType={planType as 'standard' | 'lifetime' | 'free' | 'trial'}
              onSignupSuccess={handleSignupSuccess}
              onSignupError={setError}
            />
          </CardContent>
          <CardFooter className="flex flex-col">
            <p className="text-center text-sm text-muted-foreground mt-2">
              {t('signup.have_account')}{' '}
              <Link
                to={{
                  pathname: "/login",
                  search: returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ''
                }}
                className="text-primary hover:underline"
              >
                {t('signup.login_link')}
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default Signup;
