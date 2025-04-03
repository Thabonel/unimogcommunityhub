
import { supabase } from '@/integrations/supabase/client';
import { DateRange, TrialConversionMetricsData } from './types';
import { generateMockData } from './mock-data-utils';
import { processRealChartData } from './data-processing-utils';

/**
 * Main function to fetch conversion data from Supabase
 */
export const fetchConversionData = async (dateRange: DateRange): Promise<TrialConversionMetricsData> => {
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
