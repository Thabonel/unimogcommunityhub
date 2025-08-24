
import { lazy, Suspense } from "react";
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
import Layout from "@/components/Layout";
import { lazyImport } from "@/utils/lazyImport";

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      <p className="mt-4 text-muted-foreground">Loading...</p>
    </div>
  </div>
);

// Lazy loaded components with retry logic
const LazyProfileSetup = lazy(() => import("@/pages/ProfileSetup"));
const LazyVehicleShowcase = lazy(() => 
  import("@/pages/VehicleShowcase").catch(() => {
    // Fallback if chunk fails to load
    window.location.reload();
    return { default: () => <div>Loading vehicle showcase...</div> };
  })
);
const LazyVehicleDetail = lazy(() => 
  import("@/pages/VehicleDetail").catch(() => {
    // Fallback if chunk fails to load
    window.location.reload();
    return { default: () => <div>Loading vehicle details...</div> };
  })
);
const { AccountSettings } = lazyImport(() => import("@/components/marketplace/auth/AccountSettings"), "AccountSettings");

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
        <Suspense fallback={<LoadingFallback />}>
          <LazyProfileSetup />
        </Suspense>
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
        <Suspense fallback={<LoadingFallback />}>
          <LazyVehicleShowcase />
        </Suspense>
      </ProtectedRoute>
    ),
    requireAuth: true,
  },
  {
    path: "/community/members/:userId/vehicle/:vehicleId",
    element: (
      <ProtectedRoute>
        <Suspense fallback={<LoadingFallback />}>
          <LazyVehicleDetail />
        </Suspense>
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
  {
    path: "/account-settings",
    element: (
      <ProtectedRoute>
        <Layout isLoggedIn={true}>
          <AccountSettings />
        </Layout>
      </ProtectedRoute>
    ),
    requireAuth: true,
  },
];
