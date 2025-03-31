
import { Search, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface PdfSearchBarProps {
  searchTerm: string;
  searchResultsCount: number;
  currentSearchResultIndex: number;
  onSearch: (searchTerm: string) => void;
  onNextResult: () => void;
  onPrevResult: () => void;
}

export function PdfSearchBar({
  searchTerm,
  searchResultsCount,
  currentSearchResultIndex,
  onSearch,
  onNextResult,
  onPrevResult
}: PdfSearchBarProps) {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(localSearchTerm);
  };

  return (
    <form onSubmit={handleSearchSubmit} className="w-full mb-2 flex items-center gap-2">
      <div className="flex-1 relative">
        <Input
          type="text"
          placeholder="Search in document"
          value={localSearchTerm}
          onChange={handleSearchChange}
          className="w-full"
          startIcon={<Search size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />}
        />
        {searchResultsCount > 0 && (
          <span className="absolute right-10 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            {currentSearchResultIndex + 1}/{searchResultsCount}
          </span>
        )}
      </div>
      <Button
        type="submit"
        variant="outline"
        size="sm"
      >
        <span className="sr-only md:not-sr-only md:mr-1">Search</span>
        <Search size={16} className="md:hidden" />
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onPrevResult}
        disabled={searchResultsCount === 0}
      >
        <ArrowUp size={16} />
        <span className="sr-only">Previous result</span>
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onNextResult}
        disabled={searchResultsCount === 0}
      >
        <ArrowDown size={16} />
        <span className="sr-only">Next result</span>
      </Button>
    </form>
  );
}
