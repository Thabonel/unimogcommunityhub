
import { User, Users, MessagesSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { KeyMetricCard, getTrendIndicator } from './KeyMetricCard';
import { CommunityHealthMetrics } from '@/services/analytics/types/communityHealthTypes';

interface MetricsSummaryProps {
  metrics: CommunityHealthMetrics;
}

export function MetricsSummary({ metrics }: MetricsSummaryProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <KeyMetricCard
        title="Active Users"
        value={metrics.activeUsers}
        badge={
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-800/30 dark:text-blue-300">
            <User className="h-4 w-4 mr-1" />
            {getTrendIndicator(metrics.activeUsers, metrics.activeUsers * 0.9).text}
          </Badge>
        }
      />
      
      <KeyMetricCard
        title="Retention"
        value={`${(metrics.retentionRate * 100).toFixed(1)}%`}
        badge={
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-800/30 dark:text-green-300">
            <Users className="h-4 w-4 mr-1" />
            {getTrendIndicator(metrics.retentionRate, metrics.retentionRate * 0.95).text}
          </Badge>
        }
      />
      
      <KeyMetricCard
        title="New Content"
        value={metrics.contentCreation}
        badge={
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 dark:bg-purple-800/30 dark:text-purple-300">
            <MessagesSquare className="h-4 w-4 mr-1" />
            {getTrendIndicator(metrics.contentCreation, metrics.contentCreation * 0.85).text}
          </Badge>
        }
      />
      
      <KeyMetricCard
        title="Issues"
        value={metrics.issuesReported}
        badge={
          <Badge className={metrics.issuesReported > 5 
            ? "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-800/30 dark:text-red-300"
            : "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-800/30 dark:text-green-300"
          }>
            {metrics.issuesReported > 5 
              ? getTrendIndicator(metrics.issuesReported, metrics.issuesReported * 0.7).text
              : "Low"
            }
          </Badge>
        }
      />
    </div>
  );
}
