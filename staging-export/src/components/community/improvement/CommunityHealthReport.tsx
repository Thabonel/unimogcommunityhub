
import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  getCommunityHealthMetrics, 
  generateCommunityHealthReport,
} from '@/services/analytics/communityHealthService';
import { CommunityTimeframe, CommunityHealthMetrics } from '@/services/analytics/types/communityHealthTypes';
import { MetricsTimeframeSelector } from './health/MetricsTimeframeSelector';
import { MetricsSummary } from './health/MetricsSummary';
import { MetricsChartTabs } from './health/MetricsChartTabs';
import { TopContributors } from './health/TopContributors';
import { FullReportView } from './health/FullReportView';
import { LoadingState, ErrorState } from './health/CommunityHealthMetricsLoader';
import { 
  activeUsersHistory, 
  engagementHistory, 
  retentionHistory, 
  newContentHistory 
} from './health/CommunityHealthData';

export function CommunityHealthReport() {
  const [timeframe, setTimeframe] = useState<CommunityTimeframe>('week');
  const [metrics, setMetrics] = useState<CommunityHealthMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [reportText, setReportText] = useState<string | null>(null);
  const [showFullReport, setShowFullReport] = useState(false);
  
  // Fetch metrics data
  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      const data = await getCommunityHealthMetrics(timeframe);
      setMetrics(data);
      setLoading(false);
    };
    
    fetchMetrics();
  }, [timeframe]);
  
  // Handle timeframe change
  const handleTimeframeChange = (value: CommunityTimeframe) => {
    setTimeframe(value);
  };
  
  // Handle refresh
  const handleRefresh = () => {
    setMetrics(null);
    getCommunityHealthMetrics(timeframe).then(setMetrics);
  };
  
  // Generate report
  const handleGenerateReport = async () => {
    setLoading(true);
    const report = await generateCommunityHealthReport(timeframe);
    setReportText(report);
    setShowFullReport(true);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Community Health</CardTitle>
              <CardDescription>
                Monitor and analyze community engagement metrics
              </CardDescription>
            </div>
            
            <MetricsTimeframeSelector 
              timeframe={timeframe}
              onTimeframeChange={handleTimeframeChange}
              onRefresh={handleRefresh}
            />
          </div>
        </CardHeader>
        
        <CardContent>
          {loading ? (
            <LoadingState />
          ) : !metrics ? (
            <ErrorState onRetry={handleRefresh} />
          ) : (
            <>
              {/* Key metrics summary */}
              <MetricsSummary metrics={metrics} />
              
              {/* Charts section */}
              <MetricsChartTabs 
                activeUsersHistory={activeUsersHistory}
                engagementHistory={engagementHistory}
                retentionHistory={retentionHistory}
                newContentHistory={newContentHistory}
              />
              
              {/* Contributors section */}
              <TopContributors contributors={metrics.topContributors} />
              
              {/* Generate report button */}
              <div className="mt-8 flex justify-end">
                <Button onClick={handleGenerateReport}>
                  Generate Full Report
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      {/* Full Report Dialog */}
      <FullReportView 
        reportText={reportText} 
        showFullReport={showFullReport} 
      />
    </div>
  );
}
