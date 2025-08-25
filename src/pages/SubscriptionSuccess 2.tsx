
import React, { useEffect } from 'react';
import { useLocation, Link, useSearchParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSubscription } from '@/hooks/use-subscription';

const SubscriptionSuccess = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { refreshSubscription } = useSubscription();
  
  // Determine if this is a trial start or a paid subscription
  const isTrialStart = searchParams.get('trial') === 'true';
  const planType = searchParams.get('plan') || 'standard';

  useEffect(() => {
    // Refresh subscription details
    refreshSubscription();
    
    // Show success toast when component mounts
    toast({
      title: isTrialStart ? 'Trial Activated' : 'Payment Successful',
      description: isTrialStart 
        ? 'Your free trial has been activated! Enjoy all premium features.' 
        : 'Thank you for your subscription! Your account has been updated.',
      variant: 'default',
    });
  }, [toast, refreshSubscription, isTrialStart]);

  return (
    <Layout>
      <div className="container py-12 max-w-xl mx-auto">
        <Card className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-900/20">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-800/30">
              <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl">
              {isTrialStart ? 'Trial Activated!' : 'Subscription Successful!'}
            </CardTitle>
            <CardDescription className="text-lg text-green-800 dark:text-green-300">
              {isTrialStart 
                ? 'Your 2-month free trial has begun' 
                : 'Your payment has been processed successfully'}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-4">
              <p>
                {isTrialStart
                  ? 'Welcome to the Unimog Community Hub! You now have full access to all premium features for the next 60 days.'
                  : `Thank you for joining the Unimog Community Hub! Your ${planType === 'lifetime' ? 'lifetime' : 'subscription'} has been activated, and you now have full access to all premium features.`}
              </p>
              {sessionId && !isTrialStart && (
                <div className="text-sm text-green-700 dark:text-green-400">
                  Transaction ID: {sessionId.substring(0, 12)}...
                </div>
              )}
              
              {isTrialStart && (
                <div className="mt-6 bg-white dark:bg-green-900/30 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">What's included in your trial:</h3>
                  <ul className="text-left text-sm space-y-1.5 pl-5 list-disc">
                    <li>Full community access</li>
                    <li>Complete knowledge base</li>
                    <li>Advanced trip planning tools</li>
                    <li>Enhanced AI assistance</li>
                    <li>Marketplace listings</li>
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-4">
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/dashboard">
                <Button className="flex gap-2">
                  Go to Dashboard <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              
              <Link to="/trips">
                <Button variant="outline">Explore Trip Planning</Button>
              </Link>
            </div>
            
            {isTrialStart && (
              <p className="text-xs text-green-600 dark:text-green-400 text-center mt-4">
                We'll remind you before your trial ends. You can subscribe anytime from the pricing page.
              </p>
            )}
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default SubscriptionSuccess;
