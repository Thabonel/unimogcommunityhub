
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export const MaintenanceHistoryCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Maintenance History</CardTitle>
        <CardDescription>Track your vehicle's service record</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-center py-8">
          Maintenance log feature coming soon. You'll be able to record and track all your vehicle's service history here.
        </p>
      </CardContent>
    </Card>
  );
};
