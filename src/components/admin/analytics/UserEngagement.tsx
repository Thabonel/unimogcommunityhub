
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from '@/lib/supabase-client';

interface UserEngagementProps {
  dateRange: { from: Date; to: Date };
  userType: string;
}

export function UserEngagement({ dateRange, userType }: UserEngagementProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchEngagementData = async () => {
      setLoading(true);
      try {
        // This would be replaced with real data fetching from Supabase
        // For now we'll use mock data that changes slightly based on the filters
        
        const startDate = dateRange.from;
        const endDate = dateRange.to;
        const daysDiff = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
        
        // Generate daily data points
        const mockData = [];
        for (let i = 0; i <= daysDiff; i++) {
          const currentDate = new Date(startDate);
          currentDate.setDate(startDate.getDate() + i);
          
          // Generate slightly different data based on user type
          const multiplier = userType === 'premium' ? 1.5 : 
                            userType === 'basic' ? 1.2 :
                            userType === 'trial' ? 0.8 : 1;
          
          mockData.push({
            date: format(currentDate, 'MMM dd'),
            pageViews: Math.floor(Math.random() * 1000 * multiplier + 500),
            activeUsers: Math.floor(Math.random() * 200 * multiplier + 100),
            averageSessionTime: Math.floor(Math.random() * 10 * multiplier + 5),
          });
        }
        
        setData(mockData);
      } catch (error) {
        console.error("Error fetching engagement data:", error);
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

// Helper function for formatting dates
function format(date: Date, formatStr: string): string {
  return new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: 'numeric' 
  }).format(date);
}
