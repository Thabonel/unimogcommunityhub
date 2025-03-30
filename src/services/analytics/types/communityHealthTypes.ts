
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

export type CommunityTimeframe = 'day' | 'week' | 'month' | 'quarter';
