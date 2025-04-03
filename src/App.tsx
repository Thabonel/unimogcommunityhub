
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import React from "react";
import { allRoutes, createRoutesFromConfig } from "./routes/index";

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
    <Router>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Routes>{createRoutesFromConfig(allRoutes)}</Routes>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </Router>
  );
};

export default App;
