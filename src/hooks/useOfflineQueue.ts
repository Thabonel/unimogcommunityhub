import { useState, useEffect, useCallback } from 'react';
import {
  OfflineQueueService,
  FuelLogData,
  MaintenanceLogData,
  TripLogData,
  OfflineEntry,
} from '@/services/offline/OfflineQueueService';

interface QueueStats {
  pending: number;
  syncing: number;
  synced: number;
  failed: number;
  total: number;
}

interface LastValues {
  lastOdometer: number;
  lastFuelPrice: number;
  lastFuelType: string;
  lastFuelStation: string;
  lastCurrency: string;
}

interface UseOfflineQueueResult {
  isOnline: boolean;
  isInitialized: boolean;
  stats: QueueStats;
  addFuelLog: (data: FuelLogData, userId: string, vehicleId: string) => Promise<OfflineEntry<FuelLogData>>;
  addMaintenanceLog: (data: MaintenanceLogData, userId: string, vehicleId: string) => Promise<OfflineEntry<MaintenanceLogData>>;
  addTripLog: (data: TripLogData, userId: string, vehicleId: string) => Promise<OfflineEntry<TripLogData>>;
  getPendingEntries: () => Promise<OfflineEntry[]>;
  getEntriesByVehicle: (vehicleId: string) => Promise<OfflineEntry[]>;
  syncNow: () => Promise<{ synced: number; failed: number }>;
  deleteEntry: (id: string) => Promise<void>;
  retryEntry: (id: string) => Promise<void>;
  getLastValues: (vehicleId: string) => Promise<LastValues | undefined>;
  hasPendingSync: boolean;
}

export function useOfflineQueue(): UseOfflineQueueResult {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isInitialized, setIsInitialized] = useState(false);
  const [stats, setStats] = useState<QueueStats>({
    pending: 0,
    syncing: 0,
    synced: 0,
    failed: 0,
    total: 0,
  });

  useEffect(() => {
    const init = async () => {
      await OfflineQueueService.init();
      const currentStats = await OfflineQueueService.getStats();
      setStats(currentStats);
      setIsInitialized(true);
    };

    init();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const unsubscribe = OfflineQueueService.onSyncChange(async () => {
      const newStats = await OfflineQueueService.getStats();
      setStats(newStats);
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      unsubscribe();
    };
  }, []);

  const refreshStats = useCallback(async () => {
    const newStats = await OfflineQueueService.getStats();
    setStats(newStats);
  }, []);

  const addFuelLog = useCallback(
    async (data: FuelLogData, userId: string, vehicleId: string) => {
      const entry = await OfflineQueueService.addEntry('fuel', data, userId, vehicleId);
      await refreshStats();
      return entry as OfflineEntry<FuelLogData>;
    },
    [refreshStats]
  );

  const addMaintenanceLog = useCallback(
    async (data: MaintenanceLogData, userId: string, vehicleId: string) => {
      const entry = await OfflineQueueService.addEntry('maintenance', data, userId, vehicleId);
      await refreshStats();
      return entry as OfflineEntry<MaintenanceLogData>;
    },
    [refreshStats]
  );

  const addTripLog = useCallback(
    async (data: TripLogData, userId: string, vehicleId: string) => {
      const entry = await OfflineQueueService.addEntry('trip', data, userId, vehicleId);
      await refreshStats();
      return entry as OfflineEntry<TripLogData>;
    },
    [refreshStats]
  );

  const getPendingEntries = useCallback(async () => {
    return OfflineQueueService.getPendingEntries();
  }, []);

  const getEntriesByVehicle = useCallback(async (vehicleId: string) => {
    return OfflineQueueService.getEntriesByVehicle(vehicleId);
  }, []);

  const syncNow = useCallback(async () => {
    const result = await OfflineQueueService.syncPending();
    await refreshStats();
    return result;
  }, [refreshStats]);

  const deleteEntry = useCallback(
    async (id: string) => {
      await OfflineQueueService.deleteEntry(id);
      await refreshStats();
    },
    [refreshStats]
  );

  const retryEntry = useCallback(
    async (id: string) => {
      const entry = await OfflineQueueService.getEntry(id);
      if (entry && entry.status === 'failed') {
        await OfflineQueueService.updateEntryStatus(id, 'pending');
        await refreshStats();
        if (isOnline) {
          await syncNow();
        }
      }
    },
    [isOnline, refreshStats, syncNow]
  );

  const getLastValues = useCallback(async (vehicleId: string) => {
    const values = await OfflineQueueService.getLastValues(vehicleId);
    if (!values) return undefined;
    return {
      lastOdometer: values.lastOdometer,
      lastFuelPrice: values.lastFuelPrice,
      lastFuelType: values.lastFuelType,
      lastFuelStation: values.lastFuelStation,
      lastCurrency: values.lastCurrency,
    };
  }, []);

  return {
    isOnline,
    isInitialized,
    stats,
    addFuelLog,
    addMaintenanceLog,
    addTripLog,
    getPendingEntries,
    getEntriesByVehicle,
    syncNow,
    deleteEntry,
    retryEntry,
    getLastValues,
    hasPendingSync: stats.pending > 0 || stats.syncing > 0,
  };
}

export type { QueueStats, LastValues };
