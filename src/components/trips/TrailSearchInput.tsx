import { useState, useCallback, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Search, Loader2, MapPin } from 'lucide-react';
import { searchTrails, GeoJSONFeature } from '@/services/trailService';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TrailSearchInputProps {
  onSearchResults: (trails: GeoJSONFeature[]) => void;
  onSearchStart?: () => void;
}

const REGIONS = {
  australia: { name: 'Australia', south: -45, west: 110, north: -10, east: 155 },
  europe: { name: 'Europe', south: 35, west: -10, north: 71, east: 40 },
  north_america: { name: 'North America', south: 15, west: -170, north: 72, east: -50 },
  south_america: { name: 'South America', south: -56, west: -82, north: 13, east: -34 },
  africa: { name: 'Africa', south: -35, west: -18, north: 38, east: 52 },
  asia: { name: 'Asia', south: -10, west: 25, north: 75, east: 150 },
  worldwide: { name: 'Worldwide', south: -90, west: -180, north: 90, east: 180 }
};

export function TrailSearchInput({ onSearchResults, onSearchStart }: TrailSearchInputProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<keyof typeof REGIONS>('australia');
  const [isSearching, setIsSearching] = useState(false);
  const debounceTimerRef = useRef<number | null>(null);

  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      return;
    }

    setIsSearching(true);
    onSearchStart?.();

    try {
      const region = REGIONS[selectedRegion];
      const { trails, error } = await searchTrails(query, {
        north: region.north,
        south: region.south,
        east: region.east,
        west: region.west
      });

      if (error) {
        toast.error(`Search failed: ${error}`);
        return;
      }

      if (trails.length === 0) {
        toast.info(`No trails found for "${query}" in ${region.name}`);
      } else {
        toast.success(`Found ${trails.length} trail${trails.length > 1 ? 's' : ''}`);
      }

      onSearchResults(trails);
    } catch (error) {
      console.error('Trail search error:', error);
      toast.error('Failed to search for trails. Please try again.');
    } finally {
      setIsSearching(false);
    }
  }, [selectedRegion, onSearchResults, onSearchStart]);

  const handleSearch = useCallback(() => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a trail name to search');
      return;
    }
    performSearch(searchQuery);
  }, [searchQuery, performSearch]);

  const handleSearchQueryChange = useCallback((value: string) => {
    setSearchQuery(value);

    if (debounceTimerRef.current !== null) {
      window.clearTimeout(debounceTimerRef.current);
    }

    if (value.trim().length >= 3) {
      debounceTimerRef.current = window.setTimeout(() => {
        performSearch(value);
      }, 500);
    }
  }, [performSearch]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current !== null) {
        window.clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSearching) {
      handleSearch();
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="trail-search">Trail Name</Label>
        <div className="flex gap-2">
          <Input
            id="trail-search"
            type="text"
            placeholder="e.g., Monkey Gum Trail"
            value={searchQuery}
            onChange={(e) => handleSearchQueryChange(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isSearching}
            className="flex-1"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="region-select">Search Region</Label>
        <Select
          value={selectedRegion}
          onValueChange={(value) => setSelectedRegion(value as keyof typeof REGIONS)}
          disabled={isSearching}
        >
          <SelectTrigger id="region-select">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(REGIONS).map(([key, region]) => (
              <SelectItem key={key} value={key}>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {region.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        onClick={handleSearch}
        disabled={isSearching || !searchQuery.trim()}
        className="w-full"
      >
        {isSearching ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Searching...
          </>
        ) : (
          <>
            <Search className="mr-2 h-4 w-4" />
            Search Trails
          </>
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Search powered by OpenStreetMap - Free & Open Data
      </p>
    </div>
  );
}
