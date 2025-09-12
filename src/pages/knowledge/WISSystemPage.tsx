import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Settings, Wrench, Package, AlertCircle, Bot } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/profile';
import { WISMercedesInterface } from '@/components/wis/WISMercedesInterface';

const WISSystemPage = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { userData } = useProfile();
  const [barryContext, setBarryContext] = useState(null);

  // Handle Barry requests
  const handleBarryRequest = (query: string) => {
    // This would normally integrate with the existing Barry chat system
    // For now, we'll simulate Barry's response
    console.log('Barry request:', query);
    // In production, this would trigger the Barry chat bubble
  };

  // Build user object for Layout
  const layoutUser = userData ? {
    name: userData.name || user?.email?.split('@')[0] || 'User',
    avatarUrl: (userData.useVehiclePhotoAsProfile && userData.vehiclePhotoUrl) 
      ? userData.vehiclePhotoUrl 
      : userData.avatarUrl,
    unimogModel: userData.unimogModel || '',
    vehiclePhotoUrl: userData.vehiclePhotoUrl || '',
    useVehiclePhotoAsProfile: userData.useVehiclePhotoAsProfile || false
  } : undefined;

  return (
    <Layout isLoggedIn={!!user} user={layoutUser}>
      <div className="container py-8">
        {/* Back to Knowledge Base */}
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

        {/* Compact WIS Info Section */}
        <div className="mb-8 bg-gradient-to-r from-military-green to-olive-drab text-white rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Mercedes-Benz WIS Workshop System</h1>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>4,875 Documents</span>
            </div>
            <div>🎬 10,345 Media Files</div>
            <div>🎯 Task-Centric Design</div>
            <div>🔍 Predictive Search</div>
          </div>
          
          <p className="text-white/90 mb-4 text-sm">
            Professional workshop information system with predictive search and complete procedure packs. 
            Simply describe what you're fixing, and get everything you need assembled in one place.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white/10 rounded p-3">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Wrench className="w-4 h-4" />
              </div>
              <div className="text-xl font-bold">850</div>
              <div className="text-xs text-white/80">Repair Procedures</div>
            </div>
            <div className="bg-white/10 rounded p-3">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Package className="w-4 h-4" />
              </div>
              <div className="text-xl font-bold">3,900</div>
              <div className="text-xs text-white/80">Parts & Components</div>
            </div>
            <div className="bg-white/10 rounded p-3">
              <div className="flex items-center justify-center gap-2 mb-1">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div className="text-xl font-bold">125</div>
              <div className="text-xs text-white/80">Service Bulletins</div>
            </div>
            <div className="bg-white/10 rounded p-3">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Bot className="w-4 h-4" />
              </div>
              <div className="text-xl font-bold">Barry</div>
              <div className="text-xs text-white/80">AI Assistant</div>
            </div>
          </div>
        </div>

        {/* Mercedes WIS Interface */}
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <WISMercedesInterface 
            barryContext={barryContext}
            onBarryRequest={handleBarryRequest}
          />
        </div>
      </div>
    </Layout>
  );
};

export default WISSystemPage;