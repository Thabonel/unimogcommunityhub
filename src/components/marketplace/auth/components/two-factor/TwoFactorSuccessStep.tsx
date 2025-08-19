
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

export const TwoFactorSuccessStep = () => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-12 w-12 text-green-500" />
        </div>
        <CardTitle className="text-xl text-center">2FA Enabled Successfully</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center mb-4">
          Two-factor authentication has been enabled for your account. Your account is now more secure.
        </p>
        
        <div className="bg-amber-50 border border-amber-200 dark:bg-amber-900/20 dark:border-amber-800 rounded p-4">
          <h4 className="text-sm font-medium text-amber-800 dark:text-amber-400 mb-1">Important</h4>
          <p className="text-sm text-amber-700 dark:text-amber-300">
            Store your recovery codes in a safe place. You'll need them if you lose access to your authenticator app.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button onClick={() => navigate('/marketplace/account-settings')}>
          Return to Account Settings
        </Button>
      </CardFooter>
    </Card>
  );
};
