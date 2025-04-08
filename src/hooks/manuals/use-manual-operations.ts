
import { useState, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export function useManualOperations() {
  const [viewingManual, setViewingManual] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenManual = useCallback(async (fileName: string) => {
    console.log('Attempting to open manual:', fileName);
    setIsLoading(true);
    
    try {
      // Get a signed URL for the manual
      const { data, error } = await supabase
        .storage
        .from('manuals')
        .createSignedUrl(fileName, 60 * 5); // 5 minutes expiry
      
      if (error) {
        console.error('Error getting signed URL:', error);
        throw error;
      }
      
      if (!data?.signedUrl) {
        throw new Error('No signed URL returned');
      }
      
      setViewingManual(data.signedUrl);
    } catch (error) {
      console.error('Error opening manual:', error);
      toast({
        title: 'Failed to open manual',
        description: 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDownloadManual = useCallback(async (fileName: string, displayName: string) => {
    console.log('Attempting to download manual:', fileName);
    setIsLoading(true);
    
    try {
      // Get a signed URL for the manual
      const { data, error } = await supabase
        .storage
        .from('manuals')
        .createSignedUrl(fileName, 60 * 5); // 5 minutes expiry
      
      if (error) {
        console.error('Error getting signed URL for download:', error);
        throw error;
      }
      
      if (!data?.signedUrl) {
        throw new Error('No signed URL returned for download');
      }
      
      // Create a temporary anchor to trigger download
      const a = document.createElement('a');
      a.href = data.signedUrl;
      a.download = displayName ? `${displayName}.pdf` : fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast({
        title: 'Download started',
        description: `Downloading ${displayName || fileName}`,
      });
    } catch (error) {
      console.error('Error downloading manual:', error);
      toast({
        title: 'Failed to download manual',
        description: 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  return {
    viewingManual,
    setViewingManual,
    isLoading,
    handleOpenManual,
    handleDownloadManual
  };
}
