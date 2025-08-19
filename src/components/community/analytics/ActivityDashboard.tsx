import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase-client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAnalytics } from '@/hooks/use-analytics';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ActivityMetrics {
  page_views: number;
  posts_created: number;
  comments_made: number;
  likes_given: number;
  total_sessions: number;
  avg_session_duration: number;
  most_visited_page: string;
  most_used_feature: string;
}

interface ActivityChartData {
  name: string;
  value: number;
}

interface UserActivity {
  event_type: string;
  page?: string;
  event_data?: {
    session_id?: string;
    feature?: string;
    duration?: number;
    [key: string]: any;
  };
  timestamp: string;
}

const ActivityDashboard = () => {
  const [metrics, setMetrics] = useState<ActivityMetrics>({
    page_views: 0,
    posts_created: 0,
    comments_made: 0,
    likes_given: 0,
    total_sessions: 0,
    avg_session_duration: 0,
    most_visited_page: '',
    most_used_feature: ''
  });
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('week');
  const [isLoading, setIsLoading] = useState(true);
  const [activityChart, setActivityChart] = useState<ActivityChartData[]>([]);
  const { trackFeatureUse } = useAnalytics();
  
  useEffect(() => {
    const fetchActivityMetrics = async () => {
      setIsLoading(true);
      
      // Track dashboard view
      trackFeatureUse('activity_dashboard', { 
        timeframe,
        action: 'view'
      });
      
      try {
        // Calculate date range based on timeframe
        const now = new Date();
        let startDate;
        
        switch(timeframe) {
          case 'week':
            startDate = new Date(now);
            startDate.setDate(now.getDate() - 7);
            break;
          case 'month':
            startDate = new Date(now);
            startDate.setMonth(now.getMonth() - 1);
            break;
          case 'year':
            startDate = new Date(now);
            startDate.setFullYear(now.getFullYear() - 1);
            break;
        }
        
        // Fetch activity metrics from database
        const { data, error } = await supabase
          .from('user_activities')
          .select('event_type, page, event_data')
          .gte('timestamp', startDate.toISOString())
          .order('timestamp', { ascending: false });
          
        if (error) {
          console.error('Error fetching activity data:', error);
          return;
        }
        
        // Cast data to UserActivity[] type for proper type checking
        const activities = data as unknown as UserActivity[];
        
        // Process metrics
        const pageViews = activities.filter(item => item.event_type === 'page_view').length;
        const postsCreated = activities.filter(item => item.event_type === 'post_create').length;
        const commentsMade = activities.filter(item => item.event_type === 'post_comment').length;
        const likesGiven = activities.filter(item => item.event_type === 'post_like').length;
        
        // Get unique session count
        const uniqueSessions = new Set(activities
          .filter(item => item.event_data?.session_id)
          .map(item => item.event_data?.session_id)).size;
        
        // Calculate most visited page
        const pageVisits: Record<string, number> = {};
        activities
          .filter(item => item.event_type === 'page_view' && item.page)
          .forEach(item => {
            pageVisits[item.page || ''] = (pageVisits[item.page || ''] || 0) + 1;
          });
        
        const mostVisitedPage = Object.entries(pageVisits)
          .sort((a, b) => b[1] - a[1])
          .map(([page]) => page)[0] || 'None';
        
        // Calculate most used feature
        const featureUsage: Record<string, number> = {};
        activities
          .filter(item => item.event_type === 'feature_use' && item.event_data?.feature)
          .forEach(item => {
            const feature = item.event_data?.feature || 'unknown';
            featureUsage[feature] = (featureUsage[feature] || 0) + 1;
          });
        
        const mostUsedFeature = Object.entries(featureUsage)
          .sort((a, b) => b[1] - a[1])
          .map(([feature]) => feature)[0] || 'None';
        
        // Calculate average session duration
        const sessionDurations = activities
          .filter(item => item.event_type === 'session_end' && item.event_data?.duration)
          .map(item => Number(item.event_data?.duration) || 0);
        
        const avgSessionDuration = sessionDurations.length
          ? sessionDurations.reduce((sum, dur) => sum + dur, 0) / sessionDurations.length
          : 0;
        
        // Update metrics
        setMetrics({
          page_views: pageViews,
          posts_created: postsCreated,
          comments_made: commentsMade,
          likes_given: likesGiven,
          total_sessions: uniqueSessions,
          avg_session_duration: Math.round(avgSessionDuration),
          most_visited_page: mostVisitedPage,
          most_used_feature: mostUsedFeature
        });
        
        // Create chart data
        setActivityChart([
          { name: 'Page Views', value: pageViews },
          { name: 'Posts Created', value: postsCreated },
          { name: 'Comments', value: commentsMade },
          { name: 'Likes', value: likesGiven }
        ]);
      } catch (error) {
        console.error('Error in fetchActivityMetrics:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchActivityMetrics();
  }, [timeframe, trackFeatureUse]);
  
  const handleTimeframeChange = (value: string) => {
    setTimeframe(value as 'week' | 'month' | 'year');
    trackFeatureUse('activity_dashboard', { 
      action: 'change_timeframe', 
      from: timeframe, 
      to: value 
    });
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Your Activity</CardTitle>
          <Tabs defaultValue={timeframe} onValueChange={handleTimeframeChange}>
            <TabsList>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="w-full py-10 flex justify-center">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
              <div className="bg-muted p-3 rounded-lg">
                <div className="text-sm font-medium text-muted-foreground">Page Views</div>
                <div className="text-2xl font-bold">{metrics.page_views}</div>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <div className="text-sm font-medium text-muted-foreground">Posts Created</div>
                <div className="text-2xl font-bold">{metrics.posts_created}</div>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <div className="text-sm font-medium text-muted-foreground">Comments Made</div>
                <div className="text-2xl font-bold">{metrics.comments_made}</div>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <div className="text-sm font-medium text-muted-foreground">Likes Given</div>
                <div className="text-2xl font-bold">{metrics.likes_given}</div>
              </div>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              <div className="bg-muted p-3 rounded-lg">
                <div className="text-sm font-medium text-muted-foreground">Sessions</div>
                <div className="text-2xl font-bold">{metrics.total_sessions}</div>
                <div className="text-xs text-muted-foreground">
                  Avg. {metrics.avg_session_duration} seconds per session
                </div>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <div className="text-sm font-medium text-muted-foreground">Most Activity</div>
                <div className="text-lg font-bold truncate">{metrics.most_visited_page}</div>
                <div className="text-xs text-muted-foreground">
                  Feature: {metrics.most_used_feature}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityDashboard;
