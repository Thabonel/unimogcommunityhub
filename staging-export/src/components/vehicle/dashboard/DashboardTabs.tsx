
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Gauge, Calendar, FileText, Fuel } from 'lucide-react';

interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const DashboardTabs = ({ activeTab, onTabChange }: DashboardTabsProps) => {
  return (
    <TabsList className="grid grid-cols-4 mb-8">
      <TabsTrigger 
        value="overview" 
        className="flex items-center justify-center gap-2 py-3 bg-brown-700 text-white font-medium rounded-t-lg"
        style={{ backgroundColor: activeTab === 'overview' ? '#7d6245' : '#7d6245', opacity: activeTab === 'overview' ? 1 : 0.85 }}
      >
        <Gauge size={16} />
        OVERVIEW
      </TabsTrigger>
      <TabsTrigger 
        value="maintenance" 
        className="flex items-center justify-center gap-2 py-3 bg-olive-700 text-white font-medium rounded-t-lg"
        style={{ backgroundColor: activeTab === 'maintenance' ? '#4c571f' : '#4c571f', opacity: activeTab === 'maintenance' ? 1 : 0.85 }}
      >
        <Calendar size={16} />
        MAINTENANCE
      </TabsTrigger>
      <TabsTrigger 
        value="fuel" 
        className="flex items-center justify-center gap-2 py-3 bg-olive-600 text-white font-medium rounded-t-lg"
        style={{ backgroundColor: activeTab === 'fuel' ? '#5a682f' : '#5a682f', opacity: activeTab === 'fuel' ? 1 : 0.85 }}
      >
        <Fuel size={16} />
        FUEL
      </TabsTrigger>
      <TabsTrigger 
        value="manuals" 
        className="flex items-center justify-center gap-2 py-3 bg-olive-900 text-white font-medium rounded-t-lg"
        style={{ backgroundColor: activeTab === 'manuals' ? '#3a4419' : '#3a4419', opacity: activeTab === 'manuals' ? 1 : 0.85 }}
      >
        <FileText size={16} />
        MANUALS
      </TabsTrigger>
    </TabsList>
  );
};
