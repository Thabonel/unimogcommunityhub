
import React from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Wrench, ArrowLeft } from 'lucide-react';
import { Tabs } from '@/components/ui/tabs';
import { DashboardTabs } from '@/components/vehicle/dashboard/DashboardTabs';
import { DashboardTabContent } from '@/components/vehicle/dashboard/DashboardTabContent';
import { useVehicles } from '@/hooks/vehicle-maintenance/use-vehicles';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { WifiOff } from 'lucide-react';

const VehicleDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<string>(tabParam || 'overview');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // Use the useVehicles hook directly
  const { vehicles, isLoading, error, refetchVehicles } = useVehicles(user?.id);
  
  // For now, we'll assume the user has a U1700L Unimog
  // In a real implementation, this would come from the vehicles state
  const unimogModel = vehicles && vehicles.length > 0 ? vehicles[0].model : 'U1700L';

  // Setup network status listener
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "You're back online",
        description: "All features are now available",
        variant: "success",
      });
      refetchVehicles(); // Refresh data when we come back online
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "You're offline",
        description: "Some features may be limited",
        variant: "warning",
      });
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [refetchVehicles]);

  // Handle tab param from URL
  useEffect(() => {
    if (tabParam && ['overview', 'maintenance', 'fuel', 'manuals'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  useEffect(() => {
    // Clear any previous console logs
    console.clear();
    
    // Enhanced debug logging
    console.log('Vehicle dashboard data:', { 
      vehicles, 
      isLoading, 
      error, 
      userId: user?.id,
      vehiclesLength: vehicles?.length || 0,
      hasVehicles: !!vehicles && vehicles.length > 0,
      firstVehicle: vehicles && vehicles.length > 0 ? vehicles[0] : null,
      isOnline,
      activeTab
    });
    
    // Don't show toasts for errors - we handle them in the UI
    // This prevents duplicate error messages
  }, [vehicles, isLoading, error, user?.id, isOnline, activeTab]);

  const handleRefresh = () => {
    refetchVehicles();
    toast({
      title: 'Refreshing data',
      description: 'Attempting to reload your vehicle data',
    });
  };

  return (
    <Layout isLoggedIn={!!user}>
      <div className="container py-8" style={{ backgroundColor: "#d6c8ac", minHeight: "calc(100vh - 64px)" }}>
        {/* Back button */}
        <Button
          variant="outline"
          size="default"
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-2 bg-white hover:bg-gray-100 text-mud-black border-mud-black/20"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Previous Page
        </Button>
        
        <div className="bg-sand-beige px-6 py-8 rounded-lg shadow-sm">
          <h1 className="text-3xl font-bold mb-2 text-mud-black flex items-center gap-2 font-rugged">
            <Wrench className="h-8 w-8" />
            VEHICLE MAINTENANCE DASHBOARD
          </h1>
          <p className="text-muted-foreground mb-6">
            Track maintenance, access manuals, and keep your Unimog in top condition.
          </p>

          {!isOnline && (
            <Alert variant="warning" className="mb-6">
              <WifiOff className="h-4 w-4" />
              <AlertTitle>You're offline</AlertTitle>
              <AlertDescription className="flex justify-between items-center">
                <span>Limited functionality is available while offline.</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleRefresh}
                >
                  Try Reconnecting
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />
            
            <DashboardTabContent 
              isLoading={isLoading}
              error={error}
              vehicles={vehicles || []} // Ensure we always pass an array
              activeTab={activeTab}
              unimogModel={unimogModel}
              onRetry={handleRefresh}
            />
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default VehicleDashboard;
