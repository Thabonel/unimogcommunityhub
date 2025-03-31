
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { PdfViewer } from '@/components/knowledge/PdfViewer';
import { toast } from '@/hooks/use-toast';

interface ManualSectionProps {
  modelCode: string;
}

export const ManualSection = ({ modelCode }: ManualSectionProps) => {
  const [viewingManual, setViewingManual] = useState<string | null>(null);
  
  // Only show for U1700L
  if (modelCode !== 'U1700L') return null;

  const handleOpenOwnerManual = async () => {
    try {
      // Get a signed URL for the file
      const { data, error } = await supabase.storage
        .from('manuals')
        .createSignedUrl('UHB-Unimog-Cargo.pdf', 60 * 60); // 1 hour expiry
      
      if (error) throw error;
      if (!data?.signedUrl) throw new Error("Failed to get manual URL");
      
      setViewingManual(data.signedUrl);
    } catch (err) {
      console.error('Error opening manual:', err);
      toast({
        title: 'Error',
        description: 'Could not open the owner\'s manual',
        variant: 'destructive'
      });
    }
  };
  
  return (
    <>
      <div className="pt-4 mt-4 border-t">
        <h3 className="text-lg font-medium mb-3">Owner's Manual</h3>
        <div className="flex items-center gap-4">
          <FileText className="text-primary" />
          <div className="flex-grow">
            <p className="font-medium">UHB-Unimog-Cargo Manual</p>
            <p className="text-xs text-muted-foreground">Complete operator's guide for the U1700L military model</p>
          </div>
          <Button onClick={handleOpenOwnerManual} size="sm">
            View Manual
          </Button>
        </div>
      </div>
      
      {/* PDF Viewer Modal */}
      {viewingManual && (
        <PdfViewer url={viewingManual} onClose={() => setViewingManual(null)} />
      )}
    </>
  );
};
