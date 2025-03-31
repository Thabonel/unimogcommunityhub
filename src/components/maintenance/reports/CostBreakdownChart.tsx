
import { PieChart } from '@/components/ui/chart';

interface CostBreakdownChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
      borderColor: string[];
      borderWidth: number;
    }[];
  };
}

export function CostBreakdownChart({ data }: CostBreakdownChartProps) {
  return (
    <>
      <div className="h-[400px] w-full">
        <PieChart 
          data={data} 
          className="h-full w-full"
        />
      </div>
      <div className="mt-4 text-sm text-muted-foreground text-center">
        <p>Breakdown of maintenance expenses by category</p>
      </div>
    </>
  );
}
