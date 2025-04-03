
export interface DateRange {
  from: Date;
  to: Date;
}

export interface ChartDataPoint {
  date: string;
  visitors: number;
  signups: number;
  trials: number;
  subscriptions: number;
}

export interface TrialConversionMetricsData {
  totalVisitors: number;
  signupRate: number;
  trialConversionRate: number;
  subscriptionConversionRate: number;
  chartData: ChartDataPoint[];
}

export interface UseTrialConversionMetricsResult {
  loading: boolean;
  metrics: TrialConversionMetricsData;
  error: Error | null;
  isError: boolean;
  refetch: () => void;
  isFetching: boolean;
  isStale: boolean;
  dataUpdatedAt: number | null;
}
