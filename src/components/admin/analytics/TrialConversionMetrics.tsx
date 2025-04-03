
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { ConversionFunnelChart } from './ConversionFunnelChart';
import { ConversionMetricsSummary } from './ConversionMetricsSummary';
import { ConversionLoadingState } from './ConversionLoadingState';
import { ChartTypeToggle } from './ChartTypeToggle';
import { useTrialConversionMetrics } from '@/hooks/use-trial-conversion-metrics';
import { useToast } from '@/hooks/use-toast';

interface ConversionMetricsProps {
  dateRange: { from: Date; to: Date };
}

export function TrialConversionMetrics({ dateRange }: ConversionMetricsProps) {
  const { loading, metrics, isError, refetch, isFetching, dataUpdatedAt } = useTrialConversionMetrics(dateRange);
  const { toast } = useToast();
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area'>('line');
  const [retryCount, setRetryCount] = useState(0);
  
  // Handle retry on error or timeout with improved logging
  const handleRetry = useCallback(() => {
    const newRetryCount = retryCount + 1;
    setRetryCount(newRetryCount);
    
    console.log(`Manually retrying conversion metrics (attempt ${newRetryCount})`, {
      dateRange,
      lastDataUpdate: dataUpdatedAt ? new Date(dataUpdatedAt).toISOString() : 'never'
    });
    
    toast({
      title: "Retrying",
      description: "Attempting to fetch conversion metrics again"
    });
    
    refetch();
  }, [retryCount, dateRange, dataUpdatedAt, toast, refetch]);
  
  if (loading || isFetching) {
    return <ConversionLoadingState 
      timeout={20000} // Increased timeout to 20 seconds
      onRetry={handleRetry} 
      dataUpdatedAt={dataUpdatedAt}
    />;
  }
  
  return (
    <Card className="col-span-2">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-baseline justify-between">
          <div>
            <CardTitle>Trial Conversion Funnel</CardTitle>
            <CardDescription>Tracking visitors through trial and subscription</CardDescription>
          </div>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <ChartTypeToggle value={chartType} onValueChange={setChartType} />
            <ConversionMetricsSummary 
              signupRate={metrics.signupRate}
              trialConversionRate={metrics.trialConversionRate}
              subscriptionConversionRate={metrics.subscriptionConversionRate}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isError ? (
          <div className="h-[300px] flex flex-col items-center justify-center text-center p-6 space-y-4">
            <Alert variant="destructive" className="w-full max-w-md">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Unable to load conversion metrics. Please try again or contact support if the issue persists.
              </AlertDescription>
            </Alert>
            <Button 
              onClick={handleRetry}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </div>
        ) : metrics.chartData.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center">
            <Alert variant="warning" className="w-full max-w-md">
              <AlertTitle>No Data</AlertTitle>
              <AlertDescription>
                No conversion data available for the selected date range. Try selecting a different time period.
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <ConversionFunnelChart data={metrics.chartData} chartType={chartType} />
        )}
      </CardContent>
    </Card>
  );
}

export default TrialConversionMetrics;
