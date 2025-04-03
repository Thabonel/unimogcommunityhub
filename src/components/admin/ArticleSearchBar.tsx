
import { Input } from "@/components/ui/input";
import { DateRangePicker } from "@/components/admin/DateRangePicker";
import { type DateRange } from "react-day-picker";
import { Search } from "lucide-react";

interface ArticleSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange | undefined) => void;
}

export function ArticleSearchBar({
  searchQuery,
  onSearchChange,
  dateRange,
  onDateRangeChange,
}: ArticleSearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-2">
      <div className="relative w-full sm:w-1/2">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search articles by title, excerpt or category..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <DateRangePicker
        date={dateRange}
        onChange={onDateRangeChange}
      />
    </div>
  );
}
