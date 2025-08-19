import { useEffect, useRef, useCallback, useState } from 'react';

interface UseAutosaveOptions {
  onSave: (data: any) => Promise<void>;
  debounceMs?: number;
  enabled?: boolean;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Hook for implementing autosave functionality
 */
export function useAutosave<T>(
  data: T,
  options: UseAutosaveOptions
) {
  const {
    onSave,
    debounceMs = 2000,
    enabled = true,
    onSuccess,
    onError,
  } = options;

  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveError, setSaveError] = useState<Error | null>(null);
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousDataRef = useRef<T>(data);

  // Save function
  const save = useCallback(async () => {
    if (!enabled) return;

    setIsSaving(true);
    setSaveError(null);

    try {
      await onSave(data);
      setLastSaved(new Date());
      if (onSuccess) onSuccess();
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Save failed');
      setSaveError(err);
      if (onError) onError(err);
    } finally {
      setIsSaving(false);
    }
  }, [data, enabled, onSave, onSuccess, onError]);

  // Debounced save
  const debouncedSave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      save();
    }, debounceMs);
  }, [save, debounceMs]);

  // Auto-save on data changes
  useEffect(() => {
    if (!enabled) return;

    // Check if data has actually changed
    const hasChanged = JSON.stringify(data) !== JSON.stringify(previousDataRef.current);
    
    if (hasChanged) {
      previousDataRef.current = data;
      debouncedSave();
    }
  }, [data, debouncedSave, enabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Force save immediately
  const saveNow = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    return save();
  }, [save]);

  return {
    isSaving,
    lastSaved,
    saveError,
    saveNow,
  };
}

/**
 * Hook for showing autosave status
 */
export function useAutosaveStatus(lastSaved: Date | null, isSaving: boolean) {
  const [statusText, setStatusText] = useState('');

  useEffect(() => {
    if (isSaving) {
      setStatusText('Saving...');
      return;
    }

    if (!lastSaved) {
      setStatusText('');
      return;
    }

    // Update status text immediately
    const updateStatus = () => {
      const now = new Date();
      const diff = now.getTime() - lastSaved.getTime();
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);

      if (seconds < 5) {
        setStatusText('Saved just now');
      } else if (seconds < 60) {
        setStatusText(`Saved ${seconds} seconds ago`);
      } else if (minutes < 60) {
        setStatusText(`Saved ${minutes} minute${minutes > 1 ? 's' : ''} ago`);
      } else {
        setStatusText(`Saved at ${lastSaved.toLocaleTimeString()}`);
      }
    };

    updateStatus();

    // Update every 10 seconds
    const interval = setInterval(updateStatus, 10000);

    return () => clearInterval(interval);
  }, [lastSaved, isSaving]);

  return statusText;
}