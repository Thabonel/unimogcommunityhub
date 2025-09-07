import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, FileText, Wrench, AlertTriangle, Clock, Loader2, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/lib/supabase-client';

export interface WISSuggestion {
  kind: 'procedure' | 'part' | 'bulletin' | 'popular';
  ref: string;
  label: string;
  score: number;
}

export interface WISSearchResult {
  doc_id: string;
  doc_type: 'procedure' | 'part' | 'bulletin';
  ref: string;
  title: string;
  content: string;
  media: any[];
  rank: number;
  has_media: boolean;
  snippet: string;
}

interface WISProfessionalSearchProps {
  onResultSelect: (result: WISSearchResult) => void;
  onSuggestionSelect?: (suggestion: WISSuggestion) => void;
  modelBias?: string; // e.g., "U435", "OM366"
  className?: string;
}

export function WISProfessionalSearch({ 
  onResultSelect, 
  onSuggestionSelect,
  modelBias = 'U435',
  className = ""
}: WISProfessionalSearchProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<WISSuggestion[]>([]);
  const [searchResults, setSearchResults] = useState<WISSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Debounced suggestion fetching
  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const { data, error } = await supabase.rpc('wis_suggest_prefix', {
        q: searchQuery,
        model_bias: modelBias,
        limit_rows: 20
      });

      if (error) throw error;

      const grouped = data || [];
      setSuggestions(grouped);
      setShowSuggestions(grouped.length > 0);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [modelBias]);

  // Handle search execution
  const executeSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setShowSuggestions(false);
    
    try {
      // Log the query for popularity tracking
      await supabase.rpc('wis_log_query', { q: searchQuery });

      // Execute the search
      const { data, error } = await supabase.rpc('wis_search2', {
        q: searchQuery,
        model_bias: modelBias,
        limit_rows: 40
      });

      if (error) throw error;

      const results = data || [];
      setSearchResults(results);
      setShowResults(results.length > 0);
    } catch (error) {
      console.error('Error executing search:', error);
      setSearchResults([]);
      setShowResults(false);
    } finally {
      setLoading(false);
    }
  }, [modelBias]);

  // Handle input changes with debouncing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedSuggestionIndex(-1);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 150);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter') {
        e.preventDefault();
        executeSearch(query);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          handleSuggestionSelect(suggestions[selectedSuggestionIndex]);
        } else {
          executeSearch(query);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: WISSuggestion) => {
    setQuery(suggestion.label);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
    
    if (onSuggestionSelect) {
      onSuggestionSelect(suggestion);
    }
    
    executeSearch(suggestion.label);
  };

  // Handle clear
  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setSearchResults([]);
    setShowSuggestions(false);
    setShowResults(false);
    setSelectedSuggestionIndex(-1);
    inputRef.current?.focus();
  };

  // Get icon for suggestion type
  const getSuggestionIcon = (kind: string) => {
    switch (kind) {
      case 'procedure': return <FileText className="w-4 h-4 text-blue-600" />;
      case 'part': return <Wrench className="w-4 h-4 text-green-600" />;
      case 'bulletin': return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case 'popular': return <TrendingUp className="w-4 h-4 text-purple-600" />;
      default: return <Search className="w-4 h-4 text-gray-400" />;
    }
  };

  // Get badge color for suggestion type
  const getSuggestionBadgeColor = (kind: string) => {
    switch (kind) {
      case 'procedure': return 'bg-blue-100 text-blue-800';
      case 'part': return 'bg-green-100 text-green-800';
      case 'bulletin': return 'bg-orange-100 text-orange-800';
      case 'popular': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Group suggestions by type
  const groupedSuggestions = suggestions.reduce((acc, suggestion) => {
    if (!acc[suggestion.kind]) {
      acc[suggestion.kind] = [];
    }
    acc[suggestion.kind].push(suggestion);
    return acc;
  }, {} as Record<string, WISSuggestion[]>);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative w-full ${className}`} ref={suggestionsRef}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="What are you fixing? (e.g., oil change, brake service, portal axle)"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-12 h-14 text-lg font-medium"
          autoComplete="off"
          role="combobox"
          aria-expanded={showSuggestions}
          aria-haspopup="listbox"
          aria-label="Search WIS procedures, parts, and bulletins"
        />
        
        {/* Model Badge */}
        {modelBias && (
          <Badge className="absolute right-12 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white">
            {modelBias}
          </Badge>
        )}
        
        {/* Clear/Loading */}
        {query && !loading && (
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
          <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-600 w-5 h-5 animate-spin" />
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && Object.keys(groupedSuggestions).length > 0 && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-2 max-h-96 overflow-y-auto border shadow-lg">
          <div className="py-2">
            {Object.entries(groupedSuggestions).map(([kind, items], groupIndex) => (
              <div key={kind}>
                {groupIndex > 0 && <Separator className="my-2" />}
                
                {/* Group Header */}
                <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center gap-2">
                  {getSuggestionIcon(kind)}
                  {kind === 'popular' ? 'Popular Searches' : `${kind}s`}
                  <Badge variant="secondary" className="text-xs">
                    {items.length}
                  </Badge>
                </div>

                {/* Group Items */}
                {items.slice(0, 5).map((suggestion, index) => {
                  const globalIndex = suggestions.findIndex(s => s === suggestion);
                  return (
                    <button
                      key={`${suggestion.kind}-${suggestion.ref}`}
                      onClick={() => handleSuggestionSelect(suggestion)}
                      className={`w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors ${
                        globalIndex === selectedSuggestionIndex ? 'bg-blue-50 border-l-4 border-blue-500' : 'border-l-4 border-transparent'
                      }`}
                      role="option"
                      aria-selected={globalIndex === selectedSuggestionIndex}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-gray-900 truncate">
                            {suggestion.label}
                          </div>
                          {suggestion.ref && suggestion.kind !== 'popular' && (
                            <div className="text-xs text-gray-500 font-mono mt-1">
                              {suggestion.ref}
                            </div>
                          )}
                        </div>
                        <Badge 
                          className={`text-xs px-2 py-0.5 ${getSuggestionBadgeColor(suggestion.kind)}`}
                        >
                          {suggestion.kind === 'popular' ? 'trending' : suggestion.kind}
                        </Badge>
                      </div>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Search Results */}
      {showResults && searchResults.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Search Results ({searchResults.length})
            </h3>
            {modelBias && (
              <Badge className="bg-blue-100 text-blue-800">
                Optimized for {modelBias}
              </Badge>
            )}
          </div>
          
          <div className="space-y-4">
            {searchResults.map((result) => (
              <Card 
                key={result.doc_id} 
                className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onResultSelect(result)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {getSuggestionIcon(result.doc_type)}
                      <h4 className="font-semibold text-gray-900 truncate">
                        {result.title}
                      </h4>
                      <Badge className="text-xs font-mono bg-gray-100 text-gray-800">
                        {result.ref}
                      </Badge>
                      {result.has_media && (
                        <Badge className="text-xs bg-green-100 text-green-800">
                          📸 Media
                        </Badge>
                      )}
                    </div>
                    
                    <div 
                      className="text-sm text-gray-600 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: result.snippet || result.content.substring(0, 200) + '...' }}
                    />
                    
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                      <Badge variant="outline" className={getSuggestionBadgeColor(result.doc_type)}>
                        {result.doc_type}
                      </Badge>
                      <span>•</span>
                      <span>Relevance: {Math.round(result.rank * 100)}%</span>
                      {result.media && result.media.length > 0 && (
                        <>
                          <span>•</span>
                          <span>{result.media.length} media files</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {showResults && searchResults.length === 0 && !loading && (
        <Card className="mt-6 p-8 text-center">
          <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Results Found
          </h3>
          <p className="text-gray-600 mb-4">
            No procedures, parts, or bulletins found for "{query}".
          </p>
          <div className="text-sm text-gray-500">
            <p>Try searching for:</p>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              {['oil change', 'brake service', 'transmission', 'portal axle', 'hydraulic system'].map((suggestion) => (
                <Badge 
                  key={suggestion}
                  variant="outline" 
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setQuery(suggestion);
                    executeSearch(suggestion);
                  }}
                >
                  {suggestion}
                </Badge>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

export default WISProfessionalSearch;