import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Fuel,
  Wrench,
  Gauge,
  AlertTriangle,
  TrendingUp,
  Plus,
  Car,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useVehicles } from '@/hooks/vehicle-maintenance/use-vehicles';
import { VehicleService } from '@/services/vehicleService';
import { MaintenanceRecordModal } from '@/components/vehicle/maintenance/MaintenanceRecordModal';
import FuelLogForm, { FuelLogFormValues } from '@/components/vehicle/fuel/FuelLogForm';
import { useFuelLogs, calculateFuelEfficiency } from '@/hooks/vehicle-maintenance/use-fuel-logs';
import { toast } from 'sonner';

interface VehicleStats {
  fuelEfficiency: number;
  totalMiles: number;
  lastServiceDate?: string;
  nextMaintenanceDue?: string;
  upcomingMaintenanceCount: number;
  totalOperatingCost: number;
}

export function VehicleStatsCard() {
  const { user } = useAuth();
  const { vehicles, isLoading: vehiclesLoading } = useVehicles(user?.id);
  const [stats, setStats] = useState<VehicleStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [showFuelModal, setShowFuelModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const { fuelLogs, addFuelLog, fetchFuelLogs } = useFuelLogs();

  const primaryVehicle = vehicles?.[0];

  // Fetch fuel logs when vehicle is available
  useEffect(() => {
    if (primaryVehicle) {
      fetchFuelLogs();
    }
  }, [primaryVehicle, fetchFuelLogs]);

  // Calculate stats from fuel logs using single source of truth
  useEffect(() => {
    async function loadStats() {
      if (!primaryVehicle) return;

      setStatsLoading(true);
      try {
        // Use the single fuel efficiency calculator
        const fuelStats = calculateFuelEfficiency(fuelLogs);

        // Get maintenance data separately
        const serviceLogs = await VehicleService.getServiceHistory(primaryVehicle.id);
        const maintenanceSchedules = await VehicleService.getMaintenanceSchedules(primaryVehicle.id);

        const totalServiceCost = serviceLogs.reduce((sum, log) => sum + (log.cost || 0), 0);
        const lastService = serviceLogs[0];
        const upcomingMaintenance = maintenanceSchedules.filter(schedule =>
          schedule.next_due_date && new Date(schedule.next_due_date) > new Date()
        );

        // Calculate distance from fuel logs
        const sortedLogs = [...fuelLogs].sort((a, b) => a.odometer - b.odometer);
        const totalDistance = sortedLogs.length >= 2
          ? sortedLogs[sortedLogs.length - 1].odometer - sortedLogs[0].odometer
          : 0;

        setStats({
          fuelEfficiency: fuelStats.avgLper100km,
          totalMiles: totalDistance,
          totalOperatingCost: fuelStats.totalCost + totalServiceCost,
          lastServiceDate: lastService?.service_date,
          upcomingMaintenanceCount: upcomingMaintenance.length,
          nextMaintenanceDue: upcomingMaintenance[0]?.next_due_date,
        });
      } catch (error) {
        console.error('Failed to load vehicle stats:', error);
      } finally {
        setStatsLoading(false);
      }
    }

    loadStats();
  }, [primaryVehicle, fuelLogs]);

  const handleFuelLogSubmit = async (data: FuelLogFormValues) => {
    const result = await addFuelLog({
      vehicle_id: data.vehicle_id,
      odometer: data.odometer,
      fill_date: data.fill_date.toISOString(),
      fuel_amount: data.fuel_amount,
      fuel_price_per_unit: data.fuel_price_per_unit,
      total_cost: data.total_cost,
      fuel_type: data.fuel_type,
      fuel_station: data.fuel_station,
      currency: data.currency,
      notes: data.notes,
      full_tank: data.full_tank
    });

    if (result.success) {
      toast.success('Fuel log added successfully');
      setShowFuelModal(false);
      fetchFuelLogs(); // Refresh triggers stats recalculation
    }
  };

  const handleFuelModalOpen = useCallback(() => {
    if (vehiclesLoading) {
      toast.info('Loading vehicle data...');
      return;
    }
    if (!vehicles || vehicles.length === 0) {
      toast.error('Please add a vehicle first');
      return;
    }
    setShowFuelModal(true);
  }, [vehiclesLoading, vehicles]);

  const handleMaintenanceAdded = async () => {
    fetchFuelLogs(); // Refresh triggers stats recalculation
  };

  // Loading state
  if (vehiclesLoading) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // No vehicle - show prompt to add one
  if (!primaryVehicle) {
    return (
      <Card className="mb-6 border-dashed border-2 border-military-green/30 bg-military-green/5">
        <CardContent className="py-8">
          <div className="text-center">
            <Car className="h-12 w-12 mx-auto mb-4 text-military-green" />
            <h3 className="text-lg font-semibold mb-2">Add Your Unimog</h3>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
              Track fuel consumption, maintenance schedules, and build your ownership history.
            </p>
            <Link to="/profile?tab=vehicles">
              <Button className="bg-military-green hover:bg-military-green/90">
                <Plus className="mr-2 h-4 w-4" />
                Add Your Vehicle
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Not set';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getDaysUntilMaintenance = () => {
    if (!stats?.nextMaintenanceDue) return null;
    const dueDate = new Date(stats.nextMaintenanceDue);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilMaintenance = getDaysUntilMaintenance();
  const isMaintenanceOverdue = daysUntilMaintenance !== null && daysUntilMaintenance < 0;
  const isMaintenanceSoon = daysUntilMaintenance !== null && daysUntilMaintenance <= 14 && daysUntilMaintenance >= 0;

  return (
    <>
      <Card className="mb-6 border-military-green/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {primaryVehicle.thumbnail_url ? (
                <img
                  src={primaryVehicle.thumbnail_url}
                  alt={primaryVehicle.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-military-green/10 flex items-center justify-center">
                  <Car className="h-6 w-6 text-military-green" />
                </div>
              )}
              <div>
                <CardTitle className="text-lg">{primaryVehicle.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {primaryVehicle.model} {primaryVehicle.year}
                  {primaryVehicle.current_odometer > 0 && (
                    <span className="ml-2">
                      {primaryVehicle.current_odometer.toLocaleString()} {primaryVehicle.odometer_unit}
                    </span>
                  )}
                </p>
              </div>
            </div>
            <Link to="/full-vehicle-dashboard">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                Full Dashboard
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>

        <CardContent>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {/* Fuel Efficiency */}
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Fuel className="h-4 w-4" />
                <span>Fuel Efficiency</span>
              </div>
              {statsLoading ? (
                <Skeleton className="h-6 w-16" />
              ) : (
                <p className="text-xl font-semibold">
                  {stats?.fuelEfficiency ? `${stats.fuelEfficiency.toFixed(1)} L/100km` : '-- L/100km'}
                </p>
              )}
            </div>

            {/* Total Distance */}
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Gauge className="h-4 w-4" />
                <span>Distance Tracked</span>
              </div>
              {statsLoading ? (
                <Skeleton className="h-6 w-20" />
              ) : (
                <p className="text-xl font-semibold">
                  {stats?.totalMiles ? `${stats.totalMiles.toLocaleString()} km` : '-- km'}
                </p>
              )}
            </div>

            {/* Last Service */}
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Wrench className="h-4 w-4" />
                <span>Last Service</span>
              </div>
              {statsLoading ? (
                <Skeleton className="h-6 w-24" />
              ) : (
                <p className="text-lg font-semibold">
                  {formatDate(stats?.lastServiceDate)}
                </p>
              )}
            </div>

            {/* Next Maintenance */}
            <div className={`rounded-lg p-3 ${
              isMaintenanceOverdue ? 'bg-red-100 dark:bg-red-900/20' :
              isMaintenanceSoon ? 'bg-yellow-100 dark:bg-yellow-900/20' :
              'bg-muted/50'
            }`}>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                {isMaintenanceOverdue || isMaintenanceSoon ? (
                  <AlertTriangle className={`h-4 w-4 ${isMaintenanceOverdue ? 'text-red-500' : 'text-yellow-500'}`} />
                ) : (
                  <TrendingUp className="h-4 w-4" />
                )}
                <span>Next Due</span>
              </div>
              {statsLoading ? (
                <Skeleton className="h-6 w-24" />
              ) : (
                <p className={`text-lg font-semibold ${
                  isMaintenanceOverdue ? 'text-red-600' :
                  isMaintenanceSoon ? 'text-yellow-600' : ''
                }`}>
                  {stats?.nextMaintenanceDue ? (
                    isMaintenanceOverdue ? 'Overdue!' :
                    daysUntilMaintenance === 0 ? 'Today' :
                    daysUntilMaintenance === 1 ? 'Tomorrow' :
                    `${daysUntilMaintenance} days`
                  ) : 'Not set'}
                </p>
              )}
            </div>
          </div>

          {/* Quick Add Buttons */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <Button
              variant="outline"
              className="w-full min-w-0 px-2 sm:px-4 text-xs sm:text-sm"
              disabled={vehiclesLoading || !vehicles || vehicles.length === 0}
              onClick={handleFuelModalOpen}
            >
              {vehiclesLoading ? (
                <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
              ) : (
                <Fuel className="h-4 w-4 shrink-0" />
              )}
              <span className="truncate">
                {vehiclesLoading ? 'Loading...' : 'Log Fuel'}
              </span>
            </Button>
            <Button
              variant="outline"
              className="w-full min-w-0 px-2 sm:px-4 text-xs sm:text-sm"
              onClick={() => setShowMaintenanceModal(true)}
            >
              <Wrench className="h-4 w-4 shrink-0" />
              <span className="truncate">Log Service</span>
            </Button>
            <Link to="/fuel-tracking" className="w-full min-w-0">
              <Button variant="ghost" className="w-full min-w-0 px-2 sm:px-4 text-xs sm:text-sm">
                <span className="truncate">History</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Fuel Log Modal */}
      <Dialog open={showFuelModal} onOpenChange={setShowFuelModal}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Fuel Log</DialogTitle>
          </DialogHeader>
          <FuelLogForm
            vehicles={vehicles || []}
            isLoadingVehicles={vehiclesLoading}
            onSubmit={handleFuelLogSubmit}
            onCancel={() => setShowFuelModal(false)}
            initialValues={{
              vehicle_id: primaryVehicle?.id,
              odometer: primaryVehicle?.current_odometer || 0
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Maintenance Modal */}
      {primaryVehicle && (
        <MaintenanceRecordModal
          isOpen={showMaintenanceModal}
          onOpenChange={setShowMaintenanceModal}
          vehicleId={primaryVehicle.id}
          onRecordAdded={handleMaintenanceAdded}
        />
      )}
    </>
  );
}
