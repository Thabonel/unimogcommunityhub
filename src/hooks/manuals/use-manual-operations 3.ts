
import { useState, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from '@/lib/supabase-client';

export function useManualOperations() {
  const [viewingManual, setViewingManual] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleOpenManual = useCallback(async (fileName: string) => {
    console.log('Attempting to open manual:', fileName);
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if browser is online
      if (!navigator.onLine) {
        throw new Error('You are currently offline');
      }
      
      // Get a signed URL for the manual
      const { data, error: functionError } = await supabase
        .storage
        .from('manuals')
        .createSignedUrl(fileName, 60 * 5); // 5 minutes expiry
      
      if (functionError) {
        console.error('Error getting signed URL:', functionError);
        throw functionError;
      }
      
      if (!data?.signedUrl) {
        throw new Error('No signed URL returned');
      }
      
      setViewingManual(data.signedUrl);
    } catch (err) {
      console.error('Error opening manual:', err);
      setError(err instanceof Error ? err : new Error('Failed to open manual'));
      
      // Show toast only if it's not cancelled by the user
      if (!(err instanceof Error && err.message === 'Operation canceled')) {
        toast({
          title: 'Failed to open manual',
          description: err instanceof Error ? err.message : 'Please try again later',
          variant: 'destructive',
        });
      }
      
      throw err; // Re-throw for the component to handle
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDownloadManual = useCallback(async (fileName: string, displayName: string) => {
    console.log('Attempting to download manual:', fileName);
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if browser is online
      if (!navigator.onLine) {
        throw new Error('You are currently offline');
      }
      
      // Get a signed URL for the manual
      const { data, error: functionError } = await supabase
        .storage
        .from('manuals')
        .createSignedUrl(fileName, 60 * 5); // 5 minutes expiry
      
      if (functionError) {
        console.error('Error getting signed URL for download:', functionError);
        throw functionError;
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
    } catch (err) {
      console.error('Error downloading manual:', err);
      setError(err instanceof Error ? err : new Error('Failed to download manual'));
      
      toast({
        title: 'Failed to download manual',
        description: err instanceof Error ? err.message : 'Please try again later',
        variant: 'destructive',
      });
      
      throw err; // Re-throw for the component to handle
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  return {
    viewingManual,
    setViewingManual,
    isLoading,
    error,
    handleOpenManual,
    handleDownloadManual
  };
}
