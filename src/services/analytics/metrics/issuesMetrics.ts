
import { supabase } from '@/lib/supabase';

/**
 * Fetches reported issues for a given time period
 */
export const getReportedIssues = async (startTimestamp: string) => {
  const { data, error } = await supabase
    .from('feedback')
    .select('id')
    .eq('type', 'bug')
    .gte('created_at', startTimestamp);
  
  if (error) {
    console.error('Error fetching reported issues:', error);
  }
  
  return { data, error };
};
