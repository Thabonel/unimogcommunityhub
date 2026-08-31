import { useEffect, useState } from 'react';
import type { StorageManual } from '@/types/manuals';
import {
  searchManualLibrary,
  type ManualLibrarySearchResult,
} from '@/services/manuals/manualSearchService';

export function useManualSearch(manuals: StorageManual[], query: string) {
  const [results, setResults] = useState<ManualLibrarySearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const trimmedQuery = query.trim();
    if (trimmedQuery.length < 2) {
      setResults([]);
      setIsSearching(false);
      setError(null);
      return;
    }

    let cancelled = false;
    const timeoutId = window.setTimeout(async () => {
      setIsSearching(true);
      setError(null);
      try {
        const nextResults = await searchManualLibrary(trimmedQuery, manuals);
        if (!cancelled) setResults(nextResults);
      } catch (searchError) {
        if (!cancelled) {
          setResults([]);
          setError(searchError instanceof Error ? searchError.message : 'Manual search failed');
        }
      } finally {
        if (!cancelled) setIsSearching(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [manuals, query]);

  return { results, isSearching, error };
}
