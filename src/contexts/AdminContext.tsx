
import React, { createContext, useContext, useState, ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a query client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

type AdminContextType = {
  currentSection: string;
  setCurrentSection: (section: string) => void;
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [currentSection, setCurrentSection] = useState<string>("dashboard");

  return (
    <QueryClientProvider client={queryClient}>
      <AdminContext.Provider value={{ currentSection, setCurrentSection }}>
        {children}
      </AdminContext.Provider>
    </QueryClientProvider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
