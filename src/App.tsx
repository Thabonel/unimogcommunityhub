
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProfileSetup from "./pages/ProfileSetup";
import Dashboard from "./pages/Dashboard";
import UnimogU1700L from "./pages/UnimogU1700L";
import Knowledge from "./pages/Knowledge";
import NotFound from "./pages/NotFound";

// Create route for other sections that don't exist yet
import Marketplace from "./pages/Marketplace";
import Trips from "./pages/Trips";
import Community from "./pages/Community";
import Messages from "./pages/Messages";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile-setup" element={<ProfileSetup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/unimog-u1700l" element={<UnimogU1700L />} />
          <Route path="/knowledge" element={<Knowledge />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="/community" element={<Community />} />
          <Route path="/messages" element={<Messages />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
