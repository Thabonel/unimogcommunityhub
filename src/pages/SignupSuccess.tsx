import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';

const SignupSuccess = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/dashboard');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleSkip = () => {
    navigate('/dashboard');
  };

  return (
    <Layout>
      <div className="container max-w-2xl py-12 flex items-center justify-center min-h-[70vh]">
        <Card className="w-full text-center">
          <CardHeader className="space-y-4">
            <div className="flex justify-center">
              <CheckCircle2 className="h-20 w-20 text-green-500 animate-pulse" />
            </div>
            <CardTitle className="text-3xl font-bold">Welcome to Unimog Community Hub!</CardTitle>
            <CardDescription className="text-lg">
              Your account has been created successfully
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-primary mb-2">
                🎉 Your 30-Day Free Trial Has Been Activated!
              </h3>
              <p className="text-muted-foreground">
                You now have full access to all premium features including Barry AI, advanced trip planning,
                and the complete Unimog manual library.
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-muted-foreground">
                Redirecting to your dashboard in <span className="font-bold text-primary">{countdown}</span> seconds...
              </p>

              <Button
                onClick={handleSkip}
                variant="outline"
                className="w-full max-w-xs mx-auto"
              >
                Skip and Go to Dashboard Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SignupSuccess;
