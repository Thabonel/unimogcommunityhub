
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import { Toaster } from 'sonner';

import { ThemeProvider } from "./components/theme-provider"
import { ReactQueryProvider } from './lib/react-query';

// Import the pages we have available or create placeholders
import Layout from './components/Layout';
import NotFound from './pages/NotFound';
import Trips from './pages/Trips';
import TravelPlanner from './pages/TravelPlanner';
import ExploreRoutes from './pages/ExploreRoutes';

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
            <Route path="/" element={<Layout children={<div>Home Page</div>} />} />
            <Route path="/map" element={<Layout children={<div>Map Page</div>} />} />
            <Route path="/auth" element={<Layout children={<div>Auth Page</div>} />} />
            <Route path="/trips" element={<Trips />} />
            <Route path="/travel-planner" element={<TravelPlanner />} />
            <Route path="/explore-routes" element={<ExploreRoutes />} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute children={<Outlet />} />}>
              <Route path="/profile" element={<div>Profile Page</div>} />
              <Route path="/knowledge" element={<div>Knowledge Hub</div>} />
              <Route path="/messages" element={<div>Messages Page</div>} />
              <Route path="/marketplace" element={<div>Marketplace Listings</div>} />
              <Route path="/marketplace/:id" element={<div>Listing Detail</div>} />
              <Route path="/community" element={<div>Community Feed</div>} />
            </Route>
            
            {/* Admin routes */}
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin children={<AdminLayout />} />
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
