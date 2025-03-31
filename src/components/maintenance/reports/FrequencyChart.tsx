
import { BarChart } from '@/components/ui/chart';

interface FrequencyChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
    }[];
  };
}

export function FrequencyChart({ data }: FrequencyChartProps) {
  return (
    <>
      <div className="h-[400px] w-full">
        <BarChart 
          data={data} 
          className="h-full w-full"
        />
      </div>
      <div className="mt-4 text-sm text-muted-foreground text-center">
        <p>Number of maintenance events by month</p>
      </div>
    </>
  );
}
