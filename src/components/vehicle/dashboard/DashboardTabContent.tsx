
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { VehicleDetailsCard } from './VehicleDetailsCard';
import { MaintenanceStatusCard } from './MaintenanceStatusCard';
import { MaintenanceHistoryCard } from './MaintenanceHistoryCard';
import { TechnicalDocumentationCard } from './TechnicalDocumentationCard';
import { LoadingState, ErrorState, EmptyState } from './DashboardStates';

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
  
  const renderOverviewContent = () => {
    if (isLoading) {
      return <LoadingState />;
    } else if (error) {
      return <ErrorState error={error} onRetry={onRetry} />;
    } else if (vehicles && vehicles.length > 0) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <VehicleDetailsCard vehicle={vehicles[0]} />
          <MaintenanceStatusCard />
        </div>
      );
    } else {
      return <EmptyState />;
    }
  };

  return (
    <>
      <TabsContent value="overview">
        {renderOverviewContent()}
      </TabsContent>
      
      <TabsContent value="maintenance">
        <MaintenanceHistoryCard />
      </TabsContent>
      
      <TabsContent value="manuals" data-showing-manual="true">
        <TechnicalDocumentationCard modelCode={unimogModel} />
      </TabsContent>
    </>
  );
};
