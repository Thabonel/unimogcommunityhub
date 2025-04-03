
import { useQuery } from '@tanstack/react-query';
import { DateRange, UseTrialConversionMetricsResult } from './trial-conversion/types';
import { fetchConversionData } from './trial-conversion/fetch-conversion-data';
import { useErrorHandler } from '@/hooks/use-error-handler';

/**
 * Hook to fetch and manage trial conversion metrics data
 */
export const useTrialConversionMetrics = (dateRange: DateRange): UseTrialConversionMetricsResult => {
  const { handleError } = useErrorHandler();

  const { 
    data: metrics,
    isLoading: loading,
    error,
    isError,
    refetch
  } = useQuery({
    queryKey: ['trialConversionMetrics', dateRange.from.toISOString(), dateRange.to.toISOString()],
    queryFn: () => fetchConversionData(dateRange),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,  // 10 minutes
    retry: 1,
    onError: (error) => {
      handleError(error, {
        context: 'Conversion Metrics',
        showToast: true
      });
    }
  });

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
