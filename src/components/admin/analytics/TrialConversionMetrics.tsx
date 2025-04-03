
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ConversionFunnelChart } from './ConversionFunnelChart';
import { ConversionMetricsSummary } from './ConversionMetricsSummary';
import { ConversionLoadingState } from './ConversionLoadingState';
import { useTrialConversionMetrics } from '@/hooks/use-trial-conversion-metrics';
import { useToast } from '@/hooks/use-toast';

interface ConversionMetricsProps {
  dateRange: { from: Date; to: Date };
}

export function TrialConversionMetrics({ dateRange }: ConversionMetricsProps) {
  const { loading, metrics, isError, refetch } = useTrialConversionMetrics(dateRange);
  const { toast } = useToast();
  
  // Handle retry on error
  const handleRetry = () => {
    toast({
      title: "Retrying",
      description: "Attempting to fetch conversion metrics again"
    });
    refetch();
  };
  
  if (loading) {
    return <ConversionLoadingState />;
  }
  
  return (
    <Card className="col-span-2">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-baseline justify-between">
          <div>
            <CardTitle>Trial Conversion Funnel</CardTitle>
            <CardDescription>Tracking visitors through trial and subscription</CardDescription>
          </div>
          <ConversionMetricsSummary 
            signupRate={metrics.signupRate}
            trialConversionRate={metrics.trialConversionRate}
            subscriptionConversionRate={metrics.subscriptionConversionRate}
          />
        </div>
      </CardHeader>
      <CardContent>
        {isError ? (
          <div className="h-[300px] flex flex-col items-center justify-center text-center p-6">
            <p className="text-muted-foreground mb-4">Unable to load conversion metrics</p>
            <button 
              onClick={handleRetry}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium"
            >
              Retry
            </button>
          </div>
        ) : (
          <ConversionFunnelChart data={metrics.chartData} />
        )}
      </CardContent>
    </Card>
  );
}

export default TrialConversionMetrics;
