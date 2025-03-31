
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon } from 'lucide-react';
import { CostBreakdownChart } from './CostBreakdownChart';
import { MaintenanceTrendsChart } from './MaintenanceTrendsChart';
import { FrequencyChart } from './FrequencyChart';

interface ReportChartTabsProps {
  costByTypeData: any;
  maintenanceOverTimeData: any;
  maintenanceFrequencyData: any;
}

export function ReportChartTabs({ 
  costByTypeData, 
  maintenanceOverTimeData, 
  maintenanceFrequencyData 
}: ReportChartTabsProps) {
  return (
    <Tabs defaultValue="costs" className="w-full">
      <TabsList className="grid grid-cols-3 mb-6">
        <TabsTrigger value="costs" className="flex items-center gap-2">
          <PieChartIcon className="h-4 w-4" />
          Cost Analysis
        </TabsTrigger>
        <TabsTrigger value="trends" className="flex items-center gap-2">
          <LineChartIcon className="h-4 w-4" />
          Trends
        </TabsTrigger>
        <TabsTrigger value="frequency" className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Frequency
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="costs">
        <CostBreakdownChart data={costByTypeData} />
      </TabsContent>
      
      <TabsContent value="trends">
        <MaintenanceTrendsChart data={maintenanceOverTimeData} />
      </TabsContent>
      
      <TabsContent value="frequency">
        <FrequencyChart data={maintenanceFrequencyData} />
      </TabsContent>
    </Tabs>
  );
}
