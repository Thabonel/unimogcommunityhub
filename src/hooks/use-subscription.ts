
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ensureLifetimePlan } from '@/services/subscriptionService';

export interface Subscription {
  id: string;
  isActive: boolean;
  level: string;
  expiresAt?: string;
}

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) {
        setSubscription(null);
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        
        // This will now just check if the user has a subscription, not auto-create one
        await ensureLifetimePlan(user.id);
        
        const { data, error } = await supabase
          .from('user_subscriptions')
          .select('id, is_active, subscription_level, expires_at')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (error) throw error;
        
        if (data) {
          setSubscription({
            id: data.id,
            isActive: data.is_active,
            level: data.subscription_level,
            expiresAt: data.expires_at
          });
        } else {
          setSubscription(null);
        }
      } catch (err) {
        console.error('Error fetching subscription:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch subscription'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSubscription();
  }, [user]);
  
  const hasActiveSubscription = (): boolean => {
    if (!subscription) return false;
    
    const isActive = subscription.isActive;
    const hasExpired = subscription.expiresAt && new Date(subscription.expiresAt) < new Date();
    
    return isActive && !hasExpired;
  };
  
  return {
    subscription,
    isLoading,
    error,
    hasActiveSubscription
  };
}
