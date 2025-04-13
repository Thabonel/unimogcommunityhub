
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
      <TabsTrigger value="overview" className="flex items-center gap-2">
        <Gauge size={16} />
        Overview
      </TabsTrigger>
      <TabsTrigger value="maintenance" className="flex items-center gap-2">
        <Calendar size={16} />
        Maintenance
      </TabsTrigger>
      <TabsTrigger value="fuel" className="flex items-center gap-2">
        <Fuel size={16} />
        Fuel
      </TabsTrigger>
      <TabsTrigger value="manuals" className="flex items-center gap-2">
        <FileText size={16} />
        Manuals
      </TabsTrigger>
    </TabsList>
  );
};
