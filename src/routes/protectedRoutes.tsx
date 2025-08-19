
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
import VehicleDashboard from "@/pages/VehicleDashboard";
import Resources from "@/pages/Resources";
import MyListings from "@/pages/MyListings";

// Lazy loaded components
const LazyProfileSetup = lazy(() => import("@/pages/ProfileSetup"));
const LazyVehicleShowcase = lazy(() => import("@/pages/VehicleShowcase"));
const LazyVehicleDetail = lazy(() => import("@/pages/VehicleDetail"));

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
        <VehicleDashboard />
      </ProtectedRoute>
    ),
    requireAuth: true,
  },
  {
    path: "/trips",
    element: (
      <SubscriptionGuard allowTrial={true}>
        <Trips />
      </SubscriptionGuard>
    ),
    requireAuth: true,
  },
  {
    path: "/messages",
    element: (
      <ProtectedRoute>
        <SubscriptionGuard allowTrial={true}>
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
    path: "/community/members",
    element: (
      <ProtectedRoute>
        <LazyVehicleShowcase />
      </ProtectedRoute>
    ),
    requireAuth: true,
  },
  {
    path: "/community/members/:userId/vehicle/:vehicleId",
    element: (
      <ProtectedRoute>
        <LazyVehicleDetail />
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
    path: "/resources",
    element: (
      <ProtectedRoute>
        <Resources />
      </ProtectedRoute>
    ),
    requireAuth: true,
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
  {
    path: "/my-listings",
    element: (
      <ProtectedRoute>
        <MyListings />
      </ProtectedRoute>
    ),
    requireAuth: true,
  },
];
