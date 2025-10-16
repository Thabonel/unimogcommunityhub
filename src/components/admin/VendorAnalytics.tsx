import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Globe, Eye, TrendingUp, Download } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface VendorStats {
  vendor_id: string;
  vendor_name: string;
  website_clicks: number;
  profile_views: number;
  total_interactions: number;
}

interface ClickRecord {
  id: string;
  vendor_name: string;
  user_email: string | null;
  action_type: string;
  created_at: string;
}

export function VendorAnalytics() {
  const [stats, setStats] = useState<VendorStats[]>([]);
  const [recentClicks, setRecentClicks] = useState<ClickRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('30d');

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);

      // Calculate date range
      let dateFilter = '';
      if (timeRange !== 'all') {
        const days = timeRange === '7d' ? 7 : 30;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        dateFilter = `and created_at >= '${startDate.toISOString()}'`;
      }

      // Get vendor stats
      const { data: statsData, error: statsError } = await supabase
        .rpc('get_vendor_analytics_stats', { days: timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 365 });

      if (statsError) {
        console.error('Stats error:', statsError);
        // Fallback to manual query
        const { data: analyticsData } = await supabase
          .from('vendor_analytics')
          .select(`
            vendor_id,
            action_type,
            vendors!inner(business_name)
          `)
          .order('created_at', { ascending: false });

        // Aggregate manually
        const statsMap = new Map<string, VendorStats>();
        analyticsData?.forEach((record: any) => {
          const vendorId = record.vendor_id;
          if (!statsMap.has(vendorId)) {
            statsMap.set(vendorId, {
              vendor_id: vendorId,
              vendor_name: record.vendors.business_name,
              website_clicks: 0,
              profile_views: 0,
              total_interactions: 0,
            });
          }
          const stats = statsMap.get(vendorId)!;
          if (record.action_type === 'website_click') stats.website_clicks++;
          if (record.action_type === 'profile_view') stats.profile_views++;
          stats.total_interactions++;
        });
        setStats(Array.from(statsMap.values()));
      } else {
        setStats(statsData || []);
      }

      // Get recent clicks
      const { data: clicksData, error: clicksError } = await supabase
        .from('vendor_analytics')
        .select(`
          id,
          user_email,
          action_type,
          created_at,
          vendors!inner(business_name)
        `)
        .eq('action_type', 'website_click')
        .order('created_at', { ascending: false })
        .limit(50);

      if (clicksError) throw clicksError;

      setRecentClicks(
        clicksData?.map((record: any) => ({
          id: record.id,
          vendor_name: record.vendors.business_name,
          user_email: record.user_email,
          action_type: record.action_type,
          created_at: record.created_at,
        })) || []
      );
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast.error('Failed to load vendor analytics');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const csvData = recentClicks
      .map((click) => {
        return `${click.vendor_name},${click.user_email || 'Anonymous'},${format(new Date(click.created_at), 'yyyy-MM-dd HH:mm:ss')}`;
      })
      .join('\n');

    const csvContent = `Vendor,User,Click Time\n${csvData}`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vendor-analytics-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Analytics exported to CSV');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-muted-foreground">Loading analytics...</p>
      </div>
    );
  }

  const totalClicks = stats.reduce((sum, s) => sum + s.website_clicks, 0);
  const totalViews = stats.reduce((sum, s) => sum + s.profile_views, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Vendor Analytics</h2>
          <p className="text-muted-foreground">Track vendor profile views and website clicks</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={timeRange === '7d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('7d')}
          >
            7 Days
          </Button>
          <Button
            variant={timeRange === '30d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('30d')}
          >
            30 Days
          </Button>
          <Button
            variant={timeRange === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('all')}
          >
            All Time
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Website Clicks</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicks}</div>
            <p className="text-xs text-muted-foreground">Clicks to vendor websites</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profile Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews}</div>
            <p className="text-xs text-muted-foreground">Vendor profile page views</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.length}</div>
            <p className="text-xs text-muted-foreground">Vendors with activity</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="clicks">
            <Globe className="h-4 w-4 mr-2" />
            Recent Clicks
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Vendor Performance</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor</TableHead>
                    <TableHead className="text-right">Profile Views</TableHead>
                    <TableHead className="text-right">Website Clicks</TableHead>
                    <TableHead className="text-right">Click Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats
                    .sort((a, b) => b.website_clicks - a.website_clicks)
                    .map((stat) => {
                      const clickRate = stat.profile_views > 0
                        ? ((stat.website_clicks / stat.profile_views) * 100).toFixed(1)
                        : '0.0';
                      return (
                        <TableRow key={stat.vendor_id}>
                          <TableCell className="font-medium">{stat.vendor_name}</TableCell>
                          <TableCell className="text-right">{stat.profile_views}</TableCell>
                          <TableCell className="text-right">{stat.website_clicks}</TableCell>
                          <TableCell className="text-right">
                            <Badge variant="outline">{clickRate}%</Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {stats.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        No analytics data available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clicks" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Website Clicks</CardTitle>
                <Button onClick={exportToCSV} size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentClicks.map((click) => (
                    <TableRow key={click.id}>
                      <TableCell className="font-medium">{click.vendor_name}</TableCell>
                      <TableCell>
                        {click.user_email || <span className="text-muted-foreground">Anonymous</span>}
                      </TableCell>
                      <TableCell>{format(new Date(click.created_at), 'MMM d, yyyy HH:mm')}</TableCell>
                    </TableRow>
                  ))}
                  {recentClicks.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground">
                        No website clicks recorded yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
