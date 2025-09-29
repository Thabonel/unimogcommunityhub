import { useState, useEffect } from 'react';
import { VehicleService } from '@/services/VehicleService';

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
    // Return mock data if no real data
    return [
      { month: 'Jan', consumption: 285, cost: 1140, efficiency: 8.2 },
      { month: 'Feb', consumption: 298, cost: 1192, efficiency: 7.9 },
      { month: 'Mar', consumption: 267, cost: 1068, efficiency: 8.7 },
      { month: 'Apr', consumption: 289, cost: 1156, efficiency: 8.1 },
      { month: 'May', consumption: 301, cost: 1204, efficiency: 7.8 },
      { month: 'Jun', consumption: 278, cost: 1112, efficiency: 8.4 }
    ];
  }

  const monthlyData: { [key: string]: { consumption: number; cost: number; distance: number } } = {};

  fuelLogs.forEach(log => {
    const monthKey = new Date(log.fill_date).toLocaleDateString('en', { month: 'short' });

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { consumption: 0, cost: 0, distance: 0 };
    }

    monthlyData[monthKey].consumption += parseFloat(log.fuel_amount);
    monthlyData[monthKey].cost += parseFloat(log.fuel_cost);
  });

  return Object.entries(monthlyData).map(([month, data]) => ({
    month,
    consumption: Math.round(data.consumption),
    cost: Math.round(data.cost),
    efficiency: data.distance > 0 ? Math.round((data.distance / data.consumption) * 10) / 10 : 8.0
  }));
}

function processMaintenanceDataByCategory(maintenanceLogs: any[]): MaintenanceDataPoint[] {
  if (maintenanceLogs.length === 0) {
    // Return mock data if no real data
    return [
      { category: 'Engine', cost: 1240, items: 12, lastService: '2024-01-15' },
      { category: 'Transmission', cost: 890, items: 6, lastService: '2024-02-20' },
      { category: 'Brakes', cost: 650, items: 8, lastService: '2024-01-30' },
      { category: 'Hydraulics', cost: 1520, items: 15, lastService: '2024-02-10' },
      { category: 'Tires', cost: 2100, items: 4, lastService: '2024-01-25' }
    ];
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
  const totalFuelCost = fuelLogs.reduce((sum, log) => sum + parseFloat(log.fuel_cost || '0'), 0);
  const totalMaintenanceCost = maintenanceLogs.reduce((sum, log) => sum + parseFloat(log.cost || '0'), 0);

  const totalFuelAmount = fuelLogs.reduce((sum, log) => sum + parseFloat(log.fuel_amount || '0'), 0);
  const avgFuelEfficiency = totalFuelAmount > 0 ? (vehicle.current_odometer / totalFuelAmount) : 8.5;

  const lastMaintenance = maintenanceLogs.length > 0
    ? maintenanceLogs.sort((a, b) => new Date(b.service_date).getTime() - new Date(a.service_date).getTime())[0]
    : null;

  const lastServiceDate = lastMaintenance ? lastMaintenance.service_date : '2024-01-15';

  // Calculate next service (rough estimate)
  const nextServiceDate = new Date(lastServiceDate);
  nextServiceDate.setMonth(nextServiceDate.getMonth() + 3);

  return {
    totalDistance: vehicle.current_odometer || 45200,
    avgFuelEfficiency: Math.round(avgFuelEfficiency * 10) / 10,
    totalFuelCost: Math.round(totalFuelCost),
    totalMaintenanceCost: Math.round(totalMaintenanceCost),
    lastServiceDate,
    nextServiceDue: nextServiceDate.toISOString().split('T')[0]
  };
}