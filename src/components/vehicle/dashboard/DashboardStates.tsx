
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Wrench, AlertCircle, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LoadingState = () => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

interface ErrorStateProps {
  error: Error | null;
  onRetry: () => void;
}

export const ErrorState = ({ error, onRetry }: ErrorStateProps) => (
  <div className="text-center py-10">
    <div className="mx-auto h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
      <AlertCircle className="h-6 w-6 text-red-500" />
    </div>
    <h3 className="text-lg font-medium mb-2">Error loading vehicle data</h3>
    <p className="text-muted-foreground mb-6">
      {error?.message || "There was an error loading your vehicle data. Please try again later."}
    </p>
    <Button variant="outline" onClick={onRetry}>
      Retry
    </Button>
  </div>
);

export const EmptyState = () => (
  <div className="text-center py-10">
    <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
      <Wrench className="h-6 w-6 text-muted-foreground" />
    </div>
    <h3 className="text-lg font-medium mb-2">No vehicles found</h3>
    <p className="text-muted-foreground mb-6">
      Add your first vehicle to start tracking maintenance.
    </p>
    <Button asChild>
      <Link to="/profile" className="flex items-center gap-2">
        <Plus size={16} />
        Add Vehicle
      </Link>
    </Button>
  </div>
);
