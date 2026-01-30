
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase-client';
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
  isVerified?: boolean; // Unimog ownership verification
  legacySubscriber?: boolean; // Grandfathered subscriber
  founderStatus?: boolean; // Lifetime member with founder benefits
  supporterTier?: 'supporter' | 'patron' | 'founder' | null; // Community supporter level
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
        .select(`
          *,
          verifications(status),
          community_supporters(tier, is_active, monthly_amount)
        `)
        .eq('user_id', user.id)
        .single();
        
      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "No rows returned"
        console.error('Error fetching subscription:', fetchError);
        setError(new Error(fetchError.message)); // Set error state

        // If user doesn't have a subscription record, create one
        if (fetchError.code === 'PGRST116' || fetchError.message.includes('No rows')) {
          try {
            console.log('Creating user subscription record...');
            const { error: createError } = await supabase
              .from('user_subscriptions')
              .insert([{
                user_id: user.id,
                subscription_status: 'inactive',
                is_verified: false
              }])
              .select()
              .single();

            if (createError) {
              console.error('Error creating subscription:', createError);
              return;
            }

            // Recursively call to fetch the newly created subscription
            await fetchSubscription();
            return;
          } catch (createErr) {
            console.error('Failed to create subscription record:', createErr);
            return;
          }
        }
        return;
      }

      if (!data) {
        // User doesn't have subscription record, create one
        try {
          console.log('No subscription data found, creating record...');
          const { data: newData, error: createError } = await supabase
            .from('user_subscriptions')
            .insert([{
              user_id: user.id,
              subscription_status: 'inactive',
              is_verified: false
            }])
            .select()
            .single();

          if (createError) {
            console.error('Error creating subscription:', createError);
            return;
          }

          // Set the newly created subscription
          const formattedSubscription: Subscription = {
            id: newData.id,
            isActive: false,
            subscriptionLevel: 'free',
            level: 'free',
            expiresAt: null,
            stripeCustomerId: null,
            stripeSessionId: null,
            updatedAt: newData.updated_at,
            isVerified: false,
            legacySubscriber: false,
            founderStatus: false,
            supporterTier: null
          };

          setSubscription(formattedSubscription);
        } catch (createErr) {
          console.error('Failed to create subscription record:', createErr);
        }
        return;
      }
      
      // Check verification status
      const isVerified = data.is_verified === true ||
        (data.verifications && data.verifications[0] && data.verifications[0].status === 'approved');

      // Check supporter status
      const supporterData = data.community_supporters?.[0];
      const supporterTier = supporterData?.is_active ? supporterData.tier : null;

      // Determine access level - New monetization model
      const hasLegacyAccess = data.subscription_status === 'active' ||
        data.subscription_status === 'trialing' ||
        data.is_free_access === true;

      const hasVerifiedAccess = isVerified; // Verified Unimog owners get free access
      const hasSupporterAccess = supporterTier !== null; // Community supporters get access

      const isActive = hasLegacyAccess || hasVerifiedAccess || hasSupporterAccess;

      // Determine subscription level
      let subscriptionLevel: 'standard' | 'lifetime' | 'free' = 'free';
      if (data.subscription_type === 'lifetime' || data.founder_status) {
        subscriptionLevel = 'lifetime';
      } else if (isActive) {
        subscriptionLevel = 'standard';
      }

      const formattedSubscription: Subscription = {
        id: data.id || '',
        isActive: isActive,
        subscriptionLevel: subscriptionLevel,
        level: subscriptionLevel, // Added for compatibility
        expiresAt: data.current_period_end || data.trial_ends_at,
        stripeCustomerId: data.stripe_customer_id,
        stripeSessionId: data.stripe_subscription_id,
        updatedAt: data.updated_at,
        isVerified: isVerified,
        legacySubscriber: data.legacy_subscriber === true,
        founderStatus: data.founder_status === true,
        supporterTier: supporterTier
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

  // New access control helpers for monetization transition
  const hasVerifiedAccess = () => {
    return subscription?.isVerified === true;
  };

  const isLegacySubscriber = () => {
    return subscription?.legacySubscriber === true;
  };

  const isFounder = () => {
    return subscription?.founderStatus === true;
  };

  const getSupporterTier = () => {
    return subscription?.supporterTier || null;
  };

  const getAccessReason = () => {
    if (!subscription?.isActive) return 'none';
    if (subscription.legacySubscriber) return 'legacy_subscriber';
    if (subscription.isVerified) return 'verified_owner';
    if (subscription.supporterTier) return 'supporter';
    return 'unknown';
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
    cancelSubscription,
    // New monetization model helpers
    hasVerifiedAccess,
    isLegacySubscriber,
    isFounder,
    getSupporterTier,
    getAccessReason
  };
}
