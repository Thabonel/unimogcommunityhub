
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { analyticsService, type SubscriptionData } from '@/services/analytics/AnalyticsService';

interface SubscriptionMetricsProps {
  dateRange: { from: Date; to: Date };
  userType: string;
}

export function SubscriptionMetrics({ dateRange, userType }: SubscriptionMetricsProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<SubscriptionData[]>([]);
  const [conversionRate, setConversionRate] = useState<number>(0);
  const [retentionRate, setRetentionRate] = useState<number>(0);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      setLoading(true);
      try {
        const subscriptionData = await analyticsService.getSubscriptionData(dateRange, userType);
        setData(subscriptionData.data);
        setConversionRate(subscriptionData.conversionRate);
        setRetentionRate(subscriptionData.retentionRate);
      } catch (error) {
        console.error("Error fetching subscription data:", error);
        // Keep existing data if error occurs
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionData();
  }, [dateRange, userType]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription Distribution</CardTitle>
          <CardDescription>Breakdown of user subscription types</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Subscription Distribution</CardTitle>
          <CardDescription>Breakdown of user subscription types</CardDescription>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-primary/10">
            Conversion: {conversionRate}%
          </Badge>
          {retentionRate > 0 && (
            <Badge variant="outline" className="bg-green-500/10">
              Retention: {retentionRate}%
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
