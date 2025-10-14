import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, X } from 'lucide-react';

export function UpdateNotification() {
  const [showUpdate, setShowUpdate] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const handleUpdateAvailable = () => {
      setShowUpdate(true);
    };

    window.addEventListener('app-update-available', handleUpdateAvailable);

    return () => {
      window.removeEventListener('app-update-available', handleUpdateAvailable);
    };
  }, []);

  const handleUpdate = () => {
    setIsUpdating(true);
    // Clear only app-specific caches, preserve fonts AND version tracking
    const keysToKeep = [
      'font-display',
      'google-fonts',
      'app-build-version',      // Preserve version tracking to prevent infinite loop
      'userCountry',            // Preserve user preferences
      'userCurrency'
    ];

    const localStorageKeys = Object.keys(localStorage);
    localStorageKeys.forEach(key => {
      if (!keysToKeep.some(keepKey => key.includes(keepKey))) {
        localStorage.removeItem(key);
      }
    });

    // Preserve version-update-shown flag to prevent infinite loop
    const updateShown = sessionStorage.getItem('version-update-shown');
    sessionStorage.clear();
    if (updateShown) {
      sessionStorage.setItem('version-update-shown', updateShown);
    }

    // Reload after a brief delay
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const handleDismiss = () => {
    setShowUpdate(false);
    // Don't show again in this session
    sessionStorage.setItem('update-notification-dismissed', 'true');
  };

  if (!showUpdate) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className="bg-background border border-border rounded-lg shadow-lg p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="font-semibold text-sm mb-1">Update Available</h3>
            <p className="text-xs text-muted-foreground mb-3">
              A new version of the app is available. Refresh to get the latest features and improvements.
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleUpdate}
                disabled={isUpdating}
                className="gap-2"
              >
                {isUpdating ? (
                  <>
                    <RefreshCw className="h-3 w-3 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-3 w-3" />
                    Update Now
                  </>
                )}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDismiss}
                disabled={isUpdating}
              >
                Later
              </Button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-muted-foreground hover:text-foreground transition-colors"
            disabled={isUpdating}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}