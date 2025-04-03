
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ChartDataPoint {
  date: string;
  visitors: number;
  signups: number;
  trials: number;
  subscriptions: number;
}

interface ConversionFunnelChartProps {
  data: ChartDataPoint[];
}

export const ConversionFunnelChart: React.FC<ConversionFunnelChartProps> = ({ data }) => {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            angle={-45} 
            textAnchor="end" 
            height={60} 
            tick={{ fontSize: 12 }}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="visitors" 
            stroke="#8884d8" 
            name="Visitors"
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="signups" 
            stroke="#82ca9d" 
            name="Signups"
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="trials" 
            stroke="#ffc658" 
            name="Trials Started"
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="subscriptions" 
            stroke="#ff8042" 
            name="Subscriptions"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
