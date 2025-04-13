
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ensureLifetimePlan } from '@/services/subscriptionService';
import { useErrorHandler } from '@/hooks/use-error-handler';

export interface Subscription {
  id: string;
  isActive: boolean;
  level: string;
  expiresAt?: string;
  stripeCustomerId?: string;
  stripeSessionId?: string;
  updatedAt?: string;
}

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { handleError } = useErrorHandler();
  
  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) {
        setSubscription(null);
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Check if the user has a subscription
        await ensureLifetimePlan(user.id);
        
        const { data, error: fetchError } = await supabase
          .from('user_subscriptions')
          .select('id, is_active, subscription_level, expires_at, stripe_customer_id, stripe_session_id, updated_at')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (fetchError) throw fetchError;
        
        if (data) {
          setSubscription({
            id: data.id,
            isActive: data.is_active,
            level: data.subscription_level,
            expiresAt: data.expires_at,
            stripeCustomerId: data.stripe_customer_id,
            stripeSessionId: data.stripe_session_id,
            updatedAt: data.updated_at
          });
        } else {
          setSubscription(null);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch subscription';
        console.error('Error fetching subscription:', err);
        setError(err instanceof Error ? err : new Error(errorMessage));
        
        handleError(err, {
          context: 'Subscription',
          showToast: false,
          logToConsole: true
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSubscription();
    
    // Set up a subscription listener for real-time updates
    const subscriptionChannel = supabase
      .channel('user_subscriptions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_subscriptions',
          filter: user ? `user_id=eq.${user.id}` : undefined
        },
        (payload) => {
          console.log('Subscription updated:', payload);
          fetchSubscription();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(subscriptionChannel);
    };
  }, [user, handleError]);
  
  const hasActiveSubscription = (): boolean => {
    if (!subscription) return false;
    
    const isActive = subscription.isActive;
    const hasExpired = subscription.expiresAt && new Date(subscription.expiresAt) < new Date();
    
    return isActive && !hasExpired;
  };
  
  const getSubscriptionLevel = (): string | null => {
    if (!hasActiveSubscription()) return null;
    return subscription?.level || null;
  };
  
  const getExpiryDate = (): Date | null => {
    if (!subscription?.expiresAt) return null;
    return new Date(subscription.expiresAt);
  };
  
  const refreshSubscription = async (): Promise<void> => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Force a refresh of the subscription data
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('id, is_active, subscription_level, expires_at, stripe_customer_id, stripe_session_id, updated_at')
        .eq('user_id', user.id)
        .maybeSingle();
        
      if (error) throw error;
      
      if (data) {
        setSubscription({
          id: data.id,
          isActive: data.is_active,
          level: data.subscription_level,
          expiresAt: data.expires_at,
          stripeCustomerId: data.stripe_customer_id,
          stripeSessionId: data.stripe_session_id,
          updatedAt: data.updated_at
        });
      } else {
        setSubscription(null);
      }
    } catch (err) {
      handleError(err, {
        context: 'Subscription Refresh',
        showToast: true,
        logToConsole: true
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    subscription,
    isLoading,
    error,
    hasActiveSubscription,
    getSubscriptionLevel,
    getExpiryDate,
    refreshSubscription
  };
}
