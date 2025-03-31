import { useState, useEffect } from 'react';
import { useVehicleMaintenance, MaintenanceLog } from '@/hooks/vehicle-maintenance';
import { useToast } from '@/hooks/use-toast';

interface MaintenanceLogListProps {
  vehicleId: string;
}

export default function MaintenanceLogList({ vehicleId }: MaintenanceLogListProps) {
  const [logs, setLogs] = useState<MaintenanceLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getMaintenanceLogs } = useVehicleMaintenance();
  const { toast } = useToast();

  useEffect(() => {
    const fetchLogs = async () => {
      if (!vehicleId) return;
      
      setIsLoading(true);
      try {
        const logData = await getMaintenanceLogs(vehicleId);
        setLogs(logData);
      } catch (error) {
        console.error("Error fetching maintenance logs:", error);
        toast({
          title: "Error loading logs",
          description: "Unable to load maintenance logs. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLogs();
  }, [vehicleId, getMaintenanceLogs, toast]);

  return (
    <div>
      <h2>Maintenance Logs</h2>
      {isLoading ? (
        <p>Loading logs...</p>
      ) : logs.length === 0 ? (
        <p>No maintenance logs found for this vehicle.</p>
      ) : (
        <ul>
          {logs.map(log => (
            <li key={log.id}>
              {log.maintenance_type} - {log.date}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
