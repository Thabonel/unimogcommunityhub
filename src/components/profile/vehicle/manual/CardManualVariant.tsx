
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, WifiOff } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface CardManualVariantProps {
  title: string;
  description: string;
  isLoading: boolean;
  isOffline?: boolean;
  onView: () => void;
  onDownload: () => void;
  className?: string;
}

export const CardManualVariant = ({
  title,
  description,
  isLoading,
  isOffline = false,
  onView,
  onDownload,
  className = ''
}: CardManualVariantProps) => {
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-6 w-40 mb-2" />
          <Skeleton className="h-4 w-full" />
        </CardHeader>
        <CardFooter>
          <div className="flex space-x-2 w-full">
            <Skeleton className="h-9 flex-1" />
            <Skeleton className="h-9 flex-1" />
          </div>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        {isOffline && (
          <div className="flex items-center text-amber-600 text-sm mt-2">
            <WifiOff size={16} className="mr-1" />
            <span>Manual access limited while offline</span>
          </div>
        )}
      </CardHeader>
      <CardFooter>
        <div className="flex gap-2 w-full">
          <Button
            variant="default"
            onClick={onView}
            disabled={isOffline}
            className="flex-1 gap-1.5"
          >
            <FileText className="h-4 w-4" />
            View Manual
          </Button>
          
          <Button 
            variant="outline"
            onClick={onDownload}
            disabled={isOffline}
            className="flex-1 gap-1.5"
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
