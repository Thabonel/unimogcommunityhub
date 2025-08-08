
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

const SubscriptionCanceled = () => {
  return (
    <Layout>
      <div className="container py-12 max-w-xl mx-auto">
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-900/10">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-800/30">
              <AlertCircle className="h-10 w-10 text-amber-600 dark:text-amber-400" />
            </div>
            <CardTitle className="text-2xl">Payment Canceled</CardTitle>
            <CardDescription className="text-amber-800 dark:text-amber-300">
              Your subscription payment was not completed
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p>
              No payment has been processed and no changes have been made to your account. 
              You can try again whenever you're ready.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center gap-4 pt-4">
            <Link to="/pricing">
              <Button variant="outline">Return to Pricing</Button>
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

export default SubscriptionCanceled;
