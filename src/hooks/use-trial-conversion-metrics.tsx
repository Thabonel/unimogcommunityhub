
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
    isFetching,
    isStale,
    dataUpdatedAt
  } = useQuery({
    queryKey: ['trialConversionMetrics', dateRange.from.toISOString(), dateRange.to.toISOString()],
    queryFn: () => fetchConversionData(dateRange),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,  // 10 minutes
    retry: 3, // Increased from 2 to 3 retries
    retryDelay: attempt => Math.min(1000 * Math.pow(2, attempt), 30 * 1000), // Exponential backoff
    meta: {
      onError: (error: Error) => {
        handleError(error, {
          context: 'Conversion Metrics',
          showToast: true
        });
      }
    }
  });

  // Enhanced debugging 
  if (isFetching) {
    console.log('Fetching conversion metrics data...', {
      dateRange,
      dataAge: dataUpdatedAt ? `${Math.round((Date.now() - dataUpdatedAt) / 1000)}s old` : 'N/A',
      isStale
    });
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
    refetch,
    isFetching,
    dataUpdatedAt
  };
};
