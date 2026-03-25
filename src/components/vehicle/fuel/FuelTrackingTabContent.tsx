
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useFuelLogs } from '@/hooks/vehicle-maintenance/use-fuel-logs';
import { useVehicles } from '@/hooks/vehicle-maintenance/use-vehicles';
import { FuelLog } from '@/hooks/vehicle-maintenance/types';
import FuelDashboardCard from './FuelDashboardCard';
import FuelLogForm, { FuelLogFormValues } from './FuelLogForm';
import FuelLogDetailsCard from './FuelLogDetailsCard';
import { FuelReceiptUploadModal } from './FuelReceiptUploadModal';
import { FuelReceiptData, FuelReceiptParser } from '@/services/fuel-receipt-parser';

interface FuelTrackingTabContentProps {
  isOffline?: boolean;
}

type ViewState = 'dashboard' | 'add' | 'edit' | 'details' | 'upload';

const FuelTrackingTabContent = ({ isOffline = false }: FuelTrackingTabContentProps) => {
  const { user } = useAuth();
  const [viewState, setViewState] = useState<ViewState>('dashboard');
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
  const [selectedLog, setSelectedLog] = useState<FuelLog | undefined>(undefined);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const { fuelLogs, isLoading, error, fetchFuelLogs, addFuelLog, updateFuelLog, deleteFuelLog } = useFuelLogs();
  const { vehicles, isLoading: isLoadingVehicles } = useVehicles(user?.id);

  const handleAddFuelLog = useCallback(async (data: FuelLogFormValues) => {
    // Convert Date object to ISO string for database storage
    const dbData = {
      ...data,
      fill_date: data.fill_date.toISOString()
    };

    const result = await addFuelLog(dbData);
    if (result.success) {
      setViewState('dashboard');
      toast.success('Fuel log added successfully');
    }
  }, [addFuelLog]);

  const handleUpdateFuelLog = useCallback(async (data: FuelLogFormValues) => {
    if (!selectedLogId) return;

    // Convert Date object to ISO string for database storage
    const dbData = {
      ...data,
      fill_date: data.fill_date.toISOString()
    };

    const result = await updateFuelLog(selectedLogId, dbData);
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

  const handleEditLogFromDashboard = useCallback((log: FuelLog) => {
    setSelectedLog(log);
    setSelectedLogId(log.id);
    setViewState('edit');
  }, []);

  const handleUploadReceipt = useCallback(() => {
    setUploadModalOpen(true);
  }, []);

  const handleReceiptProcessed = useCallback(async (fuelData: FuelReceiptData, vehicleId: string) => {
    try {
      // Convert fuel receipt data to fuel log form values
      const formValues = FuelReceiptParser.convertToFuelLogValues(fuelData, vehicleId);

      // Add the fuel log using existing handler
      await handleAddFuelLog(formValues);

      // Close modal and show success toast
      setUploadModalOpen(false);
      toast.success('Receipt processed and fuel data added successfully!');

    } catch (error) {
      console.error('Failed to process receipt:', error);
      toast.error('Failed to save fuel data from receipt');
      throw error; // Re-throw so modal can handle the error state
    }
  }, [handleAddFuelLog]);

  const getVehicleName = useCallback((id: string) => {
    if (!vehicles || vehicles.length === 0) return 'Loading Vehicle...';
    const vehicle = vehicles.find(v => v.id === id);
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

  // For the edit form, convert string date to Date object
  const prepareFormData = (log: FuelLog): Partial<FuelLogFormValues> => {
    return {
      ...log,
      fill_date: new Date(log.fill_date)
    };
  };

  return (
    <div>
      {viewState === 'dashboard' && (
        <FuelDashboardCard
          onAddFuelLog={() => setViewState('add')}
          onUploadReceipt={handleUploadReceipt}
          onViewDetails={handleViewDetails}
          onEditFuelLog={handleEditLogFromDashboard}
        />
      )}

      {viewState === 'add' && (
        <FuelLogForm
          onSubmit={handleAddFuelLog}
          vehicles={vehicles || []}
          isLoadingVehicles={isLoadingVehicles}
          onCancel={() => setViewState('dashboard')}
        />
      )}

      {viewState === 'edit' && selectedLog && (
        <FuelLogForm
          onSubmit={handleUpdateFuelLog}
          vehicles={vehicles || []}
          isLoadingVehicles={isLoadingVehicles}
          initialValues={prepareFormData(selectedLog)}
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

      {/* Fuel Receipt Upload Modal */}
      <FuelReceiptUploadModal
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
        vehicles={vehicles || []}
        onReceiptProcessed={handleReceiptProcessed}
      />
    </div>
  );
};

export default FuelTrackingTabContent;
