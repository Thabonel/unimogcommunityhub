
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SubscriptionMetricsProps {
  dateRange: { from: Date; to: Date };
  userType: string;
}

export function SubscriptionMetrics({ dateRange, userType }: SubscriptionMetricsProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [conversionRate, setConversionRate] = useState<number>(0);
  const [retentionRate, setRetentionRate] = useState<number>(0);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      setLoading(true);
      try {
        // This would be replaced with real data fetching
        // For now we'll use mock data that changes based on the filters
        let mockData;
        
        // Different data for different user filters
        switch(userType) {
          case 'premium':
            mockData = [
              { name: 'Premium', value: 85 },
              { name: 'Basic', value: 15 }
            ];
            setConversionRate(35);
            setRetentionRate(92);
            break;
          case 'basic':
            mockData = [
              { name: 'Premium', value: 10 },
              { name: 'Basic', value: 90 }
            ];
            setConversionRate(28);
            setRetentionRate(78);
            break;
          case 'trial':
            mockData = [
              { name: 'Trial', value: 100 }
            ];
            setConversionRate(22);
            setRetentionRate(0);
            break;
          case 'free':
            mockData = [
              { name: 'Free', value: 100 }
            ];
            setConversionRate(12);
            setRetentionRate(0);
            break;
          default:
            mockData = [
              { name: 'Premium', value: 25 },
              { name: 'Basic', value: 35 },
              { name: 'Trial', value: 15 },
              { name: 'Free', value: 25 }
            ];
            setConversionRate(24);
            setRetentionRate(82);
        }
        
        setData(mockData);
      } catch (error) {
        console.error("Error fetching subscription data:", error);
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
