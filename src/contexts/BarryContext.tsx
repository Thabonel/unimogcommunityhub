import React, { createContext, useContext, useState, useCallback } from 'react';

interface PageContext {
  pageName: string;          // e.g., 'marketplace', 'trips', 'vehicle', 'knowledge', 'events', 'dashboard', 'home'
  pageTitle?: string;        // e.g., 'Marketplace - Parts for U1300L'
  relevantData?: Record<string, any>;  // page-specific data Barry can reference
}

interface BarryContextType {
  // KEEP all existing fields (onWISAction, registerWISHandler, unregisterWISHandler)
  onWISAction?: (action: string, data?: any) => void;
  registerWISHandler: (handler: (action: string, data?: any) => void) => void;
  unregisterWISHandler: () => void;
  // Page context:
  pageContext: PageContext | null;
  setPageContext: (context: PageContext) => void;
  clearPageContext: () => void;
  // Chat control:
  isBarryOpen: boolean;
  openBarry: (initialMessage?: string) => void;
  closeBarry: () => void;
  pendingMessage: string | null;
  clearPendingMessage: () => void;
}

const BarryContext = createContext<BarryContextType | undefined>(undefined);

export function BarryProvider({ children }: { children: React.ReactNode }) {
  const [wisHandler, setWisHandler] = useState<((action: string, data?: any) => void) | undefined>();
  const [pageContext, setPageContextState] = useState<PageContext | null>(null);
  const [isBarryOpen, setIsBarryOpen] = useState<boolean>(false);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);

  const registerWISHandler = useCallback((handler: (action: string, data?: any) => void) => {
    setWisHandler(() => handler);
  }, []);

  const unregisterWISHandler = useCallback(() => {
    setWisHandler(undefined);
  }, []);

  const setPageContext = useCallback((context: PageContext) => {
    setPageContextState(context);
  }, []);

  const clearPageContext = useCallback(() => {
    setPageContextState(null);
  }, []);

  const openBarry = useCallback((initialMessage?: string) => {
    setIsBarryOpen(true);
    if (initialMessage) {
      setPendingMessage(initialMessage);
    }
  }, []);

  const closeBarry = useCallback(() => {
    setIsBarryOpen(false);
    setPendingMessage(null);
  }, []);

  const clearPendingMessage = useCallback(() => {
    setPendingMessage(null);
  }, []);

  return (
    <BarryContext.Provider
      value={{
        onWISAction: wisHandler,
        registerWISHandler,
        unregisterWISHandler,
        pageContext,
        setPageContext,
        clearPageContext,
        isBarryOpen,
        openBarry,
        closeBarry,
        pendingMessage,
        clearPendingMessage,
      }}
    >
      {children}
    </BarryContext.Provider>
  );
}

// Add displayName for better debugging
BarryProvider.displayName = 'BarryProvider';

export function useBarry() {
  const context = useContext(BarryContext);
  if (context === undefined) {
    throw new Error('useBarry must be used within a BarryProvider');
  }
  return context;
}