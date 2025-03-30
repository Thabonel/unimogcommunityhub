
import { Input } from "@/components/ui/input";
import { DateRangePicker } from "@/components/admin/DateRangePicker";
import { type DateRange } from "react-day-picker";

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
    <div className="flex items-center justify-between mb-4">
      <Input
        type="text"
        placeholder="Search articles..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <DateRangePicker
        date={dateRange}
        onChange={onDateRangeChange}
      />
    </div>
  );
}
