
import { lazy } from 'react';
import { Route, RouteObject } from 'react-router-dom';
import { publicRoutes } from './publicRoutes';
import { protectedRoutes } from './protectedRoutes';
import { knowledgeRoutes } from './knowledgeRoutes';
import { adminRoutes } from './adminRoutes';
import { marketplaceRoutes } from './marketplaceRoutes';
import ProtectedRoute from '@/components/ProtectedRoute';

// Custom types for our route configuration
export type AppRouteObject = {
  path: string;
  element: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  children?: AppRouteObject[];
};

// Function to convert standard RouteObjects to our AppRouteObjects
export const convertToAppRoutes = (routes: RouteObject[]): AppRouteObject[] => {
  return routes.filter(route => route.path !== undefined).map(route => ({
    path: route.path!,
    element: route.element,
    children: route.children ? convertToAppRoutes(route.children) : undefined,
  })) as AppRouteObject[];
};

// Function to convert our route objects to React Router's Route elements
export const createRoutesFromConfig = (routes: AppRouteObject[]): React.ReactNode => {
  return routes.map((route) => {
    // If route requires authentication
    if (route.requireAuth) {
      return (
        <Route 
          key={route.path} 
          path={route.path} 
          element={
            <ProtectedRoute requireAdmin={route.requireAdmin}>
              {route.element}
            </ProtectedRoute>
          }
        >
          {route.children && createRoutesFromConfig(route.children)}
        </Route>
      );
    }
    
    // Regular route
    return (
      <Route 
        key={route.path} 
        path={route.path} 
        element={route.element}
      >
        {route.children && createRoutesFromConfig(route.children)}
      </Route>
    );
  });
};

// Combine all routes
export const allRoutes = [
  ...protectedRoutes,
  ...knowledgeRoutes,
  ...adminRoutes,
  ...marketplaceRoutes
];
