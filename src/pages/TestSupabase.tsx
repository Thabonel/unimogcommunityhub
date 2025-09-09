import React from 'react';
import { SupabaseConnectionTest } from '@/components/debug/SupabaseConnectionTest';
import { EnvironmentStatus } from '@/components/debug/EnvironmentStatus';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';

const TestSupabase: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <Layout isLoggedIn={!!user}>
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Admin: Supabase Connection Test</h1>
          <p className="text-muted-foreground">
            Test database connectivity and access permissions
          </p>
        </div>
        
        <EnvironmentStatus />
        <SupabaseConnectionTest />
      </div>
    </Layout>
  );
};

export default TestSupabase;