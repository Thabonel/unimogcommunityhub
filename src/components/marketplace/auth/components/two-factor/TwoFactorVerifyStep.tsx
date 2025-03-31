
import { Loader2, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

interface TwoFactorVerifyStepProps {
  verificationCode: string;
  setVerificationCode: (code: string) => void;
  isLoading: boolean;
  onVerify: () => void;
  onBack: () => void;
}

export const TwoFactorVerifyStep = ({ 
  verificationCode, 
  setVerificationCode, 
  isLoading, 
  onVerify, 
  onBack 
}: TwoFactorVerifyStepProps) => {
  return (
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
          onClick={onVerify}
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
          onClick={onBack}
          className="w-full"
        >
          Back
        </Button>
      </CardFooter>
    </Card>
  );
};
