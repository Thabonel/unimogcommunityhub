
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CommunityHealthReport } from '../CommunityHealthReport';
import { FeedbackRoadmap } from '../FeedbackRoadmap';
import { ABTestingControls } from '../ABTestingControls';
import { useAnalytics } from '@/hooks/use-analytics';

export function DashboardTabs() {
  const [activeTab, setActiveTab] = useState('health');
  const { trackFeatureUse } = useAnalytics();
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    trackFeatureUse('improvement_dashboard_tab_change', { 
      from: activeTab,
      to: value
    });
  };
  
  return (
    <Tabs defaultValue="health" value={activeTab} onValueChange={handleTabChange}>
      <TabsList className="grid grid-cols-3 w-full max-w-md">
        <TabsTrigger value="health">Health Metrics</TabsTrigger>
        <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
        <TabsTrigger value="testing">A/B Testing</TabsTrigger>
      </TabsList>
      
      <TabsContent value="health" className="pt-6">
        <CommunityHealthReport />
      </TabsContent>
      
      <TabsContent value="roadmap" className="pt-6">
        <FeedbackRoadmap />
      </TabsContent>
      
      <TabsContent value="testing" className="pt-6">
        <ABTestingControls />
      </TabsContent>
    </Tabs>
  );
}
