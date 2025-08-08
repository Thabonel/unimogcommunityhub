
import { DateRange, ChartDataPoint } from './types';

/**
 * Processes real data from Supabase into the format needed for the chart
 */
export const processRealChartData = (dateRange: DateRange, visitorData: any[], trialData: any[], subscriptionData: any[]) => {
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
