
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AnalyticsHeader } from "./analytics/AnalyticsHeader";
import { AnalyticsSummary } from "./analytics/AnalyticsSummary";
import { UserEngagement } from "./analytics/UserEngagement";
import { SubscriptionMetrics } from "./analytics/SubscriptionMetrics";
import { PopularContent } from "./analytics/PopularContent";
import { TrialConversionMetrics } from "./analytics/TrialConversionMetrics";
import { addDays, subDays, startOfDay } from "date-fns";

const AnalyticsDashboard = () => {
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState({
    from: subDays(startOfDay(new Date()), 30),
    to: addDays(startOfDay(new Date()), 1),
  });
  const [userType, setUserType] = useState("all"); // Add userType state

  const handleDateRangeChange = (range: { from: Date; to: Date }) => {
    setDateRange(range);
    console.log("Date range changed:", range);
    toast({
      title: "Date Range Updated",
      description: "Dashboard metrics have been updated",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <AnalyticsHeader
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
        userType={userType}
        onUserTypeChange={setUserType}
      />

      <AnalyticsSummary dateRange={dateRange} userType={userType} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UserEngagement dateRange={dateRange} userType={userType} />
        <SubscriptionMetrics dateRange={dateRange} userType={userType} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrialConversionMetrics dateRange={dateRange} />
        <PopularContent dateRange={dateRange} />
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
