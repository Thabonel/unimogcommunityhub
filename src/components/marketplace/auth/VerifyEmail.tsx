
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export const VerifyEmail = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [resendAttempted, setResendAttempted] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkVerification = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase.auth.getUser();
        
        if (error) throw error;
        
        const emailVerified = data.user.email_confirmed_at !== null || 
                            data.user.app_metadata.provider !== 'email';
        
        setIsVerified(emailVerified);
      } catch (error) {
        console.error('Error checking email verification:', error);
      }
    };

    checkVerification();
  }, [user]);

  const handleResendVerification = async () => {
    if (!user?.email) return;
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
      });
      
      if (error) throw error;
      
      setResendAttempted(true);
      toast({
        title: 'Verification email sent',
        description: 'Please check your inbox and click the link to verify your email.',
      });
    } catch (error: any) {
      toast({
        title: 'Failed to send verification email',
        description: error.message || 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerified === null) {
    return (
      <div className="container max-w-md py-12">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
            <p className="text-center mt-4">Checking verification status...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isVerified === true) {
    return (
      <div className="container max-w-md py-12">
        <Card>
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <CardTitle className="text-xl text-center">Email Verified</CardTitle>
            <CardDescription className="text-center">
              Your email has been successfully verified
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center mb-4">
              You now have full access to all marketplace features.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => navigate('/marketplace')}>
              Return to Marketplace
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-md py-12">
      <Card>
        <CardHeader>
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-amber-500" />
          </div>
          <CardTitle className="text-xl text-center">Verify Your Email</CardTitle>
          <CardDescription className="text-center">
            You need to verify your email to access all features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center mb-6">
            We've sent a verification email to <strong>{user?.email}</strong>. Please check your inbox and click the verification link.
          </p>

          {resendAttempted ? (
            <div className="bg-green-50 border border-green-200 rounded p-4 mb-4">
              <p className="text-green-800 text-sm">
                Verification email resent. Please check your inbox, including spam/junk folders.
              </p>
            </div>
          ) : (
            <p className="text-center mb-6 text-sm text-muted-foreground">
              Didn't receive the email? Check your spam folder or resend the verification email.
            </p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button 
            onClick={handleResendVerification}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : "Resend Verification Email"}
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/marketplace')}
            className="w-full"
          >
            Return to Marketplace
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
