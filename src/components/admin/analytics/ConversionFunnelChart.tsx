
import React from 'react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ChartDataPoint {
  date: string;
  visitors: number;
  signups: number;
  trials: number;
  subscriptions: number;
}

interface ConversionFunnelChartProps {
  data: ChartDataPoint[];
  chartType: 'line' | 'bar' | 'area';
}

export const ConversionFunnelChart: React.FC<ConversionFunnelChartProps> = ({ data, chartType }) => {
  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return (
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
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
            <Bar dataKey="visitors" fill="#8884d8" name="Visitors" />
            <Bar dataKey="signups" fill="#82ca9d" name="Signups" />
            <Bar dataKey="trials" fill="#ffc658" name="Trials Started" />
            <Bar dataKey="subscriptions" fill="#ff8042" name="Subscriptions" />
          </BarChart>
        );
      
      case 'area':
        return (
          <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
            <defs>
              <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorTrials" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#ffc658" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorSubs" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff8042" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#ff8042" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
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
            <Area 
              type="monotone" 
              dataKey="visitors" 
              stroke="#8884d8" 
              fillOpacity={1} 
              fill="url(#colorVisitors)" 
              name="Visitors"
            />
            <Area 
              type="monotone" 
              dataKey="signups" 
              stroke="#82ca9d" 
              fillOpacity={1} 
              fill="url(#colorSignups)" 
              name="Signups"
            />
            <Area 
              type="monotone" 
              dataKey="trials" 
              stroke="#ffc658" 
              fillOpacity={1} 
              fill="url(#colorTrials)" 
              name="Trials Started"
            />
            <Area 
              type="monotone" 
              dataKey="subscriptions" 
              stroke="#ff8042" 
              fillOpacity={1} 
              fill="url(#colorSubs)" 
              name="Subscriptions"
            />
          </AreaChart>
        );
      
      default: // line chart (default)
        return (
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
        );
    }
  };

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};
