
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useVehicleMaintenance } from '@/hooks/use-vehicle-maintenance';
import VehicleSelector from '@/components/maintenance/VehicleSelector';
import MaintenanceOverview from '@/components/maintenance/MaintenanceOverview';
import MaintenanceLogList from '@/components/maintenance/MaintenanceLogList';
import MaintenanceLogForm from '@/components/maintenance/MaintenanceLogForm';
import MaintenanceReports from '@/components/maintenance/MaintenanceReports';
import MaintenanceSettings from '@/components/maintenance/MaintenanceSettings';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function VehicleDashboard() {
  const { user } = useAuth();
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [isAddingLog, setIsAddingLog] = useState(false);
  const { vehicles, isLoading } = useVehicleMaintenance(user?.id);
  
  const handleVehicleSelect = (vehicleId: string) => {
    setSelectedVehicleId(vehicleId);
    setIsAddingLog(false);
  };

  const handleAddLog = () => {
    setIsAddingLog(true);
  };

  const handleLogAdded = () => {
    setIsAddingLog(false);
  };

  return (
    <Layout isLoggedIn={!!user}>
      <div className="container py-6">
        <h1 className="text-3xl font-bold mb-6">Vehicle Maintenance Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left sidebar */}
          <div className="lg:col-span-1">
            <VehicleSelector 
              vehicles={vehicles || []}
              selectedVehicleId={selectedVehicleId}
              onSelectVehicle={handleVehicleSelect}
              isLoading={isLoading}
            />
            
            {selectedVehicleId && (
              <div className="mt-4">
                <Button 
                  onClick={handleAddLog}
                  className="w-full gap-2"
                >
                  <PlusCircle size={16} />
                  Add Maintenance Log
                </Button>
              </div>
            )}
          </div>
          
          {/* Main content */}
          <div className="lg:col-span-3">
            {!selectedVehicleId && (
              <div className="bg-muted p-8 rounded-lg text-center">
                <h3 className="text-xl font-medium mb-2">Select a Vehicle</h3>
                <p className="text-muted-foreground">
                  Choose a vehicle from your garage to view and manage its maintenance records
                </p>
              </div>
            )}
            
            {selectedVehicleId && isAddingLog && (
              <MaintenanceLogForm 
                vehicleId={selectedVehicleId}
                onSuccess={handleLogAdded}
                onCancel={() => setIsAddingLog(false)}
              />
            )}
            
            {selectedVehicleId && !isAddingLog && (
              <Tabs defaultValue="overview">
                <TabsList className="mb-6">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="logs">Maintenance Logs</TabsTrigger>
                  <TabsTrigger value="reports">Reports</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview">
                  <MaintenanceOverview vehicleId={selectedVehicleId} />
                </TabsContent>
                
                <TabsContent value="logs">
                  <MaintenanceLogList vehicleId={selectedVehicleId} />
                </TabsContent>
                
                <TabsContent value="reports">
                  <MaintenanceReports vehicleId={selectedVehicleId} />
                </TabsContent>
                
                <TabsContent value="settings">
                  <MaintenanceSettings vehicleId={selectedVehicleId} />
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
