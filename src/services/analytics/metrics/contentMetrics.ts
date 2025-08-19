
import { supabase } from '@/lib/supabase-client';

/**
 * Fetches new content created in a given time period
 */
export const getNewContent = async (startTimestamp: string) => {
  const { data, error } = await supabase
    .from('posts')
    .select('id')
    .gte('created_at', startTimestamp);
  
  if (error) {
    console.error('Error fetching new content:', error);
  }
  
  return { data, error };
};

/**
 * Fetches engagement events for a given time period
 */
export const getEngagementEvents = async (startTimestamp: string) => {
  const { data, error } = await supabase
    .from('user_activities')
    .select('event_type')
    .in('event_type', ['post_like', 'post_comment', 'post_share'])
    .gte('timestamp', startTimestamp);
  
  if (error) {
    console.error('Error fetching engagement events:', error);
  }
  
  return { data, error };
};

/**
 * Calculates engagement rate based on active users
 */
export const calculateEngagementRate = (
  engagementEvents: Array<any> | null,
  uniqueActiveUsersCount: number
): number => {
  if (!engagementEvents || uniqueActiveUsersCount === 0) {
    return 0;
  }
  
  return engagementEvents.length / uniqueActiveUsersCount;
};
