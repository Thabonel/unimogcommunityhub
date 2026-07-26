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
  const lastResponseContentRef = React.useRef('');
  const isMobileRef = React.useRef(isMobile);

  React.useEffect(() => {
    isMobileRef.current = isMobile;
  }, [isMobile]);

  // Preload PDFs in background when Barry returns manual references
  usePdfPreloader(latestReferences);

  // Extract the most prominent numeric answer value from Barry's response
  // e.g. "400 Nm", "400 N.m", "400 N m" -> "400"
  function extractHighlightTerm(responseContent: string): string | undefined {
    if (!responseContent) return undefined;

    // Look for numeric values with units (Nm, N.m, N m, mm, litres, bar, kg, etc.)
    const unitPatterns = [
      /(\d{2,5})\s*N[\.\s]*m/gi,       // 400 Nm, 400 N.m, 400 N m
      /(\d{2,5})\s*ft[\.\s-]*lb/gi,    // 295 ft-lb
      /(\d{1,3}(?:\.\d+)?)\s*(?:litres?|liters?|L)\b/gi,  // 12.5 litres
      /(\d{2,5})\s*(?:bar|psi|kPa)\b/gi, // 350 bar
      /(\d{1,5})\s*mm\b/gi,            // 25 mm
      /(\d{1,5})\s*kg\b/gi,            // 500 kg
    ];

    for (const pattern of unitPatterns) {
      const matches = [...responseContent.matchAll(pattern)];
      if (matches.length > 0) {
        // Return the first numeric value found (most likely the direct answer)
        return matches[0][1];
      }
    }

    return undefined;
  }

  const handleCitationClick = React.useCallback((reference: ManualReference) => {
    if (!reference.storage_url) return;

    const tabId = `${reference.title}-${reference.pdf_page || reference.original_page}`;

    // Extract highlight term from Barry's last response
    const highlightTerm = extractHighlightTerm(lastResponseContentRef.current);

    const newTab: ManualTab = {
      id: tabId,
      manualTitle: reference.title,
      pageNumber: reference.pdf_page || reference.original_page,
      storageUrl: reference.storage_url?.split('#')[0] || reference.storage_url,
      searchHighlight: highlightTerm
    };

    setOpenPdfTabs(prev => {
      const existingTab = prev.find(tab => tab.id === tabId);
      if (!existingTab) return [...prev, newTab];
      if (!highlightTerm || existingTab.searchHighlight === highlightTerm) return prev;
      return prev.map(tab =>
        tab.id === tabId ? { ...tab, searchHighlight: highlightTerm } : tab
      );
    });
    setActiveTabId(tabId);

    if (isMobileRef.current) {
      setMobileActiveTab('manual');
    }
  }, []);

  const handleReferencesReceived = React.useCallback((references: ManualReference[]) => {
    setLatestReferences(references);

    const primaryReference = references.find(reference =>
      Boolean(reference.storage_url)
      && Number(reference.pdf_page || reference.original_page || reference.page_number) > 0
    );

    if (primaryReference) {
      handleCitationClick(primaryReference);
    }
  }, [handleCitationClick]);

  const handleResponseContent = React.useCallback((content: string) => {
    lastResponseContentRef.current = content;
  }, []);

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
              onReferencesReceived={handleReferencesReceived}
              onResponseContent={handleResponseContent}
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
            onReferencesReceived={handleReferencesReceived}
            onResponseContent={handleResponseContent}
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
