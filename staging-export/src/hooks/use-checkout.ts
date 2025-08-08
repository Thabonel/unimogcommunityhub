
import { useState } from 'react';
import { createCheckoutSession } from '@/services/subscriptionService';
import { useToast } from '@/hooks/use-toast';
import { useErrorHandler } from '@/hooks/use-error-handler';

export function useCheckout() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const { handleError } = useErrorHandler();

  const redirectToCheckout = async (planType: 'standard' | 'lifetime') => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { url } = await createCheckoutSession(planType);
      
      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err instanceof Error ? err : new Error('Failed to create checkout session'));
      
      handleError(err, {
        context: 'Checkout',
        showToast: true,
        logToConsole: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    redirectToCheckout,
    isLoading,
    error
  };
}
