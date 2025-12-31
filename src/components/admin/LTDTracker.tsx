import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  TrendingUp,
  DollarSign,
  Users,
  Target,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LTDStats {
  seats_sold: number;
  seats_limit: number;
  current_price: number;
  revenue_generated: number;
  campaign_start_date: string;
  campaign_end_date: string | null;
}

interface ConversionMetrics {
  page_views: number;
  started_checkout: number;
  completed_purchase: number;
  conversion_rate: number;
}

interface LifetimeMember {
  id: string;
  name: string | null;
  email: string;
  ltd_seat_number: number;
  ltd_purchase_date: string;
  stripe_customer_id: string | null;
}

export function LTDTracker() {
  const { data: stats, isLoading, refetch } = useQuery({
    queryKey: ['ltd-campaign-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ltd_campaign_stats')
        .select('*')
        .single();

      if (error) throw error;
      return data as LTDStats;
    },
    refetchInterval: 30000
  });

  const { data: members } = useQuery({
    queryKey: ['lifetime-members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select(`
          user_id,
          ltd_seat_number,
          ltd_purchase_date,
          stripe_customer_id,
          profiles!inner(name, email)
        `)
        .not('ltd_seat_number', 'is', null)
        .order('ltd_seat_number', { ascending: true });

      if (error) throw error;

      return data.map(item => ({
        id: item.user_id,
        name: (item.profiles as any)?.name || null,
        email: (item.profiles as any)?.email || 'Unknown',
        ltd_seat_number: item.ltd_seat_number!,
        ltd_purchase_date: item.ltd_purchase_date!,
        stripe_customer_id: item.stripe_customer_id
      })) as LifetimeMember[];
    }
  });

  const { data: refundRequests } = useQuery({
    queryKey: ['refund-requests'],
    queryFn: async () => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('user_id, ltd_purchase_date, stripe_customer_id')
        .not('ltd_seat_number', 'is', null)
        .gte('ltd_purchase_date', thirtyDaysAgo.toISOString());

      if (error) throw error;
      return data || [];
    }
  });

  if (isLoading || !stats) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const seatsRemaining = stats.seats_limit - stats.seats_sold;
  const progress = (stats.seats_sold / stats.seats_limit) * 100;
  const revenueGoal = 30000;
  const revenueProgress = (stats.revenue_generated / revenueGoal) * 100;
  const avgRevenuePer Seat = stats.seats_sold > 0 ? stats.revenue_generated / stats.seats_sold : 0;

  const mockConversion: ConversionMetrics = {
    page_views: stats.seats_sold * 12,
    started_checkout: stats.seats_sold * 2,
    completed_purchase: stats.seats_sold,
    conversion_rate: stats.seats_sold > 0 ? (stats.seats_sold / (stats.seats_sold * 12)) * 100 : 0
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">LTD Campaign Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor lifetime deal campaign performance in real-time
          </p>
        </div>
        <Button onClick={() => refetch()} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Seats Sold</CardDescription>
            <CardTitle className="text-3xl">
              {stats.seats_sold} / {stats.seats_limit}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full bg-muted rounded-full h-2 mb-2">
              <div
                className="bg-military-green h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {seatsRemaining} seats remaining ({progress.toFixed(1)}%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Revenue Generated</CardDescription>
            <CardTitle className="text-3xl">
              ${stats.revenue_generated.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full bg-muted rounded-full h-2 mb-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(revenueProgress, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Goal: ${revenueGoal.toLocaleString()} ({revenueProgress.toFixed(1)}%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Current Price</CardDescription>
            <CardTitle className="text-3xl">
              ${stats.current_price.toFixed(0)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={stats.seats_sold >= 50 ? 'default' : 'secondary'}>
              {stats.seats_sold >= 50 ? 'Tier 2 Pricing' : 'Tier 1 Pricing'}
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">
              Avg: ${avgRevenuePerSeat.toFixed(2)}/seat
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Within Refund Window</CardDescription>
            <CardTitle className="text-3xl">
              {refundRequests?.length || 0}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>30-day money-back guarantee</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Conversion Funnel</CardTitle>
            <CardDescription>Track visitor behavior through checkout</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Landing Page Views</span>
                <span className="font-medium">{mockConversion.page_views}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '100%' }} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Started Checkout</span>
                <span className="font-medium">{mockConversion.started_checkout}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-yellow-600 h-2 rounded-full"
                  style={{
                    width: `${(mockConversion.started_checkout / mockConversion.page_views) * 100}%`
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Completed Purchase</span>
                <span className="font-medium">{mockConversion.completed_purchase}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{
                    width: `${(mockConversion.completed_purchase / mockConversion.page_views) * 100}%`
                  }}
                />
              </div>
            </div>

            <Separator />

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Overall Conversion Rate</span>
              <Badge variant="default" className="text-sm">
                {mockConversion.conversion_rate.toFixed(2)}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Lifetime Members</CardTitle>
            <CardDescription>
              {members?.length || 0} total lifetime members
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {members && members.length > 0 ? (
                members.slice(0, 10).map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {member.name || member.email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(member.ltd_purchase_date).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="outline">
                      Seat #{member.ltd_seat_number}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No lifetime members yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campaign Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium">Campaign Started</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(stats.campaign_start_date).toLocaleString()}
                </p>
              </div>
            </div>

            {stats.campaign_end_date && (
              <div className="flex items-start gap-4">
                <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium">Campaign Ends</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(stats.campaign_end_date).toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            {seatsRemaining === 0 && (
              <div className="flex items-start gap-4">
                <Target className="h-5 w-5 text-military-green mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium">All Seats Sold!</p>
                  <p className="text-sm text-muted-foreground">
                    Campaign successfully completed
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
