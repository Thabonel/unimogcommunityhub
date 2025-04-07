
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { getManualSignedUrl, downloadManual } from '@/services/manuals/manualService';

export function useManualOperations() {
  const [viewingManual, setViewingManual] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { handleError } = useErrorHandler();
  
  const handleOpenManual = async (fileName: string) => {
    try {
      setIsLoading(true);
      console.log(`Attempting to open manual: ${fileName}...`);
      
      // Get a signed URL for the manual
      const signedUrl = await getManualSignedUrl(fileName);
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
  
  const handleDownloadManual = async (fileName: string, title: string) => {
    try {
      console.log(`Attempting to download manual: ${fileName}...`);
      await downloadManual(fileName, title);
    } catch (err) {
      handleError(err, {
        context: 'Downloading manual',
        showToast: true,
        logToConsole: true
      });
    }
  };

  return {
    viewingManual,
    setViewingManual,
    isLoading,
    handleOpenManual,
    handleDownloadManual
  };
}
