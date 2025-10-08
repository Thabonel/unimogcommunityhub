import React, { useState } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { EnhancedBarryChat } from './EnhancedBarryChat';
import { TabbedPdfViewer, PdfTab } from './TabbedPdfViewer';
import { ManualReference } from '@/hooks/use-simple-barry';

interface TabbedBarryLayoutProps {
  className?: string;
  location?: { latitude: number; longitude: number };
  userModel?: string | null;
}

export function TabbedBarryLayout({ className, location, userModel }: TabbedBarryLayoutProps) {
  const [openPdfTabs, setOpenPdfTabs] = useState<PdfTab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string>('');

  const handleCitationClick = (reference: ManualReference) => {
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
    const newTab: PdfTab = {
      id: tabId,
      manualTitle: reference.title,
      pageNumber: reference.pdf_page || reference.original_page,
      storageUrl: reference.storage_url
    };

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
