
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export const useManualOperations = () => {
  const [viewingManual, setViewingManual] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Function to get a signed URL for viewing a manual
  const handleOpenManual = useCallback(async (fileName: string) => {
    try {
      setIsLoading(true);
      
      // Get a signed URL for the file
      const { data, error } = await supabase.storage
        .from('manuals')
        .createSignedUrl(fileName, 60 * 60); // 1 hour expiry
      
      if (error) throw error;
      if (!data?.signedUrl) throw new Error("Failed to get signed URL");
      
      // Set the URL for viewing
      setViewingManual(data.signedUrl);
    } catch (error: any) {
      console.error('Error opening manual:', error);
      toast({
        title: "Error opening manual",
        description: error.message || "Could not open the manual",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Function to download a manual
  const handleDownloadManual = useCallback(async (fileName: string, downloadName: string) => {
    try {
      setIsLoading(true);
      
      // Get the file from storage
      const { data, error } = await supabase.storage
        .from('manuals')
        .download(fileName);
      
      if (error) throw error;
      
      // Create a download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = downloadName + '.pdf';
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: 'Download started',
        description: `Downloading ${downloadName}`,
      });
    } catch (error: any) {
      console.error('Error downloading manual:', error);
      toast({
        title: "Error downloading manual",
        description: error.message || "Could not download the manual",
        variant: "destructive",
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
};
