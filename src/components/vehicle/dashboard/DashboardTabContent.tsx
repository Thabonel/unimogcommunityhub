
import React, { useEffect } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { VehicleDetailsCard } from './VehicleDetailsCard';
import { MaintenanceStatusCard } from './MaintenanceStatusCard';
import { MaintenanceHistoryCard } from './MaintenanceHistoryCard';
import { TechnicalDocumentationCard } from './TechnicalDocumentationCard';
import { LoadingState, ErrorState, EmptyState } from './DashboardStates';
import { useToast } from '@/hooks/use-toast';
import FuelTrackingTabContent from '../fuel/FuelTrackingTabContent';

interface DashboardTabContentProps {
  isLoading: boolean;
  error: Error | null;
  vehicles: any[];
  activeTab: string;
  unimogModel: string;
  onRetry: () => void;
}

export const DashboardTabContent = ({
  isLoading,
  error,
  vehicles,
  activeTab,
  unimogModel,
  onRetry
}: DashboardTabContentProps) => {
  const { toast } = useToast();
  
  // Add debug logging to track the component's state
  useEffect(() => {
    console.log('DashboardTabContent rendering with:', { 
      isLoading, 
      hasError: !!error, 
      vehiclesCount: vehicles?.length || 0,
      activeTab,
      unimogModel 
    });
  }, [isLoading, error, vehicles, activeTab, unimogModel]);

  // Handle offline state
  const isOffline = error?.message?.includes('Network connection') || 
                    error?.message?.includes('Failed to fetch');
  
  // Removed offline toast - it's handled by the offline indicator UI
  
  const renderOverviewContent = () => {
    if (isLoading) {
      return <LoadingState />;
    } else if (vehicles && vehicles.length > 0) {
      // Show vehicles if we have them (even with errors/offline)
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <VehicleDetailsCard 
            vehicle={vehicles[0]} 
            isOffline={isOffline}
          />
          <MaintenanceStatusCard isOffline={isOffline} />
        </div>
      );
    } else if (error && !isOffline) {
      // Only show error if we don't have vehicles and it's not a network issue
      return <ErrorState error={error} onRetry={onRetry} />;
    } else {
      return <EmptyState />;
    }
  };

  return (
    <Tabs value={activeTab} className="mt-4">
      <TabsContent value="overview" className="space-y-6">
        {isOffline && (
          <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-md p-4 mb-4">
            <p className="text-amber-800 dark:text-amber-300 text-sm">
              You're currently offline. Limited functionality is available.
            </p>
          </div>
        )}
        {renderOverviewContent()}
      </TabsContent>
      
      <TabsContent value="maintenance" className="space-y-6">
        {isOffline && (
          <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-md p-4 mb-4">
            <p className="text-amber-800 dark:text-amber-300 text-sm">
              You're currently offline. Limited functionality is available.
            </p>
          </div>
        )}
        <MaintenanceHistoryCard isOffline={isOffline} />
      </TabsContent>
      
      <TabsContent value="fuel" className="space-y-6">
        <FuelTrackingTabContent isOffline={isOffline} />
      </TabsContent>
      
      <TabsContent value="manuals" data-showing-manual="true" className="space-y-6">
        {isOffline && (
          <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-md p-4 mb-4">
            <p className="text-amber-800 dark:text-amber-300 text-sm">
              You're currently offline. Technical documentation may not be available.
            </p>
          </div>
        )}
        <TechnicalDocumentationCard modelCode={unimogModel} isOffline={isOffline} />
      </TabsContent>
    </Tabs>
  );
};
