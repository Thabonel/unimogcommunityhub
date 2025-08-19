
/**
 * Calculates start date based on timeframe
 */
export const getStartDateForTimeframe = (
  timeframe: 'day' | 'week' | 'month' | 'quarter'
): Date => {
  const now = new Date();
  const startDate = new Date();
  
  switch (timeframe) {
    case 'day':
      startDate.setDate(now.getDate() - 1);
      break;
    case 'week':
      startDate.setDate(now.getDate() - 7);
      break;
    case 'month':
      startDate.setMonth(now.getMonth() - 1);
      break;
    case 'quarter':
      startDate.setMonth(now.getMonth() - 3);
      break;
  }
  
  return startDate;
};

/**
 * Calculates previous period start date based on current timeframe
 */
export const getPreviousPeriodStartDate = (
  startDate: Date,
  timeframe: 'day' | 'week' | 'month' | 'quarter'
): Date => {
  const previousStartDate = new Date(startDate);
  
  switch (timeframe) {
    case 'day':
      previousStartDate.setDate(previousStartDate.getDate() - 1);
      break;
    case 'week':
      previousStartDate.setDate(previousStartDate.getDate() - 7);
      break;
    case 'month':
      previousStartDate.setMonth(previousStartDate.getMonth() - 1);
      break;
    case 'quarter':
      previousStartDate.setMonth(previousStartDate.getMonth() - 3);
      break;
  }
  
  return previousStartDate;
};
