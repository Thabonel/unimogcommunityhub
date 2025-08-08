
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { useSubscription } from './use-subscription';

export function useSubscriptionManagement() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { handleError } = useErrorHandler();
  const { refreshSubscription } = useSubscription();

  const openCustomerPortal = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) throw error;
      if (!data?.url) throw new Error('No portal URL returned');
      
      // Redirect to Stripe Customer Portal
      window.location.href = data.url;
    } catch (err) {
      handleError(err, {
        context: 'Customer Portal',
        showToast: true,
        logToConsole: true
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const cancelSubscription = async () => {
    // This will now direct users to the customer portal for cancellation
    return openCustomerPortal();
  };
  
  const upgradeSubscription = async (newPlan: 'standard' | 'lifetime') => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { planType: newPlan }
      });
      
      if (error) throw error;
      if (!data?.url) throw new Error('No checkout URL returned');
      
      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      handleError(err, {
        context: 'Subscription Upgrade',
        showToast: true,
        logToConsole: true
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const resumeSubscription = async () => {
    setIsLoading(true);
    
    try {
      // Direct users to the customer portal to resume subscription
      return await openCustomerPortal();
    } catch (err) {
      handleError(err, {
        context: 'Resume Subscription',
        showToast: true,
        logToConsole: true
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    isLoading,
    openCustomerPortal,
    cancelSubscription,
    upgradeSubscription,
    resumeSubscription,
    refreshSubscription
  };
}
