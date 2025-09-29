import CryptoJS from 'crypto-js';
import type { Database } from '@/types/database.types';

type Vehicle = Database['public']['Tables']['vehicles']['Row'];
type MaintenanceSchedule = Database['public']['Tables']['maintenance_schedule']['Row'];
type ServiceLog = Database['public']['Tables']['vehicle_service_logs']['Row'];
type FuelLog = Database['public']['Tables']['vehicle_fuel_logs']['Row'];

interface LocalStorageData {
  vehicles: Vehicle[];
  maintenanceSchedules: MaintenanceSchedule[];
  serviceLogs: ServiceLog[];
  fuelLogs: FuelLog[];
  lastSynced: string;
  encryptionKey?: string;
}

interface PrivacySettings {
  privacyMode: boolean;
  encryptData: boolean;
  autoSync: boolean;
  dataRetentionDays: number;
}

export class LocalStorageService {
  private static readonly STORAGE_PREFIX = 'unimog_';
  private static readonly VEHICLES_KEY = 'vehicles';
  private static readonly MAINTENANCE_KEY = 'maintenance_schedules';
  private static readonly SERVICE_LOGS_KEY = 'service_logs';
  private static readonly FUEL_LOGS_KEY = 'fuel_logs';
  private static readonly SETTINGS_KEY = 'privacy_settings';
  private static readonly ENCRYPTION_KEY = 'encryption_key';

  // Encryption helpers
  private static getEncryptionKey(userId: string): string {
    let key = localStorage.getItem(`${this.STORAGE_PREFIX}${this.ENCRYPTION_KEY}_${userId}`);
    if (!key) {
      key = CryptoJS.lib.WordArray.random(256/8).toString();
      localStorage.setItem(`${this.STORAGE_PREFIX}${this.ENCRYPTION_KEY}_${userId}`, key);
    }
    return key;
  }

  private static encrypt(data: any, userId: string): string {
    const key = this.getEncryptionKey(userId);
    return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
  }

  private static decrypt(encryptedData: string, userId: string): any {
    try {
      const key = this.getEncryptionKey(userId);
      const bytes = CryptoJS.AES.decrypt(encryptedData, key);
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (error) {
      console.error('Decryption failed:', error);
      return null;
    }
  }

  // Settings management
  static getPrivacySettings(userId: string): PrivacySettings {
    try {
      const settings = localStorage.getItem(`${this.STORAGE_PREFIX}${this.SETTINGS_KEY}_${userId}`);
      if (settings) {
        return JSON.parse(settings);
      }
    } catch (error) {
      console.error('Error reading privacy settings:', error);
    }

    return {
      privacyMode: false,
      encryptData: true,
      autoSync: false,
      dataRetentionDays: 365
    };
  }

  static savePrivacySettings(userId: string, settings: PrivacySettings): void {
    try {
      localStorage.setItem(
        `${this.STORAGE_PREFIX}${this.SETTINGS_KEY}_${userId}`,
        JSON.stringify(settings)
      );
    } catch (error) {
      console.error('Error saving privacy settings:', error);
      throw new Error('Failed to save privacy settings');
    }
  }

  // Vehicle operations
  static getVehicles(userId: string): Vehicle[] {
    try {
      const settings = this.getPrivacySettings(userId);
      const data = localStorage.getItem(`${this.STORAGE_PREFIX}${this.VEHICLES_KEY}_${userId}`);

      if (!data) return [];

      if (settings.encryptData) {
        return this.decrypt(data, userId) || [];
      } else {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Error reading vehicles from localStorage:', error);
      return [];
    }
  }

  static saveVehicles(userId: string, vehicles: Vehicle[]): void {
    try {
      const settings = this.getPrivacySettings(userId);
      const dataToStore = settings.encryptData
        ? this.encrypt(vehicles, userId)
        : JSON.stringify(vehicles);

      localStorage.setItem(`${this.STORAGE_PREFIX}${this.VEHICLES_KEY}_${userId}`, dataToStore);
    } catch (error) {
      console.error('Error saving vehicles to localStorage:', error);
      throw new Error('Failed to save vehicles locally');
    }
  }

  static addVehicle(userId: string, vehicle: Vehicle): void {
    const vehicles = this.getVehicles(userId);
    vehicles.push(vehicle);
    this.saveVehicles(userId, vehicles);
  }

  static updateVehicle(userId: string, vehicleId: string, updates: Partial<Vehicle>): void {
    const vehicles = this.getVehicles(userId);
    const index = vehicles.findIndex(v => v.id === vehicleId);

    if (index !== -1) {
      vehicles[index] = { ...vehicles[index], ...updates };
      this.saveVehicles(userId, vehicles);
    }
  }

  static deleteVehicle(userId: string, vehicleId: string): void {
    const vehicles = this.getVehicles(userId);
    const filteredVehicles = vehicles.filter(v => v.id !== vehicleId);
    this.saveVehicles(userId, filteredVehicles);
  }

  // Maintenance schedules
  static getMaintenanceSchedules(userId: string, vehicleId?: string): MaintenanceSchedule[] {
    try {
      const settings = this.getPrivacySettings(userId);
      const data = localStorage.getItem(`${this.STORAGE_PREFIX}${this.MAINTENANCE_KEY}_${userId}`);

      if (!data) return [];

      let schedules: MaintenanceSchedule[];
      if (settings.encryptData) {
        schedules = this.decrypt(data, userId) || [];
      } else {
        schedules = JSON.parse(data);
      }

      return vehicleId ? schedules.filter(s => s.vehicle_id === vehicleId) : schedules;
    } catch (error) {
      console.error('Error reading maintenance schedules:', error);
      return [];
    }
  }

  static saveMaintenanceSchedules(userId: string, schedules: MaintenanceSchedule[]): void {
    try {
      const settings = this.getPrivacySettings(userId);
      const dataToStore = settings.encryptData
        ? this.encrypt(schedules, userId)
        : JSON.stringify(schedules);

      localStorage.setItem(`${this.STORAGE_PREFIX}${this.MAINTENANCE_KEY}_${userId}`, dataToStore);
    } catch (error) {
      console.error('Error saving maintenance schedules:', error);
      throw new Error('Failed to save maintenance schedules locally');
    }
  }

  static addMaintenanceSchedule(userId: string, schedule: MaintenanceSchedule): void {
    const schedules = this.getMaintenanceSchedules(userId);
    schedules.push(schedule);
    this.saveMaintenanceSchedules(userId, schedules);
  }

  // Service logs
  static getServiceLogs(userId: string, vehicleId?: string): ServiceLog[] {
    try {
      const settings = this.getPrivacySettings(userId);
      const data = localStorage.getItem(`${this.STORAGE_PREFIX}${this.SERVICE_LOGS_KEY}_${userId}`);

      if (!data) return [];

      let logs: ServiceLog[];
      if (settings.encryptData) {
        logs = this.decrypt(data, userId) || [];
      } else {
        logs = JSON.parse(data);
      }

      return vehicleId ? logs.filter(l => l.vehicle_id === vehicleId) : logs;
    } catch (error) {
      console.error('Error reading service logs:', error);
      return [];
    }
  }

  static saveServiceLogs(userId: string, logs: ServiceLog[]): void {
    try {
      const settings = this.getPrivacySettings(userId);
      const dataToStore = settings.encryptData
        ? this.encrypt(logs, userId)
        : JSON.stringify(logs);

      localStorage.setItem(`${this.STORAGE_PREFIX}${this.SERVICE_LOGS_KEY}_${userId}`, dataToStore);
    } catch (error) {
      console.error('Error saving service logs:', error);
      throw new Error('Failed to save service logs locally');
    }
  }

  static addServiceLog(userId: string, log: ServiceLog): void {
    const logs = this.getServiceLogs(userId);
    logs.push(log);
    this.saveServiceLogs(userId, logs);
  }

  // Fuel logs
  static getFuelLogs(userId: string, vehicleId?: string): FuelLog[] {
    try {
      const settings = this.getPrivacySettings(userId);
      const data = localStorage.getItem(`${this.STORAGE_PREFIX}${this.FUEL_LOGS_KEY}_${userId}`);

      if (!data) return [];

      let logs: FuelLog[];
      if (settings.encryptData) {
        logs = this.decrypt(data, userId) || [];
      } else {
        logs = JSON.parse(data);
      }

      return vehicleId ? logs.filter(l => l.vehicle_id === vehicleId) : logs;
    } catch (error) {
      console.error('Error reading fuel logs:', error);
      return [];
    }
  }

  static saveFuelLogs(userId: string, logs: FuelLog[]): void {
    try {
      const settings = this.getPrivacySettings(userId);
      const dataToStore = settings.encryptData
        ? this.encrypt(logs, userId)
        : JSON.stringify(logs);

      localStorage.setItem(`${this.STORAGE_PREFIX}${this.FUEL_LOGS_KEY}_${userId}`, dataToStore);
    } catch (error) {
      console.error('Error saving fuel logs:', error);
      throw new Error('Failed to save fuel logs locally');
    }
  }

  static addFuelLog(userId: string, log: FuelLog): void {
    const logs = this.getFuelLogs(userId);
    logs.push(log);
    this.saveFuelLogs(userId, logs);
  }

  // Data management
  static exportData(userId: string): LocalStorageData {
    return {
      vehicles: this.getVehicles(userId),
      maintenanceSchedules: this.getMaintenanceSchedules(userId),
      serviceLogs: this.getServiceLogs(userId),
      fuelLogs: this.getFuelLogs(userId),
      lastSynced: new Date().toISOString()
    };
  }

  static importData(userId: string, data: LocalStorageData): void {
    try {
      this.saveVehicles(userId, data.vehicles || []);
      this.saveMaintenanceSchedules(userId, data.maintenanceSchedules || []);
      this.saveServiceLogs(userId, data.serviceLogs || []);
      this.saveFuelLogs(userId, data.fuelLogs || []);
    } catch (error) {
      console.error('Error importing data:', error);
      throw new Error('Failed to import data');
    }
  }

  static clearAllData(userId: string): void {
    try {
      const keys = [
        `${this.STORAGE_PREFIX}${this.VEHICLES_KEY}_${userId}`,
        `${this.STORAGE_PREFIX}${this.MAINTENANCE_KEY}_${userId}`,
        `${this.STORAGE_PREFIX}${this.SERVICE_LOGS_KEY}_${userId}`,
        `${this.STORAGE_PREFIX}${this.FUEL_LOGS_KEY}_${userId}`,
        `${this.STORAGE_PREFIX}${this.SETTINGS_KEY}_${userId}`,
        `${this.STORAGE_PREFIX}${this.ENCRYPTION_KEY}_${userId}`
      ];

      keys.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Error clearing local data:', error);
      throw new Error('Failed to clear local data');
    }
  }

  // Storage management
  static getStorageUsage(): { used: number; total: number; percentage: number } {
    let used = 0;
    const total = 5 * 1024 * 1024; // 5MB typical localStorage limit

    try {
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key) && key.startsWith(this.STORAGE_PREFIX)) {
          used += localStorage[key].length;
        }
      }
    } catch (error) {
      console.error('Error calculating storage usage:', error);
    }

    return {
      used,
      total,
      percentage: Math.round((used / total) * 100)
    };
  }

  static cleanupOldData(userId: string): void {
    try {
      const settings = this.getPrivacySettings(userId);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - settings.dataRetentionDays);

      // Clean up old service logs
      const serviceLogs = this.getServiceLogs(userId);
      const filteredServiceLogs = serviceLogs.filter(log =>
        new Date(log.created_at) > cutoffDate
      );
      this.saveServiceLogs(userId, filteredServiceLogs);

      // Clean up old fuel logs
      const fuelLogs = this.getFuelLogs(userId);
      const filteredFuelLogs = fuelLogs.filter(log =>
        new Date(log.created_at) > cutoffDate
      );
      this.saveFuelLogs(userId, filteredFuelLogs);

      console.log(`Cleaned up data older than ${settings.dataRetentionDays} days`);
    } catch (error) {
      console.error('Error cleaning up old data:', error);
    }
  }

  // Privacy mode helpers
  static enablePrivacyMode(userId: string): void {
    const settings = this.getPrivacySettings(userId);
    settings.privacyMode = true;
    this.savePrivacySettings(userId, settings);
  }

  static disablePrivacyMode(userId: string): void {
    const settings = this.getPrivacySettings(userId);
    settings.privacyMode = false;
    this.savePrivacySettings(userId, settings);
  }

  static isPrivacyModeEnabled(userId: string): boolean {
    return this.getPrivacySettings(userId).privacyMode;
  }
}

export default LocalStorageService;