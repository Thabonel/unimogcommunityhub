
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

export interface SearchResult {
  pageIndex: number;
  matches: Array<{ transform: number[] }>;
}

interface UsePdfSearchProps {
  pdfDoc: any | null;
  numPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

export function usePdfSearch({ pdfDoc, numPages, currentPage, setCurrentPage }: UsePdfSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Array<SearchResult>>([]);
  const [currentSearchResultIndex, setCurrentSearchResultIndex] = useState(0);
  const [searchResultsCount, setSearchResultsCount] = useState(0);

  const handleSearch = async (term: string) => {
    if (!term.trim() || !pdfDoc) {
      setSearchResults([]);
      setSearchResultsCount(0);
      setCurrentSearchResultIndex(0);
      return;
    }

    try {
      setSearchTerm(term);

      // Search through all pages
      let allResults: Array<SearchResult> = [];
      let totalMatchesCount = 0;

      toast({
        title: "Searching",
        description: "Looking for matches in the document...",
      });

      for (let i = 1; i <= numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const textContent = await page.getTextContent();
        
        // Find matches in the text content
        const pageMatches: Array<{ transform: number[] }> = [];
        
        for (const item of textContent.items) {
          const text = item.str as string;
          if (text.toLowerCase().includes(term.toLowerCase())) {
            // Store the position information
            pageMatches.push({
              transform: item.transform,
            });
          }
        }
        
        if (pageMatches.length > 0) {
          allResults.push({
            pageIndex: i,
            matches: pageMatches,
          });
          totalMatchesCount += pageMatches.length;
        }
      }

      setSearchResults(allResults);
      setSearchResultsCount(totalMatchesCount);
      setCurrentSearchResultIndex(0);
      
      // Navigate to the first result if there are results
      if (totalMatchesCount > 0) {
        const firstResult = allResults[0];
        setCurrentPage(firstResult.pageIndex);
        
        toast({
          title: "Search complete",
          description: `Found ${totalMatchesCount} matches`,
        });
      } else {
        toast({
          title: "No results",
          description: "No matches found for your search term",
        });
      }
    } catch (error) {
      console.error('Error searching PDF:', error);
      toast({
        title: 'Search failed',
        description: 'An error occurred during search',
        variant: 'destructive'
      });
    }
  };

  const navigateToNextResult = () => {
    if (searchResultsCount === 0) return;
    
    const newIndex = (currentSearchResultIndex + 1) % searchResultsCount;
    setCurrentSearchResultIndex(newIndex);
    
    // Find which page this result is on
    let countSoFar = 0;
    for (const pageResult of searchResults) {
      const matchesOnThisPage = pageResult.matches.length;
      if (countSoFar + matchesOnThisPage > newIndex) {
        // This result is on this page
        setCurrentPage(pageResult.pageIndex);
        break;
      }
      countSoFar += matchesOnThisPage;
    }
  };

  const navigateToPrevResult = () => {
    if (searchResultsCount === 0) return;
    
    const newIndex = (currentSearchResultIndex - 1 + searchResultsCount) % searchResultsCount;
    setCurrentSearchResultIndex(newIndex);
    
    // Find which page this result is on
    let countSoFar = 0;
    for (const pageResult of searchResults) {
      const matchesOnThisPage = pageResult.matches.length;
      if (countSoFar + matchesOnThisPage > newIndex) {
        // This result is on this page
        setCurrentPage(pageResult.pageIndex);
        break;
      }
      countSoFar += matchesOnThisPage;
    }
  };

  return {
    searchTerm,
    searchResults,
    currentSearchResultIndex,
    searchResultsCount,
    handleSearch,
    navigateToNextResult,
    navigateToPrevResult,
  };
}
