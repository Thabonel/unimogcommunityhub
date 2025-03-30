
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ABTestingControls } from './ABTestingControls';
import { CommunityHealthReport } from './CommunityHealthReport';
import { FeedbackRoadmap } from './FeedbackRoadmap';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BarChart3, TestTube2, ListTodo } from 'lucide-react';
import { useAnalytics } from '@/hooks/use-analytics';

export function CommunityImprovementDashboard() {
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Community Improvement</h1>
        <p className="text-muted-foreground">
          Tools for measuring, testing and improving the community experience
        </p>
      </div>
      
      <Alert>
        <BarChart3 className="h-4 w-4" />
        <AlertTitle>Data-driven community management</AlertTitle>
        <AlertDescription>
          Use these tools to gather insights, test new features, and prioritize community improvements.
        </AlertDescription>
      </Alert>
      
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              <CardTitle>Health Reports</CardTitle>
            </div>
            <CardDescription>
              Monitor community vitality and engagement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 w-6 h-6 rounded-full flex items-center justify-center mr-2">1</span>
                Monitor user retention and activity
              </li>
              <li className="flex items-center">
                <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 w-6 h-6 rounded-full flex items-center justify-center mr-2">2</span>
                Track engagement across features
              </li>
              <li className="flex items-center">
                <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 w-6 h-6 rounded-full flex items-center justify-center mr-2">3</span>
                Identify top contributors and content
              </li>
              <li className="flex items-center">
                <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 w-6 h-6 rounded-full flex items-center justify-center mr-2">4</span>
                Generate recommendations for improvement
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <ListTodo className="h-5 w-5 text-green-500" />
              <CardTitle>Development Roadmap</CardTitle>
            </div>
            <CardDescription>
              Plan and prioritize community features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 w-6 h-6 rounded-full flex items-center justify-center mr-2">1</span>
                Create roadmap items from user feedback
              </li>
              <li className="flex items-center">
                <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 w-6 h-6 rounded-full flex items-center justify-center mr-2">2</span>
                Manage feature priorities and status
              </li>
              <li className="flex items-center">
                <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 w-6 h-6 rounded-full flex items-center justify-center mr-2">3</span>
                Automatically suggest items from popular requests
              </li>
              <li className="flex items-center">
                <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 w-6 h-6 rounded-full flex items-center justify-center mr-2">4</span>
                Visualize progress with Kanban board
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <TestTube2 className="h-5 w-5 text-purple-500" />
              <CardTitle>A/B Testing</CardTitle>
            </div>
            <CardDescription>
              Validate new features with real users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <span className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 w-6 h-6 rounded-full flex items-center justify-center mr-2">1</span>
                Create experiments with multiple variants
              </li>
              <li className="flex items-center">
                <span className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 w-6 h-6 rounded-full flex items-center justify-center mr-2">2</span>
                Define conversion goals and metrics
              </li>
              <li className="flex items-center">
                <span className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 w-6 h-6 rounded-full flex items-center justify-center mr-2">3</span>
                Track variant performance in real-time
              </li>
              <li className="flex items-center">
                <span className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 w-6 h-6 rounded-full flex items-center justify-center mr-2">4</span>
                Make data-driven design decisions
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
