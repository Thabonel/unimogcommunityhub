
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Gauge, Calendar, FileText } from 'lucide-react';

interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const DashboardTabs = ({ activeTab, onTabChange }: DashboardTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="mb-8">
      <TabsList className="grid grid-cols-3 mb-8">
        <TabsTrigger value="overview" className="flex items-center gap-2">
          <Gauge size={16} />
          Overview
        </TabsTrigger>
        <TabsTrigger value="maintenance" className="flex items-center gap-2">
          <Calendar size={16} />
          Maintenance
        </TabsTrigger>
        <TabsTrigger value="manuals" className="flex items-center gap-2">
          <FileText size={16} />
          Manuals
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
