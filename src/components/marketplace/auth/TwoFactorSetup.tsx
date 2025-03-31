
import { TwoFactorIntroStep } from '@/components/marketplace/auth/components/two-factor/TwoFactorIntroStep';
import { TwoFactorSetupStep } from '@/components/marketplace/auth/components/two-factor/TwoFactorSetupStep';
import { TwoFactorVerifyStep } from '@/components/marketplace/auth/components/two-factor/TwoFactorVerifyStep';
import { TwoFactorSuccessStep } from '@/components/marketplace/auth/components/two-factor/TwoFactorSuccessStep';
import { useTwoFactorSetup } from '@/components/marketplace/auth/hooks/useTwoFactorSetup';

export const TwoFactorSetup = () => {
  const {
    isLoading,
    step,
    qrCode,
    verificationCode,
    setVerificationCode,
    startSetup,
    verifyAndEnable,
    setStep
  } = useTwoFactorSetup();

  return (
    <div className="container max-w-md py-12">
      {step === 'intro' && (
        <TwoFactorIntroStep 
          isLoading={isLoading} 
          onStartSetup={startSetup} 
        />
      )}
      
      {step === 'setup' && (
        <TwoFactorSetupStep 
          qrCode={qrCode} 
          onNext={() => setStep('verify')} 
          onBack={() => setStep('intro')} 
        />
      )}
      
      {step === 'verify' && (
        <TwoFactorVerifyStep 
          verificationCode={verificationCode}
          setVerificationCode={setVerificationCode}
          isLoading={isLoading}
          onVerify={verifyAndEnable}
          onBack={() => setStep('setup')}
        />
      )}
      
      {step === 'success' && <TwoFactorSuccessStep />}
    </div>
  );
};
