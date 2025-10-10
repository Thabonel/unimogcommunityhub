import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase-client';
import { sendPasswordResetConfirmation } from '@/utils/email/orderEmails';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation('auth');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: t('errors.email_send_failed'),
        description: t('validation.email_required'),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      // Send a confirmation email using our custom email service
      try {
        await sendPasswordResetConfirmation(email);
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
        // We don't want to fail the password reset if just the confirmation email fails
      }

      setIsSubmitted(true);
      toast({
        title: t('forgot_password.success_title'),
        description: t('forgot_password.success_description'),
      });

    } catch (error: any) {
      toast({
        title: t('errors.email_send_failed'),
        description: error.message || t('errors.email_send_failed'),
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
            <CardTitle className="text-2xl font-bold text-center">{t('forgot_password.title')}</CardTitle>
            <CardDescription className="text-center">
              {t('forgot_password.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSubmitted ? (
              <div className="text-center space-y-4">
                <div className="rounded-full bg-green-100 p-3 w-12 h-12 mx-auto flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-muted-foreground">
                  {t('forgot_password.success_message')}
                </p>
                <Button asChild className="mt-4">
                  <Link to="/login">{t('forgot_password.return_to_login')}</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t('forgot_password.email_label')}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('forgot_password.email_placeholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('forgot_password.submitting')}
                    </>
                  ) : t('forgot_password.submit')}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex flex-col">
            <p className="text-center text-sm text-muted-foreground mt-2">
              {t('forgot_password.remember_password')}{' '}
              <Link to="/login" className="text-primary hover:underline">
                {t('forgot_password.signin_link')}
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
