import { useEffect, useCallback, useRef, useState } from 'react';

interface UseFormPersistenceOptions {
  key: string;
  excludeFields?: string[];
  debounceMs?: number;
  storage?: Storage;
}

/**
 * Hook for persisting form state to localStorage
 */
export function useFormPersistence<T extends Record<string, any>>(
  formData: T,
  options: UseFormPersistenceOptions
) {
  const {
    key,
    excludeFields = [],
    debounceMs = 500,
    storage = localStorage,
  } = options;

  const storageKey = `form-persistence-${key}`;
  const isRestoringRef = useRef(false);

  // Save form data to storage
  const saveToStorage = useCallback(() => {
    if (isRestoringRef.current) return;

    try {
      const dataToSave = { ...formData };
      
      // Remove excluded fields
      excludeFields.forEach(field => {
        delete dataToSave[field];
      });

      storage.setItem(storageKey, JSON.stringify({
        data: dataToSave,
        timestamp: Date.now(),
      }));
    } catch (error) {
      console.error('Failed to save form data:', error);
    }
  }, [formData, excludeFields, storage, storageKey]);

  // Debounced save function
  const debouncedSave = useRef(
    debounce(saveToStorage, debounceMs)
  ).current;

  // Load saved data from storage
  const loadFromStorage = useCallback(() => {
    try {
      const saved = storage.getItem(storageKey);
      if (!saved) return null;

      const { data, timestamp } = JSON.parse(saved);
      
      // Check if data is not too old (24 hours)
      const maxAge = 24 * 60 * 60 * 1000;
      if (Date.now() - timestamp > maxAge) {
        storage.removeItem(storageKey);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Failed to load form data:', error);
      return null;
    }
  }, [storage, storageKey]);

  // Clear saved data
  const clearStorage = useCallback(() => {
    try {
      storage.removeItem(storageKey);
    } catch (error) {
      console.error('Failed to clear form data:', error);
    }
  }, [storage, storageKey]);

  // Auto-save on form data changes
  useEffect(() => {
    debouncedSave();
  }, [formData, debouncedSave]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      debouncedSave.cancel();
    };
  }, [debouncedSave]);

  return {
    loadFromStorage,
    clearStorage,
    saveToStorage,
  };
}

/**
 * Hook for managing form draft state
 */
export function useFormDraft<T extends Record<string, any>>(
  initialData: T,
  draftKey: string
) {
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const { loadFromStorage, clearStorage, saveToStorage } = useFormPersistence(
    initialData,
    {
      key: draftKey,
      debounceMs: 1000,
    }
  );

  // Load draft on mount
  useEffect(() => {
    const draft = loadFromStorage();
    if (draft) {
      setIsDraftSaved(true);
      // You'll need to handle restoring the draft to your form
      // This depends on your form library (react-hook-form, formik, etc.)
    }
  }, []);

  // Save draft
  const saveDraft = useCallback((data: T) => {
    saveToStorage();
    setIsDraftSaved(true);
    setLastSaved(new Date());
  }, [saveToStorage]);

  // Clear draft
  const clearDraft = useCallback(() => {
    clearStorage();
    setIsDraftSaved(false);
    setLastSaved(null);
  }, [clearStorage]);

  return {
    isDraftSaved,
    lastSaved,
    saveDraft,
    clearDraft,
    loadDraft: loadFromStorage,
  };
}

/**
 * Utility to create a debounced function
 */
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T & { cancel: () => void } {
  let timeout: NodeJS.Timeout | null = null;

  const debounced = (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };

  debounced.cancel = () => {
    if (timeout) clearTimeout(timeout);
  };

  return debounced as T & { cancel: () => void };
}