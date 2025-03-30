
import { CommunityHealthMetrics, CommunityTimeframe } from './types/communityHealthTypes';
import { getStartDateForTimeframe, getPreviousPeriodStartDate } from './utils/dateUtils';
import { 
  getActiveUsers, 
  getNewUsers, 
  getPreviousPeriodUsers, 
  calculateRetentionRate, 
  getTopContributors, 
  enrichContributorsWithProfiles 
} from './metrics/userActivityMetrics';
import { 
  getNewContent, 
  getEngagementEvents, 
  calculateEngagementRate 
} from './metrics/contentMetrics';
import { getReportedIssues } from './metrics/issuesMetrics';
import { formatHealthReportMarkdown } from './reports/healthReportGenerator';

export { type CommunityHealthMetrics } from './types/communityHealthTypes';

export const getCommunityHealthMetrics = async (
  timeframe: CommunityTimeframe = 'week'
): Promise<CommunityHealthMetrics | null> => {
  try {
    // Calculate date range based on timeframe
    const startDate = getStartDateForTimeframe(timeframe);
    const startTimestamp = startDate.toISOString();
    
    // Get active users
    const { uniqueUsers, error: activeUsersError } = await getActiveUsers(startTimestamp);
    
    if (activeUsersError) {
      return null;
    }
    
    // Get new users
    const { data: newUsers } = await getNewUsers(startTimestamp);
    
    // Get content creation metrics
    const { data: newContent } = await getNewContent(startTimestamp);
    
    // Get engagement events
    const { data: engagementEvents } = await getEngagementEvents(startTimestamp);
    
    // Calculate engagement rate
    const engagementRate = calculateEngagementRate(engagementEvents, uniqueUsers.size);
    
    // Get top contributors
    const { data: contributions } = await getTopContributors(startTimestamp);
    
    // Enrich contributors with profile data
    const topContributors = await enrichContributorsWithProfiles(contributions);
    
    // Calculate retention rate
    const previousStartDate = getPreviousPeriodStartDate(startDate, timeframe);
    const previousStartTimestamp = previousStartDate.toISOString();
    
    const { data: previousPeriodUsers } = await getPreviousPeriodUsers(
      previousStartTimestamp,
      startTimestamp
    );
    
    const retentionRate = calculateRetentionRate(uniqueUsers, previousPeriodUsers);
    
    // Get reported issues
    const { data: issues } = await getReportedIssues(startTimestamp);
    
    // Build and return metrics
    return {
      activeUsers: uniqueUsers.size,
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
  timeframe: CommunityTimeframe = 'week'
): Promise<string> => {
  const metrics = await getCommunityHealthMetrics(timeframe);
  
  if (!metrics) {
    return 'Unable to generate community health report';
  }
  
  return formatHealthReportMarkdown(metrics);
};
