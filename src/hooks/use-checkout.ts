
import { useState } from 'react';
import { createCheckoutSession } from '@/services/subscriptionService';
import { useToast } from '@/hooks/use-toast';

export function useCheckout() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const redirectToCheckout = async (planType: 'premium' | 'lifetime') => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { url } = await createCheckoutSession(planType);
      
      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err instanceof Error ? err : new Error('Failed to create checkout session'));
      
      toast({
        title: 'Checkout Error',
        description: 'There was a problem creating your checkout session. Please try again.',
        variant: 'destructive',
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
