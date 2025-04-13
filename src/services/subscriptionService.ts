
import { supabase } from '@/integrations/supabase/client';
import { STRIPE_CONFIG } from '@/config/env';

interface SubscriptionData {
  userId: string;
  level: string;
  isActive: boolean;
  expiresAt?: string;
}

export async function createSubscription(data: SubscriptionData) {
  const { userId, level, isActive, expiresAt } = data;
  
  const { data: subscription, error } = await supabase
    .from('user_subscriptions')
    .insert([{
      user_id: userId,
      subscription_level: level,
      is_active: isActive,
      expires_at: expiresAt
    }])
    .select()
    .single();
  
  if (error) {
    throw error;
  }
  
  return subscription;
}

export async function updateSubscription(subscriptionId: string, data: Partial<SubscriptionData>) {
  const { level, isActive, expiresAt } = data;
  
  const updateData: any = {};
  if (level !== undefined) updateData.subscription_level = level;
  if (isActive !== undefined) updateData.is_active = isActive;
  if (expiresAt !== undefined) updateData.expires_at = expiresAt;
  
  const { data: subscription, error } = await supabase
    .from('user_subscriptions')
    .update(updateData)
    .eq('id', subscriptionId)
    .select()
    .single();
  
  if (error) {
    throw error;
  }
  
  return subscription;
}

export async function cancelSubscription(subscriptionId: string) {
  const { error } = await supabase
    .from('user_subscriptions')
    .update({
      is_active: false,
      updated_at: new Date().toISOString()
    })
    .eq('id', subscriptionId);
  
  if (error) {
    throw error;
  }
  
  return true;
}

export async function getUserSubscription(userId: string) {
  const { data, error } = await supabase
    .from('user_subscriptions')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  
  if (error) {
    throw error;
  }
  
  return data;
}

// Create a checkout session with Stripe
export async function createCheckoutSession(planType: 'standard' | 'lifetime') {
  try {
    // Determine which price ID to use
    const priceId = planType === 'lifetime' 
      ? STRIPE_CONFIG.lifetimePriceId
      : STRIPE_CONFIG.premiumMonthlyPriceId;
    
    if (!priceId) {
      throw new Error(`Price ID for ${planType} plan is not configured`);
    }
    
    // Call our Supabase Edge Function to create a checkout session
    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: { priceId, planType }
    });
    
    if (error) throw error;
    if (!data || !data.url) throw new Error('No checkout URL returned');
    
    return data;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

// Simplified function that now checks for existing subscription instead of creating one
export async function ensureLifetimePlan(userId: string) {
  try {
    // Check if user already has a subscription
    const existingSubscription = await getUserSubscription(userId);
    
    if (!existingSubscription) {
      // No longer automatically create a free lifetime subscription
      // User must purchase it instead
      return false;
    } else if (existingSubscription.subscription_level === 'free') {
      // Don't automatically upgrade free users to lifetime
      return false;
    }
    
    // User already has a subscription
    return false;
  } catch (error) {
    console.error("Error checking subscription status:", error);
    throw error;
  }
}
