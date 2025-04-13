
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
}

export function useSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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
      
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (error && error.code !== 'PGRST116') { // PGRST116 is "No rows returned"
        console.error('Error fetching subscription:', error);
        return;
      }
      
      if (!data) {
        setSubscription(null);
        return;
      }
      
      // Format subscription data
      setSubscription({
        id: data.id || '',
        isActive: data.is_active || false,
        subscriptionLevel: data.subscription_level || 'free',
        expiresAt: data.expires_at,
        stripeCustomerId: data.stripe_customer_id,
        stripeSessionId: data.stripe_session_id,
        updatedAt: data.updated_at
      });
    } catch (err) {
      console.error('Error in subscription hook:', err);
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
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { planType, userId: user.id }
      });
      
      if (error || !data?.url) {
        throw new Error(error?.message || 'Failed to create checkout session');
      }
      
      // Redirect to Stripe checkout
      window.location.href = data.url;
      return { success: true };
    } catch (err) {
      console.error('Error subscribing:', err);
      toast({
        title: "Subscription Failed",
        description: err instanceof Error ? err.message : 'Failed to process subscription',
        variant: "destructive"
      });
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
      
      // Call Supabase Edge Function to cancel subscription
      const { error } = await supabase.functions.invoke('cancel-subscription', {
        body: { customerId: subscription.stripeCustomerId }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Refresh subscription data
      await fetchSubscription();
      
      toast({
        title: "Subscription Cancelled",
        description: "Your subscription has been cancelled successfully"
      });
      
      return { success: true };
    } catch (err) {
      console.error('Error cancelling subscription:', err);
      toast({
        title: "Cancellation Failed",
        description: err instanceof Error ? err.message : 'Failed to cancel subscription',
        variant: "destructive"
      });
      return { success: false, error: err instanceof Error ? err.message : 'Cancellation failed' };
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    subscription,
    isLoading,
    refreshSubscription,
    hasActiveSubscription,
    getSubscriptionLevel,
    subscribe,
    cancelSubscription
  };
}
