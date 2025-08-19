
import { supabase } from '@/lib/supabase-client';
import { DateRange, TrialConversionMetricsData } from './types';
import { generateMockData } from './mock-data-utils';
import { processRealChartData } from './data-processing-utils';

const QUERY_TIMEOUT = 12000; // 12 seconds timeout for each query

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
  let errors: string[] = [];
  
  try {
    console.log('Fetching conversion data for range:', { from: fromDate, to: toDate });
    
    // Setup promise with timeout for visitor data
    const visitorPromise = new Promise<any[]>(async (resolve, reject) => {
      try {
        const visitorStartTime = Date.now();
        const { data, error } = await supabase
          .from('visitor_analytics')
          .select('*')
          .gte('visited_at', fromDate)
          .lte('visited_at', toDate)
          .order('visited_at', { ascending: true });
        
        const visitorFetchTime = Date.now() - visitorStartTime;
        console.log(`Visitor data fetch took ${visitorFetchTime}ms`);
          
        if (error) {
          console.error('Error fetching visitor data:', error);
          errors.push(`Visitor data: ${error.message}`);
          resolve([]);
        } else if (data && data.length > 0) {
          console.log('Got visitor data:', data.length);
          resolve(data);
        } else {
          console.log('No visitor data found');
          resolve([]);
        }
      } catch (err) {
        console.error('Unexpected error in visitor fetch:', err);
        errors.push(`Visitor exception: ${err instanceof Error ? err.message : String(err)}`);
        resolve([]);
      }
    });
    
    // Setup promise with timeout for trial data
    const trialPromise = new Promise<any[]>(async (resolve, reject) => {
      try {
        const trialStartTime = Date.now();
        const { data, error } = await supabase
          .from('user_trials')
          .select('*')
          .gte('created_at', fromDate)
          .lte('created_at', toDate)
          .order('created_at', { ascending: true });
        
        const trialFetchTime = Date.now() - trialStartTime;
        console.log(`Trial data fetch took ${trialFetchTime}ms`);
          
        if (error) {
          console.error('Error fetching trial data:', error);
          errors.push(`Trial data: ${error.message}`);
          resolve([]);
        } else if (data && data.length > 0) {
          console.log('Got trial data:', data.length);
          resolve(data);
        } else {
          console.log('No trial data found');
          resolve([]);
        }
      } catch (err) {
        console.error('Unexpected error in trial fetch:', err);
        errors.push(`Trial exception: ${err instanceof Error ? err.message : String(err)}`);
        resolve([]);
      }
    });
    
    // Setup promise with timeout for subscription data
    const subscriptionPromise = new Promise<any[]>(async (resolve, reject) => {
      try {
        const subStartTime = Date.now();
        const { data, error } = await supabase
          .from('user_subscriptions')
          .select('*')
          .gte('created_at', fromDate)
          .lte('created_at', toDate)
          .order('created_at', { ascending: true });
        
        const subFetchTime = Date.now() - subStartTime;
        console.log(`Subscription data fetch took ${subFetchTime}ms`);
          
        if (error) {
          console.error('Error fetching subscription data:', error);
          errors.push(`Subscription data: ${error.message}`);
          resolve([]);
        } else if (data && data.length > 0) {
          console.log('Got subscription data:', data.length);
          resolve(data);
        } else {
          console.log('No subscription data found');
          resolve([]);
        }
      } catch (err) {
        console.error('Unexpected error in subscription fetch:', err);
        errors.push(`Subscription exception: ${err instanceof Error ? err.message : String(err)}`);
        resolve([]);
      }
    });

    // Use Promise.race to implement timeouts
    const timeoutPromise = (ms: number) => new Promise((_resolve, reject) => 
      setTimeout(() => reject(new Error(`Query timed out after ${ms}ms`)), ms)
    );
    
    // Fetch all data with timeouts in parallel
    const [visitorResult, trialResult, subscriptionResult] = await Promise.all([
      Promise.race([visitorPromise, timeoutPromise(QUERY_TIMEOUT)]).catch(err => {
        console.error('Visitor query timeout:', err);
        errors.push(`Visitor timeout after ${QUERY_TIMEOUT}ms`);
        return [];
      }),
      Promise.race([trialPromise, timeoutPromise(QUERY_TIMEOUT)]).catch(err => {
        console.error('Trial query timeout:', err);
        errors.push(`Trial timeout after ${QUERY_TIMEOUT}ms`);
        return [];
      }),
      Promise.race([subscriptionPromise, timeoutPromise(QUERY_TIMEOUT)]).catch(err => {
        console.error('Subscription query timeout:', err);
        errors.push(`Subscription timeout after ${QUERY_TIMEOUT}ms`);
        return [];
      })
    ]);

    visitorData = visitorResult as any[] || [];
    trialData = trialResult as any[] || [];
    subscriptionData = subscriptionResult as any[] || [];
    
    // Check if we have any real data
    hasRealData = visitorData.length > 0 || trialData.length > 0 || subscriptionData.length > 0;
    console.log('Data fetching complete, has real data:', hasRealData);
    
    if (errors.length > 0) {
      console.warn('Some errors occurred while fetching data:', errors);
    }

  } catch (error) {
    console.error('Unexpected error fetching data:', error);
    throw new Error('Failed to fetch conversion data: ' + (error instanceof Error ? error.message : String(error)));
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
