
import { useState, useEffect } from 'react';
import { Fuel, Plus, AlertCircle, ChevronRight, TrendingUp, Droplet, Receipt, Ban } from 'lucide-react';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { useFuelLogs } from '@/hooks/vehicle-maintenance/use-fuel-logs';
import { useVehicles } from '@/hooks/vehicle-maintenance/use-vehicles';
import { FuelLog } from '@/hooks/vehicle-maintenance/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type FuelLogWithEfficiency = FuelLog & { 
  efficiency?: number | null;
  distance?: number;
};

interface FuelDashboardCardProps {
  vehicleId?: string;
  onAddFuelLog: () => void;
  onViewDetails: (id: string) => void;
}

const FuelDashboardCard = ({ 
  vehicleId, 
  onAddFuelLog, 
  onViewDetails 
}: FuelDashboardCardProps) => {
  const { fuelLogs, isLoading, error, fetchFuelLogs, calculateFuelStats } = useFuelLogs(vehicleId);
  const { vehicles, isLoading: isLoadingVehicles } = useVehicles();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [stats, setStats] = useState<{
    totalCost: number;
    totalFuel: number;
    avgEfficiency: number;
    avgCostPerUnit: number;
    avgCostPerDistance: number;
    fuelLogs: FuelLogWithEfficiency[];
  }>({
    totalCost: 0,
    totalFuel: 0,
    avgEfficiency: 0,
    avgCostPerUnit: 0,
    avgCostPerDistance: 0,
    fuelLogs: []
  });

  useEffect(() => {
    fetchFuelLogs();
  }, [fetchFuelLogs, vehicleId]);

  useEffect(() => {
    if (!isLoading && fuelLogs?.length) {
      setStats(calculateFuelStats(fuelLogs));
    }
  }, [isLoading, fuelLogs, calculateFuelStats]);

  // Convert the fuel logs to chart data
  const chartData = stats.fuelLogs.map((log) => {
    const date = new Date(log.fill_date);
    return {
      id: log.id,
      name: format(date, 'MMM d'),
      date: format(date, 'yyyy-MM-dd'),
      price: log.fuel_price_per_unit,
      amount: log.fuel_amount,
      cost: log.total_cost,
      efficiency: log.efficiency || 0,
      odometer: log.odometer
    };
  }).reverse(); // To show in chronological order

  const getVehicleName = (id: string) => {
    const vehicle = vehicles?.find(v => v.id === id);
    return vehicle ? `${vehicle.name} (${vehicle.model})` : 'Unknown Vehicle';
  };

  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value);
  };

  if (isLoading || isLoadingVehicles) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fuel className="h-5 w-5" />
            Fuel Tracking
          </CardTitle>
          <CardDescription>
            Loading fuel data...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-[200px] w-full" />
            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fuel className="h-5 w-5" />
            Fuel Tracking
          </CardTitle>
          <CardDescription>
            Could not load fuel data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error.message || 'Failed to load fuel data. Please try again later.'}
            </AlertDescription>
          </Alert>
          <Button
            onClick={() => fetchFuelLogs()}
            variant="outline"
            className="mt-4"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Ban className="h-16 w-16 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium">No fuel logs yet</h3>
      <p className="text-muted-foreground mb-6">
        Start tracking your fuel consumption by adding your first fuel log.
      </p>
      <Button onClick={onAddFuelLog}>
        <Plus className="h-4 w-4 mr-2" />
        Add Fuel Log
      </Button>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Fuel className="h-5 w-5" />
              Fuel Tracking
            </CardTitle>
            <CardDescription>
              Track your fuel consumption and costs over time
            </CardDescription>
          </div>
          <Button onClick={onAddFuelLog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Fuel Log
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {fuelLogs.length === 0 ? (
          <EmptyState />
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="charts">Charts</TabsTrigger>
              <TabsTrigger value="logs">Logs</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Efficiency</CardDescription>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      {stats.avgEfficiency.toFixed(2)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {vehicleId ? vehicles?.find(v => v.id === vehicleId)?.odometer_unit === 'km' ? 'km/L' : 'MPG' : 'km/L or MPG'}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Total Spent</CardDescription>
                    <CardTitle className="flex items-center gap-2">
                      <Receipt className="h-4 w-4 text-red-500" />
                      {formatCurrency(stats.totalCost, fuelLogs[0]?.currency || 'USD')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      For {stats.totalFuel.toFixed(2)} units of fuel
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Avg. Price</CardDescription>
                    <CardTitle className="flex items-center gap-2">
                      <Droplet className="h-4 w-4 text-blue-500" />
                      {formatCurrency(stats.avgCostPerUnit, fuelLogs[0]?.currency || 'USD')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Per unit of fuel
                    </p>
                  </CardContent>
                </Card>
              </div>

              {chartData.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-4">Recent Price Trends</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={chartData.slice(-10)} // Show only last 10 for better readability
                        margin={{
                          top: 5,
                          right: 20,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="price"
                          name="Price per unit"
                          stroke="#8884d8"
                          fill="#8884d8"
                          fillOpacity={0.3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="charts">
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">Efficiency</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={chartData}
                        margin={{
                          top: 5,
                          right: 20,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="efficiency"
                          name="Fuel Efficiency"
                          stroke="#82ca9d"
                          fill="#82ca9d"
                          fillOpacity={0.3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Cost & Amount</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData}
                        margin={{
                          top: 5,
                          right: 20,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis yAxisId="left" orientation="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="cost" name="Total Cost" fill="#8884d8" />
                        <Bar yAxisId="right" dataKey="amount" name="Fuel Amount" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="logs">
              <ScrollArea className="h-[500px]">
                <div className="space-y-4">
                  {stats.fuelLogs.map((log) => (
                    <Card key={log.id} className="hover:bg-accent/50 transition-colors">
                      <CardHeader className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base">
                              {format(new Date(log.fill_date), 'MMMM d, yyyy')}
                            </CardTitle>
                            <CardDescription>
                              {getVehicleName(log.vehicle_id)}
                            </CardDescription>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => onViewDetails(log.id)}>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Amount</p>
                            <p className="font-medium">{log.fuel_amount.toFixed(2)} units</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Cost</p>
                            <p className="font-medium">
                              {formatCurrency(log.total_cost, log.currency)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Odometer</p>
                            <p className="font-medium">{log.odometer}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Efficiency</p>
                            <p className="font-medium">
                              {log.efficiency ? log.efficiency.toFixed(2) : 'N/A'}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          {fuelLogs.length} fuel logs tracked
        </p>
      </CardFooter>
    </Card>
  );
};

export default FuelDashboardCard;
