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
  vendor_slug: string;
  total_clicks: number;
  unique_users: number;
  clicks_last_7_days: number;
  clicks_last_30_days: number;
}

interface ClickRecord {
  id: string;
  vendor_id: string;
  vendor_name: string;
  user_email: string | null;
  user_name: string | null;
  referrer_page: string | null;
  clicked_at: string;
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

      // Get vendor stats from the view
      const { data: statsData, error: statsError } = await supabase
        .from('vendor_click_analytics')
        .select('*')
        .order('total_clicks', { ascending: false });

      if (statsError) {
        console.error('Stats error:', statsError);
        toast.error('Failed to load vendor statistics');
      } else {
        setStats(statsData || []);
      }

      // Get recent clicks with user details
      let clicksQuery = supabase
        .from('vendor_clicks')
        .select(`
          id,
          vendor_id,
          user_email,
          user_name,
          referrer_page,
          clicked_at,
          vendors!inner(business_name)
        `)
        .order('clicked_at', { ascending: false })
        .limit(100);

      // Apply time filter
      if (timeRange !== 'all') {
        const days = timeRange === '7d' ? 7 : 30;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        clicksQuery = clicksQuery.gte('clicked_at', startDate.toISOString());
      }

      const { data: clicksData, error: clicksError } = await clicksQuery;

      if (clicksError) {
        console.error('Clicks error:', clicksError);
        toast.error('Failed to load click history');
      } else {
        setRecentClicks(
          clicksData?.map((record: any) => ({
            id: record.id,
            vendor_id: record.vendor_id,
            vendor_name: record.vendors.business_name,
            user_email: record.user_email,
            user_name: record.user_name,
            referrer_page: record.referrer_page,
            clicked_at: record.clicked_at,
          })) || []
        );
      }
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
        return `${click.vendor_name},"${click.user_name || click.user_email || 'Anonymous'}",${click.user_email || ''},${click.referrer_page || ''},${format(new Date(click.clicked_at), 'yyyy-MM-dd HH:mm:ss')}`;
      })
      .join('\n');

    const csvContent = `Vendor,User Name,Email,Referrer,Click Time\n${csvData}`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vendor-referrals-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Vendor referrals exported to CSV');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-muted-foreground">Loading analytics...</p>
      </div>
    );
  }

  const totalClicks = stats.reduce((sum, s) => sum + s.total_clicks, 0);
  const totalUniqueUsers = stats.reduce((sum, s) => sum + s.unique_users, 0);
  const clicks7Days = stats.reduce((sum, s) => sum + s.clicks_last_7_days, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Vendor Referral Tracking</h2>
          <p className="text-muted-foreground">Track which users clicked through to vendor profiles</p>
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicks}</div>
            <p className="text-xs text-muted-foreground">All-time vendor clicks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUniqueUsers}</div>
            <p className="text-xs text-muted-foreground">Users who clicked vendors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last 7 Days</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clicks7Days}</div>
            <p className="text-xs text-muted-foreground">Recent activity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured Vendors</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.filter(s => s.is_featured).length}</div>
            <p className="text-xs text-muted-foreground">With click data</p>
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
                    <TableHead className="text-right">Total Clicks</TableHead>
                    <TableHead className="text-right">Unique Users</TableHead>
                    <TableHead className="text-right">Last 7 Days</TableHead>
                    <TableHead className="text-right">Last 30 Days</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats
                    .sort((a, b) => b.total_clicks - a.total_clicks)
                    .map((stat) => {
                      return (
                        <TableRow key={stat.vendor_id}>
                          <TableCell className="font-medium">
                            {stat.vendor_name}
                            {stat.is_featured && (
                              <Badge variant="secondary" className="ml-2 text-xs">Featured</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">{stat.total_clicks}</TableCell>
                          <TableCell className="text-right">{stat.unique_users}</TableCell>
                          <TableCell className="text-right">
                            <Badge variant="outline">{stat.clicks_last_7_days}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge variant="outline">{stat.clicks_last_30_days}</Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {stats.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No vendor clicks recorded yet
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
                <CardTitle>Recent Vendor Clicks</CardTitle>
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
                    <TableHead>Email</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentClicks.map((click) => (
                    <TableRow key={click.id}>
                      <TableCell className="font-medium">{click.vendor_name}</TableCell>
                      <TableCell>
                        {click.user_name || click.user_email || <span className="text-muted-foreground">Anonymous</span>}
                      </TableCell>
                      <TableCell>
                        {click.user_email || <span className="text-muted-foreground">-</span>}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {click.referrer_page || 'Unknown'}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(new Date(click.clicked_at), 'MMM d, HH:mm')}</TableCell>
                    </TableRow>
                  ))}
                  {recentClicks.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No vendor clicks recorded yet
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
