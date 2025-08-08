
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

interface Subscription {
  id: string;
  isActive: boolean;
  subscriptionLevel: 'standard' | 'lifetime' | 'free';
  expiresAt: string | null;
  stripeCustomerId: string | null;
  stripeSessionId: string | null;
  updatedAt: string;
  level?: 'standard' | 'lifetime' | 'free'; // Added for compatibility
}

export function useSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null); // Added error state
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Fetch subscription data
  const fetchSubscription = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null); // Reset error state before fetching
      
      const { data, error: fetchError } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "No rows returned"
        console.error('Error fetching subscription:', fetchError);
        setError(new Error(fetchError.message)); // Set error state
        return;
      }
      
      if (!data) {
        setSubscription(null);
        return;
      }
      
      // Format subscription data
      const formattedSubscription: Subscription = {
        id: data.id || '',
        isActive: data.is_active || false,
        subscriptionLevel: data.subscription_level || 'free',
        level: data.subscription_level || 'free', // Added for compatibility
        expiresAt: data.expires_at,
        stripeCustomerId: data.stripe_customer_id,
        stripeSessionId: data.stripe_session_id,
        updatedAt: data.updated_at
      };
      
      setSubscription(formattedSubscription);
    } catch (err: any) {
      console.error('Error in subscription hook:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch subscription'));
    } finally {
      setIsLoading(false);
    }
  }, [user]);
  
  // Load subscription on component mount or when user changes
  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);
  
  // Refresh subscription data
  const refreshSubscription = async () => {
    await fetchSubscription();
  };
  
  // Check if user has an active subscription
  const hasActiveSubscription = () => {
    if (!subscription) return false;
    return subscription.isActive;
  };
  
  // Get subscription level
  const getSubscriptionLevel = () => {
    if (!subscription || !subscription.isActive) return 'free';
    return subscription.subscriptionLevel;
  };
  
  // Subscribe to a plan
  const subscribe = async (planType: 'standard' | 'lifetime') => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to subscribe",
        variant: "destructive"
      });
      return { success: false, error: 'Authentication required' };
    }
    
    try {
      setIsLoading(true);
      
      // Call Supabase Edge Function to create a Stripe checkout session
      const { data, error: functionError } = await supabase.functions.invoke('create-checkout', {
        body: { planType, userId: user.id }
      });
      
      if (functionError || !data?.url) {
        throw new Error(functionError?.message || 'Failed to create checkout session');
      }
      
      // Redirect to Stripe checkout
      window.location.href = data.url;
      return { success: true };
    } catch (err: any) {
      console.error('Error subscribing:', err);
      toast({
        title: "Subscription Failed",
        description: err instanceof Error ? err.message : 'Failed to process subscription',
        variant: "destructive"
      });
      setError(err instanceof Error ? err : new Error('Subscription failed'));
      return { success: false, error: err instanceof Error ? err.message : 'Subscription failed' };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Cancel subscription
  const cancelSubscription = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to manage your subscription",
        variant: "destructive"
      });
      return { success: false, error: 'Authentication required' };
    }
    
    if (!subscription?.stripeCustomerId) {
      toast({
        title: "No Active Subscription",
        description: "You don't have an active subscription to cancel",
        variant: "destructive"
      });
      return { success: false, error: 'No active subscription' };
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Call Supabase Edge Function to cancel subscription
      const { error: functionError } = await supabase.functions.invoke('cancel-subscription', {
        body: { customerId: subscription.stripeCustomerId }
      });
      
      if (functionError) {
        throw new Error(functionError.message);
      }
      
      // Refresh subscription data
      await fetchSubscription();
      
      toast({
        title: "Subscription Cancelled",
        description: "Your subscription has been cancelled successfully"
      });
      
      return { success: true };
    } catch (err: any) {
      console.error('Error cancelling subscription:', err);
      toast({
        title: "Cancellation Failed",
        description: err instanceof Error ? err.message : 'Failed to cancel subscription',
        variant: "destructive"
      });
      setError(err instanceof Error ? err : new Error('Cancellation failed'));
      return { success: false, error: err instanceof Error ? err.message : 'Cancellation failed' };
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    subscription,
    isLoading,
    error, // Added error property to the return object
    refreshSubscription,
    hasActiveSubscription,
    getSubscriptionLevel,
    subscribe,
    cancelSubscription
  };
}
