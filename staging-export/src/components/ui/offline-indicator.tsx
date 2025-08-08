import { WifiOff, Wifi, RefreshCw } from "lucide-react";
import { useOffline } from "@/hooks/use-offline";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface OfflineIndicatorProps {
  className?: string;
  showWhenOnline?: boolean;
}

/**
 * Visual indicator for offline status
 */
export function OfflineIndicator({ className, showWhenOnline = false }: OfflineIndicatorProps) {
  const { isOffline, wasOffline } = useOffline();
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    if (!isOffline && wasOffline) {
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isOffline, wasOffline]);

  if (!isOffline && !showReconnected && !showWhenOnline) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed bottom-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg transition-all duration-300",
        isOffline ? "bg-amber-500 text-white" : "bg-green-500 text-white",
        className
      )}
      role="status"
      aria-live="polite"
    >
      {isOffline ? (
        <>
          <WifiOff className="h-4 w-4" />
          <span className="text-sm font-medium">Offline Mode</span>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 px-2 text-white hover:bg-amber-600"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Retry
          </Button>
        </>
      ) : (
        <>
          <Wifi className="h-4 w-4" />
          <span className="text-sm font-medium">
            {showReconnected ? "Back Online!" : "Online"}
          </span>
        </>
      )}
    </div>
  );
}

/**
 * Banner style offline indicator
 */
export function OfflineBanner({ className }: { className?: string }) {
  const { isOffline } = useOffline();

  if (!isOffline) return null;

  return (
    <div
      className={cn(
        "w-full bg-amber-500 text-white py-2 px-4 text-center text-sm",
        className
      )}
    >
      <WifiOff className="inline-block h-4 w-4 mr-2" />
      You're currently offline. Some features may be limited.
    </div>
  );
}