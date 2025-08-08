
import { DateRange, ChartDataPoint } from './types';

/**
 * Generates mock data for trial conversion metrics visualization
 */
export const generateMockData = (startDate: Date, endDate: Date) => {
  const chartData: ChartDataPoint[] = [];
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
