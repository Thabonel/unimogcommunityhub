
import { FireIncident } from '@/hooks/use-fires-data';
import { FiresErrorAlert } from './FiresErrorAlert';
import { Skeleton } from '@/components/ui/skeleton';
import { format, parseISO } from 'date-fns';
import { AlertTriangle, MapPin } from 'lucide-react';

interface FiresListViewProps {
  incidents: FireIncident[] | null;
  isLoading: boolean;
  error: Error | null | string;
  radius: number;
  handleRefresh: () => void;
  location?: string;
}

export const FiresListView = ({ 
  incidents, 
  isLoading, 
  error, 
  radius,
  handleRefresh,
  location = 'nsw-australia'
}: FiresListViewProps) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (!incidents || incidents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-8">
        <AlertTriangle className="h-10 w-10 text-yellow-500" />
        <p className="text-sm text-muted-foreground">
          No fire incidents found within {radius} km of your location.
        </p>
        <button 
          onClick={handleRefresh} 
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          Refresh
        </button>
      </div>
    );
  }
  
  if (error) {
    return <FiresErrorAlert error={error} onRetry={handleRefresh} />;
  }

  return (
    <div className="divide-y divide-border">
      {incidents.map((incident) => (
        <div key={incident.id} className="py-4">
          <div className="flex justify-between">
            <h3 className="text-lg font-semibold">{incident.title}</h3>
            <span className="text-sm text-muted-foreground">
              {format(parseISO(incident.publication_date), 'MMM dd, yyyy HH:mm')}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
            <MapPin className="h-4 w-4" />
            <span>{incident.location}</span>
          </div>
          <p className="text-sm mt-2">{incident.description}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="secondary">Status: {incident.status}</Badge>
            <Badge variant="secondary">Type: {incident.type}</Badge>
            {incident.alert_level && <Badge variant="secondary">Alert: {incident.alert_level}</Badge>}
            {incident.council_area && <Badge variant="secondary">Council: {incident.council_area}</Badge>}
            {incident.size && <Badge variant="secondary">Size: {incident.size}</Badge>}
          </div>
        </div>
      ))}
    </div>
  );
};

interface BadgeProps {
  variant?: "default" | "secondary" | "destructive" | "outline";
  children?: React.ReactNode;
  className?: string;
}

function Badge({
  variant = "default",
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & BadgeProps) {
  return (
    <div
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
        variant === "secondary"
          ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          : "bg-muted text-muted-foreground"
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
