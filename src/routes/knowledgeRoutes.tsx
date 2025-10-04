
import React, { Suspense } from 'react';
import { lazyWithRetry, lazyImportWithRetry } from '@/utils/lazyWithRetry';
import { FEATURES } from '@/config/features';

// Create a loading component for suspense fallback
const RouteLoading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

// Error boundary for chunk loading failures
class ChunkErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    // Check for chunk loading errors
    if (
      error?.message?.includes("Unexpected token '<'") ||
      error?.message?.includes('Failed to fetch') ||
      error?.message?.includes('Loading chunk')
    ) {
      console.error('Chunk loading error in Knowledge routes, reloading...', error);
      // Clear caches and reload
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => caches.delete(name));
        });
      }
      setTimeout(() => window.location.reload(), 100);
    }
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p>Loading updated content...</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Wrap lazy loaded components with Suspense and error boundary
const SuspenseWrapper = ({ component: Component }: { component: React.ComponentType<any> }) => {
  return (
    <ChunkErrorBoundary>
      <Suspense fallback={<RouteLoading />}>
        <Component />
      </Suspense>
    </ChunkErrorBoundary>
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
