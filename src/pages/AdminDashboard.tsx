
import { Suspense, useEffect } from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminNavigation } from "@/components/admin/AdminNavigation";
import { Loader2 } from "lucide-react";
import { lazy } from "react";
import { useAdminStatus } from "@/hooks/use-admin-status";
import { useToast } from "@/hooks/use-toast";

// Lazy load admin components
const AnalyticsDashboard = lazy(() => import("@/components/admin/AnalyticsDashboard"));
const ArticlesManagement = lazy(() => import("@/components/admin/ArticlesManagement"));
const UsersManagement = lazy(() => import("@/components/admin/UsersManagement"));
const SiteConfiguration = lazy(() => import("@/components/admin/SiteConfiguration"));

// Define admin tabs
const adminTabs = [
  { id: "analytics", label: "Analytics" },
  { id: "articles", label: "Articles" },
  { id: "users", label: "Users" },
  { id: "settings", label: "Settings" }
];

const AdminDashboard = () => {
  const { user } = useAuth();
  const { isAdmin, isLoading, error } = useAdminStatus(user);
  const { toast } = useToast();
  
  useEffect(() => {
    console.log("Admin Dashboard rendered", { 
      user, 
      isAdmin, 
      isLoading, 
      hasError: !!error 
    });
    
    if (error) {
      toast({
        title: "Admin status check error",
        description: "There was an issue verifying admin status. Using backup verification.",
        variant: "destructive",
      });
    }
  }, [user, isAdmin, isLoading, error, toast]);

  return (
    <Layout>
      <AdminLayout>
        <AdminNavigation tabs={adminTabs} />
        
        {/* Use Tabs from UI library with suspense for lazy loading */}
        <Tabs defaultValue="analytics" className="space-y-4">
          <TabsContent value="analytics" className="space-y-4">
            <Suspense fallback={<LoadingState />}>
              <AnalyticsDashboard />
            </Suspense>
          </TabsContent>
          
          <TabsContent value="articles" className="space-y-4">
            <Suspense fallback={<LoadingState />}>
              <ArticlesManagement />
            </Suspense>
          </TabsContent>
          
          <TabsContent value="users" className="space-y-4">
            <Suspense fallback={<LoadingState />}>
              <UsersManagement />
            </Suspense>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <Suspense fallback={<LoadingState />}>
              <SiteConfiguration />
            </Suspense>
          </TabsContent>
        </Tabs>
      </AdminLayout>
    </Layout>
  );
};

const LoadingState = () => (
  <div className="flex justify-center py-10">
    <div className="text-center">
      <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
      <p className="text-muted-foreground">Loading section...</p>
    </div>
  </div>
);

export default AdminDashboard;
