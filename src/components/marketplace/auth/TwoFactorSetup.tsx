import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Shield, CheckCircle, Smartphone } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

export const TwoFactorSetup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'intro' | 'setup' | 'verify' | 'success'>('intro');
  const [factorId, setFactorId] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const startSetup = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // In a real implementation, this would generate a TOTP secret
      // and return a QR code URL for the authenticator app
      // This is a simplified version since Supabase doesn't natively support TOTP yet
      
      // Simulate API call to start 2FA setup
      setTimeout(() => {
        // Mock response for demonstration purposes
        // In production, you'd use actual TOTP libraries like 'otplib'
        const mockFactorId = 'mock-factor-id-' + Math.random().toString(36).substr(2, 9);
        const mockQrCode = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==`;
        
        setFactorId(mockFactorId);
        setQrCode(mockQrCode);
        setStep('setup');
        setIsLoading(false);
      }, 1500);
      
    } catch (error: any) {
      toast({
        title: 'Error setting up 2FA',
        description: error.message || 'Please try again later',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  const verifyAndEnable = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        title: 'Invalid verification code',
        description: 'Please enter a valid 6-digit code',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real implementation, this would verify the TOTP code
      // This is a simplified version since Supabase doesn't natively support TOTP yet
      
      // Simulate verification for demonstration purposes
      setTimeout(() => {
        // For demo purposes, just check if the code is "123456"
        if (verificationCode === "123456") {
          setStep('success');
        } else {
          toast({
            title: 'Invalid verification code',
            description: 'Please ensure you entered the correct code from your authenticator app',
            variant: 'destructive',
          });
        }
        setIsLoading(false);
      }, 1500);
      
    } catch (error: any) {
      toast({
        title: 'Error verifying 2FA',
        description: error.message || 'Please try again later',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  const renderIntroStep = () => (
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
          onClick={startSetup}
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

  const renderSetupStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-center">Scan QR Code</CardTitle>
        <CardDescription className="text-center">
          Scan this QR code with your authenticator app
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {qrCode && (
          <div className="flex justify-center">
            <div className="border-4 border-white bg-white rounded shadow-md p-2 w-64 h-64">
              <img 
                src={qrCode} 
                alt="2FA QR Code"
                className="w-full h-full"
              />
            </div>
          </div>
        )}
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Can't scan the code?</h4>
          <p className="text-sm text-muted-foreground">
            You can manually enter this setup key in your authenticator app:
          </p>
          <div className="bg-muted p-2 rounded flex items-center justify-between">
            <code className="text-sm">ABCD EFGH IJKL MNOP</code>
            <Button variant="ghost" size="sm" onClick={() => {
              navigator.clipboard.writeText("ABCDEFGHIJKLMNOP");
              toast({
                description: "Setup key copied to clipboard",
              });
            }}>
              Copy
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button
          onClick={() => setStep('verify')}
          className="w-full"
        >
          I've Scanned the QR Code
        </Button>
        <Button
          variant="outline"
          onClick={() => setStep('intro')}
          className="w-full"
        >
          Back
        </Button>
      </CardFooter>
    </Card>
  );

  const renderVerifyStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-center">Verify Code</CardTitle>
        <CardDescription className="text-center">
          Enter the 6-digit code from your authenticator app
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <Smartphone className="h-12 w-12 text-primary" />
        </div>
        
        <div className="flex justify-center">
          <InputOTP 
            maxLength={6}
            value={verificationCode}
            onChange={setVerificationCode}
            render={({ slots }) => (
              <InputOTPGroup>
                {slots.map((slot, idx) => (
                  <InputOTPSlot key={idx} {...slot} index={idx} />
                ))}
              </InputOTPGroup>
            )}
          />
        </div>
        
        <p className="text-center text-sm text-muted-foreground">
          For demonstration purposes, enter code: <strong>123456</strong>
        </p>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button 
          onClick={verifyAndEnable}
          disabled={isLoading || verificationCode.length !== 6}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : "Verify and Enable 2FA"}
        </Button>
        <Button
          variant="outline"
          onClick={() => setStep('setup')}
          className="w-full"
        >
          Back
        </Button>
      </CardFooter>
    </Card>
  );

  const renderSuccessStep = () => (
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

  return (
    <div className="container max-w-md py-12">
      {step === 'intro' && renderIntroStep()}
      {step === 'setup' && renderSetupStep()}
      {step === 'verify' && renderVerifyStep()}
      {step === 'success' && renderSuccessStep()}
    </div>
  );
};
