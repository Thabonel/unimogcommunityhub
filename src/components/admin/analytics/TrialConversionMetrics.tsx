
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ConversionMetricsProps {
  dateRange: { from: Date; to: Date };
}

export function TrialConversionMetrics({ dateRange }: ConversionMetricsProps) {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<{
    totalVisitors: number;
    signupRate: number;
    trialConversionRate: number;
    subscriptionConversionRate: number;
    chartData: any[];
  }>({
    totalVisitors: 0,
    signupRate: 0,
    trialConversionRate: 0,
    subscriptionConversionRate: 0,
    chartData: []
  });
  
  useEffect(() => {
    const fetchConversionData = async () => {
      setLoading(true);
      
      try {
        // Format dates for query
        const fromDate = dateRange.from.toISOString();
        const toDate = dateRange.to.toISOString();
        
        // Get visitor data
        const { data: visitorData, error: visitorError } = await supabase
          .from('visitor_analytics')
          .select('*')
          .gte('visited_at', fromDate)
          .lte('visited_at', toDate);
          
        if (visitorError) throw visitorError;
        
        // Get trial data
        const { data: trialData, error: trialError } = await supabase
          .from('user_trials')
          .select('*')
          .gte('created_at', fromDate)
          .lte('created_at', toDate);
          
        if (trialError) throw trialError;
        
        // Get subscription data
        const { data: subscriptionData, error: subscriptionError } = await supabase
          .from('user_subscriptions')
          .select('*')
          .gte('created_at', fromDate)
          .lte('created_at', toDate);
          
        if (subscriptionError) throw subscriptionError;
        
        // Calculate metrics
        const totalVisitors = visitorData?.length || 0;
        const totalSignups = visitorData?.filter(v => v.signed_up).length || 0;
        const totalTrials = visitorData?.filter(v => v.converted_to_trial).length || 0;
        const totalSubscriptions = visitorData?.filter(v => v.converted_to_subscription).length || 0;
        
        const signupRate = totalVisitors > 0 ? (totalSignups / totalVisitors) * 100 : 0;
        const trialConversionRate = totalVisitors > 0 ? (totalTrials / totalVisitors) * 100 : 0;
        const subscriptionConversionRate = totalTrials > 0 ? (totalSubscriptions / totalTrials) * 100 : 0;
        
        // Process data by day for the chart
        const dateMap = new Map();
        const startDate = new Date(dateRange.from);
        const endDate = new Date(dateRange.to);
        
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
        visitorData?.forEach(visitor => {
          const dateString = new Date(visitor.visited_at).toISOString().split('T')[0];
          if (dateMap.has(dateString)) {
            const dayData = dateMap.get(dateString);
            dayData.visitors += 1;
            if (visitor.signed_up) dayData.signups += 1;
            if (visitor.converted_to_trial) dayData.trials += 1;
            if (visitor.converted_to_subscription) dayData.subscriptions += 1;
            dateMap.set(dateString, dayData);
          }
        });
        
        // Convert to chart data array
        const chartData = Array.from(dateMap.values());
        
        setMetrics({
          totalVisitors,
          signupRate,
          trialConversionRate,
          subscriptionConversionRate,
          chartData
        });
      } catch (error) {
        console.error('Error fetching conversion metrics:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchConversionData();
  }, [dateRange]);
  
  if (loading) {
    return (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Trial Conversion Funnel</CardTitle>
          <CardDescription>Tracking visitors through trial and subscription</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="col-span-2">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-baseline justify-between">
          <div>
            <CardTitle>Trial Conversion Funnel</CardTitle>
            <CardDescription>Tracking visitors through trial and subscription</CardDescription>
          </div>
          <div className="text-sm font-medium mt-2 sm:mt-0">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-muted-foreground">Signup Rate</div>
                <div className="text-xl">{metrics.signupRate.toFixed(1)}%</div>
              </div>
              <div className="text-center">
                <div className="text-muted-foreground">Trial Rate</div>
                <div className="text-xl">{metrics.trialConversionRate.toFixed(1)}%</div>
              </div>
              <div className="text-center">
                <div className="text-muted-foreground">Subscription Rate</div>
                <div className="text-xl">{metrics.subscriptionConversionRate.toFixed(1)}%</div>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={metrics.chartData} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                angle={-45} 
                textAnchor="end" 
                height={60} 
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="visitors" 
                stroke="#8884d8" 
                name="Visitors"
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="signups" 
                stroke="#82ca9d" 
                name="Signups"
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="trials" 
                stroke="#ffc658" 
                name="Trials Started"
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="subscriptions" 
                stroke="#ff8042" 
                name="Subscriptions"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export default TrialConversionMetrics;
