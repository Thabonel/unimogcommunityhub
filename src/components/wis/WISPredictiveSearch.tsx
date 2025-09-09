import React, { useState, useEffect, useRef } from 'react';
import { Search, X, FileText, Wrench, AlertTriangle, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase-client';

export interface WISSearchSuggestion {
  id: string;
  type: 'procedure' | 'part' | 'bulletin';
  title: string;
  ref: string;
  category?: string;
  description?: string;
}

interface WISPredictiveSearchProps {
  placeholder?: string;
  onItemSelect: (item: WISSearchSuggestion) => void;
  className?: string;
}

export function WISPredictiveSearch({ 
  placeholder = "Start typing to search WIS database...", 
  onItemSelect,
  className = ""
}: WISPredictiveSearchProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<WISSearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Debounced search for suggestions
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!query.trim()) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    searchTimeoutRef.current = setTimeout(() => {
      fetchSuggestions(query);
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query]);

  // Fetch suggestions from database
  const fetchSuggestions = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const suggestions: WISSearchSuggestion[] = [];
      const searchTerm = `%${searchQuery.toLowerCase()}%`;

      // Search procedures
      const { data: procedures } = await supabase
        .from('wis_procedures')
        .select('id, procedure_code, title, category, description')
        .or(`title.ilike.${searchTerm},procedure_code.ilike.${searchTerm},category.ilike.${searchTerm}`)
        .limit(5);

      if (procedures) {
        procedures.forEach(proc => {
          suggestions.push({
            id: proc.id,
            type: 'procedure',
            title: proc.title,
            ref: proc.procedure_code,
            category: proc.category,
            description: proc.description
          });
        });
      }

      // Search parts
      const { data: parts } = await supabase
        .from('wis_parts')
        .select('id, part_number, part_name, category, description')
        .or(`part_name.ilike.${searchTerm},part_number.ilike.${searchTerm},category.ilike.${searchTerm}`)
        .limit(5);

      if (parts) {
        parts.forEach(part => {
          suggestions.push({
            id: part.id,
            type: 'part',
            title: part.part_name,
            ref: part.part_number,
            category: part.category,
            description: part.description
          });
        });
      }

      // Search bulletins
      const { data: bulletins } = await supabase
        .from('wis_bulletins')
        .select('id, bulletin_number, title, category, description')
        .or(`title.ilike.${searchTerm},bulletin_number.ilike.${searchTerm},category.ilike.${searchTerm}`)
        .limit(5);

      if (bulletins) {
        bulletins.forEach(bulletin => {
          suggestions.push({
            id: bulletin.id,
            type: 'bulletin',
            title: bulletin.title,
            ref: bulletin.bulletin_number,
            category: bulletin.category,
            description: bulletin.description
          });
        });
      }

      // Sort by relevance (title matches first, then ref matches)
      const sortedSuggestions = suggestions.sort((a, b) => {
        const aTitle = a.title.toLowerCase().includes(searchQuery.toLowerCase());
        const bTitle = b.title.toLowerCase().includes(searchQuery.toLowerCase());
        const aRef = a.ref.toLowerCase().includes(searchQuery.toLowerCase());
        const bRef = b.ref.toLowerCase().includes(searchQuery.toLowerCase());

        if (aTitle && !bTitle) return -1;
        if (!aTitle && bTitle) return 1;
        if (aRef && !bRef) return -1;
        if (!aRef && bRef) return 1;
        return 0;
      });

      setSuggestions(sortedSuggestions.slice(0, 12)); // Limit to 12 suggestions
      setShowDropdown(sortedSuggestions.length > 0);
      setSelectedIndex(-1);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
      setShowDropdown(false);
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  // Handle item selection
  const handleItemSelect = (item: WISSearchSuggestion) => {
    setQuery(item.title);
    setShowDropdown(false);
    setSelectedIndex(-1);
    onItemSelect(item);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleItemSelect(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Handle clear search
  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setShowDropdown(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowDropdown(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get icon for suggestion type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'procedure': return <FileText className="w-4 h-4" />;
      case 'part': return <Wrench className="w-4 h-4" />;
      case 'bulletin': return <AlertTriangle className="w-4 h-4" />;
      default: return <Search className="w-4 h-4" />;
    }
  };

  // Get badge color for suggestion type
  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'procedure': return 'bg-blue-100 text-blue-800' as const;
      case 'part': return 'bg-green-100 text-green-800' as const;
      case 'bulletin': return 'bg-orange-100 text-orange-800' as const;
      default: return 'secondary' as const;
    }
  };

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-10 h-12 text-base"
          autoComplete="off"
          role="combobox"
          aria-expanded={showDropdown}
          aria-haspopup="listbox"
          aria-label="Search WIS database"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
        {loading && (
          <Loader2 className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 animate-spin" />
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-96 overflow-y-auto border shadow-lg">
          <div className="py-2">
            <div className="px-3 py-2 text-xs text-gray-500 font-medium border-b">
              {suggestions.length} suggestion{suggestions.length !== 1 ? 's' : ''} found
            </div>
            {suggestions.map((suggestion, index) => (
              <button
                key={`${suggestion.type}-${suggestion.id}`}
                onClick={() => handleItemSelect(suggestion)}
                className={`w-full px-3 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors ${
                  index === selectedIndex ? 'bg-blue-50 border-blue-200' : ''
                }`}
                role="option"
                aria-selected={index === selectedIndex}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-gray-400">
                    {getTypeIcon(suggestion.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-medium text-sm text-gray-900 truncate">
                        {suggestion.title}
                      </h4>
                      <div className="flex gap-1 flex-shrink-0">
                        <Badge 
                          variant="secondary" 
                          className={`text-xs px-2 py-0.5 ${getTypeBadgeVariant(suggestion.type)}`}
                        >
                          {suggestion.type}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                      <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">
                        {suggestion.ref}
                      </span>
                      {suggestion.category && (
                        <span className="text-gray-400">•</span>
                      )}
                      {suggestion.category && (
                        <span>{suggestion.category}</span>
                      )}
                    </div>
                    {suggestion.description && (
                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                        {suggestion.description.length > 100 
                          ? `${suggestion.description.substring(0, 100)}...`
                          : suggestion.description
                        }
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* No results message */}
      {showDropdown && suggestions.length === 0 && !loading && query.length > 2 && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 border shadow-lg">
          <div className="px-4 py-6 text-center text-gray-500">
            <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No results found for "{query}"</p>
            <p className="text-xs text-gray-400 mt-1">
              Try different keywords or check spelling
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}

export default WISPredictiveSearch;