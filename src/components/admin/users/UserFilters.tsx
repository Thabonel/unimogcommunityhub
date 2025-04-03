
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export interface FilterOption {
  key: string;
  label: string;
  options: {
    value: string;
    label: string;
  }[];
}

interface UserFiltersProps {
  filterOptions: FilterOption[];
  onFilterChange: (filters: Record<string, string | null>) => void;
}

export function UserFilters({ filterOptions, onFilterChange }: UserFiltersProps) {
  const [activeFilters, setActiveFilters] = useState<Record<string, string | null>>({});

  const handleFilterChange = (key: string, value: string | null) => {
    const newFilters = {
      ...activeFilters,
      [key]: value,
    };
    
    // Remove null values
    if (value === null) {
      delete newFilters[key];
    }
    
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    setActiveFilters({});
    onFilterChange({});
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {filterOptions.map((filterOption) => (
          <Select 
            key={filterOption.key}
            value={activeFilters[filterOption.key] || ""}
            onValueChange={(value) => handleFilterChange(filterOption.key, value === "" ? null : value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={filterOption.label} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any {filterOption.label}</SelectItem>
              {filterOption.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}
        
        {Object.keys(activeFilters).length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearAllFilters}
            className="text-muted-foreground"
          >
            Clear all
          </Button>
        )}
      </div>

      {Object.keys(activeFilters).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(activeFilters).map(([key, value]) => {
            const filterOption = filterOptions.find(opt => opt.key === key);
            const optionLabel = filterOption?.options.find(opt => opt.value === value)?.label || value;
            
            return (
              <Badge key={key} variant="secondary" className="px-2 py-1">
                {filterOption?.label}: {optionLabel}
                <button 
                  onClick={() => handleFilterChange(key, null)} 
                  className="ml-1 hover:text-destructive"
                  aria-label={`Remove ${filterOption?.label} filter`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}
