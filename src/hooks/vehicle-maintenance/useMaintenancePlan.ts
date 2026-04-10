import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase-client';
import { MaintenanceType } from './types';

export interface MaintenanceScheduleItem {
  id: string;
  maintenance_type: MaintenanceType;
  description: string;
  interval_km: number | null;
  interval_months: number | null;
  last_service_date: string | null;
  last_service_km: number | null;
  next_due_date: string | null;
  next_due_km: number | null;
  status: 'overdue' | 'due_soon' | 'ok';
  days_until_due: number | null;
  km_until_due: number | null;
}

// U435/U1700L recommended maintenance intervals from workshop manual
const DEFAULT_UNIMOG_INTERVALS: Array<{
  maintenance_type: MaintenanceType;
  description: string;
  interval_km: number;
  interval_months: number;
}> = [
  { maintenance_type: 'oil_change', description: 'Engine oil and filter change', interval_km: 10000, interval_months: 12 },
  { maintenance_type: 'filter_replacement', description: 'Air filter replacement', interval_km: 20000, interval_months: 24 },
  { maintenance_type: 'fluid_change', description: 'Portal hub oil change', interval_km: 30000, interval_months: 36 },
  { maintenance_type: 'fluid_change', description: 'Transmission and transfer case oil', interval_km: 40000, interval_months: 48 },
  { maintenance_type: 'brake_service', description: 'Brake system inspection', interval_km: 20000, interval_months: 12 },
  { maintenance_type: 'fluid_change', description: 'Coolant replacement', interval_km: 60000, interval_months: 48 },
  { maintenance_type: 'filter_replacement', description: 'Fuel filter replacement', interval_km: 20000, interval_months: 24 },
  { maintenance_type: 'inspection', description: 'General inspection and grease points', interval_km: 5000, interval_months: 6 },
];

export function useMaintenancePlan(vehicleId: string | undefined) {
  const [schedule, setSchedule] = useState<MaintenanceScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateSchedule = useCallback(async () => {
    if (!vehicleId) return;

    setIsLoading(true);
    setError(null);

    try {
      const [
        { data: vehicle },
        { data: existingSchedules },
        { data: maintenanceLogs },
        { data: serviceLogs },
      ] = await Promise.all([
        supabase.from('vehicles').select('current_odometer').eq('id', vehicleId).single(),
        supabase.from('vehicle_maintenance_schedules').select('*').eq('vehicle_id', vehicleId).eq('is_active', true),
        supabase.from('maintenance_logs').select('maintenance_type, date, odometer').eq('vehicle_id', vehicleId).order('date', { ascending: false }),
        supabase.from('vehicle_service_logs').select('service_type, service_date, mileage_at_service').eq('vehicle_id', vehicleId).order('service_date', { ascending: false }),
      ]);

      const currentOdometer = vehicle?.current_odometer || 0;
      const allLogs = [
        ...(maintenanceLogs || []).map(l => ({ type: l.maintenance_type, notes: '', date: l.date, km: l.odometer || 0 })),
        ...(serviceLogs || []).map(l => ({ type: l.service_type, notes: '', date: l.service_date, km: l.mileage_at_service || 0 })),
      ];

      const now = new Date();
      const items: MaintenanceScheduleItem[] = [];

      // Use existing DB schedules if available, otherwise use defaults
      const intervals = existingSchedules && existingSchedules.length > 0
        ? existingSchedules.map((s: any) => ({
            id: s.id,
            maintenance_type: s.maintenance_type as MaintenanceType,
            description: s.description || s.maintenance_type,
            interval_km: s.interval_miles,
            interval_months: s.interval_months,
          }))
        : DEFAULT_UNIMOG_INTERVALS.map((d, i) => ({ id: `default-${i}`, ...d }));

      for (const interval of intervals) {
        // Match logs by type, preferring the most recent
        const matchingLogs = allLogs.filter(l => l.type === interval.maintenance_type);
        const lastService = matchingLogs.length > 0 ? matchingLogs[0] : null;
        const lastDate = lastService?.date ? new Date(lastService.date) : null;
        const lastKm = lastService?.km || 0;

        // Calculate next due by km
        let nextDueKm: number | null = null;
        let kmUntilDue: number | null = null;
        if (interval.interval_km && lastKm > 0) {
          nextDueKm = lastKm + interval.interval_km;
          kmUntilDue = nextDueKm - currentOdometer;
        }

        // Calculate next due by date
        let nextDueDate: Date | null = null;
        let daysUntilDue: number | null = null;
        if (interval.interval_months && lastDate) {
          nextDueDate = new Date(lastDate);
          nextDueDate.setMonth(nextDueDate.getMonth() + interval.interval_months);
          daysUntilDue = Math.ceil((nextDueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        }

        // Determine status based on whichever comes first
        let status: 'overdue' | 'due_soon' | 'ok' = 'ok';
        if ((kmUntilDue !== null && kmUntilDue <= 0) || (daysUntilDue !== null && daysUntilDue <= 0)) {
          status = 'overdue';
        } else if ((kmUntilDue !== null && kmUntilDue <= 1000) || (daysUntilDue !== null && daysUntilDue <= 30)) {
          status = 'due_soon';
        }

        items.push({
          id: interval.id,
          maintenance_type: interval.maintenance_type,
          description: interval.description,
          interval_km: interval.interval_km,
          interval_months: interval.interval_months,
          last_service_date: lastService?.date || null,
          last_service_km: lastService?.km || null,
          next_due_date: nextDueDate?.toISOString() || null,
          next_due_km: nextDueKm,
          status,
          days_until_due: daysUntilDue,
          km_until_due: kmUntilDue,
        });
      }

      // Sort: overdue first, then due_soon, then ok
      const statusOrder = { overdue: 0, due_soon: 1, ok: 2 };
      items.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);

      setSchedule(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load maintenance plan');
    } finally {
      setIsLoading(false);
    }
  }, [vehicleId]);

  useEffect(() => {
    calculateSchedule();
  }, [calculateSchedule]);

  return { schedule, isLoading, error, refresh: calculateSchedule };
}
