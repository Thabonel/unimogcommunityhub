import React from 'react';
import { SupabaseConnectionTest } from '@/components/debug/SupabaseConnectionTest';
import { EnvironmentStatus } from '@/components/debug/EnvironmentStatus';

const TestSupabase: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Supabase Connection Test</h1>
        <p className="text-muted-foreground">
          Test database connectivity and access permissions
        </p>
      </div>
      
      <EnvironmentStatus />
      <SupabaseConnectionTest />
    </div>
  );
};

export default TestSupabase;