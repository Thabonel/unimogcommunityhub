
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface PdfSearchBarProps {
  searchTerm: string;
  searchResultsCount: number;
  currentSearchResultIndex: number;
  onSearchChange: (term: string) => void;
  onNextResult: () => void;
  onPrevResult: () => void;
}

export const PdfSearchBar: React.FC<PdfSearchBarProps> = ({
  searchTerm,
  searchResultsCount,
  currentSearchResultIndex,
  onSearchChange,
  onNextResult,
  onPrevResult
}) => {
  return (
    <div className="flex items-center justify-between w-full mb-2 bg-background/90 rounded-md p-1">
      <div className="flex items-center flex-1 relative">
        <Input
          type="text"
          placeholder="Search in document"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-8 h-8 text-sm"
        />
        <Search size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        
        {searchResultsCount > 0 && (
          <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
            {currentSearchResultIndex + 1}/{searchResultsCount}
          </span>
        )}
      </div>
      
      <div className="flex items-center space-x-1 ml-2">
        <Button 
          variant="outline" 
          size="sm"
          className="h-8 px-2"
          onClick={onPrevResult} 
          disabled={searchResultsCount === 0}
        >
          <span className="sr-only">Previous result</span>
          ↑
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className="h-8 px-2"
          onClick={onNextResult} 
          disabled={searchResultsCount === 0}
        >
          <span className="sr-only">Next result</span>
          ↓
        </Button>
      </div>
    </div>
  );
};
