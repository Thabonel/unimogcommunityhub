
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { BarChart, LineChart, PieChart } from '@/components/ui/chart';
import { Download, BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon } from 'lucide-react';

interface MaintenanceReportsProps {
  vehicleId: string;
}

export default function MaintenanceReports({ vehicleId }: MaintenanceReportsProps) {
  const [timeRange, setTimeRange] = useState('year');

  // Sample data for the charts
  const costByTypeData = {
    labels: ['Oil Change', 'Tires', 'Brakes', 'Engine', 'Other'],
    datasets: [
      {
        label: 'Expenses',
        data: [350, 800, 600, 1200, 400],
        backgroundColor: [
          'rgba(24, 119, 242, 0.7)',
          'rgba(90, 93, 235, 0.7)',
          'rgba(140, 82, 255, 0.7)',
          'rgba(194, 75, 184, 0.7)',
          'rgba(229, 69, 109, 0.7)',
        ],
        borderColor: [
          'rgb(24, 119, 242)',
          'rgb(90, 93, 235)',
          'rgb(140, 82, 255)',
          'rgb(194, 75, 184)',
          'rgb(229, 69, 109)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const maintenanceOverTimeData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Total Cost',
        data: [0, 120, 120, 350, 350, 500, 650, 650, 950, 1100, 1200, 1400],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'Maintenance Events',
        data: [0, 1, 0, 1, 0, 1, 1, 0, 2, 1, 1, 1],
        fill: false,
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
    ],
  };

  const maintenanceFrequencyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Maintenance Frequency',
        data: [0, 1, 0, 1, 0, 1, 1, 0, 2, 1, 1, 1],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Maintenance Reports</CardTitle>
          <div className="flex gap-2 mt-2 sm:mt-0">
            <Select
              value={timeRange}
              onValueChange={setTimeRange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3months">Last 3 months</SelectItem>
                <SelectItem value="6months">Last 6 months</SelectItem>
                <SelectItem value="year">Last year</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
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
              <div className="h-[400px] w-full">
                <PieChart 
                  data={costByTypeData} 
                  className="h-full w-full"
                />
              </div>
              <div className="mt-4 text-sm text-muted-foreground text-center">
                <p>Breakdown of maintenance expenses by category</p>
              </div>
            </TabsContent>
            
            <TabsContent value="trends">
              <div className="h-[400px] w-full">
                <LineChart 
                  data={maintenanceOverTimeData} 
                  className="h-full w-full"
                />
              </div>
              <div className="mt-4 text-sm text-muted-foreground text-center">
                <p>Maintenance costs and frequency over time</p>
              </div>
            </TabsContent>
            
            <TabsContent value="frequency">
              <div className="h-[400px] w-full">
                <BarChart 
                  data={maintenanceFrequencyData} 
                  className="h-full w-full"
                />
              </div>
              <div className="mt-4 text-sm text-muted-foreground text-center">
                <p>Number of maintenance events by month</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Maintenance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between border-b pb-2">
                <span>Total maintenance costs:</span>
                <span className="font-medium">$1,400.00</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span>Number of maintenance events:</span>
                <span className="font-medium">9</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span>Most common service:</span>
                <span className="font-medium">Oil Change (3)</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span>Most expensive service:</span>
                <span className="font-medium">Engine Repair ($1,200)</span>
              </div>
              <div className="flex justify-between pb-2">
                <span>Average cost per service:</span>
                <span className="font-medium">$155.56</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-4">
                <p className="font-medium mb-1">Next Oil Change</p>
                <p className="text-sm text-muted-foreground">
                  Based on your vehicle's history, consider scheduling an oil change in the next 500 miles.
                </p>
              </div>
              
              <div className="rounded-lg bg-muted p-4">
                <p className="font-medium mb-1">Tire Rotation Due</p>
                <p className="text-sm text-muted-foreground">
                  Your last tire rotation was 5,000 miles ago. Consider scheduling this maintenance soon.
                </p>
              </div>
              
              <div className="rounded-lg bg-muted p-4">
                <p className="font-medium mb-1">Cost Optimization</p>
                <p className="text-sm text-muted-foreground">
                  You could save approximately $120 annually by adjusting your maintenance schedule based on actual usage patterns.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
