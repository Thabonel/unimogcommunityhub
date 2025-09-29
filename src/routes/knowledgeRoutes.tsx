
import React, { Suspense } from 'react';
import { lazyWithRetry, lazyImportWithRetry } from '@/utils/lazyWithRetry';
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

// Lazy load all knowledge pages with retry logic for production stability
const Knowledge = lazyWithRetry(() => import('@/pages/Knowledge'));
const { default: KnowledgeManuals } = lazyImportWithRetry(() => import('@/pages/KnowledgeManuals'), 'default');
const { default: CommunityRecommendationsPage } = lazyImportWithRetry(() => import('@/pages/knowledge/CommunityRecommendationsPage'), 'default');
const { default: SafetyPage } = lazyImportWithRetry(() => import('@/pages/knowledge/SafetyPage'), 'default');
const { default: CommunityDocumentLibraryPage } = lazyImportWithRetry(() => import('@/pages/community/CommunityDocumentLibraryPage'), 'default');

// Import WIS System page with retry
const { default: WISSystemPage } = lazyImportWithRetry(() => import('@/pages/knowledge/WISSystemPage'), 'default');


// Import WIS diagnostics page
const WISDiagnostics = lazyImportWithRetry(() => import('@/pages/WISDiagnostics'), 'default').default;

// Import simplified Barry Assistant page
const { default: BarryAssistant } = lazyImportWithRetry(() => import('@/pages/BarryAssistant'), 'default');

// Export the routes as an array
export const knowledgeRoutes = [
  {
    path: "knowledge",
    element: <SuspenseWrapper component={Knowledge} />
  },
  {
    path: "knowledge/recommendations",
    element: <SuspenseWrapper component={CommunityRecommendationsPage} />
  },
  {
    path: "knowledge/manuals",
    element: <SuspenseWrapper component={KnowledgeManuals} />
  },
  {
    path: "knowledge/barry",
    element: <SuspenseWrapper component={BarryAssistant} />
  },
  {
    path: "knowledge/safety",
    element: <SuspenseWrapper component={SafetyPage} />
  },
  {
    path: "knowledge/documents",
    element: <SuspenseWrapper component={CommunityDocumentLibraryPage} />
  },
  // Conditionally add WIS route only if feature is enabled
  ...(FEATURES.WIS_ENABLED ? [{
    path: "knowledge/wis",
    element: <SuspenseWrapper component={WISSystemPage} />
  }] : []),
  // WIS Diagnostics (temporary for debugging)
  {
    path: "wis-diagnostics",
    element: <SuspenseWrapper component={WISDiagnostics} />
  }
];
