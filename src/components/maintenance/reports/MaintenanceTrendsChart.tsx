
import { LineChart } from '@/components/ui/chart';

interface MaintenanceTrendsChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      fill: boolean;
      borderColor: string;
      tension: number;
    }[];
  };
}

export function MaintenanceTrendsChart({ data }: MaintenanceTrendsChartProps) {
  return (
    <>
      <div className="h-[400px] w-full">
        <LineChart 
          data={data} 
          className="h-full w-full"
        />
      </div>
      <div className="mt-4 text-sm text-muted-foreground text-center">
        <p>Maintenance costs and frequency over time</p>
      </div>
    </>
  );
}
