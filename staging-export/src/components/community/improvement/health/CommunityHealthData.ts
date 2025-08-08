
// Sample historical data for charts
export const generateHistoricalData = (metric: string, timeframes: number, baseValue: number) => {
  const data = [];
  let lastValue = baseValue;
  
  for (let i = timeframes; i >= 0; i--) {
    // Random fluctuation between -15% and +20%
    const change = (Math.random() * 0.35) - 0.15;
    lastValue = Math.max(0, lastValue * (1 + change));
    
    data.push({
      timeframe: i === 0 ? 'Current' : `${i} ${i === 1 ? 'period' : 'periods'} ago`,
      [metric]: Math.round(lastValue)
    });
  }
  
  return data;
};

// Fake historical data
export const activeUsersHistory = generateHistoricalData('activeUsers', 12, 500);
export const engagementHistory = generateHistoricalData('engagementRate', 12, 0.4);
export const retentionHistory = generateHistoricalData('retentionRate', 12, 0.6);
export const newContentHistory = generateHistoricalData('newContent', 12, 75);
