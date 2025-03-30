
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import ArticlesManagement from "@/components/admin/ArticlesManagement";
import UsersManagement from "@/components/admin/UsersManagement";
import SiteConfiguration from "@/components/admin/SiteConfiguration";
import { Shield, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a query client for React Query
const queryClient = new QueryClient();

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("articles");
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        // Check if the user has admin role using the has_role function
        const { data, error } = await supabase.rpc("has_role", {
          _role: "admin",
        });

        if (error) {
          console.error("Error checking admin status:", error);
          toast({
            title: "Authentication Error",
            description: "Could not verify admin privileges. Please try again.",
            variant: "destructive",
          });
          setIsAdmin(false);
        } else {
          setIsAdmin(!!data);
          
          // If not admin, redirect to dashboard
          if (!data) {
            toast({
              title: "Access Denied",
              description: "You don't have permission to access the admin dashboard.",
              variant: "destructive",
            });
            navigate("/dashboard");
          }
        }
      } catch (err) {
        console.error("Error in admin check:", err);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [user, navigate, toast]);

  if (isLoading) {
    return (
      <Layout>
        <div className="container flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold">Verifying admin privileges...</h2>
            <p className="text-muted-foreground mt-2">Please wait while we confirm your access.</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }

  return (
    <Layout>
      <QueryClientProvider client={queryClient}>
        <div className="container py-8">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full md:w-auto grid-cols-3">
              <TabsTrigger value="articles">Articles Management</TabsTrigger>
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="settings">Site Configuration</TabsTrigger>
            </TabsList>
            <TabsContent value="articles" className="space-y-4">
              <ArticlesManagement />
            </TabsContent>
            <TabsContent value="users" className="space-y-4">
              <UsersManagement />
            </TabsContent>
            <TabsContent value="settings" className="space-y-4">
              <SiteConfiguration />
            </TabsContent>
          </Tabs>
        </div>
      </QueryClientProvider>
    </Layout>
  );
};

export default AdminDashboard;
