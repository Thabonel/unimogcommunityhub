
import { useToast } from "@/hooks/use-toast";

interface ErrorHandlerOptions {
  context?: string;
  showToast?: boolean;
  logToConsole?: boolean;
  retry?: () => Promise<void>;
  fallback?: () => void;
}

export function useErrorHandler() {
  const { toast } = useToast();
  
  const handleError = (
    error: unknown, 
    options: ErrorHandlerOptions = {
      context: "Operation",
      showToast: true,
      logToConsole: true
    }
  ) => {
    const { context, showToast, logToConsole, retry, fallback } = options;
    
    // Extract error message
    let message = "An unexpected error occurred";
    let code: string | number | undefined;
    
    if (error instanceof Error) {
      message = error.message;
      code = (error as any).code || (error as any).statusCode;
    } else if (typeof error === "string") {
      message = error;
    } else if (error && typeof error === "object") {
      if ("message" in error) {
        message = String(error.message);
      }
      if ("code" in error) {
        code = error.code as string | number;
      } else if ("statusCode" in error) {
        code = error.statusCode as string | number;
      }
    }
    
    // Show toast if enabled
    if (showToast) {
      const toastActions = [];
      
      if (retry) {
        toastActions.push({
          label: "Retry",
          onClick: retry
        });
      }
      
      if (fallback) {
        toastActions.push({
          label: "Alternative",
          onClick: fallback
        });
      }
      
      toast({
        title: `${context} Failed`,
        description: message,
        variant: "destructive",
        action: toastActions.length > 0 ? toastActions[0] : undefined
      });
    }
    
    // Log to console if enabled
    if (logToConsole) {
      console.error(`[${context}] Error:`, {
        message,
        code,
        originalError: error
      });
    }
    
    // Track error metrics (would connect to error monitoring service in production)
    try {
      // Simple error tracking within Supabase
      const { user } = (window as any).authContext || {};
      
      if (user?.id) {
        fetch('/api/track-error', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            context,
            message,
            code,
            url: window.location.href,
            timestamp: new Date().toISOString()
          })
        }).catch(e => console.log('Error tracking failed', e));
      }
    } catch (trackingError) {
      // Fail silently to not disrupt the main flow
      console.log('Error tracking failed:', trackingError);
    }
    
    return message;
  };
  
  return { handleError };
}
