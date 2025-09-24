
import { Search, Loader2 } from 'lucide-react';
import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandEmpty
} from '@/components/ui/command';
import { useSearchResults } from '@/hooks/use-search-results';

interface SearchBarProps {
  className?: string;
}

export const SearchBar = ({ className = "" }: SearchBarProps) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);

  // Use the search hook to get real-time results
  const { allResults, isLoadingAll } = useSearchResults(searchQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Open the modal instead of navigating
    setOpen(true);
  };

  const handleSelectResult = (url: string) => {
    setOpen(false);
    setSearchQuery('');
    navigate(url);
  };

  // Close the command dialog when pressing escape
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      setOpen(prev => !prev);
    }
  }, []);

  // Add keyboard shortcut listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      <form onSubmit={handleSearch} className={`relative ${className}`}>
        <input
          type="text"
          placeholder="Search... (⌘K)"
          className="w-32 md:w-64 h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClick={() => setOpen(true)}
        />
        <button 
          type="submit" 
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <Search size={18} />
        </button>
      </form>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search everything... (⌘K)"
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          {isLoadingAll && searchQuery.length >= 2 && (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span className="text-sm text-muted-foreground">Searching...</span>
            </div>
          )}

          {!isLoadingAll && searchQuery.length >= 2 && allResults.length === 0 && (
            <CommandEmpty>No results found for "{searchQuery}"</CommandEmpty>
          )}

          {!isLoadingAll && allResults.length > 0 && (
            <CommandGroup heading="Results">
              {allResults.map((result) => (
                <CommandItem
                  key={`${result.type}-${result.id}`}
                  onSelect={() => handleSelectResult(result.url)}
                  className="flex items-start gap-3 p-3"
                >
                  <span className="text-lg shrink-0">{result.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{result.title}</div>
                    {result.subtitle && (
                      <div className="text-xs text-muted-foreground truncate">
                        {result.subtitle}
                      </div>
                    )}
                    {result.snippet && (
                      <div className="text-xs text-muted-foreground line-clamp-1 mt-1">
                        {result.snippet}
                      </div>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {searchQuery.length < 2 && (
            <>
              <CommandGroup heading="Quick Access">
                <CommandItem onSelect={() => {
                  navigate('/community');
                  setOpen(false);
                }}>
                  <span className="mr-3">💬</span>
                  Community
                </CommandItem>
                <CommandItem onSelect={() => {
                  navigate('/knowledge/manuals');
                  setOpen(false);
                }}>
                  <span className="mr-3">📖</span>
                  Technical Manuals
                </CommandItem>
                <CommandItem onSelect={() => {
                  navigate('/marketplace');
                  setOpen(false);
                }}>
                  <span className="mr-3">🛒</span>
                  Marketplace
                </CommandItem>
                <CommandItem onSelect={() => {
                  navigate('/trips');
                  setOpen(false);
                }}>
                  <span className="mr-3">🗺️</span>
                  Trip Planner
                </CommandItem>
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};
