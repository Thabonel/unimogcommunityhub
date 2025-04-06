
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Wrench } from 'lucide-react';
import { useVehicles } from '@/hooks/vehicle-maintenance/use-vehicles';
import { toast } from '@/hooks/use-toast';
import { DashboardTabs } from '@/components/vehicle/dashboard/DashboardTabs';
import { DashboardTabContent } from '@/components/vehicle/dashboard/DashboardTabContent';

const VehicleDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Use the smaller useVehicles hook directly instead of the combined hook
  const { vehicles, isLoading, error, refetchVehicles } = useVehicles(user?.id);
  
  // For now, we'll assume the user has a U1700L Unimog
  // In a real implementation, this would come from the vehicles state
  const unimogModel = vehicles && vehicles.length > 0 ? vehicles[0].model : 'U1700L';

  useEffect(() => {
    // Clear any previous console logs
    console.clear();
    
    // Log for debugging
    console.log('Vehicle dashboard data:', { vehicles, isLoading, error, userId: user?.id });
    
    // If we're not loading and we have an error, show a toast
    if (!isLoading && error) {
      toast({
        title: 'Error loading vehicle data',
        description: error.message || 'Failed to load vehicle information',
        variant: 'destructive',
      });
    }
  }, [vehicles, isLoading, error, user?.id]);

  const handleRefresh = () => {
    refetchVehicles();
    toast({
      title: 'Refreshing data',
      description: 'Attempting to reload your vehicle data',
    });
  };

  return (
    <Layout isLoggedIn={!!user}>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-2 text-unimog-800 dark:text-unimog-200 flex items-center gap-2">
          <Wrench className="h-8 w-8" />
          Vehicle Maintenance Dashboard
        </h1>
        <p className="text-muted-foreground mb-8">
          Track maintenance, access manuals, and keep your Unimog in top condition.
        </p>

        <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />
        
        <DashboardTabContent 
          isLoading={isLoading}
          error={error}
          vehicles={vehicles}
          activeTab={activeTab}
          unimogModel={unimogModel}
          onRetry={handleRefresh}
        />
      </div>
    </Layout>
  );
};

export default VehicleDashboard;
