
import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { toast } from '@/hooks/use-toast';
import { Download, RefreshCw, ArrowUpRight, ArrowDownRight, Minus, User, Users, MessagesSquare } from 'lucide-react';
import { 
  getCommunityHealthMetrics, 
  generateCommunityHealthReport,
  CommunityHealthMetrics
} from '@/services/analytics/communityHealthService';

// Sample historical data for charts
const generateHistoricalData = (metric: string, timeframes: number, baseValue: number) => {
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
const activeUsersHistory = generateHistoricalData('activeUsers', 12, 500);
const engagementHistory = generateHistoricalData('engagementRate', 12, 0.4);
const retentionHistory = generateHistoricalData('retentionRate', 12, 0.6);
const newContentHistory = generateHistoricalData('newContent', 12, 75);

export function CommunityHealthReport() {
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month' | 'quarter'>('week');
  const [metrics, setMetrics] = useState<CommunityHealthMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [reportText, setReportText] = useState<string | null>(null);
  const [showFullReport, setShowFullReport] = useState(false);
  
  // Fetch metrics data
  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      const data = await getCommunityHealthMetrics(timeframe);
      setMetrics(data);
      setLoading(false);
    };
    
    fetchMetrics();
  }, [timeframe]);
  
  // Generate report
  const handleGenerateReport = async () => {
    setLoading(true);
    const report = await generateCommunityHealthReport(timeframe);
    setReportText(report);
    setShowFullReport(true);
    setLoading(false);
  };
  
  // Helper to get trend indicator
  const getTrendIndicator = (current: number, previous: number) => {
    const percentChange = previous > 0 ? ((current - previous) / previous) * 100 : 0;
    
    if (Math.abs(percentChange) < 2) { // Less than 2% change
      return {
        icon: <Minus className="h-4 w-4 text-gray-500" />,
        color: 'text-gray-500',
        text: 'No change'
      };
    } else if (percentChange > 0) {
      return {
        icon: <ArrowUpRight className="h-4 w-4 text-green-500" />,
        color: 'text-green-500',
        text: `+${percentChange.toFixed(1)}%`
      };
    } else {
      return {
        icon: <ArrowDownRight className="h-4 w-4 text-red-500" />,
        color: 'text-red-500',
        text: `${percentChange.toFixed(1)}%`
      };
    }
  };
  
  // Helper to download report as text file
  const downloadReport = () => {
    if (!reportText) return;
    
    const element = document.createElement('a');
    const file = new Blob([reportText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `community_health_report_${timeframe}_${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: 'Report Downloaded',
      description: 'The community health report has been downloaded.'
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Community Health</CardTitle>
              <CardDescription>
                Monitor and analyze community engagement metrics
              </CardDescription>
            </div>
            
            <div className="flex items-center space-x-2">
              <Select 
                value={timeframe} 
                onValueChange={(value: any) => setTimeframe(value)}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Daily</SelectItem>
                  <SelectItem value="week">Weekly</SelectItem>
                  <SelectItem value="month">Monthly</SelectItem>
                  <SelectItem value="quarter">Quarterly</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => {
                  // Reload data
                  setMetrics(null);
                  getCommunityHealthMetrics(timeframe).then(setMetrics);
                }}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {loading ? (
            <div className="py-8 flex items-center justify-center">
              <RefreshCw className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading metrics...</span>
            </div>
          ) : !metrics ? (
            <div className="py-8 text-center">
              <p>Failed to load community metrics</p>
              <Button 
                variant="outline" 
                className="mt-4" 
                onClick={() => getCommunityHealthMetrics(timeframe).then(setMetrics)}
              >
                Try Again
              </Button>
            </div>
          ) : (
            <>
              {/* Key metrics summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                        <h3 className="text-2xl font-bold">{metrics.activeUsers}</h3>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-800/30 dark:text-blue-300">
                        <User className="h-4 w-4 mr-1" />
                        {getTrendIndicator(metrics.activeUsers, metrics.activeUsers * 0.9).text}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Retention</p>
                        <h3 className="text-2xl font-bold">{(metrics.retentionRate * 100).toFixed(1)}%</h3>
                      </div>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-800/30 dark:text-green-300">
                        <Users className="h-4 w-4 mr-1" />
                        {getTrendIndicator(metrics.retentionRate, metrics.retentionRate * 0.95).text}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">New Content</p>
                        <h3 className="text-2xl font-bold">{metrics.contentCreation}</h3>
                      </div>
                      <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 dark:bg-purple-800/30 dark:text-purple-300">
                        <MessagesSquare className="h-4 w-4 mr-1" />
                        {getTrendIndicator(metrics.contentCreation, metrics.contentCreation * 0.85).text}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Issues</p>
                        <h3 className="text-2xl font-bold">{metrics.issuesReported}</h3>
                      </div>
                      <Badge className={metrics.issuesReported > 5 
                        ? "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-800/30 dark:text-red-300"
                        : "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-800/30 dark:text-green-300"
                      }>
                        {metrics.issuesReported > 5 
                          ? getTrendIndicator(metrics.issuesReported, metrics.issuesReported * 0.7).text
                          : "Low"
                        }
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Charts section */}
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
              
              {/* Contributors section */}
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Top Contributors</h3>
                {metrics.topContributors.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {metrics.topContributors.map((contributor, index) => (
                      <Card key={contributor.userId} className="overflow-hidden">
                        <div className={`h-1.5 ${
                          index === 0 ? 'bg-yellow-400' : 
                          index === 1 ? 'bg-gray-400' : 
                          index === 2 ? 'bg-amber-600' : 'bg-blue-400'
                        }`} />
                        <CardContent className="pt-4">
                          <p className="font-medium">{contributor.displayName}</p>
                          <p className="text-sm text-muted-foreground">
                            {contributor.contributions} contributions
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No contributor data available</p>
                )}
              </div>
              
              {/* Generate report button */}
              <div className="mt-8 flex justify-end">
                <Button onClick={handleGenerateReport}>
                  Generate Full Report
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      {/* Full Report Dialog */}
      {showFullReport && reportText && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Community Health Report</CardTitle>
              <Button variant="outline" size="sm" onClick={downloadReport}>
                <Download className="mr-2 h-4 w-4" />
                Download Report
              </Button>
            </div>
            <CardDescription>
              Generated on {new Date().toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-md whitespace-pre-wrap font-mono text-sm">
              {reportText}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
