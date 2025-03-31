
import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { marketplaceCategories, listingConditions } from '@/types/marketplace';
import { ListingFilters, useSearchFilters } from '@/hooks/use-marketplace';

export function MarketplaceSearch() {
  const { filters, updateFilters, resetFilters } = useSearchFilters();
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
  // Count active filters
  const activeFilterCount = Object.values(filters).filter(Boolean).length;
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ searchTerm });
  };
  
  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };
  
  const applyFilters = () => {
    updateFilters({
      minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
      maxPrice: priceRange[1] < 100000 ? priceRange[1] : undefined,
    });
    setIsFiltersOpen(false);
  };
  
  const clearFilters = () => {
    resetFilters();
    setPriceRange([0, 100000]);
    setSearchTerm('');
  };
  
  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          className="pl-10 pr-24"
          placeholder="Search listings..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button type="submit" size="sm" className="absolute right-1 top-1/2 transform -translate-y-1/2">
          Search
        </Button>
      </form>
      
      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={filters.category || ''}
          onValueChange={(value) => updateFilters({ category: value || undefined })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {marketplaceCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select
          value={filters.condition || ''}
          onValueChange={(value) => updateFilters({ condition: value as ListingFilters['condition'] || undefined })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Any Condition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any Condition</SelectItem>
            {listingConditions.map((condition) => (
              <SelectItem key={condition} value={condition}>
                {condition}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Popover open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Filter className="h-4 w-4" />
              <span>Price</span>
              {(filters.minPrice !== undefined || filters.maxPrice !== undefined) && (
                <Badge variant="secondary" className="ml-1 rounded-full px-1 text-xs">
                  {filters.minPrice !== undefined && filters.maxPrice !== undefined
                    ? `$${filters.minPrice}-$${filters.maxPrice}`
                    : filters.minPrice !== undefined
                    ? `>$${filters.minPrice}`
                    : `<$${filters.maxPrice}`}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <h4 className="font-medium">Price Range</h4>
              <div className="px-2">
                <Slider
                  defaultValue={[0, 100000]}
                  value={priceRange}
                  min={0}
                  max={100000}
                  step={100}
                  minStepsBetweenThumbs={10}
                  onValueChange={handlePriceChange}
                />
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-muted-foreground mr-1">$</span>
                  <Input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="w-24 h-8"
                  />
                </div>
                <span className="text-muted-foreground">to</span>
                <div className="flex items-center">
                  <span className="text-muted-foreground mr-1">$</span>
                  <Input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-24 h-8"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsFiltersOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={applyFilters}>
                  Apply
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
}
