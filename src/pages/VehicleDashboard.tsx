
import { useState, useCallback, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useVehicleMaintenance } from '@/hooks/vehicle-maintenance';
import VehicleSelector from '@/components/maintenance/VehicleSelector';
import MaintenanceOverview from '@/components/maintenance/MaintenanceOverview';
import MaintenanceLogList from '@/components/maintenance/MaintenanceLogList';
import MaintenanceLogForm from '@/components/maintenance/MaintenanceLogForm';
import MaintenanceReports from '@/components/maintenance/MaintenanceReports';
import MaintenanceSettings from '@/components/maintenance/MaintenanceSettings';
import { Button } from '@/components/ui/button';
import { PlusCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function VehicleDashboard() {
  const { user } = useAuth();
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [isAddingLog, setIsAddingLog] = useState(false);
  const { vehicles, isLoading, error, refetchVehicles } = useVehicleMaintenance(user?.id);
  const navigate = useNavigate();
  
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
  
  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page in the navigation history
  };

  const handleRetry = useCallback(() => {
    console.log("Retrying vehicle fetch...");
    refetchVehicles();
  }, [refetchVehicles]);

  // Select the first vehicle automatically if it exists and none is selected
  useEffect(() => {
    if (!selectedVehicleId && vehicles.length > 0 && !isLoading) {
      console.log("Auto-selecting first vehicle:", vehicles[0].id);
      setSelectedVehicleId(vehicles[0].id);
    }
  }, [vehicles, selectedVehicleId, isLoading]);

  useEffect(() => {
    // Log the current state for debugging
    console.log("VehicleDashboard state:", { 
      userId: user?.id,
      vehiclesCount: vehicles.length,
      isLoading,
      error: error?.message,
      selectedVehicleId
    });
  }, [user, vehicles, isLoading, error, selectedVehicleId]);

  return (
    <Layout isLoggedIn={!!user}>
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleGoBack}
              className="flex items-center gap-1"
            >
              <ArrowLeft size={16} />
              Back
            </Button>
            <h1 className="text-3xl font-bold">Vehicle Maintenance Dashboard</h1>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left sidebar */}
          <div className="lg:col-span-1">
            <VehicleSelector 
              vehicles={vehicles || []}
              selectedVehicleId={selectedVehicleId}
              onSelectVehicle={handleVehicleSelect}
              isLoading={isLoading}
              error={error}
              onRetry={handleRetry}
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
            {!selectedVehicleId && !isLoading && vehicles.length === 0 && (
              <div className="bg-muted p-8 rounded-lg text-center">
                <h3 className="text-xl font-medium mb-2">No Vehicles Found</h3>
                <p className="text-muted-foreground mb-4">
                  Add a vehicle to your garage to get started with maintenance tracking
                </p>
              </div>
            )}
            
            {!selectedVehicleId && vehicles.length > 0 && !isLoading && (
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
