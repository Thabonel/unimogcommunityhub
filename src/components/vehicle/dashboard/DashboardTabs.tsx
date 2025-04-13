
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Gauge, Calendar, Fuel, FileText } from 'lucide-react';

interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const DashboardTabs = ({ activeTab, onTabChange }: DashboardTabsProps) => {
  return (
    <TabsList className="grid grid-cols-4 mb-8 p-0 gap-1 bg-transparent">
      <TabsTrigger 
        value="overview" 
        className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium text-white"
        style={{ 
          backgroundColor: '#7d6245', 
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <Gauge size={16} />
        OVERVIEW
      </TabsTrigger>
      <TabsTrigger 
        value="maintenance" 
        className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium text-white"
        style={{ 
          backgroundColor: '#4c571f', 
          border: '1px solid rgba(255, 255, 255, 0.1)' 
        }}
      >
        <Calendar size={16} />
        MAINTENANCE
      </TabsTrigger>
      <TabsTrigger 
        value="fuel" 
        className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium text-white"
        style={{ 
          backgroundColor: '#5a682f', 
          border: '1px solid rgba(255, 255, 255, 0.1)' 
        }}
      >
        <Fuel size={16} />
        FUEL
      </TabsTrigger>
      <TabsTrigger 
        value="manuals" 
        className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium text-white"
        style={{ 
          backgroundColor: '#3a4419', 
          border: '1px solid rgba(255, 255, 255, 0.1)' 
        }}
      >
        <FileText size={16} />
        MANUALS
      </TabsTrigger>
    </TabsList>
  );
};
