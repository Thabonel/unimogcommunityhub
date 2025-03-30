
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import React from "react";
import { allRoutes, createRoutesFromConfig } from "./routes";

const App = () => {
  // Create a new QueryClient instance with proper config
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <React.StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Routes>
                {createRoutesFromConfig(allRoutes)}
              </Routes>
            </TooltipProvider>
          </QueryClientProvider>
        </AuthProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
};

export default App;
