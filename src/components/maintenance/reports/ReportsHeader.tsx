
import { CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface ReportsHeaderProps {
  timeRange: string;
  setTimeRange: (value: string) => void;
}

export function ReportsHeader({ timeRange, setTimeRange }: ReportsHeaderProps) {
  return (
    <CardHeader className="pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <CardTitle>Maintenance Reports</CardTitle>
      <div className="flex gap-2 mt-2 sm:mt-0">
        <Select
          value={timeRange}
          onValueChange={setTimeRange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3months">Last 3 months</SelectItem>
            <SelectItem value="6months">Last 6 months</SelectItem>
            <SelectItem value="year">Last year</SelectItem>
            <SelectItem value="all">All time</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>
    </CardHeader>
  );
}
