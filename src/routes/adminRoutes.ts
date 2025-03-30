
import AdminDashboard from "@/pages/AdminDashboard";
import { AppRouteObject } from "./index";

export const adminRoutes: AppRouteObject[] = [
  {
    path: "/admin",
    element: <AdminDashboard />,
    requireAuth: true,
    requireAdmin: true,
  },
];
