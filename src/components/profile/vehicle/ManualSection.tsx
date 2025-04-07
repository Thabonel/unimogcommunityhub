import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { SimplePDFViewer } from '@/components/knowledge/SimplePDFViewer';
import { toast } from '@/hooks/use-toast';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { getManualSignedUrl, downloadManual } from '@/services/manuals/manualService';

interface ManualSectionProps {
  modelCode: string;
  variant?: 'card' | 'inline';
  className?: string;
}

export const ManualSection = ({ 
  modelCode, 
  variant = 'inline',
  className = '' 
}: ManualSectionProps) => {
  const [viewingManual, setViewingManual] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { handleError } = useErrorHandler();
  
  // Only show for U1700L
  if (modelCode !== 'U1700L') return null;

  const handleOpenOwnerManual = async () => {
    try {
      setIsLoading(true);
      console.log('Attempting to open U1700L manual...');
      
      // First check if the manuals bucket exists
      const { error: bucketError } = await supabase.storage.getBucket('manuals');
      
      if (bucketError) {
        console.log('Manuals bucket does not exist, creating it...');
        await supabase.storage.createBucket('manuals', { public: false });
      }
      
      // Use the getManualSignedUrl service function
      const signedUrl = await getManualSignedUrl('UHB-Unimog-Cargo.pdf');
      setViewingManual(signedUrl);
    } catch (err) {
      handleError(err, {
        context: 'Opening manual',
        showToast: true,
        logToConsole: true
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDownload = async () => {
    try {
      console.log('Attempting to download U1700L manual...');
      await downloadManual('UHB-Unimog-Cargo.pdf', 'UHB-Unimog-Cargo');
    } catch (err) {
      handleError(err, {
        context: 'Downloading manual',
        showToast: true,
        logToConsole: true
      });
    }
  };

  // Inline variant (used within UnimogDataCard)
  if (variant === 'inline') {
    return (
      <>
        <div className={`pt-4 mt-4 border-t ${className}`}>
          <h3 className="text-lg font-medium mb-3">Owner's Manual</h3>
          <div className="flex items-center gap-4">
            <FileText className="text-primary" />
            <div className="flex-grow">
              <p className="font-medium">UHB-Unimog-Cargo Manual</p>
              <p className="text-xs text-muted-foreground">Complete operator's guide for the U1700L military model</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleDownload}
                className="gap-1"
              >
                <Download size={16} />
                Download
              </Button>
              <Button 
                onClick={handleOpenOwnerManual} 
                size="sm"
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'View Manual'}
              </Button>
            </div>
          </div>
        </div>
        
        {/* PDF Viewer Modal */}
        {viewingManual && (
          <SimplePDFViewer url={viewingManual} onClose={() => setViewingManual(null)} />
        )}
      </>
    );
  }
  
  // Card variant (used in profile)
  return (
    <>
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center gap-4 p-6 border rounded-lg bg-card">
          <FileText size={24} className="text-primary flex-shrink-0" />
          <div className="flex-grow">
            <h3 className="font-semibold">UHB-Unimog-Cargo Manual</h3>
            <p className="text-sm text-muted-foreground">Complete operator's guide for the U1700L military model</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleDownload} 
              className="gap-1"
            >
              <Download size={16} />
              Download
            </Button>
            <Button 
              size="sm" 
              onClick={handleOpenOwnerManual}
              disabled={isLoading}
              className="gap-1"
            >
              <FileText size={16} />
              {isLoading ? 'Loading...' : 'View Manual'}
            </Button>
          </div>
        </div>
      </div>
      
      {/* PDF Viewer Modal */}
      {viewingManual && (
          <SimplePDFViewer url={viewingManual} onClose={() => setViewingManual(null)} />
      )}
    </>
  );
};
