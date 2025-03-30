
import { supabase } from '@/lib/supabase';

export interface CommunityHealthMetrics {
  activeUsers: number;
  newUsers: number;
  contentCreation: number;
  engagementRate: number;
  retentionRate: number;
  topContributors: Array<{userId: string, displayName: string, contributions: number}>;
  topContent: Array<{contentId: string, title: string, engagementScore: number}>;
  sentimentScore: number;
  issuesReported: number;
  timeframe: 'day' | 'week' | 'month' | 'quarter';
}

export const getCommunityHealthMetrics = async (
  timeframe: 'day' | 'week' | 'month' | 'quarter' = 'week'
): Promise<CommunityHealthMetrics | null> => {
  try {
    // Calculate date range based on timeframe
    const now = new Date();
    let startDate = new Date();
    
    switch (timeframe) {
      case 'day':
        startDate.setDate(now.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
    }
    
    const startTimestamp = startDate.toISOString();
    
    // Get active users (users with session_start events)
    const { data: activeUsers, error: activeUsersError } = await supabase
      .from('user_activities')
      .select('user_id')
      .eq('event_type', 'session_start')
      .gte('timestamp', startTimestamp)
      .not('user_id', 'is', null);
    
    if (activeUsersError) {
      console.error('Error fetching active users:', activeUsersError);
      return null;
    }
    
    // Get unique active users
    const uniqueActiveUsers = new Set(activeUsers.map(entry => entry.user_id));
    
    // Get new users
    const { data: newUsers, error: newUsersError } = await supabase
      .from('profiles')
      .select('id')
      .gte('created_at', startTimestamp);
    
    if (newUsersError) {
      console.error('Error fetching new users:', newUsersError);
    }
    
    // Get content creation metrics
    const { data: newContent, error: contentError } = await supabase
      .from('posts')
      .select('id')
      .gte('created_at', startTimestamp);
    
    if (contentError) {
      console.error('Error fetching new content:', contentError);
    }
    
    // Get engagement events (likes, comments, shares)
    const { data: engagementEvents, error: engagementError } = await supabase
      .from('user_activities')
      .select('event_type')
      .in('event_type', ['post_like', 'post_comment', 'post_share'])
      .gte('timestamp', startTimestamp);
    
    if (engagementError) {
      console.error('Error fetching engagement events:', engagementError);
    }
    
    // Calculate engagement rate (engagements per active user)
    const engagementRate = uniqueActiveUsers.size > 0 
      ? (engagementEvents?.length || 0) / uniqueActiveUsers.size 
      : 0;
    
    // Get top contributors (users with most activity)
    const { data: contributions, error: contributionsError } = await supabase
      .from('user_activities')
      .select('user_id, count')
      .not('user_id', 'is', null)
      .gte('timestamp', startTimestamp)
      .group('user_id')
      .order('count', { ascending: false })
      .limit(5);
    
    if (contributionsError) {
      console.error('Error fetching top contributors:', contributionsError);
    }
    
    // Get user profile data for top contributors
    const topContributors = [];
    if (contributions && contributions.length > 0) {
      const contributorIds = contributions.map(c => c.user_id);
      
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, display_name')
        .in('id', contributorIds);
        
      if (profilesError) {
        console.error('Error fetching contributor profiles:', profilesError);
      } else if (profiles) {
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
    }
    
    // Get retention rate (returning users / total active users)
    // For this, we need to compare with previous time period
    let previousStartDate = new Date(startDate);
    switch (timeframe) {
      case 'day':
        previousStartDate.setDate(previousStartDate.getDate() - 1);
        break;
      case 'week':
        previousStartDate.setDate(previousStartDate.getDate() - 7);
        break;
      case 'month':
        previousStartDate.setMonth(previousStartDate.getMonth() - 1);
        break;
      case 'quarter':
        previousStartDate.setMonth(previousStartDate.getMonth() - 3);
        break;
    }
    
    const previousStartTimestamp = previousStartDate.toISOString();
    
    // Get users who were active in previous period
    const { data: previousPeriodUsers, error: previousPeriodError } = await supabase
      .from('user_activities')
      .select('user_id')
      .eq('event_type', 'session_start')
      .gte('timestamp', previousStartTimestamp)
      .lt('timestamp', startTimestamp)
      .not('user_id', 'is', null);
    
    if (previousPeriodError) {
      console.error('Error fetching previous period users:', previousPeriodError);
    }
    
    // Calculate how many users from previous period returned in current period
    const previousUserIds = new Set((previousPeriodUsers || []).map(entry => entry.user_id));
    let returningUsers = 0;
    
    for (const userId of uniqueActiveUsers) {
      if (previousUserIds.has(userId)) {
        returningUsers++;
      }
    }
    
    const retentionRate = previousUserIds.size > 0 
      ? returningUsers / previousUserIds.size 
      : 0;
    
    // Get reported issues/bugs
    const { data: issues, error: issuesError } = await supabase
      .from('feedback')
      .select('id')
      .eq('type', 'bug')
      .gte('created_at', startTimestamp);
    
    if (issuesError) {
      console.error('Error fetching reported issues:', issuesError);
    }
    
    // Build and return metrics
    return {
      activeUsers: uniqueActiveUsers.size,
      newUsers: newUsers?.length || 0,
      contentCreation: newContent?.length || 0,
      engagementRate,
      retentionRate,
      topContributors,
      // Placeholder for sentiment and top content
      sentimentScore: 0.75, // Would need sentiment analysis service
      topContent: [],
      issuesReported: issues?.length || 0,
      timeframe
    };
  } catch (error) {
    console.error('Error in getCommunityHealthMetrics:', error);
    return null;
  }
};

// Function to generate scheduled reports
export const generateCommunityHealthReport = async (
  timeframe: 'day' | 'week' | 'month' | 'quarter' = 'week'
): Promise<string> => {
  const metrics = await getCommunityHealthMetrics(timeframe);
  
  if (!metrics) {
    return 'Unable to generate community health report';
  }
  
  // Generate report content
  const reportDate = new Date().toLocaleDateString();
  const reportContent = `
# Community Health Report: ${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}ly Summary
Generated on ${reportDate}

## Key Metrics
- Active Users: ${metrics.activeUsers}
- New Users: ${metrics.newUsers}
- Content Creation: ${metrics.contentCreation} new items
- Engagement Rate: ${(metrics.engagementRate * 100).toFixed(1)}%
- Retention Rate: ${(metrics.retentionRate * 100).toFixed(1)}%
- Issues Reported: ${metrics.issuesReported}

## Top Contributors
${metrics.topContributors.map((contributor, index) => 
  `${index + 1}. ${contributor.displayName} (${contributor.contributions} contributions)`
).join('\n')}

## Recommendations
${generateRecommendations(metrics)}
  `;
  
  return reportContent;
};

// Helper function to generate recommendations based on metrics
function generateRecommendations(metrics: CommunityHealthMetrics): string {
  const recommendations: string[] = [];
  
  // Low engagement rate
  if (metrics.engagementRate < 0.5) {
    recommendations.push('Consider implementing engagement incentives to increase user interaction.');
  }
  
  // Low retention rate
  if (metrics.retentionRate < 0.3) {
    recommendations.push('Retention rate is low. Focus on improving the onboarding process and user experience.');
  }
  
  // Few active users but many new users
  if (metrics.activeUsers < metrics.newUsers * 0.5) {
    recommendations.push('Many new users aren\'t becoming active. Review the user journey to identify drop-off points.');
  }
  
  // High issue count
  if (metrics.issuesReported > 10) {
    recommendations.push('High number of reported issues. Prioritize resolving these to improve user satisfaction.');
  }
  
  // Low content creation
  if (metrics.contentCreation < metrics.activeUsers * 0.1) {
    recommendations.push('Content creation is low. Consider content creation campaigns or incentives.');
  }
  
  // Default recommendation if none apply
  if (recommendations.length === 0) {
    recommendations.push('Community health is good. Continue monitoring and engaging with top contributors.');
  }
  
  return recommendations.join('\n');
}
