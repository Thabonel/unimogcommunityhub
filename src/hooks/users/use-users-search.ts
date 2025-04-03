
import { useState, useCallback, useEffect } from "react";

interface UseUsersSearchProps<T> {
  items: T[];
  searchFields?: (keyof T | ((item: T) => string))[];
  initialSearchTerm?: string;
  debounceTime?: number;
}

export function useUsersSearch<T>({ 
  items = [], 
  searchFields = ['email', 'id'] as (keyof T | ((item: T) => string))[], 
  initialSearchTerm = "",
  debounceTime = 250
}: UseUsersSearchProps<T>) {
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
  const getFieldValue = useCallback((item: T, field: keyof T | ((item: T) => string)): string => {
    if (typeof field === 'function') {
      return field(item);
    }
    
    const value = item[field];
    if (value === null || value === undefined) return '';
    return String(value);
  }, []);
  
  // Filter items based on search term
  const filteredItems = useCallback(() => {
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
  }, [items, debouncedSearchTerm, searchFields, getFieldValue])();
  
  const resetSearch = useCallback(() => {
    setSearchTermInternal('');
    setDebouncedSearchTerm('');
  }, []);
  
  return {
    searchTerm,
    debouncedSearchTerm,
    setSearchTerm,
    filteredItems,
    resetSearch,
    isSearchActive: debouncedSearchTerm.trim().length > 0,
    resultCount: filteredItems.length
  };
}
