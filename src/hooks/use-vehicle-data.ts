import { useState, useEffect } from 'react';
import { VehicleService } from '@/services/vehicleService';
import { supabase } from '@/lib/supabase-client';

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

        // Fetch fuel logs from fuel_logs table (not vehicle_fuel_logs)
        const { data: fuelLogs, error: fuelError } = await supabase
          .from('fuel_logs')
          .select('*')
          .eq('vehicle_id', targetVehicle.id)
          .order('fill_date', { ascending: true });

        if (fuelError) {
          console.error('Error fetching fuel logs:', fuelError);
        }
        const fuelLogsAscending = fuelLogs || [];

        // Fetch service logs
        const { data: maintenanceLogs, error: maintError } = await supabase
          .from('vehicle_service_logs')
          .select('*')
          .eq('vehicle_id', targetVehicle.id)
          .order('service_date', { ascending: true });

        if (maintError) {
          console.error('Error fetching service logs:', maintError);
        }
        const maintenanceLogsAscending = maintenanceLogs || [];

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

  // Calculate L/100km properly:
  // Distance = last odometer - first odometer
  // Fuel = all fill-ups EXCEPT the first (first fill's fuel was used before tracking)
  const sortedLogs = [...fuelLogs].sort((a, b) => a.odometer - b.odometer);
  let totalDistance = 0;
  let fuelForDistance = 0;
  if (sortedLogs.length >= 2) {
    totalDistance = sortedLogs[sortedLogs.length - 1].odometer - sortedLogs[0].odometer;
    // Exclude first fill-up's fuel - it was consumed before our first odometer reading
    fuelForDistance = sortedLogs.slice(1).reduce((sum, log) => sum + parseFloat(log.fuel_amount || '0'), 0);
  }
  const avgFuelEfficiency = totalDistance > 0 && fuelForDistance > 0
    ? (fuelForDistance / totalDistance) * 100  // L/100km
    : 0;

  const lastMaintenance = maintenanceLogs.length > 0
    ? maintenanceLogs.sort((a, b) => new Date(b.service_date).getTime() - new Date(a.service_date).getTime())[0]
    : null;

  const lastServiceDate = lastMaintenance ? lastMaintenance.service_date : '';

  // Calculate next service (rough estimate)
  let nextServiceDue = '';
  if (lastServiceDate) {
    const nextServiceDate = new Date(lastServiceDate);
    nextServiceDate.setMonth(nextServiceDate.getMonth() + 3);
    nextServiceDue = nextServiceDate.toISOString().split('T')[0];
  }

  return {
    totalDistance: vehicle.current_odometer || 0,
    avgFuelEfficiency: Math.round(avgFuelEfficiency * 10) / 10,
    totalFuelCost: Math.round(totalFuelCost),
    totalMaintenanceCost: Math.round(totalMaintenanceCost),
    lastServiceDate,
    nextServiceDue
  };
}