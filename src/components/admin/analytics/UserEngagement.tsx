
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { analyticsService, type EngagementData } from '@/services/analytics/AnalyticsService';

interface UserEngagementProps {
  dateRange: { from: Date; to: Date };
  userType: string;
}

export function UserEngagement({ dateRange, userType }: UserEngagementProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<EngagementData[]>([]);

  useEffect(() => {
    const fetchEngagementData = async () => {
      setLoading(true);
      try {
        const engagementData = await analyticsService.getEngagementData(dateRange, userType);
        setData(engagementData);
      } catch (error) {
        console.error("Error fetching engagement data:", error);
        // Keep existing data if error occurs
      } finally {
        setLoading(false);
      }
    };

    fetchEngagementData();
  }, [dateRange, userType]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Engagement</CardTitle>
          <CardDescription>Daily user activity metrics</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Engagement</CardTitle>
        <CardDescription>Daily user activity metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
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
                dataKey="pageViews" 
                stroke="#8884d8" 
                name="Page Views"
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="activeUsers" 
                stroke="#82ca9d" 
                name="Active Users"
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="averageSessionTime" 
                stroke="#ffc658" 
                name="Avg Session (min)"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
