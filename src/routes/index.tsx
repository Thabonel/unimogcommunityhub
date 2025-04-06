
import { createBrowserRouter, Outlet } from 'react-router-dom';
import { knowledgeRoutes } from './knowledgeRoutes';
import { adminRoutes } from './adminRoutes';
import { protectedRoutes } from './protectedRoutes';
import { publicRoutes } from './publicRoutes';
import { marketplaceRoutes } from './marketplaceRoutes';
import Index from '@/pages/Index';
import About from '@/pages/About';
import NotFound from '@/pages/NotFound';
import Contact from '@/pages/Contact';
import Pricing from '@/pages/Pricing';
import Trips from '@/pages/Trips';
import ExploreRoutes from '@/pages/ExploreRoutes';
import ExploreMap from '@/pages/ExploreMap';
import { AuthProvider } from '@/contexts/AuthContext';

// Add this type definition for route configurations
export interface AppRouteObject {
  path: string;
  element: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  children?: AppRouteObject[];
}

// Create a root layout component that wraps everything with AuthProvider
const RootLayout = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
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
        path: '/trips',
        element: <Trips />
      },
      {
        path: '/explore-routes',
        element: <ExploreRoutes />
      },
      {
        path: '/explore-map',
        element: <ExploreMap />
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
