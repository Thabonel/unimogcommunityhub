
import { useState, useCallback, useMemo, useEffect } from "react";

type SearchField<T> = keyof T | ((item: T) => string);

interface UseSearchProps<T> {
  items?: T[];
  searchFields?: SearchField<T>[];
  initialSearchTerm?: string;
  debounceTime?: number;
}

export function useSearch<T>({ 
  items = [], 
  searchFields = [], 
  initialSearchTerm = "",
  debounceTime = 300
}: UseSearchProps<T>) {
  const [searchTerm, setSearchTermInternal] = useState(initialSearchTerm);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialSearchTerm);
  
  // Handle debouncing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, debounceTime);
    
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, debounceTime]);
  
  // Set search term with debouncing
  const setSearchTerm = useCallback((value: string) => {
    setSearchTermInternal(value);
  }, []);
  
  // Extract searchable text from an item based on a field
  const getFieldValue = useCallback((item: T, field: SearchField<T>): string => {
    if (typeof field === 'function') {
      return field(item);
    }
    
    const value = item[field];
    if (value === null || value === undefined) return '';
    return String(value);
  }, []);
  
  // Filter items based on search term
  const filteredItems = useMemo(() => {
    if (!debouncedSearchTerm.trim()) {
      return items;
    }
    
    const terms = debouncedSearchTerm.toLowerCase().split(' ').filter(term => term.trim());
    
    if (terms.length === 0) return items;
    
    return items.filter(item => {
      // Check if ALL search terms match ANY field
      return terms.every(term => {
        return searchFields.some(field => {
          const fieldValue = getFieldValue(item, field).toLowerCase();
          return fieldValue.includes(term);
        });
      });
    });
  }, [items, debouncedSearchTerm, searchFields, getFieldValue]);
  
  const resetSearch = useCallback(() => {
    setSearchTermInternal('');
    setDebouncedSearchTerm('');
  }, []);
  
  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
  }, [setSearchTerm]);
  
  return {
    searchTerm,
    debouncedSearchTerm,
    setSearchTerm,
    handleSearch,
    filteredItems,
    resetSearch,
    isSearchActive: debouncedSearchTerm.trim().length > 0,
    resultCount: filteredItems.length
  };
}
