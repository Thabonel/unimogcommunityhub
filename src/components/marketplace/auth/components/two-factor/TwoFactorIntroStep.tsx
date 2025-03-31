
import { useState } from 'react';
import { Loader2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface TwoFactorIntroStepProps {
  isLoading: boolean;
  onStartSetup: () => void;
}

export const TwoFactorIntroStep = ({ isLoading, onStartSetup }: TwoFactorIntroStepProps) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-center mb-4">
          <Shield className="h-12 w-12 text-primary" />
        </div>
        <CardTitle className="text-xl text-center">Two-Factor Authentication</CardTitle>
        <CardDescription className="text-center">
          Add an extra layer of security to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p>
            Two-factor authentication (2FA) adds an additional layer of security to your account by requiring a verification code from your phone in addition to your password.
          </p>
          <div className="bg-amber-50 border border-amber-200 dark:bg-amber-900/20 dark:border-amber-800 rounded p-4">
            <h4 className="text-sm font-medium text-amber-800 dark:text-amber-400 mb-1">You'll need an authenticator app</h4>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Before continuing, download and install an authenticator app like Google Authenticator or Authy on your mobile device.
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button 
          onClick={onStartSetup}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : "Set Up Two-Factor Authentication"}
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate('/marketplace/account-settings')}
          className="w-full"
        >
          Do This Later
        </Button>
      </CardFooter>
    </Card>
  );
};
