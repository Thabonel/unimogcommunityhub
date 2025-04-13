
import { Subscription as SupabaseSubscription } from '@supabase/supabase-js';

export interface Subscription extends SupabaseSubscription {
  type?: string;
  status?: 'active' | 'trialing' | 'past_due' | 'canceled' | 'incomplete';
  current_period_end?: number;
  cancel_at_period_end?: boolean;
  trial_end?: number;
  trial_start?: number;
}

export type SubscriptionLevel = 'free' | 'standard' | 'lifetime';
