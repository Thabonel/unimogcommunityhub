
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';

interface CardManualVariantProps {
  title: string;
  description: string;
  isLoading: boolean;
  onView: () => void;
  onDownload: () => void;
  className?: string;
}

export const CardManualVariant = ({
  title,
  description,
  isLoading,
  onView,
  onDownload,
  className = ''
}: CardManualVariantProps) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-4 p-6 border rounded-lg bg-card">
        <FileText size={24} className="text-primary flex-shrink-0" />
        <div className="flex-grow">
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onDownload} 
            className="gap-1"
          >
            <Download size={16} />
            Download
          </Button>
          <Button 
            size="sm" 
            onClick={onView}
            disabled={isLoading}
            className="gap-1"
          >
            <FileText size={16} />
            {isLoading ? 'Loading...' : 'View Manual'}
          </Button>
        </div>
      </div>
    </div>
  );
};
