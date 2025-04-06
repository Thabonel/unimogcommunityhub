
import { lazy } from "react";
import { AppRouteObject } from "./index";
import Knowledge from "@/pages/Knowledge";
import KnowledgeManuals from "@/pages/KnowledgeManuals";
import ProtectedRoute from "@/components/ProtectedRoute";

// Use correct type annotation for lazy loaded components
const LazyManualAdminView = lazy(() => import("@/components/knowledge/AdminManualView").then(module => ({ default: module as any })));
const LazyManualUserView = lazy(() => import("@/components/knowledge/UserManualView").then(module => ({ default: module as any })));

export const knowledgeRoutes: AppRouteObject[] = [
  {
    path: "/knowledge",
    element: <Knowledge />,
  },
  {
    path: "/knowledge/manuals",
    element: <KnowledgeManuals />,
  },
  {
    path: "/knowledge/manuals/:manualId",
    element: (
      <ProtectedRoute>
        <LazyManualUserView />
      </ProtectedRoute>
    ),
    requireAuth: true,
  },
  {
    path: "/knowledge/manuals/:manualId/admin",
    element: (
      <ProtectedRoute requireAdmin>
        <LazyManualAdminView />
      </ProtectedRoute>
    ),
    requireAuth: true,
    requireAdmin: true,
  },
];
