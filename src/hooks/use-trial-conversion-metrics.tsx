
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useErrorHandler } from '@/hooks/use-error-handler';

interface DateRange {
  from: Date;
  to: Date;
}

interface ChartDataPoint {
  date: string;
  visitors: number;
  signups: number;
  trials: number;
  subscriptions: number;
}

interface TrialConversionMetricsData {
  totalVisitors: number;
  signupRate: number;
  trialConversionRate: number;
  subscriptionConversionRate: number;
  chartData: ChartDataPoint[];
}

// Helper function to generate mock data
const generateMockData = (startDate: Date, endDate: Date) => {
  const chartData = [];
  const totalDays = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const totalVisitors = totalDays * Math.floor(Math.random() * 20) + 40;
  
  for (let i = 0; i < totalDays; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    const dateString = currentDate.toISOString().split('T')[0];
    
    const dailyVisitors = Math.floor(Math.random() * 20) + 40;
    const dailySignups = Math.floor(dailyVisitors * (0.3 + Math.random() * 0.3));
    const dailyTrials = Math.floor(dailySignups * (0.5 + Math.random() * 0.3));
    const dailySubscriptions = Math.floor(dailyTrials * (0.4 + Math.random() * 0.3));
    
    chartData.push({
      date: dateString,
      visitors: dailyVisitors,
      signups: dailySignups,
      trials: dailyTrials,
      subscriptions: dailySubscriptions
    });
  }
  
  return { totalVisitors, chartData };
};

// Helper function to process real data for chart
const processRealChartData = (dateRange: DateRange, visitorData: any[], trialData: any[], subscriptionData: any[]) => {
  const dateMap = new Map();
  const startDate = new Date(dateRange.from);
  const endDate = new Date(dateRange.to);
  
  // Initialize all dates in range
  for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
    const dateString = date.toISOString().split('T')[0];
    dateMap.set(dateString, {
      date: dateString,
      visitors: 0,
      signups: 0,
      trials: 0,
      subscriptions: 0
    });
  }
  
  // Fill in visitor data
  visitorData.forEach(visitor => {
    if (!visitor || !visitor.visited_at) return;
    const dateString = new Date(visitor.visited_at).toISOString().split('T')[0];
    if (dateMap.has(dateString)) {
      const dayData = dateMap.get(dateString);
      dayData.visitors += 1;
      if (visitor.signed_up) dayData.signups += 1;
      dateMap.set(dateString, dayData);
    }
  });
  
  // Fill in trial data
  trialData.forEach(trial => {
    if (!trial || !trial.created_at) return;
    const dateString = new Date(trial.created_at).toISOString().split('T')[0];
    if (dateMap.has(dateString)) {
      const dayData = dateMap.get(dateString);
      dayData.trials += 1;
      dateMap.set(dateString, dayData);
    }
  });
  
  // Fill in subscription data
  subscriptionData.forEach(sub => {
    if (!sub || !sub.created_at) return;
    const dateString = new Date(sub.created_at).toISOString().split('T')[0];
    if (dateMap.has(dateString)) {
      const dayData = dateMap.get(dateString);
      dayData.subscriptions += 1;
      dateMap.set(dateString, dayData);
    }
  });
  
  // Convert to chart data array
  return Array.from(dateMap.values());
};

// Main conversion data fetcher function
const fetchConversionData = async (dateRange: DateRange): Promise<TrialConversionMetricsData> => {
  // Format dates for query
  const fromDate = dateRange.from.toISOString();
  const toDate = dateRange.to.toISOString();
  
  // Initialize data containers
  let visitorData: any[] = [];
  let trialData: any[] = [];
  let subscriptionData: any[] = [];
  let hasRealData = false; 
  
  try {
    // Get visitor data
    const { data: realVisitorData, error: visitorError } = await supabase
      .from('visitor_analytics')
      .select('*')
      .gte('visited_at', fromDate)
      .lte('visited_at', toDate);
      
    if (!visitorError && realVisitorData && realVisitorData.length > 0) {
      visitorData = realVisitorData;
      hasRealData = true;
      console.log('Got visitor data:', realVisitorData.length);
    }
    
    // Get trial data
    const { data: realTrialData, error: trialError } = await supabase
      .from('user_trials')
      .select('*')
      .gte('created_at', fromDate)
      .lte('created_at', toDate);
      
    if (!trialError && realTrialData && realTrialData.length > 0) {
      trialData = realTrialData;
      hasRealData = true;
      console.log('Got trial data:', realTrialData.length);
    }
    
    // Get subscription data
    const { data: realSubData, error: subscriptionError } = await supabase
      .from('user_subscriptions')
      .select('*')
      .gte('created_at', fromDate)
      .lte('created_at', toDate);
      
    if (!subscriptionError && realSubData && realSubData.length > 0) {
      subscriptionData = realSubData;
      hasRealData = true;
      console.log('Got subscription data:', realSubData.length);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    throw new Error('Failed to fetch conversion data');
  }
  
  // Get mock data as fallback
  const mockData = generateMockData(dateRange.from, dateRange.to);
  
  // Calculate metrics (using real data if available, mock data otherwise)
  const totalVisitors = visitorData.length > 0 ? visitorData.length : mockData.totalVisitors;
  const totalSignups = visitorData.length > 0 ? 
    visitorData.filter(v => v.signed_up).length : 
    Math.floor(mockData.totalVisitors * 0.45);
    
  const totalTrials = trialData.length > 0 ? 
    trialData.length : 
    Math.floor(mockData.totalVisitors * 0.25);
    
  const totalSubscriptions = subscriptionData.length > 0 ? 
    subscriptionData.length : 
    Math.floor(mockData.totalVisitors * 0.12);
  
  const signupRate = totalVisitors > 0 ? (totalSignups / totalVisitors) * 100 : 0;
  const trialConversionRate = totalVisitors > 0 ? (totalTrials / totalVisitors) * 100 : 0;
  const subscriptionConversionRate = totalTrials > 0 ? (totalSubscriptions / totalTrials) * 100 : 0;
  
  // Process data by day for the chart
  const chartData = hasRealData ? 
    processRealChartData(dateRange, visitorData, trialData, subscriptionData) : 
    mockData.chartData;
  
  return {
    totalVisitors,
    signupRate,
    trialConversionRate,
    subscriptionConversionRate,
    chartData
  };
};

export const useTrialConversionMetrics = (dateRange: DateRange) => {
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
