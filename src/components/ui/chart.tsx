
import React, { ReactElement, useEffect, useRef } from 'react';
import Chart, { ChartConfiguration, ChartType, ChartData } from 'chart.js/auto';

interface ChartConfig {
  type: ChartType;
  options?: any;
}

interface ChartProps {
  data: ChartData;
  config?: ChartConfig;
  className?: string;
  children: ReactElement;
}

const ChartComponent = ({ data, className, children, config }: ChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Destroy existing chart
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Create new chart
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      chartRef.current = new Chart(ctx, {
        type: config?.type || 'bar',
        data,
        options: config?.options || {}
      } as ChartConfiguration);
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
    config={{ type: 'bar', options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }}}
    className={className}
  >
    {children}
  </ChartComponent>
);

export const LineChart = ({ data, className, children }: ChartProps) => (
  <ChartComponent 
    data={data}
    config={{ type: 'line', options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }}}
    className={className}
  >
    {children}
  </ChartComponent>
);

export const PieChart = ({ data, className, children }: ChartProps) => (
  <ChartComponent 
    data={data}
    config={{ type: 'pie', options: {
      responsive: true
    }}}
    className={className}
  >
    {children}
  </ChartComponent>
);

export default ChartComponent;
