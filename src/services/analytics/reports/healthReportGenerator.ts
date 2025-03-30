
import { CommunityHealthMetrics, CommunityTimeframe } from '../types/communityHealthTypes';

/**
 * Generates recommendations based on community health metrics
 */
export const generateRecommendations = (metrics: CommunityHealthMetrics): string[] => {
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
  
  return recommendations;
};

/**
 * Formats the community health report as markdown
 */
export const formatHealthReportMarkdown = (metrics: CommunityHealthMetrics): string => {
  const reportDate = new Date().toLocaleDateString();
  
  // Generate report content
  return `
# Community Health Report: ${metrics.timeframe.charAt(0).toUpperCase() + metrics.timeframe.slice(1)}ly Summary
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
${generateRecommendations(metrics).join('\n')}
  `;
};
