
import Knowledge from "@/pages/Knowledge";
import KnowledgeManuals from "@/pages/KnowledgeManuals";
import { ArticleView } from "@/components/knowledge/ArticleView";
import MaintenancePage from "@/pages/knowledge/MaintenancePage";
import TyresPage from "@/pages/knowledge/TyresPage";
import RepairPage from "@/pages/knowledge/RepairPage";
import AdventuresPage from "@/pages/knowledge/AdventuresPage";
import ModificationsPage from "@/pages/knowledge/ModificationsPage";
import { AppRouteObject } from "./index";

export const knowledgeRoutes: AppRouteObject[] = [
  {
    path: "/knowledge",
    element: <Knowledge />,
    requireAuth: true,
  },
  {
    path: "/knowledge/article/:id",
    element: <ArticleView />,
    requireAuth: true,
  },
  {
    path: "/knowledge/manuals",
    element: <KnowledgeManuals />,
    requireAuth: true,
  },
  {
    path: "/knowledge/maintenance",
    element: <MaintenancePage />,
    requireAuth: true,
  },
  {
    path: "/knowledge/tyres",
    element: <TyresPage />,
    requireAuth: true,
  },
  {
    path: "/knowledge/repair",
    element: <RepairPage />,
    requireAuth: true,
  },
  {
    path: "/knowledge/adventures",
    element: <AdventuresPage />,
    requireAuth: true,
  },
  {
    path: "/knowledge/modifications",
    element: <ModificationsPage />,
    requireAuth: true,
  },
];
