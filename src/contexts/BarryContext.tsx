import React, { createContext, useContext, useState, useCallback } from 'react';

interface BarryContextType {
  onWISAction?: (action: string, data?: any) => void;
  registerWISHandler: (handler: (action: string, data?: any) => void) => void;
  unregisterWISHandler: () => void;
}

const BarryContext = createContext<BarryContextType | undefined>(undefined);

export function BarryProvider({ children }: { children: React.ReactNode }) {
  const [wisHandler, setWisHandler] = useState<((action: string, data?: any) => void) | undefined>();

  const registerWISHandler = useCallback((handler: (action: string, data?: any) => void) => {
    console.log('🤖 Registering WIS handler for Barry');
    setWisHandler(() => handler);
  }, []);

  const unregisterWISHandler = useCallback(() => {
    console.log('🤖 Unregistering WIS handler for Barry');
    setWisHandler(undefined);
  }, []);

  return (
    <BarryContext.Provider
      value={{
        onWISAction: wisHandler,
        registerWISHandler,
        unregisterWISHandler,
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