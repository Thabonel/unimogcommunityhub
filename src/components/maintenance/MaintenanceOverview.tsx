import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';
import { AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { Vehicle, MaintenanceLog } from '@/hooks/vehicle-maintenance';
import { supabase } from '@/integrations/supabase/client';

interface MaintenanceOverviewProps {
  vehicleId: string;
}

export default function MaintenanceOverview({ vehicleId }: MaintenanceOverviewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [recentLogs, setRecentLogs] = useState<MaintenanceLog[]>([]);
  const [upcomingMaintenance, setUpcomingMaintenance] = useState<
    { title: string; due: string; isOverdue: boolean }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // Fetch vehicle details
        const { data: vehicleData, error: vehicleError } = await supabase
          .from('vehicles')
          .select('*')
          .eq('id', vehicleId)
          .single();
          
        if (vehicleError) throw vehicleError;
        setVehicle(vehicleData as Vehicle);
        
        // Fetch recent maintenance logs
        const { data: logsData, error: logsError } = await supabase
          .from('maintenance_logs')
          .select('*')
          .eq('vehicle_id', vehicleId)
          .order('date', { ascending: false })
          .limit(3);
          
        if (logsError) throw logsError;
        setRecentLogs(logsData as MaintenanceLog[]);
        
        // Generate sample upcoming maintenance for demo
        // In production, this would be based on maintenance schedule rules
        setUpcomingMaintenance([
          {
            title: 'Oil Change',
            due: '500 miles',
            isOverdue: false
          },
          {
            title: 'Tire Rotation',
            due: '1,200 miles',
            isOverdue: false
          },
          {
            title: 'Brake Inspection',
            due: 'Overdue by 300 miles',
            isOverdue: true
          }
        ]);
      } catch (error) {
        console.error('Error fetching maintenance data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (vehicleId) {
      fetchData();
    }
  }, [vehicleId]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[125px] w-full rounded-lg" />
        <Skeleton className="h-[300px] w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Summary</CardTitle>
          <CardDescription>
            Current overview of your vehicle
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {vehicle && (
            <>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Vehicle</p>
                <p className="text-sm text-muted-foreground">{vehicle.name} ({vehicle.year} {vehicle.model})</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Current Odometer</p>
                <p className="text-sm text-muted-foreground">
                  {vehicle.current_odometer.toLocaleString()} {vehicle.odometer_unit}
                </p>
              </div>
              
              {vehicle.license_plate && (
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">License Plate</p>
                  <p className="text-sm text-muted-foreground">{vehicle.license_plate}</p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Maintenance</CardTitle>
            <CardDescription>
              Scheduled maintenance items
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingMaintenance.length === 0 ? (
                <div className="flex items-center justify-center h-20 border rounded-md border-dashed">
                  <p className="text-sm text-muted-foreground">No upcoming maintenance scheduled</p>
                </div>
              ) : (
                upcomingMaintenance.map((item, index) => (
                  <Alert key={index} variant={item.isOverdue ? "destructive" : "default"}>
                    <div className="flex items-center gap-2">
                      {item.isOverdue ? (
                        <AlertTriangle className="h-4 w-4" />
                      ) : (
                        <Clock className="h-4 w-4" />
                      )}
                      <div>
                        <AlertTitle>{item.title}</AlertTitle>
                        <AlertDescription>{item.due}</AlertDescription>
                      </div>
                    </div>
                  </Alert>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>
              Latest maintenance records
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentLogs.length === 0 ? (
              <div className="flex items-center justify-center h-20 border rounded-md border-dashed">
                <p className="text-sm text-muted-foreground">No maintenance logs yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-2 pb-4 border-b last:border-b-0">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">{log.maintenance_type.replace('_', ' ')}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(log.date), 'MMM d, yyyy')} • {log.odometer.toLocaleString()} miles
                      </p>
                      {log.cost && (
                        <p className="text-sm text-muted-foreground">
                          Cost: {log.currency} {log.cost.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
