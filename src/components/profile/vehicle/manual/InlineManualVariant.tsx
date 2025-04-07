
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';

interface InlineManualVariantProps {
  title: string;
  description: string;
  isLoading: boolean;
  onView: () => void;
  onDownload: () => void;
}

export const InlineManualVariant = ({
  title,
  description,
  isLoading,
  onView,
  onDownload
}: InlineManualVariantProps) => {
  return (
    <div className="pt-4 mt-4 border-t">
      <h3 className="text-lg font-medium mb-3">Owner's Manual</h3>
      <div className="flex items-center gap-4">
        <FileText className="text-primary" />
        <div className="flex-grow">
          <p className="font-medium">{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
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
            onClick={onView} 
            size="sm"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'View Manual'}
          </Button>
        </div>
      </div>
    </div>
  );
};
