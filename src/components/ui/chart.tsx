
import React, { ReactElement, useEffect, useRef } from 'react';
import { 
  Chart as ChartJS, 
  ChartType, 
  ChartData, 
  ChartOptions,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export interface ChartContainerProps {
  config: Record<string, { color: string }>;
  children: React.ReactNode;
}

export function ChartContainer({ children, config }: ChartContainerProps) {
  return <div className="relative">{children}</div>;
}

export interface ChartTooltipProps {
  content: React.ReactNode;
}

export function ChartTooltip({ content }: ChartTooltipProps) {
  return <div className="chart-tooltip">{content}</div>;
}

export function ChartTooltipContent() {
  return <div className="chart-tooltip-content"></div>;
}

interface ChartConfig {
  type: ChartType;
  options?: ChartOptions;
}

interface ChartProps {
  data: ChartData;
  config?: ChartConfig;
  className?: string;
  children?: ReactElement;
}

const ChartComponent = ({ data, className, children, config }: ChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<ChartJS | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Destroy existing chart
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Create new chart
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      chartRef.current = new ChartJS(ctx, {
        type: config?.type || 'bar',
        data,
        options: config?.options || {}
      });
    }

    // Cleanup
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data, config]);

  return <canvas ref={canvasRef} className={className} />;
};

export const BarChart = ({ data, className, children }: ChartProps) => (
  <ChartComponent 
    data={data}
    config={{ 
      type: 'bar', 
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    }}
    className={className}
    children={children}
  />
);

export const LineChart = ({ data, className, children }: ChartProps) => (
  <ChartComponent 
    data={data}
    config={{ 
      type: 'line', 
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    }}
    className={className}
    children={children}
  />
);

export const PieChart = ({ data, className, children }: ChartProps) => (
  <ChartComponent 
    data={data}
    config={{ 
      type: 'pie', 
      options: {
        responsive: true
      }
    }}
    className={className}
    children={children}
  />
);

export default ChartComponent;
