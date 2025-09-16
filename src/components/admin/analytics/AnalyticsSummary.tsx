
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon, Users, Clock, UserPlus, LineChart, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { analyticsService, type AnalyticsMetrics } from '@/services/analytics/AnalyticsService';

interface AnalyticsSummaryProps {
  dateRange: { from: Date; to: Date };
  userType: string;
}

export function AnalyticsSummary({ dateRange, userType }: AnalyticsSummaryProps) {
  const [metrics, setMetrics] = useState<AnalyticsMetrics>({
    visitors: 0,
    signups: 0,
    avgSessionTime: 0,
    conversionRate: 0,
    visitorsChange: 0,
    signupsChange: 0,
    avgSessionTimeChange: 0,
    conversionRateChange: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      try {
        const data = await analyticsService.getAnalyticsSummary(dateRange, userType);
        setMetrics(data);
      } catch (error) {
        console.error('Error fetching analytics summary:', error);
        // Keep existing metrics if error occurs
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [dateRange, userType]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Total Visitors"
        value={metrics.visitors.toLocaleString()}
        description="Unique website visitors"
        changePercent={metrics.visitorsChange}
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
        loading={loading}
      />

      <MetricCard
        title="New Sign-ups"
        value={metrics.signups.toLocaleString()}
        description={userType === 'trial' ? "New trial accounts" : "New user registrations"}
        changePercent={metrics.signupsChange}
        icon={<UserPlus className="h-4 w-4 text-muted-foreground" />}
        loading={loading}
      />

      <MetricCard
        title="Avg. Session Time"
        value={`${metrics.avgSessionTime} min`}
        description="Time spent on site"
        changePercent={metrics.avgSessionTimeChange}
        icon={<Clock className="h-4 w-4 text-muted-foreground" />}
        loading={loading}
      />

      <MetricCard
        title="Conversion Rate"
        value={`${metrics.conversionRate}%`}
        description={userType === 'trial' ? "Trial to paid" : "Visitor to registration"}
        changePercent={metrics.conversionRateChange}
        icon={<LineChart className="h-4 w-4 text-muted-foreground" />}
        loading={loading}
      />
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  description: string;
  changePercent: number;
  icon: React.ReactNode;
  loading?: boolean;
}

function MetricCard({ title, value, description, changePercent, icon, loading = false }: MetricCardProps) {
  const isPositive = changePercent > 0;
  const isNeutral = changePercent === 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        {loading ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /> : icon}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <div className="h-8 w-16 bg-muted animate-pulse rounded" />
            <div className="h-3 w-24 bg-muted animate-pulse rounded" />
            <div className="h-3 w-20 bg-muted animate-pulse rounded" />
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{description}</p>
            <div className={`flex items-center text-xs mt-1 ${
              isPositive ? "text-green-600 dark:text-green-400" :
              isNeutral ? "text-gray-500" :
              "text-red-600 dark:text-red-400"
            }`}>
              {!isNeutral && (
                isPositive ? (
                  <ArrowUpIcon className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDownIcon className="h-3 w-3 mr-1" />
                )
              )}
              <span>
                {isNeutral ? "No change" : `${Math.abs(changePercent)}% ${isPositive ? "increase" : "decrease"}`}
              </span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
