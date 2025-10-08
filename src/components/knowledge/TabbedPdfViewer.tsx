import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { X, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SimplePdfScrollViewer } from './SimplePdfScrollViewer';
import { cn } from '@/lib/utils';

export interface PdfTab {
  id: string;
  manualTitle: string;
  pageNumber: number;
  storageUrl: string;
}

interface TabbedPdfViewerProps {
  openTabs: PdfTab[];
  activeTabId?: string;
  onTabChange?: (tabId: string) => void;
  onCloseTab: (tabId: string) => void;
  className?: string;
}

export function TabbedPdfViewer({
  openTabs,
  activeTabId,
  onTabChange,
  onCloseTab,
  className = ''
}: TabbedPdfViewerProps) {
  const [activeTab, setActiveTab] = React.useState<string>(activeTabId || openTabs[0]?.id || '');

  // Update active tab when prop changes or new tabs open
  React.useEffect(() => {
    if (activeTabId) {
      setActiveTab(activeTabId);
    } else if (openTabs.length > 0 && !openTabs.find(tab => tab.id === activeTab)) {
      // If current active tab was closed, switch to last tab
      setActiveTab(openTabs[openTabs.length - 1].id);
    }
  }, [activeTabId, openTabs, activeTab]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    onTabChange?.(value);
  };

  const handleCloseTab = (tabId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent tab switch when closing
    onCloseTab(tabId);
  };

  if (openTabs.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center h-full bg-gray-50 p-8", className)}>
        <FileText className="h-16 w-16 text-muted-foreground mb-4" />
        <p className="text-lg font-medium text-muted-foreground mb-2">
          No manuals open
        </p>
        <p className="text-sm text-muted-foreground text-center max-w-md">
          Click on manual citations from Barry's responses to view PDFs here
        </p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <Tabs value={activeTab} onValueChange={handleTabChange} className="flex flex-col h-full">
        {/* Tab List - Fixed at top */}
        <TabsList className="w-full justify-start rounded-none border-b flex-shrink-0 overflow-x-auto">
          {openTabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="relative pr-8 max-w-[200px] truncate"
            >
              <span className="truncate">
                {tab.manualTitle} p.{tab.pageNumber}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 h-4 w-4 p-0 hover:bg-transparent"
                onClick={(e) => handleCloseTab(tab.id, e)}
              >
                <X className="h-3 w-3" />
              </Button>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Tab Content - Scrollable PDF viewer */}
        {openTabs.map((tab) => (
          <TabsContent
            key={tab.id}
            value={tab.id}
            className="flex-1 m-0 overflow-hidden"
          >
            <SimplePdfScrollViewer
              pdfUrl={tab.storageUrl}
              initialPage={tab.pageNumber}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
