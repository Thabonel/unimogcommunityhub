
import { Search } from 'lucide-react';
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

interface SearchBarProps {
  className?: string;
}

export const SearchBar = ({ className = "" }: SearchBarProps) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
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
          placeholder="Search users, posts..." 
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem onSelect={() => {
              navigate('/search?q=unimog&tab=users');
              setOpen(false);
            }}>
              <Search className="mr-2 h-4 w-4" />
              <span>Unimog owners</span>
            </CommandItem>
            <CommandItem onSelect={() => {
              navigate('/search?q=maintenance&tab=posts');
              setOpen(false);
            }}>
              <Search className="mr-2 h-4 w-4" />
              <span>Maintenance posts</span>
            </CommandItem>
            <CommandItem onSelect={() => {
              navigate('/search?q=modifications&tab=posts');
              setOpen(false);
            }}>
              <Search className="mr-2 h-4 w-4" />
              <span>Modifications posts</span>
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Pages">
            <CommandItem onSelect={() => {
              navigate('/community');
              setOpen(false);
            }}>
              Community
            </CommandItem>
            <CommandItem onSelect={() => {
              navigate('/knowledge');
              setOpen(false);
            }}>
              Knowledge Base
            </CommandItem>
            <CommandItem onSelect={() => {
              navigate('/marketplace');
              setOpen(false);
            }}>
              Marketplace
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};
