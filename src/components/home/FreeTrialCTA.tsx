
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useTrial } from '@/hooks/use-trial';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const FreeTrialCTA = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const { toast } = useToast();
  const { trialStatus, startFreeTrial } = useTrial();
  const { user, signUp } = useAuth();
  const navigate = useNavigate();

  // Handle click on the main CTA button
  const handleFreeTrialClick = () => {
    if (user) {
      // User is already logged in, start their trial directly
      handleStartTrial();
    } else {
      // Show the email form for guest users
      setShowEmailForm(true);
    }
  };

  // Handle the email form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address to continue.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Create account for the user
      const { data, error } = await signUp(email, password);
      
      if (error) throw error;

      toast({
        title: "Account created!",
        description: "Please check your email to verify your account.",
      });

      // Track conversion in visitor analytics
      const sessionId = localStorage.getItem('visitor_session_id');
      if (sessionId) {
        await supabase.from('visitor_analytics').update({
          signed_up: true,
          converted_to_trial: true
        }).eq('session_id', sessionId);
      }

      // Redirect to dashboard or profile completion
      navigate('/profile');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: error.message || "Could not create your account. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Start the free trial for an existing user
  const handleStartTrial = async () => {
    setIsLoading(true);
    try {
      const success = await startFreeTrial(user?.email || email);
      if (success) {
        toast({
          title: "Welcome to your free trial!",
          description: "You now have full access to all features for 7 days.",
        });
        navigate('/dashboard');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Don't show the trial button if user already has an active trial
  if (trialStatus === 'active') {
    return null;
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {!showEmailForm ? (
        <Button 
          size="lg" 
          className="w-full font-semibold text-base" 
          onClick={handleFreeTrialClick}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
              Processing...
            </>
          ) : (
            "Access Website for Free for a Week"
          )}
        </Button>
      ) : (
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Start Your Free Trial</CardTitle>
            <CardDescription className="text-center">
              Enter your email to get started with your 7-day free trial. No payment required.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Creating your account...
                  </>
                ) : (
                  "Start My Free Trial"
                )}
              </Button>
            </CardFooter>
          </form>
          <div className="px-6 pb-4 text-xs text-center text-muted-foreground">
            Your information is safe and will always be kept secure.
            No payment details required.
          </div>
        </Card>
      )}
    </div>
  );
};

export default FreeTrialCTA;
