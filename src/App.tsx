import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import React from "react";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AuthCallback from "./pages/AuthCallback";
import ProfileSetup from "./pages/ProfileSetup";
import Dashboard from "./pages/Dashboard";
import UnimogU1700L from "./pages/UnimogU1700L";
import Knowledge from "./pages/Knowledge";
import KnowledgeManuals from "./pages/KnowledgeManuals";
import { ArticleView } from "./components/knowledge/ArticleView";
import NotFound from "./pages/NotFound";

// Knowledge section pages
import MaintenancePage from "./pages/knowledge/MaintenancePage";
import TyresPage from "./pages/knowledge/TyresPage";
import RepairPage from "./pages/knowledge/RepairPage";
import AdventuresPage from "./pages/knowledge/AdventuresPage";
import ModificationsPage from "./pages/knowledge/ModificationsPage";

// New pages for previously 404 links
import About from "./pages/About";
import Contact from "./pages/Contact";
import Pricing from "./pages/Pricing";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Cookies from "./pages/Cookies";
import Careers from "./pages/Careers";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

// Create route for other sections that don't exist yet
import Marketplace from "./pages/Marketplace";
import Trips from "./pages/Trips";
import Community from "./pages/Community";
import Messages from "./pages/Messages";
import AdminDashboard from "./pages/AdminDashboard";

const App = () => {
  // Create a new QueryClient instance inside the component
  const queryClient = new QueryClient();

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                
                {/* New public information pages */}
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/cookies" element={<Cookies />} />
                <Route path="/careers" element={<Careers />} />
                
                {/* Protected routes */}
                <Route path="/profile-setup" element={
                  <ProtectedRoute>
                    <ProfileSetup />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/unimog-u1700l" element={
                  <ProtectedRoute>
                    <UnimogU1700L />
                  </ProtectedRoute>
                } />
                
                {/* User account pages */}
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } />
                
                {/* Admin Dashboard - requires admin role */}
                <Route path="/admin" element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                
                {/* Knowledge routes */}
                <Route path="/knowledge" element={
                  <ProtectedRoute>
                    <Knowledge />
                  </ProtectedRoute>
                } />
                <Route path="/knowledge/article/:id" element={
                  <ProtectedRoute>
                    <ArticleView />
                  </ProtectedRoute>
                } />
                <Route path="/knowledge/manuals" element={
                  <ProtectedRoute>
                    <KnowledgeManuals />
                  </ProtectedRoute>
                } />
                <Route path="/knowledge/maintenance" element={
                  <ProtectedRoute>
                    <MaintenancePage />
                  </ProtectedRoute>
                } />
                <Route path="/knowledge/tyres" element={
                  <ProtectedRoute>
                    <TyresPage />
                  </ProtectedRoute>
                } />
                <Route path="/knowledge/repair" element={
                  <ProtectedRoute>
                    <RepairPage />
                  </ProtectedRoute>
                } />
                <Route path="/knowledge/adventures" element={
                  <ProtectedRoute>
                    <AdventuresPage />
                  </ProtectedRoute>
                } />
                <Route path="/knowledge/modifications" element={
                  <ProtectedRoute>
                    <ModificationsPage />
                  </ProtectedRoute>
                } />
                
                <Route path="/marketplace" element={
                  <ProtectedRoute>
                    <Marketplace />
                  </ProtectedRoute>
                } />
                <Route path="/trips" element={
                  <ProtectedRoute>
                    <Trips />
                  </ProtectedRoute>
                } />
                
                <Route path="/community" element={
                  <ProtectedRoute>
                    <Community />
                  </ProtectedRoute>
                } />
                
                <Route path="/messages" element={
                  <ProtectedRoute>
                    <Messages />
                  </ProtectedRoute>
                } />
                
                {/* 404 route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
