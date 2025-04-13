import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FuelLog } from './types';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export const useFuelLogs = (vehicleId?: string) => {
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  // Fetch fuel logs for a specific vehicle or all user vehicles
  const fetchFuelLogs = useCallback(async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError(null);

      let query = supabase
        .from('fuel_logs')
        .select('*')
        .order('fill_date', { ascending: false });
      
      if (vehicleId) {
        query = query.eq('vehicle_id', vehicleId);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw new Error(fetchError.message);
      
      setFuelLogs(data as FuelLog[]);
    } catch (err) {
      console.error('Error fetching fuel logs:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch fuel logs'));
    } finally {
      setIsLoading(false);
    }
  }, [vehicleId, user]);

  // Add a new fuel log
  const addFuelLog = useCallback(async (fuelLog: Omit<FuelLog, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return { success: false, error: 'Not authenticated' };
    
    try {
      const newLog = {
        ...fuelLog,
        user_id: user.id
      };
      
      const { data, error: insertError } = await supabase
        .from('fuel_logs')
        .insert(newLog)
        .select()
        .single();
      
      if (insertError) throw new Error(insertError.message);
      
      setFuelLogs(prev => [data as FuelLog, ...prev]);
      return { success: true, data };
    } catch (err) {
      console.error('Error adding fuel log:', err);
      toast.error('Failed to add fuel log');
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to add fuel log' 
      };
    }
  }, [user]);

  // Update an existing fuel log
  const updateFuelLog = useCallback(async (id: string, updates: Partial<Omit<FuelLog, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('fuel_logs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (updateError) throw new Error(updateError.message);
      
      setFuelLogs(prev => 
        prev.map(log => log.id === id ? { ...log, ...data } as FuelLog : log)
      );
      
      return { success: true, data };
    } catch (err) {
      console.error('Error updating fuel log:', err);
      toast.error('Failed to update fuel log');
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to update fuel log' 
      };
    }
  }, []);

  // Delete a fuel log
  const deleteFuelLog = useCallback(async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('fuel_logs')
        .delete()
        .eq('id', id);
      
      if (deleteError) throw new Error(deleteError.message);
      
      setFuelLogs(prev => prev.filter(log => log.id !== id));
      return { success: true };
    } catch (err) {
      console.error('Error deleting fuel log:', err);
      toast.error('Failed to delete fuel log');
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to delete fuel log' 
      };
    }
  }, []);

  // Calculate fuel efficiency statistics
  const calculateFuelStats = useCallback((logs: FuelLog[]) => {
    if (!logs || logs.length === 0) {
      return {
        totalCost: 0,
        totalFuel: 0,
        avgEfficiency: 0,
        avgCostPerUnit: 0,
        avgCostPerDistance: 0,
        fuelLogs: []
      };
    }

    // Sort logs by odometer reading (ascending)
    const sortedLogs = [...logs].sort((a, b) => a.odometer - b.odometer);
    
    let totalCost = 0;
    let totalFuel = 0;
    let prevOdometer: number | null = null;
    const logsWithEfficiency = sortedLogs.map((log, index) => {
      // Calculate distance since last fill-up
      const distance = prevOdometer !== null ? log.odometer - prevOdometer : 0;
      
      // Calculate efficiency if not the first log
      const efficiency = index > 0 && log.full_tank ? distance / log.fuel_amount : null;
      
      // Update for next iteration
      prevOdometer = log.odometer;
      
      // Update totals
      totalCost += log.total_cost;
      totalFuel += log.fuel_amount;
      
      return {
        ...log,
        distance,
        efficiency
      };
    });

    // Calculate averages across all logs
    const validEfficiencyLogs = logsWithEfficiency.filter(log => log.efficiency !== null);
    const avgEfficiency = validEfficiencyLogs.length > 0 
      ? validEfficiencyLogs.reduce((sum, log) => sum + (log.efficiency || 0), 0) / validEfficiencyLogs.length
      : 0;
    
    const avgCostPerUnit = totalFuel > 0 ? totalCost / totalFuel : 0;
    
    // Calculate total distance
    const totalDistance = logsWithEfficiency.reduce((sum, log) => sum + (log.distance || 0), 0);
    const avgCostPerDistance = totalDistance > 0 ? totalCost / totalDistance : 0;
    
    return {
      totalCost,
      totalFuel,
      avgEfficiency,
      avgCostPerUnit,
      avgCostPerDistance,
      fuelLogs: logsWithEfficiency
    };
  }, []);

  return {
    fuelLogs,
    isLoading,
    error,
    fetchFuelLogs,
    addFuelLog,
    updateFuelLog,
    deleteFuelLog,
    calculateFuelStats,
  };
};
