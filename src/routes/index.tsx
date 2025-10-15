
import { createBrowserRouter, Outlet } from 'react-router-dom';
import { knowledgeRoutes } from './knowledgeRoutes';
import { adminRoutes } from './adminRoutes';
import { protectedRoutes } from './protectedRoutes';
import { publicRoutes } from './publicRoutes';
import { marketplaceRoutes } from './marketplaceRoutes';
import { Suspense } from 'react';
import Index from '@/pages/Index';
import About from '@/pages/About';
import NotFound from '@/pages/NotFound';
import Contact from '@/pages/Contact';
import Pricing from '@/pages/Pricing';
import Trips from '@/pages/Trips';
import Events from '@/pages/Events';
import EventDetail from '@/pages/EventDetail';
import VendorProfilePage from '@/pages/VendorProfilePage';
import Privacy from '@/pages/Privacy';
import Terms from '@/pages/Terms';
import Cookies from '@/pages/Cookies';
import ExploreRoutes from '@/pages/ExploreRoutes';
import ExploreMap from '@/pages/ExploreMap';
import SiteQALog from '@/pages/SiteQALog';
import SiteQALogSupabase from '@/pages/SiteQALogSupabase';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/react-query';
import { BarryWrapper } from '@/components/barry/BarryWrapper';
import { BarryProvider } from '@/contexts/BarryContext';

// Add this type definition for route configurations
export interface AppRouteObject {
  path: string;
  element: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  children?: AppRouteObject[];
}

// Create a loading component for suspense fallback
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

// Create a root layout component
// NOTE: AuthProvider is already in App.tsx - don't wrap twice to avoid race conditions
const RootLayout = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BarryProvider>
        <Suspense fallback={<LoadingSpinner />}>
          <Outlet />
          <BarryWrapper />
        </Suspense>
      </BarryProvider>
    </QueryClientProvider>
  );
};

// Create the router with the root route explicitly defined
export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <Index />
      },
      {
        path: '/about',
        element: <About />
      },
      {
        path: '/contact',
        element: <Contact />
      },
      {
        path: '/pricing',
        element: <Pricing />
      },
      {
        path: '/privacy',
        element: <Privacy />
      },
      {
        path: '/terms',
        element: <Terms />
      },
      {
        path: '/cookies',
        element: <Cookies />
      },
      {
        path: '/trips',
        element: <Trips />
      },
      {
        path: '/events',
        element: <Events />
      },
      {
        path: '/events/:eventId',
        element: <EventDetail />
      },
      {
        path: '/vendors/:slug',
        element: <VendorProfilePage />
      },
      {
        path: '/explore-routes',
        element: <ExploreRoutes />
      },
      {
        path: '/explore-map',
        element: <ExploreMap />
      },
      {
        path: '/qa',
        element: <SiteQALogSupabase />
      },
      {
        path: '/qa-local',
        element: <SiteQALog />
      },
      ...knowledgeRoutes,
      ...adminRoutes,
      ...protectedRoutes,
      ...publicRoutes,
      ...marketplaceRoutes,
      {
        path: '*',
        element: <NotFound />
      }
    ]
  }
]);

export default router;
