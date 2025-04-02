import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { SimplePDFViewer } from '@/components/knowledge/SimplePDFViewer';
import { toast } from '@/hooks/use-toast';
import { useErrorHandler } from '@/hooks/use-error-handler';

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
      // Get a signed URL for the file
      const { data, error } = await supabase.storage
        .from('manuals')
        .createSignedUrl('UHB-Unimog-Cargo.pdf', 60 * 60); // 1 hour expiry
      
      if (error) throw error;
      if (!data?.signedUrl) throw new Error("Failed to get manual URL");
      
      setViewingManual(data.signedUrl);
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
      // Get the file from storage
      const { data, error } = await supabase.storage
        .from('manuals')
        .download('UHB-Unimog-Cargo.pdf');
      
      if (error) throw error;
      
      // Create a download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'UHB-Unimog-Cargo.pdf';
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: 'Download started',
        description: `Downloading Owner's Manual`,
      });
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
                View Manual
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
              View Manual
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
