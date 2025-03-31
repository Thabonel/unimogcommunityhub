
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Printer } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { PdfViewer } from '@/components/knowledge/PdfViewer';
import { toast } from '@/hooks/use-toast';

interface OwnerManualSectionProps {
  unimogModel?: string;
}

export default function OwnerManualSection({ unimogModel }: OwnerManualSectionProps) {
  const [viewingPdf, setViewingPdf] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Only show for U1700L
  if (unimogModel !== 'U1700L') return null;
  
  const handleViewManual = async () => {
    try {
      setIsLoading(true);
      // Get a signed URL for the file
      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from('manuals')
        .createSignedUrl('UHB-Unimog-Cargo.pdf', 60 * 60); // 1 hour expiry
      
      if (signedUrlError) throw signedUrlError;
      if (!signedUrlData?.signedUrl) throw new Error("Failed to get manual URL");
      
      setViewingPdf(signedUrlData.signedUrl);
    } catch (error) {
      console.error('Error viewing manual:', error);
      toast({
        title: 'Failed to view manual',
        description: 'Please try again later',
        variant: 'destructive',
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
    } catch (error) {
      console.error('Error downloading manual:', error);
      toast({
        title: 'Failed to download manual',
        description: 'Please try again later',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Owner's Manual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
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
                onClick={handleViewManual}
                disabled={isLoading}
                className="gap-1"
              >
                <FileText size={16} />
                View Manual
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* PDF Viewer Modal */}
      {viewingPdf && (
        <PdfViewer url={viewingPdf} onClose={() => setViewingPdf(null)} />
      )}
    </>
  );
}
