
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase-client';
import { checkPasswordStrength } from '@/utils/auth-validation';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hashPresent, setHashPresent] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation('auth');

  useEffect(() => {
    // Check if URL contains the hash fragment which indicates this is a valid reset link
    if (window.location.hash) {
      setHashPresent(true);
    } else {
      toast({
        title: t('reset_password.invalid_link_title'),
        description: t('reset_password.invalid_link_description'),
        variant: "destructive",
      });
      navigate('/login');
    }
  }, [navigate, toast, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast({
        title: t('errors.password_reset_failed'),
        description: t('validation.all_fields_required'),
        variant: "destructive",
      });
      return;
    }

    const passwordCheck = checkPasswordStrength(password);
    if (!passwordCheck.isValid) {
      toast({
        title: t('errors.password_reset_failed'),
        description: passwordCheck.feedback.join('. '),
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: t('errors.password_reset_failed'),
        description: t('validation.passwords_no_match'),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password
      });

      if (error) throw error;

      toast({
        title: t('reset_password.success_title'),
        description: t('reset_password.success_description'),
      });

      navigate('/login');
    } catch (error: any) {
      toast({
        title: t('errors.password_reset_failed'),
        description: error.message || t('errors.password_reset_failed'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!hashPresent) {
    return null; // Don't render anything if there's no hash (user will be redirected)
  }

  return (
    <Layout>
      <div className="container max-w-md py-12">
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">{t('reset_password.title')}</CardTitle>
            <CardDescription className="text-center">
              {t('reset_password.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">{t('reset_password.password_label')}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t('reset_password.password_placeholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  {t('validation.password_requirements')}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">{t('reset_password.confirm_password_label')}</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder={t('reset_password.confirm_password_placeholder')}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('reset_password.submitting')}
                  </>
                ) : t('reset_password.submit')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ResetPassword;
