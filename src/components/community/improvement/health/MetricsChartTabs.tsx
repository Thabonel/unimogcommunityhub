
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Define interfaces for the data
interface ChartDataPoint {
  timeframe: string;
  [key: string]: number | string;
}

interface MetricsChartTabsProps {
  activeUsersHistory: ChartDataPoint[];
  engagementHistory: ChartDataPoint[];
  retentionHistory: ChartDataPoint[];
  newContentHistory: ChartDataPoint[];
}

export function MetricsChartTabs({
  activeUsersHistory,
  engagementHistory,
  retentionHistory,
  newContentHistory
}: MetricsChartTabsProps) {
  return (
    <Tabs defaultValue="activity">
      <TabsList className="mb-4">
        <TabsTrigger value="activity">User Activity</TabsTrigger>
        <TabsTrigger value="engagement">Engagement</TabsTrigger>
        <TabsTrigger value="retention">Retention</TabsTrigger>
        <TabsTrigger value="content">Content</TabsTrigger>
      </TabsList>
      
      <TabsContent value="activity" className="h-80 mt-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={activeUsersHistory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timeframe" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="activeUsers" 
              name="Active Users" 
              stroke="#3b82f6" 
              activeDot={{ r: 8 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </TabsContent>
      
      <TabsContent value="engagement" className="h-80 mt-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={engagementHistory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timeframe" />
            <YAxis domain={[0, 1]} tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
            <Tooltip formatter={(value) => `${(Number(value) * 100).toFixed(2)}%`} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="engagementRate" 
              name="Engagement Rate" 
              stroke="#10b981" 
              activeDot={{ r: 8 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </TabsContent>
      
      <TabsContent value="retention" className="h-80 mt-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={retentionHistory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timeframe" />
            <YAxis domain={[0, 1]} tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
            <Tooltip formatter={(value) => `${(Number(value) * 100).toFixed(2)}%`} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="retentionRate" 
              name="Retention Rate" 
              stroke="#8b5cf6" 
              activeDot={{ r: 8 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </TabsContent>
      
      <TabsContent value="content" className="h-80 mt-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={newContentHistory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timeframe" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar 
              dataKey="newContent"
              name="New Content Items"
              fill="#ec4899" 
            />
          </BarChart>
        </ResponsiveContainer>
      </TabsContent>
    </Tabs>
  );
}
