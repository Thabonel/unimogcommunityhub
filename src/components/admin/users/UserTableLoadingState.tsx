
import { RefreshCw } from "lucide-react";

export function UserTableLoadingState() {
  return (
    <div className="flex justify-center items-center py-12">
      <RefreshCw className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
