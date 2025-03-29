
import { Button } from "@/components/ui/button";
import { FileText, Upload } from "lucide-react";

interface EmptyManualStateProps {
  onSubmitClick: () => void;
}

export function EmptyManualState({ onSubmitClick }: EmptyManualStateProps) {
  return (
    <div className="text-center py-10 bg-muted/20 rounded-lg border border-dashed">
      <FileText size={48} className="mx-auto text-muted-foreground/50 mb-4" />
      <h3 className="text-lg font-medium mb-2">No manuals available yet</h3>
      <p className="text-muted-foreground mb-4">Be the first to contribute a manual to the Unimog community.</p>
      <Button onClick={onSubmitClick} className="gap-2">
        <Upload size={16} />
        Submit a Manual
      </Button>
    </div>
  );
}
