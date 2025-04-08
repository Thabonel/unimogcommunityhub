
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './react-query';

interface ReactQueryProviderProps {
  children: React.ReactNode;
}

export const ReactQueryProvider: React.FC<ReactQueryProviderProps> = ({ 
  children 
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};
