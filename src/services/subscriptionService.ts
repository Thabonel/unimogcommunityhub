
import { supabase } from '@/integrations/supabase/client';

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

export async function ensureLifetimePlan(userId: string) {
  try {
    // Check if user already has a subscription
    const existingSubscription = await getUserSubscription(userId);
    
    if (!existingSubscription) {
      // Create a new lifetime subscription for the user
      await createSubscription({
        userId,
        level: 'lifetime',
        isActive: true,
        // No expiration date for lifetime plan
      });
      return true;
    } else if (existingSubscription.subscription_level === 'free') {
      // Upgrade free user to lifetime
      await updateSubscription(existingSubscription.id, {
        level: 'lifetime',
        isActive: true,
      });
      return true;
    }
    
    // User already has a non-free subscription
    return false;
  } catch (error) {
    console.error("Error ensuring lifetime plan:", error);
    throw error;
  }
}
