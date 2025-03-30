
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import { ReactNode } from 'react';

interface TrendIndicator {
  icon: ReactNode;
  color: string;
  text: string;
}

interface KeyMetricCardProps {
  title: string;
  value: string | number;
  badge: ReactNode;
}

export function KeyMetricCard({ title, value, badge }: KeyMetricCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
          </div>
          {badge}
        </div>
      </CardContent>
    </Card>
  );
}

export function getTrendIndicator(current: number, previous: number) {
  const percentChange = previous > 0 ? ((current - previous) / previous) * 100 : 0;
  
  if (Math.abs(percentChange) < 2) { // Less than 2% change
    return {
      icon: <Minus className="h-4 w-4 text-gray-500" />,
      color: 'text-gray-500',
      text: 'No change'
    };
  } else if (percentChange > 0) {
    return {
      icon: <ArrowUpRight className="h-4 w-4 text-green-500" />,
      color: 'text-green-500',
      text: `+${percentChange.toFixed(1)}%`
    };
  } else {
    return {
      icon: <ArrowDownRight className="h-4 w-4 text-red-500" />,
      color: 'text-red-500',
      text: `${percentChange.toFixed(1)}%`
    };
  }
}
