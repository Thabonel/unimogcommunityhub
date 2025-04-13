
import React, { useEffect } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { VehicleDetailsCard } from './VehicleDetailsCard';
import { MaintenanceStatusCard } from './MaintenanceStatusCard';
import { MaintenanceHistoryCard } from './MaintenanceHistoryCard';
import { TechnicalDocumentationCard } from './TechnicalDocumentationCard';
import { LoadingState, ErrorState, EmptyState } from './DashboardStates';
import { useToast } from '@/hooks/use-toast';

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
  
  useEffect(() => {
    if (isOffline && !isLoading) {
      toast({
        title: "You're offline",
        description: "Some features may be limited until you reconnect",
        variant: "warning",
      });
    }
  }, [isOffline, isLoading, toast]);
  
  const renderOverviewContent = () => {
    if (isLoading) {
      return <LoadingState />;
    } else if (error && !isOffline) {
      return <ErrorState error={error} onRetry={onRetry} />;
    } else if (vehicles && vehicles.length > 0) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <VehicleDetailsCard 
            vehicle={vehicles[0]} 
            isOffline={isOffline}
          />
          <MaintenanceStatusCard isOffline={isOffline} />
        </div>
      );
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
