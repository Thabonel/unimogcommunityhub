
import { supabase } from '@/lib/supabase-client';

/**
 * Fetches active users for a given time period
 */
export const getActiveUsers = async (startTimestamp: string) => {
  const { data, error } = await supabase
    .from('user_activities')
    .select('user_id')
    .eq('event_type', 'session_start')
    .gte('timestamp', startTimestamp)
    .not('user_id', 'is', null);
  
  if (error) {
    console.error('Error fetching active users:', error);
    return { uniqueUsers: new Set(), error };
  }
  
  // Get unique active users
  const uniqueUsers = new Set(data.map(entry => entry.user_id));
  return { uniqueUsers, error: null };
};

/**
 * Fetches new users for a given time period
 */
export const getNewUsers = async (startTimestamp: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .gte('created_at', startTimestamp);
  
  if (error) {
    console.error('Error fetching new users:', error);
  }
  
  return { data, error };
};

/**
 * Fetches users from previous period
 */
export const getPreviousPeriodUsers = async (previousStartTimestamp: string, startTimestamp: string) => {
  const { data, error } = await supabase
    .from('user_activities')
    .select('user_id')
    .eq('event_type', 'session_start')
    .gte('timestamp', previousStartTimestamp)
    .lt('timestamp', startTimestamp)
    .not('user_id', 'is', null);
  
  if (error) {
    console.error('Error fetching previous period users:', error);
  }
  
  return { data, error };
};

/**
 * Calculates retention rate based on returning users
 */
export const calculateRetentionRate = (
  uniqueActiveUsers: Set<string>,
  previousPeriodUsers: Array<{ user_id: string }> | null
): number => {
  if (!previousPeriodUsers || previousPeriodUsers.length === 0) {
    return 0;
  }
  
  const previousUserIds = new Set(previousPeriodUsers.map(entry => entry.user_id));
  let returningUsers = 0;
  
  for (const userId of uniqueActiveUsers) {
    if (previousUserIds.has(userId)) {
      returningUsers++;
    }
  }
  
  return previousUserIds.size > 0 
    ? returningUsers / previousUserIds.size 
    : 0;
};

/**
 * Fetches top contributors for a given time period
 */
export const getTopContributors = async (startTimestamp: string, limit: number = 5) => {
  const { data, error } = await supabase
    .rpc('get_top_contributors', { 
      time_period_start: startTimestamp,
      contributor_limit: limit
    });
  
  if (error) {
    console.error('Error fetching top contributors:', error);
  }
  
  return { data, error };
};

/**
 * Enriches contributor data with profile information
 */
export const enrichContributorsWithProfiles = async (
  contributions: Array<{ user_id: string, count: number }> | null
) => {
  if (!contributions || contributions.length === 0) {
    return [];
  }
  
  const contributorIds = contributions.map(c => c.user_id);
  
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, display_name')
    .in('id', contributorIds);
    
  if (error) {
    console.error('Error fetching contributor profiles:', error);
    return [];
  }
  
  const topContributors = [];
  if (profiles) {
    for (const contribution of contributions) {
      const profile = profiles.find(p => p.id === contribution.user_id);
      if (profile) {
        topContributors.push({
          userId: profile.id,
          displayName: profile.display_name || 'Anonymous',
          contributions: contribution.count
        });
      }
    }
  }
  
  return topContributors;
};
