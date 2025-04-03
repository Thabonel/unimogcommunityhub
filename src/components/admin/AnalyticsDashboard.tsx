
import { useState } from "react";
import { AnalyticsHeader } from "./analytics/AnalyticsHeader";
import { AnalyticsSummary } from "./analytics/AnalyticsSummary";
import { UserEngagement } from "./analytics/UserEngagement";
import { SubscriptionMetrics } from "./analytics/SubscriptionMetrics";
import { PopularContent } from "./analytics/PopularContent";

export function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    to: new Date(),
  });
  const [userType, setUserType] = useState<string>("all");

  return (
    <div className="space-y-6">
      <AnalyticsHeader 
        onDateRangeChange={setDateRange}
        onUserTypeChange={setUserType}
      />
      
      <AnalyticsSummary 
        dateRange={dateRange}
        userType={userType}
      />
      
      <div className="grid gap-6 md:grid-cols-2">
        <UserEngagement 
          dateRange={dateRange}
          userType={userType}
        />
        <SubscriptionMetrics 
          dateRange={dateRange}
          userType={userType}
        />
      </div>
      
      <PopularContent dateRange={dateRange} />
    </div>
  );
}

// Also export as default for compatibility with React.lazy()
export default AnalyticsDashboard;
