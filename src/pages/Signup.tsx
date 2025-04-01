
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import SignupForm from '@/components/auth/SignupForm';
import { signInWithOAuth } from '@/utils/authUtils';

const Signup = () => {
  const { toast } = useToast();
  const [oauthProvider, setOauthProvider] = useState<'facebook' | 'google'>('google');

  const handleOAuthSignUp = async (provider: 'facebook' | 'google') => {
    try {
      setOauthProvider(provider);
      const { data, error } = await signInWithOAuth(provider);
      
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || `Could not sign up with ${oauthProvider}`,
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="container max-w-md py-12">
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
            <CardDescription className="text-center">
              Enter your details to create an account and join our community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignupForm onOAuthClick={() => handleOAuthSignUp('google')} />
          </CardContent>
          <CardFooter className="flex flex-col">
            <p className="text-center text-sm text-muted-foreground mt-2">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline">
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
