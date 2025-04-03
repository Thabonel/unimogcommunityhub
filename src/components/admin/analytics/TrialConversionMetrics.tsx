
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ConversionFunnelChart } from './ConversionFunnelChart';
import { ConversionMetricsSummary } from './ConversionMetricsSummary';
import { ConversionLoadingState } from './ConversionLoadingState';
import { useTrialConversionMetrics } from '@/hooks/use-trial-conversion-metrics';

interface ConversionMetricsProps {
  dateRange: { from: Date; to: Date };
}

export function TrialConversionMetrics({ dateRange }: ConversionMetricsProps) {
  const { loading, metrics } = useTrialConversionMetrics(dateRange);
  
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
        <ConversionFunnelChart data={metrics.chartData} />
      </CardContent>
    </Card>
  );
}

export default TrialConversionMetrics;
