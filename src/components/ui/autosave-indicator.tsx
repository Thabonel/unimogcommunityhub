import { CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAutosaveStatus } from "@/hooks/use-autosave";

interface AutosaveIndicatorProps {
  lastSaved: Date | null;
  isSaving: boolean;
  error?: Error | null;
  className?: string;
}

/**
 * Visual indicator for autosave status
 */
export function AutosaveIndicator({
  lastSaved,
  isSaving,
  error,
  className,
}: AutosaveIndicatorProps) {
  const statusText = useAutosaveStatus(lastSaved, isSaving);

  if (!isSaving && !lastSaved && !error) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex items-center gap-2 text-sm",
        className
      )}
      role="status"
      aria-live="polite"
    >
      {isSaving && (
        <>
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          <span className="text-muted-foreground">Saving...</span>
        </>
      )}
      
      {!isSaving && error && (
        <>
          <AlertCircle className="h-4 w-4 text-destructive" />
          <span className="text-destructive">Save failed</span>
        </>
      )}
      
      {!isSaving && !error && lastSaved && (
        <>
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span className="text-muted-foreground">{statusText}</span>
        </>
      )}
    </div>
  );
}