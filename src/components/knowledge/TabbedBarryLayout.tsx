import React, { useState } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EnhancedBarryChat } from './EnhancedBarryChat';
import { TabbedPdfViewer, ManualTab } from './TabbedPdfViewer';
import { ManualReference } from '@/hooks/use-simple-barry';
import { usePdfPreloader } from '@/hooks/use-pdf-preloader';
import { useMobile } from '@/hooks/use-mobile';
import { MessageSquare, FileText } from 'lucide-react';

interface TabbedBarryLayoutProps {
  className?: string;
  location?: { latitude: number; longitude: number };
  userModel?: string | null;
}

export function TabbedBarryLayout({ className, location, userModel }: TabbedBarryLayoutProps) {
  const [openPdfTabs, setOpenPdfTabs] = useState<ManualTab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string>('');
  const [latestReferences, setLatestReferences] = useState<ManualReference[]>([]);
  const [mobileActiveTab, setMobileActiveTab] = useState<'chat' | 'manual'>('chat');
  const { isMobile } = useMobile();

  // Preload PDFs in background when Barry returns manual references
  usePdfPreloader(latestReferences);

  const handleCitationClick = (reference: ManualReference) => {
    // Generate unique tab ID
    const tabId = `${reference.title}-${reference.pdf_page || reference.original_page}`;

    // Check if tab already exists
    const existingTab = openPdfTabs.find(tab => tab.id === tabId);
    if (existingTab) {
      // Tab exists, just switch to it
      setActiveTabId(tabId);
      // On mobile, switch to manual tab when citation is clicked
      if (isMobile) {
        setMobileActiveTab('manual');
      }
      return;
    }

    // Create new tab
    const newTab: ManualTab = {
      id: tabId,
      manualTitle: reference.title,
      pageNumber: reference.pdf_page || reference.original_page,
      storageUrl: reference.storage_url?.split('#')[0] || reference.storage_url // Remove #page= fragment for viewer
    };

    // Add tab and switch to it
    setOpenPdfTabs(prev => [...prev, newTab]);
    setActiveTabId(tabId);

    // On mobile, switch to manual tab when citation is clicked
    if (isMobile) {
      setMobileActiveTab('manual');
    }
  };

  const handleCloseTab = (tabId: string) => {
    setOpenPdfTabs(prev => prev.filter(tab => tab.id !== tabId));
    // Active tab will be updated by TabbedPdfViewer
  };

  const handleTabChange = (tabId: string) => {
    setActiveTabId(tabId);
  };

  // Mobile layout - tabs for Chat and Manual
  if (isMobile) {
    return (
      <div className={`h-full flex flex-col ${className || ''}`}>
        <Tabs value={mobileActiveTab} onValueChange={(v) => setMobileActiveTab(v as 'chat' | 'manual')} className="flex flex-col h-full">
          <TabsList className="grid grid-cols-2 mx-2 mt-2 shrink-0">
            <TabsTrigger value="chat" className="flex items-center gap-2 text-xs sm:text-sm">
              <MessageSquare className="h-4 w-4" />
              <span>Ask Barry</span>
            </TabsTrigger>
            <TabsTrigger value="manual" className="flex items-center gap-2 text-xs sm:text-sm">
              <FileText className="h-4 w-4" />
              <span>Manuals {openPdfTabs.length > 0 && `(${openPdfTabs.length})`}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="flex-1 m-0 mt-2 overflow-hidden">
            <EnhancedBarryChat
              location={location}
              userModel={userModel}
              onCitationClick={handleCitationClick}
              onReferencesReceived={setLatestReferences}
              className="h-full"
            />
          </TabsContent>

          <TabsContent value="manual" className="flex-1 m-0 mt-2 overflow-hidden">
            <TabbedPdfViewer
              openTabs={openPdfTabs}
              activeTabId={activeTabId}
              onTabChange={handleTabChange}
              onCloseTab={handleCloseTab}
            />
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // Desktop layout - resizable panels
  return (
    <div className={`h-full ${className || ''}`}>
      <ResizablePanelGroup direction="horizontal" className="h-full">
        {/* Barry Chat Panel - 30% */}
        <ResizablePanel
          defaultSize={30}
          minSize={25}
          maxSize={40}
          className="flex flex-col"
        >
          <EnhancedBarryChat
            location={location}
            userModel={userModel}
            onCitationClick={handleCitationClick}
            onReferencesReceived={setLatestReferences}
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* PDF Viewer Panel - 70% */}
        <ResizablePanel
          defaultSize={70}
          minSize={60}
          className="flex flex-col"
        >
          <TabbedPdfViewer
            openTabs={openPdfTabs}
            activeTabId={activeTabId}
            onTabChange={handleTabChange}
            onCloseTab={handleCloseTab}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
