import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  isChunkError: boolean;
  error: Error | null;
}

class ChunkErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      isChunkError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Check if this is a chunk loading error
    const isChunkError = 
      error.message?.includes('Loading chunk') ||
      error.message?.includes('module script') ||
      error.message?.includes('Failed to import') ||
      error.message?.includes('Failed to fetch dynamically imported module') ||
      error.message?.includes('MIME type') ||
      error.message?.includes('dynamically imported') ||
      error.stack?.includes('chunk') ||
      error.stack?.includes('import()');

    console.error('ChunkErrorBoundary caught error:', error);

    return {
      hasError: true,
      isChunkError,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ChunkErrorBoundary - Component stack:', errorInfo.componentStack);
    
    // If it's a chunk error, try to recover automatically
    if (this.state.isChunkError) {
      this.handleChunkError();
    }
  }

  handleChunkError = () => {
    console.log('Handling chunk loading error - clearing app caches and reloading...');
    
    try {
      // Clear app-specific storage but preserve some font/asset caches
      const keysToKeep = ['font-display', 'google-fonts'];
      
      // Clear localStorage except font-related keys
      const localStorageKeys = Object.keys(localStorage);
      localStorageKeys.forEach(key => {
        if (!keysToKeep.some(keepKey => key.includes(keepKey))) {
          localStorage.removeItem(key);
        }
      });
      
      // Always clear session storage (temporary)
      sessionStorage.clear();
      
      // Selectively clear service worker caches
      if ('caches' in window) {
        caches.keys().then(cacheNames => {
          cacheNames.forEach(cacheName => {
            // Don't clear font caches or Google Fonts cache
            if (!cacheName.includes('font') && !cacheName.includes('google')) {
              caches.delete(cacheName);
            }
          });
        });
      }

      // Force reload after a brief delay
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (clearError) {
      console.error('Error clearing caches:', clearError);
      // Fallback: just reload without clearing
      window.location.reload();
    }
  };

  handleManualReload = () => {
    this.handleChunkError();
  };

  render() {
    if (this.state.hasError) {
      if (this.state.isChunkError) {
        return (
          <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="max-w-md w-full text-center space-y-4">
              <AlertTriangle className="h-16 w-16 text-destructive mx-auto" />
              <h1 className="text-2xl font-bold text-foreground">
                Updating Application...
              </h1>
              <p className="text-muted-foreground">
                The application is loading the latest version. This should only take a moment.
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Clearing cache and reloading...</span>
              </div>
              <Button 
                onClick={this.handleManualReload}
                variant="outline"
                className="mt-4"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reload Now
              </Button>
            </div>
          </div>
        );
      }

      // Non-chunk errors - show generic error boundary
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-md w-full text-center space-y-4">
            <AlertTriangle className="h-16 w-16 text-destructive mx-auto" />
            <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
            <p className="text-muted-foreground">
              An unexpected error occurred. Please try reloading the page.
            </p>
            <Button onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reload Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ChunkErrorBoundary;