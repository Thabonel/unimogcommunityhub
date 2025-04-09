
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet
} from 'react-router-dom';
import { Toaster } from 'sonner';

import { ThemeProvider } from "./components/theme-provider";
import { ReactQueryProvider } from './lib/react-query';

// Import the pages we have available or create placeholders
import Layout from './components/Layout';
import NotFound from './pages/NotFound';
import Trips from './pages/Trips';
import TravelPlanner from './pages/TravelPlanner';
import ExploreRoutes from './pages/ExploreRoutes';
import HomePage from './pages/Home';
import MapPage from './pages/Map';
import AuthPage from './pages/Auth';
import ProfilePage from './pages/Profile';
import KnowledgeHub from './pages/KnowledgeHub';
import MessagesPage from './pages/Messages';
import MarketplaceListingsPage from './pages/MarketplaceListings';
import ListingDetailPage from './pages/ListingDetail';
import CommunityFeed from './pages/Community';

// Import admin components
import { AdminLayout } from './components/admin/AdminLayout';
import AnalyticsDashboard from './components/admin/AnalyticsDashboard';
import ArticlesManagement from './components/admin/ArticlesManagement';
import UsersManagement from './components/admin/UsersManagement';
import SiteConfiguration from './components/admin/SiteConfiguration';

import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <ReactQueryProvider>
        <ThemeProvider defaultTheme="system" enableSystem>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/trips" element={<Trips />} />
            <Route path="/travel-planner" element={<TravelPlanner />} />
            <Route path="/explore-routes" element={<ExploreRoutes />} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute children={<Outlet />} />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/knowledge" element={<KnowledgeHub />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/marketplace" element={<MarketplaceListingsPage />} />
              <Route path="/marketplace/:id" element={<ListingDetailPage />} />
              <Route path="/community" element={<CommunityFeed />} />
            </Route>
            
            {/* Admin routes */}
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin children={<AdminLayout>
                <Outlet />
              </AdminLayout>} />
            }>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AnalyticsDashboard />} />
              <Route path="articles" element={<ArticlesManagement />} />
              <Route path="users" element={<UsersManagement />} />
              <Route path="config" element={<SiteConfiguration />} />
            </Route>
            
            {/* Error pages */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </ReactQueryProvider>
    </Router>
  );
}

export default App;
