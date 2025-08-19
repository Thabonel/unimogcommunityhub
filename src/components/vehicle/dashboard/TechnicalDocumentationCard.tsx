
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ManualSection } from '@/components/profile/vehicle/ManualSection';
import { WifiOff } from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';

interface TechnicalDocumentationCardProps {
  modelCode: string;
  isOffline?: boolean;
}

export const TechnicalDocumentationCard = ({ modelCode, isOffline = false }: TechnicalDocumentationCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Technical Documentation
          {isOffline && (
            <span className="inline-flex items-center text-sm text-amber-600">
              <WifiOff size={16} className="mr-1" /> Offline Mode
            </span>
          )}
        </CardTitle>
        <CardDescription>Access your vehicle's manuals and documentation</CardDescription>
      </CardHeader>
      <CardContent>
        <ErrorBoundary>
          <ManualSection modelCode={modelCode} isOffline={isOffline} />
        </ErrorBoundary>
      </CardContent>
    </Card>
  );
};
