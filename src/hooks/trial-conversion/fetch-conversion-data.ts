
import { supabase } from '@/lib/supabase';
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
    console.log('Fetching conversion data for range:', { from: fromDate, to: toDate });
    
    // Get visitor data
    const visitorStartTime = Date.now();
    const { data: realVisitorData, error: visitorError } = await supabase
      .from('visitor_analytics')
      .select('*')
      .gte('visited_at', fromDate)
      .lte('visited_at', toDate)
      .order('visited_at', { ascending: true })
      .timeout(8000); // Add timeout to avoid hanging
    
    const visitorFetchTime = Date.now() - visitorStartTime;
    console.log(`Visitor data fetch took ${visitorFetchTime}ms`);
      
    if (visitorError) {
      console.error('Error fetching visitor data:', visitorError);
    } else if (realVisitorData && realVisitorData.length > 0) {
      visitorData = realVisitorData;
      hasRealData = true;
      console.log('Got visitor data:', realVisitorData.length);
    }
    
    // Get trial data
    const trialStartTime = Date.now();
    const { data: realTrialData, error: trialError } = await supabase
      .from('user_trials')
      .select('*')
      .gte('created_at', fromDate)
      .lte('created_at', toDate)
      .order('created_at', { ascending: true })
      .timeout(8000); // Add timeout to avoid hanging
    
    const trialFetchTime = Date.now() - trialStartTime;
    console.log(`Trial data fetch took ${trialFetchTime}ms`);
      
    if (trialError) {
      console.error('Error fetching trial data:', trialError);
    } else if (realTrialData && realTrialData.length > 0) {
      trialData = realTrialData;
      hasRealData = true;
      console.log('Got trial data:', realTrialData.length);
    }
    
    // Get subscription data
    const subStartTime = Date.now();
    const { data: realSubData, error: subscriptionError } = await supabase
      .from('user_subscriptions')
      .select('*')
      .gte('created_at', fromDate)
      .lte('created_at', toDate)
      .order('created_at', { ascending: true })
      .timeout(8000); // Add timeout to avoid hanging
    
    const subFetchTime = Date.now() - subStartTime;
    console.log(`Subscription data fetch took ${subFetchTime}ms`);
      
    if (subscriptionError) {
      console.error('Error fetching subscription data:', subscriptionError);
    } else if (realSubData && realSubData.length > 0) {
      subscriptionData = realSubData;
      hasRealData = true;
      console.log('Got subscription data:', realSubData.length);
    }

    const totalFetchTime = visitorFetchTime + trialFetchTime + subFetchTime;
    console.log(`Total data fetch completed in ${totalFetchTime}ms`);

  } catch (error) {
    console.error('Unexpected error fetching data:', error);
    throw new Error('Failed to fetch conversion data: ' + (error instanceof Error ? error.message : String(error)));
  }
  
  console.log('Data fetching complete, has real data:', hasRealData);
  
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
