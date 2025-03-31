
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export type TwoFactorSetupStep = 'intro' | 'setup' | 'verify' | 'success';

export const useTwoFactorSetup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<TwoFactorSetupStep>('intro');
  const [factorId, setFactorId] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const { toast } = useToast();

  const startSetup = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call to start 2FA setup
      setTimeout(() => {
        // Mock response for demonstration purposes
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

  return {
    isLoading,
    step,
    factorId,
    qrCode,
    verificationCode,
    setVerificationCode,
    startSetup,
    verifyAndEnable,
    setStep
  };
};
