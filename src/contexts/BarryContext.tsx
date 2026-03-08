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
  // ADD:
  pageContext: PageContext | null;
  setPageContext: (context: PageContext) => void;
  clearPageContext: () => void;
}

const BarryContext = createContext<BarryContextType | undefined>(undefined);

export function BarryProvider({ children }: { children: React.ReactNode }) {
  const [wisHandler, setWisHandler] = useState<((action: string, data?: any) => void) | undefined>();
  const [pageContext, setPageContextState] = useState<PageContext | null>(null);

  const registerWISHandler = useCallback((handler: (action: string, data?: any) => void) => {
    console.log('🤖 Registering WIS handler for Barry');
    setWisHandler(() => handler);
  }, []);

  const unregisterWISHandler = useCallback(() => {
    console.log('🤖 Unregistering WIS handler for Barry');
    setWisHandler(undefined);
  }, []);

  const setPageContext = useCallback((context: PageContext) => {
    console.log('🤖 Setting Barry page context:', context);
    setPageContextState(context);
  }, []);

  const clearPageContext = useCallback(() => {
    console.log('🤖 Clearing Barry page context');
    setPageContextState(null);
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