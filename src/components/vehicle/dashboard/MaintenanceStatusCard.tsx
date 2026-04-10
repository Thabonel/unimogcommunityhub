import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { WifiOff, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useMaintenancePlan, MaintenanceScheduleItem } from '@/hooks/vehicle-maintenance/useMaintenancePlan';
import { cn } from '@/lib/utils';

interface MaintenanceStatusCardProps {
  vehicleId?: string;
  isOffline?: boolean;
}

function StatusBadge({ status }: { status: MaintenanceScheduleItem['status'] }) {
  if (status === 'overdue') {
    return <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />;
  }
  if (status === 'due_soon') {
    return <Clock className="h-4 w-4 text-amber-500 flex-shrink-0" />;
  }
  return <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />;
}

function formatDue(item: MaintenanceScheduleItem): string {
  if (item.status === 'overdue') {
    if (item.km_until_due !== null && item.km_until_due < 0) {
      return `Overdue by ${Math.abs(item.km_until_due).toLocaleString()} km`;
    }
    if (item.days_until_due !== null && item.days_until_due < 0) {
      return `Overdue by ${Math.abs(item.days_until_due)} days`;
    }
    return 'Overdue';
  }
  const parts: string[] = [];
  if (item.km_until_due !== null) {
    parts.push(`${item.km_until_due.toLocaleString()} km`);
  }
  if (item.days_until_due !== null) {
    parts.push(`${item.days_until_due} days`);
  }
  if (parts.length === 0 && !item.last_service_date) {
    return 'No service history';
  }
  return parts.length > 0 ? `Due in ${parts.join(' / ')}` : 'On schedule';
}

export const MaintenanceStatusCard = ({ vehicleId, isOffline = false }: MaintenanceStatusCardProps) => {
  const { schedule, isLoading } = useMaintenancePlan(vehicleId);

  const overdueCount = schedule.filter(s => s.status === 'overdue').length;
  const dueSoonCount = schedule.filter(s => s.status === 'due_soon').length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Maintenance Status
          {isOffline && (
            <span className="inline-flex items-center text-sm text-amber-600">
              <WifiOff size={16} className="mr-1" /> Offline Mode
            </span>
          )}
        </CardTitle>
        <CardDescription>
          {overdueCount > 0
            ? `${overdueCount} service${overdueCount > 1 ? 's' : ''} overdue`
            : dueSoonCount > 0
              ? `${dueSoonCount} service${dueSoonCount > 1 ? 's' : ''} due soon`
              : 'All maintenance on schedule'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isOffline ? (
          <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-md p-4">
            <p className="text-amber-800 dark:text-amber-300">
              Maintenance status is not available while offline.
            </p>
          </div>
        ) : isLoading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
        ) : schedule.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No maintenance schedule configured. Add a vehicle with odometer data to see recommendations.
          </p>
        ) : (
          <div className="space-y-3">
            {schedule.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className={cn(
                  "flex items-start gap-3 p-2 rounded-md",
                  item.status === 'overdue' && "bg-red-50 dark:bg-red-900/20",
                  item.status === 'due_soon' && "bg-amber-50 dark:bg-amber-900/20"
                )}
              >
                <StatusBadge status={item.status} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{item.description}</p>
                  <p className={cn(
                    "text-xs",
                    item.status === 'overdue' ? "text-red-600 dark:text-red-400" :
                    item.status === 'due_soon' ? "text-amber-600 dark:text-amber-400" :
                    "text-muted-foreground"
                  )}>
                    {formatDue(item)}
                  </p>
                </div>
              </div>
            ))}
            {schedule.length > 5 && (
              <p className="text-xs text-muted-foreground text-center">
                +{schedule.length - 5} more items
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
