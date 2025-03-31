
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ReportsHeader } from './reports/ReportsHeader';
import { ReportChartTabs } from './reports/ReportChartTabs';
import { MaintenanceSummary } from './reports/MaintenanceSummary';
import { MaintenanceRecommendations } from './reports/MaintenanceRecommendations';
import { getCostByTypeData, getMaintenanceOverTimeData, getMaintenanceFrequencyData } from './reports/chartData';

interface MaintenanceReportsProps {
  vehicleId: string;
}

export default function MaintenanceReports({ vehicleId }: MaintenanceReportsProps) {
  const [timeRange, setTimeRange] = useState('year');

  // Get chart data
  const costByTypeData = getCostByTypeData();
  const maintenanceOverTimeData = getMaintenanceOverTimeData();
  const maintenanceFrequencyData = getMaintenanceFrequencyData();

  return (
    <div className="space-y-6">
      <Card>
        <ReportsHeader timeRange={timeRange} setTimeRange={setTimeRange} />
        <CardContent>
          <ReportChartTabs 
            costByTypeData={costByTypeData}
            maintenanceOverTimeData={maintenanceOverTimeData}
            maintenanceFrequencyData={maintenanceFrequencyData}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MaintenanceSummary />
        <MaintenanceRecommendations />
      </div>
    </div>
  );
}
