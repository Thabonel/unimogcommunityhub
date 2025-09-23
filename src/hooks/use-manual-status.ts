import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';

interface ManualStatus {
  unprocessedCount: number;
  totalManuals: number;
  isLoading: boolean;
  error: string | null;
}

export function useManualStatus(): ManualStatus {
  const [status, setStatus] = useState<ManualStatus>({
    unprocessedCount: 0,
    totalManuals: 0,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    let mounted = true;

    const fetchManualStatus = async () => {
      try {
        // Get all manuals from storage
        const { data: storageFiles, error: storageError } = await supabase
          .storage
          .from('manuals')
          .list('', { limit: 100 });

        if (storageError) throw storageError;

        const totalManuals = storageFiles?.filter(file => file.name.endsWith('.pdf')).length || 0;

        // Get processed manuals count
        const { data: processedManuals, error: dbError } = await supabase
          .from('manual_metadata')
          .select('filename, processing_status')
          .in('processing_status', ['completed', 'processing']);

        if (dbError) throw dbError;

        const processedFilenames = new Set(
          processedManuals?.map(m => m.filename) || []
        );

        const unprocessedCount = Math.max(0, totalManuals - processedFilenames.size);

        if (mounted) {
          setStatus({
            unprocessedCount,
            totalManuals,
            isLoading: false,
            error: null
          });
        }
      } catch (error) {
        console.error('Failed to fetch manual status:', error);
        if (mounted) {
          setStatus(prev => ({
            ...prev,
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch status'
          }));
        }
      }
    };

    fetchManualStatus();

    return () => {
      mounted = false;
    };
  }, []);

  return status;
}