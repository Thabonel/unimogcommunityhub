
import { useToast } from "@/hooks/use-toast";

interface ErrorHandlerOptions {
  context?: string;
  showToast?: boolean;
  logToConsole?: boolean;
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
    const { context, showToast, logToConsole } = options;
    
    // Extract error message
    let message = "An unexpected error occurred";
    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === "string") {
      message = error;
    } else if (error && typeof error === "object" && "message" in error) {
      message = String(error.message);
    }
    
    // Show toast if enabled
    if (showToast) {
      toast({
        title: `${context} Failed`,
        description: message,
        variant: "destructive",
      });
    }
    
    // Log to console if enabled
    if (logToConsole) {
      console.error(`[${context}] Error:`, error);
    }
    
    return message;
  };
  
  return { handleError };
}
