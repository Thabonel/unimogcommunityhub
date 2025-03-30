
import { DashboardOverview } from './dashboard/DashboardOverview';
import { DashboardTabs } from './dashboard/DashboardTabs';
import { FeatureCards } from './dashboard/FeatureCards';

export function CommunityImprovementDashboard() {
  return (
    <div className="space-y-6">
      <DashboardOverview />
      <DashboardTabs />
      <FeatureCards />
    </div>
  );
}
