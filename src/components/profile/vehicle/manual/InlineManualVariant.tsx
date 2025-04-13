
import { Button } from '@/components/ui/button';
import { FileText, Download, WifiOff } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface InlineManualVariantProps {
  title: string;
  description: string;
  isLoading: boolean;
  isOffline?: boolean;
  onView: () => void;
  onDownload: () => void;
  className?: string;
}

export const InlineManualVariant = ({
  title,
  description,
  isLoading,
  isOffline = false,
  onView,
  onDownload,
  className = ''
}: InlineManualVariantProps) => {
  if (isLoading) {
    return (
      <div className={`flex flex-col space-y-2 ${className}`}>
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-full" />
        <div className="flex space-x-2 mt-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {isOffline && (
        <div className="flex items-center text-amber-600 text-sm mb-2">
          <WifiOff size={16} className="mr-1" />
          <span>Manual access limited while offline</span>
        </div>
      )}
      
      <div className="flex gap-2 justify-between">
        <Button
          variant="default"
          size="sm"
          onClick={onView}
          disabled={isOffline}
          className="gap-1.5"
        >
          <FileText className="h-4 w-4" />
          View Manual
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={onDownload}
          disabled={isOffline}
          className="gap-1.5"
        >
          <Download className="h-4 w-4" />
          Download
        </Button>
      </div>
    </div>
  );
};
