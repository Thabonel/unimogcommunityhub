
import { RefreshCw } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { CommunityTimeframe } from '@/services/analytics/types/communityHealthTypes';

interface MetricsTimeframeSelectorProps {
  timeframe: CommunityTimeframe;
  onTimeframeChange: (value: CommunityTimeframe) => void;
  onRefresh: () => void;
}

export function MetricsTimeframeSelector({ 
  timeframe, 
  onTimeframeChange, 
  onRefresh 
}: MetricsTimeframeSelectorProps) {
  return (
    <div className="flex items-center space-x-2">
      <Select 
        value={timeframe} 
        onValueChange={(value: any) => onTimeframeChange(value)}
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Timeframe" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="day">Daily</SelectItem>
          <SelectItem value="week">Weekly</SelectItem>
          <SelectItem value="month">Monthly</SelectItem>
          <SelectItem value="quarter">Quarterly</SelectItem>
        </SelectContent>
      </Select>
      
      <Button 
        variant="outline" 
        size="icon" 
        onClick={onRefresh}
      >
        <RefreshCw className="h-4 w-4" />
      </Button>
    </div>
  );
}
