import React from 'react';
import Layout from '@/components/Layout';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ImageExtractionPanel } from '@/components/admin/ImageExtractionPanel';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminStatus } from '@/hooks/use-admin-status';
import { AdminProvider } from '@/contexts/AdminContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

const ImageExtractionPage = () => {
  const { user } = useAuth();
  const { isAdmin, isLoading, error } = useAdminStatus(user);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center py-10">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Checking admin access...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return (
      <Layout>
        <div className="flex justify-center py-10">
          <Alert className="max-w-md">
            <AlertDescription>
              Access denied. You need admin privileges to access the Image Extraction Panel.
            </AlertDescription>
          </Alert>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <AdminLayout>
        <AdminProvider initialSection="image-extraction">
          <div className="space-y-6">
            <div className="border-b">
              <h1 className="text-2xl font-bold mb-4">Manual Image Extraction</h1>
              <p className="text-muted-foreground mb-6">
                Extract technical diagrams and schematics from PDF manuals for Barry AI visual assistance.
              </p>
            </div>
            <ImageExtractionPanel />
          </div>
        </AdminProvider>
      </AdminLayout>
    </Layout>
  );
};

export default ImageExtractionPage;