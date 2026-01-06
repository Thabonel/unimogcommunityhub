import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { v4 as uuidv4 } from 'uuid';

export type LogType = 'fuel' | 'maintenance' | 'trip';
export type SyncStatus = 'pending' | 'syncing' | 'synced' | 'failed';

export interface FuelLogData {
  vehicle_id: string;
  odometer: number;
  fill_date: string;
  fuel_amount: number;
  fuel_price_per_unit: number;
  total_cost: number;
  fuel_type: string;
  fuel_station?: string;
  currency: string;
  notes?: string;
  full_tank: boolean;
}

export interface MaintenanceLogData {
  vehicle_id: string;
  service_date: string;
  service_type: string;
  description: string;
  cost: number;
  odometer?: number;
  provider?: string;
  notes?: string;
}

export interface TripLogData {
  vehicle_id: string;
  trip_name: string;
  start_time: string;
  end_time?: string;
  distance_km?: number;
  trip_type: 'on-road' | 'off-road' | 'mixed';
  notes?: string;
  tracking_method?: string;
}

export type LogData = FuelLogData | MaintenanceLogData | TripLogData;

export interface OfflineEntry<T = LogData> {
  id: string;
  type: LogType;
  data: T;
  status: SyncStatus;
  createdAt: string;
  syncAttempts: number;
  lastSyncAttempt?: string;
  errorMessage?: string;
  userId: string;
  vehicleId: string;
}

interface VehicleLogsDB extends DBSchema {
  'vehicle-logs': {
    key: string;
    value: OfflineEntry;
    indexes: {
      'by-status': SyncStatus;
      'by-type': LogType;
      'by-vehicle': string;
      'by-user': string;
      'by-created': string;
    };
  };
  'last-values': {
    key: string;
    value: {
      vehicleId: string;
      lastOdometer: number;
      lastFuelPrice: number;
      lastFuelType: string;
      lastFuelStation: string;
      lastCurrency: string;
      updatedAt: string;
    };
  };
}

const DB_NAME = 'unimog-vehicle-logs';
const DB_VERSION = 1;

let db: IDBPDatabase<VehicleLogsDB> | null = null;

class OfflineQueueServiceClass {
  private onlineListener: (() => void) | null = null;
  private syncInProgress = false;
  private syncCallbacks: Set<() => void> = new Set();

  async init(): Promise<IDBPDatabase<VehicleLogsDB>> {
    if (db) return db;

    db = await openDB<VehicleLogsDB>(DB_NAME, DB_VERSION, {
      upgrade(database) {
        if (!database.objectStoreNames.contains('vehicle-logs')) {
          const store = database.createObjectStore('vehicle-logs', { keyPath: 'id' });
          store.createIndex('by-status', 'status');
          store.createIndex('by-type', 'type');
          store.createIndex('by-vehicle', 'vehicleId');
          store.createIndex('by-user', 'userId');
          store.createIndex('by-created', 'createdAt');
        }

        if (!database.objectStoreNames.contains('last-values')) {
          database.createObjectStore('last-values', { keyPath: 'vehicleId' });
        }
      },
    });

    this.setupOnlineListener();
    return db;
  }

  private setupOnlineListener() {
    if (this.onlineListener) return;

    this.onlineListener = async () => {
      if (navigator.onLine) {
        await this.syncPending();
      }
    };

    window.addEventListener('online', this.onlineListener);
  }

  async addEntry<T extends LogData>(
    type: LogType,
    data: T,
    userId: string,
    vehicleId: string
  ): Promise<OfflineEntry<T>> {
    const database = await this.init();

    const entry: OfflineEntry<T> = {
      id: uuidv4(),
      type,
      data,
      status: 'pending',
      createdAt: new Date().toISOString(),
      syncAttempts: 0,
      userId,
      vehicleId,
    };

    await database.put('vehicle-logs', entry as OfflineEntry);

    if (type === 'fuel') {
      const fuelData = data as FuelLogData;
      await this.updateLastValues(vehicleId, {
        lastOdometer: fuelData.odometer,
        lastFuelPrice: fuelData.fuel_price_per_unit,
        lastFuelType: fuelData.fuel_type,
        lastFuelStation: fuelData.fuel_station || '',
        lastCurrency: fuelData.currency,
      });
    }

    if (navigator.onLine) {
      this.syncPending();
    }

    return entry;
  }

  async getEntry(id: string): Promise<OfflineEntry | undefined> {
    const database = await this.init();
    return database.get('vehicle-logs', id);
  }

  async getPendingEntries(): Promise<OfflineEntry[]> {
    const database = await this.init();
    return database.getAllFromIndex('vehicle-logs', 'by-status', 'pending');
  }

  async getEntriesByVehicle(vehicleId: string): Promise<OfflineEntry[]> {
    const database = await this.init();
    return database.getAllFromIndex('vehicle-logs', 'by-vehicle', vehicleId);
  }

  async getEntriesByUser(userId: string): Promise<OfflineEntry[]> {
    const database = await this.init();
    return database.getAllFromIndex('vehicle-logs', 'by-user', userId);
  }

  async updateEntryStatus(
    id: string,
    status: SyncStatus,
    errorMessage?: string
  ): Promise<void> {
    const database = await this.init();
    const entry = await database.get('vehicle-logs', id);

    if (entry) {
      entry.status = status;
      entry.lastSyncAttempt = new Date().toISOString();
      if (status === 'failed') {
        entry.syncAttempts += 1;
        entry.errorMessage = errorMessage;
      }
      await database.put('vehicle-logs', entry);
      this.notifySyncCallbacks();
    }
  }

  async deleteEntry(id: string): Promise<void> {
    const database = await this.init();
    await database.delete('vehicle-logs', id);
    this.notifySyncCallbacks();
  }

  async deleteSyncedEntries(): Promise<void> {
    const database = await this.init();
    const synced = await database.getAllFromIndex('vehicle-logs', 'by-status', 'synced');
    const tx = database.transaction('vehicle-logs', 'readwrite');

    await Promise.all([
      ...synced.map(entry => tx.store.delete(entry.id)),
      tx.done,
    ]);
  }

  async getLastValues(vehicleId: string) {
    const database = await this.init();
    return database.get('last-values', vehicleId);
  }

  private async updateLastValues(
    vehicleId: string,
    values: Partial<{
      lastOdometer: number;
      lastFuelPrice: number;
      lastFuelType: string;
      lastFuelStation: string;
      lastCurrency: string;
    }>
  ) {
    const database = await this.init();
    const existing = await database.get('last-values', vehicleId);

    const updated = {
      vehicleId,
      lastOdometer: values.lastOdometer ?? existing?.lastOdometer ?? 0,
      lastFuelPrice: values.lastFuelPrice ?? existing?.lastFuelPrice ?? 0,
      lastFuelType: values.lastFuelType ?? existing?.lastFuelType ?? 'diesel',
      lastFuelStation: values.lastFuelStation ?? existing?.lastFuelStation ?? '',
      lastCurrency: values.lastCurrency ?? existing?.lastCurrency ?? 'EUR',
      updatedAt: new Date().toISOString(),
    };

    await database.put('last-values', updated);
  }

  async syncPending(): Promise<{ synced: number; failed: number }> {
    if (this.syncInProgress) {
      return { synced: 0, failed: 0 };
    }

    this.syncInProgress = true;
    let synced = 0;
    let failed = 0;

    try {
      const pending = await this.getPendingEntries();

      for (const entry of pending) {
        if (entry.syncAttempts >= 5) {
          await this.updateEntryStatus(entry.id, 'failed', 'Max retry attempts reached');
          failed++;
          continue;
        }

        await this.updateEntryStatus(entry.id, 'syncing');

        try {
          await this.syncEntryToSupabase(entry);
          await this.updateEntryStatus(entry.id, 'synced');
          synced++;
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : 'Unknown error';
          await this.updateEntryStatus(entry.id, 'pending', errorMsg);
          failed++;
        }
      }
    } finally {
      this.syncInProgress = false;
      this.notifySyncCallbacks();
    }

    return { synced, failed };
  }

  private async syncEntryToSupabase(entry: OfflineEntry): Promise<void> {
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase configuration missing');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    switch (entry.type) {
      case 'fuel': {
        const fuelData = entry.data as FuelLogData;
        const { error } = await supabase.from('fuel_logs').insert({
          ...fuelData,
          user_id: entry.userId,
          created_at: entry.createdAt,
        });
        if (error) throw error;
        break;
      }
      case 'maintenance': {
        const maintenanceData = entry.data as MaintenanceLogData;
        const { error } = await supabase.from('maintenance_records').insert({
          ...maintenanceData,
          user_id: entry.userId,
          created_at: entry.createdAt,
        });
        if (error) throw error;
        break;
      }
      case 'trip': {
        const tripData = entry.data as TripLogData;
        const { error } = await supabase.from('trip_logs').insert({
          ...tripData,
          user_id: entry.userId,
          tracking_method: tripData.tracking_method || 'manual',
          created_at: entry.createdAt,
        });
        if (error) throw error;
        break;
      }
    }
  }

  onSyncChange(callback: () => void): () => void {
    this.syncCallbacks.add(callback);
    return () => this.syncCallbacks.delete(callback);
  }

  private notifySyncCallbacks() {
    this.syncCallbacks.forEach(cb => cb());
  }

  async getStats(): Promise<{
    pending: number;
    syncing: number;
    synced: number;
    failed: number;
    total: number;
  }> {
    const database = await this.init();
    const all = await database.getAll('vehicle-logs');

    return {
      pending: all.filter(e => e.status === 'pending').length,
      syncing: all.filter(e => e.status === 'syncing').length,
      synced: all.filter(e => e.status === 'synced').length,
      failed: all.filter(e => e.status === 'failed').length,
      total: all.length,
    };
  }

  async clearAll(): Promise<void> {
    const database = await this.init();
    await database.clear('vehicle-logs');
    await database.clear('last-values');
  }

  isOnline(): boolean {
    return navigator.onLine;
  }

  destroy() {
    if (this.onlineListener) {
      window.removeEventListener('online', this.onlineListener);
      this.onlineListener = null;
    }
    this.syncCallbacks.clear();
  }
}

export const OfflineQueueService = new OfflineQueueServiceClass();
