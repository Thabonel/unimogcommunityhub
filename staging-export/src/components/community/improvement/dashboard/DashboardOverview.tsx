
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BarChart3 } from 'lucide-react';

export function DashboardOverview() {
  return (
    <>
      <div>
        <h1 className="text-3xl font-bold mb-2">Community Improvement</h1>
        <p className="text-muted-foreground">
          Tools for measuring, testing and improving the community experience
        </p>
      </div>
      
      <Alert>
        <BarChart3 className="h-4 w-4" />
        <AlertTitle>Data-driven community management</AlertTitle>
        <AlertDescription>
          Use these tools to gather insights, test new features, and prioritize community improvements.
        </AlertDescription>
      </Alert>
    </>
  );
}
