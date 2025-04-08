
import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SubscriptionSuccess = () => {
  const location = useLocation();
  const { toast } = useToast();
  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get('session_id');

  useEffect(() => {
    // Show success toast when component mounts
    toast({
      title: 'Payment Successful',
      description: 'Thank you for your subscription! Your account has been updated.',
      variant: 'default',
    });
  }, [toast]);

  return (
    <Layout>
      <div className="container py-12 max-w-xl mx-auto">
        <Card className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-900/20">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-800/30">
              <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl">Subscription Successful!</CardTitle>
            <CardDescription className="text-lg text-green-800 dark:text-green-300">
              Your payment has been processed successfully
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-4">
              <p>
                Thank you for joining the Unimog Community Hub! Your subscription has been activated, and you now have
                full access to all premium features.
              </p>
              {sessionId && (
                <div className="text-sm text-green-700 dark:text-green-400">
                  Transaction ID: {sessionId.substring(0, 12)}...
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-center gap-4 pt-4">
            <Link to="/profile">
              <Button variant="outline">Go to Profile</Button>
            </Link>
            <Link to="/">
              <Button>Return Home</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default SubscriptionSuccess;
