
import { DashboardOverview } from './dashboard/DashboardOverview';
import { DashboardTabs } from './dashboard/DashboardTabs';
import { FeatureCards } from './dashboard/FeatureCards';
import { PrivacySettings } from './privacy/PrivacySettings';
import { PrivacyBanner } from './privacy/PrivacyBanner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import ActivityTracker from '../ActivityTracker';

export function CommunityImprovementDashboard() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  return (
    <ActivityTracker componentName="community_improvement_dashboard">
      <>
        <PrivacyBanner />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="privacy">Privacy Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-6">
            <DashboardOverview />
            <DashboardTabs />
            <FeatureCards />
          </TabsContent>
          
          <TabsContent value="privacy">
            <PrivacySettings />
          </TabsContent>
        </Tabs>
      </>
    </ActivityTracker>
  );
}
