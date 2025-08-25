import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSubscription } from '@/hooks/use-subscription';
import { useSubscriptionManagement } from '@/hooks/use-subscription-management';
import { useTrial } from '@/hooks/use-trial';
import { Loader2, CheckCircle, AlertCircle, CreditCard } from 'lucide-react';

export function SubscriptionSection() {
  const { subscription, isLoading, hasActiveSubscription } = useSubscription();
  const { isLoading: managementLoading, openCustomerPortal, upgradeSubscription } = useSubscriptionManagement();
  const { trialStatus, trialData } = useTrial();
  
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  // Determine subscription status and display
  const getSubscriptionStatus = () => {
    if (isLoading) {
      return { 
        status: 'loading',
        title: 'Loading subscription details...',
        description: 'Please wait while we retrieve your subscription information.',
        icon: <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      };
    }
    
    if (hasActiveSubscription()) {
      // Use subscriptionLevel or fall back to level property
      const subscriptionLevel = subscription?.subscriptionLevel || subscription?.level;
      
      return {
        status: 'active',
        title: `Active ${subscriptionLevel === 'lifetime' ? 'Lifetime' : 'Standard'} Plan`,
        description: subscriptionLevel === 'lifetime' 
          ? 'You have lifetime access to all premium features.'
          : `Your subscription renews on ${formatDate(subscription?.expiresAt)}.`,
        icon: <CheckCircle className="h-5 w-5 text-green-600" />
      };
    }
    
    if (trialStatus === 'active' && trialData) {
      return {
        status: 'trial',
        title: 'Free Trial Active',
        description: `Your free trial expires in ${trialData.daysRemaining} ${trialData.daysRemaining === 1 ? 'day' : 'days'}.`,
        icon: <CheckCircle className="h-5 w-5 text-blue-600" />
      };
    }
    
    if (trialStatus === 'expired') {
      return {
        status: 'trial-expired',
        title: 'Trial Expired',
        description: 'Your free trial has ended. Subscribe to continue accessing premium features.',
        icon: <AlertCircle className="h-5 w-5 text-amber-600" />
      };
    }
    
    return {
      status: 'none',
      title: 'No Active Subscription',
      description: 'Subscribe to access all premium features of Unimog Community Hub.',
      icon: <AlertCircle className="h-5 w-5 text-gray-400" />
    };
  };
  
  const subscriptionInfo = getSubscriptionStatus();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {subscriptionInfo.icon}
          {subscriptionInfo.title}
        </CardTitle>
        <CardDescription>
          {subscriptionInfo.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {(subscriptionInfo.status === 'active' || subscriptionInfo.status === 'trial') && (
          <div className="space-y-1">
            <h4 className="text-sm font-medium">Plan Benefits</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Full community access</li>
              <li>Complete knowledge base</li>
              <li>Advanced trip planning tools</li>
              {(subscription?.subscriptionLevel === 'lifetime' || subscription?.level === 'lifetime') && (
                <>
                  <li>Featured marketplace listings</li>
                  <li>Dedicated support</li>
                </>
              )}
            </ul>
          </div>
        )}
        
        {/* Show upgrade options */}
        {subscriptionInfo.status === 'trial' && (
          <div className="mt-4 pt-4 border-t">
            <h4 className="text-sm font-medium mb-2">Looking to subscribe?</h4>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                onClick={() => upgradeSubscription('standard')}
                disabled={managementLoading}
              >
                {managementLoading ? 'Processing...' : 'Subscribe Monthly'}
              </Button>
              <Button 
                size="sm"
                variant="outline"
                onClick={() => upgradeSubscription('lifetime')}
                disabled={managementLoading}
              >
                {managementLoading ? 'Processing...' : 'Get Lifetime Access'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {subscriptionInfo.status === 'active' && (
          <Button 
            onClick={openCustomerPortal}
            disabled={managementLoading}
            className="flex gap-2 items-center"
          >
            {managementLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
            {managementLoading ? 'Loading...' : 'Manage Subscription'}
          </Button>
        )}
        
        {subscriptionInfo.status === 'trial-expired' || subscriptionInfo.status === 'none' ? (
          <Button 
            onClick={() => window.location.href = '/pricing'}
            className="w-full"
          >
            View Pricing Plans
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  );
}

export default SubscriptionSection;
