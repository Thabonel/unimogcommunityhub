import React, { useState } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { EnhancedBarryChat } from './EnhancedBarryChat';
import { TabbedPdfViewer, ManualTab } from './TabbedPdfViewer';
import { ManualReference } from '@/hooks/use-simple-barry';
import { usePdfPreloader } from '@/hooks/use-pdf-preloader';

interface TabbedBarryLayoutProps {
  className?: string;
  location?: { latitude: number; longitude: number };
  userModel?: string | null;
}

export function TabbedBarryLayout({ className, location, userModel }: TabbedBarryLayoutProps) {
  const [openPdfTabs, setOpenPdfTabs] = useState<ManualTab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string>('');
  const [latestReferences, setLatestReferences] = useState<ManualReference[]>([]);

  // Preload PDFs in background when Barry returns manual references
  usePdfPreloader(latestReferences);

  const handleCitationClick = (reference: ManualReference) => {
    console.log('[TabbedBarryLayout] Citation clicked:', reference);

    // Generate unique tab ID
    const tabId = `${reference.title}-${reference.pdf_page || reference.original_page}`;

    // Check if tab already exists
    const existingTab = openPdfTabs.find(tab => tab.id === tabId);
    if (existingTab) {
      // Tab exists, just switch to it
      setActiveTabId(tabId);
      return;
    }

    // Create new tab
    const newTab: ManualTab = {
      id: tabId,
      manualTitle: reference.title,
      pageNumber: reference.pdf_page || reference.original_page,
      storageUrl: reference.storage_url?.split('#')[0] || reference.storage_url // Remove #page= fragment for viewer
    };

    console.log('[TabbedBarryLayout] Created tab:', newTab);

    // Add tab and switch to it
    setOpenPdfTabs(prev => [...prev, newTab]);
    setActiveTabId(tabId);
  };

  const handleCloseTab = (tabId: string) => {
    setOpenPdfTabs(prev => prev.filter(tab => tab.id !== tabId));
    // Active tab will be updated by TabbedPdfViewer
  };

  const handleTabChange = (tabId: string) => {
    setActiveTabId(tabId);
  };

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
