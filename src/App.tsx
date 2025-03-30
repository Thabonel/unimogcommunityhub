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
                
                {/* Admin Dashboard */}
                <Route path="/admin" element={
                  <ProtectedRoute>
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
