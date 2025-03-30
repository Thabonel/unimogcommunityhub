
import { useState, useCallback, useMemo } from "react";

interface UseSearchProps<T> {
  items?: T[];
  searchFields?: (keyof T)[];
  initialSearchTerm?: string;
}

export function useSearch<T>({ 
  items = [], 
  searchFields = [], 
  initialSearchTerm = "" 
}: UseSearchProps<T>) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  
  // Filter items based on search term
  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) {
      return items;
    }
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    return items.filter(item => {
      return searchFields.some(field => {
        const value = item[field];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(lowerSearchTerm);
      });
    });
  }, [items, searchTerm, searchFields]);
  
  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);
  
  return {
    searchTerm,
    setSearchTerm,
    handleSearch,
    filteredItems
  };
}
