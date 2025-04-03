
import { Loader2 } from "lucide-react";

export function UserTableLoadingState() {
  return (
    <div className="flex flex-col justify-center items-center py-12 space-y-4">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="text-muted-foreground">Loading user data...</p>
    </div>
  );
}
