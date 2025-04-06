import { lazy } from "react";
import { AppRouteObject } from "./index";
import Profile from "@/pages/Profile";
import Dashboard from "@/pages/Dashboard";
import Trips from "@/pages/Trips";
import ProtectedRoute from "@/components/ProtectedRoute";
import Messages from "@/pages/Messages";
import Community from "@/pages/Community";
import Settings from "@/pages/Settings";
import CommunityImprovement from "@/pages/CommunityImprovement";
import SubscriptionGuard from "@/components/SubscriptionGuard";

// Lazy loaded components
const LazyProfileSetup = lazy(() => import("@/pages/ProfileSetup"));
const LazyVehicleDashboard = lazy(() => import("@/pages/VehicleDashboard"));

export const protectedRoutes: AppRouteObject[] = [
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
    requireAuth: true,
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
    requireAuth: true,
  },
  {
    path: "/profile/setup",
    element: (
      <ProtectedRoute>
        <LazyProfileSetup />
      </ProtectedRoute>
    ),
    requireAuth: true,
  },
  {
    path: "/vehicle-dashboard",
    element: (
      <ProtectedRoute>
        <LazyVehicleDashboard />
      </ProtectedRoute>
    ),
    requireAuth: true,
  },
  {
    path: "/trips",
    element: <Trips />, // No ProtectedRoute wrapper to allow all users to view the map
  },
  {
    path: "/messages",
    element: (
      <ProtectedRoute>
        <SubscriptionGuard>
          <Messages />
        </SubscriptionGuard>
      </ProtectedRoute>
    ),
    requireAuth: true,
  },
  {
    path: "/community",
    element: (
      <ProtectedRoute>
        <Community />
      </ProtectedRoute>
    ),
    requireAuth: true,
  },
  {
    path: "/community/improvement",
    element: (
      <ProtectedRoute requireAdmin>
        <CommunityImprovement />
      </ProtectedRoute>
    ),
    requireAuth: true,
    requireAdmin: true,
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    ),
    requireAuth: true,
  },
];
