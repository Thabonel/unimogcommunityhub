
import { useState } from 'react';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { TransactionFilters as FiltersType, TransactionType } from '@/types/marketplace';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TransactionFiltersProps {
  filters: FiltersType;
  onUpdateFilters: (filters: Partial<FiltersType>) => void;
  onResetFilters: () => void;
}

export function TransactionFilters({
  filters,
  onUpdateFilters,
  onResetFilters,
}: TransactionFiltersProps) {
  const [dateFrom, setDateFrom] = useState<Date | undefined>(filters.dateFrom);
  const [dateTo, setDateTo] = useState<Date | undefined>(filters.dateTo);

  const handleTypeChange = (value: string) => {
    onUpdateFilters({
      type: value === 'all' ? 'all' : (value as TransactionType),
    });
  };

  const handleDateFromChange = (date: Date | undefined) => {
    setDateFrom(date);
    onUpdateFilters({ dateFrom: date });
  };

  const handleDateToChange = (date: Date | undefined) => {
    setDateTo(date);
    onUpdateFilters({ dateTo: date });
  };

  const hasActiveFilters = 
    filters.type !== 'all' || 
    filters.dateFrom !== undefined || 
    filters.dateTo !== undefined ||
    filters.status !== undefined;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 pb-6 border-b">
      <div className="flex-1 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <Select
          value={filters.type?.toString() || 'all'}
          onValueChange={handleTypeChange}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Transaction type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Transactions</SelectItem>
            <SelectItem value="purchase">Purchases</SelectItem>
            <SelectItem value="sale">Sales</SelectItem>
            <SelectItem value="commission">Commission Fees</SelectItem>
            <SelectItem value="refund">Refunds</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full sm:w-[160px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateFrom ? format(dateFrom, "MMM d, yyyy") : "From date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateFrom}
                onSelect={handleDateFromChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full sm:w-[160px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateTo ? format(dateTo, "MMM d, yyyy") : "To date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateTo}
                onSelect={handleDateToChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {hasActiveFilters && (
        <Button variant="outline" onClick={onResetFilters} className="whitespace-nowrap">
          Clear filters
        </Button>
      )}
    </div>
  );
}
