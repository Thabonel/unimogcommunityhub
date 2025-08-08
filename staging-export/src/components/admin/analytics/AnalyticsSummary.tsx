
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon, Users, Clock, UserPlus, LineChart } from "lucide-react";
import { useState, useEffect } from "react";

interface AnalyticsSummaryProps {
  dateRange: { from: Date; to: Date };
  userType: string;
}

export function AnalyticsSummary({ dateRange, userType }: AnalyticsSummaryProps) {
  const [metrics, setMetrics] = useState({
    visitors: 0,
    signups: 0,
    avgSessionTime: 0,
    conversionRate: 0,
    visitorsChange: 0,
    signupsChange: 0,
    avgSessionTimeChange: 0,
    conversionRateChange: 0
  });

  useEffect(() => {
    // This would be real data in production
    // Mock data that varies by filter
    const daysDiff = Math.floor((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24));
    const multiplier = userType === 'all' ? 1 : 
                      userType === 'premium' ? 0.3 :
                      userType === 'basic' ? 0.5 :
                      userType === 'trial' ? 0.15 : 0.25;
    
    const baseVisitors = Math.floor(12500 * multiplier * (daysDiff / 30));
    const baseSignups = Math.floor(820 * multiplier * (daysDiff / 30));
    
    setMetrics({
      visitors: baseVisitors,
      signups: baseSignups,
      avgSessionTime: userType === 'premium' ? 8.2 : 
                     userType === 'basic' ? 6.5 : 
                     userType === 'trial' ? 9.1 : 4.3,
      conversionRate: userType === 'premium' ? 35.2 : 
                     userType === 'basic' ? 28.4 : 
                     userType === 'trial' ? 22.8 : 
                     userType === 'free' ? 0 : 24.6,
      visitorsChange: Math.floor(Math.random() * 30) - 10,
      signupsChange: Math.floor(Math.random() * 40) - 15,
      avgSessionTimeChange: Math.floor(Math.random() * 30) - 5,
      conversionRateChange: Math.floor(Math.random() * 20) - 5
    });
  }, [dateRange, userType]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard 
        title="Total Visitors"
        value={metrics.visitors.toLocaleString()}
        description="Unique website visitors"
        changePercent={metrics.visitorsChange}
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
      />
      
      <MetricCard 
        title="New Sign-ups"
        value={metrics.signups.toLocaleString()}
        description={userType === 'trial' ? "New trial accounts" : "New user registrations"}
        changePercent={metrics.signupsChange}
        icon={<UserPlus className="h-4 w-4 text-muted-foreground" />}
      />
      
      <MetricCard 
        title="Avg. Session Time"
        value={`${metrics.avgSessionTime} min`}
        description="Time spent on site"
        changePercent={metrics.avgSessionTimeChange}
        icon={<Clock className="h-4 w-4 text-muted-foreground" />}
      />
      
      <MetricCard 
        title="Conversion Rate"
        value={`${metrics.conversionRate}%`}
        description={userType === 'trial' ? "Trial to paid" : "Visitor to registration"}
        changePercent={metrics.conversionRateChange}
        icon={<LineChart className="h-4 w-4 text-muted-foreground" />}
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
}

function MetricCard({ title, value, description, changePercent, icon }: MetricCardProps) {
  const isPositive = changePercent > 0;
  const isNeutral = changePercent === 0;
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}
