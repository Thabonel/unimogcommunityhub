
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
          placeholder="Search users, manuals, posts, marketplace... (⌘K)"
          value={searchQuery}
          onValueChange={setSearchQuery}
          className="border-0 border-b border-border focus:ring-0 text-base"
        />
        <CommandList className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-muted">
          {isLoadingAll && searchQuery.length >= 2 && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin mb-3 text-primary" />
              <span className="text-sm text-muted-foreground">Searching across all content...</span>
            </div>
          )}

          {!isLoadingAll && searchQuery.length >= 2 && allResults.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-6xl mb-4 opacity-20">🔍</div>
              <div className="text-center">
                <div className="font-medium mb-1">No results found</div>
                <div className="text-sm text-muted-foreground">
                  No matches for "{searchQuery}" - try different keywords
                </div>
              </div>
            </div>
          )}

          {!isLoadingAll && allResults.length > 0 && (
            <CommandGroup heading={`${allResults.length} Results`} className="p-2">
              {allResults.map((result) => (
                <CommandItem
                  key={`${result.type}-${result.id}`}
                  onSelect={() => handleSelectResult(result.url)}
                  className="flex items-start gap-3 p-3 rounded-md cursor-pointer hover:bg-accent/50 transition-colors duration-150"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 shrink-0 mt-0.5">
                    <span className="text-lg">{result.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="font-medium text-sm leading-tight truncate">
                      {result.title}
                    </div>
                    {result.subtitle && (
                      <div className="text-xs text-muted-foreground truncate font-medium">
                        {result.subtitle}
                      </div>
                    )}
                    {result.snippet && (
                      <div className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {result.snippet}
                      </div>
                    )}
                    <div className="flex items-center gap-2 pt-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary/50 text-secondary-foreground capitalize">
                        {result.type}
                      </span>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {searchQuery.length < 2 && (
            <>
              <div className="px-4 py-3 text-center">
                <div className="text-2xl mb-2">⌘</div>
                <div className="text-sm text-muted-foreground">
                  Start typing to search everything
                </div>
              </div>
              <CommandGroup heading="Quick Access" className="p-2">
                <CommandItem
                  onSelect={() => {
                    navigate('/community');
                    setOpen(false);
                  }}
                  className="flex items-center gap-3 p-3 rounded-md cursor-pointer hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <span>💬</span>
                  </div>
                  <div>
                    <div className="font-medium">Community</div>
                    <div className="text-xs text-muted-foreground">Posts and discussions</div>
                  </div>
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    navigate('/knowledge/manuals');
                    setOpen(false);
                  }}
                  className="flex items-center gap-3 p-3 rounded-md cursor-pointer hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30">
                    <span>📖</span>
                  </div>
                  <div>
                    <div className="font-medium">Technical Manuals</div>
                    <div className="text-xs text-muted-foreground">45+ Unimog manuals</div>
                  </div>
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    navigate('/marketplace');
                    setOpen(false);
                  }}
                  className="flex items-center gap-3 p-3 rounded-md cursor-pointer hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30">
                    <span>🛒</span>
                  </div>
                  <div>
                    <div className="font-medium">Marketplace</div>
                    <div className="text-xs text-muted-foreground">Parts and vehicles</div>
                  </div>
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    navigate('/trips');
                    setOpen(false);
                  }}
                  className="flex items-center gap-3 p-3 rounded-md cursor-pointer hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30">
                    <span>🗺️</span>
                  </div>
                  <div>
                    <div className="font-medium">Trip Planner</div>
                    <div className="text-xs text-muted-foreground">Routes and navigation</div>
                  </div>
                </CommandItem>
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};
