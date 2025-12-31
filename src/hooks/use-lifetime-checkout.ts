import { useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface CreateCheckoutParams {
  priceId: string;
  seatNumber: number;
  priceAmount: number;
}

export function useLifetimeCheckout() {
  const { user } = useAuth();
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);

  const createLifetimeCheckout = async ({
    priceId,
    seatNumber,
    priceAmount
  }: CreateCheckoutParams) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to purchase a lifetime membership',
        variant: 'destructive'
      });
      return null;
    }

    setIsCreatingCheckout(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          userId: user.id,
          priceId,
          mode: 'payment',
          metadata: {
            deal_type: 'lifetime_ltd',
            seat_number: seatNumber,
            price_paid: priceAmount,
            purchase_date: new Date().toISOString()
          },
          successUrl: `${window.location.origin}/welcome-lifetime?seat=${seatNumber}`,
          cancelUrl: `${window.location.origin}/lifetime`
        }
      });

      if (error) {
        console.error('Checkout error:', error);
        toast({
          title: 'Checkout failed',
          description: error.message || 'Failed to create checkout session',
          variant: 'destructive'
        });
        return null;
      }

      if (data?.url) {
        await supabase
          .from('ltd_campaign_stats')
          .update({
            seats_sold: seatNumber,
            revenue_generated: priceAmount * seatNumber,
            updated_at: new Date().toISOString()
          })
          .eq('id', data.campaignId);

        window.location.href = data.url;
        return data;
      }

      return null;
    } catch (err) {
      console.error('Unexpected checkout error:', err);
      toast({
        title: 'Unexpected error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive'
      });
      return null;
    } finally {
      setIsCreatingCheckout(false);
    }
  };

  const recordLifetimePurchase = async (seatNumber: number, stripeCustomerId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('user_subscriptions')
        .update({
          subscription_type: 'lifetime',
          ltd_seat_number: seatNumber,
          ltd_purchase_date: new Date().toISOString(),
          stripe_customer_id: stripeCustomerId,
          current_period_end: null,
          trial_ends_at: null
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('Failed to record purchase:', error);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Unexpected error recording purchase:', err);
      return false;
    }
  };

  return {
    createLifetimeCheckout,
    recordLifetimePurchase,
    isCreatingCheckout
  };
}
