
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useVehicleMaintenance, MaintenanceLog, Vehicle, MaintenanceAlert } from '@/hooks/use-vehicle-maintenance';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Bell, AlertTriangle, Wrench, Clock, DollarSign } from 'lucide-react';
import { ChartContainer } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface MaintenanceOverviewProps {
  vehicleId: string;
}

export default function MaintenanceOverview({ vehicleId }: MaintenanceOverviewProps) {
  const { getMaintenanceLogs } = useVehicleMaintenance();
  const [logs, setLogs] = useState<MaintenanceLog[]>([]);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [alerts, setAlerts] = useState<MaintenanceAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMaintenanceData = async () => {
      setIsLoading(true);
      try {
        const { data: vehicleData } = await supabase
          .from('vehicles')
          .select('*')
          .eq('id', vehicleId)
          .single();
        
        setVehicle(vehicleData);
        
        const maintenanceLogs = await getMaintenanceLogs(vehicleId);
        setLogs(maintenanceLogs);
        
        // Mock alerts for demonstration
        setAlerts([
          {
            id: '1',
            vehicle_id: vehicleId,
            maintenance_type: 'oil_change',
            due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            is_overdue: false,
            description: 'Oil change due in 7 days'
          },
          {
            id: '2',
            vehicle_id: vehicleId,
            maintenance_type: 'tire_rotation',
            due_odometer: (vehicleData?.current_odometer || 0) + 1000,
            is_overdue: false,
            description: 'Tire rotation due in 1,000 km'
          }
        ]);
      } catch (error) {
        console.error('Error loading maintenance data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMaintenanceData();
  }, [vehicleId, getMaintenanceLogs]);
  
  // Prepare data for maintenance cost chart
  const costData = logs
    .filter(log => log.cost !== undefined && log.cost !== null)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-10)
    .map(log => ({
      date: new Date(log.date).toLocaleDateString(),
      cost: log.cost || 0,
      type: log.maintenance_type
    }));
  
  // Prepare data for maintenance type distribution
  const typeDistribution = logs.reduce((acc, log) => {
    const type = log.maintenance_type;
    if (!acc[type]) {
      acc[type] = 0;
    }
    acc[type]++;
    return acc;
  }, {} as Record<string, number>);
  
  const typeData = Object.entries(typeDistribution).map(([name, value]) => ({ name, value }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  // Count total logs
  const totalLogs = logs.length;
  
  // Calculate total cost
  const totalCost = logs.reduce((sum, log) => sum + (log.cost || 0), 0);
  
  // Find last service date
  const lastServiceDate = logs.length > 0 
    ? new Date(logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date).toLocaleDateString()
    : 'None';

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLogs}</div>
            <p className="text-xs text-muted-foreground mt-1">Maintenance entries</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Last Service</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
            <div className="text-2xl font-bold">{lastServiceDate}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Cost</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
            <div className="text-2xl font-bold">${totalCost.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Alerts Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" /> 
            Maintenance Alerts
          </CardTitle>
          <CardDescription>
            Upcoming and overdue maintenance tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted-foreground">No alerts at this time</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map(alert => (
                <Alert key={alert.id} variant={alert.is_overdue ? "destructive" : "default"}>
                  {alert.is_overdue ? (
                    <AlertTriangle className="h-4 w-4" />
                  ) : (
                    <Clock className="h-4 w-4" />
                  )}
                  <AlertTitle className="flex items-center gap-2">
                    {alert.maintenance_type.replace('_', ' ')}
                    {alert.is_overdue ? (
                      <Badge variant="destructive">Overdue</Badge>
                    ) : (
                      <Badge variant="outline">Upcoming</Badge>
                    )}
                  </AlertTitle>
                  <AlertDescription>
                    {alert.description}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Charts Section */}
      {logs.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cost History Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" /> 
                Maintenance Cost History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                className="aspect-[4/3]"
                config={{
                  cost: {}
                }}
              >
                <BarChart data={costData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="cost" fill="#8884d8" name="Cost" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
          
          {/* Maintenance Type Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" /> 
                Maintenance Types
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                className="aspect-[4/3]"
                config={{
                  maintType: {}
                }}
              >
                <PieChart>
                  <Pie
                    data={typeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {typeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
