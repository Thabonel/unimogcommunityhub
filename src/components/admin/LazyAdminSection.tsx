
import { Suspense, lazy, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { lazyImport } from "@/utils/lazyImport";

interface LazyAdminSectionProps {
  section: string;
  currentSection: string;
  fallback?: ReactNode;
  children?: ReactNode;
}

export function LazyAdminSection({ 
  section, 
  currentSection,
  fallback = <AdminSectionLoader />,
  children
}: LazyAdminSectionProps) {
  // Only render the section if it's currently active
  if (section !== currentSection) {
    return null;
  }

  return (
    <Suspense fallback={fallback}>
      <div className="space-y-4">
        {children}
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
