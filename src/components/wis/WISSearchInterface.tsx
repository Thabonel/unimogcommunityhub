// WISSearchInterface - Advanced search component for WIS
import React, { useState, useEffect } from 'react';
import { useWISSearch, useVoiceSearch, useWISAnalytics } from '@/hooks/useWIS';
import { useWISActions, useWISNavigation, useWISUI, useWISSearch as useWISSearchState } from '@/stores/wisStore';
import { cn } from '@/lib/utils';

// UI Components
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

// Icons
import { Search, Mic, MicOff, X, Clock, FileText, Wrench, AlertTriangle } from 'lucide-react';

interface WISSearchInterfaceProps {
  className?: string;
}

export const WISSearchInterface: React.FC<WISSearchInterfaceProps> = ({
  className,
}) => {
  const navigation = useWISNavigation();
  const ui = useWISUI();
  const searchStore = useWISSearchState();
  const actions = useWISActions();

  const [localQuery, setLocalQuery] = useState(searchStore.query);
  const [showResults, setShowResults] = useState(false);

  const { startListening } = useVoiceSearch();
  const { trackSearch } = useWISAnalytics();

  // Debounced search
  const { data: searchResults, isLoading: isSearching } = useWISSearch(
    searchStore.query,
    searchStore.searchType,
    navigation.selectedModel
  );

  // Update search results in store when data changes
  useEffect(() => {
    if (searchResults) {
      actions.setSearchResults(searchResults);
      trackSearch.mutate({
        query: searchStore.query,
        resultCount: searchResults.length,
      });
    }
  }, [searchResults]);

  // Handle search input changes
  const handleSearchChange = (value: string) => {
    setLocalQuery(value);
    actions.setSearchQuery(value);

    if (value.length > 2) {
      actions.setViewMode('search');
      setShowResults(true);
    } else {
      actions.clearSearch();
      setShowResults(false);
    }
  };

  // Handle voice search
  const handleVoiceSearch = async () => {
    try {
      actions.setVoiceSearching(true);
      const transcript = await startListening();
      handleSearchChange(transcript);
    } catch (error) {
      console.error('Voice search failed:', error);
      actions.setError('Voice search failed. Please try again.');
    } finally {
      actions.setVoiceSearching(false);
    }
  };

  // Handle search result selection
  const handleResultSelect = (result: any) => {
    if (result.result_type === 'procedure') {
      actions.setSelectedProcedure(result.id);
      actions.setViewMode('tree');
      setShowResults(false);
    }
    actions.addRecentSearch(searchStore.query);
  };

  // Get icon for result type
  const getResultIcon = (type: string) => {
    switch (type) {
      case 'procedure':
        return <FileText className="h-4 w-4 text-blue-600" />;
      case 'part':
        return <Wrench className="h-4 w-4 text-green-600" />;
      case 'bulletin':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      default:
        return <Search className="h-4 w-4 text-gray-600" />;
    }
  };

  // Get result type label
  const getResultTypeLabel = (type: string) => {
    switch (type) {
      case 'procedure':
        return 'Procedure';
      case 'part':
        return 'Part';
      case 'bulletin':
        return 'Bulletin';
      default:
        return 'Result';
    }
  };

  return (
    <div className={cn("p-4 border-b border-gray-200 bg-white", className)}>
      <div className="space-y-3">
        {/* Search Input */}
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search procedures, parts, or bulletins..."
              value={localQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 pr-20"
              onFocus={() => {
                if (searchStore.query.length > 2) {
                  setShowResults(true);
                }
              }}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
              {/* Voice Search Button */}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleVoiceSearch}
                disabled={ui.isVoiceSearching}
                className={cn(
                  "h-6 w-6 p-0",
                  ui.isVoiceSearching && "text-red-500 animate-pulse"
                )}
                title="Voice search"
              >
                {ui.isVoiceSearching ? (
                  <MicOff className="h-3 w-3" />
                ) : (
                  <Mic className="h-3 w-3" />
                )}
              </Button>

              {/* Clear Search */}
              {localQuery && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setLocalQuery('');
                    actions.clearSearch();
                    setShowResults(false);
                  }}
                  className="h-6 w-6 p-0"
                  title="Clear search"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Search Type Filter */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-medium text-gray-600">Search in:</span>
          <Select
            value={searchStore.searchType}
            onValueChange={(value: 'all' | 'procedures' | 'parts' | 'bulletins') => {
              actions.setSearchType(value);
            }}
          >
            <SelectTrigger className="w-32 h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Results</SelectItem>
              <SelectItem value="procedures">Procedures</SelectItem>
              <SelectItem value="parts">Parts</SelectItem>
              <SelectItem value="bulletins">Bulletins</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Recent Searches */}
        {!showResults && searchStore.recentSearches.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Clock className="h-3 w-3 text-gray-400" />
              <span className="text-xs font-medium text-gray-600">Recent</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {searchStore.recentSearches.slice(0, 5).map((query, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSearchChange(query)}
                  className="h-6 px-2 py-0 text-xs"
                >
                  {query}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        {showResults && (
          <div className="border rounded-lg bg-white shadow-sm max-h-80 overflow-hidden">
            <div className="border-b bg-gray-50 px-3 py-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Search Results
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowResults(false)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <ScrollArea className="max-h-64">
              {isSearching ? (
                <div className="p-4 space-y-3">
                  {Array.from({ length: 3 }, (_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : searchResults && searchResults.length > 0 ? (
                <div className="divide-y">
                  {searchResults.map((result, index) => (
                    <button
                      key={index}
                      onClick={() => handleResultSelect(result)}
                      className="w-full p-3 text-left hover:bg-gray-50 focus:bg-blue-50 focus:outline-none transition-colors"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getResultIcon(result.result_type)}
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-900 truncate">
                              {result.title}
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              {getResultTypeLabel(result.result_type)}
                            </Badge>
                          </div>

                          {result.code && (
                            <div className="text-xs font-mono text-blue-600">
                              {result.code}
                            </div>
                          )}

                          {result.description && (
                            <div className="text-xs text-gray-600 line-clamp-2">
                              {result.description}
                            </div>
                          )}

                          {/* Context breadcrumb */}
                          {(result.model_code || result.system_code || result.component_code) && (
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                              {result.model_code && (
                                <>
                                  <span>{result.model_code}</span>
                                  {(result.system_code || result.component_code) && <span>›</span>}
                                </>
                              )}
                              {result.system_code && (
                                <>
                                  <span>{result.system_code}</span>
                                  {result.component_code && <span>›</span>}
                                </>
                              )}
                              {result.component_code && <span>{result.component_code}</span>}
                            </div>
                          )}
                        </div>

                        {/* Relevance score visualization */}
                        <div className="flex-shrink-0">
                          <div className="w-1 h-8 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="bg-blue-500 rounded-full transition-all"
                              style={{
                                height: `${Math.min(result.rank * 100, 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-sm text-gray-500">
                  {searchStore.query.length > 2
                    ? `No results found for "${searchStore.query}"`
                    : 'Type at least 3 characters to search'
                  }
                </div>
              )}
            </ScrollArea>

            {/* Search Footer */}
            {searchResults && searchResults.length > 0 && (
              <div className="border-t bg-gray-50 px-3 py-2">
                <div className="text-xs text-gray-600 text-center">
                  Found {searchResults.length} results for "{searchStore.query}"
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};