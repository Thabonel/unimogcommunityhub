
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Wrench, Ruler, BookOpen } from 'lucide-react';
import { SpecificationsTab } from './SpecificationsTab';
import { CommonIssuesTab } from './CommonIssuesTab';
import { DimensionsTab } from './DimensionsTab';
import { ManualsTab } from './ManualsTab';

interface UnimogTabsProps {
  militarySpecs: { label: string; value: string }[];
  commonIssues: { title: string; description: string }[];
  searchQuery: string;
}

export const UnimogTabs = ({ militarySpecs, commonIssues, searchQuery }: UnimogTabsProps) => {
  return (
    <Tabs defaultValue="specifications" className="w-full">
      <TabsList className="grid grid-cols-4 mb-6">
        <TabsTrigger value="specifications" className="flex items-center gap-2">
          <FileText size={16} />
          <span className="hidden sm:inline">Specifications</span>
        </TabsTrigger>
        <TabsTrigger value="common-issues" className="flex items-center gap-2">
          <Wrench size={16} />
          <span className="hidden sm:inline">Common Issues</span>
        </TabsTrigger>
        <TabsTrigger value="dimensions" className="flex items-center gap-2">
          <Ruler size={16} />
          <span className="hidden sm:inline">Dimensions</span>
        </TabsTrigger>
        <TabsTrigger value="manuals" className="flex items-center gap-2">
          <BookOpen size={16} />
          <span className="hidden sm:inline">Manuals</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="specifications">
        <SpecificationsTab specifications={militarySpecs} searchQuery={searchQuery} />
      </TabsContent>
      
      <TabsContent value="common-issues">
        <CommonIssuesTab issues={commonIssues} searchQuery={searchQuery} />
      </TabsContent>
      
      <TabsContent value="dimensions">
        <DimensionsTab />
      </TabsContent>
      
      <TabsContent value="manuals">
        <ManualsTab />
      </TabsContent>
    </Tabs>
  );
};
