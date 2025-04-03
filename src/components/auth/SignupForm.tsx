
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { SignupFormFields } from './signup/SignupFormFields';
import { SocialSignup } from './signup/SocialSignup';

interface SignupFormProps {
  onOAuthClick?: () => Promise<void>;
  planType?: string;
}

const SignupForm = ({ onOAuthClick, planType = 'lifetime' }: SignupFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { signUp } = useAuth();

  const handleSubmit = async (formData: {
    email: string;
    password: string;
    confirmPassword: string;
    fullName: string;
  }) => {
    setIsLoading(true);
    
    try {
      // First sign up the user with just the full_name metadata
      const { error } = await signUp(formData.email, formData.password, { 
        full_name: formData.fullName
      });
      
      if (error) throw error;
      
      toast({
        title: "Account created",
        description: "Please check your email to verify your account",
      });
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || "Could not create account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <SignupFormFields onSubmit={handleSubmit} isLoading={isLoading} />
      <SocialSignup isLoading={isLoading} />
    </div>
  );
};

export default SignupForm;
