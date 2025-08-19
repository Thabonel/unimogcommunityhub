
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase-client';
import { Button } from '@/components/ui/button';
import { Mail, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EmailVerificationCheckProps {
  children: React.ReactNode;
}

const EmailVerificationCheck: React.FC<EmailVerificationCheckProps> = ({ children }) => {
  const { user } = useAuth();
  const [isEmailVerified, setIsEmailVerified] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkEmailVerification = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const { data, error } = await supabase.auth.getUser();
        
        if (error) throw error;
        
        // Some providers like Google automatically verify emails
        // For email/password signups, we need to check if the email is confirmed
        const isVerified = data.user.email_confirmed_at !== null || 
                          data.user.app_metadata.provider !== 'email';
        
        setIsEmailVerified(isVerified);
      } catch (error) {
        console.error('Error checking email verification:', error);
        toast({
          title: 'Error',
          description: 'Failed to check email verification status',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkEmailVerification();
  }, [user, navigate, toast]);

  const resendVerificationEmail = async () => {
    if (!user?.email) return;
    
    setIsSendingEmail(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
      });
      
      if (error) throw error;
      
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
      setIsSendingEmail(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg">Checking verification status...</p>
      </div>
    );
  }

  if (isEmailVerified === false) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 border rounded-lg shadow-md bg-white dark:bg-gray-800">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 dark:bg-amber-900">
          <AlertCircle className="w-8 h-8 text-amber-600 dark:text-amber-400" />
        </div>
        <h2 className="mb-4 text-xl font-bold text-center">Email Verification Required</h2>
        <p className="mb-6 text-center text-muted-foreground">
          To create listings in the Unimog Marketplace, you need to verify your email address first.
        </p>
        <Button 
          className="w-full mb-4 flex items-center justify-center gap-2" 
          onClick={resendVerificationEmail}
          disabled={isSendingEmail}
        >
          <Mail className="w-4 h-4" />
          {isSendingEmail ? 'Sending...' : 'Resend Verification Email'}
        </Button>
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={() => navigate('/marketplace')}
        >
          Return to Marketplace
        </Button>
      </div>
    );
  }

  // Email is verified, render children
  return <>{children}</>;
};

export default EmailVerificationCheck;
