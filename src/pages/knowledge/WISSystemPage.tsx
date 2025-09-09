import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { WISTaskCentricInterface } from '@/components/wis/WISTaskCentricInterface';

const WISSystemPage = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  return (
    <Layout>
      <div className="container mx-auto p-4">
        {/* Header with back button */}
        <div className="mb-6">
          <Button
            onClick={() => navigate('/knowledge')}
            variant="outline"
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Knowledge Base
          </Button>
        </div>

        {/* Task-Centric WIS Interface */}
        <WISTaskCentricInterface modelBias="U435" />

        {/* Footer Note for non-authenticated users */}
        {!user && (
          <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800 text-center">
              Sign in to access the full WIS system with personalized vehicle selection and usage tracking.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default WISSystemPage;