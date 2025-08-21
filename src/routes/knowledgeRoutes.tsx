
import React, { Suspense } from 'react';
import { lazyImport } from '@/utils/lazyImport';
import { lazyWithRetry } from '@/utils/lazyWithRetry';
import { FEATURES } from '@/config/features';

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

// Lazy load the main Knowledge page with retry logic for production stability
const Knowledge = lazyWithRetry(() => import('@/pages/Knowledge'));
const { default: KnowledgeManuals } = lazyImport(() => import('@/pages/KnowledgeManuals'), 'default');
const { default: CommunityArticlesPage } = lazyImport(() => import('@/pages/knowledge/CommunityArticlesPage'), 'default');
const { default: RepairPage } = lazyImport(() => import('@/pages/knowledge/RepairPage'), 'default');
const { default: MaintenancePage } = lazyImport(() => import('@/pages/knowledge/MaintenancePage'), 'default');
const { default: ModificationsPage } = lazyImport(() => import('@/pages/knowledge/ModificationsPage'), 'default');
const { default: TyresPage } = lazyImport(() => import('@/pages/knowledge/TyresPage'), 'default');
const { default: AdventuresPage } = lazyImport(() => import('@/pages/knowledge/AdventuresPage'), 'default');
const { default: BotpressAIPage } = lazyImport(() => import('@/pages/knowledge/BotpressAIPage'), 'default');
const { default: SafetyPage } = lazyImport(() => import('@/pages/knowledge/SafetyPage'), 'default');

// Conditionally import WIS System page
const WISSystemPage = FEATURES.WIS_ENABLED 
  ? lazyImport(() => import('@/pages/knowledge/WISSystemPage'), 'default').default
  : null;

// Export the routes as an array
export const knowledgeRoutes = [
  {
    path: "knowledge",
    element: <SuspenseWrapper component={Knowledge} />
  },
  {
    path: "knowledge/articles",
    element: <SuspenseWrapper component={CommunityArticlesPage} />
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
  },
  // Conditionally add WIS route only if feature is enabled
  ...(FEATURES.WIS_ENABLED && WISSystemPage ? [{
    path: "knowledge/wis",
    element: <SuspenseWrapper component={WISSystemPage} />
  }] : [])
];
