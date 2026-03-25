import { useState, useEffect } from 'react';
import { VehicleService } from '@/services/vehicleService';

interface FuelDataPoint {
  month: string;
  consumption: number;
  cost: number;
  efficiency: number;
}

interface MaintenanceDataPoint {
  category: string;
  cost: number;
  items: number;
  lastService: string;
}

interface VehicleStats {
  totalDistance: number;
  avgFuelEfficiency: number;
  totalFuelCost: number;
  totalMaintenanceCost: number;
  lastServiceDate: string;
  nextServiceDue: string;
}

export const useVehicleData = (userId?: string, vehicleId?: string) => {
  const [fuelData, setFuelData] = useState<FuelDataPoint[]>([]);
  const [maintenanceData, setMaintenanceData] = useState<MaintenanceDataPoint[]>([]);
  const [vehicleStats, setVehicleStats] = useState<VehicleStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchVehicleData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get user's vehicles
        const vehicles = await VehicleService.getUserVehicles(userId);

        if (!vehicles || vehicles.length === 0) {
          setIsLoading(false);
          return;
        }

        // Use specified vehicle or first vehicle
        const targetVehicle = vehicleId
          ? vehicles.find(v => v.id === vehicleId)
          : vehicles[0];

        if (!targetVehicle) {
          setIsLoading(false);
          return;
        }

        // Fetch fuel logs (reverse order then reverse back to get ascending chronological order)
        const fuelLogs = await VehicleService.getFuelLogs(targetVehicle.id, 100);
        const fuelLogsAscending = fuelLogs.reverse(); // VehicleService returns descending, we need ascending

        // Fetch maintenance logs (reverse order then reverse back to get ascending chronological order)
        const maintenanceLogs = await VehicleService.getServiceHistory(targetVehicle.id);
        const maintenanceLogsAscending = maintenanceLogs.reverse(); // VehicleService returns descending, we need ascending

        // Process fuel data by month
        const processedFuelData = processFuelDataByMonth(fuelLogsAscending || []);

        // Process maintenance data by category
        const processedMaintenanceData = processMaintenanceDataByCategory(maintenanceLogsAscending || []);

        // Calculate vehicle stats
        const stats = calculateVehicleStats(targetVehicle, fuelLogsAscending || [], maintenanceLogsAscending || []);

        setFuelData(processedFuelData);
        setMaintenanceData(processedMaintenanceData);
        setVehicleStats(stats);

      } catch (err) {
        console.error('Error fetching vehicle data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch vehicle data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicleData();
  }, [userId, vehicleId]);

  return {
    fuelData,
    maintenanceData,
    vehicleStats,
    isLoading,
    error
  };
};

// Helper functions
function processFuelDataByMonth(fuelLogs: any[]): FuelDataPoint[] {
  if (fuelLogs.length === 0) {
    return [];
  }

  const monthlyData: { [key: string]: { consumption: number; cost: number; distance: number } } = {};

  fuelLogs.forEach(log => {
    const monthKey = new Date(log.fill_date).toLocaleDateString('en', { month: 'short' });

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { consumption: 0, cost: 0, distance: 0 };
    }

    monthlyData[monthKey].consumption += parseFloat(log.fuel_amount || '0');
    monthlyData[monthKey].cost += parseFloat(log.total_cost || '0');
  });

  return Object.entries(monthlyData).map(([month, data]) => ({
    month,
    consumption: Math.round(data.consumption * 10) / 10,
    cost: Math.round(data.cost),
    efficiency: data.consumption > 0 ? Math.round((100 / (data.consumption > 0 ? data.consumption : 1)) * 10) / 10 : 0
  }));
}

function processMaintenanceDataByCategory(maintenanceLogs: any[]): MaintenanceDataPoint[] {
  if (maintenanceLogs.length === 0) {
    return [];
  }

  const categoryData: { [key: string]: { cost: number; items: number; lastService: string } } = {};

  maintenanceLogs.forEach(log => {
    const category = categorizeMaintenance(log.service_type);

    if (!categoryData[category]) {
      categoryData[category] = { cost: 0, items: 0, lastService: log.service_date };
    }

    categoryData[category].cost += parseFloat(log.cost || '0');
    categoryData[category].items += 1;

    // Keep the most recent service date
    if (new Date(log.service_date) > new Date(categoryData[category].lastService)) {
      categoryData[category].lastService = log.service_date;
    }
  });

  return Object.entries(categoryData).map(([category, data]) => ({
    category,
    cost: Math.round(data.cost),
    items: data.items,
    lastService: data.lastService
  }));
}

function categorizeMaintenance(serviceType: string): string {
  const type = serviceType.toLowerCase();

  if (type.includes('oil') || type.includes('engine') || type.includes('filter')) {
    return 'Engine';
  } else if (type.includes('brake') || type.includes('pad')) {
    return 'Brakes';
  } else if (type.includes('tire') || type.includes('wheel')) {
    return 'Tires';
  } else if (type.includes('transmission') || type.includes('gearbox')) {
    return 'Transmission';
  } else if (type.includes('hydraulic') || type.includes('pump')) {
    return 'Hydraulics';
  } else {
    return 'General';
  }
}

function calculateVehicleStats(vehicle: any, fuelLogs: any[], maintenanceLogs: any[]): VehicleStats {
  const totalFuelCost = fuelLogs.reduce((sum, log) => sum + parseFloat(log.total_cost || '0'), 0);
  const totalMaintenanceCost = maintenanceLogs.reduce((sum, log) => sum + parseFloat(log.cost || '0'), 0);

  const totalFuelAmount = fuelLogs.reduce((sum, log) => sum + parseFloat(log.fuel_amount || '0'), 0);
  // Calculate L/100km: need distance between fill-ups
  // Use consecutive odometer readings to get actual distance driven
  let totalDistance = 0;
  const sortedLogs = [...fuelLogs].sort((a, b) => a.odometer - b.odometer);
  if (sortedLogs.length >= 2) {
    totalDistance = sortedLogs[sortedLogs.length - 1].odometer - sortedLogs[0].odometer;
  }
  const avgFuelEfficiency = totalDistance > 0 && totalFuelAmount > 0
    ? (totalFuelAmount / totalDistance) * 100  // L/100km
    : 0;

  const lastMaintenance = maintenanceLogs.length > 0
    ? maintenanceLogs.sort((a, b) => new Date(b.service_date).getTime() - new Date(a.service_date).getTime())[0]
    : null;

  const lastServiceDate = lastMaintenance ? lastMaintenance.service_date : '';

  // Calculate next service (rough estimate)
  const nextServiceDate = new Date(lastServiceDate);
  nextServiceDate.setMonth(nextServiceDate.getMonth() + 3);

  return {
    totalDistance: vehicle.current_odometer || 0,
    avgFuelEfficiency: Math.round(avgFuelEfficiency * 10) / 10,
    totalFuelCost: Math.round(totalFuelCost),
    totalMaintenanceCost: Math.round(totalMaintenanceCost),
    lastServiceDate,
    nextServiceDue: nextServiceDate.toISOString().split('T')[0]
  };
}