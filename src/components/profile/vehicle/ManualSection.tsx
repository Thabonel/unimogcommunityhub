
import { useState, useEffect } from 'react';
import { SimplePDFViewer } from '@/components/knowledge/SimplePDFViewer';
import { useManualOperations } from '@/hooks/manuals/use-manual-operations';
import { InlineManualVariant } from './manual/InlineManualVariant';
import { CardManualVariant } from './manual/CardManualVariant';
import { ensureSampleManualsExist } from '@/services/manuals';
import { toast } from '@/hooks/use-toast';
import { ErrorBoundary } from '@/components/ErrorBoundary';

interface ManualSectionProps {
  modelCode: string;
  variant?: 'card' | 'inline';
  className?: string;
  isOffline?: boolean;
}

export const ManualSection = ({ 
  modelCode, 
  variant = 'inline',
  className = '',
  isOffline = false
}: ManualSectionProps) => {
  const {
    viewingManual,
    setViewingManual,
    isLoading,
    handleOpenManual,
    handleDownloadManual,
    error: manualError
  } = useManualOperations();
  
  const [initialized, setInitialized] = useState(false);
  
  // Initialize by ensuring the sample manual exists
  useEffect(() => {
    if (!initialized && !isOffline) {
      const initializeManuals = async () => {
        try {
          await ensureSampleManualsExist();
          setInitialized(true);
        } catch (err) {
          console.error("Failed to initialize manuals:", err);
        }
      };
      
      initializeManuals();
    }
  }, [initialized, isOffline]);
  
  // Only show for U1700L
  if (modelCode !== 'U1700L') return null;

  const manualTitle = "UHB-Unimog-Cargo Manual";
  const manualDescription = "Complete operator's guide for the U1700L military model";
  const manualFileName = "UHB-Unimog-Cargo.pdf";

  const handleOpenOwnerManual = async () => {
    if (isOffline) {
      toast({
        title: "Offline Mode",
        description: "Manual viewing is not available while offline",
        variant: "warning"
      });
      return;
    }
    
    try {
      await handleOpenManual(manualFileName);
    } catch (err) {
      console.error("Error opening manual:", err);
      toast({
        title: "Failed to open manual",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };
  
  const handleDownload = async () => {
    if (isOffline) {
      toast({
        title: "Offline Mode",
        description: "Manual downloading is not available while offline",
        variant: "warning"
      });
      return;
    }
    
    try {
      await handleDownloadManual(manualFileName, 'UHB-Unimog-Cargo');
    } catch (err) {
      console.error("Error downloading manual:", err);
      toast({
        title: "Failed to download manual",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };
  
  // Choose the appropriate variant component
  const ManualVariant = variant === 'inline' ? InlineManualVariant : CardManualVariant;
  
  return (
    <ErrorBoundary>
      <ManualVariant
        title={manualTitle}
        description={manualDescription}
        isLoading={isLoading}
        isOffline={isOffline}
        onView={handleOpenOwnerManual}
        onDownload={handleDownload}
        className={className}
      />
      
      {/* PDF Viewer Modal */}
      {viewingManual && (
        <SimplePDFViewer url={viewingManual} onClose={() => setViewingManual(null)} />
      )}
    </ErrorBoundary>
  );
};
