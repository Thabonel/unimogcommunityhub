
import React, { Suspense } from 'react';
import { lazyImport } from '@/utils/lazyImport';

// Create a loading component for suspense fallback
const RouteLoading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

// Wrap lazy loaded components with Suspense
const SuspenseWrapper = ({ component: Component }: { component: React.ComponentType<any> }) => {
  return (
    <Suspense fallback={<RouteLoading />}>
      <Component />
    </Suspense>
  );
};

// Lazy load all components
const { default: Knowledge } = lazyImport(() => import('@/pages/Knowledge'), 'default');
const { default: KnowledgeManuals } = lazyImport(() => import('@/pages/KnowledgeManuals'), 'default');
const { default: RepairPage } = lazyImport(() => import('@/pages/knowledge/RepairPage'), 'default');
const { default: MaintenancePage } = lazyImport(() => import('@/pages/knowledge/MaintenancePage'), 'default');
const { default: ModificationsPage } = lazyImport(() => import('@/pages/knowledge/ModificationsPage'), 'default');
const { default: TyresPage } = lazyImport(() => import('@/pages/knowledge/TyresPage'), 'default');
const { default: AdventuresPage } = lazyImport(() => import('@/pages/knowledge/AdventuresPage'), 'default');
const { default: BotpressAIPage } = lazyImport(() => import('@/pages/knowledge/BotpressAIPage'), 'default');
const { default: SafetyPage } = lazyImport(() => import('@/pages/knowledge/SafetyPage'), 'default');

// Export the routes as an array
export const knowledgeRoutes = [
  {
    path: "knowledge",
    element: <SuspenseWrapper component={Knowledge} />
  },
  {
    path: "knowledge/manuals",
    element: <SuspenseWrapper component={KnowledgeManuals} />
  },
  {
    path: "knowledge/repair",
    element: <SuspenseWrapper component={RepairPage} />
  },
  {
    path: "knowledge/maintenance",
    element: <SuspenseWrapper component={MaintenancePage} />
  },
  {
    path: "knowledge/modifications",
    element: <SuspenseWrapper component={ModificationsPage} />
  },
  {
    path: "knowledge/tyres",
    element: <SuspenseWrapper component={TyresPage} />
  },
  {
    path: "knowledge/adventures",
    element: <SuspenseWrapper component={AdventuresPage} />
  },
  {
    path: "knowledge/ai-mechanic",
    element: <SuspenseWrapper component={BotpressAIPage} />
  },
  {
    path: "knowledge/safety",
    element: <SuspenseWrapper component={SafetyPage} />
  }
];
