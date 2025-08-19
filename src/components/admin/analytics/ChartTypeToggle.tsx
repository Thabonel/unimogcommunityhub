
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ChartBarIcon, LineChart, AreaChart } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ChartTypeToggleProps {
  value: 'line' | 'bar' | 'area';
  onValueChange: (value: 'line' | 'bar' | 'area') => void;
}

export const ChartTypeToggle: React.FC<ChartTypeToggleProps> = ({ value, onValueChange }) => {
  return (
    <TooltipProvider delayDuration={300}>
      <ToggleGroup 
        type="single" 
        value={value} 
        onValueChange={(val) => {
          if (val) onValueChange(val as 'line' | 'bar' | 'area');
        }}
        className="border rounded-md"
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <ToggleGroupItem value="line" aria-label="View as line chart" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
              <LineChart className="h-4 w-4" />
            </ToggleGroupItem>
          </TooltipTrigger>
          <TooltipContent>Line Chart</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <ToggleGroupItem value="bar" aria-label="View as bar chart" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
              <ChartBarIcon className="h-4 w-4" />
            </ToggleGroupItem>
          </TooltipTrigger>
          <TooltipContent>Bar Chart</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <ToggleGroupItem value="area" aria-label="View as area chart" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
              <AreaChart className="h-4 w-4" />
            </ToggleGroupItem>
          </TooltipTrigger>
          <TooltipContent>Area Chart</TooltipContent>
        </Tooltip>
      </ToggleGroup>
    </TooltipProvider>
  );
};
