
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { SimplePDFViewer } from '@/components/knowledge/SimplePDFViewer';
import { useManualOperations } from '@/hooks/manuals/use-manual-operations';
import { InlineManualVariant } from './manual/InlineManualVariant';
import { CardManualVariant } from './manual/CardManualVariant';

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
  const {
    viewingManual,
    setViewingManual,
    isLoading,
    handleOpenManual,
    handleDownloadManual
  } = useManualOperations();
  
  // Only show for U1700L
  if (modelCode !== 'U1700L') return null;

  const manualTitle = "UHB-Unimog-Cargo Manual";
  const manualDescription = "Complete operator's guide for the U1700L military model";
  const manualFileName = "UHB-Unimog-Cargo.pdf";

  const handleOpenOwnerManual = () => handleOpenManual(manualFileName);
  const handleDownload = () => handleDownloadManual(manualFileName, 'UHB-Unimog-Cargo');
  
  // Choose the appropriate variant component
  const ManualVariant = variant === 'inline' ? InlineManualVariant : CardManualVariant;
  
  return (
    <>
      <ManualVariant
        title={manualTitle}
        description={manualDescription}
        isLoading={isLoading}
        onView={handleOpenOwnerManual}
        onDownload={handleDownload}
        className={className}
      />
      
      {/* PDF Viewer Modal */}
      {viewingManual && (
        <SimplePDFViewer url={viewingManual} onClose={() => setViewingManual(null)} />
      )}
    </>
  );
};
