
import AdminDashboard from "@/pages/AdminDashboard";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AppRouteObject } from "./index";

export const adminRoutes: AppRouteObject[] = [
  {
    path: "/admin",
    element: <AdminDashboard />,
    requireAuth: true,
    requireAdmin: true,
  },
];

