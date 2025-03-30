
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import ArticlesManagement from "@/components/admin/ArticlesManagement";
import UsersManagement from "@/components/admin/UsersManagement";
import SiteConfiguration from "@/components/admin/SiteConfiguration";
import { Shield } from "lucide-react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("articles");
  const { user } = useAuth();
  const navigate = useNavigate();

  // In a real app, we would check if the user has admin privileges
  // For now, we'll use a placeholder check
  const isAdmin = true; // This would be replaced with a real admin check

  if (!isAdmin) {
    navigate("/dashboard");
    return null;
  }

  return (
    <Layout>
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
    </Layout>
  );
};

export default AdminDashboard;
