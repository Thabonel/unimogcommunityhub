
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, WifiOff } from 'lucide-react';
import { format } from 'date-fns';

interface MaintenanceHistoryCardProps {
  isOffline?: boolean;
}

export const MaintenanceHistoryCard = ({ isOffline = false }: MaintenanceHistoryCardProps) => {
  // Sample maintenance history data
  const maintenanceHistory = [
    {
      id: '1',
      date: new Date('2025-02-15'),
      type: 'Oil Change',
      odometer: 58750,
      cost: 175.50
    },
    {
      id: '2',
      date: new Date('2024-12-10'),
      type: 'Brake Service',
      odometer: 57200,
      cost: 350.75
    },
    {
      id: '3',
      date: new Date('2024-10-05'),
      type: 'Annual Inspection',
      odometer: 55800,
      cost: 225.00
    }
  ];

  return (
    <Card>
      <CardHeader className="flex flex-col space-y-1.5">
        <div className="flex items-center justify-between">
          <CardTitle>Maintenance History</CardTitle>
          {isOffline && (
            <span className="inline-flex items-center text-sm text-amber-600">
              <WifiOff size={16} className="mr-1" /> Offline Mode
            </span>
          )}
        </div>
        <CardDescription>Record of past maintenance services</CardDescription>
      </CardHeader>
      <CardContent>
        {isOffline ? (
          <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-md p-4">
            <p className="text-amber-800 dark:text-amber-300">
              Maintenance history is not available while offline.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 font-medium">Date</th>
                    <th className="text-left py-3 px-2 font-medium">Service</th>
                    <th className="text-left py-3 px-2 font-medium">Odometer</th>
                    <th className="text-right py-3 px-2 font-medium">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {maintenanceHistory.map((record) => (
                    <tr key={record.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="py-3 px-2">{format(record.date, 'MMM d, yyyy')}</td>
                      <td className="py-3 px-2">{record.type}</td>
                      <td className="py-3 px-2">{record.odometer.toLocaleString()} km</td>
                      <td className="py-3 px-2 text-right">${record.cost.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Button className="mt-4 w-full" variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Maintenance Record
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};
