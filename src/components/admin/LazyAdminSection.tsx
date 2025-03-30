
import { Suspense, lazy, ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface LazyAdminSectionProps {
  section: string;
  currentSection: string;
  fallback?: ReactNode;
}

export function LazyAdminSection({ 
  section, 
  currentSection,
  fallback = <AdminSectionLoader />
}: LazyAdminSectionProps) {
  // Only render the section if it's currently active
  if (section !== currentSection) {
    return null;
  }

  return (
    <Suspense fallback={fallback}>
      {/* Content will be rendered here */}
      <div className="space-y-4">
        <slot />
      </div>
    </Suspense>
  );
}

function AdminSectionLoader() {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="text-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Loading section...</p>
      </div>
    </div>
  );
}
