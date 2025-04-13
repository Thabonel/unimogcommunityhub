
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useFuelLogs } from '@/hooks/vehicle-maintenance/use-fuel-logs';
import { useVehicles } from '@/hooks/vehicle-maintenance/use-vehicles';
import { FuelLog } from '@/hooks/vehicle-maintenance/types';
import FuelDashboardCard from './FuelDashboardCard';
import FuelLogForm from './FuelLogForm';
import FuelLogDetailsCard from './FuelLogDetailsCard';

interface FuelTrackingTabContentProps {
  isOffline?: boolean;
}

type ViewState = 'dashboard' | 'add' | 'edit' | 'details';

const FuelTrackingTabContent = ({ isOffline = false }: FuelTrackingTabContentProps) => {
  const { user } = useAuth();
  const [viewState, setViewState] = useState<ViewState>('dashboard');
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
  const [selectedLog, setSelectedLog] = useState<FuelLog | undefined>(undefined);
  const { fuelLogs, isLoading, error, fetchFuelLogs, addFuelLog, updateFuelLog, deleteFuelLog } = useFuelLogs();
  const { vehicles, isLoading: isLoadingVehicles } = useVehicles(user?.id);

  const handleAddFuelLog = useCallback(async (data: Omit<FuelLog, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    const result = await addFuelLog(data);
    if (result.success) {
      setViewState('dashboard');
      toast.success('Fuel log added successfully');
    }
  }, [addFuelLog]);

  const handleUpdateFuelLog = useCallback(async (data: Omit<FuelLog, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!selectedLogId) return;
    
    const result = await updateFuelLog(selectedLogId, data);
    if (result.success) {
      setViewState('dashboard');
      toast.success('Fuel log updated successfully');
    }
  }, [updateFuelLog, selectedLogId]);

  const handleDeleteFuelLog = useCallback(async () => {
    if (!selectedLogId) return;
    
    const result = await deleteFuelLog(selectedLogId);
    if (result.success) {
      setViewState('dashboard');
      setSelectedLogId(null);
      toast.success('Fuel log deleted successfully');
    }
  }, [deleteFuelLog, selectedLogId]);

  const handleViewDetails = useCallback((id: string) => {
    setSelectedLogId(id);
    setViewState('details');
    // Find the log in our current state to avoid an unnecessary fetch
    const log = fuelLogs.find(log => log.id === id);
    setSelectedLog(log);
  }, [fuelLogs]);

  const handleEditLog = useCallback(() => {
    setViewState('edit');
  }, []);

  const getVehicleName = useCallback((id: string) => {
    const vehicle = vehicles?.find(v => v.id === id);
    return vehicle ? `${vehicle.name} (${vehicle.model})` : 'Unknown Vehicle';
  }, [vehicles]);

  useEffect(() => {
    if (!isOffline) {
      fetchFuelLogs();
    }
  }, [fetchFuelLogs, isOffline]);

  if (isOffline) {
    return (
      <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-md p-4 mb-4">
        <p className="text-amber-800 dark:text-amber-300 text-sm">
          You're currently offline. Fuel tracking functionality is not available while offline.
        </p>
      </div>
    );
  }

  return (
    <div>
      {viewState === 'dashboard' && (
        <FuelDashboardCard 
          onAddFuelLog={() => setViewState('add')} 
          onViewDetails={handleViewDetails} 
        />
      )}
      
      {viewState === 'add' && (
        <FuelLogForm
          onSubmit={handleAddFuelLog}
          vehicles={vehicles || []}
          onCancel={() => setViewState('dashboard')}
        />
      )}

      {viewState === 'edit' && selectedLog && (
        <FuelLogForm
          onSubmit={handleUpdateFuelLog}
          vehicles={vehicles || []}
          initialValues={selectedLog}
          isUpdate={true}
          onCancel={() => setViewState('details')}
        />
      )}

      {viewState === 'details' && (
        <FuelLogDetailsCard
          fuelLog={selectedLog}
          vehicleName={selectedLog ? getVehicleName(selectedLog.vehicle_id) : undefined}
          isLoading={isLoading}
          error={error}
          onEdit={handleEditLog}
          onDelete={handleDeleteFuelLog}
          onBack={() => {
            setViewState('dashboard');
            setSelectedLogId(null);
          }}
        />
      )}
    </div>
  );
};

export default FuelTrackingTabContent;
