
import AdminDashboard from "@/pages/AdminDashboard";
import ProtectedRoute from "@/components/ProtectedRoute";
import TestSupabase from '@/pages/TestSupabase';
import DebugEnv from '@/pages/DebugEnv';
import { TestLogging } from '@/pages/TestLogging';
import { ManualProcessingPage } from '@/pages/admin/ManualProcessingPage';
import { AdminSetupPage } from '@/pages/admin/AdminSetupPage';
import SystemDiagnostics from '@/pages/SystemDiagnostics';
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
  {
    path: "/admin/manual-processing",
    element: <ProtectedRoute requireAdmin={true}>
      <ManualProcessingPage />
    </ProtectedRoute>,
    requireAuth: true,
    requireAdmin: true,
  },
  {
    path: "/admin/setup",
    element: <ProtectedRoute requireAuth={true}>
      <AdminSetupPage />
    </ProtectedRoute>,
    requireAuth: true,
  },
  {
    path: "/diagnostics",
    element: <ProtectedRoute requireAdmin={true}>
      <SystemDiagnostics />
    </ProtectedRoute>,
    requireAuth: true,
    requireAdmin: true,
  },
];
