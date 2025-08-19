
import { ReactNode } from "react";
import { Shield } from "lucide-react";
import { AdminProvider } from "@/contexts/AdminContext";

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
}

export function AdminLayout({ children, title = "Admin Dashboard" }: AdminLayoutProps) {
  return (
    <AdminProvider>
      <div className="container py-8">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        </div>
        {children}
      </div>
    </AdminProvider>
  );
}
