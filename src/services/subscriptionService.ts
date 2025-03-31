
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
