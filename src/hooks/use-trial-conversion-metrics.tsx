
import { useQuery } from '@tanstack/react-query';
import { DateRange, UseTrialConversionMetricsResult } from './trial-conversion/types';
import { fetchConversionData } from './trial-conversion/fetch-conversion-data';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook to fetch and manage trial conversion metrics data
 */
export const useTrialConversionMetrics = (dateRange: DateRange): UseTrialConversionMetricsResult => {
  const { handleError } = useErrorHandler();
  const { toast } = useToast();

  const { 
    data: metrics,
    isLoading: loading,
    error,
    isError,
    refetch,
    isFetching
  } = useQuery({
    queryKey: ['trialConversionMetrics', dateRange.from.toISOString(), dateRange.to.toISOString()],
    queryFn: () => fetchConversionData(dateRange),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,  // 10 minutes
    retry: 2, // Increased from 1 to 2 retries
    retryDelay: attempt => Math.min(attempt > 1 ? 3000 : 1000, 30 * 1000), // Progressive retry delay
    meta: {
      onError: (error: Error) => {
        handleError(error, {
          context: 'Conversion Metrics',
          showToast: true
        });
      }
    }
  });

  // Report when fetching starts/completes for debugging
  if (isFetching) {
    console.log('Fetching conversion metrics data...');
  }

  return { 
    loading, 
    metrics: metrics || {
      totalVisitors: 0,
      signupRate: 0,
      trialConversionRate: 0,
      subscriptionConversionRate: 0,
      chartData: []
    },
    error,
    isError,
    refetch
  };
};
