
import AdminDashboard from "@/pages/AdminDashboard";
import ProtectedRoute from "@/components/ProtectedRoute";
import TestSupabase from '@/pages/TestSupabase';
import DebugEnv from '@/pages/DebugEnv';
import { TestLogging } from '@/pages/TestLogging';
import { AppRouteObject } from "./index";

export const adminRoutes: AppRouteObject[] = [
  {
    path: "/admin",
    element: <ProtectedRoute requireAdmin={true}>
      <AdminDashboard />
    </ProtectedRoute>,
    requireAuth: true,
    requireAdmin: true,
  },
  {
    path: "/admin/test-supabase",
    element: <ProtectedRoute requireAdmin={true}>
      <TestSupabase />
    </ProtectedRoute>,
    requireAuth: true,
    requireAdmin: true,
  },
  {
    path: "/admin/debug-env",
    element: <ProtectedRoute requireAdmin={true}>
      <DebugEnv />
    </ProtectedRoute>,
    requireAuth: true,
    requireAdmin: true,
  },
  {
    path: "/admin/test-logging",
    element: <ProtectedRoute requireAdmin={true}>
      <TestLogging />
    </ProtectedRoute>,
    requireAuth: true,
    requireAdmin: true,
  },
];
