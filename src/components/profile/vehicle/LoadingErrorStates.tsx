
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState = ({ message = "Loading vehicle data..." }: LoadingStateProps) => {
  return (
    <Card>
      <CardContent className="p-6 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </CardContent>
    </Card>
  );
};

interface ErrorStateProps {
  message?: string;
}

export const ErrorState = ({ message = "Failed to load vehicle data." }: ErrorStateProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-red-500">{message}</p>
      </CardContent>
    </Card>
  );
};

interface EmptyStateProps {
  message?: string;
}

export const EmptyState = ({ message = "No information available for this model." }: EmptyStateProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-muted-foreground italic">{message}</p>
      </CardContent>
    </Card>
  );
};
